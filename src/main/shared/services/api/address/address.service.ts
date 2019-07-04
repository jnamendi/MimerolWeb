import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiResponsePaging, ApiResponse } from '../../api-response/api-response';
import { AddressModel } from '../../../models/address/address.model';

export interface AddressInterface {
    onGetByUser(userId: number): Observable<ApiResponsePaging>;
    onGetById(addressId: number): Observable<ApiResponse>;
    onCreateAddress(model: AddressModel): Observable<ApiResponse>;
    onUpdateAddress(model: AddressModel): Observable<ApiResponse>;
    onDeleteAddress(addressId: number): Observable<ApiResponse>;
}

@Injectable()
export class AddressService implements AddressInterface {

    constructor(
        private http: HttpService
    ) { }

    onGetByUser(userId: number): Observable<ApiResponsePaging> {
        return this.http.HttpGet(ApiUrl.AddressGetByUser + '/' + userId, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onGetById(addressId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.AddressGetById + '/' + addressId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onCreateAddress(model: AddressModel): Observable<ApiResponse> {
        let body = JSON.stringify(model);
        return this.http.HttpPost(ApiUrl.AddressCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onUpdateAddress(model: AddressModel): Observable<ApiResponse> {
        let body = JSON.stringify(model);
        return this.http.HttpPut(ApiUrl.AddressUpdate + '/' + model.addressId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onDeleteAddress(addressId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.AddressDelete + '/' + addressId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
