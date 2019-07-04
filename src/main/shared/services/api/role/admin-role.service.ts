import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { RoleAdminModel } from '../../../models/role/admin-role.model';

export interface RoleAdminInterface {
    createRole(roleAdminModel: RoleAdminModel): Observable<ApiResponse>;
    updateRole(roleAdminModel: RoleAdminModel): Observable<ApiResponse>;
    deleteRole(roleId: number): Observable<ApiResponse>;
    deleteManyRole(roleIds: Array<number>): Observable<ApiResponse>;
    getRole(roleId: number): Observable<ApiResponse>;
    getRoles(): Observable<ApiListResponse>;
}

@Injectable()
export class RoleAdminService implements RoleAdminInterface {
    constructor(
        private http: HttpService,
    ) { }

    createRole(roleAdminModel: RoleAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(roleAdminModel);
        return this.http.HttpPost(ApiUrl.RoleCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateRole(roleAdminModel: RoleAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(roleAdminModel);
        return this.http.HttpPut(ApiUrl.RoleUpdate + '/' + roleAdminModel.roleId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteRole(roleId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.RoleDelete + '/' + roleId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyRole(roleIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: roleIds });
        return this.http.HttpPost(ApiUrl.RoleDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRole(roleId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.RoleGetById + '/' + roleId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRoles(): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RoleGetList, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

}
