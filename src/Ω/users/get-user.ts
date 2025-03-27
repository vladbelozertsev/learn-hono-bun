import { HTTPException } from "hono/http-exception";
import { auth } from "../../libs/mws/auth.js";
import { decode } from "hono/jwt";
import { delkeys } from "../../libs/helpers/utils";
import { prisma } from "../../libs/prisma";

app.get("/users", auth, async (c) => {
  const tokenJwt = c.req.header().authorization.split(" ")[1];
  const tokenDecoded = decode(tokenJwt).payload as { email: string };

  if (!tokenDecoded.email) throw new HTTPException(401, { message: "Email is empty" });

  const user = await prisma.user.findUnique({
    where: { email: tokenDecoded.email },
  });

  if (!user) throw new HTTPException(401, { message: "User not found" });

  return c.json({ user: delkeys(user, ["password", "refreshToken"]) });
});
