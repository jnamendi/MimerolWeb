export class RestaurantMenuModel {
    restaurantId?: number;
    categoryId?: number;
    categoryName: string;
    menus: MenuModel[];
    isToggle?: boolean;
}

export class MenuModel {
    menuId: number;
    menuName: string;
}

export class MenuItem {
    menuId: number;
    itemId: number;
    itemName: string;
    price: number;
    totalPrice?: number;
    quantity?: number;
    description: string;
    isSelected?: boolean;
    isToggle?: boolean;
    extraItems?: MenuExtraItem[];
}

export class MenuExtraItem {
    extraItemId: number;
    extraItemName: string;
    price: number;
    isSelected?: boolean;
}
