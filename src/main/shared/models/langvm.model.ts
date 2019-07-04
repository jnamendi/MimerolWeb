export class LangVM {
    languageId: number;
    contentDef: FieldTranslation[];
}

export class Language {
    languageId?: number;
    name: string;
    code: string;
    status?: any;
    isDeleted?: boolean;
}

export interface LanguageList {
    code: string;
    languageId: number;
    name: string;
    status: number;
    contentDef: FieldTranslation[];
}

export class FieldTranslation {
    label: string;
    value: string;
    code: string;
    inputType?: string;
}