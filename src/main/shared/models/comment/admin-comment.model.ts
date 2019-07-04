import { BaseModel } from '../base.model';

export class CommentAdminModel extends BaseModel {
    resCommentId?: number;
    addressLine1?: string;
    description?: string;
    fullName?: string;
    isLove?: boolean;
    restaurantId?: number;
    starPerMark?: number;
    starQuality?: number;
    starShip?: number;
    title?: string;
    userId?: number;
    userName?: string;
    status?: number;
}

export enum CommentAdminStatus {
    UnPublish = 0,
    Publish = 1,
}