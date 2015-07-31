var config = require('./readConfig')();
var exphbs = require('express-handlebars');
var express = require('express');
var path = require('path');
var placesApi = require('places-api')(config);

var createWebsite = function (port) {
  var app = express();
  app.set('port', port || process.env.PORT || 3000);

  // TODO: There is a script called allowXSS as part of the places-api project, but it's now set up right now
  // var allowXSS = require('./node_modules/poi-api/lib/allowXSS.js');
  // allowXSS(app);
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // Use handlebars as the template engine
  app.engine('handlebars', exphbs({
    defaultLayout: 'main'
  }));
  app.set('view engine', 'handlebars');

  // TODO: Move this into a separate error logging application
  // Error Logging
  process.on('uncaughtException', function (err) {
    console.log('************************************************');
    console.log('*             UNCAUGHT EXCEPTION               *');
    console.log('************************************************');
    console.log('************************************************');
    console.log('************************************************');
    console.log('Caught exception: ' + err);
    console.log('Trace', err.stack);
    console.log('************************************************');
    console.log('************************************************');
    console.log('************************************************');
    console.log('************************************************');
  });

  // Include the API and oauth tools

  // OSM API
  app.use('/api', placesApi.routes());

  // oauth (prob move this into poi-api soon!
  app.use('/oauth', placesApi.oauth());

  // iD Editor
  app.use(express.static(path.join(__dirname, '/node_modules/places-editor/places')));
  app.use('/dist', express.static(path.join(__dirname, '/node_modules/places-editor/dist')));
  app.use('/places', express.static(path.join(__dirname, '/node_modules/places-editor/places')));

  // Forward the browse requests
  app.get('/:type(browse|node|relation|way|changeset)/*', function (req, res) {
    var suffix = '.html';
    if (req.url.indexOf('/node/') < 0) {
      suffix = '/full' + suffix;
    }
    res.redirect(req.url.replace(req.params.type, 'api/0.6' + (req.params.type === 'browse' ? '' : ('/' + req.params.type))) + suffix);
  });

  // Code for debug only
  if (config.website && config.website.debug) {
    app.get('/status/get', function (req, res) {
      var returnValue = {
        'name': config.website.debug.name || 'DEBUG USER',
        'success': true,
        'userId': config.website.debug.userId || '00000000-0000-0000-0000-000000000000'
      };
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(returnValue));
    });
  }

  // Forward user info to OSM
  // http://www.openstreetmap.org/user/USERNAME
  // app.get('/user/:username', function(req, res) {
  // res.redirect('http://www.openstreetmap.org/user/' + req.params.username);
  // });

  app.listen(app.get('port'));
  console.log('Node.js server listening on port ' + app.get('port'));
};

createWebsite(config.website.port);

