// import { Observable } from 'rxjs/Observable';
// import { ApiResponsePaging, PagingModel } from '../../services/api-response/api-response';
// import { data } from "./ratings-data";
// let ratingsDatas = data;

// export class AdminRatingsMockApi {
//     public getRatings = (): Observable<ApiResponsePaging> => {
//         let response = <ApiResponsePaging>{
//             status: 1, message: '',
//             content: <PagingModel>{
//                 data: ratingsDatas,
//                 pageNumber: 1,
//                 pageSize: 2,
//                 totalCount: ratingsDatas.length
//             }
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public getRatingsByRestaurantId = (restaurantId: number): Observable<ApiResponsePaging> => {
//         let results = ratingsDatas.filter(item => item.restaurantId == restaurantId);
//         let response = <ApiResponsePaging>{
//             status: 1, message: '',
//             content: <PagingModel>{
//                 data: results,
//                 pageNumber: 1,
//                 pageSize: 2,
//                 totalCount: results.length
//             }
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }
// }