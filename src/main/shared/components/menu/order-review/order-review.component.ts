import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuExtraItem } from '../../../models/menu/app-menu.model';
import { StorageService, I18nService } from '../../../core';
import { StorageKey } from '../../../services/storage-key/storage-key';
import { JwtTokenHelper } from '../../../common';
import { RestaurantMenuItemModel, OrderItem } from '../../../models/restaurant-menu/restaurant-menu.model';
import { RestaurantAppService } from '../../../services';
import { AppRestaurantModel } from '../../../models/restaurant/app-restaurant.model';
import { ApiError } from '../../../services/api-response/api-response';

@Component({
  selector: 'order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss']
})
export class OrderReviewComponent implements OnInit, OnChanges {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private appRestaurantService: RestaurantAppService,
    private i18nService: I18nService
  ) {

  }

  ngOnInit(): void {
  
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
