# Инструкция по настройке проекта

## Шаг 1: Установка зависимостей

```bash
npm install
```

Если возникают проблемы с npm, попробуйте:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Шаг 2: Настройка Supabase

### 2.1 Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения инициализации (обычно 1-2 минуты)

### 2.2 Выполнение миграций

1. В Supabase Dashboard откройте **SQL Editor**
2. Создайте новый запрос
3. Откройте файл `supabase/migrations/001_initial_schema.sql`
4. Скопируйте весь SQL код из файла
5. Вставьте в SQL Editor и нажмите **Run**

Это создаст все необходимые таблицы:
- `categories`
- `products`
- `managers`
- `inquiries`
- `users`

### 2.3 Получение ключей API

1. В Supabase Dashboard перейдите в **Settings** > **API**
2. Скопируйте следующие значения:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (секретный ключ!)

## Шаг 3: Создание .env.local

1. Скопируйте `.env.local.example` в `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Откройте `.env.local` и заполните значениями из Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Важно**: Никогда не коммитьте `.env.local` в git!

## Шаг 4: Создание админ-пользователя

### Вариант 1: Через скрипт (рекомендуется)

```bash
npx tsx scripts/create-admin-user.ts
```

Это создаст пользователя:
- Email: `admin`
- Password: `admin`

### Вариант 2: Через SQL Editor в Supabase

1. Откройте SQL Editor в Supabase Dashboard
2. Выполните следующий SQL (замените `YOUR_HASHED_PASSWORD` на хеш пароля "admin"):

```sql
-- Сначала нужно получить хеш пароля "admin"
-- Можно использовать онлайн bcrypt генератор: https://bcrypt-generator.com/
-- Или выполнить в Node.js:
-- const bcrypt = require('bcryptjs');
-- console.log(bcrypt.hashSync('admin', 10));

INSERT INTO users (email, password_hash, role)
VALUES ('admin', '$2a$10$YOUR_HASHED_PASSWORD_HERE', 'admin');
```

Для генерации хеша можно использовать:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin', 10).then(h => console.log(h))"
```

## Шаг 5: Заполнение начальных данных

### 5.1 Создание категорий

Через SQL Editor или админ-панель создайте категории:

```sql
INSERT INTO categories (name_ru, name_en, slug) VALUES
('Орехи', 'Nuts', 'nuts'),
('Бобовые', 'Legumes', 'legumes'),
('Сухофрукты', 'Dried Fruits', 'dried-fruits');
```

### 5.2 Создание менеджера по умолчанию

```sql
INSERT INTO managers (name, telegram_username, telegram_link, is_active, is_default)
VALUES ('Default Manager', 'your_telegram_username', 'https://t.me/your_telegram_username', true, true);
```

### 5.3 Создание продуктов

Продукты можно создать через админ-панель после входа:
1. Запустите проект: `npm run dev`
2. Откройте http://localhost:3000/admin/login
3. Войдите: email `admin`, password `admin`
4. Перейдите в Products > New Product
5. Создайте продукты из списка

## Шаг 6: Запуск проекта

```bash
npm run dev
```

Откройте:
- Публичный сайт: http://localhost:3000
- Админ-панель: http://localhost:3000/admin/login

## Проверка настройки

После выполнения всех шагов проверьте:

1. ✅ Зависимости установлены (`node_modules` существует)
2. ✅ `.env.local` создан и заполнен
3. ✅ Миграции выполнены (таблицы созданы в Supabase)
4. ✅ Админ-пользователь создан
5. ✅ Проект запускается без ошибок

## Решение проблем

### Ошибка подключения к Supabase
- Проверьте правильность ключей в `.env.local`
- Убедитесь, что проект Supabase активен

### Ошибка аутентификации
- Проверьте, что пользователь создан в таблице `users`
- Убедитесь, что пароль правильно захеширован

### Ошибки TypeScript
- Убедитесь, что все зависимости установлены
- Попробуйте удалить `node_modules` и `.next`, затем переустановить

