import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { sql } from "@/lib/db/connection";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "media");

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get("folder");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let query;
    if (folder && search) {
      query = sql`
        SELECT * FROM media
        WHERE folder = ${folder}
          AND (original_name ILIKE ${`%${search}%`} OR alt_text ILIKE ${`%${search}%`})
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else if (folder) {
      query = sql`
        SELECT * FROM media
        WHERE folder = ${folder}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else if (search) {
      query = sql`
        SELECT * FROM media
        WHERE original_name ILIKE ${`%${search}%`} OR alt_text ILIKE ${`%${search}%`}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      query = sql`
        SELECT * FROM media
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    const media = await query;
    return NextResponse.json({ media });
  } catch (error: any) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "general";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const folderDir = join(UPLOAD_DIR, folder);
    if (!existsSync(folderDir)) {
      await mkdir(folderDir, { recursive: true });
    }

    const uploadedMedia = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split(".").pop();
      const filename = `${timestamp}-${randomStr}.${extension}`;
      const filepath = join(folderDir, filename);

      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Get image metadata
      const metadata = await sharp(buffer).metadata();
      const url = `/uploads/media/${folder}/${filename}`;

      // Save to database
      const [mediaItem] = await sql`
        INSERT INTO media (
          filename,
          original_name,
          mime_type,
          size,
          width,
          height,
          url,
          folder
        ) VALUES (
          ${filename},
          ${file.name},
          ${file.type},
          ${file.size},
          ${metadata.width || null},
          ${metadata.height || null},
          ${url},
          ${folder}
        )
        RETURNING *
      `;

      uploadedMedia.push(mediaItem);
    }

    return NextResponse.json({ media: uploadedMedia });
  } catch (error: any) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload media" },
      { status: 500 }
    );
  }
}

