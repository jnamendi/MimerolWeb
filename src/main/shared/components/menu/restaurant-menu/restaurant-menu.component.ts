import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuMockApi } from '../../../mocks/menu/menu.api';
import { RestaurantMenuModel } from '../../../models/menu/app-menu.model';
import { ApiError } from '../../../services/api-response/api-response';

@Component({
  selector: 'restaurant-menu',
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss']
})
export class RestaurantMenuComponent implements OnInit {
  private menuMockApi: MenuMockApi = new MenuMockApi();
  @Input() restaurantId: number;
  @Input() menu: RestaurantMenuModel[] = [];
  @Output() selectedMenu: EventEmitter<number> = new EventEmitter();
  private menuCategories: RestaurantMenuModel[] = [];
  private message: string;
  private isError: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  onGetMenuCategories = () => {
    if (this.restaurantId) {
      this.menuMockApi.getMenuCategoriesOfRestaurant(this.restaurantId).subscribe(res => {
        this.menuCategories = [...res.content.data];
        if (this.menuCategories.length > 0) {
          setTimeout(() => {
            this.onSelectMenu(this.menuCategories[0] && this.menuCategories[0].menus[0] && this.menuCategories[0].menus[0].menuId);
          }, 300);
        }
      }, (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      });
    }
  }

  onSelectMenu = (menuId: number) => {
    this.selectedMenu.emit(menuId);
  }

  onToggleCategory = (category: RestaurantMenuModel) => {
    category.isToggle = !category.isToggle;
  }
}
