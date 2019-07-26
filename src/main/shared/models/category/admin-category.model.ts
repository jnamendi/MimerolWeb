import { LanguageList } from '../langvm.model';
import { BaseModel } from '../base.model';

export class CategoryAdminModel extends BaseModel {
    categoryId?: number;
    categoryName?: string;
    languageLst?: LanguageList[];
    mediaId: number;
    name: string;
    sortOrder: number;
    status?: number;
}

export enum CategoryStatus {
    UnPublish = 0,
    Publish = 1,
    Deleted = 2,
    Authorize = 3,
    UnAuthorize = 4,
    InActive = 5
}