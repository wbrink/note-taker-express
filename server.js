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
    json = { msg: "No notes Found"};
  }
  
  res.json(json);
})

// express.json will only work on application/json and express.urlencoded will only work for x-www-form-urlencoded
// raw text will not be retrieved and this route will return {}
app.post("/api/notes", (req, res) => {
  let data = req.body; //uses express.json middleware and parses json to javascript object for you
  let fileData = fs.readFileSync(path.join(databaseDir, "db.json"), "utf8");
  let dbData = JSON.parse(fileData); // array of objects

  // get object length
  const id = dbData.length + 1
  
  // if JSON array of objects is sent
  if (Array.isArray(data)) {
    console.log("got an array")
    
    data.forEach(elem => { // add each object to the json file
      // make a check for the proper keys in object otherwise do not push
      if (checkObject(elem)) {
        elem.id = id;
        dbData.push(elem);
        index++;
      } 
    })
    
    // write to file
    fs.writeFile(path.join(databaseDir, "db.json"), JSON.stringify(dbData), (err) => {
      if(err) console.log("can't write to file")
      //console.log("file written to");
    })

    res.json(data) // return data sent to confirm
    return
  } else {
    // then only single object was sent
    if (checkObject(data)) {
      data.id = id;
      dbData.push(data);
      
      // write to file
      fs.writeFile(path.join(databaseDir, "db.json"), JSON.stringify(dbData), (err) => {
        if(err) console.log("can't write to file")
        //console.log("file written to");
      });
    } 
  }
  
  res.json(data);
})

// delete note variable parameter
app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id; // type -> string
  
  let dbData = fs.readFileSync(path.join(databaseDir, "db.json"), "utf8");
  dbData = JSON.parse(dbData);
  const note = dbData.filter(note => note.id == parseInt(id))[0]; // gives us back an array we want the first index
  const index = dbData.indexOf(note);
  
  // indexOf returns -1 if not part of array
  if (index > -1) {
    dbData.splice(index, 1);
    fs.writeFileSync(path.join(databaseDir, "db.json"), JSON.stringify(dbData));
  }

  res.json(note);
})

// get any other route and bring them to index.html
app.get("*", (req,res) => {
  res.sendFile(path.join(publicDir, "index.html"));
})

app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
})


// need to check that obj contains these properties: id, title, text
function checkObject(obj) {
  let titleCheck = "title" in obj;
  let textCheck = "text" in obj;

  if (Object.keys(obj).length !== 2) {
    return false;
  }

  if (titleCheck && textCheck) {
    return true;
  } else {
    return false;
  }
}