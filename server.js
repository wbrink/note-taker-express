const express = require("express");
const path = require("path");


const app = express();
const PORT = 3000;


// this middleware is used for parsing request body found in POST and PUT requests
app.use(express.json()); // for content-type: application/json  
app.use(express.urlencoded({ extended: false })); // for content-type: application/x-www-form-urlencoded (form data) no embedded object, string or array

//static file serving so you don't have to keep making routes for css, js etc
app.use(express.static(path.join(__dirname, "public")));


// api routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
})





