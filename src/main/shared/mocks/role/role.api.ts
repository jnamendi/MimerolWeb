// import { Observable } from 'rxjs/Observable';
// import { ApiResponsePaging, PagingModel, ApiResponse } from '../../services/api-response/api-response';
// import { data } from './role-data';
// import { RoleAdminModel } from '../../models/role/admin-role.model';

// let roleDatas = data;
// export class RoleApi {
//     public getRoles = (): Observable<ApiResponsePaging> => {
//         let response = <ApiResponsePaging>{
//             status: 1, message: '',
//             content: <PagingModel>{
//                 data: roleDatas,
//                 pageNumber: 1,
//                 pageSize: 2,
//                 totalCount: roleDatas.length
//             }
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public getRole = (roleId: number): Observable<ApiResponse> => {
//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: roleDatas.find(i => i.roleId == roleId)
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public createRole = (data: RoleAdminModel): Observable<ApiResponse> => {

//         let newId = Math.max.apply(Math, roleDatas.map(function (o) { return o.roleId; })) + 1;
//         roleDatas.push({ ...data, roleId: newId });

//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: roleDatas.find(i => i.roleId == newId)
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public updateRole = (role: RoleAdminModel): Observable<ApiResponse> => {
//         roleDatas.map(item => {
//             if (item.roleId == role.roleId) {
//                 item.code = role.code,
//                     item.name = role.name,
//                     item.code = role.code,
//                     item.status = role.status
//             }
//         });

//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: roleDatas.find(i => i.roleId == role.roleId)
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public deleteRole = (roleId: number): Observable<ApiResponse> => {
//         roleDatas = [...roleDatas.filter(item => item.roleId != roleId)];
//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: ""
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public deleteManyRole = (roleIds: number[]): Observable<ApiResponse> => {
//         roleDatas = [...roleDatas.filter(item => {
//             return roleIds.indexOf(item.roleId) === -1;
//         })];

//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: ""
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }
// }