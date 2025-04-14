import { deleteCookie, getCookie, getSignedCookie, setCookie, setSignedCookie } from "hono/cookie";
import { googleAuth } from "@hono/oauth-providers/google";

// app.get(
//   "api/auth/google",
//   // googleAuth({
//   //   client_id: Bun.env.GOOGLE_CLIENT_ID,
//   //   client_secret: Bun.env.GOOGLE_CLIENT_SECRET,
//   //   scope: ["openid", "email", "profile"],
//   // }),
//   (c) => {
//     console.log(c);
//     const token = c.get("token");
//     const grantedScopes = c.get("granted-scopes");
//     const user = c.get("user-google");

//     return c.json({
//       // token,
//       // grantedScopes,
//       // user,
//     });
//   }
// );

app.get(
  "api/auth/google/callback",
  // googleAuth({
  //   client_id: Bun.env.GOOGLE_CLIENT_ID,
  //   client_secret: Bun.env.GOOGLE_CLIENT_SECRET,
  //   scope: ["openid", "email", "profile"],
  // }),
  (c) => {
    console.log(c);
    const token = c.get("token");
    const grantedScopes = c.get("granted-scopes");
    const user = c.get("user-google");

    return c.json({
      // token,
      // grantedScopes,
      // user,
    });
  }
);

const GOOGLE_OAUTH_SCOPES = [
  "https%3A//www.googleapis.com/auth/userinfo.email",

  "https%3A//www.googleapis.com/auth/userinfo.profile",
];

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CALLBACK_URL = "http://localhost:3000/api/auth/google";

app.get("api/auth/google", async (c) => {
  setCookie(c, "great_cookie", "banana", {
    // path: "/",
    // secure: true,
    // domain: "http://localhost:3001",
    httpOnly: true,
    // maxAge: 10000000,
    // expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
    // sameSite: "lax",
  });
  const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&scope=${scopes}`;
  console.log(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
  return c.json({ redirect: GOOGLE_OAUTH_CONSENT_SCREEN_URL });
});

app.get("api/auth/google2", async (c) => {
  const yummyCookie = getCookie(c, "great_cookie");
  console.error(yummyCookie);
  return c.json({ cookie: yummyCookie });
});
