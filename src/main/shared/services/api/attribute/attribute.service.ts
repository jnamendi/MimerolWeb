import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse } from '../../api-response/api-response';

export interface AttributeInterface {
    onGetAttributeGroup(languageCode: string): Observable<ApiListResponse>;
}

@Injectable()
export class AttributeService implements AttributeInterface {

    constructor(
        private http: HttpService
    ) { }

    onGetAttributeGroup(languageCode: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.AttributeGetAllByLanguageCode + '/' + languageCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
