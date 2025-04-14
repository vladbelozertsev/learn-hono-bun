import { createDiscordOAuthClient } from "./discord";
import { createGithubOAuthClient } from "./github";
import { createGoogleOAuthClient } from "./google";

export const oauthClient = {
  discord: createDiscordOAuthClient,
  github: createGithubOAuthClient,
  google: createGoogleOAuthClient,
};

export type OauthProvider = keyof typeof oauthClient;
