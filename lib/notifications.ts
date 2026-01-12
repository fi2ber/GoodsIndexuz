import { sql } from "@/lib/db/connection";

interface LogNotificationParams {
  userId: string | null;
  type: string;
  title: string;
  message?: string | null;
  link?: string | null;
}

/**
 * Creates a notification in the database
 */
export async function logNotification({
  userId,
  type,
  title,
  message,
  link,
}: LogNotificationParams) {
  try {
    await sql`
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        link
      ) VALUES (
        ${userId || null},
        ${type},
        ${title},
        ${message || null},
        ${link || null}
      )
    `;
  } catch (error) {
    console.error("Error logging notification:", error);
    // Don't throw - notifications are not critical for the main flow
  }
}

