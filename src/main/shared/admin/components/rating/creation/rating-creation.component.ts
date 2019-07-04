import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { ApiError } from '../../../../services/api-response/api-response';
import { RatingAdminModel } from '../../../../models/rating/admin-rating.model';
import { RatingAdminService } from '../../../../services/api/rating/admin-rating.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { UserAdminModel } from '../../../../models/user/admin-user.model';

@Component({
    selector: 'admin-rating-creation',
    templateUrl: './rating-creation.component.html'
})
export class AdminRatingCreationComponent {
    private languageSupported: Language[] = [];
    private ratingAdminModel: RatingAdminModel = new RatingAdminModel();
    private userAdminModels: UserAdminModel[] = [];
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private message: string;
    private isError: boolean;
    constructor(
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private ratingAdminService: RatingAdminService,
        private restaurantAdminService: RestaurantAdminService,
        private userAdminService: UserAdminService,
    ) {
    }

    ngOnInit(): void {
        this.onInitRating();
        this.onGetAllUserSortByName();
        this.onGetAllRestaurantSortByName();
    }

    onInitRating = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.ratingAdminModel = <RatingAdminModel>{
                userId: null,
                restaurantId: null,
                comment: '',
                delivery: 1,
                quality: 1,
                status: 1
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
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

    onSubmit = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.ratingAdminService.createRating(this.ratingAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/rating']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }
}
