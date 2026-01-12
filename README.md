# GoodsIndexuz - B2B Export Platform

B2B оптовый экспортный сайт для сельскохозяйственных продуктов из Узбекистана.

## Описание

Платформа для оптовой торговли сельскохозяйственными продуктами, предназначенная для:
- Импортеров
- Дистрибьюторов
- Оптовых покупателей
- Контрактных покупателей

**Важно**: Это НЕ e-commerce сайт. Нет корзины, checkout или видимых цен. Платформа фокусируется на построении доверия и запросах цен через Telegram или форму.

## Технологии

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: PostgreSQL (прямое подключение через postgres.js)
- **Анимации**: Framer Motion (минимальное использование)
- **Валидация**: Zod
- **Формы**: React Hook Form

## Требования

- Node.js 18+ 
- npm или yarn
- PostgreSQL база данных (локальная или облачная: Neon, Railway, Supabase, AWS RDS и т.д.)

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd GoodsIndexuz
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local` на основе `.env.local.example`:
```bash
cp .env.local.example .env.local
```

4. Настройте переменные окружения в `.env.local`:
```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Примеры DATABASE_URL:**
- Локальная БД: `postgresql://postgres:password@localhost:5432/goodsindexuz`
- Neon: `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`
- Railway: `postgresql://postgres:pass@xxx.railway.app:5432/railway`

## Настройка PostgreSQL

1. **Создайте PostgreSQL базу данных:**
   - Локально: установите PostgreSQL и создайте БД
   - Облако: используйте Neon, Railway, Supabase, AWS RDS и т.д.

2. **Выполните миграции:**
   - Подключитесь к вашей БД (через psql, pgAdmin, или SQL Editor вашего провайдера)
   - Выполните SQL из `supabase/migrations/001_initial_schema.sql`
   - Выполните `003_seed_categories.sql` для создания категорий

3. **Создайте тестового пользователя админа:**
   - После настройки `DATABASE_URL` в `.env.local`:
   ```bash
   npx tsx scripts/create-admin-user.ts
   ```
   - Или вручную через SQL:
   ```sql
   INSERT INTO users (email, password_hash, role)
   VALUES ('admin', '$2a$10$...', 'admin');
   ```
   - Используйте `node scripts/generate-password-hash.js admin` для генерации хеша

4. **Настройте DATABASE_URL:**
   - Формат: `postgresql://user:password@host:port/database`
   - Добавьте в `.env.local`

## Запуск

### Разработка
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Production
```bash
npm run build
npm start
```

## Структура проекта

```
GoodsIndexuz/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Локализованные публичные страницы
│   ├── admin/             # Админ-панель
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   ├── layout/           # Layout компоненты
│   ├── inquiry/          # Форма запроса цены
│   └── admin/            # Админ компоненты
├── lib/                   # Утилиты
│   ├── supabase/         # Supabase клиенты
│   ├── db/               # Database queries
│   ├── i18n/             # Мультиязычность
│   └── auth.ts           # Аутентификация
├── types/                 # TypeScript типы
└── supabase/             # Миграции БД
    └── migrations/
```

## Функциональность

### Публичный сайт
- Главная страница с hero секцией
- Каталог продуктов с фильтрацией по категориям
- Детальные страницы продуктов
- Форма запроса цены с редиректом на Telegram
- Мультиязычность (RU/EN)

### Админ-панель
- Dashboard со статистикой
- Управление продуктами (CRUD)
- Управление менеджерами Telegram
- Просмотр и управление inquiries
- Тестовая аутентификация (admin/admin)

## Аутентификация

Для тестирования используется простая система аутентификации:
- Email: `admin`
- Password: `admin`

**Внимание**: В production замените на Supabase Auth или другую систему аутентификации.

## Мультиязычность

Поддерживаются два языка:
- English (по умолчанию)
- Русский

URL структура: `/{locale}/products`, `/{locale}/products/{slug}`

## База данных

### Таблицы
- `categories` - Категории продуктов
- `products` - Продукты
- `managers` - Telegram менеджеры
- `inquiries` - Запросы цен
- `users` - Администраторы (тестовая система)

### Безопасность
- RLS политики настроены в миграциях (для Supabase совместимости)
- В приложении доступ контролируется через middleware и requireAuth()
- Публичный доступ на чтение для категорий и активных продуктов
- Публичная запись inquiries

## Заполнение данных

После настройки БД создайте:
1. Категории (Орехи, Бобовые, Сухофрукты)
2. Продукты (18 продуктов из списка)
3. Менеджера по умолчанию

Можно сделать это через админ-панель или SQL скрипты.

## Развертывание

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения
3. Deploy

### Другие платформы

Проект совместим с любой платформой, поддерживающей Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Важные замечания

- **Цены**: Хранятся в БД, но НИКОГДА не отображаются на публичном сайте
- **Telegram**: Интеграция через прямые ссылки, не через бота
- **Дизайн**: Минималистичный B2B стиль, без e-commerce паттернов
- **SEO**: Все страницы оптимизированы для поисковых систем

## Разработка

### Добавление нового компонента UI
```bash
npx shadcn-ui@latest add [component-name]
```

### Запуск линтера
```bash
npm run lint
```

### Типы TypeScript
Типы базы данных определены в `types/database.ts`. Обновите их при изменении схемы БД.

## Лицензия

Private project

## Поддержка

Для вопросов и предложений создайте issue в репозитории.

