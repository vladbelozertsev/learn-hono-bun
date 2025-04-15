import { createGoogleOAuthClient } from "./google";

export const oauthClient = {
  google: createGoogleOAuthClient,
};

export type OauthProvider = keyof typeof oauthClient;
