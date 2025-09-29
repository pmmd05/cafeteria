// Centraliza el manejo de errores de toda la app.
// 1) Construye respuesta uniforme: { error: { code, message } }
// 2) Inserta un registro en error_logs con contexto útil (JSONB)
const pool = require('../db/pool');

module.exports = async (err, req, res, next) => {
    const status = Number(err.status || err.statusCode || 500);
    try {
        await pool.query(
            `INSERT INTO error_logs(method, path, status_code, message, stack, ip, user_agent, body,
            params, query)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10::jsonb)`,
        [
            req.method, // GET/POST/PUT/DELETE
            req.originalUrl || req.url, // Ruta pedida
            status, // Código de respuesta
            err.message || 'Unexpected error', // Mensaje de error
            process.env.NODE_ENV === 'production' ? null : err.stack, // Stack opcional
            req.ip, // IP cliente
            req.headers['user-agent'] || null, // Agente de usuario
            JSON.stringify(req.body || {}), // Body como JSONB
            JSON.stringify(req.params || {}), // Params de ruta
            JSON.stringify(req.query || {}) // Querystring
        ]
    );
} catch (logErr) {
    // Si no se puede guardar el error, lo reportamos en consola y seguimos
    console.error('No se pudo guardar el error en DB:', logErr.message);
}
    // Respuesta estandarizada al cliente
    res.status(status).json({ error: { code: status, message: err.message || 'Error' } });
};