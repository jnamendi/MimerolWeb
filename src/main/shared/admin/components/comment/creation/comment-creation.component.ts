import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { CommentAdminModel } from '../../../../models/comment/admin-comment.model';
import { CommentAdminService } from '../../../../services/api/comment/admin-comment.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { ApiError } from '../../../../services/api-response/api-response';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { UserAdminModel } from '../../../../models/user/admin-user.model';
import { RestaurantAdminModel } from '../../../../models/restaurant/admin-restaurant.model';

@Component({
    selector: 'admin-comment-creation',
    templateUrl: './comment-creation.component.html'
})
export class AdminCommentCreationComponent implements OnInit {
    private languageSupported: Language[] = [];
    private commentAdminModel: CommentAdminModel = new CommentAdminModel();
    private userAdminModels: UserAdminModel[] = [];
    private restaurantAdminModels: RestaurantAdminModel[] = [];
    private message: string;
    private isError: boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private commentAdminService: CommentAdminService,
        private restaurantAdminService: RestaurantAdminService,
        private userAdminService: UserAdminService,
    ) {
    }

    ngOnInit(): void {
        this.onInitComment();
        this.onGetAllUserSortByName();
        this.onGetAllRestaurantSortByName();
    }

    onInitComment = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.commentAdminModel = <CommentAdminModel>{
                description: '',
                resCommentId: null,
                restaurantId: null,
                starPerMark: 1,
                starQuality: 1,
                starShip: 1,
                status: 1,
                title: '',
                userId: null
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
        this.commentAdminService.createComment(this.commentAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/comment']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }
}
