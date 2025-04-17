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
var index_js_1 = require("../../libs/helpers/utils/index.js");
var bcrypt_1 = require("bcrypt");
var bun_1 = require("bun");
var index_js_2 = require("../../libs/helpers/token/index.js");
var validator_js_1 = require("../../libs/mws/validator.js");
var zod_1 = require("zod");
var jsonv = (0, validator_js_1.validator)({
    target: "json",
    schema: zod_1.z.object({
        email: zod_1.z.string().email().transform(index_js_1.sanitize),
        name: zod_1.z.string().nonempty().max(30).transform(index_js_1.sanitize),
        password: zod_1.z.string().min(6).max(72),
    }),
});
app.post("api/users", jsonv, function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, password, dbUser, user, refreshToken, accessToken, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = c.req.valid("json"), email = _a.email, name = _a.name, password = _a.password;
                return [4 /*yield*/, (0, bun_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    SELECT * FROM \"Users\"\n    WHERE \"email\" = ", "\n    AND \"oauth\" IS NULL\n  "], ["\n    SELECT * FROM \"Users\"\n    WHERE \"email\" = ", "\n    AND \"oauth\" IS NULL\n  "])), email)];
            case 1:
                dbUser = (_b.sent())[0];
                if (dbUser)
                    return [2 /*return*/, c.text("Email already busy", 401)];
                return [4 /*yield*/, (0, bun_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    INSERT INTO \"Users\" ", "\n    RETURNING *\n  "], ["\n    INSERT INTO \"Users\" ", "\n    RETURNING *\n  "])), (0, bun_1.sql)({ name: name, email: email, password: password }))];
            case 2:
                user = (_b.sent())[0];
                return [4 /*yield*/, index_js_2.token.refresh(user.id)];
            case 3:
                refreshToken = _b.sent();
                return [4 /*yield*/, index_js_2.token.access(user.id)];
            case 4:
                accessToken = _b.sent();
                return [4 /*yield*/, (0, bcrypt_1.hash)(refreshToken.split(".")[2], 10)];
            case 5:
                signature = _b.sent();
                return [4 /*yield*/, (0, bun_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    UPDATE \"Users\"\n    SET \"signature\" = ", "\n    WHERE \"id\" = ", ";\n  "], ["\n    UPDATE \"Users\"\n    SET \"signature\" = ", "\n    WHERE \"id\" = ", ";\n  "])), signature, user.id)];
            case 6:
                _b.sent();
                return [2 /*return*/, c.json({
                        user: (0, index_js_1.delkeys)(user, ["signature", "password"]),
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    })];
        }
    });
}); });
var templateObject_1, templateObject_2, templateObject_3;
/**
 * Useful links:
 * https://security.stackexchange.com/questions/106972/javascript-injection-in-email-address-as-username
 **/
