import { Component } from '@angular/core';
import { FavouriteModel } from '../../models/favourite/favourite.model';
import { FavouriteService } from '../../services/api/favourite/favourite.service';
import { JwtTokenHelper } from '../../common/jwt-token-helper/jwt-token-helper';
import { ApiError } from '../../services/api-response/api-response';
import { ClientState } from '../../state/client/client-state';
import { OrderService } from '../../services/api/order/order.service';
import { OrderModel } from '../../models/order/order.model';

@Component({
  selector: 'page-user-start',
  templateUrl: './user-start.component.html',
  styleUrls: ['./user-start.component.scss']
})
export class UserStartComponent {
  private favouriteModel: FavouriteModel[] = [];
  private orderModel: OrderModel[] = [];
  private isError: boolean;
  private error: string;
  private statusError: number = 0;
  private isDetail: boolean;
  private selectedOrderId: number;
  private selectedOrderCode: string;

  constructor(
    private favouriteService: FavouriteService,
    private clientState: ClientState,
    private orderService: OrderService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.onLoadFavourites();
    this.onLoadOrders();
  }

  onLoadFavourites = () => {
    let userId = JwtTokenHelper.GetUserInfo().userId;
    this.favouriteService.getFavouriteByUserId(userId).subscribe(
      res => {
        if (res.content == null) {
          this.favouriteModel = [];
        } else {
          this.favouriteModel = res.content.map((item, index) => {
            return <FavouriteModel>{ ...item };
          });
        }
      }, (err: ApiError) => {
        this.error = err.message;
        this.isError = true;
        this.statusError = err.status;
      });
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
