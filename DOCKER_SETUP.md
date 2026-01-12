# 🐳 Настройка Docker для локальной разработки

## ✅ Что уже готово

- ✅ Docker установлен
- ✅ docker-compose.yml создан
- ✅ Скрипты настроены

## 🚀 Быстрый старт

### Шаг 1: Запустите Docker Desktop

Откройте **Docker Desktop** на вашем Mac. Если не установлен:
- Скачайте: https://www.docker.com/products/docker-desktop/
- Или через Homebrew: `brew install --cask docker`

### Шаг 2: Запустите PostgreSQL в Docker

```bash
npm run docker:setup
```

Или вручную:

```bash
# Запуск PostgreSQL
docker compose up -d

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f postgres
```

### Шаг 3: Настройте .env.local

Откройте `.env.local` и убедитесь, что есть:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/goodsindexuz
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Шаг 4: Настройте базу данных

```bash
npm run db:setup
```

Это создаст:
- ✅ Все таблицы (миграции)
- ✅ Админ-пользователя (admin/admin)
- ✅ Категории продуктов

### Шаг 5: Запустите проект

```bash
npm run dev
```

Откройте:
- Публичный сайт: http://localhost:3000
- Админ-панель: http://localhost:3000/admin/login
  - Email: `admin`
  - Password: `admin`

## 📋 Полезные команды

```bash
# Запуск PostgreSQL
npm run docker:up

# Остановка PostgreSQL
npm run docker:down

# Просмотр логов
npm run docker:logs

# Перезапуск PostgreSQL
npm run docker:restart

# Полная настройка (Docker + БД)
npm run setup
```

## 🔧 Управление данными

### Остановка и удаление данных

```bash
# Остановить контейнер (данные сохраняются)
docker compose stop

# Удалить контейнер и данные
docker compose down -v
```

### Резервное копирование

```bash
# Создать бэкап
docker compose exec postgres pg_dump -U postgres goodsindexuz > backup.sql

# Восстановить из бэкапа
docker compose exec -T postgres psql -U postgres goodsindexuz < backup.sql
```

## 🐛 Решение проблем

### Docker не запущен

```
Error: permission denied while trying to connect to the Docker daemon socket
```

**Решение:** Запустите Docker Desktop

### Порт 5432 уже занят

```
Error: bind: address already in use
```

**Решение:** 
1. Остановите локальный PostgreSQL: `brew services stop postgresql@14`
2. Или измените порт в `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Используйте порт 5433 вместо 5432
   ```
   И обновите `.env.local`: `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/goodsindexuz`

### Контейнер не запускается

```bash
# Проверьте логи
docker compose logs postgres

# Пересоздайте контейнер
docker compose down
docker compose up -d
```

## 📊 Структура Docker

```
goodsindexuz-postgres (контейнер)
├── PostgreSQL 14
├── База данных: goodsindexuz
├── Пользователь: postgres
├── Пароль: postgres
└── Порт: 5432
```

## ✅ Проверка работы

```bash
# Проверка подключения
psql postgresql://postgres:postgres@localhost:5432/goodsindexuz -c "SELECT version();"

# Или через Docker
docker compose exec postgres psql -U postgres -d goodsindexuz -c "SELECT version();"
```

## 🎯 Готово!

После выполнения всех шагов у вас будет:
- ✅ PostgreSQL в Docker
- ✅ Настроенная база данных
- ✅ Готовый к работе проект

