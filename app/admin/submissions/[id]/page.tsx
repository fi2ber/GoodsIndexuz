import { notFound } from "next/navigation";
import { getProductSubmissionById } from "@/lib/db/queries";
import { sql } from "@/lib/db/connection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { SubmissionActions } from "@/components/admin/SubmissionActions";
import Image from "next/image";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getProductSubmissionById(id);

  if (!submission) {
    notFound();
  }

  // Get category info
  let category: { id: string; name_en: string; name_ru: string } | null = null;
  if (submission.category_id) {
    const [cat] = await sql<Array<{ id: string; name_en: string; name_ru: string }>>`
      SELECT id, name_en, name_ru FROM categories WHERE id = ${submission.category_id}
    `;
    category = cat || null;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
      needs_revision: "secondary",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </Badge>
    );
  };

  const images = (Array.isArray(submission.images) ? submission.images : []) as string[];
  const certificates = (Array.isArray(submission.certificates) ? submission.certificates : []) as string[];
  const calibers = (Array.isArray(submission.calibers) ? submission.calibers : []) as string[];
  const packagingOptions = (Array.isArray(submission.packaging_options)
    ? submission.packaging_options
    : []) as string[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Submission Details</h1>
          <p className="text-muted-foreground">Review and manage submission</p>
        </div>
        {getStatusBadge(submission.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Information */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{submission.supplier_name}</p>
            </div>
            {submission.supplier_company && (
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{submission.supplier_company}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{submission.supplier_email}</p>
            </div>
            {submission.supplier_phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{submission.supplier_phone}</p>
              </div>
            )}
            {submission.supplier_location && (
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{submission.supplier_location}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Product Name (EN)</p>
              <p className="font-medium">{submission.product_name_en}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Product Name (RU)</p>
              <p className="font-medium">{submission.product_name_ru}</p>
            </div>
            {category && (
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{category.name_en}</p>
              </div>
            )}
            {submission.hs_code && (
              <div>
                <p className="text-sm text-muted-foreground">HS Code</p>
                <p className="font-medium">{submission.hs_code}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="font-medium">
                {format(new Date(submission.created_at), "MMM d, yyyy HH:mm")}
              </p>
            </div>
            {submission.reviewed_at && (
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="font-medium">
                  {format(new Date(submission.reviewed_at), "MMM d, yyyy HH:mm")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details */}
        {(submission.description_ru ||
          submission.description_en ||
          submission.grade_ru ||
          submission.grade_en ||
          submission.origin_place_ru ||
          submission.origin_place_en ||
          submission.processing_method_ru ||
          submission.processing_method_en ||
          submission.moq ||
          submission.shelf_life ||
          submission.export_readiness ||
          calibers.length > 0 ||
          packagingOptions.length > 0) && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.description_en && (
                <div>
                  <p className="text-sm text-muted-foreground">Description (EN)</p>
                  <p className="whitespace-pre-wrap">{submission.description_en}</p>
                </div>
              )}
              {submission.description_ru && (
                <div>
                  <p className="text-sm text-muted-foreground">Description (RU)</p>
                  <p className="whitespace-pre-wrap">{submission.description_ru}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submission.grade_en && (
                  <div>
                    <p className="text-sm text-muted-foreground">Grade (EN)</p>
                    <p className="font-medium">{submission.grade_en}</p>
                  </div>
                )}
                {submission.grade_ru && (
                  <div>
                    <p className="text-sm text-muted-foreground">Grade (RU)</p>
                    <p className="font-medium">{submission.grade_ru}</p>
                  </div>
                )}
                {submission.origin_place_en && (
                  <div>
                    <p className="text-sm text-muted-foreground">Origin Place (EN)</p>
                    <p className="font-medium">{submission.origin_place_en}</p>
                  </div>
                )}
                {submission.origin_place_ru && (
                  <div>
                    <p className="text-sm text-muted-foreground">Origin Place (RU)</p>
                    <p className="font-medium">{submission.origin_place_ru}</p>
                  </div>
                )}
                {submission.processing_method_en && (
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Method (EN)</p>
                    <p className="font-medium">{submission.processing_method_en}</p>
                  </div>
                )}
                {submission.processing_method_ru && (
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Method (RU)</p>
                    <p className="font-medium">{submission.processing_method_ru}</p>
                  </div>
                )}
                {submission.moq && (
                  <div>
                    <p className="text-sm text-muted-foreground">MOQ</p>
                    <p className="font-medium">{submission.moq}</p>
                  </div>
                )}
                {submission.shelf_life && (
                  <div>
                    <p className="text-sm text-muted-foreground">Shelf Life</p>
                    <p className="font-medium">{submission.shelf_life}</p>
                  </div>
                )}
                {submission.export_readiness && (
                  <div>
                    <p className="text-sm text-muted-foreground">Export Readiness</p>
                    <p className="font-medium">{submission.export_readiness}</p>
                  </div>
                )}
              </div>
              {calibers.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Calibers</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {calibers.map((caliber, idx) => (
                      <Badge key={idx} variant="outline">
                        {caliber}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {packagingOptions.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Packaging Options</p>
                  <ul className="list-disc list-inside mt-1">
                    {packagingOptions.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Images */}
        {images.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((imageUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={imageUrl}
                      alt={`Product image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Certificates & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {certificates.map((certUrl, idx) => {
                  const fileName = certUrl.split("/").pop() || `Certificate ${idx + 1}`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{fileName}</span>
                      </div>
                      <a
                        href={certUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Reason */}
        {submission.status === "rejected" && submission.rejection_reason && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Rejection Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive whitespace-pre-wrap">
                {submission.rejection_reason}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {submission.status === "pending" && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <SubmissionActions submissionId={submission.id} submission={submission} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

