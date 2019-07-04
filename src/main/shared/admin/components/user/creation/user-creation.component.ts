import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { UserAdminModel } from '../../../../models/user/admin-user.model';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { Configs } from '../../../../common/configs/configs';
import { ApiError } from '../../../../services/api-response/api-response';

@Component({
    selector: 'admin-user-creation',
    templateUrl: './user-creation.component.html'
})
export class AdminUserCreationComponent implements OnInit {
    private languageSupported: Language[] = [];
    private userAdminModel: UserAdminModel = new UserAdminModel();
    private accountTypes = Configs.AccountTypes;
    private message: string;
    private isError: boolean;
    private error: ApiError;
    private userRoles = Configs.UserRoles;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private userAdminService: UserAdminService,
    ) {
    }

    ngOnInit(): void {
    }

    onSubmit = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.userAdminService.createUser(this.userAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/user']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

}
