import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { JwtTokenHelper } from "../../../common";
import { StorageService, I18nService, CoreService } from "../../../core";
import { StorageKey } from "../../../services/storage-key/storage-key";
import { Configs } from "../../../common/configs/configs";
import {
  RestaurantMenuItemModel,
  OrderItem
} from "../../../models/restaurant-menu/restaurant-menu.model";
import { ClientState } from "../../../state";
import { AppRestaurantModel } from "../../../models/restaurant/app-restaurant.model";
import { RestaurantAppService } from "../../../services/api/restaurant/app-restaurant.service";

@Component({
  selector: "shopping-bags",
  templateUrl: "./shopping-bags.component.html",
  styleUrls: ["./shopping-bags.component.scss"]
})
export class ShoppingBagsComponent implements OnInit {
  @Input() isToggleFilter: boolean;
  @Input() isInOrder: boolean;
  @Input() restaurantId: number;

  @Output() itemInBags: EventEmitter<number> = new EventEmitter();
  @Output() removedItem: EventEmitter<number> = new EventEmitter();

  private restaurantModel: AppRestaurantModel = new AppRestaurantModel();
  private selectedMenuItems: OrderItem;
  private totalSubItemsPrice: number;
  private totalItemsPrice: number;
  private spainCurrency = Configs.SpainCurrency;
  private isResClose: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private clientState: ClientState,
    private i18nService: I18nService,
    private coreService: CoreService,
    private appRestaurantService: RestaurantAppService
  ) {}

  ngOnInit(): void {
    this.selectedMenuItems = this.onConvertMenuItem(
      JwtTokenHelper.GetItemsInBag(this.restaurantId)
    );
    if (!this.selectedMenuItems) {
      this.selectedMenuItems = new OrderItem();
    }
    this.selectedMenuItems &&
      this.selectedMenuItems.orderItemsRequest &&
      this.selectedMenuItems.orderItemsRequest.map(item =>
        this.onCalculateItemPrice(item)
      );
    this.onCalculatePrice();
    this.onGetRestaurantDetails();
  }

  onConvertMenuItem = (selectedMenuItems: OrderItem) => {
    if (selectedMenuItems && selectedMenuItems.orderItemsRequest) {
      selectedMenuItems.orderItemsRequest.forEach(smi => {
        if (typeof smi.menuExraItems !== "undefined") {
          smi.menuExraItems.forEach(menuItems => {
            if (
              menuItems.extraItemType === 1 &&
              menuItems.selectedExtraItem !== null
            ) {
              menuItems.extraitems = [];
              menuItems.extraitems.push(menuItems.selectedExtraItem);
            } else if (
              menuItems.extraItemType === 1 &&
              menuItems.selectedExtraItem === null
            ) {
              menuItems.extraitems = [];
            }
            if (
              menuItems.extraItemType === 2 &&
              menuItems.selectedMultiItem.length > 0
            ) {
              menuItems.extraitems = [];
              menuItems.extraitems = menuItems.selectedMultiItem;
            } else if (
              menuItems.extraItemType === 2 &&
              menuItems.selectedMultiItem.length === 0
            ) {
              menuItems.extraitems = [];
            }
          });
        }
      });
    }
    return selectedMenuItems;
  };

  onGetRestaurantDetails = () => {
    if (this.restaurantId && this.restaurantId != 0) {
      this.clientState.isBusy = true;
      let languageCode = this.i18nService.language
        .split("-")[0]
        .toLocaleLowerCase();
      this.appRestaurantService
        .getRestaurantDetails(this.restaurantId, languageCode)
        .subscribe(
          res => {
            this.restaurantModel = <AppRestaurantModel>{ ...res.content };
            this.clientState.isBusy = false;
          },
          err => {
            this.clientState.isBusy = false;
          }
        );
    }
  };

  onCalculatePrice = () => {
    Promise.all([
      this.onCalculateSubTotalPrice(),
      this.onCalculateTotalPrices()
    ]);
  };

  increaseItem = (item: RestaurantMenuItemModel, index: number) => {
    var menuItemIndex =
      this.selectedMenuItems &&
      this.selectedMenuItems.orderItemsRequest &&
      index;
    this.selectedMenuItems.orderItemsRequest[index].quantity += 1;
    this.onCalculateItemPrice(
      this.selectedMenuItems.orderItemsRequest[menuItemIndex]
    );
    this.onCalculatePrice();
    this.onSetSelectedItems();
  };

  decreaseItem = (item: RestaurantMenuItemModel, index: number) => {
    var menuItemIndex =
      this.selectedMenuItems &&
      this.selectedMenuItems.orderItemsRequest &&
      index;
    this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity =
      this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity != 0
        ? this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity - 1
        : 0;
    this.onCalculateItemPrice(
      this.selectedMenuItems.orderItemsRequest[menuItemIndex]
    );
    this.onCalculatePrice();
    this.onSetSelectedItems();
  };

  onChangeItemQuantity = (item: RestaurantMenuItemModel) => {
    var menuItemIndex =
      this.selectedMenuItems &&
      this.selectedMenuItems.orderItemsRequest &&
      this.selectedMenuItems.orderItemsRequest.findIndex(
        x => x.menuItemId == item.menuItemId
      );
    this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity =
      item.quantity != 0 ? +item.quantity : 0;
    this.onCalculateItemPrice(
      this.selectedMenuItems.orderItemsRequest[menuItemIndex]
    );
    this.onCalculatePrice();
    this.onSetSelectedItems();
  };

  onRemoveItem = (item: RestaurantMenuItemModel, index: number) => {
    // let itemInBags = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest &&
    //   this.selectedMenuItems.orderItemsRequest.filter(i => i.menuItemId != item.menuItemId);
    // this.selectedMenuItems.orderItemsRequest = itemInBags;
    // this.onCalculateItemPrice(item);
    // this.onCalculatePrice();
    // this.onSetSelectedItems();
    // this.removedItem.emit(item.menuItemId);
    this.selectedMenuItems.orderItemsRequest.splice(index, 1);
    this.onCalculatePrice();
    this.onSetSelectedItems();
  };

  onSetSelectedItems = () => {
    this.storageService.onSetToken(
      StorageKey.ItemsInBag + `__${this.restaurantId}`,
      JwtTokenHelper.CreateSigningToken(this.selectedMenuItems)
    );
    this.itemInBags &&
      this.itemInBags.emit(
        this.selectedMenuItems &&
          this.selectedMenuItems.orderItemsRequest &&
          this.selectedMenuItems.orderItemsRequest.length
      );
  };

  onCalculateItemPrice = (item: RestaurantMenuItemModel) => {
    item.totalPrice = (item && item.priceRate * item.quantity) || 0;
    if (
      item.menuExraItems &&
      item.menuExraItems.some(
        i => i.extraitems && i.extraitems.some(m => m.isSelected)
      )
    ) {
      item.menuExraItems.map(i => {
        i.extraitems.map(m => {
          if (m.isSelected) {
            item.totalPrice += +m.priceRate * item.quantity;
          }
        });
      });
    }
  };

  onCalculateSubTotalPrice = () => {
    this.totalSubItemsPrice =
      (this.selectedMenuItems &&
        this.selectedMenuItems.orderItemsRequest &&
        this.selectedMenuItems.orderItemsRequest.reduce(
          (prev, next) => prev + next.totalPrice,
          0
        )) ||
      0;
    this.selectedMenuItems.totalSubPrice = this.totalSubItemsPrice;
  };

  onCalculateTotalPrices = (discountValue: number = 0) => {
    this.totalItemsPrice =
      this.totalSubItemsPrice + (this.selectedMenuItems.deliveryCost || 0);
    if (discountValue > 0) {
      //this.totalItemsPrice = Math.ceil(this.totalItemsPrice - (this.totalItemsPrice * (discountValue / 100)));
      this.totalItemsPrice = parseFloat(
        (
          this.totalSubItemsPrice -
          this.totalSubItemsPrice * (discountValue / 100) +
          (this.selectedMenuItems.deliveryCost || 0)
        ).toFixed(2)
      );
      this.selectedMenuItems.discount = discountValue;
    }
    this.selectedMenuItems.totalPrice = this.totalItemsPrice;
  };

  onCheckOut = () => {
    if (
      this.totalSubItemsPrice < this.restaurantModel.minPrice ||
      this.restaurantModel.restaurantClosed == true
    ) {
      return;
    }
    this.router.navigate(["./order", this.restaurantId]);
  };

  onGetShoppingBag = (): OrderItem => {
    return <OrderItem>{
      ...this.selectedMenuItems,
      totalPrice: this.totalItemsPrice,
      totalSubPrice: this.totalSubItemsPrice
    };
  };

  onGetTotalItemPrice = (): number => {
    return this.selectedMenuItems.totalPrice;
  };

  onCloseConfirm = (isConfirm: boolean) => {
    this.isResClose = false;
  };
}
