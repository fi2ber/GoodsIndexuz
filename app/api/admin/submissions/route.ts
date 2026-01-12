import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAllProductSubmissions } from "@/lib/db/queries";
import { sql } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const submissions = await getAllProductSubmissions();
    
    // Fetch categories for each submission
    const submissionsWithCategories = await Promise.all(
      submissions.map(async (submission) => {
        if (submission.category_id) {
          const [category] = await sql`
            SELECT id, name_en, name_ru FROM categories WHERE id = ${submission.category_id}
          `;
          return {
            ...submission,
            categories: category || null,
          };
        }
        return {
          ...submission,
          categories: null,
        };
      })
    );

    return NextResponse.json(submissionsWithCategories);
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

