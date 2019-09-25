import { ExtraItemType } from "../restaurant-menu/restaurant-menu.model";
import { Language, LanguageList, FieldTranslation } from "../langvm.model";
import { BaseModel } from "../base.model";

export class AdminMenuItem extends BaseModel {
  menuItemId?: number;
  restaurantId: number;
  isCombo?: boolean;
  languageLst: Array<LanguageList>;
  menuExtraLst: Array<AdminMenuExtra>;
  menuId?: number;
  menuName?: string;
  imageUrl: string;
  price: number;
  status?: number;
  sortOrder?: number;
  file?: File;
  availableMonday: boolean;
  availableTuesday: boolean;
  availableWednesday: boolean;
  availableThursday: boolean;
  availableFriday: boolean;
  availableSaturday: boolean;
  availableSunday: boolean;
  outOfStock: boolean;
  priority: number;
}

export class AdminMenuExtra {
  menuExtraId?: number;
  extraItemType: ExtraItemType;
  languageLst: Array<LanguageList>;
  extraItemLst: Array<AdminExtraItem>;
}

export class AdminExtraItem {
  extraItemId?: number;
  extraItem?: Array<LanguageList>;
  price: number;
}

export enum ExtraItemStatus {
  UnPublish = 0,
  Publish = 1,
  Deleted = 2,
  Authorize = 3,
  InAuthorize = 4,
  InActive = 5
}

export module AdminMenuItemModule {
  export function initAdminMenuItemTranslator(lang: Language): LanguageList {
    return <LanguageList>{
      ...lang,
      contentDef: [
        <FieldTranslation>{
          label: "Menu item name",
          code: "menu_item_name",
          value: "",
          inputType: "input"
        },
        <FieldTranslation>{
          label: "Description",
          code: "menu_item_description",
          value: "",
          inputType: "textarea"
        }
      ]
    };
  }
}

export module AdminMenuExtraItemModule {
  export function initExtraItemNameTranslator(lang: Language): LanguageList {
    return <LanguageList>{
      ...lang,
      contentDef: [
        <FieldTranslation>{
          code: "menu_extra_item_name",
          value: "",
          inputType: "input"
        }
      ]
    };
  }
  export function initExtraItemTitleTranslator(lang: Language): LanguageList {
    return <LanguageList>{
      ...lang,
      contentDef: [
        <FieldTranslation>{
          code: "menu_extra_item_title",
          value: "",
          inputType: "input"
        }
      ]
    };
  }
}
