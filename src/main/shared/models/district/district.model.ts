import { BaseModel } from '../base.model';
import { CityModel } from '../city/city.model';

export class DistrictModel extends BaseModel {
    constructor() {
        super();
    }
    city: CityModel;
    code: string;
    districtId: number;
    name: string;
    status: number;
}