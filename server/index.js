const express = require("express");
const path = require("path");

const app = express();

let port = process.env.PORT;

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("build"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
