import { sign } from "hono/jwt";

export const token = {
  access: (id: number) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    const lifeTime = +(process.env.JWT_ACCESS_TOKEN_LIFE_TIME_S || 0);
    if (!secret || !lifeTime) throw new Error("getAccess env failed");
    const exp = Math.round(Date.now() / 1000) + lifeTime;
    return sign({ id, exp }, secret);
  },

  refresh: (id: number) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const lifeTime = +(process.env.JWT_REFRESH_TOKEN_LIFE_TIME_S || 0);
    if (!secret || !lifeTime) throw new Error("getAccess env failed");
    const exp = Math.round(Date.now() / 1000) + lifeTime;
    return sign({ id, exp }, secret);
  },

  verifyEmail: (id: number) => {
    const secret = process.env.JWT_VERIFY_EMAIL_SECRET;
    const lifeTime = +(process.env.JWT_VERIFY_EMAIL_TOKEN_LIFE_TIME_S || 0);
    if (!secret || !lifeTime) throw new Error("getAccess env failed");
    const exp = Math.round(Date.now() / 1000) + lifeTime;
    return sign({ id, exp }, secret);
  },
};
