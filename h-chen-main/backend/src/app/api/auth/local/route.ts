import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import passport from "@/lib/passport";
import { sessionMiddleware } from "@/lib/session";
import { connectToMongoDB } from "@/lib/db";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .use(async (req, event, next) => {
    // ✅ Connect to DB at runtime, not during build
    await connectToMongoDB();

    // Attach session + passport middleware
    // @ts-ignore
    await new Promise((resolve) => sessionMiddleware(req as any, {} as any, resolve));
    // @ts-ignore
    await new Promise((resolve) => passport.initialize()(req as any, {} as any, resolve));
    // @ts-ignore
    await new Promise((resolve) => passport.session()(req as any, {} as any, resolve));

    await next();
  })
  .post(async (req: any) => {
    return await new Promise((resolve) => {
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        if (!user) return resolve(NextResponse.json({ error: info?.message }, { status: 401 }));

        req.logIn(user, (err: any) => {
          if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          resolve(NextResponse.json({ message: "Logged in", user }));
        });
      })(req as any);
    });
  });

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
