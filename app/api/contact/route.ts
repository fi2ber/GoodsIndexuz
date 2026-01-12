import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db/connection";
import { getDefaultManagerAdmin } from "@/lib/db/queries";
import { logNotification } from "@/lib/notifications";

const schema = z.object({
  customer_name: z.string().min(1),
  customer_company: z.string().nullable().optional(),
  customer_email: z.string().email().nullable().optional().or(z.literal("")),
  customer_phone: z.string().nullable().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = schema.parse(body);

    const defaultManager = await getDefaultManagerAdmin();
    if (!defaultManager) {
      return NextResponse.json({ error: "No default manager configured" }, { status: 500 });
    }

    const composedMessage = `Contact page message\nSubject: ${validated.subject}\n\n${validated.message}`;

    const [inquiry] = await sql`
      INSERT INTO inquiries (
        product_id,
        manager_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_company,
        message,
        status
      ) VALUES (
        NULL,
        ${defaultManager.id},
        ${validated.customer_name},
        ${validated.customer_email || null},
        ${validated.customer_phone || null},
        ${validated.customer_company || null},
        ${composedMessage},
        'new'
      )
      RETURNING *
    `;

    await logNotification({
      userId: null,
      type: "new_contact",
      title: `New Contact Message from ${validated.customer_name}`,
      message: validated.subject,
      link: `/admin/inquiries/${inquiry.id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("Error in /api/contact:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}


