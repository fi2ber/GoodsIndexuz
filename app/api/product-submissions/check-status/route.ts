import { NextRequest, NextResponse } from "next/server";
import { getProductSubmissionByToken } from "@/lib/db/queries";
import { z } from "zod";

const checkStatusSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = checkStatusSchema.parse(body);

    const submission = await getProductSubmissionByToken(validated.token);

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Verify email matches
    if (submission.supplier_email !== validated.email) {
      return NextResponse.json(
        { error: "Email does not match this submission" },
        { status: 403 }
      );
    }

    // Return status information
    return NextResponse.json({
      id: submission.id,
      status: submission.status,
      rejection_reason: submission.rejection_reason,
      created_at: submission.created_at,
      reviewed_at: submission.reviewed_at,
      product_name_ru: submission.product_name_ru,
      product_name_en: submission.product_name_en,
    });
  } catch (error: any) {
    console.error("Error checking submission status:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to check status" },
      { status: 500 }
    );
  }
}

