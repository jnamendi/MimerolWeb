import { ContactModel } from '../../../models';
import { Observable } from 'rxjs/Observable';
import { ApiResponse } from '../../api-response/api-response';
import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';

export interface ContactInterface {
    createContact(contactModel: ContactModel): Observable<ApiResponse>;
}

@Injectable()
export class ContactService implements ContactInterface {
    constructor(
        private http: HttpService
    ) { }

    createContact(contactModel: ContactModel): Observable<ApiResponse> {
        let body = JSON.stringify(contactModel);
        return this.http.HttpPost(ApiUrl.ContactCreate, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}