import { sql } from "@/lib/db/connection";
import { headers } from "next/headers";

interface AuditLogData {
  userId?: string;
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete";
  oldData?: any;
  newData?: any;
}

export async function logAuditEvent(data: AuditLogData) {
  try {
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null;
    const userAgent = headersList.get("user-agent") || null;

    await sql`
      INSERT INTO audit_logs (
        user_id,
        entity_type,
        entity_id,
        action,
        old_data,
        new_data,
        ip_address,
        user_agent
      ) VALUES (
        ${data.userId || null},
        ${data.entityType},
        ${data.entityId},
        ${data.action},
        ${data.oldData ? JSON.stringify(data.oldData) : null}::jsonb,
        ${data.newData ? JSON.stringify(data.newData) : null}::jsonb,
        ${ipAddress ? ipAddress.split(",")[0].trim() : null}::inet,
        ${userAgent}
      )
    `;
  } catch (error) {
    // Don't throw - audit logging should not break the main flow
    console.error("Error logging audit event:", error);
  }
}

