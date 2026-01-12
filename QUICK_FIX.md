# Быстрое решение проблемы с tsx

Если возникает ошибка `tsx: command not found`, используйте один из вариантов:

## Вариант 1: Использовать node_modules напрямую

Скрипты уже обновлены для использования `./node_modules/.bin/tsx`. Просто запустите:

```bash
npm run db:setup
```

## Вариант 2: Установить tsx глобально

```bash
npm install -g tsx
```

Затем можно использовать `tsx` напрямую:
```bash
tsx scripts/setup-database.ts
```

## Вариант 3: Использовать yarn (если установлен)

```bash
yarn db:setup
```

## Вариант 4: Использовать node напрямую с tsx

```bash
node --import tsx scripts/setup-database.ts
```

Или если это не работает:
```bash
node --loader ./node_modules/tsx/esm.mjs scripts/setup-database.ts
```

## Вариант 5: Скомпилировать в JS (если ничего не помогает)

Создайте JS версии скриптов или используйте `ts-node`:

```bash
npm install -D ts-node
```

И измените скрипты на:
```json
"db:setup": "ts-node scripts/setup-database.ts"
```

## Рекомендация

Сначала попробуйте:
```bash
npm run db:setup
```

Если не работает, установите tsx глобально:
```bash
npm install -g tsx
```

Затем запускайте скрипты напрямую:
```bash
tsx scripts/setup-database.ts
```


