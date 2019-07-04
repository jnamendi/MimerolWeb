import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse, ApiResponse } from '../../api-response/api-response';
import { OrderModel } from '../../../models/order/order.model';

export interface OrderInterface {
    getOrderByUserId(userId: number): Observable<ApiListResponse>;
    getOrderFullInfo(orderId: number, orderCode: string): Observable<ApiResponse>;
    getOrderPayment(orderId: number, orderCode: string): Observable<ApiResponse>;
    onPaymentOrder(orderModel: OrderModel): Observable<ApiResponse>;
}

@Injectable()
export class OrderService implements OrderInterface {

    constructor(
        private http: HttpService
    ) { }

    getOrderByUserId(userId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.OrderGetByUserId + '/' + userId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getOrderFullInfo(orderId: number, orderCode: string): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.OrderFullInfo + '/' + orderId + '/' + orderCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onPaymentOrder(orderModel: OrderModel): Observable<ApiResponse> {
        let body = JSON.stringify(orderModel);
        return this.http.HttpPost(ApiUrl.OrderPayment, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getOrderPayment(orderId: number, orderCode: string): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.OrderGetPayment + '/' + orderId + '/' + orderCode, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
