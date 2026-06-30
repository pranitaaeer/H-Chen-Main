// src/utils/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server"; // CORRECTED: Import UTApi from "uploadthing/server"

const f = createUploadthing();

// Define your FileRouter here. This is used by the API route handler.
export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log(`Uploadthing server callback: File ${file.name} uploaded. URL: ${file.url}`);
      return { uploadedFileName: file.name, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// CORRECTED: Export an instance of UTApi directly for server-side use.
// This instance will use your UPLOADTHING_SECRET and UPLOADTHING_APP_ID environment variables.
export const utapi = new UTApi();