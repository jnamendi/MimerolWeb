import { ApiResponse, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { UserOwnerModel } from '../../../models/user/owner-user.model';

export interface UserOwnerInterface {
    createUserInfo(userOwnerModel: UserOwnerModel): Observable<ApiResponse>;
    updateUserInfo(userOwnerModel: UserOwnerModel): Observable<ApiResponse>;
    onGetByUserId(userId: number): Observable<ApiListResponse>;
}

@Injectable()
export class UserOwnerService implements UserOwnerInterface {
    constructor(
        private http: HttpService
    ) { }

    createUserInfo(userOwnerModel: UserOwnerModel): Observable<ApiResponse> {
        let body = JSON.stringify(userOwnerModel);
        return this.http.HttpPost(ApiUrl.UserInfoCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateUserInfo(userOwnerModel: UserOwnerModel): Observable<ApiResponse> {
        let body = JSON.stringify(userOwnerModel);
        return this.http.HttpPut(ApiUrl.UserInfoUpdate + '/' + userOwnerModel.userInfoId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onGetByUserId(userId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.UserInfoGetByUserId + '/' + userId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}