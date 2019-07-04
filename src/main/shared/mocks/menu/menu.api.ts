import { data, menuItemDatas, menuCategoryDatas } from "./menu-data";
import { Observable } from 'rxjs/Observable';
import { ApiResponsePaging, PagingModel, ApiResponse, ApiListResponse } from '../../services/api-response/api-response';
import { MenuAdminModel } from '../../models/menu/admin-menu.model';

let menuDatas = data;
let menuCategories = menuCategoryDatas;
let menuItems = menuItemDatas;

export class MenuMockApi {
    public getMenus = (): Observable<ApiResponsePaging> => {
        let response = <ApiResponsePaging>{
            status: 1, message: '',
            content: <PagingModel>{
                data: menuDatas,
                pageNumber: 1,
                pageSize: 2,
                totalCount: menuDatas.length
            }
        };
        return Observable.create(observer => {
            observer.next(response);
            observer.complete();
        });
    }

    public getMenu = (menuId: number): Observable<ApiResponse> => {
        let response = <ApiResponse>{
            status: 1, message: '',
            content: menuDatas.find(i => i.menuId == menuId)
        };
        return Observable.create(observer => {
            observer.next(response);
            observer.complete();
        });
    }

    public createMenu = (data: MenuAdminModel): Observable<ApiResponse> => {
        let newId = Math.max.apply(Math, menuDatas.map(function (o) { return o.menuId; })) + 1;
        menuDatas.push({ ...data, menuId: newId });

        let response = <ApiResponse>{
            status: 1, message: '',
            content: menuDatas.find(i => i.menuId == newId)
        };
        return Observable.create(observer => {
            observer.next(response);
            observer.complete();
        });
    }

    public deleteMenu = (menuId: number): Observable<ApiResponse> => {
        menuDatas = [...menuDatas.filter(item => item.menuId != menuId)];
        let response = <ApiResponse>{
            status: 1, message: '',
            content: ""
        };
        return Observable.create(observer => {
            observer.next(response);
            observer.complete();
        });
    }

    public deleteManyMenu = (menuIds: number[]): Observable<ApiResponse> => {
        menuDatas = [...menuDatas.filter(item => {
            return menuIds.indexOf(item.menuId) === -1;
        })];

        let response = <ApiResponse>{
            status: 1, message: '',
            content: ""
        };
        return Observable.create(observer => {
            observer.next(response);
            observer.complete();
        });
    }

    //---App
    public getMenuCategoriesOfRestaurant = (restaurantId: number): Observable<ApiResponsePaging> => {
        let response = <ApiResponsePaging>{
            status: 1, message: '',
            content: <PagingModel>{
                data: menuCategories,
                pageNumber: 1,
                pageSize: 2,
                totalCount: menuCategories.length
            }
        };
        return Observable.create(observer => {
            observer.next(response);
            observer.complete();
        });
    }

    public getMenuItems = (menuId: number): Observable<ApiListResponse> => {
        let response = <ApiResponse>{
            status: 1, message: '',
            content: menuItemDatas.filter(f => f.menuId == menuId)
        };
        return Observable.create(observer => {
            observer.next(response);
            observer.complete();
        });
    }


}