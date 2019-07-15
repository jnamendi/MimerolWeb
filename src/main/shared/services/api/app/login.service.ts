import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiResponse } from '../../api-response/api-response';
import { UserModel } from '../../../models';
import { StorageKey } from '../../storage-key/storage-key';

export interface LoginInterface {
    onLogin(user: UserModel): Observable<ApiResponse>;
    onSignin(user: UserModel): Observable<ApiResponse>;
    onLogout(): Promise<void>;
    onForgotPassword(email: string, languageCode: string): Observable<ApiResponse>;
    onActivateAccount(token: string): Observable<ApiResponse>;
    onResendActivate(email: string, languageCode: string): Observable<ApiResponse>;
}

@Injectable()
export class LoginService implements LoginInterface {
    constructor(
        private http: HttpService
    ) { }

    onLogin = (user: UserModel): Observable<ApiResponse> => {
        let body = JSON.stringify(user);
        return this.http.HttpPost(ApiUrl.UserLogin, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onSignin = (user: UserModel): Observable<ApiResponse> => {
        let body = JSON.stringify(user);
        return this.http.HttpPost(ApiUrl.UserResgister, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onLogout = async (): Promise<void> => {
        return Promise.resolve(localStorage.removeItem(StorageKey.Token));
    }

    onForgotPassword(email: string, languageCode: string): Observable<ApiResponse> {
        let body = JSON.stringify({ email, languageCode });
        return this.http.HttpPost(ApiUrl.UserForgotPassword, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onActivateAccount(token: string): Observable<ApiResponse> {
        let body = JSON.stringify({ token });
        return this.http.HttpPost(ApiUrl.UserActivateAccount, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onResendActivate(email: string, languageCode: string): Observable<ApiResponse> {
        let body = JSON.stringify({ email, languageCode });
        return this.http.HttpPost(ApiUrl.UserResendEmail, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
