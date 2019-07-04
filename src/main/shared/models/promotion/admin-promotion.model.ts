import { FieldTranslation, Language, LanguageList } from '../langvm.model';
import { BaseModel } from '../base.model';

export class PromotionAdminModel extends BaseModel {
    promotionId?: number;
    endDate?: Date;
    isApplyAll?: boolean;
    languageLst?: LanguageList[];
    minOrder?: number;
    startDate?: Date;
    status?: number;
    value?: number;
    restaurantId?: number;
    code?: string;
}

export enum PromotionStatus {
    UnPublish = 0,
    Publish = 1,
    Deleted = 2,
    Authorize = 3,
    InAuthorize = 4,
    InActive = 5
}

export module PromotionModule {
    export function initTranslator(lang: Language): LanguageList {
        return <LanguageList>{
            ...lang, contentDef: [
                <FieldTranslation>{ label: 'Promotion name', code: 'promotion_name', value: '', inputType: 'input' },
                <FieldTranslation>{ label: 'Description', code: 'promotion_desc', value: '', inputType: 'textarea' },
            ]
        }
    }
}
