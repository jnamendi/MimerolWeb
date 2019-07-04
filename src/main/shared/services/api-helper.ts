import { Observable } from 'rxjs/Observable';
import { ApiResponse, ApiError } from './api-response/api-response';
import { HttpErrorResponse } from '@angular/common/http';

export module ApiHelper {
    export function extractData(res: any | any): ApiResponse {
        let body = res;
        return body;
    }

    export function onFail(err: HttpErrorResponse | any) {
        return Observable.throw(<ApiError>err.error);
    }
}