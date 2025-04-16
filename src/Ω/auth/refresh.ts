import { HTTPException } from "hono/http-exception";
import { Token } from "../../libs/types/token.js";
import { User } from "../../libs/types/user.js";
import { bearerAuth } from "hono/bearer-auth";
import { compare, hash } from "bcrypt";
import { decode, verify } from "hono/jwt";
import { sql } from "bun";
import { token } from "../../libs/helpers/token/index.js";

const refresh = bearerAuth({
  verifyToken: async (token) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new HTTPException(401, { message: "Process env failed" });
    const result = await verify(token, secret).catch(console.error);
    if (!result) throw new HTTPException(401, { message: "Invalid token" });
    return true;
  },
});

app.post("api/auth/refresh", refresh, async (c) => {
  const tokenJwt = c.req.header().authorization.split(" ")[1];
  const tokenDecoded = decode(tokenJwt).payload as Token;
  if (!tokenDecoded.id) throw new HTTPException(401, { message: "Id undefined" });

  const [user]: [User["value"] | undefined] = await sql`
    SELECT * FROM "Users"
    WHERE "id" = ${tokenDecoded.id}
  `;

  if (!user?.signature) throw new HTTPException(401, { message: "Token cancelled" });

  const isValid = await compare(tokenJwt.split(".")[2], user.signature);
  if (!isValid) throw new HTTPException(401, { message: "Token changed" });

  const accessToken = await token.access(tokenDecoded.id);
  const refreshToken = await token.refresh(tokenDecoded.id);
  const signature = await hash(refreshToken.split(".")[2], 10);

  await sql`
    UPDATE "Users"
    SET "signature" = ${signature}
    WHERE "id" = ${tokenDecoded.id};
  `;

  return c.json({ accessToken, refreshToken });
});
