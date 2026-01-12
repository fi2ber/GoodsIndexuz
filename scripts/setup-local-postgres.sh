#!/bin/bash

# Скрипт для настройки локальной PostgreSQL базы данных

echo "🚀 Настройка локальной PostgreSQL базы данных...\n"

# Проверка наличия PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL не установлен!"
    echo "\n💡 Установите PostgreSQL:"
    echo "   macOS: brew install postgresql@14"
    echo "   или скачайте с https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL установлен"

# Проверка запущен ли PostgreSQL
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL не запущен"
    echo "💡 Запустите PostgreSQL:"
    echo "   macOS: brew services start postgresql@14"
    echo "   или: pg_ctl -D /usr/local/var/postgres start"
    exit 1
fi

echo "✅ PostgreSQL запущен"

# Запрос данных для подключения
read -p "Введите имя пользователя PostgreSQL (по умолчанию: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Введите пароль PostgreSQL: " DB_PASSWORD
echo ""

read -p "Введите имя базы данных (по умолчанию: goodsindexuz): " DB_NAME
DB_NAME=${DB_NAME:-goodsindexuz}

read -p "Введите хост (по умолчанию: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Введите порт (по умолчанию: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Формируем DATABASE_URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "\n📝 DATABASE_URL:"
echo "postgresql://${DB_USER}:****@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Проверка подключения
echo "\n🔍 Проверка подключения..."
export PGPASSWORD="${DB_PASSWORD}"

if psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "SELECT 1;" &> /dev/null; then
    echo "✅ Подключение успешно!"
    
    # Создание базы данных если не существует
    echo "\n📦 Создание базы данных '${DB_NAME}'..."
    psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME};" 2>&1 | grep -v "already exists" || true
    
    echo "\n✅ База данных '${DB_NAME}' готова!"
    echo "\n📝 Добавьте в .env.local:"
    echo "DATABASE_URL=${DATABASE_URL}"
    echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000"
    
else
    echo "❌ Не удалось подключиться к PostgreSQL"
    echo "\n💡 Проверьте:"
    echo "   1. PostgreSQL запущен"
    echo "   2. Правильность имени пользователя и пароля"
    echo "   3. Доступ к базе данных"
    exit 1
fi

unset PGPASSWORD

