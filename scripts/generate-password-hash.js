// Скрипт для генерации хеша пароля
const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin';
const rounds = 10;

bcrypt.hash(password, rounds)
  .then(hash => {
    console.log('\n✅ Хеш пароля сгенерирован:');
    console.log(hash);
    console.log('\n📋 Используйте этот хеш в SQL запросе:');
    console.log(`INSERT INTO users (email, password_hash, role)`);
    console.log(`VALUES ('admin', '${hash}', 'admin');`);
    console.log('');
  })
  .catch(err => {
    console.error('❌ Ошибка:', err);
    process.exit(1);
  });

