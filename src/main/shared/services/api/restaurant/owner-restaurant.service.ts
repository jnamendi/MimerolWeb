import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiListResponse, ApiResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';

export interface RestaurantOwnerInterface {
    getRestaurantByUserId(userId: number): Observable<ApiListResponse>;
    getAllRestaurantSortByName(): Observable<ApiListResponse>;
    exportInvoiceByRestaurantId(restaurantId: number, fromDate: string, toDate: string): Observable<ApiResponse>;
}

@Injectable()
export class RestaurantOwnerService implements RestaurantOwnerInterface {
    constructor(
        private http: HttpService,
    ) { }

    getRestaurantByUserId(userId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetDetails + '/' + userId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getAllRestaurantSortByName(): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetAllSortByName, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    exportInvoiceByRestaurantId(restaurantId: number, fromDate: string, toDate: string): Observable<ApiResponse> {
        let body = JSON.stringify({
            "fromDate": fromDate,
            "toDate": toDate
        });
        return this.http.HttpPost(ApiUrl.ExportInvoiceByRestaurantId + '/' + restaurantId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
