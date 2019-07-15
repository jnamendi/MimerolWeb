import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuExtraItem } from '../../../models/menu/app-menu.model';
import { StorageService, I18nService, CoreService } from '../../../core';
import { StorageKey } from '../../../services/storage-key/storage-key';
import { JwtTokenHelper } from '../../../common';
import { RestaurantMenuItemModel, OrderItem, RestaurantMenuExtraItemModel } from '../../../models/restaurant-menu/restaurant-menu.model';
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
  private restaurantDetailModel: AppRestaurantModel;
  private searchItem: string;
  private menuItemTemps: RestaurantMenuItemModel[] = [];
  private spainCurrency = Configs.SpainCurrency;
  private message: string;
  private isError: boolean;
  private isResClose: boolean;

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
    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);
    this.appRestaurantService.getRestaurantDetails(this.restaurantId, this.i18nService.language.split('-')[0].toLocaleLowerCase()).subscribe(res => {
      this.restaurantDetailModel = <AppRestaurantModel>{ ...res.content };
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
    })
    setTimeout(() => {
      this.onEmitSelectedMenuItem(this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length || 0);
    }, 300);
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

  onSelectItem = (item: RestaurantMenuItemModel) => {
    if (!this.coreService.timeInRange(this.restaurantDetailModel.openTime, this.restaurantDetailModel.closeTime)) {
      item.isSelected = false;
      this.isResClose = true;
      return;
    }

    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);
    if (!this.selectedMenuItems) {
      this.selectedMenuItems = new OrderItem();
      this.selectedMenuItems.orderItemsRequest = [];
    }
    if (item.isSelected) {
      if (this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length >= 0
        && !this.selectedMenuItems.orderItemsRequest.some(i => i.menuItemId == item.menuItemId)) {
        this.selectedMenuItems.orderItemsRequest.push({ ...item, quantity: 1 });
      }
    } else {
      let itemsSelected = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length >= 0
        && this.selectedMenuItems.orderItemsRequest.filter(i => i.menuItemId != item.menuItemId);

      this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest
        && this.selectedMenuItems.orderItemsRequest.map(m => {
          m.menuExraItems && m.menuExraItems.map(i => {
            i.extraitems && i.extraitems.map(e => { e.isSelected = false })
          })
        });
      if (itemsSelected) {
        this.selectedMenuItems.orderItemsRequest = itemsSelected;
      }
    }
    this.selectedMenuItems.restaurantId = this.restaurantId;
    this.selectedMenuItems.deliveryCost = this.restaurantDetailModel.deliveryCost;
    this.selectedMenuItems.resOpenTime = this.restaurantDetailModel.openTime;
    this.selectedMenuItems.resCloseTime = this.restaurantDetailModel.closeTime;
    this.storageService.onSetToken(StorageKey.ItemsInBag + `__${this.restaurantId}`, JwtTokenHelper.CreateSigningToken(this.selectedMenuItems));
    this.onEmitSelectedMenuItem(this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest.length >= 0 && this.selectedMenuItems.orderItemsRequest.length);
  }

  onEmitSelectedMenuItem = (totalItems: number) => {
    this.itemInBags.emit(totalItems);
  }

  onSelectExtraItem = (menuItem: RestaurantMenuItemModel, extraItem: MenuExtraItem) => {
    this.onAddExtraItemToBags(menuItem);
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
    this.onAddExtraItemToBags(menuItem);
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
}