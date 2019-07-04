import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { AddressAdminModel } from '../../../models/address/admin-address.model';
import { AddressAdminService } from '../../../services/api/address/admin-address.service';
import { Configs } from '../../../common/configs/configs';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'admin-address',
    templateUrl: './address.component.html'
})
export class AdminAddressComponent {
    private addressAdminModels: AddressAdminModel[] = [];
    private isDeletedItems: boolean;
    private paginModel: PagingModel;
    private message: string;
    private isError: boolean;
    private currentPageIndex: number = Configs.PageIndex;
    private currentPageSize: number = Configs.PageSize;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

    private dtOptions: DataTables.Settings = {};
    private dtTrigger: Subject<any> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private addressAdminService: AddressAdminService,
    ) {
        this.dtOptions = {
            pageLength: this.currentPageSize,
            // columnDefs: [
            //     { targets: 4, orderable: false }
            // ],
            order: [
                [0, "asc"]
            ]
        };
    }

    ngOnInit(): void {
        this.onGetAddresss();
    }

    onGetAddresss = () => {
        this.clientState.isBusy = true;
        this.addressAdminService.getAddresses(0, 0).subscribe(res => {
            if (res.content == null) {
                this.addressAdminModels = [];
                this.paginModel = { ...res.content };
            } else {
                this.paginModel = { ...res.content };
                this.addressAdminModels = res.content.data.map(item => {
                    return <AddressAdminModel>{ ...item, isDeleted: false }
                });
                this.dtTrigger.next();
                this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.columns().every(function () {
                        const that = this;
                        $('input', this.footer()).on('keyup change', function () {
                            if (that.search() !== this['value']) {
                                that.search(this['value']).draw();
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

    // onPageChanged(pageIndex: number = 1) {
    //     if (pageIndex < 0)
    //         return;
    //     this.currentPageIndex = pageIndex;
    //     this.onGetAddresss(pageIndex);
    // }

    // onChangeDeletedItems = () => {
    //     this.isDeletedItems = !this.isDeletedItems;
    //     this.addressAdminModels.map(item => {
    //         item.isDeleted = this.isDeletedItems;
    //     })
    // }

    // isSelectdAllItems = () => {
    //     return !this.addressAdminModels.some(item => !item.isDeleted);
    // }

    // isSelectedItem = () => {
    //     return this.addressAdminModels.some(item => item.isDeleted);
    // }
}
