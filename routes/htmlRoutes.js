const path = require("path");

// directory that holds static assets
const publicDir = path.join(__dirname, "../", "public");


module.exports = function(app) {
  // notes route
  app.get("/notes", (req,res) => {
    res.sendFile(path.join(publicDir, "notes.html"));
  })
  
   // get any other route and bring them to index.html
   app.get("*", (req,res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  })
}
