export class RestaurantCommentOwnerModel {
    resCommentId: number;
    restaurantId: number;
    userId: number;
    userName: string;
    fullName: string;
    restaurantName: string;
    description: string;
    title: string;
    starPerMark: number;
    starQuality: number;
    starShip: number;
    createdDate: Date;
    status: number;
    addressLine1: string;
    constructor() {
        this.starQuality = 0;
        this.starShip = 0;
    }
}

export enum RestaurantCommentStatus {
    UnPublish = 0,
    Publish = 1,
    Approve = 6,
}