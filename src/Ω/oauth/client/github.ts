import { OAuthBase } from "./-base";
import { z } from "zod";

export function createGithubOAuthClient() {
  return new OAuthBase({
    provider: "github",
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    scopes: ["user:email", "read:user"],
    urls: {
      auth: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token",
      user: "https://api.github.com/user",
    },
    userInfo: {
      schema: z.object({
        id: z.number(),
        name: z.string().nullable(),
        login: z.string(),
        email: z.string().email(),
      }),
      parser: (user) => ({
        id: user.id.toString(),
        name: user.name ?? user.login,
        email: user.email,
      }),
    },
  });
}
