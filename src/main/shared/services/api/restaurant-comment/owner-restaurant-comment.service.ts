import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponsePaging, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';

export interface RestaurantCommentOwnerInterface {
    getRestaurantCommentByResId(pageIndex?: number, pageSize?: number, resId?: number): Observable<ApiResponsePaging>;
    getCommentByOwner(userId: number): Observable<ApiListResponse>;
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
}
