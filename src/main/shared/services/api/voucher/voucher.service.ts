import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';

export interface VoucherInterface {
    getVoucherByCode(voucherCode: string): Observable<ApiResponse>;
    getPromotionByCode(promotionCode: string, restaurantId: number): Observable<ApiResponse>;
}

@Injectable()
export class VoucherService implements VoucherInterface {

    constructor(
        private http: HttpService
    ) { }

    getVoucherByCode(voucherCode: string): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.VoucherGetByCode + '/' + voucherCode, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getPromotionByCode(promotionCode: string, restaurantId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.PromotionGetByCode + '/' + promotionCode + '/' + restaurantId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
