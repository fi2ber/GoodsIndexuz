"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import { AuditDiff } from "./AuditDiff";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  entity_type: string;
  entity_id: string;
  action: "create" | "update" | "delete";
  old_data: any;
  new_data: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AuditTableProps {
  logs: AuditLog[];
}

export function AuditTable({ logs }: AuditTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delete":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "MMM d, yyyy HH:mm");
      },
    },
    {
      accessorKey: "entity_type",
      header: "Entity",
      cell: ({ row }) => {
        return (
          <span className="capitalize font-medium">
            {row.getValue("entity_type")}
          </span>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        return (
          <Badge className={getActionColor(action)}>
            {action.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "user_email",
      header: "User",
      cell: ({ row }) => {
        return row.getValue("user_email") || "System";
      },
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLog(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.id || (column.header as string)}
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                >
                  {typeof column.header === "function"
                    ? column.header({} as any)
                    : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="p-4">
                    {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="p-4">
                    <span className="capitalize font-medium">{log.entity_type}</span>
                  </td>
                  <td className="p-4">
                    <Badge className={getActionColor(log.action)}>
                      {log.action.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4">{log.user_email || "System"}</td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Entity Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedLog.entity_type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Entity ID</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedLog.entity_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Action</p>
                  <Badge className={getActionColor(selectedLog.action)}>
                    {selectedLog.action.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">User</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLog.user_email || "System"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedLog.created_at), "PPpp")}
                  </p>
                </div>
                {selectedLog.ip_address && (
                  <div>
                    <p className="text-sm font-medium">IP Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLog.ip_address}
                    </p>
                  </div>
                )}
              </div>
              <AuditDiff
                oldData={selectedLog.old_data}
                newData={selectedLog.new_data}
                action={selectedLog.action}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

