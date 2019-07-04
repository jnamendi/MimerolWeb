import { BaseModel } from '../base.model';

export class RoleAdminModel extends BaseModel {
    roleId?: number;
    name: string;
    code: string;
    status?: number;
    isDeleted?: boolean;
    constructor() {
        super();
        this.status = RoleStatus.UnPublish;
    }
}

export enum RoleStatus {
    UnPublish = 0,
    Publish = 1,
    // Deleted = 2,
    // Authorize = 3,
    // InAuthorize = 4,
    // InActive = 5
}