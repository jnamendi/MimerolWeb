import { BaseModel } from '../base.model';
export class ZoneModel extends BaseModel {
    constructor() {
        super();
    }
    zoneId?: number;
    name?: string;
    district?: District;
}

export class District {
    name?: string;
}