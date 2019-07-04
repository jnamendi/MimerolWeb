import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';

export interface AddressAdminInterface {
    getAddress(addressId: number): Observable<ApiResponse>;
    getAddresses(pageNumber?: number, pageSize?: number): Observable<ApiResponsePaging>;
}

@Injectable()
export class AddressAdminService implements AddressAdminInterface {

    constructor(
        private http: HttpService,
    ) { }

    getAddress(addressId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.AddressGetById + '/' + addressId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getAddresses(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging> {
        let queryString = `/${pageIndex}/${pageSize}`;
        return this.http.HttpGet(`${ApiUrl.AddressGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

}
