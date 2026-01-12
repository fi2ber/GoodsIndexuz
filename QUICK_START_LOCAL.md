# Быстрый старт для локальной разработки

## Проблема
PostgreSQL не установлен локально, но вы хотите запустить проект.

## Решения

### Вариант 1: Установить PostgreSQL локально (рекомендуется для разработки)

**macOS:**
```bash
# Установка через Homebrew
brew install postgresql@14

# Запуск PostgreSQL
brew services start postgresql@14

# Создание базы данных
createdb goodsindexuz

# Или через psql
psql postgres
CREATE DATABASE goodsindexuz;
\q
```

**Затем в `.env.local`:**
```env
DATABASE_URL=postgresql://postgres@localhost:5432/goodsindexuz
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Примечание:** Если у пользователя `postgres` нет пароля, используйте `postgresql://postgres@localhost:5432/goodsindexuz` (без пароля)

### Вариант 2: Использовать облачную БД (быстро, без установки)

#### Neon (бесплатный серверный PostgreSQL)

1. Зарегистрируйтесь на https://neon.tech
2. Создайте проект
3. Скопируйте Connection String
4. Добавьте в `.env.local`:
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Railway (простой деплой)

1. Зарегистрируйтесь на https://railway.app
2. Создайте PostgreSQL базу данных
3. Скопируйте Connection String
4. Добавьте в `.env.local`

#### Supabase (как обычный PostgreSQL)

1. Зарегистрируйтесь на https://supabase.com
2. Создайте проект
3. Перейдите в Settings → Database
4. Скопируйте Connection String (используйте Connection Pooling)
5. Добавьте в `.env.local`:
```env
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Вариант 3: Docker (если установлен Docker)

```bash
# Запуск PostgreSQL в Docker
docker run --name goodsindexuz-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=goodsindexuz \
  -p 5432:5432 \
  -d postgres:14

# В .env.local:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/goodsindexuz
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## После настройки DATABASE_URL

```bash
# Проверка
npm run db:check

# Настройка БД
npm run db:setup

# Запуск проекта
npm run dev
```

## Рекомендация

Для локальной разработки лучше использовать **локальный PostgreSQL** (Вариант 1) - это быстрее и не зависит от интернета.

Для быстрого старта без установки используйте **Neon** (Вариант 2) - бесплатно и работает сразу.

