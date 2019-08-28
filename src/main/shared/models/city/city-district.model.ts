import { BaseModel } from '../base.model';
import { DeliveryDistrictModel } from '../district/district.model';

export class DeliveryCityModel extends BaseModel {
    constructor() {
        super();
    }
    cityId: number;
    code: string;
    name: string;
    status: number;
    country: DeliveryCountryModel;
    districs?: Array<DeliveryDistrictModel>;
}

export class DeliveryCountryModel {
    code: string;
    countryId: number;
    name: string;
    status: number;
}