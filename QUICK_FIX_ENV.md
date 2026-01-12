# Быстрое исправление: DATABASE_URL

## Проблема
Скрипты не могут найти `DATABASE_URL` в `.env.local`.

## Решение

### Шаг 1: Откройте `.env.local` в редакторе

### Шаг 2: Добавьте или проверьте строку:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Шаг 3: Замените placeholder на реальные данные

**Примеры:**

1. **Локальная PostgreSQL:**
   ```env
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/goodsindexuz
   ```

2. **Neon (Serverless PostgreSQL):**
   ```env
   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

3. **Railway:**
   ```env
   DATABASE_URL=postgresql://postgres:pass@containers-us-west-xxx.railway.app:5432/railway
   ```

4. **Supabase (как обычный PostgreSQL):**
   ```env
   DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

### Шаг 4: Сохраните файл и запустите:

```bash
npm run db:setup
```

## Проверка

Перед запуском `db:setup` можно проверить конфигурацию:

```bash
npm run db:check
```

## Что делает `npm run db:setup`:

1. ✅ Проверяет наличие DATABASE_URL
2. ✅ Подключается к БД
3. ✅ Выполняет миграции (создает таблицы)
4. ✅ Создает админ-пользователя (admin/admin)
5. ✅ Проверяет категории
6. ✅ Показывает статистику

## После успешной настройки:

```bash
npm run dev
```

Откройте:
- Публичный сайт: http://localhost:3000
- Админ-панель: http://localhost:3000/admin/login
  - Email: `admin`
  - Password: `admin`

