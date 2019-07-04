
import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RestaurantAdminModel, RestaurantModule, RestaurantStatus } from '../../../../models/restaurant/admin-restaurant.model';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { Address } from 'cluster';
import { CategoryAdminModel, CategoryViewModel, CategoryModule } from '../../../../models/category/admin-category.model';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { CategoryAdminService } from '../../../../services/api/category/admin-category.service';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { UserAdminModel, UserViewModel, UserModule } from '../../../../models/user/admin-user.model';
import { I18nService } from '../../../../core/i18n.service';
import { GoogleApiService } from '../../../../services/google-api/google-api.service';
import { StorageService } from '../../../../core/storage.service';
import { IpInfo } from '../../../../models/ipinfo/ipinfo.model';
import { StorageKey } from '../../../../services/storage-key/storage-key';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';
import { LatLongModel } from '../../../../models/google/country-latlong.model';
import { MapsAPILoader, AgmMap } from '../../../../../../../node_modules/@agm/core';
import { Subscription } from '../../../../../../../node_modules/rxjs';
import { CityService, DistrictService } from '../../../../services';
import { CityModel } from '../../../../models/city/city.model';
import { DistrictModel } from '../../../../models/district/district.model';

@Component({
    selector: 'restaurant-creation',
    templateUrl: './restaurant-creation.component.html',
    styleUrls: ['./restaurant-creation.component.scss']
})

export class AdminRestaurantCreationComponent implements OnInit, AfterViewInit, OnDestroy {
    private restaurantModel: RestaurantAdminModel = new RestaurantAdminModel();
    private languageSupported: Language[] = [];
    private message: string;
    private isError: boolean;
    private googleAddressLine1: string = '';
    private googleAddressLine2: string = '';
    private fileUpload: File = null;
    private categoryAdminModels: CategoryAdminModel[] = [];
    private categoryViewModels: CategoryViewModel[] = [];
    private categorySearchResults: CategoryViewModel[] = [];
    private categoryIdsSelected: Array<number> = [];
    private userAdminModels: UserAdminModel[] = [];
    private userViewModels: UserViewModel[] = []
    private userSearchResults: UserViewModel[] = [];
    private userIdsSelected: Array<number> = [];
    private longTitude: number;
    private latTitude: number;
    private imgUrl: string;
    public currentPosition: LatLongModel;
    private currentCountryCode: string = JwtTokenHelper.countryCode;

    public latitude: number;
    public longitude: number;
    public zoom: number;
    private agmMapSub: Subscription;
    private isSearchAuto: boolean;
    private addTimeout: any;
    private isSearchAddress: boolean;
    private isSearchAddressError: boolean;
    private isInvalidAddress: boolean;
    private validateAddressTimeout: any;
    private currentAddress: string;
    private cityModels: CityModel[] = [];
    private districtModels: DistrictModel[] = [];

    @ViewChild('searchControl') searchElementRef: ElementRef;
    @ViewChild('agmMap') agmMap: AgmMap;

    constructor(
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private restaurantAdminService: RestaurantAdminService,
        private categoryAdminService: CategoryAdminService,
        private userAdminService: UserAdminService,
        private i18nService: I18nService,
        private googleService: GoogleApiService,
        private storageService: StorageService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private cityService: CityService,
        private districtService: DistrictService,
        private cdRef: ChangeDetectorRef,
    ) {
        this.googleService.getCountryCode().subscribe(res => {
            let ipInfo: IpInfo = <IpInfo>{ ...res };
            this.storageService.onSetToken(StorageKey.IPInfo, JwtTokenHelper.CreateSigningToken(ipInfo));
            this.currentCountryCode = JwtTokenHelper.countryCode;
        }, err => {
            this.currentCountryCode = JwtTokenHelper.countryCode;
        });

    }

    ngOnInit(): void {
        this.onInitRestaurant();
        this.onGetAllCategorySortByName();
        this.onGetAllUserSortByName();
        this.zoom = 12;
        this.latitude = 12.136389;
        this.longitude = -86.251389;
        this.currentPosition = <LatLongModel>{ lat: this.latitude, lng: this.longitude };
        this.onGetCities();

        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(this.getPosition, err => {
        //     });
        // }
    }

    ngAfterViewInit(): void {
        this.mapsAPILoader.load().then(() => {
            let inputElement = this.searchElementRef.nativeElement;

            let autocomplete = new google.maps.places.Autocomplete(inputElement, {
                types: ["address"],
                componentRestrictions: { country: [this.currentCountryCode.toString()] }
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (!place.geometry || place.geometry === undefined || place.geometry === null) {
                        this.isSearchAddressError = true;
                        return;
                    }
                    if (this.validateAddressTimeout) {
                        clearTimeout(this.validateAddressTimeout);
                    }
                    this.isSearchAuto = true;
                    let cityObj = place.address_components.find(i => { return i.types.indexOf('locality') != -1 })
                    this.restaurantModel.city = cityObj && cityObj.long_name;
                    let districtObj = place.address_components.find(i => { return i.types.indexOf('sublocality') != -1 })
                    this.restaurantModel.district = districtObj && districtObj.long_name;
                    this.restaurantModel.address = place.formatted_address;
                    this.currentAddress = this.restaurantModel.address;
                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.restaurantModel.latitude = this.latitude;
                    this.restaurantModel.longitude = this.longitude;
                    this.isSearchAddressError = false;
                    this.currentPosition = <LatLongModel>{ lat: this.latitude, lng: this.longitude };
                });
            });
        });

    }

    onGetCities = () => {
        this.cityService.onGetCities().subscribe(res => {
            this.cityModels = res.content && res.content.data ? <CityModel[]>[...res.content.data] : [];
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    onGetDistrictByCity = (cityId: number) => {
        this.districtService.onGetDistrictByCity(cityId).subscribe(res => {
            this.districtModels = res.content ? <DistrictModel[]>[...res.content] : [];
            this.restaurantModel.districtId = null;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    onChangeAddress = () => {
        this.restaurantModel.latitude = null;
        this.restaurantModel.longitude = null;
    }

    onBlurSearch = () => {
        if (this.validateAddressTimeout) {
            clearTimeout(this.validateAddressTimeout);
        }

        if (!!this.restaurantModel.address && !this.restaurantModel.latitude && !this.restaurantModel.longitude) {
            this.validateAddressTimeout = setTimeout(() => {
                this.isSearchAddressError = true;
            }, 3000);
        }
    }

    onFocusSearch = () => {
        if (this.restaurantModel.address) {
            this.isSearchAddressError = false;
        }
    }

    getPosition = (position) => {
        this.latitude = +position.coords.latitude;
        this.longitude = +position.coords.longitude;

        this.currentPosition = <LatLongModel>{ lat: position.coords.latitude, lng: position.coords.longitude };
    }

    onGetAddressFromLatLng = (lat: number, lng: number, isLatPress) => {
        if (this.isSearchAuto && this.restaurantModel.latitude && this.restaurantModel.longitude) {
            if (isLatPress) {
                this.restaurantModel.longitude = null;
                lng = this.restaurantModel.longitude;
            } else {
                this.restaurantModel.latitude = null;
                lat = this.restaurantModel.latitude;
            }
            this.restaurantModel.address = "";
            this.isSearchAuto = false;
        }
        if (!lat || !lng) {
            return;
        }

        if (this.addTimeout) {
            clearTimeout(this.addTimeout);
        }
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(+lat, +lng);
        let request = { location: latlng, };

        this.addTimeout = setTimeout(() => {
            this.isSearchAddress = true;
            this.clientState.isBusy = true;
            this.isSearchAddressError = false;
            geocoder.geocode(request, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    let result = results[0];
                    if (result != null) {
                        if (this.validateAddressTimeout) {
                            clearTimeout(this.validateAddressTimeout);
                        }
                        this.latitude = result.geometry.location.lat();
                        this.longitude = result.geometry.location.lng();
                        this.restaurantModel.latitude = this.latitude;
                        this.restaurantModel.longitude = this.longitude;
                        this.currentPosition = <LatLongModel>{ lat: this.latitude, lng: this.longitude };
                        this.restaurantModel.address = result.formatted_address;
                        this.currentAddress = this.restaurantModel.address;
                        this.isSearchAddress = false;
                        this.isSearchAddressError = false;
                        this.clientState.isBusy = false;
                        this.isSearchAddressError = false;
                    } else {
                        this.isSearchAddress = false;
                        this.isSearchAddressError = true;
                        this.clientState.isBusy = false;
                    }
                } else {
                    this.isSearchAddress = false;
                    this.isSearchAddressError = true;
                    this.clientState.isBusy = false;
                }
            });
        }, 2000);
    }

    onInitRestaurant = () => {
        this.clientState.isBusy = true;
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });
            this.restaurantModel = <RestaurantAdminModel>{
                ...this.restaurantModel,
                status: RestaurantStatus.Active,
                languageLst: this.languageSupported.map(lang => {
                    return RestaurantModule.initTranslator(lang);
                })
            };

            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

    //---Multiple select category
    onGetAllCategorySortByName = () => {
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        this.categoryAdminService.getCategorySortByName(languageCode).subscribe(res => {
            if (res.content == null) {
                this.categoryAdminModels = [];
            } else {
                this.categoryAdminModels = <CategoryAdminModel[]>[...res.content];
            }

            if (this.categoryAdminModels && this.categoryAdminModels.length > 0) {
                this.categoryViewModels = this.categoryAdminModels.map(category => {
                    return CategoryModule.toViewModel(category);
                });
                if (this.categoryViewModels && this.categoryViewModels.length > 0) {
                    this.categorySearchResults = this.categoryViewModels;
                }
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    filterCategoriesMultiple(event) {
        let query = event.query;
        this.categorySearchResults = this.categoryViewModels.filter(
            category => category.categoryName.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) != -1
        );
    }

    onSelectCategory = (event: CategoryViewModel) => {
        if (!this.categoryIdsSelected.some(i => i == event.categoryId)) {
            this.categoryIdsSelected.push(event.categoryId);
        }
    }

    onUnSelectCategory = (event: CategoryViewModel) => {
        if (this.categoryIdsSelected.some(i => i == event.categoryId)) {
            this.categoryIdsSelected = this.categoryIdsSelected.filter(i => i != event.categoryId);
        }
    }

    //---Multiple select user
    onGetAllUserSortByName = () => {
        this.userAdminService.getAllUserSortByName().subscribe(res => {
            if (res.content == null) {
                this.userAdminModels = [];
            } else {
                this.userAdminModels = <UserAdminModel[]>[...res.content]
            }
            if (this.userAdminModels && this.userAdminModels.length > 0) {
                this.userViewModels = this.userAdminModels.map(user => {
                    return UserModule.toViewModel(user);
                });
                if (this.userViewModels && this.userViewModels.length > 0) {
                    this.userSearchResults = this.userViewModels;
                }
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    filterUsersMultiple(event) {
        let query = event.query;
        this.userSearchResults = this.userViewModels.filter(
            user => user.userName.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) != -1
        );
    }

    onSelectUser = (event: UserViewModel) => {
        if (!this.userIdsSelected.some(i => i == event.userId)) {
            this.userIdsSelected.push(event.userId);
        }
    }

    onUnSelectUser = (event: UserViewModel) => {
        if (this.userIdsSelected.some(i => i == event.userId)) {
            this.userIdsSelected = this.userIdsSelected.filter(i => i != event.userId);
        }
    }

    detectFiles(event) {
        let file: File = event.target.files && <File>event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.imgUrl = event.target.result;
            }

            reader.readAsDataURL(file);
            this.restaurantModel.file = file;
        }
    }

    onSubmit = (isValid: boolean) => {
        if (!isValid || this.isSearchAddressError) {
            return;
        }
        this.clientState.isBusy = true;
        let newRestaurant = <RestaurantAdminModel>{
            ...this.restaurantModel,
        };

        this.restaurantAdminService.createRestaurant(newRestaurant).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/restaurant']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        });
    }

    setAddressLine1 = (place: Address) => {

    }

    onGetDistrictLine1 = (district: string) => {
        this.restaurantModel.district = district;
    }

    onGetCityLine1 = (city: string) => {
        this.restaurantModel.city = city;
    }

    onGetAddressLine1 = (address: string) => {
        this.googleAddressLine1 = address.replace(new RegExp(/(<([^>]+)>)/ig), '');
    }

    onGetLatitude = (lat: string) => {
        this.restaurantModel.latitude = +lat;
    }

    onGetLongtitude = (lng: string) => {
        this.restaurantModel.longitude = +lng;
    }

    ngOnDestroy(): void {
        // this.latCtrlSub.unsubscribe();
        // this.lngCtrlSub.unsubscribe();
    }
}
