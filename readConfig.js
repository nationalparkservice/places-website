var fandlebars = require('fandlebars');
var fs = require('fs');
var rep = {
  env: process.env,
  secrets: function (input) {
    return JSON.parse(fs.readFileSync(__dirname + '/secrets/' + input[0] + '.json', 'utf8'));
  }
};

module.exports = function (config) {
  var env = process.env.NODE_ENV || 'Test';
  config = config || require('./conf' + env.substr(0, 1).toUpperCase() + env.substr(1));
  return fandlebars.obj(config, rep);
};
