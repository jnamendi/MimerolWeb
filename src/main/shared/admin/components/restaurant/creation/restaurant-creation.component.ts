import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { RestaurantAdminModel, RestaurantModule, RestaurantStatus, RestaurantWorkTimeModels, WorkTimeList } from "../../../../models/restaurant/admin-restaurant.model";
import { ClientState } from "../../../../state";
import { Language } from "../../../../models/langvm.model";
import { ApiError } from "../../../../services/api-response/api-response";
import { Address } from "cluster";
import { CategoryAdminModel } from "../../../../models/category/admin-category.model";
import { Router } from "@angular/router";
import { LanguageService } from "../../../../services/api/language/language.service";
import { RestaurantAdminService } from "../../../../services/api/restaurant/admin-restaurant.service";
import { CategoryAdminService } from "../../../../services/api/category/admin-category.service";
import { UserAdminService } from "../../../../services/api/user/admin-user.service";
import { UserAdminModel } from "../../../../models/user/admin-user.model";
import { I18nService } from "../../../../core/i18n.service";
import { GoogleApiService } from "../../../../services/google-api/google-api.service";
import { StorageService } from "../../../../core/storage.service";
import { IpInfo } from "../../../../models/ipinfo/ipinfo.model";
import { StorageKey } from "../../../../services/storage-key/storage-key";
import { JwtTokenHelper } from "../../../../common/jwt-token-helper/jwt-token-helper";
import { LatLongModel } from "../../../../models/google/country-latlong.model";
import { MapsAPILoader, AgmMap } from "../../../../../../../node_modules/@agm/core";
import { Subscription } from "../../../../../../../node_modules/rxjs";
import { CityService, DistrictService, ZoneService, PaymentService } from "../../../../services";
import { CityModel } from "../../../../models/city/city.model";
import { DistrictModel, DeliveryDistrictModel } from "../../../../models/district/district.model";
import { DeliveryCityModel } from "../../../../models/city/city-district.model";
import { ZoneModel } from "../../../../models/zone/zone.model";
import { PaymentModel } from "../../../../models/payment/payment.model";
import { AmazingTimePickerService } from "amazing-time-picker";

@Component({
  selector: "restaurant-creation",
  templateUrl: "./restaurant-creation.component.html",
  styleUrls: ["./restaurant-creation.component.scss"]
})
export class AdminRestaurantCreationComponent implements OnInit, AfterViewInit {
  private restaurantModel: RestaurantAdminModel = new RestaurantAdminModel();
  private languageSupported: Language[] = [];
  private message: string;
  private isError: boolean;
  private googleAddressLine1: string = "";
  private googleAddressLine2: string = "";
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
  private districtModels: DistrictModel[] = [];
  private zoneModels: ZoneModel[] = [];
  private paymentModels: PaymentModel[] = [];

  private deliveryCityModelsTemp: CityModel[] = [];
  private multipleDeliveryDistrictModels: DistrictModel[] = [];
  private deliveryCitiesModel: DeliveryCityModel[] = [];
  private deliveryDistrictModel: DeliveryDistrictModel[] = [];

  private restaurantWorkTimeModels: RestaurantWorkTimeModels = new RestaurantWorkTimeModels();
  private errorIsValid: boolean = false;
  private checkOpenLesserClose: boolean = false;
  private checkOpenGreaterClose: boolean = false;
  private checkOpenTimeIsNull: boolean = false;
  private checkCloseTimeIsNull: boolean = false;
  private datePosition: number;
  private positionTimeOfDate: number;

  @ViewChild("searchControl") searchElementRef: ElementRef;
  @ViewChild("agmMap") agmMap: AgmMap;

  @ViewChild("latitude") latitudeElement: ElementRef;
  @ViewChild("longitude") longitudeElement: ElementRef;

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
    private zoneService: ZoneService,
    private paymentService: PaymentService,
    private cdRef: ChangeDetectorRef,
    private atp: AmazingTimePickerService
  ) {
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
  }

  ngOnInit(): void {
    this.onInitRestaurant();
    this.onGetAllCategorySortByName();
    this.onGetAllUserSortByName();
    this.zoom = 12;
    this.latitude = 12.136389;
    this.longitude = -86.251389;
    this.currentPosition = <LatLongModel>{
      lat: this.latitude,
      lng: this.longitude
    };
    this.onGetCities();
    this.onAutoCreateRestaurantWorkTimeId();
    this.deliveryCitiesModel.push(<DeliveryCityModel>{
      cityId: 0
    });
    this.onGetPayment();
    this.restaurantModel.paymentProviderLstId = [];
    this.restaurantModel.paymentProviderLstId.push(1);
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
          if (
            !place.geometry ||
            place.geometry === undefined ||
            place.geometry === null
          ) {
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
          this.restaurantModel.district = districtObj && districtObj.long_name;
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

  onGetPayment = () => {
    this.paymentService.onGetAllPayment().subscribe(
      res => {
        this.paymentModels =
          res.content && res.content
            ? <PaymentModel[]>[...res.content]
            : [];
      },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onGetCities = () => {
    this.cityService.onGetCities().subscribe(
      res => {
        this.cityModels =
          res.content && res.content.data
            ? <CityModel[]>[...res.content.data]
            : [];
        this.deliveryCityModelsTemp =
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

  onGetDistrictByCity = (cityId: number) => {
    this.districtService.onGetDistrictByCity(cityId).subscribe(
      res => {
        this.districtModels = res.content
          ? <DistrictModel[]>[...res.content]
          : [];
        this.multipleDeliveryDistrictModels = res.content
          ? <DistrictModel[]>[...res.content]
          : [];
        this.restaurantModel.districtId = null;
      },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onGetZoneByDistrict = (districtId: number) => {
    this.zoneService.onGetZoneByDistrict(districtId).subscribe(res => {
      this.zoneModels = res.content ? <ZoneModel[]>[...res.content] : [];
    },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onConvertPayment = (paymentProviderLstTemp: number[]) => {
    this.restaurantModel.paymentProviderLst = [];
    paymentProviderLstTemp.map(id => {
      let temp = this.paymentModels.filter(x => x.paymentProviderId == id);
      if (temp != null) this.restaurantModel.paymentProviderLst.push(...temp);
    })
  }

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

  getPosition = position => {
    this.latitude = +position.coords.latitude;
    this.longitude = +position.coords.longitude;

    this.currentPosition = <LatLongModel>{
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
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

  onInitRestaurant = () => {
    this.clientState.isBusy = true;
    this.languageService.getLanguagesFromService().subscribe(
      res => {
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
      },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      }
    );
  };

  //---Multiple select category
  onGetAllCategorySortByName = () => {
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
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  //---Multiple select user
  onGetAllUserSortByName = () => {
    this.userAdminService.getAllUserSortByName().subscribe(
      res => {
        if (res.content == null) {
          this.userAdminModels = [];
        } else {
          this.userAdminModels = <UserAdminModel[]>[...res.content];
        }
      },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  detectFiles(event) {
    let file: File = event.target.files && <File>event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };

      reader.readAsDataURL(file);
      this.restaurantModel.file = file;
    }
  }

  onValidateWorkingTime = (openTime: string, closeTime: string) => {
    let openTimeTemp = openTime.split(":");
    let openHour = parseFloat(openTimeTemp[0]);
    let openMinute = parseFloat(openTimeTemp[1]);
    let closeTimeTemp = closeTime.split(":");
    let closeHour = parseFloat(closeTimeTemp[0]);
    let closeMinute = parseFloat(closeTimeTemp[1]);

    if (closeHour == openHour && closeMinute == openMinute) return true;
    else if (closeHour < openHour) return true;
    else if (closeHour == openHour && closeMinute <= openMinute) return true;
    return false;
  }

  onScrollIntoViewValidate = (id: HTMLElement) => {
    id.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  onSubmit = (isValid: boolean) => {
    if (!isValid) {
      this.errorIsValid = true;
      return;
    } else {
      this.errorIsValid = false;
    }

    for (let indexDate = 0; indexDate < this.restaurantModel.restaurantWorkTimeModels.length; indexDate++) {
      if (this.restaurantModel.restaurantWorkTimeModels[indexDate].list.length != 0) {
        for (let indexTimeOfDate = 0; indexTimeOfDate < this.restaurantModel.restaurantWorkTimeModels[indexDate].list.length; indexTimeOfDate++) {
          this.checkOpenGreaterClose = false;
          this.checkOpenLesserClose = false;
          this.checkCloseTimeIsNull = false;
          this.checkOpenTimeIsNull = false;
          if (this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].openTime == ""
            && this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].closeTime != "") {
            this.checkOpenTimeIsNull = true;
            this.datePosition = indexDate;
            this.positionTimeOfDate = indexTimeOfDate;
            this.onScrollIntoViewValidate(document.getElementById("workingTimes"));
            return;
          } else if (this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].openTime != ""
            && this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].closeTime == "") {
            this.checkCloseTimeIsNull = true;
            this.datePosition = indexDate;
            this.positionTimeOfDate = indexTimeOfDate;
            this.onScrollIntoViewValidate(document.getElementById("workingTimes"));
            return;
          } else if (this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].openTime != ""
            && this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].closeTime != "") {
            this.checkOpenLesserClose = this.onValidateWorkingTime(this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].openTime,
              this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].closeTime);
            if (this.checkOpenLesserClose) {
              this.datePosition = indexDate;
              this.positionTimeOfDate = indexTimeOfDate;
              this.onScrollIntoViewValidate(document.getElementById("workingTimes"));
              return;
            }
            if (indexTimeOfDate > 0) {
              this.checkOpenGreaterClose = this.onValidateWorkingTime(this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate - 1].closeTime,
                this.restaurantModel.restaurantWorkTimeModels[indexDate].list[indexTimeOfDate].openTime);
              if (this.checkOpenGreaterClose) {
                this.datePosition = indexDate;
                this.positionTimeOfDate = indexTimeOfDate;
                this.onScrollIntoViewValidate(document.getElementById("workingTimes"));
                return;
              }
            }
          }
        }
      }
    }

    for (let indexWorkTime = this.restaurantModel.restaurantWorkTimeModels.length - 1; indexWorkTime >= 0; indexWorkTime--) {
      for (let indexItems = this.restaurantModel.restaurantWorkTimeModels[indexWorkTime].list.length - 1; indexItems >= 0; indexItems--) {
        if (this.restaurantModel.restaurantWorkTimeModels[indexWorkTime].list[indexItems].openTime == "") this.restaurantModel.restaurantWorkTimeModels[indexWorkTime].list.splice(indexItems, 1);
      }
      if (this.restaurantModel.restaurantWorkTimeModels[indexWorkTime].list.length == 0) {
        this.restaurantModel.restaurantWorkTimeModels.splice(indexWorkTime, 1);
      }
    }

    this.onConvertPayment(this.restaurantModel.paymentProviderLstId);

    this.clientState.isBusy = true;
    let newRestaurant = <RestaurantAdminModel>{
      ...this.restaurantModel
    };
    this.restaurantAdminService.createRestaurant(newRestaurant).subscribe({
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

  onAutoCreateRestaurantWorkTimeId = () => {
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
        this.restaurantModel.restaurantWorkTimeModels.push(<RestaurantWorkTimeModels>{
          weekDay: day,
          list: []
        });
        for (let j = 0; j < this.restaurantModel.restaurantWorkTimeModels.length; j++) {
          if (this.restaurantModel.restaurantWorkTimeModels[j].list.length == 0) {
            this.restaurantModel.restaurantWorkTimeModels[j].list.push(<WorkTimeList>{
              openTime: "",
              closeTime: "",
              idRestaurantWork: j
            });
          }
        }
      }
    }
  };

  onAddMoreExtraItem = (val: WorkTimeList[], ex: WorkTimeList) => {
    val.push(<WorkTimeList>{
      idRestaurantWork: Math.max.apply(Math, ex.idRestaurantWork) + 1,
      openTime: "",
      closeTime: ""
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
