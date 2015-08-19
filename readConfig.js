var fandlebars = require('fandlebars');
var fs = require('fs');
var replace = {
  env: process.env,
  secrets: function (input) {
    return JSON.parse(fs.readFileSync(__dirname + '/secrets/' + input[0] + '.json', 'utf8'));
  },
  environment: function (input) {
    return JSON.parse(fs.readFileSync(__dirname + '/environments.json', 'utf8'))[process.env.NODE_ENV || 'development'][input[0]];
  }
};

module.exports = function (config) {
  config = config || require('./config');
  return fandlebars.obj(config, replace);
};

// console.log(JSON.stringify(fandlebars.obj(require('./config'), replace), null, 2));
