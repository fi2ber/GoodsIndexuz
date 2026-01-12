"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  LogOut,
  FolderTree,
  Image,
  FileText,
  ClipboardList,
  DollarSign,
} from "lucide-react";
import { NotificationBell } from "./Notifications/NotificationBell";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/submissions", label: "Product Submissions", icon: ClipboardList },
    { href: "/admin/managers", label: "Managers", icon: Users },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/fx-rates", label: "FX Rates", icon: DollarSign },
    { href: "/admin/media", label: "Media", icon: Image },
    { href: "/admin/audit", label: "Audit Log", icon: FileText },
  ];

  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <NotificationBell />
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 w-64 border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

