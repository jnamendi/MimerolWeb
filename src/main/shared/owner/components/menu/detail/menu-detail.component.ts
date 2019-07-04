import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuOwnerModel, MenuModule } from '../../../../models/menu/owner-menu.model';
import { MenuOwnerService } from '../../../../services/api/menu/owner-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';
import { RestaurantOwnerModel } from '../../../../models/restaurant/owner-restaurant.model';
import { RestaurantOwnerService } from '../../../../services/api/restaurant/owner-restaurant.service';

@Component({
    selector: 'owner-menu-detail',
    templateUrl: './menu-detail.component.html'
})
export class OwnerMenuDetailComponent {
    private sub: any;
    private menuId: number;
    private menuOwnerModel: MenuOwnerModel = new MenuOwnerModel();
    private restaurantOwnerModel: RestaurantOwnerModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private menuOwnerService: MenuOwnerService,
        private languageService: LanguageService,
        private restaurantOwnerService: RestaurantOwnerService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.menuId = +params['id'];
            if (this.menuId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetMenu(this.menuId);
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

    onGetMenu = (menuId: number) => {
        this.menuOwnerService.getMenu(menuId).subscribe(res => {
            let menuModelFromRes = <MenuOwnerModel>{ ...res.content };
            this.menuOwnerModel = {
                ...menuModelFromRes,
                languageLst: menuModelFromRes.languageLst || this.languageSupported.map(lang => {
                    return MenuModule.initTranslator(lang);
                })
            };
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

    onUpdateMenu = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.menuOwnerService.updateMenu(this.menuOwnerModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/menu']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    onDeleteMenu = () => {
        this.clientState.isBusy = true;
        this.menuOwnerService.deleteMenu(+this.menuOwnerModel.menuId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/menu']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
