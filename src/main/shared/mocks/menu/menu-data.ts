import { MenuAdminModel } from '../../models/menu/admin-menu.model';
import { RestaurantMenuModel, MenuItem } from '../../models/menu/app-menu.model';

export const data: MenuAdminModel[] = [
    // { menuId: 1 name: 'Test 01', restaurantId: 1 },
    // { menuId: 2, code: 'Test 02', name: 'Test 02', restaurantId: 2, sortOrder: 1 },
    // { menuId: 3, code: 'Test 03', name: 'Test 03', restaurantId: 2, sortOrder: 1 },
    // { menuId: 4, code: 'Test 04', name: 'Test 04', restaurantId: 3, sortOrder: 2 },
    // { menuId: 5, code: 'Test 05', name: 'Test 05', restaurantId: 4, sortOrder: 1 },
    // { menuId: 6, code: 'Test 06', name: 'Test 06', restaurantId: 5, sortOrder: 2 },
    // { menuId: 7, code: 'Test 07', name: 'Test 07', restaurantId: 1, sortOrder: 1 },
]

export const menuCategoryDatas: RestaurantMenuModel[] = [
    {
        categoryId: 1, categoryName: 'Foods', menus: [
            { menuId: 1, menuName: 'Acne' },
            { menuId: 2, menuName: 'Grüne Erde' },
            { menuId: 3, menuName: 'Albiro' },
            { menuId: 4, menuName: 'Ronhill' },
            { menuId: 5, menuName: 'Oddmolly' },
            { menuId: 6, menuName: 'Boudestijn' },
            { menuId: 7, menuName: 'Rösch creative culture' },
        ]
    },
    {
        categoryId: 2, categoryName: 'Price', menus: [
            { menuId: 8, menuName: 'Acne' },
            { menuId: 9, menuName: 'Grüne Erde' },
            { menuId: 10, menuName: 'Albiro' },
            { menuId: 11, menuName: 'Ronhill' },
        ]
    }, {
        categoryId: 3, categoryName: 'Delivery costs', menus: [
            { menuId: 12, menuName: 'Acne' },
            { menuId: 13, menuName: 'Grüne Erde' },
            { menuId: 14, menuName: 'Albiro' },
            { menuId: 15, menuName: 'Ronhill' },
            { menuId: 16, menuName: 'Oddmolly' },
            { menuId: 17, menuName: 'Boudestijn' },
            { menuId: 18, menuName: 'Rösch creative culture' },
        ]
    },
];

export const menuItemDatas: MenuItem[] = [
    {
        itemId: 1, menuId: 1, itemName: '123', description: 'Candied salmon, basil potato puree, baby kale marsala eggplant confit & balsamic butter sauce.', price: 33,
        extraItems: [
            { extraItemId: 1, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 2, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 3, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 4, extraItemName: 'Extra suger', price: 5 },
        ]
    },
    {
        itemId: 2, menuId: 1, itemName: '456', description: 'Candied salmon, basil potato puree, baby kale marsala eggplant confit & balsamic butter sauce.', price: 33,
        extraItems: [
            { extraItemId: 1, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 2, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 3, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 4, extraItemName: 'Extra suger', price: 5 },
        ]
    },
    {
        itemId: 3, menuId: 2, itemName: 'Alder Grilled Chinook Salmon',
        description: 'Freshly scrambled eggs with applewood smoked bacon, tomatoes, green onions and cheddar cheese.', price: 15,
        extraItems: [
            { extraItemId: 5, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 6, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 7, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 8, extraItemName: 'Extra suger', price: 5 },
        ]
    },
    {
        itemId: 4, menuId: 2, itemName: '789',
        description: 'Freshly scrambled eggs with applewood smoked bacon, tomatoes, green onions and cheddar cheese.', price: 15,
        extraItems: [
            { extraItemId: 5, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 6, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 7, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 8, extraItemName: 'Extra suger', price: 5 },
        ]
    },
    {
        itemId: 3, menuId: 8, itemName: 'Alder Grilled Chinook Salmon',
        description: 'Candied salmon, basil potato puree, baby kale marsala eggplant confit & balsamic butter sauce.', price: 22,
        extraItems: [
            { extraItemId: 9, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 10, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 11, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 12, extraItemName: 'Extra suger', price: 5 },
        ]
    },
    {
        itemId: 4, menuId: 8, itemName: 'Alder Grilled Chinook Salmon',
        description: 'Candied salmon, basil potato puree, baby kale marsala eggplant confit & balsamic butter sauce.', price: 44,
        extraItems: [
            { extraItemId: 13, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 14, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 15, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 16, extraItemName: 'Extra suger', price: 5 },
        ]
    },
    {
        itemId: 5, menuId: 12, itemName: 'Alder Grilled Chinook Salmon',
        description: 'Candied salmon, basil potato puree, baby kale marsala eggplant confit & balsamic butter sauce.', price: 99,
        extraItems: [
            { extraItemId: 17, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 18, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 19, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 20, extraItemName: 'Extra suger', price: 5 },
        ]
    },
    {
        itemId: 6, menuId: 12, itemName: 'Alder Grilled Chinook Salmon',
        description: 'Candied salmon, basil potato puree, baby kale marsala eggplant confit & balsamic butter sauce.', price: 105,
        extraItems: [
            { extraItemId: 21, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 22, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 23, extraItemName: 'Extra suger', price: 5 },
            { extraItemId: 24, extraItemName: 'Extra suger', price: 5 },
        ]
    },
];