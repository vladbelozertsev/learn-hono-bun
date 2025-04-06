import "./routes.js";
import { _app } from "./app";
import { prisma } from "../libs/prisma";

process.on("exit", () => {
  prisma.$disconnect().catch(console.error);
});

export default _app;
