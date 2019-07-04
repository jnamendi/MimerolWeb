import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { StorageKey } from '../storage-key/storage-key';

@Injectable()
export class AppAuthService {
    private _redirectUrl: string;
    constructor(public jwtHelper: JwtHelperService) {

    }

    public isAuthenticated = (): boolean => {
        const token = localStorage.getItem(StorageKey.Token);
        return !this.jwtHelper.isTokenExpired(token);
    }

    public set redirectUrl(value: string) {
        this._redirectUrl = value;
    }

    public get redirectUrl(): string {
        return this._redirectUrl;
    }
}