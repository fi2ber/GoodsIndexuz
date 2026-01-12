#!/bin/bash

echo "🚀 Настройка проекта GoodsIndexuz"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+ и попробуйте снова."
    exit 1
fi

echo "✅ Node.js версия: $(node --version)"
echo ""

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

echo "✅ Зависимости установлены"
echo ""

# Создание .env.local если не существует
if [ ! -f .env.local ]; then
    echo "📝 Создание .env.local из примера..."
    cp .env.local.example .env.local 2>/dev/null || echo "# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000" > .env.local
    echo "✅ .env.local создан"
    echo "⚠️  Не забудьте заполнить ключи Supabase в .env.local"
else
    echo "✅ .env.local уже существует"
fi

echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте Supabase проект (см. SETUP.md)"
echo "2. Заполните .env.local ключами из Supabase"
echo "3. Выполните миграции в Supabase SQL Editor"
echo "4. Создайте админ-пользователя: npx tsx scripts/create-admin-user.ts"
echo "5. Запустите проект: npm run dev"
echo ""

