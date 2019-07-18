import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { MenuAdminModel, MenuStatus } from '../../../models/menu/admin-menu.model';
import { MenuAdminService } from '../../../services/api/menu/admin-menu.service';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'admin-menu',
    templateUrl: './menu.component.html'
})
export class AdminMenuComponent implements OnDestroy {
    private menuAdminModels: MenuAdminModel[] = [];
    private isDeletedItems: boolean;
    private paginModel: PagingModel;
    private message: string;
    private isError: boolean;
    private currentPageIndex: number = Configs.PageIndex;
    private currentPageSize: number = Configs.PageSize;
    private menuStatus: typeof MenuStatus = MenuStatus;
    private isFirstLoad: boolean;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

    private dtOptions: DataTables.Settings = {};
    private dtTrigger: Subject<any> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private menuAdminService: MenuAdminService,
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
        this.onGetMenus();
    }

    onGetMenus = () => {
        this.clientState.isBusy = true;
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        this.menuAdminService.getMenus(0, 0, languageCode).subscribe(res => {
            if (res.content == null) {
                this.menuAdminModels = [];
                this.paginModel = { ...res.content };
            } else {
                this.paginModel = { ...res.content };
                this.menuAdminModels = res.content.data.map(item => {
                    return <MenuAdminModel>{ ...item, isDeleted: false }
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

    onChangeDeletedItems = () => {
        this.isDeletedItems = !this.isDeletedItems;
    }

    isSelectdAllItems = () => {
        return !this.menuAdminModels.some(item => !item.isDeleted);
    }

    isSelectedItem = () => {
        return this.menuAdminModels.some(item => item.isDeleted);
    }

    onDeleteItems = () => {
        if (window.confirm('Are you sure want to delete all items have been choosen?')) {
            let deletedIds = this.menuAdminModels.filter(item => item.isDeleted).map(item => {
                return item.menuId;
            });
            if (deletedIds && deletedIds.length > 0) {
                this.clientState.isBusy = true;

                this.menuAdminService.deleteManyMenu(deletedIds).subscribe({
                    complete: () => {
                        this.onGetMenus();
                        this.message = "Items have been deleted successfully.";
                        this.clientState.isBusy = false;
                    },
                    error: (err: ApiError) => {
                        this.message = err.message;
                        this.isError = true;
                        this.clientState.isBusy = false;
                    },
                });
            }
        }
    }

    onDeleteItem = (menuId: number) => {
        if (window.confirm('Are you sure want to delete the item has been choosen?')) {

            this.menuAdminService.deleteMenu(menuId).subscribe({
                complete: () => {
                    this.onGetMenus();
                },
                error: (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                    this.clientState.isBusy = false;
                },
            });
        }
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
}
