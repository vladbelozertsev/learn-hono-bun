import type { Hono } from "hono";
import { BlankEnv, BlankSchema } from "hono/types";

type App = Hono<BlankEnv, BlankSchema, "api">;

declare global {
  var app: App;
}
