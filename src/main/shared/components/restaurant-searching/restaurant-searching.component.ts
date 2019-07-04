import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/api/language/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiError } from '../../services/api-response/api-response';
import { ClientState } from '../../state';
import { RestaurantSearching } from '../../models/restaurant/app-restaurant.model';
import { RestaurantAppService } from '../../services/api/restaurant/app-restaurant.service';

@Component({
    selector: 'restaurant-searching',
    templateUrl: './restaurant-searching.component.html',
    styleUrls: ['./restaurant-searching.component.scss']
})
export class RestaurantSearchingComponent implements OnInit, OnDestroy {

    @Output() onToggleSearch: EventEmitter<boolean> = new EventEmitter();

    private searchInput = new FormControl();
    private formCtrlSub: Subscription;
    private searchRestaurantResults: RestaurantSearching[] = [];
    private isShowSearchResult: boolean;

    constructor(
        private router: Router,
        private clientState: ClientState,
        private restaurantAppService: RestaurantAppService,
    ) {
        this.formCtrlSub = this.searchInput.valueChanges.debounceTime(1000).subscribe(searchText => this.onSearchFoods(searchText));
    }

    async ngOnInit(): Promise<void> {

    }

    onSearchFoods = (searchText: string) => {
        if (!!searchText) {
            this.clientState.isBusy = true;
            this.restaurantAppService.getRestaurantByName(searchText.trim()).subscribe(res => {
                if (res.content == null) {
                    this.searchRestaurantResults = [];
                } else {
                    this.searchRestaurantResults = res.content.map((item, index) => {
                        return <RestaurantSearching>{ ...item };
                    });
                }
                this.isShowSearchResult = true;
                this.clientState.isBusy = false;
            }, (err: ApiError) => {
                this.isShowSearchResult = false;
                this.clientState.isBusy = false;
            });
        }
    }

    onSelectedRestaurant = (restaurant: RestaurantSearching) => {
        this.onToggleSearch.emit(false);
        this.isShowSearchResult = false;
        this.router.navigate(['menu', restaurant.restaurantId]);
    }

    onFocusOut = () => {
        this.isShowSearchResult = false;
    }

    ngOnDestroy(): void {
        this.formCtrlSub.unsubscribe();
    }
}
