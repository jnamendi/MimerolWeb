import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { PromotionAdminModel } from '../../../models/promotion/admin-promotion.model';

export interface PromotionAdminInterface {
    createPromotion(promotionAdminModel: PromotionAdminModel): Observable<ApiResponse>;
    updatePromotion(promotionAdminModel: PromotionAdminModel): Observable<ApiResponse>;
    deletePromotion(promotionId: number): Observable<ApiResponse>;
    deleteManyPromotion(promotionIds: Array<number>): Observable<ApiResponse>;
    getPromotion(promotionId: number): Observable<ApiResponse>;
    getPromotions(pageIndex?: number, pageSize?: number, languageCode?: string): Observable<ApiResponsePaging>;
}

@Injectable()
export class PromotionAdminService implements PromotionAdminInterface {

    constructor(
        private http: HttpService
    ) { }

    createPromotion(promotionAdminModel: PromotionAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(promotionAdminModel);
        return this.http.HttpPost(ApiUrl.PromotionCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updatePromotion(promotionAdminModel: PromotionAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(promotionAdminModel);
        return this.http.HttpPut(ApiUrl.PromotionUpdate + '/' + promotionAdminModel.promotionId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deletePromotion(promotionId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.PromotionDelete + '/' + promotionId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyPromotion(promotionIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ ids: promotionIds });
        return this.http.HttpPost(ApiUrl.PromotionDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getPromotion(promotionId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.PromotionGetById + '/' + promotionId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getPromotions(pageIndex?: number, pageSize?: number, languageCode?: string): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!languageCode) {
            query.set('languageCode', languageCode)
        }

        let queryString = `/${pageIndex}/${pageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.PromotionGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
