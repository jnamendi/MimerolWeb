import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientState } from '../../state';
import { RestaurantMenuService } from '../../services';
import { I18nService } from '../../core';
import { RestaurantMenu } from '../../models/restaurant-menu/restaurant-menu.model';
import { ApiError } from '../../services/api-response/api-response';
import { MenuItemsComponent } from './menu-items/menu-items.component';
import { AppRestaurantModel } from '../../models/restaurant/app-restaurant.model';
import { RestaurantAppService } from '../../services/api/restaurant/app-restaurant.service';

@Component({
  selector: 'page-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnChanges, OnDestroy {
  private isVisibleBags: boolean;
  private sub: Subscription;
  private sub2: Subscription;
  private restaurantId: number;
  private selectedMenuId: number;
  private removedMenuItemId: number;
  private selectedMenuName: string;
  private totalItemsInBag: number;
  private orderKey: string;
  private isEnableOrderReview: boolean;
  private restaurantMenu: RestaurantMenu = new RestaurantMenu();
  private message: string;
  private isError: boolean;
  private isShowMobileMenu: boolean;
  private restaurantModel: AppRestaurantModel = new AppRestaurantModel();

  @ViewChild(MenuItemsComponent) menuChild;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private restaurantMenuService: RestaurantMenuService,
    private i18nService: I18nService,
    private appRestaurantService: RestaurantAppService,
  ) {
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = +params['id'];
      if (this.restaurantId <= 0) {
        this.router.navigate(['']);
      }
    });
    this.sub2 = this.route.queryParams.subscribe(queryParams => {
      this.orderKey = queryParams['key'];
      if (!!this.orderKey) {
        this.onGetOrderReivewInfo(this.orderKey);
      }
    })

  }

  ngOnInit(): void {
    this.onGetRestaurantMenu();
    this.onGetRestaurantDetails();
  }

  onGetRestaurantMenu = () => {
    this.restaurantMenuService.getRestaurantMenu(this.i18nService.language.split('-')[0].toLocaleLowerCase(), this.restaurantId).subscribe(res => {
      this.restaurantMenu = <RestaurantMenu>{ ...res.content };
      this.selectedMenuId = this.restaurantMenu && this.restaurantMenu.mennu && this.restaurantMenu.mennu[0].menuId;
      this.selectedMenuName = this.restaurantMenu && this.restaurantMenu.mennu && this.restaurantMenu.mennu[0].menuName;
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
    });
  }

  onGetRestaurantDetails = () => {
    if (this.restaurantId && this.restaurantId != 0) {
      this.clientState.isBusy = true;
      let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
      this.appRestaurantService.getRestaurantDetails(this.restaurantId, languageCode).subscribe(res => {
        this.restaurantModel = <AppRestaurantModel>{ ...res.content };
        this.clientState.isBusy = false;
      }, (err) => {
        this.clientState.isBusy = false;
      });
    }
  }

  onGetOrderReivewInfo = (key: string) => {
    this.isEnableOrderReview = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onOpenShoppingBags = (isVisibleBags: boolean) => {
    this.isVisibleBags = isVisibleBags;
  }

  onSelectMenu = (menuId: number) => {
    this.selectedMenuId = menuId;
    let selectedMenu = this.restaurantMenu.mennu.find(menu => menu.menuId == menuId);
    this.selectedMenuName = selectedMenu && selectedMenu.menuName || '';
    this.isShowMobileMenu = false;
  }

  onGetItemsInBag = (totalItems: number) => {
    this.totalItemsInBag = totalItems;
  }

  onRemoveMenuItem = (menuItemId: number) => {
    this.removedMenuItemId = menuItemId;
    this.menuChild.onRemoveItem(this.removedMenuItemId);
  }

  onToggleMobileMenu = (isClose: boolean) => {
    this.isShowMobileMenu = isClose ? false : !this.isShowMobileMenu;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }
}
