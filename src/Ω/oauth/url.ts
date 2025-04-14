import crypto from "crypto";
import { HTTPException } from "hono/http-exception";
import { OauthProvider, oauthClient } from "./client/-client";
import { setCookie } from "hono/cookie";

app.get("api/oauth/url/:provider", (c) => {
  const provider = c.req.param("provider") as OauthProvider;
  const clent = oauthClient[provider] && oauthClient[provider]();
  if (!clent) throw new HTTPException(400, { message: "Invalid provider" });
  const state = crypto.randomBytes(64).toString("hex").normalize();
  const codeVerifier = crypto.randomBytes(64).toString("hex").normalize();

  setCookie(c, "oauth-state", state, {
    // secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
  });

  setCookie(c, "oauth-code-verifier", codeVerifier, {
    // secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
  });

  return c.json({
    url: clent.createAuthUrl(state, codeVerifier),
  });
});
