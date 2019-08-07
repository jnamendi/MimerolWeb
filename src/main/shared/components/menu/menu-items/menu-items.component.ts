import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuExtraItem } from '../../../models/menu/app-menu.model';
import { StorageService, I18nService, CoreService } from '../../../core';
import { StorageKey } from '../../../services/storage-key/storage-key';
import { JwtTokenHelper } from '../../../common';
import { RestaurantMenuItemModel, OrderItem, RestaurantMenuExtraItemModel, ExtraItem } from '../../../models/restaurant-menu/restaurant-menu.model';
import { RestaurantAppService } from '../../../services';
import { AppRestaurantModel } from '../../../models/restaurant/app-restaurant.model';
import { ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { ClientState } from '../../../state';

@Component({
  selector: 'menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit, OnChanges {
  @Input() selectedMenuId: number;
  @Input() selectedMenuName: number;
  @Input() menuItems: RestaurantMenuItemModel[] = [];
  @Input() restaurantId: number;
  @Input() removedMenuItemId: number;
  @Output() itemInBags: EventEmitter<number> = new EventEmitter();
  private selectedMenuItems: OrderItem = new OrderItem();
  private menuItemModels: RestaurantMenuItemModel[] = [];
  private selectedExtraItem: MenuExtraItem = null;
  private deliveryCost: number;
  private restaurantDetailModel: AppRestaurantModel = new AppRestaurantModel();
  private searchItem: string;
  private menuItemTemps: RestaurantMenuItemModel[] = [];
  private spainCurrency = Configs.SpainCurrency;
  private message: string;
  private isError: boolean;
  private isResClose: boolean;
  private priceItem: number;
  private quantityItem: number;

  // private shopingBagMenuItem: RestaurantMenuItemModel[] = [];
  // private tempType: Array<RestaurantMenuExtraItemModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private appRestaurantService: RestaurantAppService,
    private clientState: ClientState,
    private i18nService: I18nService,
    private coreService: CoreService
  ) {
  }

  ngOnInit(): void {
    //--- Get item in bag
    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);
    setTimeout(() => {
      this.onEmitSelectedMenuItem(this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length || 0);
    }, 300);

    //--- Get restaurant details
    this.onGetRestaurantDetails();
  }

  onGetRestaurantDetails = () => {
    if (this.restaurantId && this.restaurantId != 0) {
      this.clientState.isBusy = true;
      let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
      this.appRestaurantService.getRestaurantDetails(this.restaurantId, languageCode).subscribe(res => {
        this.restaurantDetailModel = <AppRestaurantModel>{ ...res.content };
        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.menuItemModels = this.menuItems.filter(item => item.menuId == this.selectedMenuId);
    this.menuItemModels.map(m => {
      m.menuExraItems && m.menuExraItems.map(e => { return e.selectedExtraItem = null; })
    });
    this.menuItemTemps = this.menuItemModels;
  }

  onRemoveItem = (removedMenuItemId: number) => {
    if (this.menuItemModels.some(i => i.menuItemId == removedMenuItemId)) {
      this.menuItemModels.find(i => i.menuItemId == removedMenuItemId).isSelected = false;
    }
  }

  // onSelectItem = (item: RestaurantMenuItemModel) => {
  //   if (this.restaurantDetailModel.restaurantClosed == true) {
  //     item.isSelected = false;
  //     this.isResClose = true;
  //     return;
  //   }

  //   this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);
  //   if (!this.selectedMenuItems) {
  //     this.selectedMenuItems = new OrderItem();
  //     this.selectedMenuItems.orderItemsRequest = [];
  //   }
  //   if (item.isSelected) {
  //     if (this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length >= 0
  //       && !this.selectedMenuItems.orderItemsRequest.some(i => i.menuItemId == item.menuItemId)) {
  //       this.selectedMenuItems.orderItemsRequest.push({ ...item, quantity: 1 });
  //     }
  //   } else {
  //     let itemsSelected = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length >= 0
  //       && this.selectedMenuItems.orderItemsRequest.filter(i => i.menuItemId != item.menuItemId);

  //     this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest
  //       && this.selectedMenuItems.orderItemsRequest.map(m => {
  //         m.menuExraItems && m.menuExraItems.map(i => {
  //           i.extraitems && i.extraitems.map(e => { e.isSelected = false })
  //         })
  //       });
  //     if (itemsSelected) {
  //       this.selectedMenuItems.orderItemsRequest = itemsSelected;
  //     }
  //   }
  //   this.selectedMenuItems.restaurantId = this.restaurantId;
  //   this.selectedMenuItems.deliveryCost = this.restaurantDetailModel.deliveryCost;
  //   this.selectedMenuItems.resOpenTime = this.restaurantDetailModel.openTime;
  //   this.selectedMenuItems.resCloseTime = this.restaurantDetailModel.closeTime;
  //   this.storageService.onSetToken(StorageKey.ItemsInBag + `__${this.restaurantId}`, JwtTokenHelper.CreateSigningToken(this.selectedMenuItems));
  //   this.onEmitSelectedMenuItem(this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest.length >= 0 && this.selectedMenuItems.orderItemsRequest.length);
  // }
  onShowButtonPlus = (item: RestaurantMenuItemModel) => {
    item.isShowButton = false;
    item.isShowExtraItem = false;
    item.isShowButtonArrow = false;
  }
  onSelectItem = (item: RestaurantMenuItemModel) => {
    if (typeof item.menuExraItems != 'undefined') {
      item.isShowButtonArrow = true;
      item.isShowExtraItem = true;
      item.isShowButton = true;
      this.priceItem = item.priceOriginal;
      this.quantityItem = 1;
      return;
    }
    if (this.restaurantDetailModel.restaurantClosed == true) {
      this.isResClose = true;
      return;
    }

    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);

    if (!this.selectedMenuItems) {
      this.selectedMenuItems = new OrderItem();
      this.selectedMenuItems.orderItemsRequest = [];
    }

    if (this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length >= 0
      && !this.selectedMenuItems.orderItemsRequest.some(i => i.menuItemId == item.menuItemId)) {
      this.selectedMenuItems.orderItemsRequest.push({ ...item, quantity: 1 });
    } else {
      for (let i = 0; i < this.selectedMenuItems.orderItemsRequest.length; i++) {
        if (this.selectedMenuItems.orderItemsRequest[i].menuItemId == item.menuItemId) {
          this.selectedMenuItems.orderItemsRequest[i].quantity++;
        }
      }
    }

    this.selectedMenuItems.restaurantId = this.restaurantId;
    this.selectedMenuItems.deliveryCost = this.restaurantDetailModel.deliveryCost;
    this.selectedMenuItems.resOpenTime = this.restaurantDetailModel.openTime;
    this.selectedMenuItems.resCloseTime = this.restaurantDetailModel.closeTime;
    this.storageService.onSetToken(StorageKey.ItemsInBag + `__${this.restaurantId}`, JwtTokenHelper.CreateSigningToken(this.selectedMenuItems));
    this.onEmitSelectedMenuItem(this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest.length >= 0 && this.selectedMenuItems.orderItemsRequest.length);
  }

  onSelectItemExtra = (item: RestaurantMenuItemModel) => {
    if (this.restaurantDetailModel.restaurantClosed == true) {
      this.isResClose = true;
      return;
    }

    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);

    if (!this.selectedMenuItems) {
      this.selectedMenuItems = new OrderItem();
      this.selectedMenuItems.orderItemsRequest = [];
    }

    if (this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length >= 0
      && !this.selectedMenuItems.orderItemsRequest.some(i => i.menuItemId == item.menuItemId)) {
      this.selectedMenuItems.orderItemsRequest.push({ ...item, quantity: 1 });
    } else {
      let checkPush = false;
      let indexTemp = 0;
      let shopingBagMenuItem = this.selectedMenuItems.orderItemsRequest.filter(x => x.menuItemId === item.menuItemId);
      if (shopingBagMenuItem != null) {
        shopingBagMenuItem.forEach(shopingBagMenuExtraItem => {
          item.menuExraItems.forEach(itemsMenuExtra => {
            let tempType = shopingBagMenuExtraItem.menuExraItems.filter(x => x.extraItemType === itemsMenuExtra.extraItemType);
            if (itemsMenuExtra.extraItemType === 2) {
              tempType.forEach(element => {
                let tempSelectMutiItem;
                if (itemsMenuExtra.selectedMultiItem.length === element.selectedMultiItem.length && (itemsMenuExtra.selectedMultiItem.length > 0 && element.selectedMultiItem.length > 0)) {
                  itemsMenuExtra.selectedMultiItem.forEach(multiExtras => {
                    tempSelectMutiItem = element.selectedMultiItem.filter(x => x.extraItemId === multiExtras.extraItemId);
                  })
                  if (tempSelectMutiItem.length > 0) {
                    checkPush = false;
                    indexTemp = shopingBagMenuItem.findIndex(e => e.menuItemId === item.menuItemId);
                  } else {
                    checkPush = true;
                  }
                } else {
                  checkPush = true;
                }
              });
            } else if (checkPush === false && itemsMenuExtra.extraItemType === 1) {
              tempType.forEach(element => {
                if ((itemsMenuExtra.selectedExtraItem != null && element.selectedExtraItem != null) && itemsMenuExtra.selectedExtraItem.extraItemId === element.selectedExtraItem.extraItemId) {
                  checkPush = false;
                  indexTemp = shopingBagMenuItem.findIndex(e => e.menuItemId === item.menuItemId);
                } else {
                  if (itemsMenuExtra.selectedExtraItem === null && element.selectedExtraItem === null) {
                    checkPush = false;
                    indexTemp = shopingBagMenuItem.findIndex(e => e.menuItemId === item.menuItemId);
                  } else {
                    checkPush = true;
                  }
                }
              });
            }
          });
        })
      } else {
        checkPush = true;
      }

      if (checkPush === true) {
        this.selectedMenuItems.orderItemsRequest.push({ ...item, quantity: 1 });
      } else {
        this.selectedMenuItems.orderItemsRequest[indexTemp].quantity++;
      }
    }

    this.selectedMenuItems.restaurantId = this.restaurantId;
    this.selectedMenuItems.deliveryCost = this.restaurantDetailModel.deliveryCost;
    this.selectedMenuItems.resOpenTime = this.restaurantDetailModel.openTime;
    this.selectedMenuItems.resCloseTime = this.restaurantDetailModel.closeTime;
    this.storageService.onSetToken(StorageKey.ItemsInBag + `__${this.restaurantId}`, JwtTokenHelper.CreateSigningToken(this.selectedMenuItems));
    this.onEmitSelectedMenuItem(this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest.length >= 0 && this.selectedMenuItems.orderItemsRequest.length);

    this.priceItem = item.priceOriginal;
    this.quantityItem = 1;
    item.menuExraItems.forEach(e => {
      e.extraitems.map(x => {
        if (x.isSelected && x.isSelected === true) {
          return x.isSelected = false;
        }
      })
      e.selectedExtraItem = null;
      e.selectedMultiItem = [];
    })
  }

  onEmitSelectedMenuItem = (totalItems: number) => {
    this.itemInBags.emit(totalItems);
  }

  onSelectExtraItem = (extraItems: RestaurantMenuExtraItemModel, extraItem: ExtraItem) => {
    if (typeof extraItems.selectedMultiItem === 'undefined') {
      extraItems.selectedMultiItem = []
    }
    if (extraItem.isSelected) {
      this.priceItem = this.priceItem + extraItem.price;
      let arr = extraItems.extraitems.filter(x => x.isSelected && x.isSelected === true);
      extraItems.selectedMultiItem = arr;
    } else {
      this.priceItem = this.priceItem - extraItem.price;
    }
    return;
  }

  onSelectSingleExtraItem = (menuItem: RestaurantMenuItemModel, extraItem: RestaurantMenuExtraItemModel) => {
    if (extraItem.selectedExtraItem == null) {
      extraItem.extraitems.map(i => {
        if (i != null) {
          return i.isSelected = false
        }
      });
    } else {
      extraItem.selectedExtraItem.isSelected = true;
      extraItem.extraitems.filter(x => x.extraItemId != extraItem.selectedExtraItem.extraItemId).map(i => {
        if (i != null) {
          return i.isSelected = false
        }
      });
    }

  }

  onAddExtraItemToBags = (menuItem: RestaurantMenuItemModel) => {
    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);
    var menuItemIndex = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest.length >= 0
      && this.selectedMenuItems.orderItemsRequest.findIndex(x => x.menuItemId == menuItem.menuItemId);

    if (typeof menuItemIndex !== undefined && menuItemIndex >= 0) {
      var itemQuantity = this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity;
      this.selectedMenuItems.orderItemsRequest[menuItemIndex] = { ...menuItem, quantity: itemQuantity };
      this.storageService.onSetToken(StorageKey.ItemsInBag + `__${this.restaurantId}`, JwtTokenHelper.CreateSigningToken(this.selectedMenuItems));
    }
  }

  onSearchMenuItem = () => {
    if (this.menuItemModels && this.menuItemModels.length <= 0) {
      return;
    }

    if (!!this.searchItem) {
      this.menuItemModels = this.menuItemTemps.filter(i => i.menuItemName && i.menuItemName.indexOf(this.searchItem) != -1);
    }

    if (this.searchItem == '') {
      this.menuItemModels = this.menuItemTemps;
    }
  }

  onCloseConfirm = (isConfirm: boolean) => {
    this.isResClose = false;
  }
  onAddOneItem = () => {
    (this.quantityItem + 1 >> 1000) ? this.quantityItem = 1000 : this.quantityItem = this.quantityItem + 1;
  }
  onSubstractOneItem = () => {
    (0 >= this.quantityItem - 1) ? this.quantityItem = 1 : this.quantityItem = this.quantityItem - 1;
  }
}
