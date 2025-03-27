import { _app } from "./app"; // imported first!!! declare Global Variables
import { prisma } from "../libs/prisma";
import "./routes.js";

process.on("exit", () => {
  prisma.$disconnect().catch(console.error);
});

export default _app;
