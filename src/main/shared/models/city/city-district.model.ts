import { BaseModel } from '../base.model';
import { DistrictModel } from '../district/district.model';

export class CityDistricsModel extends BaseModel {
    constructor() {
        super();
    }
    cityId: number;
    code: string;
    name: string;
    status: number;
    country: CountryModel;
    districs?: Array<DistrictModel> = [];
}

export class CountryModel {
    code: string;
    countryId: number;
    name: string;
    status: number;
}