import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { RestaurantCommentModel } from '../../../models/restaurant-comment/restaurant-comment.model';

export interface RestaurantCommentInterface {
    getRestaurantComment(size: number, restaurantId: number): Observable<ApiListResponse>;
    createRestaurantComment(resCommentModel: RestaurantCommentModel): Observable<ApiResponse>;
}

@Injectable()
export class RestaurantCommentService implements RestaurantCommentInterface {
    constructor(
        private http: HttpService,
    ) { }

    getRestaurantComment(size: number, restaurantId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantCommentGetBySize + '/' + size + '/' + restaurantId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    createRestaurantComment(resCommentModel: RestaurantCommentModel): Observable<ApiResponse> {
        let body = JSON.stringify(resCommentModel);
        return this.http.HttpPost(ApiUrl.RestaurantCommentCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
