import { HTTPException } from "hono/http-exception";
import { Token } from "../../libs/types/token.js";
import { User } from "../../libs/types/user.js";
import { auth } from "../../libs/mws/auth.js";
import { decode } from "hono/jwt";
import { delkeys } from "../../libs/helpers/utils/index.js";
import { sql } from "bun";

app.get("api/users", auth, async (c) => {
  const tokenJwt = c.req.header().authorization.split(" ")[1];
  const tokenDecoded = decode(tokenJwt).payload as Token;

  if (!tokenDecoded?.id) {
    throw new HTTPException(401, { message: "Email is empty" });
  }

  const [user]: [User["value"] | undefined] = await sql`
    SELECT * FROM "Users"
    WHERE "id" = ${tokenDecoded.id}
  `;

  if (!user) {
    throw new HTTPException(401, { message: "User not found" });
  }

  return c.json({
    user: delkeys(user, ["password", "signature"]),
  });
});
