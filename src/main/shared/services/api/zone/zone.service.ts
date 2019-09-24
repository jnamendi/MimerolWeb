import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse } from '../../api-response/api-response';

export interface ZoneInterface {
    onGetZones(): Observable<ApiListResponse>;
    onGetZoneByDistrict(districtId: number): Observable<ApiListResponse>;
}

@Injectable()
export class ZoneService implements ZoneInterface {

    constructor(
        private http: HttpService
    ) { }
    
    onGetZones(): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.ZoneGetAll, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
    onGetZoneByDistrict(districtId: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.ZoneGetByDistrictId + "/" + districtId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
