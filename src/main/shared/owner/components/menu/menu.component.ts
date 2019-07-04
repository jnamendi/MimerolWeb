import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { MenuOwnerModel, MenuOwnerStatus } from '../../../models/menu/owner-menu.model';
import { MenuOwnerService } from '../../../services/api/menu/owner-menu.service';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'owner-menu',
    templateUrl: './menu.component.html'
})
export class OwnerMenuComponent implements OnInit, OnDestroy {
    private menuOwnerModel: MenuOwnerModel[] = [];
    private isDeletedItems: boolean;
    private paginModel: PagingModel;
    private message: string;
    private isError: boolean;
    private currentPageIndex: number = Configs.PageIndex;
    private currentPageSize: number = Configs.PageSize;
    private menuOwnerStatus: typeof MenuOwnerStatus = MenuOwnerStatus;
    private isFirstLoad: boolean;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

    private dtOptions: DataTables.Settings = {};
    private dtTrigger: Subject<any> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private menuOwnerService: MenuOwnerService,
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
        this.onGetOwnerMenus();
    }

    onGetOwnerMenus = () => {
        this.clientState.isBusy = true;
        let userId = JwtTokenHelper.GetUserInfo().userId;
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        this.menuOwnerService.getMenusByOwner(0, 0, userId, languageCode).subscribe(res => {
            if (res.content == null) {
                this.menuOwnerModel = [];
                this.paginModel = { ...res.content };
            } else {
                this.paginModel = { ...res.content };
                this.menuOwnerModel = res.content.data.map(item => {
                    return <MenuOwnerModel>{ ...item, isDeleted: false }
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
        this.menuOwnerModel.map(item => {
            item.isDeleted = this.isDeletedItems;
        })
    }

    isSelectdAllItems = () => {
        return !this.menuOwnerModel.some(item => !item.isDeleted);
    }

    isSelectedItem = () => {
        return this.menuOwnerModel.some(item => item.isDeleted);
    }

    onDeleteItems = () => {
        if (window.confirm('Are you sure want to delete all items have been choosen?')) {
            let deletedIds = this.menuOwnerModel.filter(item => item.isDeleted).map(item => {
                return item.menuId;
            });
            if (deletedIds && deletedIds.length > 0) {
                this.clientState.isBusy = true;
                this.menuOwnerService.deleteManyMenu(deletedIds).subscribe(res => {
                    this.onGetOwnerMenus();
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
            this.menuOwnerService.deleteMenu(menuId).subscribe(res => {
                this.onGetOwnerMenus();
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
