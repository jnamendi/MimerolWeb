export interface ChildFilterModel {
    type: FilterType;
    isToggle?: boolean;
    food?: FilterFoodItem[];
    price?: FilterPriceItem;
    cost?: FilterCostItem[];
}

export interface FilterFoodItem {
    name: string;
    count: number;
}

export interface FilterPriceItem {
    from: number;
    to: number;
}

export interface FilterCostItem {
    name: string;
    value: boolean;
}

export enum FilterType {
    Foods = 0,
    Price = 1,
    Cost = 2
}