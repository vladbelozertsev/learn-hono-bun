"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthBase = void 0;
var crypto_1 = __importDefault(require("crypto"));
var zod_1 = require("zod");
var OAuthBase = /** @class */ (function () {
    function OAuthBase(_a) {
        var provider = _a.provider, clientId = _a.clientId, clientSecret = _a.clientSecret, scopes = _a.scopes, urls = _a.urls, userInfo = _a.userInfo;
        this.tokenSchema = zod_1.z.object({
            access_token: zod_1.z.string(),
            token_type: zod_1.z.string(),
        });
        this.provider = provider;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.scopes = scopes;
        this.urls = urls;
        this.userInfo = userInfo;
    }
    Object.defineProperty(OAuthBase.prototype, "redirectUrl", {
        get: function () {
            return new URL(this.provider, "http://localhost:3000/api/oauth/callback/");
        },
        enumerable: false,
        configurable: true
    });
    OAuthBase.prototype.createAuthUrl = function (state, codeVerifier) {
        var url = new URL(this.urls.auth);
        url.searchParams.set("client_id", this.clientId);
        url.searchParams.set("redirect_uri", this.redirectUrl.toString());
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", this.scopes.join(" "));
        url.searchParams.set("state", state);
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("code_challenge", crypto_1.default.hash("sha256", codeVerifier, "base64url"));
        return url.toString();
    };
    OAuthBase.prototype.fetchUser = function (code, codeVerifier) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, accessToken, tokenType, user;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchToken(code, codeVerifier)];
                    case 1:
                        _a = _b.sent(), accessToken = _a.accessToken, tokenType = _a.tokenType;
                        return [4 /*yield*/, fetch(this.urls.user, { headers: { Authorization: "".concat(tokenType, " ").concat(accessToken) } })
                                .then(function (res) { return res.json(); })
                                .then(function (rawData) {
                                var _a = _this.userInfo.schema.safeParse(rawData), data = _a.data, success = _a.success, error = _a.error;
                                if (!success)
                                    throw new InvalidUserError(error);
                                return data;
                            })];
                    case 2:
                        user = _b.sent();
                        return [2 /*return*/, this.userInfo.parser(user)];
                }
            });
        });
    };
    OAuthBase.prototype.fetchToken = function (code, codeVerifier) {
        return __awaiter(this, void 0, void 0, function () {
            var res, rawData, _a, data, success, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch(this.urls.token, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Accept: "application/json",
                            },
                            body: new URLSearchParams({
                                code: code,
                                redirect_uri: this.redirectUrl.toString(),
                                grant_type: "authorization_code",
                                client_id: this.clientId,
                                client_secret: this.clientSecret,
                                code_verifier: codeVerifier,
                            }),
                        })];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        rawData = _b.sent();
                        _a = this.tokenSchema.safeParse(rawData), data = _a.data, success = _a.success, error = _a.error;
                        if (!success)
                            throw new InvalidTokenError(error);
                        return [2 /*return*/, {
                                accessToken: data.access_token,
                                tokenType: data.token_type,
                            }];
                }
            });
        });
    };
    return OAuthBase;
}());
exports.OAuthBase = OAuthBase;
var InvalidTokenError = /** @class */ (function (_super) {
    __extends(InvalidTokenError, _super);
    function InvalidTokenError(zodError) {
        var _this = _super.call(this, "Invalid Token") || this;
        _this.cause = zodError;
        return _this;
    }
    return InvalidTokenError;
}(Error));
var InvalidUserError = /** @class */ (function (_super) {
    __extends(InvalidUserError, _super);
    function InvalidUserError(zodError) {
        var _this = _super.call(this, "Invalid User") || this;
        _this.cause = zodError;
        return _this;
    }
    return InvalidUserError;
}(Error));
