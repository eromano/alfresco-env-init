/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ApiService } from './api.service';
import { UserModel } from './models/user.model';

export class IdentityService {
    ROLES = {
        ACTIVITI_USER: 'ACTIVITI_USER',
        ACTIVITI_ADMIN: 'ACTIVITI_ADMIN',
        ACTIVITI_DEVOPS: 'ACTIVITI_DEVOPS',
        ACTIVITI_IDENTITY: 'ACTIVITI_IDENTITY'
    };

    constructor(public api: ApiService) {}

    async createIdentityUser(user: UserModel = new UserModel()): Promise<any> {
        console.log(`Create Identity User ${user.email}`);
        await this.createUser(user);

        const userIdentity = await this.getUserInfoByUsername(user.username);
        await this.resetPassword(userIdentity.id, user.password);
        user.idIdentityService = userIdentity.id;
        return user;
    }

    async createUser(user: UserModel): Promise<any> {
        try {
            const path = '/users';
            const method = 'POST';

            const queryParams = {}, postBody = {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                enabled: true,
                email: user.email
            };

            return this.api.performIdentityOperation(path, method, queryParams, postBody);
        } catch (error) {
            console.error('Create User - Service error, Response: ', JSON.parse(JSON.stringify(error)).response.text);
        }
    }

    async getUserInfoByUsername(username: string): Promise<any> {
        const path = `/users`;
        const method = 'GET';
        const queryParams = { username };
        const postBody = {};

        const data = await this.api.performIdentityOperation(path, method, queryParams, postBody);
        return data[0];
    }

    async resetPassword(id: string, password: string): Promise<any> {
        const path = `/users/${id}/reset-password`;
        const method = 'PUT';
        const queryParams = {},
            postBody = { type: 'password', value: password, temporary: false };

        return this.api.performIdentityOperation(path, method, queryParams, postBody);
    }
}
