import {
  getAllProducts,
  getAllInquiries,
  getInquiriesByDate,
  getTopProductsByInquiries,
  getInquiriesByCategory,
  getInquiryStats,
} from "@/lib/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { InquiriesChart } from "@/components/admin/Analytics/InquiriesChart";
import { TopProductsChart } from "@/components/admin/Analytics/TopProductsChart";
import { CategoryPieChart } from "@/components/admin/Analytics/CategoryPieChart";
import { ConversionFunnel } from "@/components/admin/Analytics/ConversionFunnel";
import { StatsCard } from "@/components/admin/Analytics/StatsCard";

export default async function AdminDashboard() {
  const [
    products,
    inquiries,
    inquiriesByDate,
    topProducts,
    categoryStats,
    inquiryStats,
  ] = await Promise.all([
    getAllProducts(),
    getAllInquiries(),
    getInquiriesByDate(30),
    getTopProductsByInquiries(5),
    getInquiriesByCategory(),
    getInquiryStats(),
  ]);

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter((i) => i.status === "new").length,
    contactedInquiries: inquiries.filter((i) => i.status === "contacted").length,
    closedInquiries: inquiries.filter((i) => i.status === "closed").length,
  };

  const conversionRate =
    stats.totalInquiries > 0
      ? ((stats.closedInquiries / stats.totalInquiries) * 100).toFixed(1)
      : "0";

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your export platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          description={`${stats.activeProducts} active`}
          iconName="Package"
        />
        <StatsCard
          title="Total Inquiries"
          value={stats.totalInquiries}
          description={`${stats.newInquiries} new`}
          iconName="MessageSquare"
        />
        <StatsCard
          title="New Inquiries"
          value={stats.newInquiries}
          description="Require attention"
          iconName="TrendingUp"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          description={`${stats.closedInquiries} closed`}
          iconName="CheckCircle"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inquiries Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <InquiriesChart data={inquiriesByDate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products by Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={topProducts} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryStats.length > 0 ? (
              <CategoryPieChart data={categoryStats} />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No category data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionFunnel
              total={inquiryStats.total}
              contacted={inquiryStats.contacted}
              closed={inquiryStats.closed}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No inquiries yet
                  </TableCell>
                </TableRow>
              ) : (
                recentInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>{inquiry.customer_name}</TableCell>
                    <TableCell>
                      {inquiry.products
                        ? inquiry.products.name_en || inquiry.products.name_ru
                        : "General"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          inquiry.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : inquiry.status === "contacted"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
