import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { Configs } from '../../../common/configs/configs';
import { OwnerMenuItem } from '../../../models/menu-item/owner-menu-item.model';

export interface MenuItemOwnerInterface {
    createMenuItem(menuItem: OwnerMenuItem): Observable<ApiResponse>;
    updateMenuItem(menuItem: OwnerMenuItem): Observable<ApiResponse>;
    deleteMenuItem(menuItemId: number): Observable<ApiResponse>;
    deleteManyMenuItem(menuItemIds: number[]): Observable<ApiResponse>;
    getMenuItem(menuId: number): Observable<ApiResponse>;
    getMenuItems(pageIndex?: number, pageSize?: number, search?: string, languageCode?: string): Observable<ApiResponsePaging>;
    getMenuItemByOwner(pageIndex?: number, pageSize?: number, languageCode?: string, userId?: number): Observable<ApiResponsePaging>;
}

@Injectable()
export class MenuItemOwnerService implements MenuItemOwnerInterface {

    constructor(
        private http: HttpService,
    ) { }

    createMenuItem(menuItem: OwnerMenuItem): Observable<ApiResponse> {
        const formdata: FormData = new FormData();
        formdata.append('file', menuItem.file == null || menuItem.file.name == '' ? null : menuItem.file);
        formdata.append('menuItemAdminModel', JSON.stringify(menuItem));
        return this.http.HttpPostFormDataWithAddtionalData(ApiUrl.MenuItemInsert, formdata, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateMenuItem(menuItem: OwnerMenuItem): Observable<ApiResponse> {
        const formdata: FormData = new FormData();
        formdata.append('file', menuItem.file == null || menuItem.file.name == '' ? null : menuItem.file);
        formdata.append('menuItemAdminModel', JSON.stringify(menuItem));
        return this.http.HttpPostFormDataWithAddtionalData(ApiUrl.MenuItemEdit + '/' + menuItem.menuItemId, formdata, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteMenuItem(menuItemId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.MenuItemDelete + '/' + menuItemId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyMenuItem(menuItemIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: menuItemIds });
        return this.http.HttpPost(ApiUrl.MenuItemDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getMenuItem(menuId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.MenuItemGetById + '/' + menuId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getMenuItems(pageIndex?: number, pageSize?: number, languageCode?: string, search?: string): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!search) {
            query.set('title', search)
        }
        if (!!languageCode) {
            query.set('languageCode', languageCode)
        }

        let queryString = `/${pageIndex || Configs.PageIndex}/${pageSize || Configs.PageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.MenuItemGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getMenuItemByOwner(pageIndex?: number, pageSize?: number, languageCode?: string, userId?: number): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!languageCode) {
            query.set('languageCode', languageCode)
        }
        if (!!userId) {
            query.set('userId', userId.toString())
        }
        let queryString = `/${pageIndex}/${pageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.MenuItemGetByOwner}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
