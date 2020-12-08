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

import { UserRepresentation } from '@alfresco/js-api';
import { IdentityService } from './identity.service';
import { UserModel } from './models/user.model';
import { ApiService } from './api.service';
import { Tenant } from './models/tenant';
import { Logger } from '../../alfresco-ng2-components/lib/testing';

export class UsersActions {

    api: ApiService;
    identityService: IdentityService;

    constructor(alfrescoApi: ApiService) {
        this.api = alfrescoApi;
        if (this.api.apiService.isOauthConfiguration()) {
            this.identityService = new IdentityService(this.api);
        }
    }

    async createUser(userModel?: UserModel): Promise<UserModel> {
        const user = new UserModel({ ...(userModel ? userModel : {}) });

        try {
            if (this.api.apiService.isEcmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
                console.log(`Create user ECM ${user.email}`);
                await this.api.apiService.core.peopleApi.addPerson({
                    id: user.email,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: user.password
                });
            }
        } catch (e) {
            if (e.status === 409) {
                console.error('ACS user already created');
            } else {
                console.error('Not able to create ACS user: ' + JSON.stringify(e));
            }
        }

        try {
            if (this.api.apiService.isBpmConfiguration() || (this.api.apiService.isEcmBpmConfiguration())) {
				console.log('Create user BPM',user.tenantId.toString(), user.email, user.firstName, user.lastName, user.password);
                if (user.tenantId) {
                    const apsUser = await this.createApsUser(user.tenantId, user.email, user.firstName, user.lastName, user.password);
                    user.id = apsUser.id;
                } else {
                    const apsUser = await this.createTenantAndUser(user.email, user.firstName, user.lastName, user.password);
                    user.tenantId = apsUser.tenantId;
                    user.id = apsUser.id;
                }
            }
        } catch (e) {
            if (e.status === 409) {
                console.error('BPM user already created');
            } else {
                console.error('Not able to create BPM user: ' + JSON.stringify(e));
            }
        }

        try {
            if (this.api.apiService.isOauthConfiguration()) {
                console.log('Create user identity');

                const identityUser = await this.identityService.createIdentityUser(user);
                user.idIdentityService = identityUser.idIdentityService;
            }
        } catch (e) {
            if (e.status === 409) {
                console.error('Identity user already created');
            } else {
                console.error('Not able to create identity user: ' + JSON.stringify(e));
            }
        }

        return user;
    }

    async createTenantAndUser(email?: string, firstName?: string, lastName?: string, password?: string): Promise<UserRepresentation> {
        const newTenant = await this.api.apiService.activiti.adminTenantsApi.createTenant(new Tenant());

        const user = new UserModel({
            tenantId: newTenant.id,
            email,
            firstName,
            lastName,
            password
        });

        return this.api.apiService.activiti.adminUsersApi.createNewUser(user.getAPSModel());
    }

    async createApsUser(tenantId?: number, email?: string, firstName?: string, lastName?: string, password?: string): Promise<UserRepresentation> {

        const user = new UserModel({
            tenantId,
            email,
            firstName,
            lastName,
            password
        });

        return this.api.apiService.activiti.adminUsersApi.createNewUser(user.getAPSModel());
    }

}