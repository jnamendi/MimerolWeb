import { Component } from '@angular/core';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { RestaurantOwnerModel } from '../../../models/restaurant/owner-restaurant.model';
import { ClientState } from '../../../state/client/client-state';
import { RestaurantOwnerService } from '../../../services/api/restaurant/owner-restaurant.service';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

@Component({
  selector: 'owner-invoices',
  templateUrl: './invoices.component.html'
})
export class OwnerInvoicesComponent {
  private restaurantOwnerModels: RestaurantOwnerModel[] = [];
  private message: string;
  private isError: boolean;

  isErrorDate: boolean;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  today = new Date();
  startDate: any = { date: { year: this.today.getUTCFullYear(), month: this.today.getUTCMonth(), day: this.today.getUTCDate() } };
  endDate: any = { date: { year: this.today.getUTCFullYear(), month: this.today.getUTCMonth() + 1, day: this.today.getUTCDate() } };
  restaurantId: number;

  constructor(
    private clientState: ClientState,
    private restaurantOwnerService: RestaurantOwnerService
  ) {
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
        this.clientState.isBusy = false;
      }
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
      this.clientState.isBusy = false;
    });
  }

  onChangeFromDate = (event: IMyDateModel) => {
    this.startDate.date = event.date
    this.onCheckDate(event, this.endDate);
  }

  onChangeToDate = (event: IMyDateModel) => {
    this.endDate.date = event.date
    this.onCheckDate(this.startDate, event);
  }

  onCheckDate = (startDate: any, endDate: any) => {
    let fromDate = new Date(
      startDate.date.year,
      startDate.date.month,
      startDate.date.day,
      8, 0, 0, 0
    );
    let toDate = new Date(
      endDate.date.year,
      endDate.date.month,
      endDate.date.day,
      8, 0, 0, 0
    );

    if (fromDate.getTime() >= toDate.getTime()) {
      this.isErrorDate = true;
    } else {
      this.isErrorDate = false;
    }
  }

  onSubmit = (isValid: boolean) => {
    this.onCheckDate(this.startDate, this.endDate);
    if (!isValid || this.isErrorDate) {
      return;
    }
    this.clientState.isBusy = true;
    let fromDate = this.startDate.date.year + "-" + this.startDate.date.month + "-" + this.startDate.date.day;
    let toDate = this.endDate.date.year + "-" + this.endDate.date.month + "-" + this.endDate.date.day;
    this.restaurantOwnerService.exportInvoiceByRestaurantId(this.restaurantId, fromDate, toDate).subscribe(res => {
      let file = res.content ? res.content.toString() : null;
      if (file) {
        let blob = new Blob([file], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "Invoice.pdf";
        link.click();
        link.style.display = "none";
      }
      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
      this.clientState.isBusy = false;
    });
  }
}
