import { BaseModel } from '../base.model';
export class ZoneModel extends BaseModel {
    constructor() {
        super();
    }
    zoneId?: number;
    name?: string;
}