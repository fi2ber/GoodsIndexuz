#!/bin/bash

# Скрипт для ожидания запуска Docker

echo "⏳ Ожидание запуска Docker Desktop..."

MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if docker ps &> /dev/null; then
        echo "✅ Docker запущен!"
        exit 0
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    if [ $ATTEMPT -eq 1 ]; then
        echo "💡 Если Docker Desktop не запущен, откройте его вручную"
        echo "   Или выполните: open -a Docker"
    fi
    
    sleep 2
done

echo "❌ Docker не запустился за 60 секунд"
echo "💡 Запустите Docker Desktop вручную и попробуйте снова"
exit 1

