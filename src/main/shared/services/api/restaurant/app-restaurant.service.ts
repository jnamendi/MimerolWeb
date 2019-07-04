import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { AreaSearch } from '../../../models/google/country-restaurant.model';

export interface RestaurantAppInterface {
    getRestaurantByArea(searchArea: AreaSearch): Observable<ApiResponse>;
    getRestaurantDetails(restaurantId: number, languageCode: string): Observable<ApiResponse>;
    getRestaurantByName(name: string): Observable<ApiListResponse>;
    getRegisteredRestaurantsByCity(cityName: string): Observable<ApiListResponse>;
}

@Injectable()
export class RestaurantAppService implements RestaurantAppInterface {

    constructor(
        private http: HttpService,
    ) { }

    getRestaurantByArea(searchArea: AreaSearch): Observable<ApiResponse> {
        let body = JSON.stringify(searchArea);
        return this.http.HttpPost(ApiUrl.RestaurantGetByDistrict, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRestaurantDetails(restaurantId: number, languageCode: string): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetDetails + '/' + restaurantId + '/' + languageCode, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRestaurantByName(name: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetByName + '/' + name, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRegisteredRestaurantsByCity(cityName: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetRegisteredRestaurantsByCity + '/' + cityName, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
