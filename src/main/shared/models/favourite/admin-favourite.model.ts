import { BaseModel } from '../base.model';

export class FavouriteAdminModel extends BaseModel {
    favouritesId?: number;
    restaurantId: number;
    restaurantName: string;
    userId: number;
    userName: string;
    status: number;
}

export enum FavouriteAdminStatus {
    UnPublish = 0,
    Publish = 1,
}