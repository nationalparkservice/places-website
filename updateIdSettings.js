var fs = require('fs');
var idSettings = require('./config').iD;
var settingsFilePath = process.argv[2];
var settingsFile = settingsFilePath + '/js/id/npmap.js';

console.log('Copying file:' + settingsFile);
fs.writeFileSync(settingsFile,  'iD.npmap = ' + JSON.stringify(idSettings, null, 4));
