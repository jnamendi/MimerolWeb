import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { RoleAdminModel } from '../../../../models/role/admin-role.model';
import { RoleAdminService } from '../../../../services/api/role/admin-role.service';
import { LanguageService } from '../../../../services/api/language/language.service';

@Component({
    selector: 'admin-role-detail',
    templateUrl: './role-detail.component.html'
})
export class AdminRoleDetailComponent {
    private sub: any;
    private roleId: number;
    private roleAdminModel: RoleAdminModel = new RoleAdminModel();
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private roleAdminService: RoleAdminService,
        private languageService: LanguageService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.roleId = +params['id'];
            if (this.roleId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetRole(this.roleId);
                }, (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                });
            }
        });
    }

    ngOnInit(): void {
    }

    onGetRole = (roleId: number) => {
        this.roleAdminService.getRole(roleId).subscribe(res => {
            let roleModelFromRes = <RoleAdminModel>{ ...res.content };
            this.roleAdminModel = {
                ...roleModelFromRes
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        })
    }

    onUpdateRole = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.roleAdminService.updateRole(this.roleAdminModel).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/role']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
    }

    onDeleteRole = () => {
        this.clientState.isBusy = true;
        this.roleAdminService.deleteRole(+this.roleAdminModel.roleId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/role']);
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
