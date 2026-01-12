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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;
    const body = await request.json();
    
    // Log incoming data for debugging
    console.log("Updating manager:", id, "Body:", JSON.stringify(body, null, 2));
    
    const validated = managerSchema.parse(body);
    
    // Log validated data
    console.log("Validated data:", JSON.stringify(validated, null, 2));

    // If setting as default, unset other defaults
    if (validated.is_default) {
      await sql`
        UPDATE managers
        SET is_default = false
        WHERE id != ${id} AND is_default = true
      `;
    }

    // Prepare values for SQL
    const emailValue = validated.email || null;
    const phoneValue = validated.phone || null;
    const whatsappLinkValue = validated.whatsapp_link || null;
    
    console.log("SQL values:", { emailValue, phoneValue, whatsappLinkValue });

    // Check if new columns exist, if not, update without them
    let result;
    try {
      // Try to update with new columns first
      result = await sql`
        UPDATE managers SET
          name = ${validated.name},
          telegram_username = ${validated.telegram_username},
          telegram_link = ${validated.telegram_link},
          email = ${emailValue},
          phone = ${phoneValue},
          whatsapp_link = ${whatsappLinkValue},
          is_active = ${validated.is_active},
          is_default = ${validated.is_default}
        WHERE id = ${id}
        RETURNING *
      `;
    } catch (sqlError: any) {
      // If columns don't exist, try without them
      if (sqlError.message?.includes("column") && 
          (sqlError.message?.includes("email") || 
           sqlError.message?.includes("phone") || 
           sqlError.message?.includes("whatsapp_link"))) {
        console.warn("New columns not found, updating without them. Please run migration 004.");
        result = await sql`
          UPDATE managers SET
            name = ${validated.name},
            telegram_username = ${validated.telegram_username},
            telegram_link = ${validated.telegram_link},
            is_active = ${validated.is_active},
            is_default = ${validated.is_default}
          WHERE id = ${id}
          RETURNING *
        `;
      } else {
        throw sqlError;
      }
    }

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Manager not found" },
        { status: 404 }
      );
    }

    const [data] = result;
    return NextResponse.json({ success: true, manager: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Manager update error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", message: errorMessage },
      { status: 500 }
    );
  }
}

