# Быстрый старт

## ⚠️ Проблема с npm install

Если возникают ошибки с npm логами, попробуйте:

```bash
# Вариант 1: Использовать yarn
yarn install

# Вариант 2: Очистить npm кэш и установить заново
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Вариант 3: Установить с флагами
npm install --no-audit --no-fund --legacy-peer-deps
```

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Настройка Supabase

### 2.1 Создайте проект в Supabase
1. Перейдите на https://supabase.com
2. Создайте новый проект
3. Дождитесь инициализации

### 2.2 Выполните миграции

В Supabase Dashboard → SQL Editor выполните по порядку:

1. **001_initial_schema.sql** - создаст все таблицы
2. **002_create_admin_user.sql** - создаст админ-пользователя (⚠️ нужно сгенерировать хеш пароля!)
3. **003_seed_categories.sql** - создаст категории

### 2.3 Генерация хеша пароля для админа

Выполните в терминале:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin', 10).then(h => console.log(h))"
```

Скопируйте полученный хеш и вставьте в `002_create_admin_user.sql` вместо placeholder.

Или используйте онлайн генератор: https://bcrypt-generator.com/
- Password: `admin`
- Rounds: `10`

### 2.4 Получите ключи API

В Supabase Dashboard → Settings → API скопируйте:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Шаг 3: Создание .env.local

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Шаг 4: Создание админ-пользователя

### Вариант A: Через скрипт (после настройки .env.local)

```bash
npx tsx scripts/create-admin-user.ts
```

### Вариант B: Через SQL (рекомендуется)

1. Сгенерируйте хеш пароля (см. шаг 2.3)
2. В Supabase SQL Editor выполните:

```sql
INSERT INTO users (email, password_hash, role)
VALUES (
  'admin',
  'ВАШ_СГЕНЕРИРОВАННЫЙ_ХЕШ',
  'admin'
);
```

## Шаг 5: Создание менеджера по умолчанию

В Supabase SQL Editor:

```sql
INSERT INTO managers (name, telegram_username, telegram_link, is_active, is_default)
VALUES (
  'Default Manager',
  'your_telegram_username',
  'https://t.me/your_telegram_username',
  true,
  true
);
```

Замените `your_telegram_username` на реальный username Telegram.

## Шаг 6: Запуск проекта

```bash
npm run dev
```

Откройте:
- Публичный сайт: http://localhost:3000
- Админ-панель: http://localhost:3000/admin/login
  - Email: `admin`
  - Password: `admin`

## Проверка

✅ Зависимости установлены  
✅ `.env.local` создан и заполнен  
✅ Миграции выполнены в Supabase  
✅ Админ-пользователь создан  
✅ Менеджер по умолчанию создан  
✅ Проект запускается без ошибок  

## Создание продуктов

После входа в админ-панель:
1. Перейдите в Products → New Product
2. Создайте продукты из вашего списка (18 продуктов)
3. Заполните все обязательные поля

## Полезные команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build

# Запуск production версии
npm start

# Проверка кода
npm run lint
```

