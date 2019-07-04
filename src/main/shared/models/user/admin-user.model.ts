import { BaseModel } from '../base.model';
import { Configs } from '../../common/configs/configs';

export class UserAdminModel extends BaseModel {
    userId?: number;
    accountType?: string;
    email?: string;
    fullName?: string;
    languageCode?: string;
    password?: string;
    phone?: string;
    provider?: string;
    receiveNewsLetter?: boolean;
    roles?: Array<string>;
    userName: string;
    status?: number;
    aliasName?: string;
    constructor() {
        super();
        this.provider = 'NORMAL';
        this.isDeleted = false;
        this.accountType = Configs.AccountTypes.find(t => t.value == 1).text;
        this.status = UserStatus.Publish;
        this.roles = [UserRole[UserRole.Guest].toLowerCase()]
    }
}

export enum UserStatus {
    UnPublish = 0,
    Publish = 1,
    Deleted = 2,
    Authorize = 3,
    InAuthorize = 4,
    InActive = 5
}

export enum UserRole {
    Admin = 0,
    Owner = 1,
    Guest = 2,
}

export class UserViewModel {
    userId: number;
    userName: string;
    aliasName: string;
}

export module UserModule {
    export function toViewModel(user: UserAdminModel): UserViewModel {
        return <UserViewModel>{
            userId: user.userId,
            userName: user.userName,
            aliasName: user.aliasName
        };
    }
}