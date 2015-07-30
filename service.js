// https://github.com/coreybutler/node-windows
//
// node-windows isn't included in the package, since it's only used for the windows installation
// npm install -g node-windows
// npm link node-windows
// node service.js

var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name: 'Places Website Node.js App',
  description: 'the places-website for the node.js app that runs the Places project.',
  script: 'C:\\places-website\\index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
});

svc.install();
