import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireAuth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPaletteProvider } from "@/components/admin/CommandPaletteProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Получаем pathname из headers (добавлен middleware)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Не проверяем аутентификацию для страницы логина
  // Она имеет свой layout в app/admin/login/layout.tsx
  const isLoginPage = pathname === "/admin/login";
  
  if (!isLoginPage) {
    try {
      await requireAuth();
    } catch {
      redirect("/admin/login");
    }
  }

  // Для страницы логина возвращаем только children (без sidebar)
  // Но на самом деле login имеет свой layout, так что сюда не попадет
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
      <CommandPaletteProvider />
    </div>
  );
}

