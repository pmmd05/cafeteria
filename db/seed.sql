-- Categorías iniciales
INSERT INTO categories (name) VALUES ('Bebidas'), ('Comidas'), ('Postres');
-- Tamaños disponibles (incluye 'Única' para productos sin variantes)
INSERT INTO sizes (name) VALUES ('Pequeña'), ('Mediana'), ('Grande'), ('Única');
-- Ítems base (asocian a categorías existentes)
INSERT INTO items (category_id, name, description) VALUES
    ((SELECT id FROM categories WHERE name='Bebidas'), 'Americano', 'Café filtrado'),
    ((SELECT id FROM categories WHERE name='Bebidas'), 'Latte', 'Café espresso con leche'),
    ((SELECT id FROM categories WHERE name='Comidas'), 'Sándwich mixto', 'Jamón y queso'),
    ((SELECT id FROM categories WHERE name='Postres'), 'Brownie', 'Chocolate clásico');
-- Precios de bebidas por tamaño: varias filas por ítem
INSERT INTO item_prices (item_id, size_id, price)
SELECT i.id, s.id, v.price
FROM (VALUES
    ('Americano','Pequeña',12.00),
    ('Americano','Mediana',15.00),
    ('Americano','Grande',18.00),
    ('Latte','Pequeña',18.00),
    ('Latte','Mediana',22.00),
    ('Latte','Grande',26.00)
) AS v(item,size,price)
JOIN items i ON i.name = v.item
JOIN sizes s ON s.name = v.size;
-- Precios únicos para comida/postre (tamaño 'Única')
INSERT INTO item_prices (item_id, size_id, price)
SELECT i.id, s.id, v.price
FROM (VALUES
    ('Sándwich mixto','Única',25.00),
    ('Brownie','Única',15.00)
) AS v(item,size,price)
JOIN items i ON i.name = v.item
JOIN sizes s ON s.name = v.size;
