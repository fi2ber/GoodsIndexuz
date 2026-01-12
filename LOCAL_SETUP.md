# Настройка локальной PostgreSQL

## Вариант 1: Автоматическая настройка (рекомендуется)

Запустите скрипт:

```bash
./scripts/setup-local-postgres.sh
```

Скрипт поможет:
- Проверить установку PostgreSQL
- Создать базу данных
- Сгенерировать правильный DATABASE_URL

## Вариант 2: Ручная настройка

### Шаг 1: Установите PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Или скачайте с:** https://www.postgresql.org/download/

### Шаг 2: Создайте базу данных

```bash
# Подключитесь к PostgreSQL
psql postgres

# Создайте базу данных
CREATE DATABASE goodsindexuz;

# Создайте пользователя (если нужно)
CREATE USER goodsindexuz_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE goodsindexuz TO goodsindexuz_user;

# Выйдите
\q
```

### Шаг 3: Настройте .env.local

Откройте `.env.local` и добавьте:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/goodsindexuz
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Замените:**
- `postgres` - на ваше имя пользователя PostgreSQL
- `your_password` - на ваш пароль PostgreSQL
- `goodsindexuz` - на имя базы данных (если другое)

### Шаг 4: Запустите настройку БД

```bash
npm run db:setup
```

## Проверка подключения

Проверить подключение можно командой:

```bash
psql postgresql://postgres:your_password@localhost:5432/goodsindexuz -c "SELECT version();"
```

## Частые проблемы

### PostgreSQL не запущен

**macOS:**
```bash
brew services start postgresql@14
# или
pg_ctl -D /usr/local/var/postgres start
```

### Неверный пароль

Если забыли пароль пользователя `postgres`:

**macOS (Homebrew):**
```bash
# Остановите PostgreSQL
brew services stop postgresql@14

# Запустите без аутентификации
pg_ctl -D /usr/local/var/postgres start

# Подключитесь
psql postgres

# Измените пароль
ALTER USER postgres WITH PASSWORD 'новый_пароль';

# Выйдите и перезапустите
\q
brew services restart postgresql@14
```

### База данных уже существует

Это нормально! Скрипт миграций проверит и создаст таблицы если их нет.

## После настройки

```bash
# Запустите проект
npm run dev

# Откройте браузер
# Публичный сайт: http://localhost:3000
# Админ-панель: http://localhost:3000/admin/login
#   Email: admin
#   Password: admin
```

