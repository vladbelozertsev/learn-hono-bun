import type { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodSchema } from "zod";
import { zValidator } from "@hono/zod-validator";

export const validator = <T extends ZodSchema, Target extends keyof ValidationTargets>(prams: {
  target: Target;
  message?: string;
  schema: T;
}) => {
  return zValidator(prams.target, prams.schema, (result) => {
    if (!result.success) {
      const message = prams.message || "Zod validation failed!";
      throw new HTTPException(400, { message });
    }
  });
};
