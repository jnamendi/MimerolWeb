import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { MenuItemOwnerService } from '../../../services';
import { OwnerMenuItem, ExtraItemStatus } from '../../../models/menu-item/owner-menu-item.model';
import { LanguageList } from '../../../models/langvm.model';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'owner-menu-item',
    templateUrl: './menu-item.component.html'
})
export class OwnerMenuItemComponent implements OnInit, OnDestroy {
    private menuItemOwnerModels: OwnerMenuItem[] = [];
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
        private menuItemOwnerService: MenuItemOwnerService,
        private i18nService: I18nService
    ) {
        this.isFirstLoad = true;
        this.dtOptions = {
            pageLength: this.currentPageSize,
            columnDefs: [
                { targets: 4, orderable: false }
            ],
            order: [
                [0, "asc"]
            ],
            destroy: true,
        };
    }

    ngOnInit(): void {
        this.onGetMenuItems();
    }

    onGetMenuItems = () => {
        this.clientState.isBusy = true;
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        let userId = JwtTokenHelper.GetUserInfo() && JwtTokenHelper.GetUserInfo().userId;
        this.menuItemOwnerService.getMenuItemByOwner(0, 0, languageCode, userId).subscribe(res => {
            if (res.content == null) {
                this.menuItemOwnerModels = [];
            } else {
                this.paginModel = { ...res.content };
                this.menuItemOwnerModels = res.content.data.map(item => {
                    return <OwnerMenuItem>{ ...item, isDeleted: false }
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

    // onPageChanged(pageIndex: number = 1) {
    //     if (pageIndex < 0)
    //         return;
    //     this.currentPageIndex = pageIndex;
    //     this.onGetMenuItems(pageIndex);
    // }

    onChangeDeletedItems = () => {
        this.isDeletedItems = !this.isDeletedItems;
        this.menuItemOwnerModels.map(item => {
            item.isDeleted = this.isDeletedItems;
        })
    }

    isSelectdAllItems = () => {
        return !this.menuItemOwnerModels.some(item => !item.isDeleted);
    }

    isSelectedItem = () => {
        return this.menuItemOwnerModels.some(item => item.isDeleted);
    }

    onDeleteItems = () => {
        if (window.confirm('Are you sure want to delete all items have been choosen?')) {
            let deletedIds = this.menuItemOwnerModels.filter(item => item.isDeleted).map(item => {
                return item.menuId;
            });
            if (deletedIds && deletedIds.length > 0) {
                this.clientState.isBusy = true;
                this.menuItemOwnerService.deleteManyMenuItem(deletedIds).subscribe(res => {
                    this.onGetMenuItems();
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

    onDeleteItem = (menuId: number) => {
        if (window.confirm('Are you sure want to delete all items have been choosen?')) {
            this.menuItemOwnerService.deleteMenuItem(menuId).subscribe(res => {
                this.onGetMenuItems();
            }, (err: ApiError) => {
                this.message = err.message;
                this.isError = true;
                this.clientState.isBusy = false;
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
