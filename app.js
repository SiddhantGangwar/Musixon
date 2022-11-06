//jshint esversion:6

// require modules
let express = require('express');
let ejs = require('ejs');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

//using express
let app = express();
//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }));
//code so that css is also rendered with html pages
app.use(express.static("public"))

//setting ejs
app.set('view engine','ejs');

//Listen at either port provided when deployed or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});