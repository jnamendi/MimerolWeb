import { Component, Input, Output, EventEmitter } from '../../../../../../../node_modules/@angular/core';
import { OwnerOrderModel } from '../../../../models/order/owner-order.model';
import { PaymentType } from '../../../../models/order/order.model';
import { OrderService } from '../../../../services/api/order/order.service';
import { ClientState } from '../../../../state/client/client-state';
import { ApiError } from '../../../../services/api-response/api-response';
import { Configs } from '../../../../common/configs/configs';

@Component({
  selector: 'owner-pending-charges-detail',
  templateUrl: './pending-charges-detail.component.html',
  styleUrls: ['./pending-charges-detail.component.scss']
})
export class OwnerPendingChargesDetailComponent {
    private ownerOrderModel: OwnerOrderModel = new OwnerOrderModel();
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
        this.ownerOrderModel = <OwnerOrderModel>{ ...res.content };
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
