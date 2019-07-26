import { Component, ViewChild, OnDestroy } from '@angular/core';
import { OwnerOrderModel, OwnerOrderStatus } from '../../../models/order/owner-order.model';
import { ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { ClientState } from '../../../state/client/client-state';
import { OrderOwnerService } from '../../../services/api/order/owner-order.service';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'owner-orders',
  templateUrl: './orders.component.html'
})
export class OwnerOrdersComponent implements OnDestroy {
  private ownerOrderModels: OwnerOrderModel[] = [];
  private ownerOrderStatus: typeof OwnerOrderStatus = OwnerOrderStatus;

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
    private orderOwnerService: OrderOwnerService,
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
    let userId = JwtTokenHelper.GetUserInfo() && JwtTokenHelper.GetUserInfo().userId;
    this.orderOwnerService.getAllOrderByOwner(userId).subscribe(res => {
      if (res.content == null) {
        this.ownerOrderModels = [];
      } else {
        this.ownerOrderModels = res.content.map(item => {
          return <OwnerOrderModel>{ ...item, isDeleted: false }
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
    } else if (value == 5) {
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
