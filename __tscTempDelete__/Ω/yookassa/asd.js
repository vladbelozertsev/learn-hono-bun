"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yoo_checkout_1 = require("@a2seven/yoo-checkout");
// OR const { YooCheckout } = require('@a2seven/yoo-checkout');
app.get("api/yookassa", function (c) {
    var checkout = new yoo_checkout_1.YooCheckout({ shopId: "your_shopId", secretKey: "your_secretKey" });
    // checkout.
    return c.text("ok");
});
