// Implementan la lógica de negocio de "menú"
const pool = require('../db/pool');

// Verifica conectividad con la DB (para healthchecks)
async function getHealth(req, res) {
    const { rows } = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
}

// Devuelve todas las categorías ordenadas
async function listCategories(req, res) {
    const { rows } = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.json(rows);
}

// Lista ítems y permite filtrar por categoría (?category_id=1)
async function listItems(req, res) {
    const { category_id } = req.query;
    const sql = `
        SELECT i.id, i.name, i.description, i.is_active, c.name AS category
        FROM items i
        JOIN categories c ON c.id = i.category_id
        WHERE ($1::int IS NULL OR i.category_id = $1::int) -- filtro opcional
        ORDER BY i.name`;
    const { rows } = await pool.query(sql, [category_id || null]);
    res.json(rows);
}

// Devuelve un ítem por id con sus precios por tamaño
async function getItem(req, res) {
    const id = Number(req.params.id);
    // Validación temprana: id debe ser entero
    if (!Number.isInteger(id)) {
        const e = new Error('id debe ser numérico'); e.status = 400; throw e;
    }
    // Consulta del ítem + categoría
    const itemSql = `
        SELECT i.id, i.name, i.description, i.is_active,
        c.id AS category_id, c.name AS category
        FROM items i
        JOIN categories c ON c.id = i.category_id
        WHERE i.id = $1`;

    // Consulta de precios por tamaño
    const priceSql = `
        SELECT s.id AS size_id, s.name AS size, p.price
        FROM item_prices p
        JOIN sizes s ON s.id = p.size_id
        WHERE p.item_id = $1
        ORDER BY s.name`;
    // Ejecutamos en paralelo para menor latencia
    const [itemRes, pricesRes] = await Promise.all([
        pool.query(itemSql, [id]),
        pool.query(priceSql, [id])
    ]);

    // Si no existe el ítem, devolvemos 404
    if (itemRes.rowCount === 0) {
        const e = new Error('Ítem no encontrado'); e.status = 404; throw e;
    }
    
    const item = itemRes.rows[0];
    item.prices = pricesRes.rows; // Array [{ size_id, size, price }, ...]
    res.json(item);
}
module.exports = { getHealth, listCategories, listItems, getItem };