"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface Certificate {
  name: string;
  image_url: string;
  id?: string;
}

interface CertificatesManagerProps {
  certificates: Certificate[];
  onChange: (certificates: Certificate[]) => void;
  locale: "ru" | "en";
}

export function CertificatesManager({
  certificates,
  onChange,
  locale,
}: CertificatesManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCertificate, setNewCertificate] = useState<Partial<Certificate>>({
    name: "",
    image_url: "",
  });

  const handleAdd = () => {
    if (newCertificate.name && newCertificate.image_url) {
      onChange([
        ...certificates,
        {
          name: newCertificate.name,
          image_url: newCertificate.image_url,
          id: crypto.randomUUID(),
        },
      ]);
      setNewCertificate({ name: "", image_url: "" });
    }
  };

  const handleUpdate = (index: number, field: keyof Certificate, value: string) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    onChange(certificates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Certificates ({locale.toUpperCase()})</Label>
        <span className="text-sm text-muted-foreground">
          {certificates.length} certificate{certificates.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Existing Certificates */}
      <div className="space-y-3">
        {certificates.map((cert, index) => (
          <Card key={cert.id || index}>
            <CardContent className="p-4">
              <div className="flex gap-4 items-start">
                {cert.image_url && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0">
                    <Image
                      src={cert.image_url}
                      alt={cert.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    value={cert.name}
                    onChange={(e) => handleUpdate(index, "name", e.target.value)}
                    placeholder="Certificate name"
                  />
                  <Input
                    value={cert.image_url}
                    onChange={(e) => handleUpdate(index, "image_url", e.target.value)}
                    placeholder="Image URL"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Certificate */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Input
              value={newCertificate.name || ""}
              onChange={(e) =>
                setNewCertificate({ ...newCertificate, name: e.target.value })
              }
              placeholder="Certificate name"
            />
            <Input
              value={newCertificate.image_url || ""}
              onChange={(e) =>
                setNewCertificate({ ...newCertificate, image_url: e.target.value })
              }
              placeholder="Image URL"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              disabled={!newCertificate.name || !newCertificate.image_url}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

