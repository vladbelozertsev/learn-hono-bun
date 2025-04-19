import { OauthProvider, oauthClient } from "./client/-all";
import { User } from "../../libs/types/user";
import { codeVerifierCookieName, stateCookieName } from "./url";
import { getCookie } from "hono/cookie";
import { password, sql } from "bun";
import { setSecureCookie } from "../../libs/helpers/utils";
import { token } from "../../libs/helpers/token";

app.get("api/oauth/callback/:provider", async (c) => {
  const provider = c.req.param("provider") as OauthProvider;
  const client = oauthClient[provider] && oauthClient[provider]();
  if (!client) return c.redirect("http://localhost:3001/login?err=1");
  const cookieState = getCookie(c, stateCookieName);
  const codeVerifier = getCookie(c, codeVerifierCookieName);
  const state = c.req.query("state");
  const code = c.req.query("code");

  if (!(code && codeVerifier && state) || state !== cookieState) {
    return c.redirect("http://localhost:3001/login?err=1");
  }

  const setRefreshTokenCookie = async (userId: number) => {
    const refreshToken = await token.refresh(userId);
    const signature = await password.hash(refreshToken.split(".")[2]);
    setSecureCookie(c, "refresh_token", refreshToken);
    return signature;
  };

  try {
    const oauthUser = await client.fetchUser(code, codeVerifier);

    const [dbUser]: [User["value"] | undefined] = await sql`
      SELECT * FROM "Users"
      WHERE "oauth" = ${provider}
      AND "oauthId" = ${oauthUser.id}
    `;

    if (dbUser) {
      const signature = await setRefreshTokenCookie(dbUser.id);
      await sql`
        UPDATE "Users"
        SET ${sql({ name: oauthUser.name, email: oauthUser.email, signature })}
        WHERE "id" = ${dbUser.id}
      `;
      return c.redirect("http://localhost:3001/");
    }

    const [user]: [User["value"]] = await sql`
      INSERT INTO "Users" ${sql({
        oauth: provider,
        oauthId: oauthUser.id,
        name: oauthUser.name,
        email: oauthUser.email,
      })}
      RETURNING *
    `;

    const signature = await setRefreshTokenCookie(user.id);

    await sql`
      UPDATE "Users"
      SET ${sql({ signature })}
      WHERE "id" = ${user.id}
    `;

    return c.redirect("http://localhost:3001/");
  } catch (err) {
    console.error(err);
    return c.redirect("http://localhost:3001/login?err=1");
  }
});
