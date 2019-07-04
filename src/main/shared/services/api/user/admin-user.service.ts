import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { UserAdminModel } from '../../../models/user/admin-user.model';

export interface UserAdminInterface {
    createUser(userAdminModel: UserAdminModel): Observable<ApiResponse>;
    updateUser(userAdminModel: UserAdminModel): Observable<ApiResponse>;
    deleteUser(userId: number): Observable<ApiResponse>;
    deleteManyUser(userIds: Array<number>): Observable<ApiResponse>;
    getUser(userId: number): Observable<ApiResponse>;
    getUsers(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging>;
    getAllUserSortByName(languageCode?: string): Observable<ApiListResponse>;
}

@Injectable()
export class UserAdminService implements UserAdminInterface {

    constructor(
        private http: HttpService
    ) { }

    createUser(userAdminModel: UserAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(userAdminModel);
        return this.http.HttpPost(ApiUrl.UserCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateUser(userAdminModel: UserAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(userAdminModel);
        return this.http.HttpPut(ApiUrl.UserUpdate + '/' + userAdminModel.userId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteUser(userId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.UserDelete + '/' + userId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyUser(userIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: userIds });
        return this.http.HttpPost(ApiUrl.UserDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getUser(userId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.UserGetById + '/' + userId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getUsers(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging> {
        let queryString = `/${pageIndex}/${pageSize}`;
        return this.http.HttpGet(`${ApiUrl.UserGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getAllUserSortByName(languageCode?: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.UserGetAllSortByName, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
