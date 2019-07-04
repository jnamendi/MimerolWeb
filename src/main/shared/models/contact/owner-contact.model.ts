import { BaseModel } from '../base.model';

export class ContactOwnerModel extends BaseModel {
    contactOwnerId?: number;
    emergencyNumber1: string;
    emergencyNumber2: string;
    contactName: string;
    email: string;
    website: string;
}
