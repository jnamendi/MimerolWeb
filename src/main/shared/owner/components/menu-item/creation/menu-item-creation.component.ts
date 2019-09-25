import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { ApiError, PagingModel } from '../../../../services/api-response/api-response';
import { MenuOwnerService } from '../../../../services/api/menu/owner-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantOwnerService } from '../../../../services/api/restaurant/owner-restaurant.service';
import { RestaurantOwnerModel } from '../../../../models/restaurant/owner-restaurant.model';
import { OwnerMenuItem, OwnerMenuItemModule, OwnerMenuExtraItemModule, OwnerMenuExtra, OwnerExtraItem, } from '../../../../models/menu-item/owner-menu-item.model';
import { ExtraItemType } from '../../../../models/restaurant-menu/restaurant-menu.model';
import { MenuItemOwnerService } from '../../../../services';
import { MenuModel } from '../../../../models/menu/app-menu.model';
import { I18nService } from '../../../../core';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';

@Component({
    selector: 'owner-menu-item-creation',
    templateUrl: './menu-item-creation.component.html',
    styleUrls: ['./menu-item-creation.component.scss']
})
export class OwnerMenuItemCreationComponent {
    private languageSupported: Language[] = [];
    private restaurantOwnerModel: RestaurantOwnerModel[] = [];
    private menuOwnerModels: MenuModel[] = [];
    private message: string;
    private isError: boolean;
    private ownerMenuItem: OwnerMenuItem = new OwnerMenuItem();
    private imgUrl: string;
    private paginModel: PagingModel;

    constructor(
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private menuOwnerService: MenuOwnerService,
        private menuItemOwnerService: MenuItemOwnerService,
        private restaurantOwnerService: RestaurantOwnerService,
        private i18nService: I18nService,
    ) {
    }

    ngOnInit(): void {
        this.onGetRestaurantByOwner();
        this.onInitOwnerMenuItem();
    }

    onInitOwnerMenuItem = () => {
        this.clientState.isBusy = true;
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });
            this.ownerMenuItem = <OwnerMenuItem>{
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
                return OwnerMenuItemModule.initOwnerMenuItemTranslator(lang);
              }),
              menuExtraLst: []
            };
            if (this.ownerMenuItem.priority == null) this.ownerMenuItem.priority = 0;
            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

    onGetRestaurantByOwner = () => {
        let userId = JwtTokenHelper.GetUserInfo().userId;
        this.restaurantOwnerService.getRestaurantByUserId(userId).subscribe(res => {
            if (res.content == null) {
                this.restaurantOwnerModel = [];
            } else {
                this.restaurantOwnerModel = <RestaurantOwnerModel[]>[...res.content];
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    onGetMenuItemsById = (menuId: number) => {
        this.clientState.isBusy = true;
        this.menuItemOwnerService.getMenuItemsByMenuId(0, 0, menuId).subscribe(res => {
            if (res.content == null) {
                this.paginModel = { ...res.content };
            } else {
                this.paginModel = { ...res.content };
            }
            this.ownerMenuItem.priority = this.paginModel.totalCount + 1;
            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

    onGetMenuByRestaurantId = (restaurantId: number) => {
        if (restaurantId == -1) {
            return;
        }
        this.clientState.isBusy = true;
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        this.menuOwnerService.getMenuByRestaurantId(restaurantId, languageCode).subscribe(res => {
            if (res.content == null) {
                this.menuOwnerModels = [];
            } else {
                this.menuOwnerModels = <MenuModel[]>[...res.content];
                this.menuOwnerModels.sort((a, b) => {
                    var nameA = a.menuName.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.menuName.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                })
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
            this.ownerMenuItem.file = file;
        }
    }

    onSubmit = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.menuItemOwnerService.createMenuItem(this.ownerMenuItem).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/menu-item']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

    onAddMoreExtraItem = (extraItemType: ExtraItemType) => {
        this.ownerMenuItem.menuExtraLst.push(
            <OwnerMenuExtra>{
                menuExtraId: !this.ownerMenuItem.menuExtraLst.length ? 1 : Math.max.apply(Math, this.ownerMenuItem.menuExtraLst.map(function (o) {
                    return o && o.menuExtraId || 0;
                })) + 1,
                languageLst: this.languageSupported.map(lang => {
                    return OwnerMenuExtraItemModule.initExtraItemNameTranslator(lang);
                }),
                extraItemType: extraItemType,
                extraItemLst: [
                    <OwnerExtraItem>{
                        extraItem: this.languageSupported.map(lang => {
                            return OwnerMenuExtraItemModule.initExtraItemTitleTranslator(lang);
                        }),
                        price: 0,
                        extraItemId: 1
                    }
                ]
            }
        )
    }

    onRemoveExtraItem = (menuExtra: OwnerMenuExtra) => {
        if (this.ownerMenuItem.menuExtraLst && this.ownerMenuItem.menuExtraLst.length == 0) {
            return;
        }
        let index = this.ownerMenuItem.menuExtraLst.findIndex(e => e == menuExtra);
        this.ownerMenuItem.menuExtraLst && this.ownerMenuItem.menuExtraLst.splice(index, 1);
    }

    onAddMoreExtraItemDetail = (extraItems: OwnerExtraItem[]) => {
        extraItems.push(
            <OwnerExtraItem>{
                extraItem: this.languageSupported.map(lang => {
                    return OwnerMenuExtraItemModule.initExtraItemTitleTranslator(lang);
                }),
                price: 0,
                extraItemId: Math.max.apply(Math, extraItems.map(function (o) { return o && o.extraItemId || 0; })) + 1
            }
        );
    }

    onRemoveExtraItemDetail = (extraItem: OwnerExtraItem, extraItems: OwnerExtraItem[]) => {
        if (extraItems && extraItems.length <= 1) {
            return;
        }
        let index = extraItems.findIndex(e => e == extraItem);
        extraItems && extraItems.splice(index, 1);
    }
}
