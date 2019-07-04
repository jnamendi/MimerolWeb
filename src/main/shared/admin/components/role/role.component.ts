import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { RoleAdminModel, RoleStatus } from '../../../models/role/admin-role.model';
import { RoleAdminService } from '../../../services/api/role/admin-role.service';
import { I18nService } from '../../../core/i18n.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';
import { Configs } from '../../../common/configs/configs';

@Component({
    selector: 'admin-role',
    templateUrl: './role.component.html'
})
export class AdminRoleComponent implements OnDestroy {
    private roleAdminModels: RoleAdminModel[] = [];
    private isDeletedItems: boolean;
    private paginModel: PagingModel;
    private message: string;
    private isError: boolean;
    private currentPageSize: number = Configs.PageSize;
    private roleStatus: typeof RoleStatus = RoleStatus;
    private isFirstLoad: boolean;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

    private dtOptions: DataTables.Settings = {};
    private dtTrigger: Subject<any> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private roleAdminService: RoleAdminService,
        private i18nService: I18nService
    ) {
        this.isFirstLoad = true;
        this.dtOptions = {
            pageLength: this.currentPageSize,
            columnDefs: [
                { targets: 0, orderable: false },
                { targets: 5, orderable: false }
            ],
            order: [
                [1, "asc"]
            ],
            destroy: true,
        };
    }

    ngOnInit(): void {
        this.onGetRoles();
    }

    onGetRoles = () => {
        this.clientState.isBusy = true;
        this.roleAdminService.getRoles().subscribe(res => {
            if (res.content == null) {
                this.roleAdminModels = [];
            } else {
                this.roleAdminModels = res.content.map(item => {
                    return <RoleAdminModel>{ ...item, isDeleted: false }
                });

                if (this.isFirstLoad) {
                    this.dtTrigger.next();
                    this.isFirstLoad = false;
                }

                this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.destroy();
                    this.dtTrigger.next();
                    dtInstance.columns().every(function () {
                        const that = this;
                        $('input', this.footer()).on('keyup change', function () {
                            if (that.search() !== this['value']) {
                                that.search(this['value']).draw();
                            }
                        });
                    });
                });
            }
            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

    // onPageChanged() {
    //     this.onGetRoles();
    // }

    onChangeDeletedItems = () => {
        this.isDeletedItems = !this.isDeletedItems;
    }

    isSelectdAllItems = () => {
        return !this.roleAdminModels.some(item => !item.isDeleted);
    }

    isSelectedItem = () => {
        return this.roleAdminModels.some(item => item.isDeleted);
    }

    onDeleteItems = () => {
        if (window.confirm('Are you sure want to delete all items have been choosen?')) {
            let deletedIds = this.roleAdminModels.filter(item => item.isDeleted).map(item => {
                return item.roleId;
            });
            if (deletedIds && deletedIds.length > 0) {
                this.clientState.isBusy = true;
                this.roleAdminService.deleteManyRole(deletedIds).subscribe(res => {
                    this.onGetRoles();
                    this.message = "Items have been deleted successfully.";
                    this.clientState.isBusy = false;
                }, (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                    this.clientState.isBusy = false;
                });
            }
        }
    }

    onDeleteItem = (roleId: number) => {
        if (window.confirm('Are you sure want to delete the item has been choosen?')) {
            this.roleAdminService.deleteRole(roleId).subscribe(res => {
                this.onGetRoles();
            }, (err: ApiError) => {
                this.message = err.message;
                this.isError = true;
                this.clientState.isBusy = false;
            });
        }
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
}
