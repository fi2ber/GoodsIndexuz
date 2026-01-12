"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQEditorProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
  locale: "ru" | "en";
}

export function FAQEditor({ faqs, onChange, locale }: FAQEditorProps) {
  const handleAdd = () => {
    onChange([...faqs, { question: "", answer: "" }]);
  };

  const handleUpdate = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Frequently Asked Questions ({locale.toUpperCase()})</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No FAQs added yet. Click &quot;Add FAQ&quot; to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">FAQ #{index + 1}</CardTitle>
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
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Question</Label>
                  <Input
                    value={faq.question}
                    onChange={(e) => handleUpdate(index, "question", e.target.value)}
                    placeholder="Enter question..."
                  />
                </div>
                <div>
                  <Label>Answer</Label>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => handleUpdate(index, "answer", e.target.value)}
                    placeholder="Enter answer..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

