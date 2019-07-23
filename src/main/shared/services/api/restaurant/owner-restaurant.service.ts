import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';

export interface RestaurantOwnerInterface {
    getRestaurantByUserId(userId: number): Observable<ApiListResponse>;
    getAllRestaurantSortByName(): Observable<ApiListResponse>;
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
}
