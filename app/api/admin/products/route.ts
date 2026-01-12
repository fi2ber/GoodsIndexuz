import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { z } from "zod";
import { rename, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { logAuditEvent } from "@/lib/audit/logger";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { getAllProducts } = await import("@/lib/db/queries");
    const products = await getAllProducts();

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

const productSchema = z.object({
  category_id: z.string(),
  name_ru: z.string(),
  name_en: z.string(),
  variety_ru: z.string().optional(),
  variety_en: z.string().optional(),
  origin_ru: z.string().optional(),
  origin_en: z.string().optional(),
  packaging_options: z.array(z.string()),
  moq: z.string().optional(),
  shelf_life: z.string().optional(),
  export_readiness: z.string().optional(),
  slug: z.string(),
  image_urls: z.array(z.string()).optional(),
  hs_code: z.string().optional(),
  grade_ru: z.string().optional(),
  grade_en: z.string().optional(),
  origin_place_ru: z.string().optional(),
  origin_place_en: z.string().optional(),
  calibers: z.array(z.string()).optional(),
  processing_method_ru: z.string().optional(),
  processing_method_en: z.string().optional(),
  description_ru: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
  description_en: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  certificates_ru: z.array(z.object({
    name: z.string(),
    image_url: z.string(),
    id: z.string().optional(),
  })).optional(),
  certificates_en: z.array(z.object({
    name: z.string(),
    image_url: z.string(),
    id: z.string().optional(),
  })).optional(),
  seasonality: z.array(z.number().min(1).max(12)).optional(),
  logistics_info_ru: z.union([z.string(), z.record(z.any())]).optional().nullable(),
  logistics_info_en: z.union([z.string(), z.record(z.any())]).optional().nullable(),
  video_url: z.string().url().optional().nullable().or(z.literal("")),
  faqs_ru: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  faqs_en: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validated = productSchema.parse(body);

    // Prepare JSON values for logistics_info fields
    const logisticsInfoRuJson = validated.logistics_info_ru 
      ? JSON.stringify(validated.logistics_info_ru) 
      : null;
    const logisticsInfoEnJson = validated.logistics_info_en 
      ? JSON.stringify(validated.logistics_info_en) 
      : null;

    // Try to insert with all fields first, fallback to basic fields if columns don't exist
    let data;
    try {
      [data] = await sql`
        INSERT INTO products (
          category_id, name_ru, name_en, variety_ru, variety_en,
          origin_ru, origin_en, packaging_options, moq, shelf_life,
          export_readiness, slug, image_urls, hs_code, grade_ru, grade_en,
          origin_place_ru, origin_place_en, calibers, processing_method_ru,
          processing_method_en, description_ru, description_en, is_active, is_featured,
          certificates_ru, certificates_en, seasonality, logistics_info_ru,
          logistics_info_en, video_url, faqs_ru, faqs_en
        ) VALUES (
          ${validated.category_id}, ${validated.name_ru}, ${validated.name_en},
          ${validated.variety_ru || null}, ${validated.variety_en || null},
          ${validated.origin_ru || null}, ${validated.origin_en || null},
          ${JSON.stringify(validated.packaging_options)}::jsonb,
          ${validated.moq || null}, ${validated.shelf_life || null},
          ${validated.export_readiness || null}, ${validated.slug},
          ${JSON.stringify(validated.image_urls || [])}::jsonb,
          ${validated.hs_code || null}, ${validated.grade_ru || null},
          ${validated.grade_en || null}, ${validated.origin_place_ru || null},
          ${validated.origin_place_en || null},
          ${JSON.stringify(validated.calibers || [])}::jsonb,
          ${validated.processing_method_ru || null},
          ${validated.processing_method_en || null},
          ${validated.description_ru || null}, ${validated.description_en || null},
          ${validated.is_active}, ${validated.is_featured ?? false},
          ${JSON.stringify(validated.certificates_ru || [])}::jsonb,
          ${JSON.stringify(validated.certificates_en || [])}::jsonb,
          ${JSON.stringify(validated.seasonality || [])}::jsonb,
          ${logisticsInfoRuJson ? sql.unsafe(`'${logisticsInfoRuJson.replace(/'/g, "''")}'::jsonb`) : null},
          ${logisticsInfoEnJson ? sql.unsafe(`'${logisticsInfoEnJson.replace(/'/g, "''")}'::jsonb`) : null},
          ${validated.video_url || null},
          ${JSON.stringify(validated.faqs_ru || [])}::jsonb,
          ${JSON.stringify(validated.faqs_en || [])}::jsonb
        )
        RETURNING *
      `;
    } catch (error: any) {
      // If columns don't exist, use simplified query without optional fields
      if (error?.message?.includes("does not exist")) {
        console.log("Optional columns not found, using simplified insert");
        [data] = await sql`
          INSERT INTO products (
            category_id, name_ru, name_en, variety_ru, variety_en,
            origin_ru, origin_en, packaging_options, moq, shelf_life,
            export_readiness, slug, image_urls, hs_code, grade_ru, grade_en,
            origin_place_ru, origin_place_en, calibers, processing_method_ru,
            processing_method_en, description_ru, description_en, is_active, is_featured
          ) VALUES (
            ${validated.category_id}, ${validated.name_ru}, ${validated.name_en},
            ${validated.variety_ru || null}, ${validated.variety_en || null},
            ${validated.origin_ru || null}, ${validated.origin_en || null},
            ${JSON.stringify(validated.packaging_options)}::jsonb,
            ${validated.moq || null}, ${validated.shelf_life || null},
            ${validated.export_readiness || null}, ${validated.slug},
            ${JSON.stringify(validated.image_urls || [])}::jsonb,
            ${validated.hs_code || null}, ${validated.grade_ru || null},
            ${validated.grade_en || null}, ${validated.origin_place_ru || null},
            ${validated.origin_place_en || null},
            ${JSON.stringify(validated.calibers || [])}::jsonb,
            ${validated.processing_method_ru || null},
            ${validated.processing_method_en || null},
            ${validated.description_ru || null}, ${validated.description_en || null},
            ${validated.is_active}, ${validated.is_featured ?? false}
          )
          RETURNING *
        `;
      } else {
        throw error;
      }
    }

    // Обновляем image_urls если есть временные пути и перемещаем файлы
    let finalImageUrls = validated.image_urls || [];
    if (Array.isArray(finalImageUrls) && finalImageUrls.length > 0) {
      const productId = data.id;
      const uploadsDir = join(process.cwd(), "public", "uploads", "products");
      const updatedUrls: string[] = [];

      for (const imageUrl of finalImageUrls) {
        // Если URL содержит temp-, перемещаем файл
        if (imageUrl.includes("/temp-")) {
          try {
            const tempMatch = imageUrl.match(/\/temp-(\d+)\/(.+)$/);
            if (tempMatch) {
              const [, tempId, fileName] = tempMatch;
              const tempDir = join(uploadsDir, `temp-${tempId}`);
              const productDir = join(uploadsDir, productId);
              const oldPath = join(tempDir, fileName);
              const newPath = join(productDir, fileName);

              if (existsSync(oldPath)) {
                // Создаем директорию товара если не существует
                if (!existsSync(productDir)) {
                  await mkdir(productDir, { recursive: true });
                }
                
                // Перемещаем файл
                await rename(oldPath, newPath);
                
                // Обновляем URL
                const newUrl = imageUrl.replace(`/temp-${tempId}/`, `/${productId}/`);
                updatedUrls.push(newUrl);
              } else {
                // Если файл не найден, оставляем оригинальный URL
                updatedUrls.push(imageUrl);
              }
            } else {
              // Если не удалось распарсить, заменяем URL вручную
              const newUrl = imageUrl.replace(/\/temp-\d+\//, `/${productId}/`);
              updatedUrls.push(newUrl);
            }
          } catch (error) {
            console.error("Error moving temporary image:", error);
            // В случае ошибки заменяем URL, но файл может не существовать
            const newUrl = imageUrl.replace(/\/temp-\d+\//, `/${productId}/`);
            updatedUrls.push(newUrl);
          }
        } else {
          // Если не временный путь, оставляем как есть
          updatedUrls.push(imageUrl);
        }
      }

      // Обновляем в БД если были изменения
      if (JSON.stringify(updatedUrls) !== JSON.stringify(finalImageUrls)) {
        await sql`
          UPDATE products
          SET image_urls = ${JSON.stringify(updatedUrls)}::jsonb
          WHERE id = ${productId}
        `;
        finalImageUrls = updatedUrls;
      }
    }

    // Получаем финальный товар
    const [finalProduct] = await sql`
      SELECT * FROM products WHERE id = ${data.id} LIMIT 1
    `;

    const productData = finalProduct || data;
    console.log("Created product:", productData);
    console.log("Created product image_urls:", productData?.image_urls);
    console.log("Created product image_urls type:", typeof productData?.image_urls);
    console.log("Created product image_urls isArray:", Array.isArray(productData?.image_urls));
    
    // Убеждаемся, что image_urls правильно сериализуется
    const responseProduct = {
      ...productData,
      image_urls: Array.isArray(productData.image_urls) 
        ? productData.image_urls 
        : (typeof productData.image_urls === 'string' ? JSON.parse(productData.image_urls) : [])
    };
    
    console.log("Response product image_urls:", responseProduct.image_urls);

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      entityType: "product",
      entityId: data.id,
      action: "create",
      newData: responseProduct,
    });

    return NextResponse.json({ success: true, product: responseProduct });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

