-- Создание админ-пользователя
-- Пароль: admin
-- Хеш сгенерирован с помощью bcrypt (10 rounds)
-- Для генерации нового хеша используйте: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin', 10).then(h => console.log(h))"

-- ВАЖНО: Замените хеш ниже на сгенерированный вами, если хотите другой пароль
-- Или используйте онлайн генератор: https://bcrypt-generator.com/

INSERT INTO users (email, password_hash, role)
VALUES (
  'admin',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ХЕШ
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Для проверки что пользователь создан:
-- SELECT * FROM users WHERE email = 'admin';

