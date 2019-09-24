import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuAdminService } from '../../../../services/api/menu/admin-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { AdminMenuItem, AdminMenuItemModule, AdminMenuExtraItemModule, AdminMenuExtra, AdminExtraItem, } from '../../../../models/menu-item/admin-menu-item.model';
import { ExtraItemType } from '../../../../models/restaurant-menu/restaurant-menu.model';
import { MenuItemAdminService } from '../../../../services';
import { MenuModel } from '../../../../models/menu/app-menu.model';
import { I18nService } from '../../../../core';

@Component({
    selector: 'admin-menu-item-creation',
    templateUrl: './menu-item-creation.component.html',
    styleUrls: ['./menu-item-creation.component.scss']
})
export class AdminMenuItemCreationComponent {
    private languageSupported: Language[] = [];
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private menuAdminModels: MenuModel[] = [];
    private message: string;
    private isError: boolean;
    private adminMenuItem: AdminMenuItem = new AdminMenuItem();
    private imgUrl: string;

    constructor(
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private menuAdminService: MenuAdminService,
        private menuItemAdminService: MenuItemAdminService,
        private restaurantAdminService: RestaurantAdminService,
        private i18nService: I18nService,
    ) {
    }

    ngOnInit(): void {
        this.onGetAllRestaurantSortByName();
        this.onInitAdminMenuItem();
    }

    onInitAdminMenuItem = () => {
        this.clientState.isBusy = true;
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });
            this.adminMenuItem = <AdminMenuItem>{
              file: null,
              isCombo: false,
              menuId: null,
              restaurantId: null,
              price: 0,
              availableMonday: true,
              availableTuesday: true,
              availableWednesday: true,
              availableThursday: true,
              availableFriday: true,
              availableSaturday: false,
              availableSunday: false,
              outOfStock: false,
              languageLst: this.languageSupported.map(lang => {
                return AdminMenuItemModule.initAdminMenuItemTranslator(lang);
              }),
              menuExtraLst: []
            };
            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
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
        if (restaurantId == -1) {
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

    onSubmit = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.menuItemAdminService.createMenuItem(this.adminMenuItem).subscribe({
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

    onSubmitAndCreate = () => {
        this.clientState.isBusy = true;
        let restaurantId = this.adminMenuItem.restaurantId;
        let menuId = this.adminMenuItem.menuId;

        this.menuItemAdminService.createMenuItem(this.adminMenuItem).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.message = "CreateSuccess";
                this.isError = false;

                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.adminMenuItem = <AdminMenuItem>{
                        file: null,
                        isCombo: false,
                        menuId: menuId,
                        restaurantId: restaurantId,
                        price: 0,
                        languageLst: this.languageSupported.map(lang => {
                            return AdminMenuItemModule.initAdminMenuItemTranslator(lang);
                        }),
                        menuExtraLst: [
                        ]
                    };
                    if (this.adminMenuItem.priority == null) this.adminMenuItem.priority = 0;
                    this.clientState.isBusy = false;
                });
            },
            error: (err: ApiError) => {
                this.message = "EnterRequiredField";
                this.isError = true;
                this.clientState.isBusy = false;
            },
        });
    }

    onAddMoreExtraItem = (extraItemType: ExtraItemType) => {
        this.adminMenuItem.menuExtraLst.push(
            <AdminMenuExtra>{
                menuExtraId: !this.adminMenuItem.menuExtraLst.length ? 1 : Math.max.apply(Math, this.adminMenuItem.menuExtraLst.map(function (o) {
                    return o && o.menuExtraId || 0;
                })) + 1,
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
                extraItemId: Math.max.apply(Math, extraItems.map(function (o) { return o && o.extraItemId || 0; })) + 1
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
}
