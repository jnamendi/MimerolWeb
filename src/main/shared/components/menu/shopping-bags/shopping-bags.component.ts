import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtTokenHelper } from '../../../common';
import { StorageService } from '../../../core';
import { StorageKey } from '../../../services/storage-key/storage-key';
import { Configs } from '../../../common/configs/configs';
import { RestaurantMenuItemModel, OrderItem } from '../../../models/restaurant-menu/restaurant-menu.model';
import { ClientState } from '../../../state';

@Component({
  selector: 'shopping-bags',
  templateUrl: './shopping-bags.component.html',
  styleUrls: ['./shopping-bags.component.scss']
})
export class ShoppingBagsComponent implements OnInit {
  @Input() isToggleFilter: boolean;
  @Input() isInOrder: boolean;
  @Input() restaurantId: number;

  @Output() itemInBags: EventEmitter<number> = new EventEmitter();
  @Output() removedItem: EventEmitter<number> = new EventEmitter();

  private selectedMenuItems: OrderItem;
  private totalSubItemsPrice: number;
  // private totalItemsVATPrice: number;
  private totalItemsPrice: number;
  private spainCurrency = Configs.SpainCurrency;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private clientState: ClientState
  ) {
  }

  ngOnInit(): void {
    this.selectedMenuItems = JwtTokenHelper.GetItemsInBag(this.restaurantId);
    if (!this.selectedMenuItems) {
      this.selectedMenuItems = new OrderItem();
    }
    this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.map(item => this.onCalculateItemPrice(item));
    this.onCalculatePrice();
  }

  onCalculatePrice = () => {
    // Promise.all([this.onCalculateSubTotalPrice(), this.onCalculateVAT(), this.onCalculateTotalPrices()]);

    Promise.all([this.onCalculateSubTotalPrice(), this.onCalculateTotalPrices()]);
  }

  increaseItem = (item: RestaurantMenuItemModel) => {
    var menuItemIndex = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest &&
      this.selectedMenuItems.orderItemsRequest.findIndex(x => x.menuItemId == item.menuItemId);
    this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity += 1;
    this.onCalculateItemPrice(this.selectedMenuItems.orderItemsRequest[menuItemIndex]);
    this.onCalculatePrice();
    this.onSetSelectedItems();
  }

  decreaseItem = (item: RestaurantMenuItemModel) => {
    var menuItemIndex = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest &&
      this.selectedMenuItems.orderItemsRequest.findIndex(x => x.menuItemId == item.menuItemId);
    this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity
      = this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity != 0 ? this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity - 1 : 0;
    this.onCalculateItemPrice(this.selectedMenuItems.orderItemsRequest[menuItemIndex]);
    this.onCalculatePrice();
    this.onSetSelectedItems();
  }

  onChangeItemQuantity = (item: RestaurantMenuItemModel) => {
    if (item.quantity) {

    }
    var menuItemIndex = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest &&
      this.selectedMenuItems.orderItemsRequest.findIndex(x => x.menuItemId == item.menuItemId);
    this.selectedMenuItems.orderItemsRequest[menuItemIndex].quantity = item.quantity != 0 ? +item.quantity : 0;
    this.onCalculateItemPrice(this.selectedMenuItems.orderItemsRequest[menuItemIndex]);
    this.onCalculatePrice();
    this.onSetSelectedItems();
  }

  onRemoveItem = (item: RestaurantMenuItemModel) => {
    let itemInBags = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest &&
      this.selectedMenuItems.orderItemsRequest.filter(i => i.menuItemId != item.menuItemId);
    this.selectedMenuItems.orderItemsRequest = itemInBags;
    this.onCalculateItemPrice(item);
    this.onCalculatePrice();
    this.onSetSelectedItems();
    this.removedItem.emit(item.menuItemId);
  }

  onSetSelectedItems = () => {
    this.storageService.onSetToken(StorageKey.ItemsInBag + `__${this.restaurantId}`, JwtTokenHelper.CreateSigningToken(this.selectedMenuItems));
    this.itemInBags && this.itemInBags.emit(this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest && this.selectedMenuItems.orderItemsRequest.length);
  }

  onCalculateItemPrice = (item: RestaurantMenuItemModel) => {
    item.totalPrice = item && item.priceRate * item.quantity || 0;
    if (item.menuExraItems && item.menuExraItems.some(i => i.extraitems && i.extraitems.some(m => m.isSelected))) {
      item.menuExraItems.map(i => {
        i.extraitems.map(m => {
          if (m.isSelected) {
            item.totalPrice += +m.priceRate * item.quantity;
          }
        });
      });
    }
  }

  onCalculateSubTotalPrice = () => {
    this.totalSubItemsPrice = this.selectedMenuItems && this.selectedMenuItems.orderItemsRequest &&
      this.selectedMenuItems.orderItemsRequest.reduce((prev, next) => prev + next.totalPrice, 0) || 0;
    this.selectedMenuItems.totalSubPrice = this.totalSubItemsPrice;
  }

  // onCalculateVAT = () => {
  //   // this.totalItemsVATPrice = this.totalSubItemsPrice * Configs.VAT / 100;
  //   // this.selectedMenuItems.taxTotal = this.totalItemsVATPrice;
  // }

  onCalculateTotalPrices = (discountValue: number = 0) => {
    // this.totalItemsPrice = (this.totalSubItemsPrice + this.totalItemsVATPrice) + (this.selectedMenuItems.deliveryCost || 0);

    this.totalItemsPrice = (this.totalSubItemsPrice) + (this.selectedMenuItems.deliveryCost || 0);
    if (discountValue > 0) {
      this.totalItemsPrice = Math.ceil(this.totalItemsPrice - (this.totalItemsPrice * (discountValue / 100)));
      this.selectedMenuItems.discount = discountValue;
    }
    this.selectedMenuItems.totalPrice = this.totalItemsPrice;
  }

  onCheckOut = () => {
    this.router.navigate(['./order', this.restaurantId])
  }

  onGetShopingBag = (): OrderItem => {
    // return <OrderItem>{ ...this.selectedMenuItems, totalPrice: this.totalItemsPrice, taxTotal: this.totalItemsVATPrice, totalSubPrice: this.totalSubItemsPrice };

    return <OrderItem>{ ...this.selectedMenuItems, totalPrice: this.totalItemsPrice, totalSubPrice: this.totalSubItemsPrice };
  }

  onGetTotalItemPrice = (): number => {
    return this.totalItemsPrice;
  }
}
