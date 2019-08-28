import { BaseModel } from '../base.model';
import { District2Model } from '../district/district.model';

export class CityDistricsModel extends BaseModel {
    constructor() {
        super();
    }
    cityId: number;
    code: string;
    name: string;
    status: number;
    country: CountryModel;
    districs?: Array<District2Model>;
}

export class CountryModel {
    code: string;
    countryId: number;
    name: string;
    status: number;
}