var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    fs = require('fs');


var app = express();

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));  
});

//just serve up an index to start
app.get('/', function(req, res){
    res.sendfile('./public/index.html');
});

var port = process.env.PORT || 3000;
// var port = 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

