/* routes for the api */
const path = require("path");
const fs = require("fs");

const checkObject = require("../utils/checkObject.js");

const databaseDir = path.join(__dirname, "../", "db");

module.exports = function(app) {
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


  // post note to api
  // express.json will only work on application/json and express.urlencoded will only work for x-www-form-urlencoded
  // raw text will not be retrieved and this route will return {}
  app.post("/api/notes", (req, res) => {
    let data = req.body; //uses express.json middleware and parses json to javascript object for you
    let fileData = fs.readFileSync(path.join(databaseDir, "db.json"), "utf8");
    let dbData = JSON.parse(fileData); // array of objects

    // get object length (get last objects id which is the largest up to that point. then add 1)
    let id;
    if (dbData.length === 0) {
      id = 1; 
    } else {
      id = parseInt(dbData[dbData.length - 1].id) + 1; 
    }

    // if JSON array of objects is sent
    if (Array.isArray(data)) {
      //console.log("got an array")

      // check that every object is sent in correct format
      if (!data.every(checkObject)) {
        res.json({error: "obj only contain text and title property"});
        return;
      }
      
      data.forEach(elem => { // add each object to the json file
        elem.id = id;
        dbData.push(elem);
        id++;
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
        res.json(data);
      } else {
        res.json({error: "Can't post to database"});
      }
    }
    
    return
  })



  // delete note api
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
      res.json(note);
    } else {
      res.json({error: `No note with id ${id} found`});
    }

    return
  })

 
}