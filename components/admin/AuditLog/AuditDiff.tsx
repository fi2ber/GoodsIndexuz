"use client";

interface AuditDiffProps {
  oldData: any;
  newData: any;
  action: "create" | "update" | "delete";
}

export function AuditDiff({ oldData, newData, action }: AuditDiffProps) {
  if (action === "create") {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">New Data</h3>
        <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
          {JSON.stringify(newData, null, 2)}
        </pre>
      </div>
    );
  }

  if (action === "delete") {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Deleted Data</h3>
        <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
          {JSON.stringify(oldData, null, 2)}
        </pre>
      </div>
    );
  }

  // Update action - show diff
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Previous Values</h3>
        <pre className="bg-red-50 dark:bg-red-950 p-4 rounded-md text-xs overflow-x-auto border border-red-200 dark:border-red-800">
          {oldData ? JSON.stringify(oldData, null, 2) : "No previous data"}
        </pre>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">New Values</h3>
        <pre className="bg-green-50 dark:bg-green-950 p-4 rounded-md text-xs overflow-x-auto border border-green-200 dark:border-green-800">
          {newData ? JSON.stringify(newData, null, 2) : "No new data"}
        </pre>
      </div>
    </div>
  );
}

