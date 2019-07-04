import { AdminNavModel, AdminNavItem } from '../../../shared/models';

export const ownerNavItems: AdminNavItem[] = [
    {
        'id': 'main-nav-owner',
        'translateKey': 'Owner.Navs.OwnerNavText',
        'title': 'Owner Management',
        'icon': '',
        'type': 'nav-category',
        'url': 'main',
        'children': [
            {
                'id': 'account',
                'translateKey': 'Owner.Navs.Account',
                'title': 'Account',
                'icon': 'fa fa-user',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'account',
                'isActive': false,
                'children': [
                    {
                        'id': 'contact-info',
                        'translateKey': 'Owner.Navs.ContactInfo',
                        'title': 'Contact Infomation',
                        'icon': 'fa fa-circle-o',
                        'subIcon': '',
                        'type': 'nav-child',
                        'url': 'contact-info',
                        'children': []
                    },
                    // {
                    //     'id': 'invoicing-address',
                    //     'translateKey': 'Owner.Navs.InvoicingAddress',
                    //     'title': 'Invoicing Address',
                    //     'icon': 'fa fa-circle-o',
                    //     'subIcon': '',
                    //     'type': 'nav-child',
                    //     'url': 'invoicing-address',
                    //     'children': []
                    // }
                ],
            },
            {
                'id': 'finances',
                'translateKey': 'Owner.Navs.Finances',
                'title': 'Finances',
                'icon': 'fa fa-money',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'finances',
                'isActive': false,
                'children': [
                    {
                        'id': 'invoices',
                        'translateKey': 'Owner.Navs.Invoices',
                        'title': 'Invoices',
                        'icon': 'fa fa-circle-o',
                        'subIcon': '',
                        'type': 'nav-child',
                        'url': 'invoices',
                        'children': []
                    },
                    {
                        'id': 'pending-charges',
                        'translateKey': 'Owner.Navs.PendingCharges',
                        'title': 'Pending Charges',
                        'icon': 'fa fa-circle-o',
                        'subIcon': '',
                        'type': 'nav-child',
                        'url': 'pending-charges',
                        'children': []
                    },
                    // {
                    //     'id': 'online-payments',
                    //     'translateKey': 'Owner.Navs.OnlinePayments',
                    //     'title': 'Online Payments',
                    //     'icon': 'fa fa-circle-o',
                    //     'subIcon': '',
                    //     'type': 'nav-child',
                    //     'url': 'online-payments',
                    //     'children': []
                    // }
                ],
            },
            {
                'id': 'orders',
                'translateKey': 'Owner.Navs.Orders',
                'title': 'Orders',
                'icon': 'fa fa-shopping-cart',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'orders',
                'isActive': false,
                'children': [
                    {
                        'id': 'live-orders',
                        'translateKey': 'Owner.Navs.LiveOrders',
                        'title': 'Live orders',
                        'icon': 'fa fa-circle-o',
                        'subIcon': '',
                        'type': 'nav-child',
                        'url': 'live-orders',
                        'children': []
                    },
                    // {
                    //     'id': 'archive',
                    //     'translateKey': 'Owner.Navs.Archive',
                    //     'title': 'Archive',
                    //     'icon': 'fa fa-circle-o',
                    //     'subIcon': '',
                    //     'type': 'nav-child',
                    //     'url': 'archive',
                    //     'children': []
                    // },
                    {
                        'id': 'comments',
                        'translateKey': 'Owner.Navs.Comments',
                        'title': 'Comments',
                        'icon': 'fa fa-circle-o',
                        'subIcon': '',
                        'type': 'nav-child',
                        'url': 'comments',
                        'children': []
                    },
                ],
            },
            // {
            //     'id': 'merchandise',
            //     'title': 'Merchandise',
            //     'icon': 'fa fa-shopping-cart',
            //     'subIcon': '',
            //     'type': 'nav-parent',
            //     'url': 'merchandise',
            //     'isActive': false,
            //     'children': [
            //         {
            //             'id': 'merchandise-info',
            //             'title': 'Information',
            //             'icon': 'fa fa-circle-o',
            //             'subIcon': '',
            //             'type': 'nav-child',
            //             'url': 'merchandise-info',
            //             'children': []
            //         },
            //         {
            //             'id': 'merchandise-order-status',
            //             'title': 'Order status',
            //             'icon': 'fa fa-circle-o',
            //             'subIcon': '',
            //             'type': 'nav-child',
            //             'url': 'merchandise-order-status',
            //             'children': []
            //         },
            //         {
            //             'id': 'merchandise-delivery-bags',
            //             'title': 'Delivery Bags',
            //             'icon': 'fa fa-circle-o',
            //             'subIcon': '',
            //             'type': 'nav-child',
            //             'url': 'merchandise-delivery-bags',
            //             'children': []
            //         },
            //         {
            //             'id': 'merchandise-boxes',
            //             'title': 'Boxes',
            //             'icon': 'fa fa-circle-o',
            //             'subIcon': '',
            //             'type': 'nav-child',
            //             'url': 'merchandise-boxes',
            //             'children': []
            //         },
            //         {
            //             'id': 'merchandise-jackets',
            //             'title': 'Jackets',
            //             'icon': 'fa fa-circle-o',
            //             'subIcon': '',
            //             'type': 'nav-child',
            //             'url': 'merchandise-jackets',
            //             'children': []
            //         },
            //     ],
            // },
            // {
            //     'id': 'advertisement',
            //     'translateKey': 'Owner.Navs.Advertisement',
            //     'title': 'Advertisement',
            //     'icon': 'fa fa-shopping-cart',
            //     'subIcon': '',
            //     'type': 'nav-parent',
            //     'url': 'advertisement',
            //     'isActive': false,
            //     'children': [
            //         {
            //             'id': 'advertisement-info',
            //             'translateKey': 'Owner.Navs.Information',
            //             'title': 'Information',
            //             'icon': 'fa fa-circle-o',
            //             'subIcon': '',
            //             'type': 'nav-child',
            //             'url': 'advertisement-info',
            //             'children': []
            //         },
            //     ]
            // },
            // {
            //     'id': 'software',
            //     'translateKey': 'Owner.Navs.Software',
            //     'title': 'Software',
            //     'icon': 'fa fa-microchip',
            //     'subIcon': '',
            //     'type': 'nav-parent',
            //     'url': 'software',
            //     'isActive': false,
            //     'children': [
            //     ],
            // },
            {
                'id': 'menu',
                'translateKey': 'Owner.Navs.Menu',
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
                'translateKey': 'Owner.Navs.MenuItem',
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
                'id': 'promotion',
                'translateKey': 'Owner.Navs.Promotion',
                'title': 'Promotion',
                'icon': 'fa fa-product-hunt',
                'subIcon': '',
                'type': 'nav-parent',
                'url': 'promotion',
                'isActive': false,
                'children': [
                ],
            }
        ]
    },
];