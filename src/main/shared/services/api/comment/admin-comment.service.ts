import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { ApiResponse, ApiResponsePaging } from '../../api-response/api-response';
import { Observable } from 'rxjs/Observable';
import { ApiHelper } from '../../api-helper';
import { ApiUrl } from '../../api-url/api-url';
import { CommentAdminModel } from '../../../models/comment/admin-comment.model';

export interface CommentAdminInterface {
    createComment(commentAdminModel: CommentAdminModel): Observable<ApiResponse>;
    updateComment(commentAdminModel: CommentAdminModel): Observable<ApiResponse>;
    deleteComment(commentId: number): Observable<ApiResponse>;
    deleteManyComment(commentIds: Array<number>): Observable<ApiResponse>;
    getComment(commentId: number): Observable<ApiResponse>;
    getComments(pageNumber?: number, pageSize?: number): Observable<ApiResponsePaging>;
}

@Injectable()
export class CommentAdminService implements CommentAdminInterface {

    constructor(
        private http: HttpService
    ) { }

    createComment(commentAdminModel: CommentAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(commentAdminModel);
        return this.http.HttpPost(ApiUrl.CommentCreate, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    updateComment(commentAdminModel: CommentAdminModel): Observable<ApiResponse> {
        let body = JSON.stringify(commentAdminModel);
        return this.http.HttpPut(ApiUrl.CommentCreate + '/' + commentAdminModel.resCommentId, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteComment(commentId: number): Observable<ApiResponse> {
        return this.http.HttpDelete(ApiUrl.CommentDelete + '/' + commentId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    deleteManyComment(commentIds: number[]): Observable<ApiResponse> {
        let body = JSON.stringify({ids: commentIds});
        return this.http.HttpPost(ApiUrl.CommentDeleteMany, body, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getComment(commentId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.CommentGetById + '/' + commentId, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    getComments(pageIndex?: number, pageSize?: number): Observable<ApiResponsePaging> {
        let queryString = `/${pageIndex}/${pageSize}`;
        return this.http.HttpGet(`${ApiUrl.CommentGetList}${queryString || ''}`, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
