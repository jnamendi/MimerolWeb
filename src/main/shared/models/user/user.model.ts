export class UserModel {
    email: string;
    password?: string;
    authToken?: string;
    id?: string;
    photoUrl?: string;
    name?: string;
    fullName?: string;
    roles?: Array<string>;
    provider?: string; //'FACEBOOK' | 'GOOGLE' | 'NORMAL' | 'AUTHEN_TOKEN';
    isDeleted?: boolean;
    languageCode?: string;
    constructor() {
        this.provider = 'NORMAL';
        this.isDeleted = false;
    }
}

export class UserDetailsModel {
    accountType: string;
    email: string;
    fullName: string;
    phone: string;
    userId: number;
    receiveNewsLetter: boolean
}

export class UserChangePasswordModel {
    newPassword: string;
    oldPassword: string;
    userId: number;
}

export class UserResponseModel {
    userId: number;
    token: string;
    fullName: string;
    email: string;
    phone: string;
    roles?: Array<string>;
}

export class UserTokenParsing {
    exp: number;
    username: string;
}

export enum UserRole {
    Admin = 1,
    Owner = 2,
    Guest = 3
}
