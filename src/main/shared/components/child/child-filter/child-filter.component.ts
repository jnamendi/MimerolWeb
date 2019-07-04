import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChildFilterModel, FilterType } from './child-filter.model';
import { RestaurantFilter, AppRestaurantSearch, CategoryFilter, RankPrice } from '../../../models/restaurant/app-restaurant.model';
import { AreaSearch } from '../../../models/google/country-restaurant.model';
import { CategoryAppService } from '../../../services';
import { ClientState } from '../../../state';
import { ApiError } from '../../../services/api-response/api-response';
import { AttributeModel } from '../../../models/attribute/attribute.model';

@Component({
    selector: 'child-filter',
    templateUrl: './child-filter.component.html',
    styleUrls: ['./child-filter.component.scss']
})
export class ChildFilterComponent implements OnInit, OnChanges {
    @Input() isToggleFilter: boolean;
    @Input() searchArea: AreaSearch;
    @Input() categoryFilters: CategoryFilter;
    @Input() rankPrice: RankPrice;
    @Input() deliveryTypeAttributes: AttributeModel[] = [];
    @Output() closeFilter: EventEmitter<boolean> = new EventEmitter();
    @Output() onFilter: EventEmitter<RestaurantFilter> = new EventEmitter();
    @Output() categoryFilter: EventEmitter<number> = new EventEmitter();
    @Output() deliveryFilter: EventEmitter<number> = new EventEmitter();
    @Output() priceFilter: EventEmitter<Array<number>> = new EventEmitter();
    private filterData: ChildFilterModel[];
    private filterFoods: ChildFilterModel;
    private filterPrice: ChildFilterModel;
    private filterCost: ChildFilterModel;
    private rangeValues: number[] = [0, 120000];
    private restaurantCategorySearchs: AppRestaurantSearch[] = [];
    private message: string;
    private isError: boolean;
    private costFiltered: number = -1;
    private categoryIdFiltered: number;
    private priceFiltered = [0, 0];
    private priceFilteredTemp = [0, 0];


    private deliveryCostFilters = [
        { value: 0, name: "Free" },
        { value: 200, name: "200 C$ or less" },
    ]
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private appCategoryService: CategoryAppService
    ) {
        this.filterData = [
            {
                type: FilterType.Foods,
                isToggle: true,
                food: [
                    {
                        name: "Acne",
                        count: 50
                    },
                    {
                        name: "Grüne Erde",
                        count: 56
                    },
                    {
                        name: "Albiro",
                        count: 27
                    },
                    {
                        name: "Ronhill",
                        count: 5
                    },
                    {
                        name: "Oddmolly",
                        count: 9
                    },
                    {
                        name: "Boudestijn",
                        count: 10
                    },
                    {
                        name: "Rösch creative culture",
                        count: 50
                    },
                    {
                        name: "Albiro",
                        count: 50
                    },
                ]
            },
            {
                type: FilterType.Price,
                price: {
                    from: 0,
                    to: 500
                }
            },
            {
                type: FilterType.Cost,
                cost: [
                    {
                        name: "No preference",
                        value: false
                    },
                    {
                        name: "Free",
                        value: false
                    },
                    {
                        name: "3$ less",
                        value: false
                    },
                ]
            }
        ]
    }

    ngOnInit(): void {
        this.rangeValues = this.rankPrice && [0, this.rankPrice.maxPrice] || this.rangeValues;
        if (!this.priceFiltered.length || this.priceFilteredTemp[1] != this.rangeValues[1]) {
            this.priceFiltered = [this.rangeValues[0], this.rangeValues[1]];
            this.priceFilteredTemp = this.rangeValues;
        }
    }

    ngOnChanges() {
        this.rangeValues = this.rankPrice && [0, this.rankPrice.maxPrice] || this.rangeValues;
        if (!this.priceFiltered.length || this.priceFilteredTemp[1] != this.rangeValues[1]) {
            this.priceFiltered = [this.rangeValues[0], this.rangeValues[1]];
            this.priceFilteredTemp = this.rangeValues;
        }
    }

    onGetCategoriesByArea = () => {
        if (this.searchArea) {
            this.clientState.isBusy = true;
            this.appCategoryService.getRestaurantByArea(this.searchArea).subscribe(res => {
                if (res.content == null) {
                    this.restaurantCategorySearchs = [];
                } else {
                    this.restaurantCategorySearchs = <AppRestaurantSearch[]>[...res.content];
                }
                this.clientState.isBusy = false;
            }, (err: ApiError) => {
                this.clientState.isBusy = false;
                this.message = err.message;
                this.isError = true;
            });
        }
    }

    onCloseFilter = () => {
        this.isToggleFilter = false;
        this.closeFilter.emit(false);
    }

    onToggleFilterItem = (filterType: FilterType) => {
        let filter = this.filterData.find(f => f.type == filterType);
        if (filter) {
            filter.isToggle = !filter.isToggle;
        }
    }

    onCategoryFilter = (categoryId: number) => {
        this.categoryIdFiltered = categoryId;
        this.costFiltered = -1;
        this.priceFiltered = this.priceFilteredTemp;
        this.categoryFilter.emit(categoryId);
    }

    onDeliveryFilter = (deliveryCost: number) => {
        this.costFiltered = deliveryCost;
        this.categoryIdFiltered = null;
        this.priceFiltered = this.priceFilteredTemp;
        this.deliveryFilter.emit(deliveryCost);
    }

    onHandleSlideEnd = (event) => {
        this.categoryIdFiltered = null;
        this.costFiltered = -1;
        this.priceFiltered = event.values;
        this.priceFilter.emit(event && event.values);
    }
}
