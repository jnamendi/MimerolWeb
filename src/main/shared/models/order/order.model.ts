import { OrderItem } from '../restaurant-menu/restaurant-menu.model';

export class OrderModel {
    constructor() {
        this.paymentType = PaymentType.Cash;
        this.cityId = null;
        this.districtId = null;
        this.addressId = null;
        this.userId = null;
    }
    name: string;
    email: string;
    number: string;
    companyName?: string;
    addressId: number;
    address: string;
    addressDesc: string;
    cityId: number;
    cityName?: string;
    districtId: number;
    districtName?: string;
    time: string;
    remarks?: string;
    paymentType: PaymentType;
    orderItem: OrderItem;
    userId?: number;
    languageCode: string;
    symbolLeft: string;
    restaurantId: number;
    currencyCode: string;
    deliveryCost: number;
    orderId?: number;
    orderCode?: string;
    promotionCode: string;
    promotionId: number;
    receiveVoucher: boolean;
    voucherCode: string;
    voucherId: number;
    paymentWith: number;
}

export class OrderCheckoutModel {
    addressLine: string;
    imageUrl: string;
    orderCode: string;
    latitude: number;
    longitude: number;
    name: string;
    restaurantId: string;
}

export class OrderInfos {
    address: string;
}

export class OrderResponseModel {
    invoiceCode: string;
    orderId: number;
}

export interface UserOrderInfo {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
}

export interface AddressDeliveryInfo {
    address: string;
    city: string;
    district: string;
}

export interface DeliveryInfo {
    time: string;
    remarks: string;
}


export interface PaymentInfo {
    paymentType: PaymentType;
}

export enum PaymentType {
    Cash = 1,
    Paypal = 2,
    CreditCard = 3
}