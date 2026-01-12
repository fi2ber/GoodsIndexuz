# 🚀 Инструкция по деплою на DigitalOcean (Droplet)

Эта инструкция поможет вам развернуть проект **GoodsIndexuz** на VPS (Droplet) с использованием Docker.

## 1. Подготовка сервера (Droplet)

1. Создайте Droplet на DigitalOcean (рекомендуется минимум 1 GB RAM, Ubuntu 22.04 или 24.04).
2. При создании выберите **"Marketplace"** и найдите **"Docker"** — это автоматически установит Docker и Docker Compose.
3. Зайдите на сервер по SSH:
   ```bash
   ssh root@your_droplet_ip
   ```

## 2. Копирование проекта на сервер

Вы можете использовать Git для клонирования репозитория прямо на сервер:
```bash
git clone https://github.com/your-username/GoodsIndexuz.git
cd GoodsIndexuz
```

## 3. Настройка переменных окружения

Создайте файл `.env` на основе примера:
```bash
cp env.prod.example .env
nano .env
```
Заполните `DB_PASSWORD` (придумайте сложный пароль) и `SITE_URL`.

## 4. Запуск приложения

Запустите проект в фоновом режиме:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Это команда:
1. Соберит Docker-образ приложения.
2. Запустит базу данных PostgreSQL.
3. Автоматически выполнит все миграции из папки `supabase/migrations`.
4. Запустит Next.js приложение на порту 3000.

## 5. Настройка Nginx и SSL (HTTPS)

Чтобы сайт открывался по домену и имел HTTPS, рекомендуется установить Nginx на самом сервере:

1. Установите Nginx:
   ```bash
   apt update && apt install nginx -y
   ```

2. Создайте конфиг для сайта:
   ```bash
   nano /etc/nginx/sites-available/goodsindexuz
   ```

   Вставьте (заменив `your-domain.com`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Активируйте конфиг и перезапустите Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/goodsindexuz /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

4. Установите SSL (Certbot):
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d your-domain.com
   ```

## 6. Резервное копирование и обслуживание

### Просмотр логов:
```bash
docker compose -f docker-compose.prod.yml logs -f app
```

### Обновление приложения:
```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Резервная копия базы данных:
```bash
docker exec goodsindexuz-postgres pg_dump -U postgres goodsindexuz > backup_$(date +%F).sql
```

## 📁 Загруженные файлы (Изображения)
Все изображения товаров хранятся в Docker Volume `uploads_data`. Они сохраняются при обновлении контейнеров.
Путь на хосте (обычно): `/var/lib/docker/volumes/goodsindexuz_uploads_data/_data`
