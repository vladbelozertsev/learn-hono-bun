import { Context } from "hono";

const getPagination = (c: Context<any, any, any>) => {
  const limit = parseInt(c.req.query("limit") || "10");
  const offset = parseInt(c.req.query("offset") || "0");
  const sortBy = c.req.query("sort-by");
  const sortOrder = c.req.query("sort-order") || "ASC";
  return {
    limit: parseInt(c.req.query("limit") || "10"),
    offset: parseInt(c.req.query("offset") || "0"),
    sort: c.req.query("sort"),
    order: c.req.query("order") || "ASC",
    // sort: {
    //   by: c.req.query("sort-by"),
    //   order: c.req.query("sort-order") || "ASC",
    // },
  };
};

app.get("api/flowers", (c) => {
  const pgn = getPagination(c);

  console.log(c.req.header("Authorization"));
  console.log("first");
  return c.json([
    { id: 1, name: "fgfg", color: "red" },
    { id: 2, name: "fgfg", color: "red" },
    { id: 3, name: "hjjhjh", color: "red" },
    { id: 4, name: "dfsdfsdf", color: "red" },
    { id: 5, name: "sdf sdf sdf", color: "red" },
    { id: 6, name: "ghghg gh g", color: "red" },
    { id: 7, name: "dfsfdsf", color: "red" },
    { id: 8, name: "vbcvbcvb", color: "red" },
    { id: 9, name: "xcvadfds", color: "red" },
    { id: 10, name: "asdbth", color: "red" },
    { id: 11, name: "thyfghf5", color: "red" },
  ]);
});
