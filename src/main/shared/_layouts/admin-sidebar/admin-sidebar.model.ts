import { AdminNavModel, AdminNavItem } from '../../../shared/models';

export const adminNavItems: AdminNavItem[] = [
    {
        'id': 'main-nav-admin',
        'translateKey': 'Admin.Navs.AdminNavText',
        'title': 'ADMIN NAVIGATION',
        'icon': '',
        'type': 'nav-category',
        'url': 'main',
        'children': [
            {
                'id': 'category',
                'translateKey': 'Admin.Navs.Category',
                'title': 'Category',
                'icon': 'fa fa-tags',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'category',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'menu',
                'translateKey': 'Admin.Navs.Menu',
                'title': 'Menu',
                'icon': 'fa fa-bars',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'menu',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'menu-item',
                'translateKey': 'Admin.Navs.MenuItem',
                'title': 'Menu Item',
                'icon': 'fa fa-bars',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'menu-item',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'restaurant',
                'translateKey': 'Admin.Navs.Restaurant',
                'title': 'Restaurant',
                'icon': 'fa fa-cutlery',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'restaurant',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'orders',
                'translateKey': 'Admin.Navs.Orders',
                'title': 'Orders',
                'icon': 'fa fa-shopping-cart',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'orders',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'comments',
                'translateKey': 'Admin.Navs.Comments',
                'title': 'Comments',
                'icon': 'fa fa-comment',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'comment',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'rating',
                'translateKey': 'Admin.Navs.Rating',
                'title': 'Rating',
                'icon': 'fa fa-star',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'rating',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'favourite',
                'translateKey': 'Admin.Navs.Favourites',
                'title': 'Favourites',
                'icon': 'fa fa-heart',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'favourite',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'promotion',
                'translateKey': 'Admin.Navs.Promotion',
                'title': 'Promotion',
                'icon': 'fa fa-product-hunt',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'promotion',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'users',
                'translateKey': 'Admin.Navs.Users',
                'title': 'Users',
                'icon': 'fa fa-user',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'user',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'role',
                'translateKey': 'Admin.Navs.Role',
                'title': 'Role',
                'icon': 'fa fa-user-circle',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'role',
                'isActive': false,
                'children': [
                ],
            },
            {
                'id': 'address',
                'translateKey': 'Admin.Navs.Address',
                'title': 'Address',
                'icon': 'fa fa-address-card-o',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'address',
                'isActive': false,
                'children': [
                ],
            },
        ]
    },
];