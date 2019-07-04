import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuOwnerModel, MenuModule } from '../../../../models/menu/owner-menu.model';
import { MenuOwnerService } from '../../../../services/api/menu/owner-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantOwnerService } from '../../../../services/api/restaurant/owner-restaurant.service';
import { RestaurantOwnerModel } from '../../../../models/restaurant/owner-restaurant.model';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';

@Component({
    selector: 'owner-menu-creation',
    templateUrl: './menu-creation.component.html'
})
export class OwnerMenuCreationComponent {
    private languageSupported: Language[] = [];
    private menuOwnerModel: MenuOwnerModel = new MenuOwnerModel();
    private restaurantOwnerModel: RestaurantOwnerModel[] = [];
    private message: string;
    private isError: boolean;
    constructor(
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private menuOwnerService: MenuOwnerService,
        private restaurantOwnerService: RestaurantOwnerService,
    ) {
    }

    ngOnInit(): void {
        this.onInitMenu();
        this.onGetRestaurantByOwner();
    }

    onInitMenu = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.menuOwnerModel = <MenuOwnerModel>{
                menuId: null,
                name: '',
                restaurantId: null,
                status: 1,
                languageLst: this.languageSupported.map(lang => {
                    return MenuModule.initTranslator(lang);
                })
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
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

    onSubmit = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.menuOwnerService.createMenu(this.menuOwnerModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/menu']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }
}
