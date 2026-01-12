import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { z } from "zod";
import { deleteImageFile } from "@/lib/utils/file-upload-server";
import { logAuditEvent } from "@/lib/audit/logger";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    const { id } = await params;
    const body = await request.json();
    console.log("Update product request body:", body);
    console.log("is_featured in request:", body.is_featured, typeof body.is_featured);
    const validated = productSchema.parse(body);
    console.log("Validated image_urls:", validated.image_urls);
    console.log("Validated is_featured:", validated.is_featured, typeof validated.is_featured);

    // Получаем старый продукт для audit log
    const [oldProduct] = await sql`
      SELECT * FROM products WHERE id = ${id} LIMIT 1
    `;

    if (!oldProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const oldImageUrls = Array.isArray(oldProduct.image_urls)
      ? (oldProduct.image_urls as string[])
      : [];
    const newImageUrls = validated.image_urls || [];
    console.log("Old image URLs:", oldImageUrls);
    console.log("New image URLs:", newImageUrls);

    // Находим удаленные изображения
    const deletedImages = oldImageUrls.filter(
      (url) => !newImageUrls.includes(url)
    );

    // Удаляем файлы удаленных изображений
    for (const imageUrl of deletedImages) {
      await deleteImageFile(imageUrl);
    }

    const imageUrlsJson = JSON.stringify(validated.image_urls || []);
    console.log("Saving image_urls to DB:", imageUrlsJson);

    // Ensure is_featured is a boolean
    const isFeatured = validated.is_featured === true || validated.is_featured === "true" || validated.is_featured === 1;
    console.log("Final is_featured value:", isFeatured);

    // Prepare JSON values for logistics_info fields
    const logisticsInfoRuJson = validated.logistics_info_ru 
      ? JSON.stringify(validated.logistics_info_ru) 
      : null;
    const logisticsInfoEnJson = validated.logistics_info_en 
      ? JSON.stringify(validated.logistics_info_en) 
      : null;

    // Try to update with all fields first, fallback to basic fields if columns don't exist
    let data;
    try {
      [data] = await sql`
        UPDATE products SET
          category_id = ${validated.category_id},
          name_ru = ${validated.name_ru},
          name_en = ${validated.name_en},
          variety_ru = ${validated.variety_ru || null},
          variety_en = ${validated.variety_en || null},
          origin_ru = ${validated.origin_ru || null},
          origin_en = ${validated.origin_en || null},
          packaging_options = ${JSON.stringify(validated.packaging_options)}::jsonb,
          moq = ${validated.moq || null},
          shelf_life = ${validated.shelf_life || null},
          export_readiness = ${validated.export_readiness || null},
          slug = ${validated.slug},
          image_urls = ${imageUrlsJson}::jsonb,
          hs_code = ${validated.hs_code || null},
          grade_ru = ${validated.grade_ru || null},
          grade_en = ${validated.grade_en || null},
          origin_place_ru = ${validated.origin_place_ru || null},
          origin_place_en = ${validated.origin_place_en || null},
          calibers = ${JSON.stringify(validated.calibers || [])}::jsonb,
          processing_method_ru = ${validated.processing_method_ru || null},
          processing_method_en = ${validated.processing_method_en || null},
          description_ru = ${validated.description_ru || null},
          description_en = ${validated.description_en || null},
          is_active = ${validated.is_active ?? true},
          is_featured = ${isFeatured},
          certificates_ru = ${JSON.stringify(validated.certificates_ru || [])}::jsonb,
          certificates_en = ${JSON.stringify(validated.certificates_en || [])}::jsonb,
          seasonality = ${JSON.stringify(validated.seasonality || [])}::jsonb,
          logistics_info_ru = ${logisticsInfoRuJson ? sql.unsafe(`'${logisticsInfoRuJson.replace(/'/g, "''")}'::jsonb`) : null},
          logistics_info_en = ${logisticsInfoEnJson ? sql.unsafe(`'${logisticsInfoEnJson.replace(/'/g, "''")}'::jsonb`) : null},
          video_url = ${validated.video_url || null},
          faqs_ru = ${JSON.stringify(validated.faqs_ru || [])}::jsonb,
          faqs_en = ${JSON.stringify(validated.faqs_en || [])}::jsonb,
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } catch (error: any) {
      // If columns don't exist, use simplified query without optional fields
      if (error?.message?.includes("does not exist")) {
        console.log("Optional columns not found, using simplified update");
        [data] = await sql`
          UPDATE products SET
            category_id = ${validated.category_id},
            name_ru = ${validated.name_ru},
            name_en = ${validated.name_en},
            variety_ru = ${validated.variety_ru || null},
            variety_en = ${validated.variety_en || null},
            origin_ru = ${validated.origin_ru || null},
            origin_en = ${validated.origin_en || null},
            packaging_options = ${JSON.stringify(validated.packaging_options)}::jsonb,
            moq = ${validated.moq || null},
            shelf_life = ${validated.shelf_life || null},
            export_readiness = ${validated.export_readiness || null},
            slug = ${validated.slug},
            image_urls = ${imageUrlsJson}::jsonb,
            hs_code = ${validated.hs_code || null},
            grade_ru = ${validated.grade_ru || null},
            grade_en = ${validated.grade_en || null},
            origin_place_ru = ${validated.origin_place_ru || null},
            origin_place_en = ${validated.origin_place_en || null},
            calibers = ${JSON.stringify(validated.calibers || [])}::jsonb,
            processing_method_ru = ${validated.processing_method_ru || null},
            processing_method_en = ${validated.processing_method_en || null},
            description_ru = ${validated.description_ru || null},
            description_en = ${validated.description_en || null},
            is_active = ${validated.is_active ?? true},
            is_featured = ${isFeatured},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
      } else {
        throw error;
      }
    }

    console.log("Updated product:", data);
    console.log("Updated product image_urls:", data.image_urls);
    console.log("Updated product image_urls type:", typeof data.image_urls);
    console.log("Updated product image_urls isArray:", Array.isArray(data.image_urls));
    
    // Убеждаемся, что image_urls правильно сериализуется
    const responseProduct = {
      ...data,
      image_urls: Array.isArray(data.image_urls) 
        ? data.image_urls 
        : (typeof data.image_urls === 'string' ? JSON.parse(data.image_urls) : [])
    };
    
    console.log("Response product image_urls:", responseProduct.image_urls);

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      entityType: "product",
      entityId: id,
      action: "update",
      oldData: oldProduct,
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

    console.error("Product update error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    return NextResponse.json(
      { error: errorMessage || "Internal server error", details: errorStack },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();

    const { id } = await params;

    // Check if product exists and get it for audit log
    const [product] = await sql`
      SELECT * FROM products WHERE id = ${id} LIMIT 1
    `;

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product
    await sql`
      DELETE FROM products
      WHERE id = ${id}
    `;

    // Log audit event
    try {
      await logAuditEvent({
        userId: user.id,
        entityType: "product",
        entityId: id,
        action: "delete",
        oldData: product,
      });
    } catch (auditError) {
      // Audit logging is optional, don't fail deletion if it fails
      console.warn("Failed to log audit event for product deletion:", auditError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Product deletion error:", error);
    
    // Return detailed error message for debugging
    const errorMessage = error?.message || "Internal server error";
    const statusCode = error?.code === "PGRST116" || errorMessage.includes("permission denied") || errorMessage.includes("new row violates row-level security")
      ? 403 
      : error?.code === "23503" 
      ? 409 
      : 500;

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error?.code || error?.detail || undefined
      },
      { status: statusCode }
    );
  }
}
