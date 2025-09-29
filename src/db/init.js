// Lee y ejecuta schema.sql + seed.sql al arrancar la API
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function initDb() {
    // Rutas absolutas a los archivos SQL dentro del proyecto
    const schema = fs.readFileSync(path.join(__dirname, '../../db/schema.sql'), 'utf8');
    const seed = fs.readFileSync(path.join(__dirname, '../../db/seed.sql'), 'utf8');
    // Ejecutamos en dos pasos: primero estructura, luego datos
    await pool.query(schema);
    await pool.query(seed);
    console.log('DB inicializada (schema + seed).');
}
module.exports = { initDb };