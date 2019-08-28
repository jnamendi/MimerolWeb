
import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RestaurantAdminModel, RestaurantModule, RestaurantStatus, RestaurantWorkTimeModels, WorkTimeList } from '../../../../models/restaurant/admin-restaurant.model';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { Address } from 'cluster';
import { CategoryAdminModel } from '../../../../models/category/admin-category.model';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../services/api/language/language.service';
import { RestaurantAdminService } from '../../../../services/api/restaurant/admin-restaurant.service';
import { CategoryAdminService } from '../../../../services/api/category/admin-category.service';
import { UserAdminService } from '../../../../services/api/user/admin-user.service';
import { UserAdminModel } from '../../../../models/user/admin-user.model';
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
import { DistrictModel, District2Model } from '../../../../models/district/district.model';
import { CityDistricsModel } from '../../../../models/city/city-district.model';
import { weekdays } from 'moment';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

@Component({
    selector: 'restaurant-creation',
    templateUrl: './restaurant-creation.component.html',
    styleUrls: ['./restaurant-creation.component.scss']
})

export class AdminRestaurantCreationComponent implements OnInit, AfterViewInit {
    private restaurantModel: RestaurantAdminModel = new RestaurantAdminModel();
    private languageSupported: Language[] = [];
    private message: string;
    private isError: boolean;
    private googleAddressLine1: string = '';
    private googleAddressLine2: string = '';
    private fileUpload: File = null;
    private categoryAdminModels: CategoryAdminModel[] = [];
    private userAdminModels: UserAdminModel[] = [];
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
    private cityModelsTemp: CityModel[] = [];
    private cityMultipleDistrictsModel: CityDistricsModel[] = [];

    private districtModels: DistrictModel[] = [];
    private multipleDistrictCityModels: DistrictModel[] = [];
    private multipleDistrictCityModelsTemp: DistrictModel[] = [];

    private district2Model: District2Model[] = [];

    private restaurantWorkTimeModels: RestaurantWorkTimeModels = new RestaurantWorkTimeModels();
    private checkOpenLesserClose: boolean = false;
    private errorIsValid: boolean = false;
    private x: number;
    private y: number;

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
        this.onAutoCreateRestaurantWorkTimeId();
        this.cityMultipleDistrictsModel.push(<CityDistricsModel>{
            cityId: 0
        })
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
            this.cityModelsTemp = res.content && res.content.data ? <CityModel[]>[...res.content.data] : [];
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

    onGetDistrictByCityMultiple = (id: number) => {
        this.districtService.onGetDistrictByCityMultiple(id).subscribe(res => {
            if (res.content == null) {
                this.multipleDistrictCityModels = [];
            } else {
                this.multipleDistrictCityModels = <DistrictModel[]>[...res.content];
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    // onGetListDistrictByCity = (cityIds: number) => {
    //     this.onGetDistrictByCityMultiple(cityIds);
    //     this.cityMultipleDistrictsModel.forEach(items => {
    //         if (items.cityId === cityIds) {
    //             let index = this.cityMultipleDistrictsModel.findIndex(x => x.cityId === cityIds);
    //             this.cityMultipleDistrictsModel.splice(index, 1);
    //             this.cityMultipleDistrictsModel.push(...this.cityModelsTemp.filter(x => x.cityId === cityIds));
    //         } else {
    //             this.cityMultipleDistrictsModel.splice(-1, 1);
    //             this.cityMultipleDistrictsModel.push(...this.cityModelsTemp.filter(x => x.cityId === cityIds));
    //         }
    //     })

    //     this.cityMultipleDistrictsModel.forEach(items => {
    //         if (items.cityId === cityIds) {
    //             this.onGetDistrictByCityMultiple(cityIds);
    //             items.districs = [];
    //             this.multipleDistrictCityModels.forEach(element => {
    //                 let t = new District2Model();
    //                 t.cityId = cityIds;
    //                 t.code = element.code;
    //                 t.districtId = element.districtId;
    //                 t.status = element.status;
    //                 t.name = element.name;
    //                 items.districs.push(t);
    //             });
    //         } else {
    //             this.onGetDistrictByCityMultiple(cityIds);
    //             items.districs = [];
    //             this.multipleDistrictCityModels.forEach(element => {
    //                 let t = new District2Model();
    //                 t.cityId = cityIds;
    //                 t.code = element.code;
    //                 t.districtId = element.districtId;
    //                 t.status = element.status;
    //                 t.name = element.name;
    //                 items.districs.push(t);
    //             });
    //         }
    //     })
    //     console.log(cityIds);
    //     console.log(this.multipleDistrictCityModels);
    //     console.log(this.cityMultipleDistrictsModel);
    // }

    // onAddCity = () => {
    //     this.cityMultipleDistrictsModel.push(<CityDistricsModel>{
    //         cityId: 0
    //     })
    // }

    // onRemoveCity = (idCity: number) => {
    //     let index = this.cityMultipleDistrictsModel.findIndex(x => x.cityId === idCity);
    //     this.cityMultipleDistrictsModel && this.cityMultipleDistrictsModel.splice(index, 1);
    // }

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
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    //---Multiple select user
    onGetAllUserSortByName = () => {
        this.userAdminService.getAllUserSortByName().subscribe(res => {
            if (res.content == null) {
                this.userAdminModels = [];
            } else {
                this.userAdminModels = <UserAdminModel[]>[...res.content]
            }
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
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
            this.errorIsValid = true;
            return;
        } else {
            this.errorIsValid = false;
        }

        for (let i = 0; i < this.restaurantModel.restaurantWorkTimeModels.length; i++) {
            if (this.restaurantModel.restaurantWorkTimeModels[i].list.length != 0) {
                for (let j = 0; j < this.restaurantModel.restaurantWorkTimeModels[i].list.length; j++) {
                    if (j > 0) {
                        let vTimes = this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime.split(":");
                        let vH = parseFloat(vTimes[0]);
                        let vM = parseFloat(vTimes[1]);

                        let eTimes = this.restaurantModel.restaurantWorkTimeModels[i].list[j - 1].closeTime.split(":");
                        let eH = parseFloat(eTimes[0]);
                        let eM = parseFloat(eTimes[1]);

                        if (vH <= eH) {
                            this.checkOpenLesserClose = true;
                            this.x = i;
                            this.y = j;
                            return;
                        } else {
                            this.checkOpenLesserClose = false;
                        }

                        if (vH == eH && vM <= eM) {
                            this.checkOpenLesserClose = true;
                            this.x = i;
                            this.y = j;
                            return;
                        } else {
                            this.checkOpenLesserClose = false;
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.restaurantModel.restaurantWorkTimeModels.length; i++) {
            if (this.restaurantModel.restaurantWorkTimeModels[i].list.length > 1) {
                for (let j = 0; j < this.restaurantModel.restaurantWorkTimeModels[i].list.length; j++) {
                    if (this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime == "" || this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime == null) {
                        this.restaurantModel.restaurantWorkTimeModels[i].list.splice(j, 1);
                    }
                }
            } else if (this.restaurantModel.restaurantWorkTimeModels[i].list[0].openTime == "" || this.restaurantModel.restaurantWorkTimeModels[i].list[0].openTime == null) {
                this.restaurantModel.restaurantWorkTimeModels.splice(i, 1);
            }
        }

        this.clientState.isBusy = true;
        let newRestaurant = <RestaurantAdminModel>{
            ...this.restaurantModel,
        };
        this.restaurantAdminService.createRestaurant(newRestaurant).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/restaurant']);
            },
            error: (err: ApiError) => {
                this.message = err.message;
                this.isError = true;
                this.clientState.isBusy = false;
            },
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

    onAutoCreateRestaurantWorkTimeId = () => {
        if (this.restaurantModel.restaurantWorkTimeModels.length == 0) {
            let max = 7, day = "";
            for (let i = 0; i < max; i++) {
                if (i == 0) day = "MON";
                else if (i == 1) day = "TUE";
                else if (i == 2) day = "WED";
                else if (i == 3) day = "THU";
                else if (i == 4) day = "FRI";
                else if (i == 5) day = "SAT";
                else if (i == 6) day = "SUN";
                this.restaurantModel.restaurantWorkTimeModels.push(<RestaurantWorkTimeModels>{
                    weekDay: day,
                    list: [],
                })
                for (let j = 0; j < this.restaurantModel.restaurantWorkTimeModels.length; j++) {
                    if (this.restaurantModel.restaurantWorkTimeModels[j].list.length == 0) {
                        this.restaurantModel.restaurantWorkTimeModels[j].list.push(<WorkTimeList>{
                            openTime: "",
                            closeTime: "",
                            idRestaurantWork: j
                        })
                    }
                }
            }
        }
    }

    onAddMoreExtraItem = (val: WorkTimeList[], ex: WorkTimeList) => {
        val.push(<WorkTimeList>{
            idRestaurantWork: Math.max.apply(Math, ex.idRestaurantWork) + 1
        })
    }

    onRemoveExtraItem = (menuExtra: WorkTimeList[]) => {
        let index = menuExtra.findIndex(e => e == menuExtra);
        menuExtra && menuExtra.splice(index, 1);
    }
}
