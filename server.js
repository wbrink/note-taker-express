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
  let fileData = fs.readFileSync(path.join(databaseDir, "db.json"), "utf8");
  let dbData = JSON.parse(fileData);

  // if JSON array of objects is sent
  if (Array.isArray(data)) {
    console.log("got an array")
    
    data.forEach(elem => { // add each object to the json file
      // make a check for the proper keys in object otherwise do not push
      checkObject(elem);
      dbData.push(elem);
    })
    
    // write to file
    fs.writeFile(path.join(databaseDir, "db.json"), JSON.stringify(dbData), (err) => {
      if(err) console.log("can't write to file")
      console.log("file written to");
    })

    res.json(data) // return data sent to confirm
    return
  } 
  
  dbData.push(data);
  
  fs.writeFile(path.join(databaseDir, "db.json"), JSON.stringify(dbData), (err) => {
    if(err) console.log("can't write to file")
    console.log("file written to");
  })

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


// need to check that obj contains these properties: id, title, text
function checkObject(obj) {
  let idCheck = "id" in obj;
  let titleCheck = "title" in obj;
  let textCheck = "text" in obj;

  if (Object.keys(obj).length !== 3) {
    return false;
  }

  if (idCheck && titleCheck && textCheck) {
    return true;
  } else {
    return false;
  }
}