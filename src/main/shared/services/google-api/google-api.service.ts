import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../http/http.service';
import { CountryLatLongModel, LatLongModel } from '../../models';
import { ApiHelper } from '../api-helper';
import * as countryLatLong from 'assets/sources/countrycode-latlong.json';
import { ApiUrl } from '../api-url/api-url';
export interface GoogleApiInterface {
    getCountryCode(): Observable<any>;
}

@Injectable()
export class GoogleApiService implements GoogleApiInterface {
    constructor(
        private http: HttpService
    ) {
    }

    getCountryCode(): Observable<any> {
        return this.http.HttpGet(ApiUrl.IPApi).map(ApiHelper.extractData).catch(ApiHelper.onFail)
    }

    // onGetRestaurants(): Observable<Response> {
    //     return this.http.HttpGet('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=5000&type=restaurant&keyword=cruise&key=AIzaSyCDAaewmphr8donghrOXXq6CA_mEuBg0lM')
    //         .map(this.extractData)
    //         .catch(this.handleError);
    // }

}
