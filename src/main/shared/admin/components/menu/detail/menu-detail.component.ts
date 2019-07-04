import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuAdminModel, MenuModule } from '../../../../models/menu/admin-menu.model';
import { MenuAdminService } from '../../../../services/api/menu/admin-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';

@Component({
    selector: 'admin-menu-detail',
    templateUrl: './menu-detail.component.html'
})
export class AdminMenuDetailComponent {
    private sub: any;
    private menuId: number;
    private menuAdminModel: MenuAdminModel = new MenuAdminModel();
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private menuAdminService: MenuAdminService,
        private restaurantAdminService: RestaurantAdminService,
        private languageService: LanguageService,
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
        this.onGetAllRestaurantSortByName();
    }

    onGetMenu = (menuId: number) => {
        this.menuAdminService.getMenu(menuId).subscribe(res => {
            let menuModelFromRes = <MenuAdminModel>{ ...res.content };
            this.menuAdminModel = {
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

    onUpdateMenu = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.menuAdminService.updateMenu(this.menuAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/menu']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    onDeleteMenu = () => {
        this.clientState.isBusy = true;
        this.menuAdminService.deleteMenu(+this.menuAdminModel.menuId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/menu']);
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
