import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { PromotionAdminModel, PromotionModule } from '../../../../models/promotion/admin-promotion.model';
import { PromotionAdminService } from '../../../../services/api/promotion/admin-promotion.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { ApiError } from '../../../../services/api-response/api-response';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';

@Component({
    selector: 'admin-promotion-creation',
    templateUrl: './promotion-creation.component.html'
})
export class AdminPromotionCreationComponent implements OnInit {
    private languageSupported: Language[] = [];
    private promotionAdminModel: PromotionAdminModel = new PromotionAdminModel();
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private message: string;
    private isError: boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private promotionAdminService: PromotionAdminService,
        private restaurantAdminService: RestaurantAdminService,
    ) {
    }

    ngOnInit(): void {
        this.onInitPromotion();
        this.onGetAllRestaurantSortByName();
    }

    onInitPromotion = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.promotionAdminModel = <PromotionAdminModel>{
                promotionId: null,
                restaurantId: null,
                endDate: null,
                startDate: null,
                minOrder: null,
                status: 1,
                value: null,
                code: '',
                languageLst: this.languageSupported.map(lang => {
                    return PromotionModule.initTranslator(lang);
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
        this.promotionAdminService.createPromotion(this.promotionAdminModel).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/promotion']);
            },
            error: (err: ApiError) => {
                this.message = err.message;
                this.isError = true;
                this.clientState.isBusy = false;
            },
        });
    }
}
