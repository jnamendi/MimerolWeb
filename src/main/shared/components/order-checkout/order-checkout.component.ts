import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../core';
import { OrderCheckoutModel } from '../../models/order/order.model';
import { LatLongModel } from '../../models';
import { Subscription } from 'rxjs';
import { ClientState } from '../../state';
import { OrderService } from '../../services';
import { ApiError } from '../../services/api-response/api-response';
import { ApiUrl } from '../../services/api-url/api-url';

@Component({
  selector: 'page-order-checkout',
  templateUrl: './order-checkout.component.html',
  styleUrls: ['./order-checkout.component.scss']
})
export class OrderCheckoutComponent implements OnInit {
  private isConfirmOder: boolean;
  public currentPosition: LatLongModel;
  private sub: Subscription;
  private sub2: Subscription;

  private orderId: number;
  private orderCode: string;

  private orderCheckedOutModel: OrderCheckoutModel = new OrderCheckoutModel();

  private icon: Object = {};

  // = {
  //   url: 'assets/images/menu-image3.jpg',
  //   scaledSize: {
  //     width: 80,
  //     height: 80,
  //     backgroundSize: 'contain'
  //   }
  // }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private clientState: ClientState,
    private orderService: OrderService,

  ) {
    this.isConfirmOder = true;

    this.sub = this.route.params.subscribe(params => {
      this.orderId = +params['invoiceId'];

      // if (typeof this.orderId != 'undefined' && this.orderId) {
      //   this.orderCheckedOutModel = JwtTokenHelper.GetOrderCheckedout(this.invoiceId);
      //   if (!this.orderCheckedOutModel) {
      //     this.router.navigate(['']);
      //     return;
      //   }

      //   this.icon = {
      //     url: this.orderCheckedOutModel.imageUrl,
      //     scaledSize: {
      //       width: 80,
      //       height: 80,
      //       backgroundSize: 'contain'
      //     }
      //   }
      // }
    });

    this.sub2 = this.route.queryParams.subscribe(queryParams => {
      this.orderCode = queryParams['orderCode'];
    });
  }

  ngOnInit(): void {
    if (this.orderId <= 0 || this.orderCode == '') {
      this.router.navigate(['']);
      return;
    }
    this.onGetOrderCheckout(this.orderId, this.orderCode);


    this.icon = {
      url: this.orderCheckedOutModel.imageUrl,
      scaledSize: {
        width: 80,
        height: 80,
        backgroundSize: 'contain'
      }
    }
  }

  getPosition = (position) => {
    this.currentPosition = <LatLongModel>{ lat: position.coords.latitude, lng: position.coords.longitude };
  }

  onGetOrderCheckout = (orderId: number, orderCode: string) => {
    this.clientState.isBusy = true;
    this.orderService.getOrderPayment(orderId, orderCode).subscribe(res => {
      this.orderCheckedOutModel = <OrderCheckoutModel>{ ...res.content };
      this.icon = {
        url: ApiUrl.BaseUrl + this.orderCheckedOutModel.imageUrl,
        scaledSize: {
          width: 80,
          height: 80,
          backgroundSize: 'contain'
        }
      }
      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.clientState.isBusy = false;
      this.router.navigate(['']);
    });
  }
}
