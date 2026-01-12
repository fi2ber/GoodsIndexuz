import { NextRequest, NextResponse } from "next/server";
import { validateImageFile } from "@/lib/utils/file-upload";
import {
  generateFileName,
  saveFile,
  getImageUrl,
} from "@/lib/utils/file-upload-server";
import { addWatermark } from "@/lib/utils/watermark";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const submissionId = formData.get("submissionId") as string | null;

    // Для формы подачи товара используем временную папку
    const folderId = submissionId || `temp-submission-${Date.now()}`;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Валидация файла
      const validation = validateImageFile(file);
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      try {
        // Генерация имени файла
        const fileName = generateFileName(file.name);

        // Конвертация File в Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Добавление водяного знака
        const watermarkedBuffer = await addWatermark(buffer, "GoodsIndex.uz");

        // Сохранение файла с водяным знаком
        const imageUrl = await saveFile(watermarkedBuffer, folderId, fileName);
        uploadedUrls.push(imageUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        errors.push(`${file.name}: Failed to upload`);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        {
          error: "No files were uploaded",
          details: errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

