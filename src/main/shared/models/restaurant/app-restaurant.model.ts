import { BaseModel } from '../base.model';
import { AttributeGroupType } from '../attribute/attribute.model';
import { PaymentModel } from "../../../shared/models/payment/payment.model";

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
    restaurantWorkTimeModels?: Array<RestaurantWorkTimeModel> = [];
    phone1: string;
    promotionLineItems: Array<AppPromotionModels>;
    paymentProviderLst?: PaymentModel[];
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
    estTime: string;
    city: string;
    categoryIds: Array<RestaurantCategory>;
    restaurantClosed?: boolean;
    restaurantDeliveryCost: Array<RestaurantDeliveryCost> = [];
}

export class RestaurantDeliveryCost {
    deliveryCost: number;
    district: District;
}

export class District {
    districtId: number;
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

export class RestaurantWorkTimeModel {
    restaurantId?: number;
    weekDay?: string;
    list?: [
        {
            openTime?: string,
            closeTime?: string,
            idRestaurantWork: number
        }
    ]
}

export class AppPromotionModels {
    name: string;
    code: string;
    minOrder: number;
    startDate: Date;
    value: number
}