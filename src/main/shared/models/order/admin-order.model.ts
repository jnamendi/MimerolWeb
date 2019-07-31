export class AdminOrderModel {
    languageCode?: string;
    orderCode?: string;
    orderId?: number;
    status?: number;
}

export enum AdminOrderStatus {
    New = 1,
    InProgress = 2,
    Delivered = 3,
    Rejected = 4,
    Canceled = 5,
    Done = 6,
    Complete = 7
}