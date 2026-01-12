import { NextRequest, NextResponse } from "next/server";
import { createProductSubmission } from "@/lib/db/queries";
import { logNotification } from "@/lib/notifications";
import { z } from "zod";

const submissionSchema = z.object({
  // Supplier info
  supplier_name: z.string().min(1),
  supplier_phone: z.string()
    .regex(/^\+998[0-9]{9}$/, "Invalid phone format. Must be +998XXXXXXXXX")
    .transform((val) => {
      // Нормализация: убираем пробелы, дефисы
      const cleaned = val.replace(/[\s-]/g, '');
      // Гарантируем формат +998XXXXXXXXX
      if (cleaned.startsWith('998')) return `+${cleaned}`;
      if (cleaned.startsWith('+998')) return cleaned;
      if (/^[0-9]{9}$/.test(cleaned)) return `+998${cleaned}`;
      return cleaned;
    }),
  supplier_email: z.string().email().optional().or(z.literal("")),
  supplier_company: z.string().optional(),
  supplier_location: z.string().optional(),
  
  // Product info
  product_name_ru: z.string().min(1),
  product_name_en: z.string().min(1),
  category_id: z.string().min(1),
  description_ru: z.string().max(2000).optional(),
  description_en: z.string().max(2000).optional(),
  hs_code: z.string().optional(),
  grade_ru: z.string().optional(),
  grade_en: z.string().optional(),
  origin_place_ru: z.string().optional(),
  origin_place_en: z.string().optional(),
  processing_method_ru: z.string().optional(),
  processing_method_en: z.string().optional(),
  moq: z.string().optional(),
  shelf_life: z.string().optional(),
  export_readiness: z.string().optional(),
  packaging_options: z.array(z.string()).optional(),
  calibers: z.array(z.string()).optional(),
  
  // Files
  images: z.array(z.string()).optional(),
  certificates: z.array(z.string()).optional(),
});

// Simple rate limiting by IP (in-memory, for production use Redis)
const submissionCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS_PER_HOUR = 3;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submissionCounts.get(ip);

  if (!record || now > record.resetTime) {
    submissionCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = submissionSchema.parse(body);

    // Create submission
    const submission = await createProductSubmission({
      supplier_name: validated.supplier_name,
      supplier_phone: validated.supplier_phone,
      supplier_email: validated.supplier_email || null,
      supplier_company: validated.supplier_company || null,
      supplier_location: validated.supplier_location || null,
      product_name_ru: validated.product_name_ru,
      product_name_en: validated.product_name_en,
      category_id: validated.category_id,
      description_ru: validated.description_ru || null,
      description_en: validated.description_en || null,
      hs_code: validated.hs_code || null,
      grade_ru: validated.grade_ru || null,
      grade_en: validated.grade_en || null,
      origin_place_ru: validated.origin_place_ru || null,
      origin_place_en: validated.origin_place_en || null,
      calibers: validated.calibers || [],
      processing_method_ru: validated.processing_method_ru || null,
      processing_method_en: validated.processing_method_en || null,
      packaging_options: validated.packaging_options || [],
      moq: validated.moq || null,
      shelf_life: validated.shelf_life || null,
      export_readiness: validated.export_readiness || null,
      images: validated.images || [],
      certificates: validated.certificates || [],
      status: "pending",
    });

    // Create notification for admin
    await logNotification({
      userId: null, // System notification
      type: "new_submission",
      title: `New Product Submission from ${validated.supplier_name}`,
      message: `Product: ${validated.product_name_en || validated.product_name_ru}`,
      link: `/admin/submissions/${submission.id}`,
    });

    return NextResponse.json({
      success: true,
      id: submission.id,
      access_token: submission.access_token,
      message: "Your submission has been received and will be reviewed within 2-3 business days.",
    });
  } catch (error: any) {
    console.error("Error creating product submission:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create submission" },
      { status: 500 }
    );
  }
}

