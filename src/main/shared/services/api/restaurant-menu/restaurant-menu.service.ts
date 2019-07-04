import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';

export interface RestaurantMenuInterface {
    getRestaurantMenu(languageCode: string, restaurantId: number): Observable<ApiResponse>;
}

@Injectable()
export class RestaurantMenuService implements RestaurantMenuInterface {

    constructor(
        private http: HttpService,
    ) { }

    getRestaurantMenu(languageCode: string, restaurantId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.RestaurantMenuGetGetByLanguageCode + '/' + languageCode + '/' + restaurantId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
