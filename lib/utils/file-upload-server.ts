/**
 * Серверные утилиты для работы с файлами
 * Используются только в API routes (Node.js environment)
 */

import { writeFile, mkdir, unlink, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { generateFileName, getImageUrl, parseImageUrl } from "./file-upload";

/**
 * Получить путь для сохранения файла
 */
export function getUploadPath(productId: string, fileName: string): string {
  return join(process.cwd(), "public", "uploads", "products", productId, fileName);
}

/**
 * Убедиться что директория существует
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * Удалить файл изображения
 */
export async function deleteImageFile(imageUrl: string): Promise<boolean> {
  try {
    const parsed = parseImageUrl(imageUrl);
    if (!parsed) {
      console.error("Invalid image URL format:", imageUrl);
      return false;
    }

    const filePath = getUploadPath(parsed.productId, parsed.fileName);
    
    // Проверяем существование файла
    if (!existsSync(filePath)) {
      console.warn("File does not exist:", filePath);
      return false;
    }

    await unlink(filePath);
    return true;
  } catch (error) {
    console.error("Error deleting image file:", error);
    return false;
  }
}

/**
 * Сохранить файл на диск
 */
export async function saveFile(
  file: Buffer,
  productId: string,
  fileName: string
): Promise<string> {
  const dirPath = join(process.cwd(), "public", "uploads", "products", productId);
  await ensureDirectoryExists(dirPath);

  const filePath = getUploadPath(productId, fileName);
  await writeFile(filePath, file);

  return getImageUrl(productId, fileName);
}

/**
 * Проверить существование файла
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

// Re-export для удобства
export { generateFileName, getImageUrl, parseImageUrl } from "./file-upload";

