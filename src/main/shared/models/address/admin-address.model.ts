import { BaseModel } from '../base.model';

export class AddressAdminModel extends BaseModel {
    addressId?: number;
    district?: string;
    districtId?: number;
    country?: string;
    city?: string;
    userId?: number;
    userName?: string;
    ward?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    status?: number;
    isDeleted?: boolean;
}
