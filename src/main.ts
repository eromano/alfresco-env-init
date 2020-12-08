// var ProcessApplicationCreation = require('./processApplicationCreation');
import * as nconf from 'nconf';
import { UserModel } from './models/user.model';
import { ApiService } from './api.service';
import { UsersActions } from './users.actions';

nconf.add('config', { type: 'file', file: './config.json' });

var conf = nconf.get('conf');
var credentials = nconf.get('credentials');
var users = nconf.get('users');

const apiService = new ApiService(conf);

console.log(`Users ${credentials.username}`);
console.log(`Password ${credentials.password}`);

apiService.login(credentials.username, credentials.password).then(() => {
	const usersActions = new UsersActions(apiService);

	users.forEach((currentUser) => {

		usersActions.createUser(new UserModel({
			id: currentUser.id,
			email: currentUser.email,
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			company: currentUser.company,
			tenantId: currentUser.id,
			password: currentUser.password
		}));
	});
}, () => {
	console.log('You are not logged in');
});
