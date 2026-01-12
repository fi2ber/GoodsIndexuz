import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getProductSubmissionById, updateProductSubmission } from "@/lib/db/queries";
import { logAuditEvent } from "@/lib/audit/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Get submission
    const submission = await getProductSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.status !== "pending") {
      return NextResponse.json(
        { error: "Submission is not pending approval" },
        { status: 400 }
      );
    }

    // Update submission status to approved
    const updated = await updateProductSubmission(id, {
      status: "approved",
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
      message: "Submission approved successfully",
      submission: updated,
    });
  } catch (error: any) {
    console.error("Error approving submission:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve submission" },
      { status: 500 }
    );
  }
}

