import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { PromotionAdminModel, PromotionModule } from '../../../../models/promotion/admin-promotion.model';
import { PromotionAdminService } from '../../../../services/api/promotion/admin-promotion.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';

@Component({
    selector: 'admin-promotion-detail',
    templateUrl: './promotion-detail.component.html'
})
export class AdminPromotionDetailComponent implements OnInit, OnDestroy {
    private sub: any;
    private promotionId: number;
    private promotionAdminModel: PromotionAdminModel = new PromotionAdminModel();
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private promotionAdminService: PromotionAdminService,
        private languageService: LanguageService,
        private restaurantAdminService: RestaurantAdminService,
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
        this.onGetAllRestaurantSortByName();
    }

    onGetPromotion = (promotionId: number) => {
        this.promotionAdminService.getPromotion(promotionId).subscribe(res => {
            let promotionModelFromRes = <PromotionAdminModel>{ ...res.content };
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

            this.promotionAdminModel = {
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

    onUpdatePromotion = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.promotionAdminService.updatePromotion(this.promotionAdminModel).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/promotion']);
            },
            error: (err: ApiError) => {
                this.clientState.isBusy = false;
                this.message = err.message;
                this.isError = true;
            },
        });
    }

    onDeletePromotion = () => {
        this.clientState.isBusy = true;
        this.promotionAdminService.deletePromotion(+this.promotionAdminModel.promotionId).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/promotion']);
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
}
