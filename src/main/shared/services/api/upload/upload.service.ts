import { Injectable } from '@angular/core';
import { HttpService } from '../../http/http.service';
import { Observable } from 'rxjs/Observable';
import { ApiUrl } from '../../api-url/api-url';
import { ApiHelper } from '../../api-helper';
import { ApiResponse } from '../../api-response/api-response';

export interface UploadInterface {
    onUpload(mediaFile: any): Observable<ApiResponse>;
    onGetMedia(mediaId: number): Observable<ApiResponse>;
}

@Injectable()
export class UploadService implements UploadInterface {
    constructor(
        private http: HttpService
    ) { }

    onUpload(mediaFile: any): Observable<ApiResponse> {
        return this.http.HttpPostFile(ApiUrl.UploadSave, mediaFile, true).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }

    onGetMedia(mediaId: number): Observable<ApiResponse> {
        return this.http.HttpGet(ApiUrl.UploadGetFile + '/' + mediaId).map(ApiHelper.extractData).catch(ApiHelper.onFail);
    }
}
