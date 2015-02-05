# Places Website Deploy

## Basics
* The places-website is deployed via git and npm install
* It is run using a node.js task runner called [forever.js](https://github.com/foreverjs/forever).
* Forever is run as a service using a tool called [forever-service](https://github.com/zapty/forever-service)
* The website runs on the places ubuntu server under the npmap user.

### Install
```
npm install -g forever
npm install -g forever-service
git clone https://github.com/nationalparkservice/places-website.git
cd ./places-website
npm install
sudo forever-service install places-website --script index.js
```

### Using Forever, restarting the service
```
Commands to interact with service places-website
Start   - "sudo start places-website"
Stop    - "sudo stop places-website"
Status  - "sudo status places-website"
Restart - "sudo restart places-website"
```

#### Note:
"restart service" command works like stop in Ubuntu due to bug in upstart https://bugs.launchpad.net/upstart/+bug/703800

To get around this run the command:

```sudo stop places-website && sudo start places-website```

## Error Logs
* The places-api project uses a multi-transport async logging library called [winstonjs](https://github.com/winstonjs/winston).
* The errors from places-api are reported up through the places-website (which is a container for places-api)
* The error reporting settings can be found in the [errorLogger.js file in the places-api project](https://github.com/nationalparkservice/places-api/blob/master/src/errorLogger.js).
* The files that are specied in that file can be found in the root of the places-website directory.
    * filelog-info.log
    * filelog-error.log
    * filelog-debug.log
