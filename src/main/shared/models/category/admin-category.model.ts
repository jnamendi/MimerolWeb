import { FieldTranslation, LanguageList, Language } from '../langvm.model';
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

export class CategoryViewModel {
    categoryId: number;
    categoryName: string;
}

export enum CategoryStatus {
    UnPublish = 0,
    Publish = 1,
    Deleted = 2,
    Authorize = 3,
    UnAuthorize = 4,
    InActive = 5
}

export module CategoryModule {
    export function initTranslator(lang: Language): LanguageList {
        return <LanguageList>{
            ...lang, contentDef: [
                <FieldTranslation>{ code: 'category_name', value: '' },
            ]
        }
    }

    export function toViewModel(category: CategoryAdminModel): CategoryViewModel {
        return <CategoryViewModel>{
            categoryId: category.categoryId,
            categoryName: category.categoryName,
        };
    }
}
