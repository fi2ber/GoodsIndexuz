import Link from "next/link";
import { getAllManagers } from "@/lib/db/queries";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";

export default async function AdminManagersPage() {
  const managers = await getAllManagers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Managers</h1>
          <p className="text-muted-foreground">Manage Telegram managers for inquiries</p>
        </div>
        <Link href="/admin/managers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Manager
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Telegram Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No managers yet. Create your first manager.
                </TableCell>
              </TableRow>
            ) : (
              managers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell className="font-medium">{manager.name}</TableCell>
                  <TableCell>@{manager.telegram_username}</TableCell>
                  <TableCell>
                    <Badge variant={manager.is_active ? "default" : "secondary"}>
                      {manager.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {manager.is_default && (
                      <Badge variant="outline">Default</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/managers/${manager.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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

