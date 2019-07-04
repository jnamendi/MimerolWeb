import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JwtTokenHelper } from '../../common';
import { StorageService } from '../../core';
import { StorageKey } from '../storage-key/storage-key';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { UserRole } from '../../models/user/user.model';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { ClientState } from '../../state/client/client-state';

@Injectable()
export class HttpService {

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState
    ) {
    }

    private hasAuthentication(rolesAllow: UserRole[] = []): boolean {
        let hasPermission = true;

        if (rolesAllow && rolesAllow.length > 0) {
            let userInfo = JwtTokenHelper.GetUserInfo();
            if (!userInfo || !userInfo.roles) {
                return false;
            }
            rolesAllow.map(r => {
                return hasPermission = userInfo.roles.some(role => role == UserRole[r].toLowerCase());
            });

        }
        return hasPermission;
    }

    private onNavigateToLogin() {
        this.router.navigate(['login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
    }


    HttpPostFile(url: string, body: any, authenticatedRequest: boolean = false, rolesAllow: UserRole[] = []) {
        if (authenticatedRequest && !this.hasAuthentication(rolesAllow)) {
            this.onNavigateToLogin();
            this.clientState.isBusy = false;
            return Observable.never();
        } else {
            let headers = authenticatedRequest ?
                new HttpHeaders({
                    'Content-Type': 'multipart/form-data; charset=utf-8',
                    'enctype': 'multipart/form-data',
                    'processData': 'false',
                    'contentType': 'false',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Authorization': this.getAuthorizationHeader()
                })
                : new HttpHeaders({
                    'Content-Type': 'multipart/form-data; charset=utf-8',
                    'enctype': 'multipart/form-data',
                    'processData': 'false',
                    'contentType': 'false',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                });

            let options = { headers: headers };

            return this.http.post(url, body, options);
        }
    }

    HttpPost(url: string, body: string, authenticatedRequest: boolean = false, rolesAllow: UserRole[] = []) {
        if (authenticatedRequest && !this.hasAuthentication(rolesAllow)) {
            this.onNavigateToLogin();
            this.clientState.isBusy = false;
            return Observable.never();
        } else {
            let options = {
                headers: this.getHeaders(authenticatedRequest, rolesAllow)
            };

            return this.http.post(url, body, options);
        }
    }

    HttpPostFormDataWithAddtionalData(url: string, formdata: FormData, authenticatedRequest: boolean = false, rolesAllow: UserRole[] = []) {
        if (authenticatedRequest && !this.hasAuthentication(rolesAllow)) {
            this.onNavigateToLogin();
            this.clientState.isBusy = false;
            return Observable.never();
        } else {
            const req = new HttpRequest('POST', url, formdata, {
                reportProgress: true,
                responseType: 'text',
                headers: new HttpHeaders({
                    'Authorization': this.getAuthorizationHeader()
                })
            });

            return this.http.request(req);
        }
    }

    HttpPut(url: string, body: string, authenticatedRequest: boolean = false, rolesAllow: UserRole[] = []) {
        if (authenticatedRequest && !this.hasAuthentication(rolesAllow)) {
            this.onNavigateToLogin();
            this.clientState.isBusy = false;
            return Observable.never();
        } else {
            let options = {
                headers: this.getHeaders(authenticatedRequest, rolesAllow)
            };

            return this.http.put(url, body, options);
        }
    }

    HttpDelete(url: string, authenticatedRequest: boolean = false, rolesAllow: UserRole[] = []) {
        if (authenticatedRequest && !this.hasAuthentication(rolesAllow)) {
            this.onNavigateToLogin();
            this.clientState.isBusy = false;
            return Observable.never();
        } else {
            let options = {
                headers: this.getHeaders(authenticatedRequest, rolesAllow)
            };

            return this.http.delete(url, options);
        }
    }

    HttpPostHeader(url: string, headers: HttpHeaders, body: string) {
        let options = {
            headers: headers
        };

        return this.http.post(url, body, options);
    }

    HttpGet(url: string, authenticatedRequest: boolean = false, rolesAllow: UserRole[] = []) {
        if (authenticatedRequest && !this.hasAuthentication(rolesAllow)) {
            this.onNavigateToLogin();
            this.clientState.isBusy = false;
            return Observable.never();
        } else {
            let options = {
                headers: this.getHeaders(authenticatedRequest, rolesAllow)
            };

            return this.http.get(url, options);
        }
    }

    HttpDownload(url: string, rolesAllow: UserRole[] = []) {
        let options = {
            headers: this.getHeaders(false, rolesAllow)
        };

        return this.http.get(url, options);
    }

    private getAuthorizationHeader() {
        var accessToken = localStorage.getItem(StorageKey.Token);
        return accessToken;
    }

    private getHeaders = (authenticatedRequest: boolean, rolesAllow: UserRole[] = []): HttpHeaders => {
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json ; charset=utf-8');
        headers = headers.append('Accept', 'application/json , text/javascript, */*; q=0.01');
        headers = headers.append('Access-Control-Allow-Origin', '*');

        // let headers = new HttpHeaders({
        //     'Content-Type': 'application/json ; charset=utf-8',
        //     'Accept': 'application/json , text/javascript, */*; q=0.01',
        //     'Access-Control-Allow-Origin': '*'
        // });

        if (authenticatedRequest) {
            headers = headers.append('Authorization', this.getAuthorizationHeader());
        }

        return headers;
    }
}    
