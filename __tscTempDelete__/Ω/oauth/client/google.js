"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGoogleOAuthClient = createGoogleOAuthClient;
var _base_1 = require("./-base");
var utils_1 = require("../../../libs/helpers/utils");
var zod_1 = require("zod");
function createGoogleOAuthClient() {
    return new _base_1.OAuthBase({
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
            schema: zod_1.z.object({
                sub: zod_1.z.string(),
                name: zod_1.z.string(),
                given_name: zod_1.z.string(),
                picture: zod_1.z.string(),
                email: zod_1.z.string().email(),
                email_verified: zod_1.z.boolean(),
            }),
            parser: function (user) { return ({
                id: (0, utils_1.sanitize)(user.sub),
                name: (0, utils_1.sanitize)(user.name),
                email: (0, utils_1.sanitize)(user.email),
            }); },
        },
    });
}
