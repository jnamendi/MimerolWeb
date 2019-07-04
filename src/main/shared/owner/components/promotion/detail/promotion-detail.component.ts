import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { PromotionOwnerModel, PromotionModule } from '../../../../models/promotion/owner-promotion.model';
import { PromotionOwnerService } from '../../../../services/api/promotion/owner-promotion.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantOwnerModel } from '../../../../models/restaurant/owner-restaurant.model';
import { RestaurantOwnerService } from '../../../../services/api/restaurant/owner-restaurant.service';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';

@Component({
    selector: 'owner-promotion-detail',
    templateUrl: './promotion-detail.component.html'
})
export class OwnerPromotionDetailComponent implements OnInit, OnDestroy {
    private sub: any;
    private promotionId: number;
    private promotionOwnerModel: PromotionOwnerModel = new PromotionOwnerModel();
    private restaurantOwnerModel: RestaurantOwnerModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private promotionOwnerService: PromotionOwnerService,
        private languageService: LanguageService,
        private restaurantOwnerService: RestaurantOwnerService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.promotionId = +params['id'];
            if (this.promotionId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetPromotion(this.promotionId);
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

    onGetPromotion = (promotionId: number) => {
        this.promotionOwnerService.getPromotion(promotionId).subscribe(res => {
            let promotionModelFromRes = <PromotionOwnerModel>{ ...res.content };
            if (promotionModelFromRes.languageLst) {
                promotionModelFromRes.languageLst.map(l => {
                    l.contentDef && l.contentDef.map(c => {
                        if (c.code) {
                            switch (c.code) {
                                case "promotion_name":
                                    c.label = "Promotion name";
                                    c.inputType = "input";
                                    break;
                                case "promotion_desc":
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
            
            promotionModelFromRes.startDate = new Date(promotionModelFromRes.startDate);
            promotionModelFromRes.endDate = new Date(promotionModelFromRes.endDate);

            this.promotionOwnerModel = {
                ...promotionModelFromRes,
                languageLst: promotionModelFromRes.languageLst || this.languageSupported.map(lang => {
                    return PromotionModule.initTranslator(lang);
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

    onUpdatePromotion = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.promotionOwnerService.updatePromotion(this.promotionOwnerModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/promotion']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    onDeletePromotion = () => {
        this.clientState.isBusy = true;
        this.promotionOwnerService.deletePromotion(+this.promotionOwnerModel.promotionId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['owner/promotion']);
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
