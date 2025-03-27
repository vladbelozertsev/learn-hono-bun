import { User } from "../../libs/types/user.js";
import { delkeys } from "../../libs/helpers/utils";
import { hash } from "bcrypt";
import { sql } from "bun";
import { token } from "../../libs/helpers/token";
import { validator } from "../../libs/mws/validator.js";
import { z } from "zod";

const jsonv = validator({
  target: "json",
  schema: z.object({
    email: z.string().email(),
    name: z.string().nonempty(),
    password: z.string().min(6),
  }),
});

app.post("/users", jsonv, async (c) => {
  const { email, name, password } = c.req.valid("json");

  const [existedUser]: [User["value"] | undefined] = await sql`
    SELECT * FROM "Users"
    WHERE "email" = ${email}
  `;

  if (existedUser) return c.text("Email already busy", 401);
  const refreshToken = await token.refresh(email);
  const accessToken = await token.access(email);
  const signature = await hash(refreshToken.split(".")[2], 10);

  const [user]: [User["value"]] = await sql`
    INSERT INTO "Users" ${sql({ name, email, password, refreshToken: signature })}
    RETURNING *
  `;

  return c.json<User["valid"]>({
    user: delkeys(user, ["signature", "password"]),
    accessToken,
    refreshToken,
  });
});
