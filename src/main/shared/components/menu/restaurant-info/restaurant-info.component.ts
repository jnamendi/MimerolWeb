import { Component, OnInit, Input } from '@angular/core';
import { ClientState } from '../../../state';
import { I18nService } from '../../../core';
import { ApiError } from '../../../services/api-response/api-response';
import { AppRestaurantModel } from '../../../models/restaurant/app-restaurant.model';
import { RestaurantAppService } from '../../../services/api/restaurant/app-restaurant.service';

@Component({
    selector: 'restaurant-info',
    templateUrl: './restaurant-info.component.html',
    styleUrls: ['./restaurant-info.component.scss']
})

export class RestaurantInfoComponent implements OnInit {
    @Input() restaurantId: number;
    private restaurantModel: AppRestaurantModel = new AppRestaurantModel();
    private message: string;
    private isError: boolean;
    private isAuthen: boolean;
    private error: string;
    private icon: Object = {};

    constructor(
        private clientState: ClientState,
        private appRestaurantService: RestaurantAppService,
        private i18nService: I18nService,
    ) {
    }

    ngOnInit(): void {
        this.onGetRestaurantDetails();

        this.icon = {
            url: '../../assets/icons/ic_restaurant_location.png',
            scaledSize: {
                width: 42,
                height: 42,
                backgroundSize: 'contain'
            }
        }
    }

    onGetRestaurantDetails = () => {
        if (this.restaurantId && this.restaurantId != 0) {
            this.clientState.isBusy = true;
            let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
            this.appRestaurantService.getRestaurantDetails(this.restaurantId, languageCode).subscribe(res => {
                this.restaurantModel = <AppRestaurantModel>{ ...res.content };
                this.clientState.isBusy = false;
            }, (err: ApiError) => {
                this.message = err.message;
                this.isError = true;
                this.clientState.isBusy = false;
            });
        }
    }
}