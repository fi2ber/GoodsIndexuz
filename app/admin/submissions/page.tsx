"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { DataTableToolbar } from "@/components/admin/DataTable/DataTableToolbar";
import { DataTablePagination } from "@/components/admin/DataTable/DataTablePagination";
import { DataTableFacetedFilter } from "@/components/admin/DataTable/DataTableFacetedFilter";
import { useDataTableFilters } from "@/hooks/useDataTableFilters";
import { format } from "date-fns";

type ProductSubmission = {
  id: string;
  supplier_name: string;
  supplier_email: string;
  supplier_company: string | null;
  product_name_ru: string;
  product_name_en: string;
  status: "pending" | "approved" | "rejected" | "needs_revision";
  created_at: string;
  reviewed_at: string | null;
  categories: {
    id: string;
    name_en: string;
    name_ru: string;
  } | null;
};

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ProductSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
  } = useDataTableFilters();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Needs Revision", value: "needs_revision" },
  ];

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

  const columns: ColumnDef<ProductSubmission>[] = useMemo(
    () => [
      {
        accessorKey: "product_name_en",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Product
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const submission = row.original;
          return (
            <div>
              <div className="font-medium">{submission.product_name_en}</div>
              <div className="text-sm text-muted-foreground">{submission.product_name_ru}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "supplier_name",
        header: "Supplier",
        cell: ({ row }) => {
          const submission = row.original;
          return (
            <div>
              <div className="font-medium">{submission.supplier_name}</div>
              {submission.supplier_company && (
                <div className="text-sm text-muted-foreground">{submission.supplier_company}</div>
              )}
              <div className="text-xs text-muted-foreground">{submission.supplier_email}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "categories",
        header: "Category",
        cell: ({ row }) => {
          const category = row.original.categories;
          return category ? (
            <span>{category.name_en}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
        filterFn: (row, id, value) => {
          const category = row.original.categories;
          return category ? value.includes(category.id) : false;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
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
          return format(new Date(row.original.created_at), "MMM d, yyyy");
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const submission = row.original;
          return (
            <Link href={`/admin/submissions/${submission.id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: submissions,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Product Submissions</h1>
          <p className="text-muted-foreground">Manage product submissions from suppliers</p>
        </div>
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Product Submissions</h1>
        <p className="text-muted-foreground">Manage product submissions from suppliers</p>
      </div>

      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        facetedFilters={[
          {
            columnId: "status",
            title: "Status",
            options: statusOptions,
          },
        ]}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

