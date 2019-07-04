import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { RatingAdminModel } from '../../../models/rating/admin-rating.model';

export interface RatingAdminInterface {
    createRating(ratingAdminModel: RatingAdminModel): Observable<ApiResponse>;
    updateRating(ratingAdminModel: RatingAdminModel): Observable<ApiResponse>;
    deleteRating(ratingId: number): Observable<ApiResponse>;
    deleteManyRating(ratingIds: Array<number>): Observable<ApiResponse>;
    getRating(ratingId: number): Observable<ApiResponse>;
    getRatings(pageIndex?: number, pageSize?: number, search?: string, filterBy?: string, filterType?: string): Observable<ApiResponsePaging>;
}

@Injectable()
export class RatingAdminService implements RatingAdminInterface {
    constructor(
        private http: HttpService
    ) { }

    createRating(ratingAdminModel: RatingAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(ratingAdminModel);
        return this.http.HttpPost(ApiUrl.RatingCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateRating(ratingAdminModel: RatingAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(ratingAdminModel);
        return this.http.HttpPut(ApiUrl.RatingUpdate + '/' + ratingAdminModel.ratingId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteRating(ratingId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.RatingDelete + '/' + ratingId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyRating(ratingIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: ratingIds });
        return this.http.HttpPost(ApiUrl.RatingDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRating(ratingId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.RatingGetById + '/' + ratingId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getRatings(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging> {
        let queryString = `/${pageIndex}/${pageSize}`;
        return this.http.HttpGet(`${ApiUrl.RatingGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
