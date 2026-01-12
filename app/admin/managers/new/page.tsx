import { ManagerForm } from "@/components/admin/ManagerForm";

export default function NewManagerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Manager</h1>
        <p className="text-muted-foreground">Add a new Telegram manager</p>
      </div>

      <ManagerForm />
    </div>
  );
}

