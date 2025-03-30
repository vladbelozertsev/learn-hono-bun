import type { JWTPayload } from "hono/utils/jwt/types";
import { HTTPException } from "hono/http-exception";
import { User } from "../../libs/types/user.js";
import { bearerAuth } from "hono/bearer-auth";
import { compare } from "bcrypt";
import { decode } from "hono/jwt";
import { hash } from "bcrypt";
import { sql } from "bun";
import { token } from "../../libs/helpers/token";
import { verify } from "hono/jwt";

const refresh = bearerAuth({
  verifyToken: async (token) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new HTTPException(401, { message: "Process env failed" });
    const result = await verify(token, secret).catch(console.error);
    if (!result) throw new HTTPException(401, { message: "Invalid token" });
    return true;
  },
});

app.post("/auth/refresh", refresh, async (c) => {
  const tokenJwt = c.req.header().authorization.split(" ")[1];
  const tokenDecoded = decode(tokenJwt).payload as JWTPayload & { email: string };
  const noPayload = !tokenDecoded.exp || !tokenDecoded.email;
  if (noPayload) throw new HTTPException(401, { message: "Payload undefined" });

  const [user]: [User["value"] | undefined] = await sql`
    SELECT * FROM "Users"
    WHERE "email" = ${tokenDecoded.email}
  `;

  if (!user?.signature) throw new HTTPException(401, { message: "Token cancelled" });

  const isValid = await compare(tokenJwt.split(".")[2], user.signature);
  if (!isValid) throw new HTTPException(401, { message: "Token changed" });

  const accessTokenTime = +(process.env.JWT_ACCESS_TOKEN_LIFE_TIME_S || 0);
  const refreshTokenTime = +(process.env.JWT_REFRESH_TOKEN_LIFE_TIME_S || 0);
  const noTime = !accessTokenTime || !refreshTokenTime;
  if (noTime) throw new HTTPException(401, { message: "Time undefined" });

  const refreshTokenRestTime = tokenDecoded.exp! - Math.round(Date.now() / 1000) - 30;
  const isAccessTokenExpired = refreshTokenRestTime + accessTokenTime <= refreshTokenTime;
  if (isAccessTokenExpired) {
    const accessToken = await token.access(tokenDecoded.email);
    const refreshToken = await token.refresh(tokenDecoded.email);
    const signature = await hash(refreshToken.split(".")[2], 10);

    await sql`
      UPDATE "Users"
      SET "signature" = ${signature}
      WHERE "email" = ${tokenDecoded.email};
    `;

    return c.json({ accessToken, refreshToken });
  }

  await sql`
    UPDATE "Users"
    SET "signature" = ${""}
    WHERE "email" = ${tokenDecoded.email};
  `;

  throw new HTTPException(401, { message: "Suspicious activity" });
});
