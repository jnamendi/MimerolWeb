import { ApiResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { UserChangePasswordModel, UserDetailsModel } from '../../../models';

export interface UserInterface {
    onGetById(userId: number): Observable<ApiResponse>;
    changePassword(userChangePassword: UserChangePasswordModel): Observable<ApiResponse>;
    updateUserDetails(userDetailsModel: UserDetailsModel): Observable<ApiResponse>;
}

@Injectable()
export class UserService implements UserInterface {
    constructor(
        private http: HttpService
    ) { }

    onGetById(userId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.UserGetById + '/' + userId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    changePassword(userChangePassword: UserChangePasswordModel): Observable<ApiResponse> {
        let body = JSON.stringify(userChangePassword);
        return this.http.HttpPost(ApiUrl.UserChangePassword, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateUserDetails(userDetailsModel: UserDetailsModel): Observable<ApiResponse> {
        let body = JSON.stringify(userDetailsModel);
        return this.http.HttpPut(ApiUrl.UserUpdate + '/' + userDetailsModel.userId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}