# Скрипты для работы с базой данных

## Быстрый старт

### 1. Выполнить все миграции
```bash
npm run db:migrate
```
или
```bash
npx tsx scripts/run-migrations.ts
```

Это создаст все таблицы и структуру БД.

### 2. Настроить базу данных (миграции + админ)
```bash
npm run db:setup
```
или
```bash
npx tsx scripts/setup-database.ts
```

Это выполнит:
- Проверку подключения
- Создание/обновление админ-пользователя
- Проверку категорий и менеджеров
- Покажет статистику

### 3. Создать только админ-пользователя
```bash
npm run db:admin
```
или
```bash
npx tsx scripts/create-admin-user.ts
```

Создает пользователя:
- Email: `admin`
- Password: `admin`

### 4. Создать менеджера по умолчанию
```bash
npm run db:manager
```
или
```bash
npx tsx scripts/create-default-manager.ts
```

**С переменными окружения:**
```bash
MANAGER_NAME="Иван Иванов" \
MANAGER_TELEGRAM_USERNAME="ivan_manager" \
MANAGER_TELEGRAM_LINK="https://t.me/ivan_manager" \
npx tsx scripts/create-default-manager.ts
```

## Порядок выполнения

1. **Сначала выполните миграции:**
   ```bash
   npm run db:migrate
   ```

2. **Затем настройте БД (создаст админа):**
   ```bash
   npm run db:setup
   ```

3. **Создайте менеджера (опционально):**
   ```bash
   npm run db:manager
   ```

Или используйте админ-панель для создания менеджера после входа.

## Требования

Перед запуском скриптов убедитесь, что:

1. ✅ Установлены зависимости: `npm install`
2. ✅ Создан `.env.local` с `DATABASE_URL`
3. ✅ PostgreSQL БД доступна и запущена

## Пример DATABASE_URL

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/goodsindexuz
```

## Решение проблем

### Ошибка "relation does not exist"
Выполните миграции: `npm run db:migrate`

### Ошибка подключения
Проверьте `DATABASE_URL` в `.env.local`

### Ошибка "duplicate key"
Объект уже существует - это нормально, скрипты используют `ON CONFLICT`


