import { Component, ViewChild, OnDestroy } from '@angular/core';
import { AdminOrderModel, AdminOrderStatus } from '../../../models/order/admin-order.model';
import { ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { ClientState } from '../../../state/client/client-state';
import { OrderAdminService } from '../../../services/api/order/admin-order.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'admin-orders',
    templateUrl: './orders.component.html'
})
export class AdminOrdersComponent implements OnDestroy {
    private adminOrderModels: AdminOrderModel[] = [];
    private adminOrderStatus: typeof AdminOrderStatus = AdminOrderStatus;

    private currentPageSize: number = Configs.PageSize;
    private selectedOrderId: number;
    private selectedOrderCode: string;
    private isUpdation: boolean;
    private isFirstLoad: boolean;
    private currencySymbol: string = Configs.SpainCurrency.symbol;
    private message: string;
    private isError: boolean;

    @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

    private dtOptions: DataTables.Settings = {};
    private dtTrigger: Subject<any> = new Subject();

    constructor(
        private clientState: ClientState,
        private orderAdminService: OrderAdminService,
    ) {
        this.isFirstLoad = true;
        this.dtOptions = {
            pageLength: this.currentPageSize,
            // columnDefs: [
            //   { targets: 4, orderable: false }
            // ],
            order: [
                [0, "asc"]
            ],
            destroy: true,
        };
    }

    ngOnInit(): void {
        this.onGetAllOrder();
    }

    onGetAllOrder = () => {
        this.clientState.isBusy = true;
        this.orderAdminService.getAllOrder().subscribe(res => {
            if (res.content == null) {
                this.adminOrderModels = [];
            } else {
                this.adminOrderModels = res.content.map(item => {
                    return <AdminOrderModel>{ ...item, isDeleted: false }
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
        })
    }

    onGetOrderDetail = (orderId: number, orderCode: string) => {
        if (this.isUpdation) {
            return;
        }
        this.selectedOrderId = orderId;
        this.selectedOrderCode = orderCode;
        this.isUpdation = true;
    }

    onSuccess = (isSaveSuccess: boolean) => {
        this.isUpdation = false;
        this.selectedOrderId = 0;
        this.selectedOrderCode = '';
        if (isSaveSuccess) {
            this.onGetAllOrder();
        }
    }

    styleClass = (value: number) => {
        let style = '';
        if (value == 1) {
            style = 'label label-primary'
        } else if (value == 2) {
            style = 'label label-info'
        } else if (value == 3) {
            style = 'label label-warning'
        } else if (value == 5 || value == 4) {
            style = 'label label-danger'
        } else if (value == 7) {
            style = 'label label-success'
        }
        return style;
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
}
