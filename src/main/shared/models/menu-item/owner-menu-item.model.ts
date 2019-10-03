import { ExtraItemType } from "../restaurant-menu/restaurant-menu.model";
import { Language, LanguageList, FieldTranslation } from "../langvm.model";
import { BaseModel } from "../base.model";

export class OwnerMenuItem extends BaseModel {
  menuItemId?: number;
  restaurantId: number;
  isCombo?: boolean;
  languageLst: Array<LanguageList>;
  menuExtraLst: Array<OwnerMenuExtra>;
  menuId?: number;
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
  listMenuTimeAvailableModel: Array<TimeAvailableMenuItem> = [];
}

export class TimeAvailableMenuItem {
  menuItemTimeAvailableId: number;
  weekDay: string;
  list: Array<OpenCloseTimeMenuItem> = [];
}

export class OpenCloseTimeMenuItem {
  openTime?: string;
  closeTime?: string;
}

export class OwnerMenuExtra {
  menuExtraId?: number;
  extraItemType: ExtraItemType;
  languageLst: Array<LanguageList>;
  extraItemLst: Array<OwnerExtraItem>;
}

export class OwnerExtraItem {
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

export enum WeekDay {
  MON = 0,
  TUE = 1,
  WED = 2,
  THU = 3,
  FRI = 4,
  SAT = 5,
  SUN = 6
}

export module OwnerMenuItemModule {
  export function initOwnerMenuItemTranslator(lang: Language): LanguageList {
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

export module OwnerMenuExtraItemModule {
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
