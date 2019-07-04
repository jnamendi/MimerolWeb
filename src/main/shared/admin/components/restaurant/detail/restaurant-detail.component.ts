import { Component, ElementRef, ViewChild, NgZone, OnInit, AfterViewInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { RestaurantAdminModel, RestaurantModule } from '../../../../models/restaurant/admin-restaurant.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { ApiError } from '../../../../services/api-response/api-response';
import { Address } from 'cluster';
import { CategoryAdminModel, CategoryViewModel, CategoryModule } from '../../../../models/category/admin-category.model';
import { UserAdminModel, UserViewModel, UserModule } from '../../../../models/user/admin-user.model';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { CategoryAdminService } from '../../../../services/api/category/admin-category.service';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { LatLongModel } from '../../../../models/google/country-latlong.model';
import { I18nService } from '../../../../core/i18n.service';
import { GoogleApiService } from '../../../../services/google-api/google-api.service';
import { StorageService } from '../../../../core/storage.service';
import { IpInfo } from '../../../../models/ipinfo/ipinfo.model';
import { StorageKey } from '../../../../services/storage-key/storage-key';
import { JwtTokenHelper } from '../../../../common/jwt-token-helper/jwt-token-helper';
import { Subscription } from '../../../../../../../node_modules/rxjs';
import { AgmMap, MapsAPILoader } from '../../../../../../../node_modules/@agm/core';
import { CityService, DistrictService } from '../../../../services';
import { CityModel } from '../../../../models/city/city.model';
import { DistrictModel } from '../../../../models/district/district.model';

@Component({
    selector: 'restaurant-detail',
    templateUrl: './restaurant-detail.component.html',
    styleUrls: ['./restaurant-detail.component.scss']
})
export class AdminRestaurantDetailComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
    private sub: any;
    private restaurantId: number;
    private restaurantModel: RestaurantAdminModel = new RestaurantAdminModel();
    private message: string;
    private isError: boolean;
    private error: ApiError;
    private languageSupported: Language[] = [];
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
    public currentPosition: LatLongModel;
    private currentCountryCode: string = JwtTokenHelper.countryCode;
    private isFirstLoad: boolean = true;
    private imgUrl: string;

    public latitude: number;
    public longitude: number;
    public zoom: number;
    private agmMapSub: Subscription;
    private isSearchAuto: boolean;
    private addTimeout: any;
    private isSearchAddress: boolean;
    private isSearchAddressError: boolean;
    private validateAddressTimeout: any;
    private currentAddress: string;
    private cityModels: CityModel[] = [];
    private districtModels: DistrictModel[] = [];

    @ViewChild('searchControl') searchElementRef: ElementRef;
    @ViewChild('agmMap') agmMap: AgmMap;

    constructor(
        private route: ActivatedRoute,
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
        this.sub = this.route.params.subscribe(params => {
            this.restaurantId = +params['id'];
            if (this.restaurantId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetRestaurant(this.restaurantId);
                }, (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                });
            }
        });

        this.googleService.getCountryCode().subscribe(res => {
            let ipInfo: IpInfo = <IpInfo>{ ...res };
            this.storageService.onSetToken(StorageKey.IPInfo, JwtTokenHelper.CreateSigningToken(ipInfo));
            this.currentCountryCode = JwtTokenHelper.countryCode;
        }, err => {
            this.currentCountryCode = JwtTokenHelper.countryCode;
        });
        this.zoom = 12;
    }

    ngOnInit(): void {
        this.onGetAllCategorySortByName();
        this.onGetAllUserSortByName();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getPosition, err => {
            });
        }
        this.onGetCities();
    }

    ngAfterViewInit(): void {
        let inputElement = this.searchElementRef && this.searchElementRef.nativeElement;
        if (inputElement) {
            this.mapsAPILoader.load().then(() => {
                let autocomplete = new google.maps.places.Autocomplete(inputElement, {
                    types: ["address"],
                    componentRestrictions: { country: [this.currentCountryCode.toString()] }
                });
                autocomplete.addListener("place_changed", () => {
                    this.ngZone.run(() => {
                        //get the place result
                        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                        //verify result
                        if (place.geometry === undefined || place.geometry === null) {
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
    }

    ngAfterViewChecked(): void {
        // throw new Error("Method not implemented.");
    }

    getPosition = (position) => {
        this.currentPosition = <LatLongModel>{ lat: position.coords.latitude, lng: position.coords.longitude };
    }

    onGetCities = () => {
        this.cityService.onGetCities().subscribe(res => {
            this.cityModels = res.content && res.content.data ? <CityModel[]>[...res.content.data] : [];
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    onGetDistrictByCity = (cityId: number, isFirstLoad: boolean = false) => {
        this.districtService.onGetDistrictByCity(cityId).subscribe(res => {
            this.districtModels = res.content ? <DistrictModel[]>[...res.content] : [];
            this.restaurantModel.districtId = !isFirstLoad ? null : this.restaurantModel.districtId;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    onGetAddressFromLatLng = (lat: number, lng: number, isLatPress) => {
        if ((this.isFirstLoad || this.isSearchAuto) && this.restaurantModel.latitude && this.restaurantModel.longitude) {
            if (isLatPress) {
                this.restaurantModel.longitude = null;
                lng = this.restaurantModel.longitude;
            } else {
                this.restaurantModel.latitude = null;
                lat = this.restaurantModel.latitude;
            }
            this.restaurantModel.address = "";
            this.isSearchAuto = false;
            this.isFirstLoad = false;
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
            geocoder.geocode(request, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    let result = results[0];
                    let rsltAdrComponent = result.address_components;
                    let resultLength = rsltAdrComponent.length;
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
                        this.clientState.isBusy = false;
                        this.isSearchAddressError = false;

                    } else {
                        this.isSearchAddressError = true;
                        this.isSearchAddress = false;
                        this.clientState.isBusy = false;
                    }
                } else {
                    this.isSearchAddressError = true;
                    this.isSearchAddress = false;
                    this.clientState.isBusy = false;
                }
            });
        }, 2000);
    }

    onGetRestaurant = (restaurantId: number) => {
        this.clientState.isBusy = true;
        let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
        this.restaurantAdminService.getRestaurant(restaurantId, languageCode).subscribe(res => {
            let resModelFromRes = <RestaurantAdminModel>{ ...res.content };
            this.restaurantModel = {
                ...resModelFromRes,
                addressDesc: resModelFromRes.addressDesc || "",
                cityId: resModelFromRes.cityId || null,
                districtId: resModelFromRes.districtId || null,
                languageLst: resModelFromRes.languageLst || this.languageSupported.map(lang => {
                    return RestaurantModule.initTranslator(lang);
                })
            };
            if (this.restaurantModel.city) {
                this.onGetDistrictByCity(this.restaurantModel.cityId, true);
            }
            if (!this.restaurantModel) {
                this.router.navigate(['admin/restaurant']);
            }
            this.googleAddressLine1 = this.restaurantModel.address;
            this.latitude = this.restaurantModel.latitude;
            this.longitude = this.restaurantModel.longitude;
            this.currentPosition = <LatLongModel>{ lat: this.latitude, lng: this.longitude };

            this.clientState.isBusy = false;
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        })
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

    //---Multiple select category
    onGetAllCategorySortByName = () => {
        this.clientState.isBusy = true;
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
            if (err.status == 8) {
                this.userAdminModels = [];
            }
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
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
        this.clientState.isBusy = true;
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
            if (err.status == 8) {
                this.userAdminModels = [];
            }
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
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

    detectFiles(event: any) {
        if (event == null) return;
        let file: any = event.target.files && event.target.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.imgUrl = event.target.result;
            }

            reader.readAsDataURL(file);
            this.restaurantModel.file = file;
        }
    }

    onUpdateRestaurant = (isValid: boolean) => {
        if (!isValid || this.isSearchAddressError) {
            return;
        }
        let newRestaurant = <RestaurantAdminModel>{
            ...this.restaurantModel,
            address: this.googleAddressLine1,
        };

        this.clientState.isBusy = true;
        this.restaurantAdminService.updateRestaurant(newRestaurant).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/restaurant']);
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
        })
    }

    onDeleteRestaurant = () => {
        this.clientState.isBusy = true;
        this.restaurantAdminService.deleteRestaurant(+this.restaurantModel.restaurantId).subscribe(res => {
            this.clientState.isBusy = false;
            this.router.navigate(['admin/restaurant']);
        }, (err: ApiError) => {
            this.clientState.isBusy = false;
            this.message = err.message;
            this.isError = true;
        })
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
        this.sub.unsubscribe();
    }
}
