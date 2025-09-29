// Crea un pool de conexiones a PostgreSQL usando la URL del .env
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL //ostgresql://user:pass@host:port/db
});
// Si el pool tiene un error (ej. conexión cortada), lo registramos en consola
pool.on('error', (err) => console.error('PG Pool error:', err));
module.exports = pool; // Exportamos una única instancia para reusar