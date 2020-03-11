const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// directory that holds static assets
const publicDir = path.join(__dirname, "public");
const databaseDir = path.join(__dirname, "db");

// this middleware is used for parsing request body found in POST and PUT requests
app.use(express.json()); // for content-type: application/json  
app.use(express.urlencoded({ extended: false })); // for content-type: application/x-www-form-urlencoded (form data) no embedded object, string or array

//static file serving so you don't have to keep making routes for css, js etc
app.use(express.static(publicDir));

app.get("/", (req,res) => {
  res.sendFile(path.join(publicDir, "index.html"));
})

// same as above just different route
app.get("/index", (req,res) => {
  res.send("hello world!");
})

app.get("/notes", (req,res) => {
  res.sendFile(path.join(publicDir, "notes.html"));
})

// route to send the notes
app.get("/api/notes", (req, res) => {
  let json;
  let data = fs.readFileSync(path.join(databaseDir, "db.json"), "utf8");
  if (data) {
    json = JSON.parse(data);
  } else {
    json = { msg: "No objects Found"};
  }
  
  res.json(json);
})

// express.json will only work on application/json and express.urlencoded will only work for x-www-form-urlencoded
// raw text will not be retrieved and this route will return {}
app.post("/api/notes", (req, res) => {
  let data = req.body; //uses express.json middleware and parses json to javascript object for you

  //console.log(typeof data); // -> object
  console.log(data);
  res.json(data);
})

// delete note variable parameter
app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id; // type -> string
  
  res.send(id);
})

// app.get("/assets/css/styles.css", (req, res) => {
//   res.sendFile(path.join(publicDir, "assets", "css", "styles.css"));
// })

app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
})
