import crypto from "crypto";
import { HTTPException } from "hono/http-exception";
import { OauthProvider, oauthClient } from "./client/-all";
import { setCookie } from "hono/cookie";

export const stateCookieName = "oauth_state";
export const codeVerifierCookieName = "oauth_code_verifier";

app.get("api/oauth/url/:provider", (c) => {
  const provider = c.req.param("provider") as OauthProvider;
  const clent = oauthClient[provider] && oauthClient[provider]();
  if (!clent) throw new HTTPException(400, { message: "Invalid provider" });
  const state = crypto.randomBytes(64).toString("hex").normalize();
  const codeVerifier = crypto.randomBytes(64).toString("hex").normalize();

  const setOauthCookies = (name: string, value: string) => {
    setCookie(c, name, value, {
      // secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 600,
    });
  };

  setOauthCookies(stateCookieName, state);
  setOauthCookies(codeVerifierCookieName, codeVerifier);
  return c.json({ url: clent.createAuthUrl(state, codeVerifier) });
});
