# Настройка курсов валют (USD/UZS)

## Где посмотреть и управлять курсами

### В админ-панели

1. Войдите в админ-панель: `/admin/login`
2. Перейдите в раздел **"FX Rates"** в боковом меню
3. На странице `/admin/fx-rates` вы увидите:
   - **Последний курс** с информацией об изменении за 7 дней
   - **Таблицу всех курсов** (последние 100 записей)
   - Кнопки для управления курсами

### Функции управления

- **"Add Rate"** - Добавить курс вручную для конкретной даты
- **"Update from CBU"** - Обновить курс автоматически из API Центрального банка Узбекистана

## Автоматическое обновление курсов

### Вариант 1: Через Vercel Cron (рекомендуется)

Если вы используете Vercel для хостинга, добавьте в `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/update-fx",
      "schedule": "0 9 * * *"
    }
  ]
}
```

Это будет обновлять курс каждый день в 9:00 UTC.

**Важно**: Добавьте в `.env.local`:
```env
CRON_SECRET=ваш_секретный_ключ
```

### Вариант 2: Через внешний cron сервис

Используйте сервисы типа:
- **cron-job.org**
- **EasyCron**
- **UptimeRobot**

Настройте запрос:
- **URL**: `https://ваш-домен.com/api/cron/update-fx`
- **Method**: GET
- **Headers**: `Authorization: Bearer ваш_CRON_SECRET`
- **Schedule**: Ежедневно в удобное время (например, 9:00 UTC)

### Вариант 3: Через скрипт на сервере

Создайте cron job на вашем сервере:

```bash
# Добавьте в crontab (crontab -e)
0 9 * * * cd /path/to/project && npm run fx:update
```

Или используйте скрипт напрямую:

```bash
npm run fx:update
# или
./node_modules/.bin/tsx scripts/update-fx-usd-uzs.ts
```

## Ручное обновление

### Через админ-панель

1. Перейдите в `/admin/fx-rates`
2. Нажмите **"Update from CBU"**
3. Курс будет обновлен автоматически

### Через API

```bash
# С авторизацией (требуется admin)
curl -X POST https://ваш-домен.com/api/admin/fx-rates/update \
  -H "Cookie: ваш_session_cookie"
```

## Источники курсов

### Центральный банк Узбекистана (CBU)

По умолчанию используется API CBU:
- **URL**: `https://cbu.uz/oz/arkhiv-kursov-valyut/json/USD/`
- **Обновление**: Ежедневно
- **Формат**: JSON

### Альтернативные источники

В файле `scripts/update-fx-usd-uzs.ts` есть закомментированный код для использования:
- **OpenExchangeRates** (требуется API ключ)

Чтобы использовать OpenExchangeRates:
1. Получите API ключ на https://openexchangerates.org/
2. Добавьте в `.env.local`:
   ```env
   OPENEXCHANGERATES_API_KEY=ваш_ключ
   ```
3. Раскомментируйте функцию `fetchOpenExchangeRate()` в скрипте

## Структура данных

### Таблица `fx_rates_daily`

```sql
CREATE TABLE fx_rates_daily (
  rate_date DATE PRIMARY KEY,
  usd_uzs NUMERIC(18,6) NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

- **rate_date** - Дата курса (YYYY-MM-DD)
- **usd_uzs** - Курс обмена (1 USD = X UZS)
- **source** - Источник курса (CBU, manual, и т.д.)
- **created_at** - Время создания записи

## API Endpoints

### Получить все курсы (требуется авторизация)

```bash
GET /api/admin/fx-rates
```

### Добавить/обновить курс вручную (требуется авторизация)

```bash
POST /api/admin/fx-rates
Content-Type: application/json

{
  "rate_date": "2024-01-15",
  "usd_uzs": 12500.00,
  "source": "manual"
}
```

### Обновить курс из CBU (требуется авторизация)

```bash
POST /api/admin/fx-rates/update
```

### Cron endpoint (требует CRON_SECRET)

```bash
GET /api/cron/update-fx
Authorization: Bearer ваш_CRON_SECRET
```

## Использование курсов в коде

### Получить курс для конкретной даты

```typescript
import { getFxRatesDaily } from "@/lib/db/queries";

const rates = await getFxRatesDaily({ 
  from: "2024-01-01", 
  to: "2024-01-31" 
});
const rate = rates.get("2024-01-15"); // курс на 15 января
```

### Получить последний курс

```typescript
import { getLatestFxRate } from "@/lib/db/queries";

const latestRate = await getLatestFxRate();
console.log(latestRate.usd_uzs); // последний курс
```

## Troubleshooting

### Курсы не обновляются автоматически

1. Проверьте, что `CRON_SECRET` установлен в `.env.local`
2. Проверьте логи cron job
3. Убедитесь, что API CBU доступен: `https://cbu.uz/oz/arkhiv-kursov-valyut/json/USD/`

### Ошибка "Unauthorized" при использовании cron endpoint

Убедитесь, что заголовок `Authorization: Bearer ваш_CRON_SECRET` правильный.

### Курсы не отображаются в админ-панели

1. Проверьте, что миграция `013_create_market_index.sql` выполнена
2. Проверьте, что таблица `fx_rates_daily` существует в базе данных
3. Попробуйте обновить курс вручную через админ-панель
