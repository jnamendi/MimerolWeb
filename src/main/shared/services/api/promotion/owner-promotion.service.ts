import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { PromotionOwnerModel } from '../../../models/promotion/owner-promotion.model';
import { Configs } from '../../../common/configs/configs';

export interface PromotionOwnerInterface {
    createPromotion(promotionOwnerModel: PromotionOwnerModel): Observable<ApiResponse>;
    updatePromotion(promotionOwnerModel: PromotionOwnerModel): Observable<ApiResponse>;
    deletePromotion(promotionId: number): Observable<ApiResponse>;
    deleteManyPromotion(promotionIds: Array<number>): Observable<ApiResponse>;
    getPromotion(promotionId: number): Observable<ApiResponse>;
    getPromotions(pageIndex?: number, pageSize?: number, search?: string, filterName?: string): Observable<ApiResponsePaging>;
    getPromotionsByOwner(pageIndex?: number, pageSize?: number, languageCode?: string, userId?: number): Observable<ApiResponsePaging>;
}

@Injectable()
export class PromotionOwnerService implements PromotionOwnerInterface {

    constructor(
        private http: HttpService
    ) { }

    createPromotion(promotionOwnerModel: PromotionOwnerModel): Observable<ApiResponse> {
        let body = JSON.stringify(promotionOwnerModel);
        return this.http.HttpPost(ApiUrl.PromotionCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updatePromotion(promotionOwnerModel: PromotionOwnerModel): Observable<ApiResponse> {
        let body = JSON.stringify(promotionOwnerModel);
        return this.http.HttpPut(ApiUrl.PromotionUpdate + '/' + promotionOwnerModel.promotionId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
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

        let queryString = `/${pageIndex || Configs.PageIndex}/${pageSize || Configs.PageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.PromotionGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getPromotionsByOwner(pageIndex?: number, pageSize?: number, languageCode?: string, userId?: number): Observable<ApiResponsePaging> {
        var query = new URLSearchParams();
        if (!!languageCode) {
            query.set('languageCode', languageCode)
        }
        if (!!userId) {
            query.set('userId', userId.toString())
        }

        let queryString = `/${pageIndex}/${pageSize}${!!query ? '?' + query : ''}`;
        return this.http.HttpGet(`${ApiUrl.PromotionGetAllByOwner}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
