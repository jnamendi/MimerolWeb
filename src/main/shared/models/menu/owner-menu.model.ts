import { FieldTranslation, Language, LanguageList } from '../langvm.model';
import { BaseModel } from '../base.model';

export class MenuOwnerModel extends BaseModel {
    menuId?: number;
    restaurantId: number;
    restaurantName: string;
    languageLst?: LanguageList[];
    name: string;
    urlSlug: string;
    status?: number;
    isDeleted?: boolean;
}

export enum MenuOwnerStatus {
    UnPublish = 0,
    Publish = 1,
    Deleted = 2,
    Authorize = 3,
    InAuthorize = 4,
    InActive = 5
}

export module MenuModule {
    export function initTranslator(lang: Language): LanguageList {
        return <LanguageList>{
            ...lang, contentDef: [
                <FieldTranslation>{ code: 'menu_name', value: '' },
            ]
        }
    }
}
