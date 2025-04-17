"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGithubOAuthClient = createGithubOAuthClient;
var _base_1 = require("./-base");
var zod_1 = require("zod");
function createGithubOAuthClient() {
    return new _base_1.OAuthBase({
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
            schema: zod_1.z.object({
                id: zod_1.z.number(),
                name: zod_1.z.string().nullable(),
                login: zod_1.z.string(),
                email: zod_1.z.string().email(),
            }),
            parser: function (user) {
                var _a;
                return ({
                    id: user.id.toString(),
                    name: (_a = user.name) !== null && _a !== void 0 ? _a : user.login,
                    email: user.email,
                });
            },
        },
    });
}
