import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { ApiError } from '../../../../services/api-response/api-response';
import { RoleAdminModel } from '../../../../models/role/admin-role.model';
import { RoleAdminService } from '../../../../services/api/role/admin-role.service';
import { LanguageService } from '../../../../services/api/language/language.service';

@Component({
    selector: 'admin-role-creation',
    templateUrl: './role-creation.component.html'
})
export class AdminRoleCreationComponent {
    private languageSupported: Language[] = [];
    private roleAdminModel: RoleAdminModel = new RoleAdminModel();
    private message: string;
    private isError: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private roleAdminService: RoleAdminService,
    ) {
    }

    ngOnInit(): void {
        this.onInitRole();
    }

    onInitRole = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.roleAdminModel = <RoleAdminModel>{
                roleId: null,
                name: '',
                code: '',
                status: 1
            };
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
        this.roleAdminService.createRole(this.roleAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/role']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }
}
