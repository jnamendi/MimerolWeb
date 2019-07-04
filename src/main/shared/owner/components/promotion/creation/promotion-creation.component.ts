import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { PromotionOwnerModel, PromotionModule } from '../../../../models/promotion/owner-promotion.model';
import { PromotionOwnerService } from '../../../../services/api/promotion/owner-promotion.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { ApiError } from '../../../../services/api-response/api-response';
import { RestaurantOwnerService } from '../../../../services/api/restaurant/owner-restaurant.service';
import { RestaurantOwnerModel } from '../../../../models/restaurant/owner-restaurant.model';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';

@Component({
    selector: 'owner-promotion-creation',
    templateUrl: './promotion-creation.component.html'
})
export class OwnerPromotionCreationComponent {
    private languageSupported: Language[] = [];
    private promotionOwnerModel: PromotionOwnerModel = new PromotionOwnerModel();
    private restaurantOwnerModel: RestaurantOwnerModel[] = [];
    private message: string;
    private isError: boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private promotionOwnerService: PromotionOwnerService,
        private restaurantOwnerService: RestaurantOwnerService,
    ) {
    }

    ngOnInit(): void {
        this.onInitPromotion();
        this.onGetRestaurantByOwner();
    }

    onInitPromotion = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.promotionOwnerModel = <PromotionOwnerModel>{
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
        this.promotionOwnerService.createPromotion(this.promotionOwnerModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/promotion']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }
}
