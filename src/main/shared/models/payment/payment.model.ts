import { BaseModel } from '../base.model';
export class PaymentModel extends BaseModel {
    constructor() {
        super();
    }
    paymentProviderId?: number;
    name?: string;
}