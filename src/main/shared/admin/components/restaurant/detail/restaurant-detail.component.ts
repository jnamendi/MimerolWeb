import {
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import {
  RestaurantAdminModel,
  RestaurantModule,
  RestaurantWorkTimeModels,
  WorkTimeList
} from "../../../../models/restaurant/admin-restaurant.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Language } from "../../../../models/langvm.model";
import { ClientState } from "../../../../state";
import { ApiError } from "../../../../services/api-response/api-response";
import { Address } from "cluster";
import { CategoryAdminModel } from "../../../../models/category/admin-category.model";
import { UserAdminModel } from "../../../../models/user/admin-user.model";
import { LanguageService } from "../../../../services/api/language/language.service";
import { RestaurantAdminService } from "../../../../services/api/restaurant/admin-restaurant.service";
import { CategoryAdminService } from "../../../../services/api/category/admin-category.service";
import { UserAdminService } from "../../../../services/api/user/admin-user.service";
import { LatLongModel } from "../../../../models/google/country-latlong.model";
import { I18nService } from "../../../../core/i18n.service";
import { GoogleApiService } from "../../../../services/google-api/google-api.service";
import { StorageService } from "../../../../core/storage.service";
import { IpInfo } from "../../../../models/ipinfo/ipinfo.model";
import { StorageKey } from "../../../../services/storage-key/storage-key";
import { JwtTokenHelper } from "../../../../common/jwt-token-helper/jwt-token-helper";
import { Subscription } from "../../../../../../../node_modules/rxjs";
import {
  AgmMap,
  MapsAPILoader
} from "../../../../../../../node_modules/@agm/core";
import { CityService, DistrictService } from "../../../../services";
import { CityModel } from "../../../../models/city/city.model";
import { DistrictModel } from "../../../../models/district/district.model";
import { AmazingTimePickerService } from "amazing-time-picker";

@Component({
  selector: "restaurant-detail",
  templateUrl: "./restaurant-detail.component.html",
  styleUrls: ["./restaurant-detail.component.scss"]
})
export class AdminRestaurantDetailComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private sub: any;
  private restaurantId: number;
  private restaurantModel: RestaurantAdminModel = new RestaurantAdminModel();
  private message: string;
  private isError: boolean;
  private error: ApiError;
  private languageSupported: Language[] = [];
  private googleAddressLine1: string = "";
  private googleAddressLine2: string = "";
  private fileUpload: File = null;

  private categoryAdminModels: CategoryAdminModel[] = [];
  private userAdminModels: UserAdminModel[] = [];

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

  private multipleDeliveryDistrictModels: DistrictModel[] = [];

  private restaurantWorkTimeModels: RestaurantWorkTimeModels = new RestaurantWorkTimeModels();
  private restaurantWorkTimeModelsTemp: RestaurantWorkTimeModels = new RestaurantWorkTimeModels();
  private errorIsValid: boolean = false;
  private checkOpenLesserClose: boolean = false;
  private checkOpenTimeIsNull: boolean = false;
  private checkCloseTimeIsNull: boolean = false;
  private x: number;
  private y: number;

  @ViewChild("searchControl") searchElementRef: ElementRef;
  @ViewChild("agmMap") agmMap: AgmMap;

  @ViewChild('latitude') latitudeElement: ElementRef;
  @ViewChild('longitude') longitudeElement: ElementRef;

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
    private atp: AmazingTimePickerService
  ) {
    this.sub = this.route.params.subscribe(params => {
      this.restaurantId = +params["id"];
      if (this.restaurantId >= 0) {
        this.languageService.getLanguagesFromService().subscribe(
          res => {
            this.languageSupported = res.content.data.map(lang => {
              return <Language>{ ...lang };
            });
            this.onGetRestaurant(this.restaurantId);
          },
          (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
          }
        );
      }
    });

    this.googleService.getCountryCode().subscribe(
      res => {
        let ipInfo: IpInfo = <IpInfo>{ ...res };
        this.storageService.onSetToken(
          StorageKey.IPInfo,
          JwtTokenHelper.CreateSigningToken(ipInfo)
        );
        this.currentCountryCode = JwtTokenHelper.countryCode;
      },
      err => {
        this.currentCountryCode = JwtTokenHelper.countryCode;
      }
    );
    this.zoom = 12;
  }

  ngOnInit(): void {
    this.onGetAllCategorySortByName();
    this.onGetAllUserSortByName();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getPosition, err => { });
    }
    this.onGetCities();
  }

  ngAfterViewInit(): void {
    let inputElement =
      this.searchElementRef && this.searchElementRef.nativeElement;
    if (inputElement) {
      this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(inputElement, {
          types: ["address"],
          componentRestrictions: {
            country: [this.currentCountryCode.toString()]
          }
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
            let cityObj = place.address_components.find(i => {
              return i.types.indexOf("locality") != -1;
            });
            this.restaurantModel.city = cityObj && cityObj.long_name;
            let districtObj = place.address_components.find(i => {
              return i.types.indexOf("sublocality") != -1;
            });
            this.restaurantModel.district =
              districtObj && districtObj.long_name;
            this.restaurantModel.address = place.formatted_address;
            this.currentAddress = this.restaurantModel.address;

            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.restaurantModel.latitude = this.latitude;
            this.restaurantModel.longitude = this.longitude;
            this.isSearchAddressError = false;
            this.currentPosition = <LatLongModel>{
              lat: this.latitude,
              lng: this.longitude
            };
          });
        });
      });
    }
  }

  getPosition = position => {
    this.currentPosition = <LatLongModel>{
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  };

  onGetCities = () => {
    this.cityService.onGetCities().subscribe(
      res => {
        this.cityModels =
          res.content && res.content.data
            ? <CityModel[]>[...res.content.data]
            : [];
      },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onGetDistrictByCity = (cityId: number, isFirstLoad: boolean = false) => {
    this.districtService.onGetDistrictByCity(cityId).subscribe(
      res => {
        this.districtModels = res.content
          ? <DistrictModel[]>[...res.content]
          : [];
        this.multipleDeliveryDistrictModels = res.content
          ? <DistrictModel[]>[...res.content]
          : [];
        this.restaurantModel.districtId = !isFirstLoad
          ? null
          : this.restaurantModel.districtId;
      },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onGetAddressFromLatLng = (lat: number, lng: number) => {
    if (this.restaurantModel.latitude && this.restaurantModel.longitude) {
      this.restaurantModel.address = "";
    }

    if (!lat || !lng) {
      return;
    }

    if (this.addTimeout) {
      clearTimeout(this.addTimeout);
    }

    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(+lat, +lng);
    let request = { location: latlng };

    this.addTimeout = setTimeout(() => {
      this.isSearchAddress = true;
      this.clientState.isBusy = true;
      this.latitudeElement.nativeElement.focus();

      geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];

          if (result != null) {
            if (this.validateAddressTimeout) {
              clearTimeout(this.validateAddressTimeout);
            }

            this.latitude = result.geometry.location.lat();
            this.longitude = result.geometry.location.lng();

            this.currentPosition = <LatLongModel>{
              lat: this.latitude,
              lng: this.longitude
            };

            this.restaurantModel.address = result.formatted_address;
            this.googleAddressLine1 = result.formatted_address;
            this.currentAddress = this.restaurantModel.address;

            this.isSearchAddress = false;
            this.clientState.isBusy = false;
            this.isSearchAddressError = false;
            this.longitudeElement.nativeElement.focus();
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
    }, 500);
  };

  onGetRestaurant = (restaurantId: number) => {
    this.clientState.isBusy = true;
    let languageCode = this.i18nService.language
      .split("-")[0]
      .toLocaleLowerCase();
    this.restaurantAdminService
      .getRestaurant(restaurantId, languageCode)
      .subscribe(
        res => {
          let resModelFromRes = <RestaurantAdminModel>{ ...res.content };
          this.restaurantModel = {
            ...resModelFromRes,
            addressDesc: resModelFromRes.addressDesc || "",
            cityId: resModelFromRes.cityId || null,
            districtId: resModelFromRes.districtId || null,
            languageLst:
              resModelFromRes.languageLst ||
              this.languageSupported.map(lang => {
                return RestaurantModule.initTranslator(lang);
              })
          };
          if (this.restaurantModel.city) {
            this.onGetDistrictByCity(this.restaurantModel.cityId, true);
          }
          if (!this.restaurantModel) {
            this.router.navigate(["admin/restaurant"]);
          }
          this.googleAddressLine1 = this.restaurantModel.address;
          this.latitude = this.restaurantModel.latitude;
          this.longitude = this.restaurantModel.longitude;
          this.currentPosition = <LatLongModel>{
            lat: this.latitude,
            lng: this.longitude
          };

          this.clientState.isBusy = false;

          this.onAutoCreateOpenClose();
        },
        (err: ApiError) => {
          this.message = err.message;
          this.isError = true;
          this.clientState.isBusy = false;
        }
      );
  };

  onChangeAddress = () => {
    this.restaurantModel.latitude = null;
    this.restaurantModel.longitude = null;
  };

  onBlurSearch = () => {
    if (this.validateAddressTimeout) {
      clearTimeout(this.validateAddressTimeout);
    }

    if (
      !!this.restaurantModel.address &&
      !this.restaurantModel.latitude &&
      !this.restaurantModel.longitude
    ) {
      this.validateAddressTimeout = setTimeout(() => {
        this.isSearchAddressError = true;
      }, 3000);
    }
  };

  onFocusSearch = () => {
    if (this.restaurantModel.address) {
      this.isSearchAddressError = false;
    }
  };

  //---Multiple select category
  onGetAllCategorySortByName = () => {
    this.clientState.isBusy = true;
    let languageCode = this.i18nService.language
      .split("-")[0]
      .toLocaleLowerCase();
    this.categoryAdminService.getCategorySortByName(languageCode).subscribe(
      res => {
        if (res.content == null) {
          this.categoryAdminModels = [];
        } else {
          this.categoryAdminModels = <CategoryAdminModel[]>[...res.content];
        }
      },
      (err: ApiError) => {
        if (err.status == 8) {
          this.userAdminModels = [];
        }
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      }
    );
  };

  //---Multiple select user
  onGetAllUserSortByName = () => {
    this.clientState.isBusy = true;
    this.userAdminService.getAllUserSortByName().subscribe(
      res => {
        if (res.content == null) {
          this.userAdminModels = [];
        } else {
          this.userAdminModels = <UserAdminModel[]>[...res.content];
        }
      },
      (err: ApiError) => {
        if (err.status == 8) {
          this.userAdminModels = [];
        }
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      }
    );
  };

  detectFiles(event: any) {
    if (event == null) return;
    let file: any = event.target.files && event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };

      reader.readAsDataURL(file);
      this.restaurantModel.file = file;
    }
  }

  onUpdateRestaurant = (isValid: boolean) => {
    for (
      let i = 0;
      i < this.restaurantModel.restaurantWorkTimeModels.length;
      i++
    ) {
      if (this.restaurantModel.restaurantWorkTimeModels[i].list.length != 0) {
        for (
          let j = 0;
          j < this.restaurantModel.restaurantWorkTimeModels[i].list.length;
          j++
        ) {
          if (
            this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime ==
              "" &&
            this.restaurantModel.restaurantWorkTimeModels[i].list[j]
              .closeTime != ""
          ) {
            this.checkOpenTimeIsNull = true;
            this.x = i;
            this.y = j;
            return;
          } else this.checkOpenTimeIsNull = false;

          if (
            this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime !=
              "" &&
            this.restaurantModel.restaurantWorkTimeModels[i].list[j]
              .closeTime == ""
          ) {
            this.checkCloseTimeIsNull = true;
            this.x = i;
            this.y = j;
            return;
          } else this.checkCloseTimeIsNull = false;

          if (
            this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime !=
            "" &&
            this.restaurantModel.restaurantWorkTimeModels[i].list[j]
              .closeTime != ""
          ) {
            let vTimes = this.restaurantModel.restaurantWorkTimeModels[i].list[
              j
            ].closeTime.split(":");
            let vH = parseFloat(vTimes[0]);
            let vM = parseFloat(vTimes[1]);

            let eTimes = this.restaurantModel.restaurantWorkTimeModels[i].list[
              j
            ].openTime.split(":");
            let eH = parseFloat(eTimes[0]);
            let eM = parseFloat(eTimes[1]);

            if (vH == eH && vM == eM) {
              this.checkOpenLesserClose = true;
              this.x = i;
              this.y = j;
              return;
            } else if (vH < eH) {
              this.checkOpenLesserClose = true;
              this.x = i;
              this.y = j;
              return;
            } else if (vH == eH && vM <= eM) {
              this.checkOpenLesserClose = true;
              this.x = i;
              this.y = j;
              return;
            } else {
              this.checkOpenLesserClose = false;
            }
          }

          if (j > 0) {
            let vTimes = this.restaurantModel.restaurantWorkTimeModels[i].list[
              j
            ].openTime.split(":");
            let vH = parseFloat(vTimes[0]);
            let vM = parseFloat(vTimes[1]);

            let eTimes = this.restaurantModel.restaurantWorkTimeModels[i].list[
              j - 1
            ].closeTime.split(":");
            let eH = parseFloat(eTimes[0]);
            let eM = parseFloat(eTimes[1]);

            if (vH == eH && vM == eM) {
              this.checkOpenLesserClose = true;
              this.x = i;
              this.y = j;
              return;
            } else if (vH < eH) {
              this.checkOpenLesserClose = true;
              this.x = i;
              this.y = j;
              return;
            } else if (vH == eH && vM <= eM) {
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

    for (
      let i = 0;
      i < this.restaurantModel.restaurantWorkTimeModels.length;
      i++
    ) {
      if (this.restaurantModel.restaurantWorkTimeModels[i].list.length > 1) {
        for (
          let j = 0;
          j < this.restaurantModel.restaurantWorkTimeModels[i].list.length;
          j++
        ) {
          if (
            this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime ==
            "" ||
            this.restaurantModel.restaurantWorkTimeModels[i].list[j].openTime ==
            null
          ) {
            this.restaurantModel.restaurantWorkTimeModels[i].list.splice(j, 1);
          }
        }
      } else if (
        this.restaurantModel.restaurantWorkTimeModels[i].list[0].openTime ==
        "" ||
        this.restaurantModel.restaurantWorkTimeModels[i].list[0].openTime ==
        null
      ) {
        this.restaurantModel.restaurantWorkTimeModels.splice(i, 1);
      }
    }

    // if (!isValid) {
    //   this.errorIsValid = true;
    //   return;
    // } else {
    //   this.errorIsValid = false;
    // }

    let newRestaurant = <RestaurantAdminModel>{
      ...this.restaurantModel,
      address: this.googleAddressLine1
    };
    this.clientState.isBusy = true;
    this.restaurantAdminService.updateRestaurant(newRestaurant).subscribe({
      complete: () => {
        this.clientState.isBusy = false;
        this.router.navigate(["admin/restaurant"]);
      },
      error: (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      }
    });
  };

  onDeleteRestaurant = () => {
    this.clientState.isBusy = true;
    this.restaurantAdminService
      .deleteRestaurant(+this.restaurantModel.restaurantId)
      .subscribe({
        complete: () => {
          this.clientState.isBusy = false;
          this.router.navigate(["admin/restaurant"]);
        },
        error: (err: ApiError) => {
          this.clientState.isBusy = false;
          this.message = err.message;
          this.isError = true;
        }
      });
  };

  setAddressLine1 = (place: Address) => { };

  onGetDistrictLine1 = (district: string) => {
    this.restaurantModel.district = district;
  };

  onGetCityLine1 = (city: string) => {
    this.restaurantModel.city = city;
  };

  onGetAddressLine1 = (address: string) => {
    this.googleAddressLine1 = address.replace(new RegExp(/(<([^>]+)>)/gi), "");
  };

  onGetLatitude = (lat: string) => {
    this.restaurantModel.latitude = +lat;
  };

  onGetLongtitude = (lng: string) => {
    this.restaurantModel.longitude = +lng;
  };

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onAutoCreateOpenClose = () => {
    if (this.restaurantModel.restaurantWorkTimeModels.length == 0) {
      let max = 7,
        day = "";
      for (let i = 0; i < max; i++) {
        if (i == 0) day = "MON";
        else if (i == 1) day = "TUE";
        else if (i == 2) day = "WED";
        else if (i == 3) day = "THU";
        else if (i == 4) day = "FRI";
        else if (i == 5) day = "SAT";
        else if (i == 6) day = "SUN";
        this.restaurantModel.restaurantWorkTimeModels.push(<
          RestaurantWorkTimeModels
          >{
            weekDay: day,
            list: []
          });
        for (
          let j = 0;
          j < this.restaurantModel.restaurantWorkTimeModels.length;
          j++
        ) {
          if (
            this.restaurantModel.restaurantWorkTimeModels[j].list.length == 0
          ) {
            this.restaurantModel.restaurantWorkTimeModels[j].list.push(<
              WorkTimeList
              >{
                openTime: "",
                closeTime: "",
                idRestaurantWork: j
              });
          }
        }
      }
    } else {
      for (
        let i = 0;
        i < this.restaurantModel.restaurantWorkTimeModels.length;
        i++
      ) {
        if (this.restaurantModel.restaurantWorkTimeModels[i].list.length == 0) {
          this.restaurantModel.restaurantWorkTimeModels[i].list.push(<
            WorkTimeList
            >{
              openTime: "",
              closeTime: "",
              idRestaurantWork: i
            });
        }
      }
    }
  };

  onAddMoreExtraItem = (val: WorkTimeList[], ex: WorkTimeList) => {
    val.push(<WorkTimeList>{
      idRestaurantWork: Math.max.apply(Math, ex.idRestaurantWork) + 1
    });
  };

  onRemoveExtraItem = (menuExtra: WorkTimeList[]) => {
    let index = menuExtra.findIndex(e => e == menuExtra);
    menuExtra && menuExtra.splice(index, 1);
  };

  // onOpenTimePicker = (x: number, y: number, timeStatus: number) => {
  //   const amazingTimePicker = this.atp.open();
  //   amazingTimePicker.afterClose().subscribe(time => {
  //     if (timeStatus == 0)
  //       this.restaurantModel.restaurantWorkTimeModels[x].list[
  //         y
  //       ].openTime = time;
  //     else
  //       this.restaurantModel.restaurantWorkTimeModels[x].list[
  //         y
  //       ].closeTime = time;
  //   });
  // };
  onRevertTime = (x: number, y: number) => {
    this.restaurantModel.restaurantWorkTimeModels[x].list[y].openTime = "";
    this.restaurantModel.restaurantWorkTimeModels[x].list[y].closeTime = "";
  };
}
