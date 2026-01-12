import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getProductSubmissionById, updateProductSubmission } from "@/lib/db/queries";
import { z } from "zod";
import { logAuditEvent } from "@/lib/audit/logger";

const rejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const validated = rejectSchema.parse(body);

    // Get submission
    const submission = await getProductSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.status !== "pending") {
      return NextResponse.json(
        { error: "Submission is not pending" },
        { status: 400 }
      );
    }

    // Update submission status
    const updated = await updateProductSubmission(id, {
      status: "rejected",
      rejection_reason: validated.reason,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update submission" },
        { status: 500 }
      );
    }

    // Log audit event
    await logAuditEvent({
      userId: user.id,
      entityType: "product_submission",
      entityId: id,
      action: "update",
      oldData: submission,
      newData: updated,
    });

    return NextResponse.json({
      success: true,
      message: "Submission rejected successfully",
    });
  } catch (error: any) {
    console.error("Error rejecting submission:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to reject submission" },
      { status: 500 }
    );
  }
}

