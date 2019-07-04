import { Component, ViewChild } from '@angular/core';
import { OwnerOrderModel, OwnerOrderStatus } from '../../../models/order/owner-order.model';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { RestaurantOwnerModel } from '../../../models/restaurant/owner-restaurant.model';
import { Configs } from '../../../common/configs/configs';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';
import { ClientState } from '../../../state/client/client-state';
import { OrderOwnerService } from '../../../services/api/order/owner-order.service';
import { RestaurantOwnerService } from '../../../services/api/restaurant/owner-restaurant.service';
import { I18nService } from '../../../core/i18n.service';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';

@Component({
  selector: 'owner-pending-charges',
  templateUrl: './pending-charges.component.html'
})
export class OwnerPendingChargesComponent {
  private ownerOrderModels: OwnerOrderModel[] = [];
  private paginModel: PagingModel;
  private restaurantOwnerModels: RestaurantOwnerModel[] = [];
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private message: string;
  private isError: boolean;
  private ownerOrderStatus: typeof OwnerOrderStatus = OwnerOrderStatus;
  private isUpdation: boolean;
  private isDetail: boolean;
  private selectedOrderId: number;
  private selectedOrderCode: string;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private clientState: ClientState,
    private orderOwnerService: OrderOwnerService,
    private restaurantOwnerService: RestaurantOwnerService,
    private i18nService: I18nService,
  ) {
    this.dtOptions = {
      pageLength: this.currentPageSize,
      // columnDefs: [
      //   { targets: 4, orderable: false }
      // ],
      order: [
        [0, "asc"]
      ]
    };
  }

  ngOnInit(): void {
    this.onGetAllOrder();
  }

  onGetAllOrder = () => {
    this.clientState.isBusy = true;
    let userId = JwtTokenHelper.GetUserInfo() && JwtTokenHelper.GetUserInfo().userId;

    this.restaurantOwnerService.getRestaurantByUserId(userId).subscribe(res => {
      if (res.content == null) {
        this.restaurantOwnerModels = [];
      } else {
        this.restaurantOwnerModels = res.content.map(item => {
          return <RestaurantOwnerModel>{ ...item }
        });
        let restaurantId = this.restaurantOwnerModels && this.restaurantOwnerModels[0] && this.restaurantOwnerModels[0].restaurantId;
        this.orderOwnerService.getOrderByRestaurantAndStatus(0, 0, restaurantId).subscribe(res => {
          if (res.content == null) {
            this.ownerOrderModels = [];
          } else {
            this.paginModel = { ...res.content };
            this.ownerOrderModels = res.content.data.map(item => {
              return <OwnerOrderModel>{ ...item, isDeleted: false }
            });

            this.ownerOrderModels = this.ownerOrderModels.filter(x => x.status == 2)
            
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
            });
          }
        });
        this.clientState.isBusy = false;
      }
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
      this.clientState.isBusy = false;
    });
  }

  onOrderDetail = (orderId: number, orderCode: string) => {
    if (this.isDetail) {
      return;
    }
    this.selectedOrderId = orderId;
    this.selectedOrderCode = orderCode;
    this.isDetail = true;
  }

  onSuccess = (isSaveSuccess: boolean) => {
    this.isDetail = false;
    this.selectedOrderId = 0;
    this.selectedOrderCode = '';
    if (isSaveSuccess) {
      this.onGetAllOrder();
    }
  }

}
