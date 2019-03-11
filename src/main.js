var Authentication = require('./login');
var AlfrescoUserCreation = require('./userCreation');
// var ProcessApplicationCreation = require('./processApplicationCreation');
var nconf = require('nconf');
var colors = require('colors/safe');

nconf.add('config', {type: 'file', file: './config.json'});

var provider = process.env.PROVIDER || nconf.get('provider');
var contentConf = process.env.CONTENT || nconf.get('content');
var processConf = process.env.PROCESS || nconf.get('process');
var users = process.env.USERS || nconf.get('users');
var applications = process.env.APPLICATIONS || nconf.get('applications');


if (provider === "ECM" || provider === "ALL") {
    this.authenticationCS = new Authentication(contentConf.username, contentConf.password, contentConf.host, 'ECM');

    this.authenticationCS.login().then(() => {

        this.alfrescoUserCreation = new AlfrescoUserCreation(users, this.authenticationCS.getJSapiInstance());
        this.alfrescoUserCreation.createUserContentService();

    }, (error) => {
        console.log(colors.red('CS-LOG: Error into: ' + JSON.stringify(error)));
        reject(error);
    });
}

if (provider === "BPM" || provider === "ALL") {
    this.authenticationPS = new Authentication(processConf.username, processConf.password, processConf.host, 'BPM');

    this.authenticationPS.login().then(() => {
        this.alfrescoUserCreation = new AlfrescoUserCreation(users, this.authenticationPS.getJSapiInstance());
        this.alfrescoUserCreation.createUserProcessService();

        // this.processApplicationCreation = new ProcessApplicationCreation(applications, this.authenticationPS.getJSapiInstance());
        // this.processApplicationCreation.importApps();

    }, (error) => {
        console.log(colors.red('PS-LOG: Error into: ' + JSON.stringify(error)));
        reject(error);
    });
}
