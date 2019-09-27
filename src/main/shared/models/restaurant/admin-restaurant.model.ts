import { BaseModel } from '../base.model';
import { LanguageList, Language, FieldTranslation } from '../langvm.model';
import { CategoryViewModel } from '../category/admin-category.model';
import { UserViewModel } from '../user/admin-user.model';
import { PaymentModel } from "../../../shared/models/payment/payment.model";

export class RestaurantAdminModel extends BaseModel {
    forEach: any;
    constructor() {
        super();
        this.cityId = null;
        this.districtId = null;
    }
    restaurantId?: number;
    restaurantName?: string;
    categoryIds?: Array<CategoryViewModel>;
    userIds?: Array<UserViewModel>;
    slogan?: string;
    address?: string;
    districtId: number;
    district?: string;
    zoneId?: number;
    zone?: string;
    cityId: number;
    city?: string;
    status?: RestaurantStatus;
    latitude: number;
    longitude: number;
    openTime?: string;
    closeTime?: string;
    restaurantWorkTimeModels?: Array<RestaurantWorkTimeModels> = [];
    paymentProviderLst?: PaymentModel[];
    paymentProviderLstId?: number[];
    mediaId?: number;
    languageLst?: LanguageList[];
    phone1?: string;
    phone2?: string;
    minPrice?: number;
    deliveryCost?: number;
    estDeliveryTime?: number;
    file?: File;
    addressDesc: string;
    workArea: number[];
    cityIds?: number;
    deliveryArea: Array<DeliveryArea> = [];
}

export class DeliveryArea {
    deliveryAreaId: number;
    deliveryZoneId: number[];
}

export class WorkTimeList {
    idRestaurantWork?: number;
    openTime?: string;
    closeTime?: string;
}

export class RestaurantWorkTimeModels {
    restaurantId?: number;
    weekDay?: string;
    list?: Array<WorkTimeList> = [];
}

export enum RestaurantStatus {
    InActive = 0,
    Active = 1,
}

export module RestaurantModule {
    export function initTranslator(lang: Language): LanguageList {
        return <LanguageList>{
            ...lang, contentDef: [
                <FieldTranslation>{ code: 'restaurant_description', value: '' },
            ]
        }
    }
}