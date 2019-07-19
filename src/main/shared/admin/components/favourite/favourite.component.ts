import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavouriteAdminService } from '../../../services';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { FavouriteAdminModel, FavouriteAdminStatus } from '../../../models/favourite/admin-favourite.model';
import { Configs } from '../../../common/configs/configs';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';
import { I18nService } from '../../../core/i18n.service';

@Component({
    selector: 'admin-favourite',
    templateUrl: './favourite.component.html'
})

export class AdminFavouriteComponent implements OnInit {
    private favouriteAdminModels: FavouriteAdminModel[] = [];
    private paginModel: PagingModel;
    private message: string;
    private isError: boolean;
    private currentPageIndex: number = Configs.PageIndex;
    private currentPageSize: number = Configs.PageSize;
    private favouriteAdminStatus: typeof FavouriteAdminStatus = FavouriteAdminStatus;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

    private dtOptions: DataTables.Settings = {};
    private dtTrigger: Subject<any> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private favouriteService: FavouriteAdminService,
        private i18nService: I18nService,
    ) {
        this.dtOptions = {
            pageLength: this.currentPageSize,
            order: [
                [0, "asc"]
            ]
        };
    }

    ngOnInit(): void {
        this.onGetFavourites();
    }

    onGetFavourites = () => {
        this.clientState.isBusy = true;
        this.favouriteService.getFavourites(0, 0).subscribe(res => {
            if (res.content == null) {
                this.favouriteAdminModels = [];
                this.paginModel = { ...res.content };
            } else {
                this.paginModel = { ...res.content };
                this.favouriteAdminModels = res.content.data.map(item => {
                    return <FavouriteAdminModel>{ ...item, isDeleted: false }
                });
                this.dtTrigger.next();
                this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.columns().every(function () {
                        const that = this;
                        $('input', this.footer()).on('keyup change', function () {
                            if (that.search() !== this['value']) {
                                that
                                    .search(this['value'])
                                    .draw();
                            }
                        });
                    });
                }
                );
            }
            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }
}
