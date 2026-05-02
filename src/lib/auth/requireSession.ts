import { readSession } from "@/lib/auth/session";
import type { UserRole } from "@prisma/client";

export async function requireSession(roles?: UserRole[]) {
  const session = await readSession();
  if (!session) return { error: "Unauthorized" as const, session: null };
  if (roles?.length && !roles.includes(session.role)) {
    return { error: "Forbidden" as const, session: null };
  }
  return { error: null, session };
}
