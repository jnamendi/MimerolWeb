import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { UserAdminModel } from '../../../../models/user/admin-user.model';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { Configs } from '../../../../common/configs/configs';

@Component({
    selector: 'admin-user-detail',
    templateUrl: './user-detail.component.html'
})
export class AdminUserDetailComponent implements OnInit, OnDestroy {
    private sub: any;
    private userId: number;
    private userAdminModel: UserAdminModel = new UserAdminModel();
    private message: string;
    private isError: boolean;
    private error: ApiError;
    private languageSupported: Language[] = [];
    private accountTypes = Configs.AccountTypes;
    private userRoles = Configs.UserRoles;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private userAdminService: UserAdminService,
        private languageService: LanguageService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.userId = +params['id'];
            if (this.userId >= 0) {
                this.onGetUser(this.userId);
            }
        });
    }

    ngOnInit(): void {
    }

    onGetUser = (userId: number) => {
        this.userAdminService.getUser(userId).subscribe(res => {
            let userModelFromRes = <UserAdminModel>{ ...res.content };
            this.userAdminModel = {
                ...userModelFromRes
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.error = err;
        })
    }

    onUpdateUser = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.userAdminService.updateUser(this.userAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/user']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
            this.error = err;
        })
    }

    onDeleteUser = () => {
        this.clientState.isBusy = true;
        this.userAdminService.deleteUser(+this.userAdminModel.userId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/user']);
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
