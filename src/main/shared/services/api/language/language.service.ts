import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Language } from '../../../models/langvm.model';
import { ApiUrl } from "../../api-url/api-url";
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';

export interface LanguageInterface {
    getLanguagesFromService(): Observable<ApiResponsePaging>;
    isLanguage(languageCode: LanguageCode): boolean;
    getCurrentLanguage(): string;
    setLanguage(languageCode: LanguageCode): void;
    saveLanguageToDB(language: Language): Observable<ApiResponse>;
}

@Injectable()
export class LanguageService implements LanguageInterface {

    constructor(
        private http: HttpService
    ) { }

    getLanguagesFromService(): Observable<ApiResponsePaging> {
        return this.http.HttpGet(ApiUrl.LanguageGetAll, true)
            .map(ApiHelper.extractData)
            .catch(ApiHelper.onFail);
    }

    isLanguage(languageCode: LanguageCode): boolean {
        let currentLanguage = localStorage.getItem('lang');
        return currentLanguage == LanguageCode[languageCode].toLocaleLowerCase();
    }

    getCurrentLanguage(): string {
        let currentLanguage = localStorage.getItem('lang');
        return currentLanguage ? currentLanguage.toString() : '';
    }

    setLanguage(languageCode: LanguageCode): void {
        localStorage.setItem('lang', LanguageCode[languageCode].toLocaleLowerCase());
    }

    saveLanguageToDB(language: Language): Observable<ApiResponse> {
        let body = JSON.stringify(language);
        return this.http.HttpPost(ApiUrl.LanguageSaving, body, false)
            .map(ApiHelper.extractData)
            .catch(ApiHelper.onFail);
    }
}

export enum LanguageCode {
    EN = 0,
    ES = 1
}