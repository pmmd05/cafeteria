-- Reinicio del esquema para entorno de DEV (evita residuos)
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS item_prices CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
-- Tabla de categorías (dominio de clasificación)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE -- Único para evitar duplicados
);
-- Ítems del menú (cada ítem pertenece a una categoría)
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(120) NOT NULL, -- Nombre del producto
    description TEXT, -- Descripción libre
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Flag activo/inactivo
    UNIQUE (category_id, name) -- No repetir nombre dentro de la misma categoría
);
-- Tamaños disponibles (catálogo: Pequeña/Mediana/Grande/Única)
CREATE TABLE sizes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(40) NOT NULL UNIQUE
);
-- Precios por combinación Ítem x Tamaño (3FN: precio depende de ambos)
CREATE TABLE item_prices (
    item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    size_id INT NOT NULL REFERENCES sizes(id) ON DELETE RESTRICT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    PRIMARY KEY (item_id, size_id) -- Impide duplicar la combinación
);
-- Bitácora de errores de la API (observabilidad)
CREATE TABLE error_logs (
    id BIGSERIAL PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Momento del error
    method VARCHAR(10), -- GET/POST/PUT/DELETE
    path TEXT, -- Ruta de la petición
    status_code INT, -- Código de respuesta (p.ej., 400/404/500)
    message TEXT, -- Mensaje de error
    stack TEXT, -- Stack trace (oculto en prod)
    ip INET, -- IP del cliente
    user_agent TEXT, -- Navegador/cliente
    body JSONB, -- Cuerpo de la solicitud
    params JSONB, -- Parámetros de ruta
    query JSONB -- Querystring
);
