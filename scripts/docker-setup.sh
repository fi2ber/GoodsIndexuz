#!/bin/bash

echo "🐳 Настройка Docker для локальной разработки...\n"

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    echo "\n💡 Установите Docker Desktop для macOS:"
    echo "   https://www.docker.com/products/docker-desktop/"
    echo "\n   Или через Homebrew:"
    echo "   brew install --cask docker"
    exit 1
fi

echo "✅ Docker установлен"

# Проверка запущен ли Docker
if ! docker ps &> /dev/null; then
    echo "⚠️  Docker не запущен"
    echo "💡 Пытаюсь запустить Docker Desktop..."
    
    # Пытаемся запустить Docker Desktop
    open -a Docker 2>/dev/null || true
    
    # Ждем запуска Docker
    echo "⏳ Ожидание запуска Docker (до 60 секунд)..."
    MAX_ATTEMPTS=30
    ATTEMPT=0
    
    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        if docker ps &> /dev/null; then
            echo "✅ Docker запущен!"
            break
        fi
        ATTEMPT=$((ATTEMPT + 1))
        sleep 2
    done
    
    if ! docker ps &> /dev/null; then
        echo "❌ Docker не запустился за 60 секунд"
        echo "💡 Запустите Docker Desktop вручную и выполните команду снова"
        exit 1
    fi
fi

echo "✅ Docker запущен"

# Определяем команду docker compose (v2) или docker-compose (v1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif docker-compose version &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ docker-compose не найден"
    exit 1
fi

# Остановка существующего контейнера если есть
echo "\n🛑 Остановка существующих контейнеров..."
$DOCKER_COMPOSE down 2>/dev/null || true

# Запуск PostgreSQL
echo "\n🚀 Запуск PostgreSQL в Docker..."
$DOCKER_COMPOSE up -d

# Ожидание готовности PostgreSQL
echo "\n⏳ Ожидание готовности PostgreSQL..."
for i in {1..30}; do
    if $DOCKER_COMPOSE exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo "✅ PostgreSQL готов!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL не запустился за 30 секунд"
        exit 1
    fi
    sleep 1
done

# Показываем статус
echo "\n📊 Статус контейнеров:"
$DOCKER_COMPOSE ps

# Показываем DATABASE_URL
echo "\n📝 DATABASE_URL для .env.local:"
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/goodsindexuz"
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000"

echo "\n✅ Готово! Теперь выполните:"
echo "   npm run db:setup"

