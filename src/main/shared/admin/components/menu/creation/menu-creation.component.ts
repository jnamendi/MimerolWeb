import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { ApiError } from '../../../../services/api-response/api-response';
import { MenuAdminModel, MenuModule } from '../../../../models/menu/admin-menu.model';
import { MenuAdminService } from '../../../../services/api/menu/admin-menu.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { FormBuilder, FormGroup, Validators } from '../../../../../../../node_modules/@angular/forms';

@Component({
    selector: 'admin-menu-creation',
    templateUrl: './menu-creation.component.html'
})
export class AdminMenuCreationComponent {
    private languageSupported: Language[] = [];
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private menuAdminModel: MenuAdminModel = new MenuAdminModel();
    private message: string;
    private isError: boolean;
    private form: FormGroup;
    constructor(
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private menuAdminService: MenuAdminService,
        private restaurantAdminService: RestaurantAdminService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            restaurantName: [null, Validators.required],
        });
        this.onInitMenu();
        this.onGetAllRestaurantSortByName();
    }

    onInitMenu = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.menuAdminModel = <MenuAdminModel>{
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

    onSubmit = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.menuAdminService.createMenu(this.menuAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/menu']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

    onSubmitAndCreate = () => {
        this.clientState.isBusy = true;
        let restaurantId = this.menuAdminModel.restaurantId;
        this.menuAdminService.createMenu(this.menuAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.message = "CreateSuccess";
            this.isError = false;

            this.languageService.getLanguagesFromService().subscribe(res => {
                this.languageSupported = res.content.data.map(lang => {
                    return <Language>{ ...lang };
                });

                this.menuAdminModel = <MenuAdminModel>{
                    menuId: null,
                    name: '',
                    restaurantId: restaurantId,
                    status: 1,
                    languageLst: this.languageSupported.map(lang => {
                        return MenuModule.initTranslator(lang);
                    })
                };
            });
        }, (err: ApiError) => {
            this.message = "EnterRequiredField";
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }
}
