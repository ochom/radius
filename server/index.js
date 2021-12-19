const express = require("express");
const path = require("path");

const app = express();

var port = process.env.PORT;

var host = process.env.YOUR_HOST || "0.0.0.0";

// add middleware
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("build"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(port, host, () => {
  console.log(`server started on port: ${port}`);
});
