import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuAdminService } from '../../../../services/api/menu/admin-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { AdminMenuItem, AdminMenuItemModule, AdminMenuExtra, AdminExtraItem, AdminMenuExtraItemModule } from '../../../../models/menu-item/admin-menu-item.model';
import { MenuModel } from '../../../../models/menu/app-menu.model';
import { I18nService } from '../../../../core';
import { MenuItemAdminService } from '../../../../services';
import { ExtraItemType } from '../../../../models/restaurant-menu/restaurant-menu.model';

@Component({
    selector: 'admin-menu-item-detail',
    templateUrl: './menu-item-detail.component.html',
    styleUrls: ['./menu-item-detail.component.scss']
})
export class AdminMenuItemDetailComponent {
    private sub: any;
    private menuItemId: number;
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];
    private adminMenuItem: AdminMenuItem = new AdminMenuItem();
    private menuAdminModels: MenuModel[] = [];
    private imgUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private menuAdminService: MenuAdminService,
        private menuItemAdminService: MenuItemAdminService,
        private restaurantAdminService: RestaurantAdminService,
        private i18nService: I18nService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.menuItemId = +params['id'];
            if (this.menuItemId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetMenuItem(this.menuItemId);
                }, (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                });
            }
        });
    }

    ngOnInit(): void {
        this.onGetAllRestaurantSortByName();
    }

    onGetMenuItem = (menuItemId: number) => {
        this.menuItemAdminService.getMenuItem(menuItemId).subscribe(res => {
            let menuModelFromRes = <AdminMenuItem>{ ...res.content };
            if (menuModelFromRes.languageLst) {
                menuModelFromRes.languageLst.map(l => {
                    l.contentDef && l.contentDef.map(c => {
                        if (c.code) {
                            switch (c.code) {
                                case "menu_item_name":
                                    c.label = "Menu item name";
                                    c.inputType = "input";
                                    break;
                                case "menu_item_description":
                                    c.label = "Description";
                                    c.inputType = "textarea";
                                    break;
                                default:
                                    break;
                            }
                        }
                    })
                })
            }
            this.adminMenuItem = {
                ...menuModelFromRes,
                languageLst: menuModelFromRes.languageLst || this.languageSupported.map(lang => {
                    return AdminMenuItemModule.initAdminMenuItemTranslator(lang);
                }),
            };

            this.onGetMenuByRestaurantId(this.adminMenuItem.restaurantId);

            this.adminMenuItem.menuExtraLst = this.adminMenuItem.menuExtraLst && this.adminMenuItem.menuExtraLst.map(m => {
                return <AdminMenuExtra>{
                    ...m,
                    languageLst: m.languageLst || this.languageSupported.map(lang => {
                        return AdminMenuExtraItemModule.initExtraItemNameTranslator(lang);
                    }),
                };
            }) || [];

            this.adminMenuItem.menuExtraLst.map(e => {
                e.extraItemLst = e.extraItemLst && e.extraItemLst.map(et => {
                    return <AdminExtraItem>{
                        ...et,
                        extraItem: et.extraItem || this.languageSupported.map(lang => {
                            return AdminMenuExtraItemModule.initExtraItemTitleTranslator(lang);
                        }),
                    }
                }) || [];
            });
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        })
    }

    onGetAllRestaurantSortByName = () => {
        this.restaurantAdminService.getAllRestaurantSortByName().subscribe(res => {
            if (res.content == null) {
                this.restaurantAdminModels = [];
            } else {
                this.restaurantAdminModels = <RestaurantAdminModel[]>[...res.content]
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    onGetMenuByRestaurantId = (restaurantId: number) => {
        if (restaurantId <= 0 || restaurantId == null) {
            return;
        }
        this.clientState.isBusy = true;
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        this.menuAdminService.getMenuByRestaurantId(restaurantId, languageCode).subscribe(res => {
            if (res.content == null) {
                this.menuAdminModels = [];
            } else {
                this.menuAdminModels = <MenuModel[]>[...res.content];
            }
            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
        });
    }

    detectFiles(event) {
        let file: File = event.target.files && <File>event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.imgUrl = event.target.result;
            }

            reader.readAsDataURL(file);
            this.adminMenuItem.file = file;
        }
    }

    onUpdateMenuItem = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;

        this.menuItemAdminService.updateMenuItem(this.adminMenuItem).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/menu-item']);
            },
            error: (err: ApiError) => {
                this.message = err.message;
                this.isError = true;
                this.clientState.isBusy = false;
            },
        });
    }

    onAddMoreExtraItem = (extraItemType: ExtraItemType) => {
        this.adminMenuItem.menuExtraLst.push(
            <AdminMenuExtra>{
                menuExtraId: Math.max.apply(Math, this.adminMenuItem.menuExtraLst.map(function (o) { return o && o.menuExtraId || 0; })) || 0 + 1,
                languageLst: this.languageSupported.map(lang => {
                    return AdminMenuExtraItemModule.initExtraItemNameTranslator(lang);
                }),
                extraItemType: extraItemType,
                extraItemLst: [
                    <AdminExtraItem>{
                        extraItem: this.languageSupported.map(lang => {
                            return AdminMenuExtraItemModule.initExtraItemTitleTranslator(lang);
                        }),
                        price: 0,
                        extraItemId: 1
                    }
                ]
            }
        )
    }

    onRemoveExtraItem = (menuExtra: AdminMenuExtra) => {
        if (this.adminMenuItem.menuExtraLst && this.adminMenuItem.menuExtraLst.length == 0) {
            return;
        }
        let index = this.adminMenuItem.menuExtraLst.findIndex(e => e == menuExtra);
        this.adminMenuItem.menuExtraLst && this.adminMenuItem.menuExtraLst.splice(index, 1);
    }

    onAddMoreExtraItemDetail = (extraItems: AdminExtraItem[]) => {
        extraItems.push(
            <AdminExtraItem>{
                extraItem: this.languageSupported.map(lang => {
                    return AdminMenuExtraItemModule.initExtraItemTitleTranslator(lang);
                }),
                price: 0,
                extraItemId: Math.max.apply(Math, extraItems.map(function (o) { return o && o.extraItemId || 0; })) || 0 + 1
            }
        );
    }

    onRemoveExtraItemDetail = (extraItem: AdminExtraItem, extraItems: AdminExtraItem[]) => {
        if (extraItems && extraItems.length <= 1) {
            return;
        }
        let index = extraItems.findIndex(e => e == extraItem);
        extraItems && extraItems.splice(index, 1);
    }


    onDeleteMenuItem = () => {
        this.clientState.isBusy = true;
        this.menuItemAdminService.deleteMenuItem(+this.adminMenuItem.menuItemId).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/menu-item']);
            },
            error: (err: ApiError) => {
                this.clientState.isBusy = false;
                this.message = err.message;
                this.isError = true;
            },
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
