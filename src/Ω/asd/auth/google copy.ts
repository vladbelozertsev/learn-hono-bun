import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Token } from "../../../libs/types/token.js";
import { auth } from "../../../libs/mws/auth.js";
import { decode } from "hono/jwt";
import { sql } from "bun";

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3001",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(refreshToken);
      return done(null, profile);
    }
  )
);

app.get(
  "api/auth/google",
  (c, next) => {
    passport.authenticate("google")(c.req, c.res, next);
  },
  async (c, next) => {
    console.log("process.env.GOOGLE_CLIENT_ID");

    return c.text("{ success: true }");
  }
);

/**
 * Useful links:
 * https://www.youtube.com/watch?v=sakQbeRjgwg&list=PL4cUxeGkcC9jdm7QX143aMLAqyM-jTZ2x
 * https://www.youtube.com/watch?v=X4mtsWfhNzw
 **/
