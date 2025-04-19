import { HTTPException } from "hono/http-exception";
import { User } from "../../libs/types/user.js";
import { bearerAuth } from "hono/bearer-auth";
import { decode, verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { password, sql } from "bun";
import { setSecureCookie } from "../../libs/helpers/utils/index.js";
import { token } from "../../libs/helpers/token/index.js";

const getTokens = async (refreshTokenJwt: string) => {
  const id = decode(refreshTokenJwt)?.payload?.id as number;
  if (!id) throw new HTTPException(401, { message: "Id undefined" });
  const [user]: [User["value"] | undefined] = await sql`SELECT * FROM "Users" WHERE "id" = ${id}`;
  if (!user?.signature) throw new HTTPException(401, { message: "Token cancelled" });
  const isValid = await password.verify(refreshTokenJwt.split(".")[2], user.signature);
  if (!isValid) throw new HTTPException(401, { message: "Token changed" });
  const accessToken = await token.access(id);
  const refreshToken = await token.refresh(id);
  const signature = await password.hash(refreshToken.split(".")[2]);
  await sql`UPDATE "Users" SET "signature" = ${signature} WHERE "id" = ${id};`;
  return { accessToken, refreshToken };
};

const verifyToken = async (token: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new HTTPException(401, { message: "Process env failed" });
  const result = await verify(token, secret).catch((msg) => ({ err: true, msg: msg?.name }));
  if (result?.err) throw new HTTPException(401, { message: JSON.stringify(result?.msg) });
  if (!result) throw new HTTPException(401, { message: "Refresh token verification failed" });
  return true;
};

app.get("api/auth/refresh", bearerAuth({ verifyToken }), async (c) => {
  const tokenJwt = c.req.header().authorization.split(" ")[1];
  const tokens = await getTokens(tokenJwt);
  return c.json(tokens);
});

app.get(
  "api/auth/refresh/web",
  async (c, next) => {
    const refreshToken = getCookie(c, "refresh_token");
    if (!refreshToken) throw new HTTPException(401, { message: "Refresh cookie undefined" });
    await verifyToken(refreshToken).then(() => next());
  },
  async (c) => {
    const tokenJwt = getCookie(c, "refresh_token")!;
    const { accessToken, refreshToken } = await getTokens(tokenJwt);
    const maxAge = +(process.env.JWT_REFRESH_TOKEN_LIFE_TIME_S || 0);
    setSecureCookie(c, "refresh_token", refreshToken, { maxAge });
    return c.json({ accessToken });
  }
);
