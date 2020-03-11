const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// directory that holds static assets
const publicDir = path.join(__dirname, "public");

// this middleware is used for parsing request body found in POST and PUT requests
app.use(express.json()); // for content-type: application/json  
app.use(express.urlencoded({ extended: false })); // for content-type: application/x-www-form-urlencoded (form data) no embedded object, string or array

//static file serving so you don't have to keep making routes for css, js etc
app.use(express.static(publicDir));

app.get("/", (req,res) => {
  res.sendFile(path.join(publicDir, "index.html"));
})

app.get("/index", (req,res) => {
  res.send("hello world!");
})

app.get("/notes", (req,res) => {
  res.sendFile(path.join(publicDir, "notes.html"));
})

// app.get("/assets/css/styles.css", (req, res) => {
//   res.sendFile(path.join(publicDir, "assets", "css", "styles.css"));
// })

app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
})
