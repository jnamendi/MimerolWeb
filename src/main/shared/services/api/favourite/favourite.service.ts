import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse, ApiResponse } from '../../api-response/api-response';
import { FavouriteModel } from '../../../models/favourite/favourite.model';

export interface FavouriteInterface {
    createFavourite(favouriteModel: FavouriteModel): Observable<ApiResponse>;
    updateFavourite(favouriteModel: FavouriteModel): Observable<ApiResponse>;
    getFavouriteByUserId(userId: number): Observable<ApiListResponse>;
    getFavouriteByRestaurantIdAndUserId(restaurantId: number, userId: number): Observable<ApiListResponse>;
}

@Injectable()
export class FavouriteService implements FavouriteInterface {

    constructor(
        private http: HttpService
    ) { }

    createFavourite(favouriteModel: FavouriteModel): Observable<ApiResponse> {
        let body = JSON.stringify(favouriteModel);
        return this.http.HttpPost(ApiUrl.FavouriteCreate, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateFavourite(favouriteModel: FavouriteModel): Observable<ApiResponse> {
        let body = JSON.stringify(favouriteModel);
        return this.http.HttpPut(ApiUrl.FavouriteUpdate + '/' + favouriteModel.favoriesId, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getFavouriteByUserId(userId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.FavouriteGetByUserId + '/' + userId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getFavouriteByRestaurantIdAndUserId(restaurantId: number, userId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.FavouriteGetByRestaurantIdAndUserId + '/' + restaurantId + '/' + userId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
