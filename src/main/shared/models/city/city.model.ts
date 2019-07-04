import { BaseModel } from '../base.model';

export class CityModel extends BaseModel {
    constructor() {
        super();
    }
    cityId: number;
    code: string;
    name: string;
    status: number;
    country: CountryModel;
}

export class CountryModel {
    code: string;
    countryId: number;
    name: string;
    status: number;
}