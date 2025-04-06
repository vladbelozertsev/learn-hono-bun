import "./login.js";
import "./refresh.js";

app.get("/auth", (c) => {
  return c.text("Hello bun");
});

const a = "réservé"; // With accents, lowercase
const b = "RESERVE"; // No accents, uppercase

console.log(a.localeCompare(b));
// Expected output: 1
console.log(a.localeCompare(b, "en", { sensitivity: "variant" }));
// Expected output: 0
