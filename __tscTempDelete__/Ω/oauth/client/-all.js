"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthClient = void 0;
var google_1 = require("./google");
exports.oauthClient = {
    google: google_1.createGoogleOAuthClient,
};
