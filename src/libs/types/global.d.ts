import type { BlankEnv, BlankSchema } from "hono/types";
import type { Hono } from "hono";

type App = Hono<BlankEnv, BlankSchema, "api">;

declare global {
  var app: App;
}
