"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  MessageSquare,
  Plus,
  FileDown,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    command();
    onOpenChange(false);
    setSearch("");
  };

  const navigationCommands = [
    {
      id: "dashboard",
      label: "Go to Dashboard",
      icon: LayoutDashboard,
      action: () => router.push("/admin/dashboard"),
    },
    {
      id: "categories",
      label: "Go to Categories",
      icon: FolderTree,
      action: () => router.push("/admin/categories"),
    },
    {
      id: "products",
      label: "Go to Products",
      icon: Package,
      action: () => router.push("/admin/products"),
    },
    {
      id: "managers",
      label: "Go to Managers",
      icon: Users,
      action: () => router.push("/admin/managers"),
    },
    {
      id: "inquiries",
      label: "Go to Inquiries",
      icon: MessageSquare,
      action: () => router.push("/admin/inquiries"),
    },
  ];

  const actionCommands = [
    {
      id: "new-product",
      label: "Create New Product",
      icon: Plus,
      action: () => router.push("/admin/products/new"),
    },
    {
      id: "new-category",
      label: "Create New Category",
      icon: Plus,
      action: () => router.push("/admin/categories/new"),
    },
    {
      id: "new-manager",
      label: "Create New Manager",
      icon: Plus,
      action: () => router.push("/admin/managers/new"),
    },
    {
      id: "export",
      label: "Export Data",
      icon: FileDown,
      action: () => {
        // This will be handled by the page component
        router.push("/admin/products");
      },
    },
  ];

  const filteredNavigation = navigationCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActions = actionCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." value={search} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {filteredNavigation.length > 0 && (
          <CommandGroup heading="Navigation">
            {filteredNavigation.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <CommandItem
                  key={cmd.id}
                  onSelect={() => runCommand(cmd.action)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {cmd.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        {filteredActions.length > 0 && (
          <CommandGroup heading="Actions">
            {filteredActions.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <CommandItem
                  key={cmd.id}
                  onSelect={() => runCommand(cmd.action)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {cmd.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

