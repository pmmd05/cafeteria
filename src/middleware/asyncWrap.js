// Envuelve un controlador async y propaga errores a next(err)
// Evita escribir try/catch en cada endpoint
module.exports = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);