import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OrderModel, PaymentType } from '../../../models/order/order.model';
import { OrderService } from '../../../services/api/order/order.service';
import { ClientState } from '../../../state/client/client-state';
import { ApiError } from '../../../services/api-response/api-response';
import { ActivatedRoute } from '@angular/router';
import { Configs } from '../../../common/configs/configs';

@Component({
  selector: 'page-user-orders-detail',
  templateUrl: './user-orders-detail.component.html',
  styleUrls: ['./user-orders-detail.component.scss']
})
export class UserOrdersDetailComponent {
  private orderModel: OrderModel = new OrderModel();
  private isError: boolean;
  private error: string;
  private statusError: number = 0;
  private paymentMethod: typeof PaymentType = PaymentType;
  private currencySymbol: string = Configs.SpainCurrency.symbol;
  @Input() visible: boolean = false;
  @Input() orderId: number;
  @Input() orderCode: string;
  @Output() onSuccess: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private clientState: ClientState,
  ) {
  }

  ngOnInit(): void {
    if (this.orderId > 0) {
      this.onOrderFullInfo();
    }
  }

  onOrderFullInfo = () => {
    this.orderService.getOrderFullInfo(this.orderId, this.orderCode).subscribe(
      res => {
        this.orderModel = <OrderModel>{ ...res.content };
      }, (err: ApiError) => {
        this.error = err.message;
        this.isError = true;
        this.statusError = err.status;
      });
  }

  onClose = (isSuccess: boolean) => {
    this.onSuccess.emit(isSuccess);
  }
}
