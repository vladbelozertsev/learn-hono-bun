import crypto from "crypto";
import { HTTPException } from "hono/http-exception";
import { OauthProvider, oauthClient } from "./client/-all";
import { setSecureCookie } from "../../libs/helpers/utils";

export const stateCookieName = "oauth_state";
export const codeVerifierCookieName = "oauth_code_verifier";

app.get("api/oauth/url/:provider", (c) => {
  const provider = c.req.param("provider") as OauthProvider;
  const clent = oauthClient[provider] && oauthClient[provider]();
  if (!clent) throw new HTTPException(400, { message: "Invalid provider" });
  const state = crypto.randomBytes(64).toString("hex").normalize();
  const codeVerifier = crypto.randomBytes(64).toString("hex").normalize();

  setSecureCookie(c, stateCookieName, state, { maxAge: 600 });
  setSecureCookie(c, codeVerifierCookieName, codeVerifier, { maxAge: 600 });
  return c.json({ url: clent.createAuthUrl(state, codeVerifier) });
});
