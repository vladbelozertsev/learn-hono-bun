import { Token } from "../../libs/types/token.js";
import { auth } from "../../libs/mws/auth.js";
import { decode } from "hono/jwt";
import { sql } from "bun";

app.delete("api/auth", auth, async (c) => {
  const tokenJwt = c.req.header().authorization.split(" ")[1];
  const { id } = decode(tokenJwt).payload as Token;

  await sql`
    UPDATE "Users"
    SET "signature" = ${""}
    WHERE "id" = ${id};
  `;

  return c.json({ success: true });
});
