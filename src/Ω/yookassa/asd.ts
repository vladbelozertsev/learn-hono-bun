import { YooCheckout } from "@a2seven/yoo-checkout";

// OR const { YooCheckout } = require('@a2seven/yoo-checkout');

app.get("api/yookassa", (c) => {
  const checkout = new YooCheckout({ shopId: "your_shopId", secretKey: "your_secretKey" });
  // checkout.
  return c.text("ok");
});
