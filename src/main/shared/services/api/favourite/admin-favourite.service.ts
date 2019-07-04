import { Observable } from 'rxjs/Observable';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';
import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';

export interface FavouriteAdminInterface {
    getFavoutite(favouritesId: number): Observable<ApiResponse>;
    getFavourites(pageNumber?: number, pageSize?: number): Observable<ApiResponsePaging>;
}

@Injectable()
export class FavouriteAdminService implements FavouriteAdminInterface {
    
    constructor(
        private http: HttpService,
    ) { }

    getFavoutite(favouritesId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.FavouriteGetById + '/' + favouritesId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getFavourites(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging> {
        let queryString = `/${pageIndex}/${pageSize}`;
        return this.http.HttpGet(`${ApiUrl.FavouriteGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

}
