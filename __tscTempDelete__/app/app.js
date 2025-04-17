"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._app = void 0;
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var private_1 = require("../libs/mws/private");
var bun_1 = require("hono/bun");
exports._app = new hono_1.Hono();
exports._app.get("public/*", (0, bun_1.serveStatic)({}));
exports._app.get("private/*", private_1.privatemw, (0, bun_1.serveStatic)({}));
exports._app.use("*", (0, cors_1.cors)({
    origin: "http://localhost:3001",
    // allowHeaders: ["Origin", "Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    // allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
    credentials: true, // for cookies
}));
global.app = exports._app;
/**
 * Typescript errors:
 * 1. install global typescript: <| bun install -g typescript |>
 * 1.1 to uninstall global tsc: <| bun uninstall typescript |>
 * https://www.typescriptlang.org/download/
 *
 * 2. Add command to package.json:
 * <| "ts": "tsc --skipLibCheck", |>
 * https://stackoverflow.com/questions/51634361/how-to-force-tsc-to-ignore-node-modules-folder
 */
