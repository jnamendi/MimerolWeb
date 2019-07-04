import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { AreaSearch } from '../../../models/google/country-restaurant.model';

export interface CategoryAppInterface {
    getRestaurantByArea(searchArea: AreaSearch): Observable<ApiListResponse>;
}

@Injectable()
export class CategoryAppService implements CategoryAppInterface {

    constructor(
        private http: HttpService
    ) { }

    getRestaurantByArea(searchArea: AreaSearch): Observable<ApiListResponse> {
        let body = JSON.stringify(searchArea);
        return this.http.HttpPost(ApiUrl.CategoryGetByDistrict, body, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
