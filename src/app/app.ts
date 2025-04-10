import { Hono } from "hono";
import { cors } from "hono/cors";
import { privatemw } from "../libs/mws/private";
import { serveStatic } from "hono/bun";

export const _app = new Hono();
_app.get("public/*", serveStatic({}));

_app.get("private/*", privatemw, serveStatic({}));

_app.use(
  "*",
  cors({
    origin: ["http://localhost:3001", "http://192.168.0.10:3001"],
    // allowHeaders: ["Origin", "Content-Type", "Authorization"],
    // allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
    // credentials: true, // for cookies
  })
);

global.app = _app;
