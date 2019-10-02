import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuAdminService } from '../../../../services/api/menu/admin-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { AdminMenuItem, AdminMenuItemModule, AdminMenuExtra, AdminExtraItem, AdminMenuExtraItemModule, TimeAvailableMenuItem, OpenCloseTimeMenuItem, WeekDay } from '../../../../models/menu-item/admin-menu-item.model';
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
    private day: typeof WeekDay = WeekDay;
    private checkOpenLesserClose: boolean = false;
    private checkOpenGreaterClose: boolean = false;
    private checkOpenTimeIsNull: boolean = false;
    private checkCloseTimeIsNull: boolean = false;
    private datePosition: number;
    private positionTimeOfDate: number;


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
        this.clientState.isBusy = true;
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

            if (this.adminMenuItem.priority == null) this.adminMenuItem.priority = 0;

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
            this.clientState.isBusy = false;
            this.onAutoCreateOpenClose();
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        })
    }

    onGetAllRestaurantSortByName = () => {
        this.clientState.isBusy = true;
        this.restaurantAdminService.getAllRestaurantSortByName().subscribe(res => {
            if (res.content == null) {
                this.restaurantAdminModels = [];
            } else {
                this.restaurantAdminModels = <RestaurantAdminModel[]>[...res.content]
            }
            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
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

    onValidateTimeAvalible = (openTime: string, closeTime: string) => {
        let openTimeTemp = openTime.split(":");
        let openHour = parseFloat(openTimeTemp[0]);
        let openMinute = parseFloat(openTimeTemp[1]);
        let closeTimeTemp = closeTime.split(":");
        let closeHour = parseFloat(closeTimeTemp[0]);
        let closeMinute = parseFloat(closeTimeTemp[1]);

        if (closeHour == openHour && closeMinute == openMinute) return true;
        else if (closeHour < openHour) return true;
        else if (closeHour == openHour && closeMinute <= openMinute) return true;
        return false;
    }

    onScrollIntoViewValidate = (id: HTMLElement) => {
        id.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    }

    onUpdateMenuItem = (isValid: boolean) => {
        if (!isValid) {
            return;
        }

        for (let indexDate = 0; indexDate < this.adminMenuItem.listMenuTimeAvailableModel.length; indexDate++) {
            if (this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list.length != 0) {
                for (let indexTimeOfDate = 0; indexTimeOfDate < this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list.length; indexTimeOfDate++) {
                    this.checkOpenGreaterClose = false;
                    this.checkOpenLesserClose = false;
                    this.checkCloseTimeIsNull = false;
                    this.checkOpenTimeIsNull = false;
                    if (this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime == ""
                        && this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime != "") {
                        this.checkOpenTimeIsNull = true;
                        this.datePosition = indexDate;
                        this.positionTimeOfDate = indexTimeOfDate;
                        this.onScrollIntoViewValidate(document.getElementById("availableAt"));
                        return;
                    } else if (this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime != ""
                        && this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime == "") {
                        this.checkCloseTimeIsNull = true;
                        this.datePosition = indexDate;
                        this.positionTimeOfDate = indexTimeOfDate;
                        this.onScrollIntoViewValidate(document.getElementById("availableAt"));
                        return;
                    } else if (this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime != ""
                        && this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime != "") {
                        this.checkOpenLesserClose = this.onValidateTimeAvalible(this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime,
                            this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime);
                        if (this.checkOpenLesserClose) {
                            this.datePosition = indexDate;
                            this.positionTimeOfDate = indexTimeOfDate;
                            this.onScrollIntoViewValidate(document.getElementById("availableAt"));
                            return;
                        }
                        if (indexTimeOfDate > 0) {
                            this.checkOpenGreaterClose = this.onValidateTimeAvalible(this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate - 1].closeTime,
                                this.adminMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime);
                            if (this.checkOpenGreaterClose) {
                                this.datePosition = indexDate;
                                this.positionTimeOfDate = indexTimeOfDate;
                                this.onScrollIntoViewValidate(document.getElementById("availableAt"));
                                return;
                            }
                        }
                    }
                }
            }
        }

        for (let indexWorkTime = this.adminMenuItem.listMenuTimeAvailableModel.length - 1; indexWorkTime >= 0; indexWorkTime--) {
            for (let indexItems = this.adminMenuItem.listMenuTimeAvailableModel[indexWorkTime].list.length - 1; indexItems >= 0; indexItems--) {
                if (this.adminMenuItem.listMenuTimeAvailableModel[indexWorkTime].list[indexItems].openTime == "") this.adminMenuItem.listMenuTimeAvailableModel[indexWorkTime].list.splice(indexItems, 1);
            }
            if (this.adminMenuItem.listMenuTimeAvailableModel[indexWorkTime].list.length == 0) {
                this.adminMenuItem.listMenuTimeAvailableModel.splice(indexWorkTime, 1);
            }
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

    onAutoCreateOpenClose = () => {
        if (this.adminMenuItem.listMenuTimeAvailableModel.length == 0) {
            for (let i = 0; i < 7; i++) {
                this.adminMenuItem.listMenuTimeAvailableModel.push(<TimeAvailableMenuItem>{
                    weekDay: this.day[i],
                    list: []
                });
                for (let j = 0; j < this.adminMenuItem.listMenuTimeAvailableModel.length; j++) {
                    if (this.adminMenuItem.listMenuTimeAvailableModel[j].list.length == 0) {
                        this.adminMenuItem.listMenuTimeAvailableModel[j].list.push(<OpenCloseTimeMenuItem>{
                            openTime: "",
                            closeTime: "",
                        });
                    }
                }
            }
        } else {
            for (let i = 0; i < this.adminMenuItem.listMenuTimeAvailableModel.length; i++) {
                if (this.adminMenuItem.listMenuTimeAvailableModel[i].list.length == 0) {
                    this.adminMenuItem.listMenuTimeAvailableModel[i].list.push(<OpenCloseTimeMenuItem>{
                        openTime: "",
                        closeTime: "",
                    });
                }
            }
        }
    };

    onAddTimeAvailable = (val: OpenCloseTimeMenuItem[]) => {
        val.push(<OpenCloseTimeMenuItem>{
            openTime: "",
            closeTime: ""
        });
    };

    onRemoveTimeAvailable = (timeAvailable: OpenCloseTimeMenuItem[]) => {
        let index = timeAvailable.findIndex(e => e == timeAvailable);
        timeAvailable && timeAvailable.splice(index, 1);
    };

    onRevertTime = (x: number, y: number) => {
        this.adminMenuItem.listMenuTimeAvailableModel[x].list[y].openTime = "";
        this.adminMenuItem.listMenuTimeAvailableModel[x].list[y].closeTime = "";
    };
}
