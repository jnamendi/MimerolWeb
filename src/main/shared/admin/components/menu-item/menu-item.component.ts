import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { MenuItemAdminService } from '../../../services';
import { AdminMenuItem, ExtraItemStatus } from '../../../models/menu-item/admin-menu-item.model';
import { LanguageList } from '../../../models/langvm.model';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'admin-menu-item',
    templateUrl: './menu-item.component.html'
})
export class AdminMenuItemComponent implements OnDestroy {
    private menuItemAdminModels: AdminMenuItem[] = [];
    private isDeletedItems: boolean;
    private paginModel: PagingModel;
    private message: string;
    private isError: boolean;
    private currentPageIndex: number = Configs.PageIndex;
    private currentPageSize: number = Configs.PageSize;
    private extraItemStatus: typeof ExtraItemStatus = ExtraItemStatus;
    private isFirstLoad: boolean;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

    private dtOptions: DataTables.Settings = {};
    private dtTrigger: Subject<any> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private menuItemAdminService: MenuItemAdminService,
        private i18nService: I18nService
    ) {
        this.isFirstLoad = true;
        this.dtOptions = {
            pageLength: this.currentPageSize,
            columnDefs: [
                { targets: 0, orderable: false },
                { targets: 4, orderable: false }
            ],
            order: [
                [1, "asc"]
            ],
            destroy: true,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                // Unbind first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)
                $('td', row).unbind('click');
                $('td', row).bind('click', () => {
                    self.onGetData(data);
                });
                return row;
            }
        };
    }

    ngOnInit(): void {
        this.onGetMenuItems();
    }

    onGetData = (data: any) => {
        // console.log(data)
    }

    onGetMenuItems = () => {
        this.clientState.isBusy = true;
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        this.menuItemAdminService.getMenuItems(0, 0, languageCode).subscribe(res => {
            if (res.content == null) {
                this.menuItemAdminModels = [];
                this.paginModel = { ...res.content };
            } else {
                this.paginModel = { ...res.content };
                this.menuItemAdminModels = res.content.data.map(item => {
                    return <AdminMenuItem>{ ...item, isDeleted: false }
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
        return !this.menuItemAdminModels.some(item => !item.isDeleted);
    }

    isSelectedItem = () => {
        return this.menuItemAdminModels.some(item => item.isDeleted);
    }

    onDeleteItems = () => {
        if (window.confirm('Are you sure want to delete all items have been choosen?')) {
            let deletedIds = this.menuItemAdminModels.filter(item => item.isDeleted).map(item => {
                return item.menuId;
            });
            if (deletedIds && deletedIds.length > 0) {
                this.clientState.isBusy = true;

                this.menuItemAdminService.deleteManyMenuItem(deletedIds).subscribe({
                    complete: () => {
                        this.onGetMenuItems();
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
            this.menuItemAdminService.deleteMenuItem(menuId).subscribe({
                complete: () => {
                    this.onGetMenuItems();
                },
                error: (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                    this.clientState.isBusy = false;
                },
            });
        }
    }

    onGetCurrentLanguageLst = (languageLst: LanguageList[]): LanguageList => {
        return languageLst.find(l => l.code == this.i18nService.getCurrentLanguageCode());
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
}
