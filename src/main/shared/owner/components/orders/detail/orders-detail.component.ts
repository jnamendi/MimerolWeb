import { Component, EventEmitter, Output, Input } from '@angular/core';
import { OrderService } from '../../../../services/api/order/order.service';
import { ClientState } from '../../../../state/client/client-state';
import { PaymentType } from '../../../../models/order/order.model';
import { Configs } from '../../../../common/configs/configs';
import { ApiError } from '../../../../services/api-response/api-response';
import { NgForm } from '@angular/forms';
import { OrderOwnerService } from '../../../../services/api/order/owner-order.service';
import { OwnerOrderModel } from '../../../../models/order/owner-order.model';
import { I18nService } from '../../../../core/i18n.service';

@Component({
  selector: 'owner-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OwnerOrdersDetailComponent {
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
  private isProgressing: boolean;

  constructor(
    private orderService: OrderService,
    private clientState: ClientState,
    private orderOwnerService: OrderOwnerService,
    private i18nService: I18nService
  ) { }

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

  onUpdateOrder = (form: NgForm) => {
    if (!form.valid) {
      return;
    }

    this.isProgressing = true;
    let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
    this.ownerOrderModel.languageCode = languageCode;
    this.ownerOrderModel.orderId = this.orderId;
    this.ownerOrderModel.orderCode = this.orderCode;
    this.orderOwnerService.updateOrder(this.ownerOrderModel).subscribe(res => {
      this.isProgressing = false;
      this.onClose(true);
    }, (err: ApiError) => {
      this.isError = true;
      this.error = err.message;
      this.isProgressing = false;
    });
  }

  onClose = (isSuccess: boolean) => {
    this.onSuccess.emit(isSuccess);
  }
}
