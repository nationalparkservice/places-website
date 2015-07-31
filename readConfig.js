var configFile = require('./config');
var fandlebars = require('fandlebars');
var fs = require('fs');
var rep = {
  env: process.env,
  secrets: function (input) {
    return JSON.parse(fs.readFileSync(process.env.PWD + '/secrets/' + input[0] + '.json', 'utf8'));
  }
};

module.exports = function (config) {
  config = config || configFile;
  return fandlebars.obj(configFile, rep);
};
