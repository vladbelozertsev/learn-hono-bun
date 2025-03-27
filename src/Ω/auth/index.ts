import "./login.js";
import "./refresh.js";

app.get("/auth", (c) => {
  return c.text("Hello bun");
});
