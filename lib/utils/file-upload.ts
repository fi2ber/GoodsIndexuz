/**
 * Клиентские утилиты для работы с файлами
 * Используются в браузере для валидации перед загрузкой
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Валидация файла изображения
 */
export function validateImageFile(file: File): FileValidationResult {
  // Проверка типа MIME
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Проверка размера
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Проверка расширения
  const extension = getFileExtension(file.name);
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Получить расширение файла (с точкой)
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === filename.length - 1) {
    return ""; // Нет расширения или точка в конце
  }
  return filename.slice(lastDot).toLowerCase(); // Возвращаем с точкой: ".jpg"
}

/**
 * Генерация уникального имени файла
 */
export function generateFileName(originalName: string): string {
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .substring(0, 50);
  
  return `${timestamp}-${random}-${sanitizedName}`;
}

/**
 * Получить публичный URL изображения
 */
export function getImageUrl(productId: string, fileName: string): string {
  return `/uploads/products/${productId}/${fileName}`;
}

/**
 * Извлечь productId и fileName из URL
 */
export function parseImageUrl(url: string): { productId: string; fileName: string } | null {
  const match = url.match(/\/uploads\/products\/([^/]+)\/(.+)$/);
  if (!match) return null;
  
  return {
    productId: match[1],
    fileName: match[2],
  };
}
