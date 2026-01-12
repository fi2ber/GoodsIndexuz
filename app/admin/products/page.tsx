"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ArrowUpDown, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkActionBar } from "@/components/admin/BulkActions/BulkActionBar";
import { BulkDeleteDialog } from "@/components/admin/BulkActions/BulkDeleteDialog";
import { ExportDialog } from "@/components/admin/ExportDialog";
import { generateCSV, downloadCSV } from "@/lib/export/csv";
import { generateExcel, downloadExcel } from "@/lib/export/excel";
import Image from "next/image";
import { DataTable } from "@/components/admin/DataTable/DataTable";
import { DataTableToolbar } from "@/components/admin/DataTable/DataTableToolbar";
import { DataTablePagination } from "@/components/admin/DataTable/DataTablePagination";
import { DataTableFacetedFilter } from "@/components/admin/DataTable/DataTableFacetedFilter";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
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

// Component for featured toggle button
function FeaturedToggleButton({ product, onToggle }: { product: Product; onToggle: () => void }) {
  const [isToggling, setIsToggling] = useState(false);

  const handleClick = async () => {
    setIsToggling(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}/toggle-featured`, {
        method: "POST",
      });
      if (response.ok) {
        onToggle();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to toggle featured status");
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to toggle featured status");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isToggling}
      className={product.is_featured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-yellow-500"}
    >
      <Star className={`h-4 w-4 ${product.is_featured ? "fill-current" : ""}`} />
    </Button>
  );
}

type Product = {
  id: string;
  name_en: string;
  name_ru: string;
  slug: string;
  image_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  categories: {
    id: string;
    name_en: string;
    name_ru: string;
    slug: string;
  } | null;
};

type Category = {
  id: string;
  name_en: string;
  name_ru: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      label: cat.name_en,
      value: cat.id,
    }));
  }, [categories]);

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          operation: "delete",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to delete products");
        return;
      }

      setRowSelection({});
      fetchData();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Failed to delete products");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSingleDelete = async () => {
    if (!productToDelete) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to delete product");
        return;
      }

      setProductToDelete(null);
      setSingleDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setSingleDeleteDialogOpen(true);
  };

  const handleExport = (format: "csv" | "excel", fields: string[]) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.length > 0
      ? table.getFilteredSelectedRowModel().rows.map((row) => row.original)
      : table.getFilteredRowModel().rows.map((row) => row.original);

    const columns = [
      { key: "name_en" as const, label: "Name (EN)" },
      { key: "name_ru" as const, label: "Name (RU)" },
      { key: "slug" as const, label: "Slug" },
      { key: "is_active" as const, label: "Status" },
    ].filter((col) => fields.includes(col.key));

    if (format === "csv") {
      const csvContent = generateCSV(selectedRows, columns);
      downloadCSV(csvContent, `products-${new Date().toISOString().split("T")[0]}.csv`);
    } else {
      const workbook = generateExcel(selectedRows, columns, "Products");
      downloadExcel(workbook, `products-${new Date().toISOString().split("T")[0]}.xlsx`);
    }
  };

  const handleBulkStatusChange = async (status: boolean) => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          operation: status ? "activate" : "deactivate",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to update products");
        return;
      }

      setRowSelection({});
      fetchData();
    } catch (error) {
      console.error("Error updating products:", error);
      alert("Failed to update products");
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "image",
      header: "Image",
      cell: ({ row }) => {
        const images = row.original.image_urls || [];
        const mainImage = images[0];
        return (
          <div className="relative h-16 w-16 rounded-md overflow-hidden border">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={row.original.name_en}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "name_en",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name (EN)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name_en")}</div>
      ),
    },
    {
      accessorKey: "name_ru",
      header: "Name (RU)",
    },
    {
      id: "category",
      accessorFn: (row) => row.categories?.name_en || "N/A",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.categories;
        return category ? category.name_en : "N/A";
      },
      filterFn: (row, id, value) => {
        return value.includes(row.original.categories?.id || "");
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        const isActive = row.getValue(id) as boolean;
        if (value.includes("active")) return isActive;
        if (value.includes("inactive")) return !isActive;
        return true;
      },
    },
    {
      id: "is_featured",
      header: "Featured",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <FeaturedToggleButton
            product={product}
            onToggle={() => {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === product.id ? { ...p, is_featured: !p.is_featured } : p
                )
              );
            }}
          />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/admin/products/${product.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive"
              onClick={() => handleDeleteClick(product)}
              disabled={isProcessing}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <DataTableToolbar table={table} searchKey="name_en" />
            {categoryOptions.length > 0 && (
              <DataTableFacetedFilter
                column={table.getColumn("category")}
                title="Category"
                options={categoryOptions}
              />
            )}
            <DataTableFacetedFilter
              column={table.getColumn("is_active")}
              title="Status"
              options={statusOptions}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
      </div>

      <BulkActionBar
        selectedCount={Object.keys(rowSelection).length}
        onBulkDelete={() => setDeleteDialogOpen(true)}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkExport={() => setExportDialogOpen(true)}
      />

      <BulkDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        count={Object.keys(rowSelection).length}
        itemName="products"
      />

      <AlertDialog open={singleDeleteDialogOpen} onOpenChange={setSingleDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the product &quot;{productToDelete?.name_en || productToDelete?.name_ru}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSingleDelete} 
              className="bg-destructive text-destructive-foreground"
              disabled={isProcessing}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
        availableFields={[
          { key: "name_en", label: "Name (EN)" },
          { key: "name_ru", label: "Name (RU)" },
          { key: "slug", label: "Slug" },
          { key: "is_active", label: "Status" },
        ]}
      />
    </div>
  );
}
