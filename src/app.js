// Configuración de Express: JSON, rutas y manejo de errores
const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const menuRoutes = require('./routes/menu');

const app = express();

app.use(express.json()); // Parsear JSON del body
app.use('/api', menuRoutes); // Versionado simple: /api/*

// 404 para rutas no definidas
app.use((req, res, next) => {
    const e = new Error('Recurso no encontrado'); e.status = 404; next(e);
});

// Al final, el manejador centralizado de errores (guarda en DB)
app.use(errorHandler);
module.exports = app;