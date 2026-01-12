import { notFound } from "next/navigation";
import { sql } from "@/lib/db/connection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UpdateInquiryStatus } from "@/components/admin/UpdateInquiryStatus";
import { ExternalLink } from "lucide-react";
import type { InquiryStatus } from "@/lib/constants";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [inquiry] = await sql<Array<{
    id: string;
    product_id: string | null;
    manager_id: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    customer_company: string | null;
    message: string | null;
    telegram_sent: boolean;
    status: InquiryStatus;
    created_at: string;
    updated_at: string;
    products: {
      id: string;
      name_ru: string;
      name_en: string;
    } | null;
    managers: {
      id: string;
      name: string;
      telegram_username: string;
      telegram_link: string;
    };
  }>>`
    SELECT 
      i.*,
      CASE 
        WHEN i.product_id IS NOT NULL THEN
          json_build_object(
            'id', p.id,
            'name_ru', p.name_ru,
            'name_en', p.name_en
          )
        ELSE NULL
      END as products,
      json_build_object(
        'id', m.id,
        'name', m.name,
        'telegram_username', m.telegram_username,
        'telegram_link', m.telegram_link
      ) as managers
    FROM inquiries i
    LEFT JOIN products p ON i.product_id = p.id
    JOIN managers m ON i.manager_id = m.id
    WHERE i.id = ${id}
    LIMIT 1
  `;

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inquiry Details</h1>
          <p className="text-muted-foreground">View and manage inquiry</p>
        </div>
        <Badge
          variant={
            inquiry.status === "new"
              ? "default"
              : inquiry.status === "contacted"
              ? "secondary"
              : "outline"
          }
        >
          {inquiry.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{inquiry.customer_name}</p>
            </div>
            {inquiry.customer_company && (
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{inquiry.customer_company}</p>
              </div>
            )}
            {inquiry.customer_email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{inquiry.customer_email}</p>
              </div>
            )}
            {inquiry.customer_phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{inquiry.customer_phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inquiry Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-medium">
                {inquiry.products
                  ? inquiry.products.name_en || inquiry.products.name_ru
                  : "General Inquiry"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Manager</p>
              <p className="font-medium">{inquiry.managers.name}</p>
              <a
                href={inquiry.managers.telegram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
              >
                @{inquiry.managers.telegram_username}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {format(new Date(inquiry.created_at), "MMM d, yyyy HH:mm")}
              </p>
            </div>
          </CardContent>
        </Card>

        {inquiry.message && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{inquiry.message}</p>
            </CardContent>
          </Card>
        )}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateInquiryStatus inquiryId={inquiry.id} currentStatus={inquiry.status} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

