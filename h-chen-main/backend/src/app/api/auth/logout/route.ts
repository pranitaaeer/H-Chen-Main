export const runtime = "nodejs"; // 👈 Force Node.js runtime

import { NextResponse } from "next/server";
import { sessionMiddleware } from "@/lib/session";

export async function GET(req: any) {
  // Run session middleware at runtime (Node.js only)
  await new Promise((resolve) => sessionMiddleware(req, {} as any, resolve));

  // Handle logout if passport is attached
  if (typeof req.logout === "function") {
    req.logout(() => {
      if (req.session) {
        req.session.destroy(() => {});
      }
    });
  }

  return NextResponse.json({ message: "Logged out" });
}
