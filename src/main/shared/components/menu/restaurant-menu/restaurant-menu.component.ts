import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RestaurantMenuModel } from '../../../models/menu/app-menu.model';

@Component({
  selector: "restaurant-menu",
  templateUrl: "./restaurant-menu.component.html",
  styleUrls: ["./restaurant-menu.component.scss"]
})
export class RestaurantMenuComponent {
  @Input() restaurantId: number;
  @Input() menu: RestaurantMenuModel[] = [];
  @Output() selectedMenu: EventEmitter<number> = new EventEmitter();
  private showMenuItem = true;

  onSelectMenu = (menuId: number) => {
    this.selectedMenu.emit(menuId);
  };

  onToggleCategory = (category: RestaurantMenuModel) => {
    category.isToggle = !category.isToggle;
  };

  onShowOrHideMenuItem = () => {
    if (this.showMenuItem) this.showMenuItem = false;
    else this.showMenuItem = true;
  };
}
