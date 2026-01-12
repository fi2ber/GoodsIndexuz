-- Создание категорий продуктов

INSERT INTO categories (name_ru, name_en, slug) VALUES
('Орехи', 'Nuts', 'nuts'),
('Бобовые', 'Legumes', 'legumes'),
('Сухофрукты', 'Dried Fruits', 'dried-fruits')
ON CONFLICT (slug) DO NOTHING;

