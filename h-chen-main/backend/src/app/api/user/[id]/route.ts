import type { NextRequest } from "next/server";
import { createEdgeRouter } from "next-connect";
import { NextResponse } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" }
];

const getUser = (id: string) => mockUsers.find((u) => u.id === id);
const updateUser = (updated: User) => {
  const index = mockUsers.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    mockUsers[index] = updated;
    return updated;
  }
  return null;
};

const router = createEdgeRouter<NextRequest, RequestContext>();

// Middleware example
router.use(async (req, event, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  console.log(`Request took ${end - start}ms`);
});

// GET user
router.get(async (req, ctx) => {
  const id = ctx.params.id;
  const user = getUser(id);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
});

// PUT update user
router.put(async (req, ctx) => {
  const id = ctx.params.id;
  const body = await req.json();

  if (id !== body.id) {
    return NextResponse.json(
      { message: "You can't update another user's profile" },
      { status: 403 }
    );
  }

  const updated = updateUser(body);

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
});

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function PUT(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
