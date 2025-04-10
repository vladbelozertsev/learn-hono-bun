import { HTTPException } from "hono/http-exception";
import { User } from "../../libs/types/user";
import { delkeys } from "../../libs/helpers/utils";
import { hash } from "bcrypt";
import { sql } from "bun";
import { token } from "../../libs/helpers/token";
import { validator } from "../../libs/mws/validator";
import { z } from "zod";

const jsonv = validator({
  target: "json",
  schema: z.object({
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
  }),
});

app.post("api/auth", jsonv, async (c) => {
  const json = c.req.valid("json");

  const [user]: [User["value"] | undefined] = await sql`
    SELECT * FROM "Users"
    WHERE "email" = ${json.email}
  `;

  if (!user) throw new HTTPException(401, { message: "Invalid email" });
  if (user.password !== json.password) throw new HTTPException(401, { message: "Invalid password" });
  const refreshToken = await token.refresh(user.id);
  const accessToken = await token.access(user.id);
  const signature = await hash(refreshToken.split(".")[2], 10);

  await sql`
    UPDATE "Users"
    SET "signature" = ${signature}
    WHERE "email" = ${json.email};
  `;

  return c.json<User["valid"]>({
    user: delkeys(user, ["password", "signature"]),
    accessToken,
    refreshToken,
  });
});
