import { MenuExtraItem } from '../menu/app-menu.model';

export class RestaurantMenu {
    mennu: Array<RestaurantMenuModel>;
    menuItems: Array<RestaurantMenuItemModel>;
}

export interface RestaurantMenuModel {
    menuId: number;
    menuName: string;
    urlSlug: string;
    sortOrder: number;
}

export class OrderItem {
    currencyCode: string;
    restaurantId: number;
    deliveryCost: number;
    taxTotal: number;
    totalSubPrice: number;
    totalPrice: number;
    userId: number;
    languageCode: string;
    discount?: number;
    resOpenTime?: string;
    resCloseTime?: string;
    orderItemsRequest: RestaurantMenuItemModel[];
    constructor() {
        this.orderItemsRequest = [];
    }
}

export interface RestaurantMenuItemModel {
    menuItemId: number;
    menuId: number;
    menuItemName: string;
    description: string;
    priceOriginal: number;
    priceRateDisplay: string;
    priceRate: number;
    currencyRate: number;
    symbolLeft: string;
    urlSlug: string;
    urlImge: string;
    sortOrder: number;
    quantity?: number;
    totalPrice?: number;
    isSelected?: boolean;
    desc: string;
    menuExraItems: Array<RestaurantMenuExtraItemModel>;
    isShowButton: boolean;
    isShowButtonArrow: boolean;
    isShowExtraItem: boolean;
}

export class RestaurantMenuExtraItemModel {
    menuExtraItemId: number;
    extraItemType: ExtraItemType;
    name: string;
    extraitems: Array<ExtraItem>;
    selectedExtraItem: MenuExtraItem;
    constructor() {
        this.selectedExtraItem = null;
    }
}

export interface ExtraItem {
    extraItemId: number;
    price: number;
    priceRate: number;
    name: string;
    isSelected?: boolean;
}

export enum ExtraItemType {
    SingleChoice = 1,
    MultipleChoise = 2
}