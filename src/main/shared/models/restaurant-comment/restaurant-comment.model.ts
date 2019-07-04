export class RestaurantCommentModel {
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