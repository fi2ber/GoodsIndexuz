import { NextRequest, NextResponse } from "next/server";
import { getProductSubmissionById, getProductSubmissionByToken } from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    let submission;
    // Check if the ID itself looks like a token (64 hex chars) or if token is explicitly provided
    const looksLikeToken = /^[0-9a-f]{64}$/i.test(id);
    const actualToken = token || (looksLikeToken ? id : null);

    if (actualToken) {
      // Public access by token
      submission = await getProductSubmissionByToken(actualToken);
    } else {
      // Admin access by ID (would require auth in production)
      submission = await getProductSubmissionById(id);
    }

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Return only safe fields for public access
    if (actualToken) {
      return NextResponse.json({
        id: submission.id,
        status: submission.status,
        rejection_reason: submission.rejection_reason,
        created_at: submission.created_at,
        reviewed_at: submission.reviewed_at,
        product_name_ru: submission.product_name_ru,
        product_name_en: submission.product_name_en,
      });
    }

    // Return full data for admin
    return NextResponse.json(submission);
  } catch (error: any) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

