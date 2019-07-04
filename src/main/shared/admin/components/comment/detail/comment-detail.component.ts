import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { CommentAdminModel } from '../../../../models/comment/admin-comment.model';
import { CommentAdminService } from '../../../../services/api/comment/admin-comment.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';
import { UserAdminModel } from '../../../../models/user/admin-user.model';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';

@Component({
    selector: 'admin-comment-detail',
    templateUrl: './comment-detail.component.html'
})
export class AdminCommentDetailComponent implements OnInit, OnDestroy {
    private sub: any;
    private resCommentId: number;
    private commentAdminModel: CommentAdminModel = new CommentAdminModel();
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private userAdminModels: UserAdminModel[] = [];
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private commentAdminService: CommentAdminService,
        private languageService: LanguageService,
        private restaurantAdminService: RestaurantAdminService,
        private userAdminService: UserAdminService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.resCommentId = +params['id'];
            if (this.resCommentId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetComment(this.resCommentId);
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

    onGetComment = (resCommentId: number) => {
        this.commentAdminService.getComment(resCommentId).subscribe(res => {
            let commentModelFromRes = <CommentAdminModel>{ ...res.content };
            this.commentAdminModel = {
                ...commentModelFromRes
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

    onUpdateComment = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.commentAdminService.updateComment(this.commentAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/comment']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    onDeleteComment = () => {
        this.clientState.isBusy = true;
        this.commentAdminService.deleteComment(+this.commentAdminModel.resCommentId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/comment']);
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
