import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantCommentOwnerModel, RestaurantCommentStatus } from '../../../../models/restaurant-comment/owner-restaurant-comment.model';
import { RestaurantCommentOwnerService } from '../../../../services/api/restaurant-comment/owner-restaurant-comment.service';
import { RestaurantOwnerService } from '../../../../services/api/restaurant/owner-restaurant.service';
import { RestaurantOwnerModel } from '../../../../models/restaurant/owner-restaurant.model';
import { UserOwnerModel } from '../../../../models/user/owner-user.model';
import { UserOwnerService } from '../../../../services/api/user/owner-user.service';
@Component({
    selector: 'owner-comment-detail',
    templateUrl: './comment-detail.component.html',
})
export class OwnerCommentDetailComponent implements OnInit, OnDestroy {
    private sub: any;
    private resCommentId: number;
    private restaurantCommentOwnerModel: RestaurantCommentOwnerModel = new RestaurantCommentOwnerModel();
    private restaurantOwnerModel: RestaurantOwnerModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];
    private userOwnerModel: UserOwnerModel[] = [];

    constructor(
        private clientState: ClientState,
        private restaurantCommentOwnerService: RestaurantCommentOwnerService,
        private restaurantOwnerService: RestaurantOwnerService,
        private route: ActivatedRoute,
        private router: Router,
        private languageService: LanguageService,
        private userOwnerService: UserOwnerService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.resCommentId = +params['id'];
            if (this.resCommentId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetCommentDetail(this.resCommentId);
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
    onGetCommentDetail = (resCommentId: number) => {
        this.restaurantCommentOwnerService.getComment(resCommentId).subscribe(res => {
            let commentModelFromRes = <RestaurantCommentOwnerModel>{ ...res.content };
            this.restaurantCommentOwnerModel = {
                ...commentModelFromRes
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        })
    }

    onGetAllRestaurantSortByName = () => {
        this.restaurantOwnerService.getAllRestaurantSortByName().subscribe(res => {
            if (res == null) {
                this.restaurantOwnerModel = []
            } else {
                this.restaurantOwnerModel = <RestaurantOwnerModel[]>[...res.content]
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }
    onGetAllUserSortByName = () => {
        this.userOwnerService.getAllUserSortByName().subscribe(res => {
            if (res == null) {
                this.userOwnerModel = []
            } else {
                this.userOwnerModel = <UserOwnerModel[]>[...res.content]
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }
    onUpdateComment = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.restaurantCommentOwnerService.updateComment(this.restaurantCommentOwnerModel).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['owner/comments']);
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
