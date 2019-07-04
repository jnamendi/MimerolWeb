import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { LatLongModel } from '../../models';
import { AreaSearch } from '../../models/google/country-restaurant.model';
import { JwtTokenHelper } from '../../common';
import { StorageService, I18nService } from '../../core';
import { StorageKey } from '../../services/storage-key/storage-key';
import { GoogleApiService } from '../../services/google-api/google-api.service';
import { LanguageService } from '../../services/api/language/language.service';
import { Address } from 'cluster';
import { ApiError } from '../../services/api-response/api-response';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RestaurantAppService } from '../../services';
import { ClientState } from '../../state';
import { CitySearch } from '../../models/restaurant/app-restaurant.model';

@Component({
    selector: 'google-place-input',
    templateUrl: './google-place.component.html',
    styleUrls: ['./google-place.component.scss']
})
export class GooglePlaceComponent implements OnInit, OnDestroy {
    public currentPosition: LatLongModel;
    private currentCountryCode: string;
    private city: string;
    private district: string;
    private googleAddress: string;
    private placeTimeout: any;
    private error: ApiError;
    private isError: boolean;
    private restaurantAreaSearch: AreaSearch;
    private cityName: string;
    private citySearchResults: CitySearch[];
    private cityTimeout: any;
    private isSearching: boolean;
    cityControl = new FormControl();
    formCtrlSub: Subscription;
    private tempCityName: string;
    private isShowResults: boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private googleService: GoogleApiService,
        private languageService: LanguageService,
        private storageService: StorageService,
        private clientState: ClientState,
        private appRestaurantService: RestaurantAppService,
        private renderer: Renderer2,
        private el: ElementRef,
        private i18nService: I18nService,

    ) {
        // this.googleService.getCountryCode().subscribe(res => {
        //     let ipInfo: IpInfo = <IpInfo>{ ...res };
        //     this.storageService.onSetToken(StorageKey.IPInfo, JwtTokenHelper.CreateSigningToken(ipInfo));
        //     this.currentCountryCode = JwtTokenHelper.countryCode;
        // }, err => {
        //     this.currentCountryCode = JwtTokenHelper.countryCode;
        // });

        this.formCtrlSub = this.cityControl.valueChanges.debounceTime(1500).subscribe(newCity => {
            this.cityName = newCity;
            this.tempCityName = this.cityName;
            if (this.isSearching) {
                return;
            }
            if (!!this.cityName) {
                this.onFetchRegisteredRestaurantByCity(this.cityName);
            }
        });
    }

    async ngOnInit(): Promise<void> {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getPosition, err => {
            });
        }
    }

    getPosition = (position) => {
        this.currentPosition = <LatLongModel>{ lat: position.coords.latitude, lng: position.coords.longitude };
    }

    setAddress = (place: Address) => {
        if (this.placeTimeout) {
            clearTimeout(this.placeTimeout);
        };
        this.placeTimeout = setTimeout(() => {
            this.restaurantAreaSearch = <AreaSearch>{
                city: this.city,
                district: this.district,
                address: this.googleAddress,
                languageCode: this.i18nService.language.split('-')[0].toLocaleLowerCase()
            };
            this.storageService.onSetToken(StorageKey.RestaurantAreaSearch, JwtTokenHelper.CreateSigningToken(this.restaurantAreaSearch));
            this.router.navigate(['./child']);
        }, 200);
    }

    onGetDistrict = (district: string) => {
        this.district = district;
    }

    onGetCity = (city: string) => {
        this.city = city;
    }

    onGetAddress = (address: string) => {
        this.googleAddress = address.replace(new RegExp(/(<([^>]+)>)/ig), '');
    }

    onFetchRegisteredRestaurantByCity = (cityName: string) => {
        if (!cityName || this.isSearching) {
            return;
        }
        this.clientState.isBusy = true;
        this.isSearching = true;
        this.appRestaurantService.getRegisteredRestaurantsByCity(cityName).subscribe(res => {
            if (res.content == null) {
                this.citySearchResults = [];
            } else {
                this.citySearchResults = <CitySearch[]>[...res.content];
            }

            this.clientState.isBusy = false;
            this.isSearching = false;
        }, (err: ApiError) => {
            this.citySearchResults = [];
            this.clientState.isBusy = false;
            this.isSearching = false;
        })
    }

    onSearchRestaurantByCity = (cityName: string) => {
        if (this.cityTimeout) {
            clearTimeout(this.cityTimeout);
        };
        this.cityTimeout = setTimeout(() => {
            this.restaurantAreaSearch = <AreaSearch>{
                city: cityName,
                district: '',
                address: '',
                languageCode: this.i18nService.language.split('-')[0].toLocaleLowerCase()
            };
            this.storageService.onSetToken(StorageKey.RestaurantAreaSearch, JwtTokenHelper.CreateSigningToken(this.restaurantAreaSearch));
            this.router.navigate(['./child']);
        }, 200);
    }

    onKeyDownOnInput = (cityName: string) => {
        let firstEl = this.citySearchResults && this.citySearchResults[0] && this.citySearchResults[0] || null;
        if (firstEl) {
            firstEl.active = true;
            this.onFocusElement(firstEl.name)
        }
    }

    onKeyUp = (cityName: string) => {
        let currentIndex = this.citySearchResults.findIndex(c => c.name == cityName);
        let prevIndex = currentIndex >= 1 ? (currentIndex - 1) : 0;
        this.citySearchResults[prevIndex].active = true;
        this.onFocusElement(this.citySearchResults[prevIndex].name);
        this.citySearchResults.map(c => {
            if (c.name != this.citySearchResults[prevIndex].name) {
                c.active = false;
            }
        });
    }

    onKeyDown = (cityName: string) => {
        let currentIndex = this.citySearchResults.findIndex(c => c.name == cityName);
        let nextIndex = currentIndex >= 0 ? (currentIndex + 1) : 0;
        this.citySearchResults[nextIndex].active = true;
        this.onFocusElement(this.citySearchResults[nextIndex].name);
        this.citySearchResults.map(c => {
            if (c.name != this.citySearchResults[nextIndex].name) {
                c.active = false;
            }
        })
    }

    onFocusElement = (cityName: string) => {
        const element = document.getElementById(`city-${cityName}`);// this.renderer.selectRootElement(`#city-${cityName}`);
        setTimeout(() => element.focus(), 0);
        element.scrollIntoView();
    }

    ngOnDestroy(): void {
        this.formCtrlSub.unsubscribe();
    }
}
