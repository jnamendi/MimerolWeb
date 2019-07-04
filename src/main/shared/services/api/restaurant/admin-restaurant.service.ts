import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { RestaurantAdminModel } from '../../../models/restaurant/admin-restaurant.model';

export interface RestaurantAdminInterface {
    createRestaurant(restaurantAdminModel: RestaurantAdminModel): Observable<ApiResponse>;
    updateRestaurant(restaurantAdminModel: RestaurantAdminModel): Observable<ApiResponse>;
    deleteRestaurant(restaurantId: number): Observable<ApiResponse>;
    deleteManyRestaurant(restaurantIds: Array<number>): Observable<ApiResponse>;
    getRestaurant(restaurantId: number, languageCode: string): Observable<ApiResponse>;
    getRestaurants(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging>;
    getAllRestaurantSortByName(): Observable<ApiListResponse>;
    getRestaurantDetails(restaurantId: number, languageCode: string): Observable<ApiResponse>;
}

@Injectable()
export class RestaurantAdminService implements RestaurantAdminInterface {

    constructor(
        private http: HttpService,
    ) { }

    createRestaurant(restaurantAdminModel: RestaurantAdminModel): Observable<ApiResponse> {
        const formdata: FormData = new FormData();
        formdata.append('file', restaurantAdminModel.file == null || restaurantAdminModel.file.name == '' ? null : restaurantAdminModel.file);
        formdata.append('restaurantAdminModel', JSON.stringify(restaurantAdminModel));
        return this.http.HttpPostFormDataWithAddtionalData(ApiUrl.RestaurantInsert, formdata, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateRestaurant(restaurantAdminModel: RestaurantAdminModel): Observable<ApiResponse> {
        const formdata: FormData = new FormData();
        formdata.append('file', restaurantAdminModel.file == null || restaurantAdminModel.file.name == '' ? null : restaurantAdminModel.file);
        formdata.append('restaurantAdminModel', JSON.stringify(restaurantAdminModel));
        return this.http.HttpPostFormDataWithAddtionalData(ApiUrl.RestaurantEdit + '/' + restaurantAdminModel.restaurantId, formdata, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteRestaurant(restaurantId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.RestaurantDelete + '/' + restaurantId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyRestaurant(restaurantIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: restaurantIds });
        return this.http.HttpPost(ApiUrl.RestaurantDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRestaurant(restaurantId: number, languageCode: string): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetById + '/' + restaurantId + '/' + languageCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRestaurants(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging> {
        let queryString = `/${pageIndex}/${pageSize}`;
        return this.http.HttpGet(`${ApiUrl.RestaurantGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getAllRestaurantSortByName(): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetAllSortByName, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRestaurantDetails(restaurantId: number, languageCode: string): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantGetDetails + '/' + restaurantId + '/' + languageCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
