import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { ApiResponsePaging, ApiResponse, ApiListResponse } from '../../api-response/api-response';
import { MenuOwnerModel } from '../../../models/menu/owner-menu.model';

export interface MenuOwnerInterface {
    createMenu(menuOwnerModel: MenuOwnerModel): Observable<ApiResponse>;
    updateMenu(menuOwnerModel: MenuOwnerModel): Observable<ApiResponse>;
    deleteMenu(menuId: number): Observable<ApiResponse>;
    deleteManyMenu(menuIds: Array<number>): Observable<ApiResponse>;
    getMenu(menuId: number): Observable<ApiResponse>;
    getMenusByOwner(pageIndex?: number, pageSize?: number, userId?: number, languageCode?: string): Observable<ApiResponsePaging>;
    getMenuByRestaurantId(restaurantId: number, languageCode: string): Observable<ApiListResponse>;
}

@Injectable()
export class MenuOwnerService implements MenuOwnerInterface {

    constructor(
        private http: HttpService,
    ) { }

    createMenu(menuOwnerModel: MenuOwnerModel): Observable<ApiResponse> {
        let body = JSON.stringify(menuOwnerModel);
        return this.http.HttpPost(ApiUrl.MenuCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateMenu(menuOwnerModel: MenuOwnerModel): Observable<ApiResponse> {
        let body = JSON.stringify(menuOwnerModel);
        return this.http.HttpPut(ApiUrl.MenuUpdate + '/' + menuOwnerModel.menuId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteMenu(menuId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.MenuDelete + '/' + menuId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyMenu(menuIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: menuIds });
        return this.http.HttpPost(ApiUrl.MenuDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getMenu(menuId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.MenuGetById + '/' + menuId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getMenusByOwner(pageIndex?: number, pageSize?: number, userId?: number, languageCode?: string): Observable<ApiResponsePaging> {
        let queryString = `/${pageIndex}/${pageSize}/${userId}/${languageCode}`;
        return this.http.HttpGet(`${ApiUrl.MenuGetByOwner}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getMenuByRestaurantId(restaurantId: number, languageCode: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.MenuGetByRestaurantId + '/' + restaurantId + '/' + languageCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
