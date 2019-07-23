import { BaseModel } from '../base.model';

export class UserOwnerModel extends BaseModel {
    userInfoId?: number;
    contactName?: string;
    email?: string;
    emergencyNumber1?: string;
    emergencyNumber2?: string;
    userId?: number;
    website?: string;
    aliasName?: string;
}
