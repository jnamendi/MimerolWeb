import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse } from '../../api-response/api-response';

export interface DistrictInterface {
    onGetDistrictByCity(cityId: number): Observable<ApiListResponse>;
    onGetDistrictByCityMultiple(cityId: number): Observable<ApiListResponse>;
}

@Injectable()
export class DistrictService implements DistrictInterface {
  

    constructor(
        private http: HttpService
    ) { }

    onGetDistrictByCity(cityId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.DistrictGetByCity + "/" + cityId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
    onGetDistrictByCityMultiple(cityId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.DistrictGetByCity + "/" + cityId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
