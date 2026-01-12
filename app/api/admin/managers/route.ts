import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { z } from "zod";

const managerSchema = z.object({
  name: z.string(),
  telegram_username: z.string(),
  telegram_link: z.string().url(),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return z.string().email().safeParse(val).success;
      },
      { message: "Invalid email address" }
    )
    .transform((val) => (val === "" || !val ? undefined : val)),
  phone: z.string().optional(),
  whatsapp_link: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return z.string().url().safeParse(val).success;
      },
      { message: "Invalid WhatsApp link" }
    )
    .transform((val) => (val === "" || !val ? undefined : val)),
  is_active: z.boolean().default(true),
  is_default: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validated = managerSchema.parse(body);

    // If setting as default, unset other defaults
    if (validated.is_default) {
      await sql`
        UPDATE managers
        SET is_default = false
        WHERE is_default = true
      `;
    }

    const [data] = await sql`
      INSERT INTO managers (
        name,
        telegram_username,
        telegram_link,
        email,
        phone,
        whatsapp_link,
        is_active,
        is_default
      ) VALUES (
        ${validated.name},
        ${validated.telegram_username},
        ${validated.telegram_link},
        ${validated.email || null},
        ${validated.phone || null},
        ${validated.whatsapp_link || null},
        ${validated.is_active},
        ${validated.is_default}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, manager: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Manager creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

