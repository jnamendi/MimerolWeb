import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponsePaging, ApiListResponse,ApiResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { RestaurantCommentOwnerModel } from '../../../models/restaurant-comment/owner-restaurant-comment.model';

export interface RestaurantCommentOwnerInterface {
    getRestaurantCommentByResId(pageIndex?: number, pageSize?: number, resId?: number): Observable<ApiResponsePaging>;
    getCommentByOwner(userId: number): Observable<ApiListResponse>;
    getComment(commentId: number): Observable<ApiResponse>;
}

@Injectable()
export class RestaurantCommentOwnerService implements RestaurantCommentOwnerInterface {
    constructor(
        private http: HttpService,
    ) { }

    getRestaurantCommentByResId(pageIndex?: number, pageSize?: number, resId?: number): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!resId) {
            query.set('resId', resId.toString())
        }

        let queryString = `/${pageIndex}/${pageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.CommentGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getCommentByOwner(userId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantCommentGetByOwner + '/' + userId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getComment(commentId: number): Observable<ApiResponse>{
        return this.http.HttpGet(ApiUrl.CommentGetById + '/' + commentId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
    updateComment(restaurantCommentOwnerModel: RestaurantCommentOwnerModel):Observable<ApiResponse>{
        let body = JSON.stringify(restaurantCommentOwnerModel);
        return this.http.HttpPut(ApiUrl.CommentCreate + '/' + restaurantCommentOwnerModel.resCommentId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
