'use strict';

var colors = require('colors/safe');
var fileSystem = require('fs');
var path = require('path');

class ProcessApplicationCreation {

    constructor(apps, alfrescoJsApi) {
        this.alfrescoJsApi = alfrescoJsApi;
        this.apps = apps;
    }

    importApps() {
        this.apps.forEach((currentApp) => {

            // console.log(colors.green(`PS-LOG: App imported error` + currentApp.path));


            http.createServer(function (request, response) {
                var filePath = path.join(__dirname, currentApp.path);
                var stat = fileSystem.statSync(filePath);

                response.writeHead(200, {
                    'Content-Type': 'application/zip',
                    'Content-Length': stat.size
                });

                var readStream = fileSystem.createReadStream(filePath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(response);
            })
                .listen(2000);

            this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file).then(() => {
                console.log(colors.green(`PS-LOG: APP imported`));
            }, (error) => {

                console.log(colors.red(`PS-LOG: App imported error`) + error);

            });
        });
    }


}

module.exports = ProcessApplicationCreation;
