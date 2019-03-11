'use strict';

var colors = require('colors/safe');

class AlfrescoUserCreation {

    constructor(users, alfrescoJsApi) {
        this.alfrescoJsApi = alfrescoJsApi;
        this.users = users;
    }

    createUserProcessService() {

        this.users.forEach((currentUser) => {

            var userRepresentation = new this.alfrescoJsApi.activiti.UserRepresentation(); // UserRepresentation | userRepresentation

            userRepresentation.email = currentUser.email;
            userRepresentation.firstName = currentUser.firstName;
            userRepresentation.lastName = currentUser.lastName;
            userRepresentation.password = currentUser.password;
            userRepresentation.company = currentUser.password;
            userRepresentation.status = "active";
            userRepresentation.tenantId = "1";
            userRepresentation.type = "enterprise";

            this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(userRepresentation).then(() => {
                    console.log(colors.green(`PS-LOG: User ${userRepresentation.email} created`));

                },
                (error) => {
                    if (error.status === 409) {
                        console.log(colors.yellow(`PS-LOG: User ${userRepresentation.email} already exist`));
                    }else if(error.status === 500){
                        console.log(colors.yellow(`PS-LOG: ${userRepresentation.email} Possible incorrect password ${error}`));
                    }else{
                        console.log(colors.red(`PS-LOG: ${userRepresentation.email} ${error}`));
                    }
                });
        });
    }

    createUserContentService() {
        this.users.forEach((currentUser) => {
            var personBodyCreate = new this.alfrescoJsApi.core.PersonBodyCreate();

            personBodyCreate.id = currentUser.email;
            personBodyCreate.email = currentUser.email;
            personBodyCreate.lastName = currentUser.lastName;
            personBodyCreate.firstName = currentUser.firstName;
            personBodyCreate.password = currentUser.password;

            this.alfrescoJsApi.core.peopleApi.addPerson(personBodyCreate).then(() => {
                    console.log(colors.green(`CS-LOG: User ${personBodyCreate.id} created`));
                },
                (error) => {
                    if (error.status === 409) {
                        console.log(colors.yellow(`CS-LOG: User ${personBodyCreate.id} already exist`));
                    }else{
                        console.log(colors.red(`CS-LOG: User ${personBodyCreate.id}  ${error}`));
                    }
                });
        });
    }
}

module.exports = AlfrescoUserCreation;
