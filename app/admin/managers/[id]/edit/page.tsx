import { notFound } from "next/navigation";
import { sql } from "@/lib/db/connection";
import { ManagerForm } from "@/components/admin/ManagerForm";

export default async function EditManagerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [manager] = await sql`
    SELECT * FROM managers
    WHERE id = ${id}
    LIMIT 1
  `;

  if (!manager) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Manager</h1>
        <p className="text-muted-foreground">Update manager information</p>
      </div>

      <ManagerForm manager={manager} />
    </div>
  );
}

