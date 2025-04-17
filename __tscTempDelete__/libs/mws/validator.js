"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
var http_exception_1 = require("hono/http-exception");
var zod_validator_1 = require("@hono/zod-validator");
var validator = function (prams) {
    return (0, zod_validator_1.zValidator)(prams.target, prams.schema, function (result) {
        if (!result.success) {
            var message = prams.message || "Zod validation failed!";
            throw new http_exception_1.HTTPException(400, { message: message });
        }
    });
};
exports.validator = validator;
