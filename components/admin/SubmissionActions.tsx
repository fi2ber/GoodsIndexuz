"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { Database } from "@/types/database";

type ProductSubmission = Database["public"]["Tables"]["product_submissions"]["Row"];

interface SubmissionActionsProps {
  submissionId: string;
  submission: ProductSubmission;
}

export function SubmissionActions({ submissionId, submission }: SubmissionActionsProps) {
  const router = useRouter();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve submission");
      }

      setApproveDialogOpen(false);
      router.refresh();
      router.push("/admin/submissions");
    } catch (error) {
      console.error("Error approving submission:", error);
      alert(error instanceof Error ? error.message : "Failed to approve submission");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject submission");
      }

      setRejectDialogOpen(false);
      setRejectionReason("");
      router.refresh();
    } catch (error) {
      console.error("Error rejecting submission:", error);
      alert(error instanceof Error ? error.message : "Failed to reject submission");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => setApproveDialogOpen(true)}
        className="flex items-center gap-2"
        disabled={isProcessing}
      >
        <CheckCircle2 className="h-4 w-4" />
        Approve
      </Button>

      <Button
        onClick={() => setRejectDialogOpen(true)}
        variant="destructive"
        className="flex items-center gap-2"
        disabled={isProcessing}
      >
        <XCircle className="h-4 w-4" />
        Reject
      </Button>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Product Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this submission? The submission will be marked as approved.
              You can create a product card manually later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium mb-2">Product: {submission.product_name_en}</p>
            <p className="text-sm text-muted-foreground">
              Supplier: {submission.supplier_name} ({submission.supplier_email})
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Approve Submission"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Product Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this submission. The supplier will be notified
              of the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Product does not meet export quality standards..."
                rows={4}
                className="mt-2"
                disabled={isProcessing}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isProcessing || !rejectionReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject Submission"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

