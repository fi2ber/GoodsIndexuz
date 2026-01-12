"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/types/database";

type Manager = Database["public"]["Tables"]["managers"]["Row"];

const managerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  telegram_username: z.string().min(1, "Telegram username is required"),
  telegram_link: z.string().url("Invalid Telegram link"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return z.string().email().safeParse(val).success;
      },
      { message: "Invalid email address" }
    ),
  phone: z.string().optional(),
  whatsapp_link: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        return z.string().url().safeParse(val).success;
      },
      { message: "Invalid WhatsApp link" }
    ),
  is_active: z.boolean().default(true),
  is_default: z.boolean().default(false),
});

type ManagerFormData = z.infer<typeof managerSchema>;

interface ManagerFormProps {
  manager?: Manager;
}

export function ManagerForm({ manager }: ManagerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: manager
      ? {
          name: manager.name,
          telegram_username: manager.telegram_username,
          telegram_link: manager.telegram_link,
          email: manager.email || "",
          phone: manager.phone || "",
          whatsapp_link: manager.whatsapp_link || "",
          is_active: manager.is_active,
          is_default: manager.is_default,
        }
      : {
          is_active: true,
          is_default: false,
        },
  });

  const isActive = watch("is_active");
  const isDefault = watch("is_default");

  const onSubmit = async (data: ManagerFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url = manager
        ? `/api/admin/managers/${manager.id}`
        : "/api/admin/managers";
      const method = manager ? "PUT" : "POST";

      // Transform empty strings to undefined for optional fields
      const payload = {
        ...data,
        email: data.email === "" ? undefined : data.email,
        phone: data.phone === "" ? undefined : data.phone,
        whatsapp_link: data.whatsapp_link === "" ? undefined : data.whatsapp_link,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save manager");
      }

      router.push("/admin/managers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manager Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="telegram_username">Telegram Username *</Label>
            <Input
              id="telegram_username"
              placeholder="username (without @)"
              {...register("telegram_username")}
            />
            {errors.telegram_username && (
              <p className="text-sm text-destructive mt-1">
                {errors.telegram_username.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="telegram_link">Telegram Link *</Label>
            <Input
              id="telegram_link"
              placeholder="https://t.me/username"
              {...register("telegram_link")}
            />
            {errors.telegram_link && (
              <p className="text-sm text-destructive mt-1">
                {errors.telegram_link.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="manager@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Email address for contact
            </p>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">
                {errors.phone.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Phone number (e.g., +1234567890)
            </p>
          </div>

          <div>
            <Label htmlFor="whatsapp_link">WhatsApp Link</Label>
            <Input
              id="whatsapp_link"
              placeholder="https://wa.me/1234567890"
              {...register("whatsapp_link")}
            />
            {errors.whatsapp_link && (
              <p className="text-sm text-destructive mt-1">
                {errors.whatsapp_link.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Optional: WhatsApp link (e.g., https://wa.me/1234567890)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setValue("is_active", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              checked={isDefault}
              onChange={(e) => setValue("is_default", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_default">Set as default manager</Label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : manager
            ? "Update Manager"
            : "Create Manager"}
        </Button>
      </div>
    </form>
  );
}

