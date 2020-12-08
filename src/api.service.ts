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

import { AlfrescoApiCompatibility as AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';

export class ApiService {

    apiService: AlfrescoApi;

    config: AlfrescoApiConfig = new AlfrescoApiConfig({
        authType: 'OAUTH',
        oauth2: {
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }

    });

    constructor(clientIdOrAppConfig?: AlfrescoApiConfig) {

        if (clientIdOrAppConfig) {
            console.log('overwrite ApiService config param');

            this.config = { ...this.config, ...clientIdOrAppConfig };

            this.config.hostEcm = clientIdOrAppConfig.hostEcm ? clientIdOrAppConfig.hostEcm : this.config.hostEcm;
            this.config.hostBpm = clientIdOrAppConfig.hostBpm ? clientIdOrAppConfig.hostBpm : this.config.hostBpm;
        }

        console.log('Api Service configuration' + JSON.stringify(this.config));
        this.apiService = new AlfrescoApi(this.config);
    }

	async performIdentityOperation(path: string, method: string, queryParams: any, postBody: any): Promise<any> {
		return new Promise((resolve, reject) => {

			const uri = this.config.oauth2.host.replace('/realms', '/admin/realms') + path;
			const pathParams = {}, formParams = {};
			const contentTypes = ['application/json'];
			const accepts = ['application/json'];

			const headerParams = {
				Authorization: 'bearer ' + this.apiService.oauth2Auth.token
			};

			return this.apiService.processClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
				contentTypes, accepts, Object)
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	}

    getInstance(): AlfrescoApi {
        return this.apiService;
    }

    async login(username: string, password: string): Promise<void> {
        await this.apiService.login(username, password);
    }

}
