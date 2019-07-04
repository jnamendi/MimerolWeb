import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { RatingAdminModel } from '../../../../models/rating/admin-rating.model';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { RatingAdminService } from '../../../../services/api/rating/admin-rating.service';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { UserAdminModel } from '../../../../models/user/admin-user.model';

@Component({
    selector: 'admin-rating-detail',
    templateUrl: './rating-detail.component.html'
})
export class AdminRatingDetailComponent {
    private sub: any;
    private ratingId: number;
    private ratingAdminModel: RatingAdminModel = new RatingAdminModel();
    private languageSupported: Language[] = [];
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private userAdminModels: UserAdminModel[] = [];
    private message: string;
    private isError: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private ratingAdminService: RatingAdminService,
        private restaurantAdminService: RestaurantAdminService,
        private languageService: LanguageService,
        private userAdminService: UserAdminService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.ratingId = +params['id'];
            if (this.ratingId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetRating(this.ratingId);
                }, (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                });
            }
        });
    }

    ngOnInit(): void {
        this.onGetAllUserSortByName();
        this.onGetAllRestaurantSortByName();
    }

    onGetRating = (ratingId: number) => {
        this.ratingAdminService.getRating(ratingId).subscribe(res => {
            let ratingModelFromRes = <RatingAdminModel>{ ...res.content };
            this.ratingAdminModel = {
                ...ratingModelFromRes
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        })
    }

    onGetAllUserSortByName = () => {
        this.userAdminService.getAllUserSortByName().subscribe(res => {
            if (res.content == null) {
                this.userAdminModels = [];
            } else {
                this.userAdminModels = <UserAdminModel[]>[...res.content]
            }
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

    onUpdateRating = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.ratingAdminService.updateRating(this.ratingAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/rating']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    onDeleteRating = () => {
        this.clientState.isBusy = true;
        this.ratingAdminService.deleteRating(+this.ratingAdminModel.ratingId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/rating']);
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
