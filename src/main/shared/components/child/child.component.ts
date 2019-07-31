import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModel } from '../../models';
import { StorageService, I18nService, CoreService } from '../../core';
import { AreaSearch } from '../../models/google/country-restaurant.model';
import { ApiError } from '../../services/api-response/api-response';
import { AppRestaurantModel, AppRestaurantSearch, CategoryFilter, RankPrice } from '../../models/restaurant/app-restaurant.model';
import { ClientState } from '../../state';
import { RestaurantAppService, AttributeService } from '../../services';
import { AttributeGroupType, AttributeGroup, AttributeModel } from '../../models/attribute/attribute.model';
import { JwtTokenHelper } from '../../common';

@Component({
  selector: 'page-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})

export class ChildComponent implements OnInit {
  private isToggleFilter: boolean;
  private sortDropdown: DropdownModel[];
  private searchArea: AreaSearch = new AreaSearch();
  private restaurantModel: AppRestaurantModel = new AppRestaurantModel();
  private restaurantModels: AppRestaurantModel[] = [];
  private restaurantModelsTemp: AppRestaurantModel[] = [];
  private restaurantSearch: AppRestaurantSearch = new AppRestaurantSearch();
  private categoryFilters: CategoryFilter[] = [];
  private rankPrice: RankPrice;
  private attributeGroups: AttributeGroup[] = [];
  private deliveryTypeAttributes: AttributeModel[] = [];
  private message: string;
  private isError: boolean;
  private isResClose: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appRestaurantService: RestaurantAppService,
    private storageService: StorageService,
    private clientState: ClientState,
    private attributeService: AttributeService,
    private i18nService: I18nService,
    private coreService: CoreService
  ) {

    this.searchArea = JwtTokenHelper.GetSearchRestaurantArea();
    if (!this.searchArea) {
      this.router.navigate(['']);
    }
    this.sortDropdown = [
      {
        value: 0,
        text: 'A-Z'
      },
      {
        value: 1,
        text: 'Ratings'
      },
      // {
      //   value: 2,
      //   text: 'Newest First'
      // },
      // {
      //   value: 3,
      //   text: 'Oldest First'
      // },
      {
        value: 4,
        text: 'Price: Low - High'
      },
      {
        value: 5,
        text: 'Price: High - Low'
      },
    ]
  }

  ngOnInit(): void {
    this.clientState.isBusy = true;
    Promise.all([
      this.onGetRestaurantByArea(),
      // this.onGetAttributeGroup()
    ]).then(res => {
      this.clientState.isBusy = false;
    }).catch((err: ApiError) => {
      this.message = err.message;
      this.isError = true;
      this.clientState.isBusy = false;
    });
  }

  onGetRestaurantByArea = () => {
    this.appRestaurantService.getRestaurantByArea(this.searchArea).subscribe(res => {
      this.restaurantSearch = <AppRestaurantSearch>{ ...res.content };

      this.restaurantModels = this.restaurantSearch && this.restaurantSearch.restaurants;
      // this.restaurantModels.map(rs => {
      //   let deliveryTime = rs.attributes.find(atr => atr.groupCode == AttributeGroupType.DeliveryTime);
      //   let deliveryType = rs.attributes.find(atr => atr.groupCode == AttributeGroupType.DeliveryType);
      //   rs.deliveryTime = deliveryTime && deliveryTime.attributeName || '';
      //   rs.deliveryType = deliveryType && deliveryType.attributeName || '';
      // });
      this.onSortRestauranByAlphabetical();
      this.restaurantModelsTemp = this.restaurantModels;
      this.categoryFilters = this.restaurantSearch && [...this.restaurantSearch.categories];
      this.rankPrice = this.restaurantSearch && { ...this.restaurantSearch.rankPrice };
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
    })
  }

  onGetAttributeGroup = () => {
    this.attributeService.onGetAttributeGroup(this.i18nService.language.split('-')[0].toLocaleLowerCase()).subscribe(res => {
      if (res.content == null) {
        this.attributeGroups = [];
      } else {
        this.attributeGroups = <AttributeGroup[]>[...res.content];
      }

      let attributeDeliveryGroup = this.attributeGroups && this.attributeGroups.length > 0
        && this.attributeGroups.find(atr => atr.attributeGroupCode == AttributeGroupType.DeliveryType)
      this.deliveryTypeAttributes = attributeDeliveryGroup && attributeDeliveryGroup.attributes;
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
    })
  }

  onToggleFilter = () => {
    this.isToggleFilter = !this.isToggleFilter;
  }

  onFilterHandle = (event) => {
    // console.log(event)
  }

  onCategoryFilter = (categoryId: number) => {
    if (categoryId == 0) {
      this.restaurantModels = this.restaurantModelsTemp;
      return;
    }
    this.restaurantModels = this.restaurantModelsTemp.filter(res => {
      return res.categoryIds.some(res => res.categoryId == categoryId);
    });
  }

  onDeliveryFilter = (deliveryCost: number) => {
    this.restaurantModels = this.restaurantModelsTemp.filter(res => {
      if (deliveryCost == 0) {
        return res.deliveryCost == 0;
      } else {
        return res.deliveryCost <= deliveryCost;
      }
    });
  }

  onPriceFilter = (ranges: Array<number>) => {
    this.restaurantModels = this.restaurantModelsTemp.filter(res => {
      return res.minPrice >= ranges[0] && res.minPrice <= ranges[1];
    });
  }

  onRestFilter = (isToggle: boolean) => {
    this.isToggleFilter = isToggle;
  }

  onNavigateToMenu = (restaurantId: number) => {
    this.router.navigate(['menu', restaurantId])
  }

  onSortChange = (sortDropdownItem: DropdownModel) => {
    if (this.restaurantModels && this.restaurantModels.length <= 0) {
      return;
    }
    switch (sortDropdownItem.value) {
      case 0:
        this.onSortRestauranByAlphabetical();
        break;
      case 1:
        this.onSortRestauranByNumberOfReviews('desc');
        break;
      case 2:
        this.onSortRestauranByCreatedDate('asc');
        break;
      case 3:
        this.onSortRestauranByCreatedDate('desc');
        break;
      case 4:
        this.onSortRestauranByPrice('asc');
        break;
      case 5:
        this.onSortRestauranByPrice('desc');
        break;
      default:
        break;
    }
  }

  onSortRestauranByPrice = (sortType: 'asc' | 'desc') => {
    this.restaurantModels.sort((a, b) => {
      return sortType == 'asc' ? a.minPrice - b.minPrice : b.minPrice - a.minPrice;
    })
  }

  onSortRestauranByCreatedDate = (sortType: 'asc' | 'desc') => {
    this.restaurantModels.sort((a, b) => {
      let aDate = new Date(a.createdDate);
      let bDate = new Date(b.createdDate);
      return sortType == 'asc' ? +aDate - +bDate : +bDate - +aDate;
    })
  }

  onSortRestauranByNumberOfReviews = (sortType: 'asc' | 'desc') => {
    this.restaurantModels.sort((a, b) => {
      return sortType == 'asc' ? a.rating - b.rating : b.rating - a.rating;
    })
  }

  onSortRestauranByAlphabetical = () => {
    this.restaurantModels.sort((a, b) => {
      let genreA = a.restaurantName.toLocaleUpperCase();
      let genreB = b.restaurantName.toLocaleUpperCase();
      if (genreA > genreB) return 1;
      if (genreA < genreB) return -1;
      return 0;
    })
  }

  onCloseConfirm = (isConfirm: boolean) => {
    this.isResClose = false;
  }
}
