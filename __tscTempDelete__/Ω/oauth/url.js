"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeVerifierCookieName = exports.stateCookieName = void 0;
var crypto_1 = __importDefault(require("crypto"));
var http_exception_1 = require("hono/http-exception");
var _all_1 = require("./client/-all");
var utils_1 = require("../../libs/helpers/utils");
exports.stateCookieName = "oauth_state";
exports.codeVerifierCookieName = "oauth_code_verifier";
app.get("api/oauth/url/:provider", function (c) {
    var provider = c.req.param("provider");
    var clent = _all_1.oauthClient[provider] && _all_1.oauthClient[provider]();
    if (!clent)
        throw new http_exception_1.HTTPException(400, { message: "Invalid provider" });
    var state = crypto_1.default.randomBytes(64).toString("hex").normalize();
    var codeVerifier = crypto_1.default.randomBytes(64).toString("hex").normalize();
    (0, utils_1.setSecureCookie)(c, exports.stateCookieName, state, { maxAge: 600 });
    (0, utils_1.setSecureCookie)(c, exports.codeVerifierCookieName, codeVerifier, { maxAge: 600 });
    return c.json({ url: clent.createAuthUrl(state, codeVerifier) });
});
