import { OAuthClient } from "./-base";
import { z } from "zod";

export function createGoogleOAuthClient() {
  return new OAuthClient({
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
        id: z.string(),
        username: z.string(),
        global_name: z.string().nullable(),
        email: z.string().email(),
      }),
      parser: (user) => ({
        id: user.id,
        name: user.global_name ?? user.username,
        email: user.email,
      }),
    },
  });
}

// import { BaseOAuthService } from './base-oauth.service'
// import { TypeProviderOptions } from './types/provider-options.types'
// import { TypeUserInfo } from './types/user-info.types'

// export class GoogleProvider extends BaseOAuthService {
// 	public constructor(options: TypeProviderOptions) {
// 		super({
// 			name: 'google',
// 			authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
// 			access_url: 'https://oauth2.googleapis.com/token',
// 			profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
// 			scopes: options.scopes,
// 			client_id: options.client_id,
// 			client_secret: options.client_secret
// 		})
// 	}

// 	public async extractUserInfo(data: GoogleProfile): Promise<TypeUserInfo> {
// 		return super.extractUserInfo({
// 			email: data.email,
// 			name: data.name,
// 			picture: data.picture
// 		})
// 	}
// }

// interface GoogleProfile extends Record<string, any> {
// 	aud: string
// 	azp: string
// 	email: string
// 	email_verified: boolean
// 	exp: number
// 	family_name?: string
// 	given_name: string
// 	hd?: string
// 	iat: number
// 	iss: string
// 	jti?: string
// 	locale?: string
// 	name: string
// 	nbf?: number
// 	picture: string
// 	sub: string
// 	access_token: string
// 	refresh_token?: string
// }
