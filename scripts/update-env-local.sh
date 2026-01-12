#!/bin/bash

# Скрипт для обновления .env.local с DATABASE_URL для Docker

ENV_FILE=".env.local"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/goodsindexuz"
SITE_URL="http://localhost:3000"

echo "📝 Обновление .env.local...\n"

# Проверка существования файла
if [ ! -f "$ENV_FILE" ]; then
    echo "Создание нового файла .env.local..."
    cat > "$ENV_FILE" << EOF
DATABASE_URL=${DATABASE_URL}
NEXT_PUBLIC_SITE_URL=${SITE_URL}
EOF
    echo "✅ Файл создан"
else
    echo "Обновление существующего файла .env.local..."
    
    # Обновляем или добавляем DATABASE_URL
    if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
        # Заменяем существующий DATABASE_URL
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=${DATABASE_URL}|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${DATABASE_URL}|" "$ENV_FILE"
        fi
        echo "✅ DATABASE_URL обновлен"
    else
        # Добавляем DATABASE_URL в начало файла
        echo "DATABASE_URL=${DATABASE_URL}" > "${ENV_FILE}.tmp"
        cat "$ENV_FILE" >> "${ENV_FILE}.tmp"
        mv "${ENV_FILE}.tmp" "$ENV_FILE"
        echo "✅ DATABASE_URL добавлен"
    fi
    
    # Обновляем или добавляем NEXT_PUBLIC_SITE_URL
    if grep -q "^NEXT_PUBLIC_SITE_URL=" "$ENV_FILE"; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${SITE_URL}|" "$ENV_FILE"
        else
            sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=${SITE_URL}|" "$ENV_FILE"
        fi
        echo "✅ NEXT_PUBLIC_SITE_URL обновлен"
    else
        echo "NEXT_PUBLIC_SITE_URL=${SITE_URL}" >> "$ENV_FILE"
        echo "✅ NEXT_PUBLIC_SITE_URL добавлен"
    fi
fi

echo "\n📋 Содержимое .env.local:"
cat "$ENV_FILE"
echo "\n✅ Готово!"

