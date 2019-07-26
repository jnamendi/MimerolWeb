import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/api/order/order.service';
import { ClientState } from '../../../../state/client/client-state';
import { PaymentType } from '../../../../models/order/order.model';
import { Configs } from '../../../../common/configs/configs';
import { ApiError } from '../../../../services/api-response/api-response';
import { OrderAdminService } from '../../../../services/api/order/admin-order.service';
import { AdminOrderModel } from '../../../../models/order/admin-order.model';
import { I18nService } from '../../../../core/i18n.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class AdminOrdersDetailComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() orderId: number;
  @Input() orderCode: string;
  @Output() onSuccess: EventEmitter<boolean> = new EventEmitter();

  private adminOrderModel: AdminOrderModel = new AdminOrderModel();
  private isError: boolean;
  private error: string;
  private statusError: number = 0;
  private paymentMethod: typeof PaymentType = PaymentType;
  private currencySymbol: string = Configs.SpainCurrency.symbol;
  private isProgressing: boolean;

  constructor(
    private orderService: OrderService,
    private clientState: ClientState,
    private orderAdminService: OrderAdminService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    if (this.orderId > 0) {
      this.onOrderFullInfo();
    }
  }

  onOrderFullInfo = () => {
    this.clientState.isBusy = true;
    this.orderService.getOrderFullInfo(this.orderId, this.orderCode).subscribe(res => {
      if (res.content == null) {
        this.adminOrderModel = null;
      } else {
        this.adminOrderModel = <AdminOrderModel>{ ...res.content };
      }

      this.clientState.isBusy = false;
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
    this.adminOrderModel.languageCode = languageCode;
    this.adminOrderModel.orderId = this.orderId;
    this.adminOrderModel.orderCode = this.orderCode;

    this.clientState.isBusy = true;
    this.orderAdminService.updateOrder(this.adminOrderModel).subscribe({
      complete: () => {
        this.isProgressing = false;
        this.onClose(true);
        this.clientState.isBusy = false;
      },
      error: (err: ApiError) => {
        this.isError = true;
        this.error = err.message;
        this.isProgressing = false;
      },
    });
  }

  onClose = (isSuccess: boolean) => {
    this.onSuccess.emit(isSuccess);
  }
}
