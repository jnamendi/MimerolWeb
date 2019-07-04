import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { MenuAdminModel } from '../../../models/menu/admin-menu.model';

export interface MenuAdminInterface {
    createMenu(menuAdminModel: MenuAdminModel): Observable<ApiResponse>;
    updateMenu(menuAdminModel: MenuAdminModel): Observable<ApiResponse>;
    deleteMenu(menuId: number): Observable<ApiResponse>;
    deleteManyMenu(menuIds: Array<number>): Observable<ApiResponse>;
    getMenu(menuId: number): Observable<ApiResponse>;
    getMenus(pageNumber?: number, pageSize?: number, languageCode?: string): Observable<ApiResponsePaging>;
    getMenuByRestaurantId(restaurantId: number, languageCode: string): Observable<ApiListResponse>;
}

@Injectable()
export class MenuAdminService implements MenuAdminInterface {

    constructor(
        private http: HttpService,
    ) { }

    createMenu(menuAdminModel: MenuAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(menuAdminModel);
        return this.http.HttpPost(ApiUrl.MenuCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateMenu(menuAdminModel: MenuAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(menuAdminModel);
        return this.http.HttpPut(ApiUrl.MenuUpdate + '/' + menuAdminModel.menuId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
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

    getMenus(pageIndex?: number, pageSize?: number, languageCode?: string): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!languageCode) {
            query.set('languageCode', languageCode)
        }

        let queryString = `/${pageIndex}/${pageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.MenuGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getMenuByRestaurantId(restaurantId: number, languageCode: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.MenuGetByRestaurantId + '/' + restaurantId + '/' + languageCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
