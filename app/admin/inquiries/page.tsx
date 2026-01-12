import { getAllInquiries } from "@/lib/db/queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">Manage customer price inquiries</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No inquiries yet
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{inquiry.customer_name}</div>
                      {inquiry.customer_company && (
                        <div className="text-sm text-muted-foreground">
                          {inquiry.customer_company}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {inquiry.products
                      ? inquiry.products.name_en || inquiry.products.name_ru
                      : "General"}
                  </TableCell>
                  <TableCell>{inquiry.managers.name}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {format(new Date(inquiry.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/inquiries/${inquiry.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

