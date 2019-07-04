import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging, ApiListResponse } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { CategoryAdminModel } from '../../../models/category/admin-category.model';

export interface CategoryAdminInterface {
    createCategory(categoryAdminModel: CategoryAdminModel): Observable<ApiResponse>;
    updateCategory(categoryAdminModel: CategoryAdminModel): Observable<ApiResponse>;
    deleteCategory(categoryId: number): Observable<ApiResponse>;
    deleteManyCategory(categoryIds: Array<number>): Observable<ApiResponse>;
    getCategory(categoryId: number): Observable<ApiResponse>;
    getCategories(pageIndex?: number, pageSize?: number, search?: string, filterName?: string): Observable<ApiResponsePaging>;
    getCategoriesByLanguageCode(languageCode: string): Observable<ApiListResponse>;
    getCategorySortByName(languageCode: string): Observable<ApiListResponse>;
}

@Injectable()
export class CategoryAdminService implements CategoryAdminInterface {

    constructor(
        private http: HttpService
    ) { }

    createCategory(categoryAdminModel: CategoryAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(categoryAdminModel);
        return this.http.HttpPost(ApiUrl.CategoryCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateCategory(categoryAdminModel: CategoryAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(categoryAdminModel);
        return this.http.HttpPut(ApiUrl.CategoryUpdate + '/' + categoryAdminModel.categoryId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteCategory(categoryId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.CategoryDelete + '/' + categoryId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyCategory(categoryIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: categoryIds });
        return this.http.HttpPost(ApiUrl.CategoryDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getCategory(categoryId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.CategoryGetById + '/' + categoryId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getCategories(pageIndex?: number, pageSize?: number, languageCode?: string): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!languageCode) {
            query.set('languageCode', languageCode)
        }

        let queryString = `/${pageIndex}/${pageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.CategoryGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getCategoriesByLanguageCode(languageCode: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.CategoryGetAllByLanguageCode + '/' + languageCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getCategorySortByName(languageCode: string): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.CategoryGetAllSortByName + '/' + languageCode, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
