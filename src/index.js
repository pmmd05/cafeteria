// Punto de entrada: inicia DB y levanta servidor HTTP
require('dotenv').config();
const app = require('./app');
const { initDb } = require('./db/init');

const port = Number(process.env.PORT || 3000);

(async () => {
    await initDb(); // Crea/siembra tablas si faltan (schema + seed)
    app.listen(port, () => {
        console.log(`API en http://localhost:${port}`);
    });
})();
