// disable-sort-imports

import { _app } from "./app";
import { prisma } from "../libs/prisma";
import "./routes.js";

process.on("exit", () => {
  prisma.$disconnect().catch(console.error);
});

export default _app;
