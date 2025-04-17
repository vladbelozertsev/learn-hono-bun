"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var http_exception_1 = require("hono/http-exception");
var bearer_auth_1 = require("hono/bearer-auth");
var bcrypt_1 = require("bcrypt");
var jwt_1 = require("hono/jwt");
var cookie_1 = require("hono/cookie");
var index_js_1 = require("../../libs/helpers/utils/index.js");
var bun_1 = require("bun");
var index_js_2 = require("../../libs/helpers/token/index.js");
var getTokens = function (refreshTokenJwt) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, isValid, accessToken, refreshToken, signature;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = (_b = (_a = (0, jwt_1.decode)(refreshTokenJwt)) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.id;
                if (!id)
                    throw new http_exception_1.HTTPException(401, { message: "Id undefined" });
                return [4 /*yield*/, (0, bun_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM \"Users\" WHERE \"id\" = ", ""], ["SELECT * FROM \"Users\" WHERE \"id\" = ", ""])), id)];
            case 1:
                user = (_c.sent())[0];
                if (!(user === null || user === void 0 ? void 0 : user.signature))
                    throw new http_exception_1.HTTPException(401, { message: "Token cancelled" });
                return [4 /*yield*/, (0, bcrypt_1.compare)(refreshTokenJwt.split(".")[2], user.signature)];
            case 2:
                isValid = _c.sent();
                if (!isValid)
                    throw new http_exception_1.HTTPException(401, { message: "Token changed" });
                return [4 /*yield*/, index_js_2.token.access(id)];
            case 3:
                accessToken = _c.sent();
                return [4 /*yield*/, index_js_2.token.refresh(id)];
            case 4:
                refreshToken = _c.sent();
                return [4 /*yield*/, (0, bcrypt_1.hash)(refreshToken.split(".")[2], 10)];
            case 5:
                signature = _c.sent();
                return [4 /*yield*/, (0, bun_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["UPDATE \"Users\" SET \"signature\" = ", " WHERE \"id\" = ", ";"], ["UPDATE \"Users\" SET \"signature\" = ", " WHERE \"id\" = ", ";"])), signature, id)];
            case 6:
                _c.sent();
                return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
        }
    });
}); };
var verifyToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var secret, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                secret = process.env.JWT_REFRESH_SECRET;
                if (!secret)
                    throw new http_exception_1.HTTPException(401, { message: "Process env failed" });
                return [4 /*yield*/, (0, jwt_1.verify)(token, secret).catch(function (msg) { return ({ err: true, msg: msg === null || msg === void 0 ? void 0 : msg.name }); })];
            case 1:
                result = _a.sent();
                if (!result)
                    throw new http_exception_1.HTTPException(401, { message: "Refresh token verification failed" });
                if (result === null || result === void 0 ? void 0 : result.err)
                    throw new http_exception_1.HTTPException(401, { message: JSON.stringify(result === null || result === void 0 ? void 0 : result.msg) });
                return [2 /*return*/, true];
        }
    });
}); };
app.get("api/auth/refresh", (0, bearer_auth_1.bearerAuth)({ verifyToken: verifyToken }), function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenJwt, tokens;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenJwt = c.req.header().authorization.split(" ")[1];
                return [4 /*yield*/, getTokens(tokenJwt)];
            case 1:
                tokens = _a.sent();
                return [2 /*return*/, c.json(tokens)];
        }
    });
}); });
app.get("api/auth/refresh/web", function (c, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refreshToken = (0, cookie_1.getCookie)(c, "refresh_token");
                if (!refreshToken)
                    throw new http_exception_1.HTTPException(401, { message: "Refresh cookie undefined" });
                return [4 /*yield*/, verifyToken(refreshToken).then(function () { return next(); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenJwt, _a, accessToken, refreshToken, maxAge;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tokenJwt = (0, cookie_1.getCookie)(c, "refresh_token");
                return [4 /*yield*/, getTokens(tokenJwt)];
            case 1:
                _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                maxAge = +(process.env.JWT_REFRESH_TOKEN_LIFE_TIME_S || 0);
                (0, index_js_1.setSecureCookie)(c, "refresh_token", refreshToken, { maxAge: maxAge });
                return [2 /*return*/, c.json({ accessToken: accessToken })];
        }
    });
}); });
var templateObject_1, templateObject_2;
