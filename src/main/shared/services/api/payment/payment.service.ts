import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse } from '../../api-response/api-response';

export interface PaymentInterface {
    onGetAllPayment(): Observable<ApiListResponse>;
}

@Injectable()
export class PaymentService implements PaymentInterface {

    constructor(
        private http: HttpService
    ) { }
    
    onGetAllPayment(): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.PaymentGetAll, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}