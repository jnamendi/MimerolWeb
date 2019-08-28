import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse, ApiResponsePaging } from '../../api-response/api-response';

export interface CityInterface {
    onGetCities(): Observable<ApiResponsePaging>;
    onGetByRestaurantId(restaurantId: number): Observable<ApiListResponse>;
}

@Injectable()
export class CityService implements CityInterface {

    constructor(
        private http: HttpService
    ) { }

    onGetCities(): Observable<ApiResponsePaging> {
        return this.http.HttpGet(ApiUrl.CityGetAll, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
    onGetByRestaurantId(restaurantId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.CityGetByRestaurantId + "/" + restaurantId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
