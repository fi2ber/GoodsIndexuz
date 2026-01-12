# Миграция на PostgreSQL - Завершена ✅

Проект успешно мигрирован с Supabase на прямое подключение к PostgreSQL.

## Что изменилось

### Зависимости
- ❌ Удалено: `@supabase/supabase-js`, `@supabase/ssr`
- ✅ Добавлено: `postgres` (postgres.js)

### Структура кода
- ✅ Создан `lib/db/connection.ts` - модуль подключения к PostgreSQL
- ✅ Переписаны все queries в `lib/db/queries.ts` на SQL
- ✅ Обновлен `lib/auth.ts` для работы с PostgreSQL
- ✅ Обновлены все API routes
- ✅ Обновлены страницы админки
- ✅ Удалены файлы Supabase клиентов

### Переменные окружения
**Было:**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**Стало:**
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## Настройка

1. **Установите зависимости:**
```bash
npm install
```

2. **Настройте DATABASE_URL:**
Создайте `.env.local`:
```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Выполните миграции:**
Подключитесь к вашей PostgreSQL БД и выполните SQL из:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/003_seed_categories.sql`

4. **Создайте админ-пользователя:**
```bash
npx tsx scripts/create-admin-user.ts
```

## Поддерживаемые провайдеры

Проект работает с любым PostgreSQL:
- ✅ Локальная PostgreSQL
- ✅ Neon (serverless)
- ✅ Railway
- ✅ Supabase (можно использовать как обычный PostgreSQL)
- ✅ AWS RDS
- ✅ DigitalOcean Managed Databases
- ✅ Heroku Postgres
- ✅ Любой другой PostgreSQL хостинг

## Преимущества

1. **Гибкость** - можно использовать любой PostgreSQL провайдер
2. **Производительность** - прямое подключение без лишних слоев
3. **Контроль** - полный контроль над запросами и соединениями
4. **Совместимость** - стандартный PostgreSQL, без привязки к Supabase API

## Важные замечания

- RLS политики остались в миграциях для совместимости, но не используются напрямую
- Безопасность контролируется через middleware и `requireAuth()`
- Все запросы используют параметризованные SQL для защиты от SQL injection

