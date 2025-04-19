import { User } from "../../libs/types/user.js";
import { delkeys, sanitize } from "../../libs/helpers/utils/index.js";
import { password, sql } from "bun";
import { token } from "../../libs/helpers/token/index.js";
import { validator } from "../../libs/mws/validator.js";
import { z } from "zod";

const jsonv = validator({
  target: "json",
  schema: z.object({
    email: z.string().email().transform(sanitize),
    name: z.string().nonempty().max(30).transform(sanitize),
    password: z.string().min(6).max(72),
  }),
});

app.post("api/users", jsonv, async (c) => {
  const { email, name, password: pass } = c.req.valid("json");

  const [dbUser]: [User["value"] | undefined] = await sql`
    SELECT * FROM "Users"
    WHERE "email" = ${email}
    AND "oauth" IS NULL
  `;

  if (dbUser) return c.text("Email already busy", 401);

  const [user]: [User["value"]] = await sql`
    INSERT INTO "Users" ${sql({ name, email, password: pass })}
    RETURNING *
  `;

  const refreshToken = await token.refresh(user.id);
  const accessToken = await token.access(user.id);
  const signature = await password.hash(refreshToken.split(".")[2]);

  await sql`
    UPDATE "Users"
    SET "signature" = ${signature}
    WHERE "id" = ${user.id};
  `;

  return c.json<User["valid"]>({
    user: delkeys(user, ["signature", "password"]),
    accessToken,
    refreshToken,
  });
});

/**
 * Useful links:
 * https://security.stackexchange.com/questions/106972/javascript-injection-in-email-address-as-username
 **/
