import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuExtraItem } from '../../../models/menu/app-menu.model';
import { StorageService } from '../../../core';
import { StorageKey } from '../../../services/storage-key/storage-key';
import { JwtTokenHelper } from '../../../common';
import { RestaurantMenuItemModel, OrderItem } from '../../../models/restaurant-menu/restaurant-menu.model';

@Component({
  selector: 'menu-items-searching',
  templateUrl: './menu-items-searching.component.html',
  styleUrls: ['./menu-items-searching.component.scss']
})
export class MenuItemsSearchingComponent implements OnInit, OnChanges {
  constructor(){}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

}
