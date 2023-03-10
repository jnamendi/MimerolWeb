import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuOwnerService } from '../../../../services/api/menu/owner-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantOwnerModel } from '../../../../models/restaurant/owner-restaurant.model';
import { RestaurantOwnerService } from '../../../../services/api/restaurant/owner-restaurant.service';
import { OwnerMenuItem, OwnerMenuItemModule, OwnerMenuExtra, OwnerExtraItem, OwnerMenuExtraItemModule, TimeAvailableMenuItem, OpenCloseTimeMenuItem, WeekDay } from '../../../../models/menu-item/owner-menu-item.model';
import { MenuModel } from '../../../../models/menu/app-menu.model';
import { I18nService } from '../../../../core';
import { MenuItemOwnerService } from '../../../../services';
import { ExtraItemType } from '../../../../models/restaurant-menu/restaurant-menu.model';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';

@Component({
    selector: 'owner-menu-item-detail',
    templateUrl: './menu-item-detail.component.html',
    styleUrls: ['./menu-item-detail.component.scss']
})
export class OwnerMenuItemDetailComponent {
    private sub: any;
    private menuItemId: number;
    private restaurantOwnerModel: RestaurantOwnerModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];
    private ownerMenuItem: OwnerMenuItem = new OwnerMenuItem();
    private menuOwnerModels: MenuModel[] = [];
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
        private menuOwnerService: MenuOwnerService,
        private menuItemOwnerService: MenuItemOwnerService,
        private restaurantOwnerService: RestaurantOwnerService,
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
        this.onGetRestaurantByOwner();
    }

    onGetMenuItem = (menuItemId: number) => {
        this.menuItemOwnerService.getMenuItem(menuItemId).subscribe(res => {
            let menuModelFromRes = <OwnerMenuItem>{ ...res.content };
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
            this.ownerMenuItem = {
                ...menuModelFromRes,
                languageLst: menuModelFromRes.languageLst || this.languageSupported.map(lang => {
                    return OwnerMenuItemModule.initOwnerMenuItemTranslator(lang);
                }),
            };

            if (this.ownerMenuItem.priority == null) this.ownerMenuItem.priority = 0;

            this.onGetMenuByRestaurantId(this.ownerMenuItem.restaurantId);

            this.ownerMenuItem.menuExtraLst = this.ownerMenuItem.menuExtraLst && this.ownerMenuItem.menuExtraLst.map(m => {
                return <OwnerMenuExtra>{
                    ...m,
                    languageLst: m.languageLst || this.languageSupported.map(lang => {
                        return OwnerMenuExtraItemModule.initExtraItemNameTranslator(lang);
                    }),
                };
            }) || [];

            this.ownerMenuItem.menuExtraLst.map(e => {
                e.extraItemLst = e.extraItemLst && e.extraItemLst.map(et => {
                    return <OwnerExtraItem>{
                        ...et,
                        extraItem: et.extraItem || this.languageSupported.map(lang => {
                            return OwnerMenuExtraItemModule.initExtraItemTitleTranslator(lang);
                        }),
                    }
                }) || [];
            });
            this.onAutoCreateOpenClose();
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        })
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

    onGetMenuByRestaurantId = (restaurantId: number) => {
        if (restaurantId <= 0 || restaurantId == null) {
            return;
        }
        this.clientState.isBusy = true;
        this.menuOwnerService.getMenuByRestaurantId(restaurantId, this.i18nService.language.split('-')[0].toLocaleLowerCase()).subscribe(res => {
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

        for (let indexDate = 0; indexDate < this.ownerMenuItem.listMenuTimeAvailableModel.length; indexDate++) {
            if (this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list.length != 0) {
                for (let indexTimeOfDate = 0; indexTimeOfDate < this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list.length; indexTimeOfDate++) {
                    this.checkOpenGreaterClose = false;
                    this.checkOpenLesserClose = false;
                    this.checkCloseTimeIsNull = false;
                    this.checkOpenTimeIsNull = false;
                    if (this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime == ""
                        && this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime != "") {
                        this.checkOpenTimeIsNull = true;
                        this.datePosition = indexDate;
                        this.positionTimeOfDate = indexTimeOfDate;
                        this.onScrollIntoViewValidate(document.getElementById("availableAt"));
                        return;
                    } else if (this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime != ""
                        && this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime == "") {
                        this.checkCloseTimeIsNull = true;
                        this.datePosition = indexDate;
                        this.positionTimeOfDate = indexTimeOfDate;
                        this.onScrollIntoViewValidate(document.getElementById("availableAt"));
                        return;
                    } else if (this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime != ""
                        && this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime != "") {
                        this.checkOpenLesserClose = this.onValidateTimeAvalible(this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime,
                            this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].closeTime);
                        if (this.checkOpenLesserClose) {
                            this.datePosition = indexDate;
                            this.positionTimeOfDate = indexTimeOfDate;
                            this.onScrollIntoViewValidate(document.getElementById("availableAt"));
                            return;
                        }
                        if (indexTimeOfDate > 0) {
                            this.checkOpenGreaterClose = this.onValidateTimeAvalible(this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate - 1].closeTime,
                                this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list[indexTimeOfDate].openTime);
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

        for (let indexWorkTime = this.ownerMenuItem.listMenuTimeAvailableModel.length - 1; indexWorkTime >= 0; indexWorkTime--) {
            for (let indexItems = this.ownerMenuItem.listMenuTimeAvailableModel[indexWorkTime].list.length - 1; indexItems >= 0; indexItems--) {
                if (this.ownerMenuItem.listMenuTimeAvailableModel[indexWorkTime].list[indexItems].openTime == "") this.ownerMenuItem.listMenuTimeAvailableModel[indexWorkTime].list.splice(indexItems, 1);
            }
            if (this.ownerMenuItem.listMenuTimeAvailableModel[indexWorkTime].list.length == 0) {
                this.ownerMenuItem.listMenuTimeAvailableModel.splice(indexWorkTime, 1);
            }
        }

        this.clientState.isBusy = true;
        this.menuItemOwnerService.updateMenuItem(this.ownerMenuItem).subscribe(res => {
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
                menuExtraId: Math.max.apply(Math, this.ownerMenuItem.menuExtraLst.map(function (o) { return o && o.menuExtraId || 0; })) || 0 + 1,
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
                extraItemId: Math.max.apply(Math, extraItems.map(function (o) { return o && o.extraItemId || 0; })) || 0 + 1
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


    onDeleteMenuItem = () => {
        this.clientState.isBusy = true;
        this.menuItemOwnerService.deleteMenuItem(+this.ownerMenuItem.menuItemId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/menu-item']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onAutoCreateOpenClose = () => {
        if (this.ownerMenuItem.listMenuTimeAvailableModel.length == 0) {
            for (let i = 0; i < 7; i++) {
                this.ownerMenuItem.listMenuTimeAvailableModel.push(<TimeAvailableMenuItem>{
                    weekDay: this.day[i],
                    list: []
                });
                for (let j = 0; j < this.ownerMenuItem.listMenuTimeAvailableModel.length; j++) {
                    if (this.ownerMenuItem.listMenuTimeAvailableModel[j].list.length == 0) {
                        this.ownerMenuItem.listMenuTimeAvailableModel[j].list.push(<OpenCloseTimeMenuItem>{
                            openTime: "",
                            closeTime: "",
                        });
                    }
                }
            }
        } else {
            for (let i = 0; i < this.ownerMenuItem.listMenuTimeAvailableModel.length; i++) {
                if (this.ownerMenuItem.listMenuTimeAvailableModel[i].list.length == 0) {
                    this.ownerMenuItem.listMenuTimeAvailableModel[i].list.push(<OpenCloseTimeMenuItem>{
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

    onRemoveTimeAvailable = (indexDate: number, indexTimeOfDate: number) => {
        // let index = timeAvailable.findIndex(e => e == timeAvailable);
        // timeAvailable && timeAvailable.splice(index, 1);
        this.ownerMenuItem.listMenuTimeAvailableModel[indexDate].list.splice(indexTimeOfDate, 1);
    };

    onRevertTime = (x: number, y: number) => {
        this.ownerMenuItem.listMenuTimeAvailableModel[x].list[y].openTime = "";
        this.ownerMenuItem.listMenuTimeAvailableModel[x].list[y].closeTime = "";
    };
}
