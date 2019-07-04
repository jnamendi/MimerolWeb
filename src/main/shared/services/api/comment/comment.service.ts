import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiListResponse } from '../../api-response/api-response';

export interface CommentInterface {
    onGetBySize(size: number): Observable<ApiListResponse>;
}

@Injectable()
export class CommentService implements CommentInterface {
    constructor(
        private http: HttpService
    ) { }

    onGetBySize(size: number): Observable<ApiListResponse> {
        return this.http.HttpGet(ApiUrl.CommentGetBySize + "/" + size, false).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
