import crypto from "crypto";
import { HTTPException } from "hono/http-exception";
import { OauthProvider, oauthClient } from "./client/-client";
import { setCookie } from "hono/cookie";

app.get("api/oauth/callback/:provider", (c) => {
  const provider = c.req.param("provider") as OauthProvider;
  const clent = oauthClient[provider] && oauthClient[provider]();
  if (!clent) throw new HTTPException(400, { message: "Invalid provider" });

  return c.json({
    asd: "ok",
  });
});
