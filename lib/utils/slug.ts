/**
 * Генерация slug из строки
 * Транслитерация кириллицы, lowercase, замена пробелов на дефисы
 */
export function generateSlug(text: string): string {
  // Транслитерация кириллицы в латиницу
  const transliterationMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => transliterationMap[char] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-") // Замена не-латинских символов на дефисы
    .replace(/(^-|-$)/g, "") // Удаление дефисов в начале и конце
    .substring(0, 100); // Ограничение длины
}

/**
 * Проверка уникальности slug
 */
export async function checkSlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/admin/products/check-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ""}`
    );
    if (!response.ok) {
      return true; // В случае ошибки считаем уникальным
    }
    const data = await response.json();
    return data.unique ?? true;
  } catch {
    return true; // В случае ошибки считаем уникальным
  }
}

