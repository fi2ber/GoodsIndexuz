import sharp from "sharp";

/**
 * Добавить водяной знак на изображение
 * @param imageBuffer - Buffer изображения
 * @param watermarkText - Текст водяного знака (по умолчанию "GoodsIndex.uz")
 * @returns Buffer изображения с водяным знаком
 */
export async function addWatermark(
  imageBuffer: Buffer,
  watermarkText: string = "GoodsIndex.uz"
): Promise<Buffer> {
  try {
    // Получаем метаданные изображения
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // Размер шрифта зависит от размера изображения
    const fontSize = Math.max(24, Math.min(width, height) / 20);
    const padding = fontSize / 2;

    // Создаем SVG водяного знака
    const svgWatermark = `
      <svg width="${width}" height="${height}">
        <text
          x="${width - padding}"
          y="${height - padding}"
          font-family="Arial, sans-serif"
          font-size="${fontSize}"
          font-weight="bold"
          fill="rgba(255, 255, 255, 0.7)"
          text-anchor="end"
          dominant-baseline="bottom"
        >${watermarkText}</text>
      </svg>
    `;

    // Накладываем водяной знак на изображение
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(svgWatermark),
          top: 0,
          left: 0,
        },
      ])
      .toBuffer();

    return watermarkedImage;
  } catch (error) {
    console.error("Error adding watermark:", error);
    // В случае ошибки возвращаем оригинальное изображение
    return imageBuffer;
  }
}

