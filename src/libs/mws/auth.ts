import { HTTPException } from "hono/http-exception";
import { bearerAuth } from "hono/bearer-auth";
import { verify } from "hono/jwt";

export const auth = bearerAuth({
  verifyToken: async (token) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new HTTPException(401, { message: "Process env failed" });
    const result = await verify(token, secret).catch((msg) => ({ err: true, msg: msg?.name }));
    if (result?.err) throw new HTTPException(401, { message: JSON.stringify(result?.msg) });
    if (!result) throw new HTTPException(401, { message: "Token verification failed" });
    return true;
  },
});
