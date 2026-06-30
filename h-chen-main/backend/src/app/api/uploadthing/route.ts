// src/app/api/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/utils/uploadthing"; // Adjust path if you placed it elsewhere

// Export the GET and POST handlers for Uploadthing
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});