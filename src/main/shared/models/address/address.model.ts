export class AddressModel {
    addressId?: number;
    addressDesc?: string;
    userId?: number;
    city: string;
    cityId?: number;
    districtId?: number;
    district: string;
    zone?: number;
    zoneName?: string;
    ward: string;
    address: string;
    phoneNumber: string;
    status: number;
    constructor() {
        this.cityId = null;
        this.districtId = null;
    }
}