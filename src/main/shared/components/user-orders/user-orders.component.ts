import { Component } from '@angular/core';
import { OrderModel } from '../../models/order/order.model';
import { JwtTokenHelper } from '../../common/jwt-token-helper/jwt-token-helper';
import { OrderService } from '../../services/api/order/order.service';
import { ApiError } from '../../services/api-response/api-response';
import { ClientState } from '../../state/client/client-state';
import { Configs } from '../../common/configs/configs';

@Component({
  selector: 'page-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent {
  private orderModel: OrderModel[] = [];
  private isError: boolean;
  private error: string;
  private statusError: number = 0;
  private currencySymbol: string = Configs.SpainCurrency.symbol;
  private isDetail: boolean;
  private selectedOrderId: number;
  private selectedOrderCode: string;

  constructor(
    private orderService: OrderService,
    private clientState: ClientState,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.onLoadOrders();
  }

  onLoadOrders = () => {
    let userId = JwtTokenHelper.GetUserInfo().userId;
    this.orderService.getOrderByUserId(userId).subscribe(
      res => {
        if (res.content == null) {
          this.orderModel = [];
        } else {
          this.orderModel = res.content.map((item, index) => {
            return <OrderModel>{ ...item };
          });
        }
      }, (err: ApiError) => {
        this.error = err.message;
        this.isError = true;
        this.statusError = err.status;
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
      this.onLoadOrders();
    }
  }
}
