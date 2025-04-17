"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSecureCookie = exports.sanitize = exports.capitalize = exports.numberWithSpaces = exports.delkeys = exports.withset = void 0;
var cookie_1 = require("hono/cookie");
var withset = function (prams) {
    var arr = Object.entries(!!prams && typeof prams === "object" ? prams : {});
    var entries = arr.map(function (el) { return [el[0], { set: el[1] }]; });
    return Object.fromEntries(entries);
};
exports.withset = withset;
var delkeys = function (obj, keys) {
    keys.forEach(function (key) { return delete obj[key]; });
    return obj;
};
exports.delkeys = delkeys;
var numberWithSpaces = function (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
};
exports.numberWithSpaces = numberWithSpaces;
var capitalize = function (s) {
    return (s && s[0].toUpperCase() + s.slice(1)) || "";
};
exports.capitalize = capitalize;
var sanitize = function (text) {
    var map = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&#39;",
        '"': "&quot;",
        "/": "&#47;",
    };
    return text.replace(/[<>&'"\/]/g, function (char) { return map[char]; });
};
exports.sanitize = sanitize;
var setSecureCookie = function (c, name, value, options) {
    (0, cookie_1.setCookie)(c, name, value, __assign({ 
        // secure: true,
        httpOnly: true, sameSite: "lax" }, options));
};
exports.setSecureCookie = setSecureCookie;
//https://github.com/colinhacks/zod/discussions/1358
