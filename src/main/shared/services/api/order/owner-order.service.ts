import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import {ApiResponsePaging, ApiResponse } from '../../api-response/api-response';
import { OwnerOrderModel } from '../../../models/order/owner-order.model';

export interface OrderOwnerInterface {
    getOrderByRestaurantAndStatus(pageIndex?: number, pageSize?: number, restaurantId?: number): Observable<ApiResponsePaging>;
    updateOrder(ownerOrderModel: OwnerOrderModel): Observable<ApiResponse>;
}

@Injectable()
export class OrderOwnerService implements OrderOwnerInterface {

    constructor(
        private http: HttpService
    ) { }

    getOrderByRestaurantAndStatus(pageIndex?: number, pageSize?: number, restaurantId?: number): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!restaurantId) {
            query.set('restaurantId', restaurantId.toString())
        }
        
        let queryString = `/${pageIndex}/${pageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.OrderGetByRestaurantAndStatus}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateOrder(ownerOrderModel: OwnerOrderModel): Observable<ApiResponse> {
        let body = JSON.stringify(ownerOrderModel);
        return this.http.HttpPost(ApiUrl.OrderUpdate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
