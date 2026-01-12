# Настройка PostgreSQL

Проект использует прямое подключение к PostgreSQL через `postgres.js`.

## Быстрая настройка

### 1. Установите зависимости

```bash
npm install
```

### 2. Настройте DATABASE_URL

Создайте `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Выполните миграции и настройте БД

**Вариант A: Автоматически (рекомендуется)**

Выполните все одним скриптом:
```bash
npm run db:setup
```

Это выполнит миграции и создаст админ-пользователя.

**Вариант B: Пошагово**

1. Выполните миграции:
```bash
npm run db:migrate
```

2. Создайте админ-пользователя:
```bash
npm run db:admin
```

3. (Опционально) Создайте менеджера по умолчанию:
```bash
npm run db:manager
```

**Вариант C: Вручную через SQL**

Подключитесь к вашей PostgreSQL БД и выполните:

1. `supabase/migrations/001_initial_schema.sql` - создаст все таблицы
2. `supabase/migrations/003_seed_categories.sql` - создаст категории

Для админа (сначала сгенерируйте хеш):
```bash
node scripts/generate-password-hash.js admin
```

Затем в SQL:
```sql
INSERT INTO users (email, password_hash, role)
VALUES ('admin', 'ВАШ_ХЕШ', 'admin');
```

## Примеры DATABASE_URL

### Локальная PostgreSQL
```
postgresql://postgres:password@localhost:5432/goodsindexuz
```

### Neon (Serverless PostgreSQL)
```
postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Railway
```
postgresql://postgres:pass@containers-us-west-xxx.railway.app:5432/railway
```

### Supabase (как обычный PostgreSQL)
```
postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### AWS RDS
```
postgresql://user:pass@xxx.xxx.us-east-1.rds.amazonaws.com:5432/dbname
```

## Проверка подключения

После настройки запустите проект:

```bash
npm run dev
```

Если все настроено правильно, проект запустится без ошибок.

## Решение проблем

### Ошибка подключения
- Проверьте правильность `DATABASE_URL`
- Убедитесь что БД доступна и запущена
- Проверьте права доступа пользователя

### Ошибка "relation does not exist"
- Убедитесь что миграции выполнены
- Проверьте что подключены к правильной БД

### Ошибка аутентификации
- Проверьте что пользователь создан в таблице `users`
- Убедитесь что пароль правильно захеширован

