import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db/connection";
import { getDefaultManagerAdmin } from "@/lib/db/queries";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const inquirySchema = z.object({
  product_id: z.string().nullable().optional(),
  customer_name: z.string().min(1),
  customer_email: z.string().email().optional().or(z.literal("")),
  customer_phone: z.string().optional(),
  customer_company: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquirySchema.parse(body);

    // Get default manager
    const defaultManager = await getDefaultManagerAdmin();
    
    // Log manager data for debugging
    console.log("Default manager data:", JSON.stringify({
      id: defaultManager?.id,
      name: defaultManager?.name,
      email: defaultManager?.email,
      phone: defaultManager?.phone,
      whatsapp_link: defaultManager?.whatsapp_link,
      telegram_link: defaultManager?.telegram_link,
    }, null, 2));
    
    if (!defaultManager) {
      return NextResponse.json(
        { error: "No default manager configured" },
        { status: 500 }
      );
    }

    // Create inquiry
    const [data] = await sql`
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
        ${validated.product_id || null},
        ${defaultManager.id},
        ${validated.customer_name},
        ${validated.customer_email || null},
        ${validated.customer_phone || null},
        ${validated.customer_company || null},
        ${validated.message || null},
        'new'
      )
      RETURNING *
    `;

    // Generate inquiry text for links
    const inquiryText = `Inquiry #${data.id}\n\nName: ${validated.customer_name}\n${
      validated.customer_email ? `Email: ${validated.customer_email}\n` : ""
    }${validated.customer_phone ? `Phone: ${validated.customer_phone}\n` : ""}${
      validated.customer_company ? `Company: ${validated.customer_company}\n` : ""
    }${validated.message ? `\nMessage: ${validated.message}` : ""}`;

    // Generate Telegram link with pre-filled message
    const telegramLink = defaultManager.telegram_link
      ? `${defaultManager.telegram_link}?text=${encodeURIComponent(inquiryText)}`
      : null;

    // Generate WhatsApp link with pre-filled message
    let whatsappLink = null;
    if (defaultManager.whatsapp_link) {
      // If whatsapp_link is already a full URL, append text parameter
      // Otherwise, construct wa.me link from phone number
      if (defaultManager.whatsapp_link.startsWith("https://wa.me/")) {
        whatsappLink = `${defaultManager.whatsapp_link}?text=${encodeURIComponent(inquiryText)}`;
      } else if (defaultManager.whatsapp_link.startsWith("wa.me/")) {
        whatsappLink = `https://${defaultManager.whatsapp_link}?text=${encodeURIComponent(inquiryText)}`;
      } else {
        // Assume it's a phone number, construct wa.me link
        const phoneNumber = defaultManager.whatsapp_link.replace(/[^\d+]/g, "");
        whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(inquiryText)}`;
      }
    }

    // Generate email link with subject and body
    const emailSubject = encodeURIComponent(`Inquiry #${data.id} - ${validated.customer_name}`);
    const emailBody = encodeURIComponent(inquiryText);
    const emailLink = defaultManager.email
      ? `mailto:${defaultManager.email}?subject=${emailSubject}&body=${emailBody}`
      : null;

    // Generate phone link
    const phoneLink = defaultManager.phone
      ? `tel:${defaultManager.phone.replace(/[^\d+]/g, "")}`
      : null;

    // Create notification for all admin users
    try {
      const adminUsers = await sql`
        SELECT id FROM users WHERE role = 'admin'
      `;
      
      for (const admin of adminUsers) {
        await sql`
          INSERT INTO notifications (user_id, type, title, message, link)
          VALUES (
            ${admin.id},
            'inquiry',
            'New Inquiry Received',
            ${`New inquiry from ${validated.customer_name}${validated.customer_company ? ` (${validated.customer_company})` : ""}`},
            ${`/admin/inquiries/${data.id}`}
          )
        `;
      }
    } catch (notificationError) {
      // Log but don't fail the inquiry creation
      console.error("Error creating notification:", notificationError);
    }

    return NextResponse.json({
      success: true,
      inquiry: data,
      manager_contacts: {
        telegram_link: telegramLink,
        whatsapp_link: whatsappLink,
        email: defaultManager.email,
        email_link: emailLink,
        phone: defaultManager.phone,
        phone_link: phoneLink,
        name: defaultManager.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Inquiry error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

