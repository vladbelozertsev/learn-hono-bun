"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
var jwt_1 = require("hono/jwt");
exports.token = {
    access: function (id) {
        var secret = process.env.JWT_ACCESS_SECRET;
        var lifeTime = +(process.env.JWT_ACCESS_TOKEN_LIFE_TIME_S || 0);
        if (!secret || !lifeTime)
            throw new Error("getAccess env failed");
        var exp = Math.round(Date.now() / 1000) + lifeTime;
        return (0, jwt_1.sign)({ id: id, exp: exp }, secret);
    },
    refresh: function (id) {
        var secret = process.env.JWT_REFRESH_SECRET;
        var lifeTime = +(process.env.JWT_REFRESH_TOKEN_LIFE_TIME_S || 0);
        if (!secret || !lifeTime)
            throw new Error("getAccess env failed");
        var exp = Math.round(Date.now() / 1000) + lifeTime;
        return (0, jwt_1.sign)({ id: id, exp: exp }, secret);
    },
    verifyEmail: function (id) {
        var secret = process.env.JWT_VERIFY_EMAIL_SECRET;
        var lifeTime = +(process.env.JWT_VERIFY_EMAIL_TOKEN_LIFE_TIME_S || 0);
        if (!secret || !lifeTime)
            throw new Error("getAccess env failed");
        var exp = Math.round(Date.now() / 1000) + lifeTime;
        return (0, jwt_1.sign)({ id: id, exp: exp }, secret);
    },
};
