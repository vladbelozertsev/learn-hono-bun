import type { Context } from "hono";
import type { mimeTypes } from "./mime-types.js";
import { HTTPException } from "hono/http-exception";
import { onFile } from "./save-file.js";

type Prams = {
  ctx: Context;
  allowed?: { [Key in keyof typeof mimeTypes]?: boolean };
  dir: "public" | "private";
  onFile?: (savedAs?: string) => void;
};

export const upload = async (prams: Prams) => {
  const contentType = prams.ctx.req.raw.headers.get("Content-Type");
  const isMultipart = contentType?.includes("multipart/form-data");
  if (!isMultipart) throw new HTTPException(415, { message: "CONTENT_TYPE_IS_NOT_MULTIPART" });
  if (!prams.ctx.req.raw.body) throw new HTTPException(422, { message: "BODY_IS_UNDEFINED" });

  const formData = await prams.ctx.req.formData();
  const files = formData.getAll("files");

  const result = files.map(async (file) => {
    if (!(file instanceof Blob)) return;
    const savedAs = await onFile({ ...prams, file }).catch(console.error);
    if (savedAs && prams.onFile) prams.onFile(savedAs);
    return savedAs;
  });

  return Promise.allSettled(result);
};
