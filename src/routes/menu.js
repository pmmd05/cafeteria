const { Router } = require('express');
const wrap = require('../middleware/asyncWrap');
const ctrl = require('../controllers/menu');
const router = Router();
router.get('/health', wrap(ctrl.getHealth)); // Salud de la API/DB
router.get('/categories', wrap(ctrl.listCategories)); // Lista categorías
router.get('/items', wrap(ctrl.listItems)); // Lista ítems (+ filtro opcional)
router.get('/items/:id', wrap(ctrl.getItem)); // Detalle de ítem + precios
module.exports = router;