"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDiscordOAuthClient = createDiscordOAuthClient;
var _base_1 = require("./-base");
var zod_1 = require("zod");
function createDiscordOAuthClient() {
    return new _base_1.OAuthBase({
        provider: "discord",
        clientId: process.env.DISCORD_CLIENT_ID || "",
        clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
        scopes: ["identify", "email"],
        urls: {
            auth: "https://discord.com/oauth2/authorize",
            token: "https://discord.com/api/oauth2/token",
            user: "https://discord.com/api/users/@me",
        },
        userInfo: {
            schema: zod_1.z.object({
                id: zod_1.z.string(),
                username: zod_1.z.string(),
                global_name: zod_1.z.string().nullable(),
                email: zod_1.z.string().email(),
            }),
            parser: function (user) {
                var _a;
                return ({
                    id: user.id,
                    name: (_a = user.global_name) !== null && _a !== void 0 ? _a : user.username,
                    email: user.email,
                });
            },
        },
    });
}
