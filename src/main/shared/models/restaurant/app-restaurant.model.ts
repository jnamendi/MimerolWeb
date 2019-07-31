import { BaseModel } from '../base.model';
import { AttributeGroupType } from '../attribute/attribute.model';

export class AppRestaurantSearch {
    restaurants: Array<AppRestaurantModel>;
    categories: Array<CategoryFilter>;
    rankPrice: RankPrice;
    constructor() { }
}

export class AppRestaurantModel extends BaseModel {
    restaurantId: number;
    name: string;
    restaurantName:string;
    slogan: string;
    address: string;
    latitude: string;
    longitude: string;
    openTime: string;
    closeTime: string;
    restaurantWorkTimeModels?: Array<RestaurantWorkTimeModels>;
    phone1: string;
    promotionLineItems : Array<AppPromotionModels>;
    shipArea: string;
    rating: number;
    numOfReview: number;
    minPrice: number;
    price: number;
    currencyRate: number;
    symbolLeft: string;
    district: string;
    deliveryCost: number;
    status: number;
    sortOrder: number;
    imageUrl?: string;
    desc: string;
    estDeliveryTime: string;
    city: string;
    categoryIds: Array<RestaurantCategory>;
    restaurantClosed?: boolean;
}

export class RankPrice {
    minPrice: number;
    maxPrice: number;
    minPriceRate: number;
    maxPriceRate: number;

}

export class RestaurantSearching {
    restaurantId: number;
    name: string;
    addressLine1: string;
}

export class RestaurantCategory {
    categoryId: number;
    categoryName: string;
}

export class RestaurantAttribute {
    attributeId: number;
    attributeName: string;
    groupCode: AttributeGroupType;
}

export class CategoryFilter {
    categoryId: number;
    categoryName: string;
    numberOfRest: number;
}

export interface RestaurantFilter {
    type: RestaurantFilterType;
    value: any;
}

export enum RestaurantFilterType {
    Category = 0,
    Price = 1,
    DeliveryCost = 2
}


export class CitySearch {
    name: string;
    status: number;
    active: boolean;
}

export class RestaurantWorkTimeModels {
    restaurantWorkTimeId?: number;
    restaurantId?: number;
    weekDay?: string;
    openTime?: string;
    closeTime?: string;
}

export class AppPromotionModels {
    name: string;
    code: string;
    minOrder: number;
    startDate: Date;
    value: number
}