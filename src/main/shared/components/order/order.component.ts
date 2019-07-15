import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService, I18nService, CoreService } from '../../core';
import { JwtTokenHelper } from '../../common';
import { OrderItem } from '../../models/restaurant-menu/restaurant-menu.model';
import { OrderModel, OrderResponseModel } from '../../models/order/order.model';
import { Subscription } from 'rxjs';
import { StorageKey } from '../../services/storage-key/storage-key';
import { UserResponseModel } from '../../models';
import { AppAuthService, OrderService, VoucherService, CityService, DistrictService, AddressService } from '../../services';
import { Configs } from '../../common/configs/configs';
import { ClientState } from '../../state';
import { ApiError } from '../../services/api-response/api-response';
import { ShoppingBagsComponent } from '../menu/shopping-bags/shopping-bags.component';
import { VoucherModel, PromotionModel } from '../../models/voucher/voucher.model';
import { CityModel } from '../../models/city/city.model';
import { DistrictModel } from '../../models/district/district.model';
import { AddressModel } from '../../models/address/address.model';
import { Address } from 'ng2-google-place-autocomplete/src/app/ng2-google-place.classes';

@Component({
  selector: 'page-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy, AfterViewChecked {

  private sub: Subscription;
  private selectedMenuItems: OrderItem = new OrderItem();
  private totalItemsInBag: number;
  private orderModel: OrderModel = new OrderModel();
  private isEmptyOder: boolean;
  private restaurantId: number;
  private userInfo: UserResponseModel = new UserResponseModel();
  private isAuthen: boolean;
  private message: string;
  private isError: boolean;
  private voucher: VoucherModel = new VoucherModel();
  private deliveryTimes: Array<string> = [];
  private isResClose: boolean;
  private existingEmail: string;
  private paymentWiths: Array<number> = []
  private cityModels: CityModel[] = [];
  private districtModels: DistrictModel[] = [];
  private userAddressModels: AddressModel[] = [];
  private city: string;
  private district: string;
  private googleAddress: string = '';
  private placeTimeout: any;
  private currentCountryCode: string;

  @ViewChild(ShoppingBagsComponent) child;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private authService: AppAuthService,
    private clientState: ClientState,
    private orderService: OrderService,
    private voucherService: VoucherService,
    private cityService: CityService,
    private districtService: DistrictService,
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private i18nService: I18nService,
    private coreService: CoreService
  ) {
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = +params['restaurantId'];
      if (this.restaurantId <= 0) {
        this.router.navigate(['']);
      }
    });
    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);

    if (this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length <= 0) {
      this.router.navigate(['child']);
    }
    this.isAuthen = this.authService.isAuthenticated();
    this.orderModel.restaurantId = this.selectedMenuItems.restaurantId;
    this.currentCountryCode = JwtTokenHelper.countryCode;

    if (this.isAuthen) {
      this.userInfo = JwtTokenHelper.GetUserInfo();
      if (this.userInfo) {
        this.orderModel.userId = this.userInfo.userId;
        this.orderModel.name = this.userInfo.fullName;
        this.orderModel.email = this.userInfo.email;
        this.orderModel.number = this.userInfo.phone;
        this.onGetAddressForCurrentUser();
      }
    }
  }

  ngOnInit(): void {
    let timeRanges = this.coreService.range(1, 93).map(i => {
      return this.coreService.convertMinuteToTime(i * 15);
    });

    this.deliveryTimes = timeRanges.filter(t => {
      return this.coreService.compareTimeGreaterThanCurrent(t);
    });
    this.onGetCities();
  }

  ngAfterViewChecked(): void {
    if (!this.paymentWiths.length) {
      this.onBuildPaymentWiths();
      this.cdRef.detectChanges();
    }
  }

  onGetAddressForCurrentUser = () => {
    this.addressService.onGetByUser(this.orderModel.userId).subscribe(res => {
      if (res.content == null) {
        this.userAddressModels == [];
      } else {
        this.userAddressModels = [...res.content.data];
      }
    }, (err: ApiError) => {
      if (err.status == 8) {
        this.userAddressModels = [];
      }
    });
  }

  onGetCities = () => {
    this.cityService.onGetCities().subscribe(res => {
      this.cityModels = res.content && res.content.data ? <CityModel[]>[...res.content.data] : [];
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
    });
  }

  onGetDistrictByCity = (cityId: number) => {
    this.districtService.onGetDistrictByCity(cityId).subscribe(res => {
      this.districtModels = res.content ? <DistrictModel[]>[...res.content] : [];
      this.orderModel.districtId = null;
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
    });
  }

  onGetItemsInBag = (totalItems: number) => {
    this.totalItemsInBag = totalItems;
    this.onBuildPaymentWiths();
  }

  onGetTotalItemPrice = (): number => {
    return this.child.onGetTotalItemPrice();
  }

  onBuildPaymentWiths = () => {
    var totalPrice = this.onGetTotalItemPrice();
    if (totalPrice) {
      this.paymentWiths = [totalPrice, totalPrice + 1000, totalPrice + 2000];
      this.orderModel.paymentWith = this.paymentWiths[0];
      return;
    }
    this.paymentWiths = [0];
    this.orderModel.paymentWith = 0;
  }

  onSubmitOrder = (isValid: boolean) => {
    if (!isValid) {
      return;
    }

    if (!this.selectedMenuItems || this.selectedMenuItems
      && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length <= 0 || this.selectedMenuItems.totalPrice <= 0) {
      this.isEmptyOder = true;
      return;
    }

    if (!this.coreService.timeInRange(this.selectedMenuItems.resOpenTime, this.selectedMenuItems.resCloseTime)) {
      this.isResClose = true;
      return;
    }
    let district = this.districtModels.find(d => d.districtId == this.orderModel.districtId);
    let city = this.cityModels.find(c => c.cityId == this.orderModel.cityId);

    let orderInfo = <OrderModel>{
      ...this.orderModel,
      languageCode: this.i18nService.language.split('-')[0].toLocaleLowerCase(),
      symbolLeft: Configs.SpainCurrency.symbol,
      currencyCode: Configs.SpainCurrency.code,
      // time: new Date().toString(),
      deliveryCost: this.selectedMenuItems.deliveryCost,
      restaurantId: this.selectedMenuItems && this.selectedMenuItems.restaurantId,
      address: this.googleAddress,
      orderItem: this.child.onGetShopingBag(),
    };
    this.clientState.isBusy = true;
    this.orderService.onPaymentOrder(orderInfo).subscribe(res => {
      let orderResponseModel = <OrderResponseModel>res.content;
      if (orderResponseModel) {
        this.storageService.onRemoveToken(`${StorageKey.ItemsInBag}__${this.restaurantId}`);
        // this.storageService.onSetToken(`${StorageKey.OrderCheckedOut}${orderResponseModel.invoiceCode}`, JwtTokenHelper.CreateSigningToken(orderResponseModel));
        this.clientState.isBusy = false;
        this.router.navigate(['order-checkout', orderResponseModel.orderId], { queryParams: { orderCode: orderResponseModel.invoiceCode } });
      }
    }, (err: ApiError) => {
      this.clientState.isBusy = false;
      if (err.status == 2) {
        this.existingEmail = this.orderModel.email;
      }
    });
  }

  // onApplyVoucher = (isValid: boolean) => {
  //   if (!isValid) {
  //     return;
  //   }
  //   this.clientState.isBusy = true;

  //   this.voucherService.getVoucherByCode(this.orderModel.voucher).subscribe(res => {
  //     let voucher = <VoucherModel>{ ...res.content };
  //     this.child.onCalculateTotalPrices(voucher.value);
  //     this.clientState.isBusy = false;
  //   }, (err: ApiError) => {
  //     this.clientState.isBusy = false;
  //   });
  // }

  onApplyPromotion = (isValid: boolean) => {
    if (!isValid) {
      return;
    }
    this.clientState.isBusy = true;

    this.voucherService.getPromotionByCode(this.orderModel.promotionCode, this.orderModel.restaurantId).subscribe(res => {
      let voucher = <PromotionModel>{ ...res.content };
      this.child.onCalculateTotalPrices(voucher.value);
      this.clientState.isBusy = false;
      this.isError = false;
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
      this.clientState.isBusy = false;
    });
  }

  onGoBack = () => {
    window.history.back()
  }

  onNavigateToLogin = (isConfirm: boolean) => {
    if (isConfirm) {
      this.router.navigate(['login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
    }
    this.existingEmail = "";
  }

  onCloseConfirm = (isConfirm: boolean) => {
    this.isEmptyOder = false;
    this.isResClose = false;
  }

  setAddress = (place: Address) => {
    if (this.placeTimeout) {
      clearTimeout(this.placeTimeout);
    };
    this.placeTimeout = setTimeout(() => { }, 300);
  }

  onGetDistrict = (district: string) => {
    this.district = district;
  }

  onGetCity = (city: string) => {
    this.city = city;
  }

  onGetAddress = (address: string) => {
    this.googleAddress = address.replace(new RegExp(/(<([^>]+)>)/ig), '');
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}