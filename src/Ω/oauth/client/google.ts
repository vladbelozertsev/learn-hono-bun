import { OAuthBase } from "./-base";
import { sanitize } from "../../../libs/helpers/utils";
import { z } from "zod";

export function createGoogleOAuthClient() {
  return new OAuthBase({
    provider: "google",
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    scopes: ["email", "profile"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    userInfo: {
      schema: z.object({
        sub: z.string(),
        name: z.string(),
        given_name: z.string(),
        picture: z.string(),
        email: z.string().email(),
        email_verified: z.boolean(),
      }),
      parser: (user) => ({
        id: sanitize(user.sub),
        name: sanitize(user.name),
        email: sanitize(user.email),
      }),
    },
  });
}
