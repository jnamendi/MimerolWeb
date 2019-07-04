// import { Observable } from 'rxjs/Observable';
// import { ApiResponsePaging, PagingModel, ApiResponse } from '../../services/api-response/api-response';
// import { data } from './favourite-data';

// let favouriteDatas = data;

// export class FavouriteApi {
//     public getFavourites = (): Observable<ApiResponsePaging> => {
//         let response = <ApiResponsePaging>{
//             status: 1, message: '',
//             content: <PagingModel>{
//                 data: favouriteDatas,
//                 pageNumber: 1,
//                 pageSize: 2,
//                 totalCount: favouriteDatas.length
//             }
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public getFavourite = (favouritesId: number): Observable<ApiResponse> => {
//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: favouriteDatas.find(i => i.favouritesId == favouritesId)
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }
// }