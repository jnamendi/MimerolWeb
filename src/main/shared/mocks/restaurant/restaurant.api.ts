// import { ApiListResponse, ApiResponse, ApiResponsePaging, PagingModel } from '../../services/api-response/api-response';
// // import { RestaurantSearching, RestaurantAdminModel } from '../../models/restaurant/admin-restaurant.model';
// import { Observable } from 'rxjs/Observable';
// // import { restaurants } from "./restaurant-data";
// import { AreaSearch } from '../../models/google/country-restaurant.model';


// // let restaurantAdmins: RestaurantAdminModel[] = [];
// let mockCateories = [
//     { id: 1, name: "Pizza" },
//     { id: 2, name: "Bread" },
//     { id: 3, name: "Mouse" },

// ];


// export class AdminRestaurantMockApi {
//     // public getRestaurantByNames = (restaurantName: string): Observable<ApiListResponse> => {
//     //     if (!!restaurantName) {
//     //         let results: RestaurantSearching[] = restaurants.filter(r => r.name.indexOf(restaurantName) != -1);
//     //         let response = <ApiListResponse>{
//     //             status: 1,
//     //             message: '',
//     //             content: results
//     //         };
//     //         return Observable.create(observer => {
//     //             observer.next(response);
//     //             observer.complete();
//     //         });
//     //     }
//     // }

//     // public createRestaurant = (data: RestaurantAdminModel): Observable<ApiResponse> => {
//     //     let newId = (restaurantAdmins.length > 0
//     //         ? Math.max.apply(Math, restaurantAdmins.map(function (o) { return o.restaurantId; }))
//     //         : 0) + 1;
//     //     restaurantAdmins.push({ ...data, restaurantId: newId, createdDate: new Date(), modifiedDate: new Date() });
//     //     let response = <ApiResponse>{
//     //         status: 1, message: '',
//     //         content: restaurantAdmins.find(i => i.restaurantId == newId)
//     //     };
//     //     return Observable.create(observer => {
//     //         observer.next(response);
//     //         observer.complete();
//     //     });
//     // }

//     // public getRestaurants = (): Observable<ApiResponsePaging> => {
//     //     restaurantAdmins.map(item => {
//     //         item.categoryName = mockCateories.find(c => c.id == item.categoryId).name
//     //     });
//     //     let response = <ApiResponsePaging>{
//     //         status: 1, message: '',
//     //         content: <PagingModel>{
//     //             data: restaurantAdmins,
//     //             pageNumber: 1,
//     //             pageSize: 2,
//     //             totalCount: restaurantAdmins.length
//     //         }
//     //     };
//     //     return Observable.create(observer => {
//     //         observer.next(response);
//     //         observer.complete();
//     //     });
//     // }

//     // public getRestaurant = (restaurantId: number): Observable<ApiResponse> => {
//     //     let response = <ApiResponse>{
//     //         status: 1, message: '',
//     //         content: restaurantAdmins.find(i => i.restaurantId == restaurantId)
//     //     };
//     //     return Observable.create(observer => {
//     //         observer.next(response);
//     //         observer.complete();
//     //     });
//     // }

//     // public updateRestaurant = (restaurant: RestaurantAdminModel): Observable<ApiResponse> => {
//     //     let itemIndex = restaurantAdmins.findIndex(item => item.restaurantId == restaurant.restaurantId);
//     //     restaurantAdmins[itemIndex] = restaurant;
//     //     let response = <ApiResponse>{
//     //         status: 1, message: '',
//     //         content: restaurantAdmins.find(i => i.restaurantId == restaurant.restaurantId)
//     //     };
//     //     return Observable.create(observer => {
//     //         observer.next(response);
//     //         observer.complete();
//     //     });
//     // }

//     // public deleteRestaurant = (restaurantId: number): Observable<ApiResponse> => {
//     //     restaurantAdmins = [...restaurantAdmins.filter(item => item.restaurantId != restaurantId)];
//     //     let response = <ApiResponse>{
//     //         status: 1, message: '',
//     //         content: ""
//     //     };
//     //     return Observable.create(observer => {
//     //         observer.next(response);
//     //         observer.complete();
//     //     });
//     // }

//     // public deleteManyRestaurant = (restaurantIds: number[]): Observable<ApiResponse> => {
//     //     restaurantAdmins = [...restaurantAdmins.filter(item => {
//     //         return restaurantIds.indexOf(item.restaurantId) === -1;
//     //     })];

//     //     let response = <ApiResponse>{
//     //         status: 1, message: '',
//     //         content: ""
//     //     };
//     //     return Observable.create(observer => {
//     //         observer.next(response);
//     //         observer.complete();
//     //     });
//     // }

//     public upLoadMedia = (file: File): Observable<ApiResponse> => {
//         let mediaId = Math.floor((Math.random() * 100) + 1);
//         let response = <ApiResponse>{
//             status: 1, message: '',
//             content: { mediaId }
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }

//     public getRestaurantByArea = (area: AreaSearch): Observable<ApiListResponse> => {
//         let response = <ApiListResponse>{
//             status: 1,
//             message: '',
//             content: []
//         };
//         return Observable.create(observer => {
//             observer.next(response);
//             observer.complete();
//         });
//     }
// }
