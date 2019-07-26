import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse, ApiResponse } from '../../api-response/api-response';
import { AdminOrderModel } from '../../../models/order/admin-order.model';

export interface OrderAdminInterface {
    getAllOrder(): Observable<ApiListResponse>;
    updateOrder(adminOrderModel: AdminOrderModel): Observable<ApiResponse>;
}

@Injectable()
export class OrderAdminService implements OrderAdminInterface {
    constructor(
        private http: HttpService
    ) { }

    getAllOrder(): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.OrderGetAllOrder, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateOrder(adminOrderModel: AdminOrderModel): Observable<ApiResponse> {
        let body = JSON.stringify(adminOrderModel);
        return this.http.HttpPost(ApiUrl.OrderUpdate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
