import { BaseModel } from '../base.model';

export class RatingAdminModel extends BaseModel {
    ratingId?: number;
    restaurantId: number;
    restaurantName: string;
    userId?: number;
    userName?: string;
    quality: number;
    delivery: number;
    comment: string;
    status?: number;
}

export enum RatingStatus {
    UnPublish = 0,
    Publish = 1,
}