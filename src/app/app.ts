import { Hono } from "hono";
import { cors } from "hono/cors";

const basePath = "api" as const;
export const _app = new Hono().basePath(basePath);

global.app = _app;

_app.use(
  "*",
  cors({
    origin: ["http://localhost:3001", "http://192.168.0.10:3001"],
    // allowHeaders: ["Origin", "Content-Type", "Authorization"],
    // allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
    // credentials: true, // for cookies
  })
);
