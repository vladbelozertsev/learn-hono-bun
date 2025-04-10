import { upload } from "../../libs/helpers/upload/index.js";

app.post("api/flowers", async (c) => {
  await upload({
    ctx: c,
    dir: "public",
    onFile: (savedFileName) => {
      console.log(savedFileName);
    },
  });

  return c.text("ok");
});

// https://developer.mozilla.org/en-US/docs/Web/API/FormData/getAll
