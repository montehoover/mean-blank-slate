///////////////////////
// DEPENDENCIES ///////
///////////////////////
var express = require('express');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('./models/user');

var app = express();


/////////////////////////
// MIDDLEWARE ///////////
/////////////////////////
mongoose.connect('mongodb://localhost/blank-slate');

// Required to parse POST requests with JSON data
app.use(bodyParser.json());
// Required to parse form bodies from POST requests
app.use(bodyParser.urlencoded({extended: false}));

// Allow files on the client side to request and access other files in the
// specified directory
// Without this, Express will not serve any <script> or <link> or <img> your
// index.html references.  This is for security.
app.use(express.static(__dirname + '/public'));

// The following section implents JWT authentication:
var secret = "shoppinglistjwtsecret";
// Check every request to /api/users for a token that matches 
// the ecryption of "secret"
app.use('/api/users', expressJWT({secret: secret})
  .unless({path: ['/api/users'], method: 'post'}));
// Check every error occuring on the server for name "UnauthorizedError" and 
// attach a more specific message
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      message: 'You need an authorization token to view this information.'
    });
  }
});


/////////////////////////
// ROUTES ///////////////
/////////////////////////
app.use('/api/users', require('./controllers/users'));

app.post('/api/authenticate', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) {
      return res.status(401).send({
        message: 'No account found for this email address.'
      });
    }
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) {
        return res.status(401).send({
          message: 'The password entered does not match account for this email address.'
        });
      }
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


/////////////////////////
// START SERVER /////////
/////////////////////////
// process.env.PORT is for deployed hosting (ex: Heroku)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("You're listening to the smooth sounds of port " + port)
});





///////////////////////////////////////////////////////////////////////////////
// // THIS TEMPLATE IS SET UP FOR ANGULAR, BUT IF YOU WANTED SOMETHING QUICK
// // AND LIGHTWEIGHT, HERE ARE PRESETS FOR SERVING HTML, JSON, JADE, AND EJS:
//
// // Use EJS (instead of default Jade)
// // Express's .render() looks in ./views for files of the specified
// // extension (.ejs) or if this line is ommitted it will look for .jade
// app.set('view engine', 'ejs');
//
//
// app.get('/html', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// })
//
// app.get('/ejs', function(req, res) {
//   res.render('index')
// });
//
// app.get('/json', function(req, res) {
//   res.send({myKey: "Hello World"});
// });
///////////////////////////////////////////////////////////////////////////////