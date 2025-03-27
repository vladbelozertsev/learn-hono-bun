import { auth } from "../../libs/mws/auth.js";
import { decode } from "hono/jwt";
import { sql } from "bun";

app.delete("auth/", auth, async (c) => {
  const tokenJwt = c.req.header().authorization.split(" ")[1];
  const { email } = decode(tokenJwt).payload as { email: string };

  await sql`
    UPDATE "Users"
    SET "signature" = ${""}
    WHERE "email" = ${email};
  `;

  return c.json({ success: true });
});
