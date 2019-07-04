// import { AddressAdminModel } from "../../../models/admins/address.model";
// import { data } from "./address-data";
// import { Observable } from 'rxjs/Observable';
// import { ApiResponsePaging, PagingModel, ApiResponse } from '../../services/api-response/api-response';
// let addressDatas = data;

// export class AddressApi {
//     public getAddresses = (): Observable<ApiResponsePaging> => {
//         let response = <ApiResponsePaging>{
//             status: 1, message: '',
//             content: <PagingModel>{
//                 data: addressDatas,
//                 pageNumber: 1,
//                 pageSize: 2,
//                 totalCount: addressDatas.length
//             }
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public getAddress = (addressId: number): Observable<ApiResponse> => {
//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: addressDatas.find(i => i.addressId == addressId)
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }
// }