import { Component, ElementRef, ViewChild, NgZone, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { RestaurantAdminModel, RestaurantModule, RestaurantWorkTimeModels, WorkTimeList, DeliveryArea } from "../../../../models/restaurant/admin-restaurant.model";
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
import { AgmMap, MapsAPILoader } from "../../../../../../../node_modules/@agm/core";
import { CityService, DistrictService, ZoneService, PaymentService } from "../../../../services";
import { CityModel } from "../../../../models/city/city.model";
import { DistrictModel } from "../../../../models/district/district.model";
import { ZoneModel } from "../../../../models/zone/zone.model";
import { PaymentModel } from "../../../../models/payment/payment.model";
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
  private zoneModels: ZoneModel[] = [];
  private paymentModels: PaymentModel[] = [];

  private multipleDeliveryDistrictModels: DistrictModel[] = [];

  private restaurantWorkTimeModels: RestaurantWorkTimeModels = new RestaurantWorkTimeModels();
  private restaurantWorkTimeModelsTemp: RestaurantWorkTimeModels = new RestaurantWorkTimeModels();
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
    private zoneService: ZoneService,
    private paymentService: PaymentService,
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
    this.onGetAllZone();
    this.onGetPayment();
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
      },
      (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onGetDistrictByCity = (cityId: number, isFirstLoad: boolean = false) => {
    this.clientState.isBusy = true;
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
        this.clientState.isBusy = false;
      },
      (err: ApiError) => {
        this.clientState.isBusy = false;
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onGetAllZone = () => {
    this.clientState.isBusy = true;
    this.zoneService.onGetZones().subscribe(res => {
      this.zoneModels = res.content ? <ZoneModel[]>[...res.content] : [];
      this.clientState.isBusy = false;
    },
      (err: ApiError) => {
        this.clientState.isBusy = false;
        this.message = err.message;
        this.isError = true;
      }
    );
  };

  onGetZoneByDistrict = (districtId: number) => {
    this.clientState.isBusy = true;
    this.zoneService.onGetZoneByDistrict(districtId).subscribe(res => {
      this.zoneModels = res.content ? <ZoneModel[]>[...res.content] : [];
      this.clientState.isBusy = false;
    },
      (err: ApiError) => {
        this.clientState.isBusy = false;
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

  onGetListPayment = (paymentProviderLst: PaymentModel[]) => {
    paymentProviderLst.map(item => {
      this.restaurantModel.paymentProviderLstId.push(item.paymentProviderId);
    })
  }

  onConvertPayment = (paymentProviderLstTemp: number[]) => {
    paymentProviderLstTemp.map(id => {
      let temp = this.paymentModels.filter(x => x.paymentProviderId == id);
      if (temp != null) this.restaurantModel.paymentProviderLst.push(...temp);
    })
  }

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
          this.restaurantModel.paymentProviderLstId = [];
          if (this.restaurantModel.paymentProviderLst.length > 0) this.onGetListPayment(this.restaurantModel.paymentProviderLst);
          else this.restaurantModel.paymentProviderLstId.push(1);
          this.onAutoCreateOpenClose();
          if (this.restaurantModel.deliveryArea.length <= 0) {
            this.restaurantModel.deliveryArea = [{deliveryAreaId: 0, deliveryZoneId: []}];
          }
          this.clientState.isBusy = false;
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

  onUpdateRestaurant = (isValid: boolean) => {
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

    this.restaurantModel.paymentProviderLst = [];
    this.onConvertPayment(this.restaurantModel.paymentProviderLstId);

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
    } else {
      for (let i = 0; i < this.restaurantModel.restaurantWorkTimeModels.length; i++) {
        if (this.restaurantModel.restaurantWorkTimeModels[i].list.length == 0) {
          this.restaurantModel.restaurantWorkTimeModels[i].list.push(<WorkTimeList>{
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
      idRestaurantWork: Math.max.apply(Math, ex.idRestaurantWork) + 1,
      openTime: "",
      closeTime: ""
    });
  };

  onRemoveExtraItem = (menuExtra: WorkTimeList[]) => {
    let index = menuExtra.findIndex(e => e == menuExtra);
    menuExtra && menuExtra.splice(index, 1);
  };

  onAddDeliveryArea = () => {
    this.restaurantModel.deliveryArea.push(<DeliveryArea>{
      deliveryAreaId: 0,
      deliveryZoneId: []
    });
  };

  onRemoveDeliveryArea = (deliveryAreaLst: DeliveryArea) => {
    let index = this.restaurantModel.deliveryArea.findIndex(e => e == deliveryAreaLst);
    this.restaurantModel.deliveryArea && this.restaurantModel.deliveryArea.splice(index, 1);
  };

  onRevertTime = (x: number, y: number) => {
    this.restaurantModel.restaurantWorkTimeModels[x].list[y].openTime = "";
    this.restaurantModel.restaurantWorkTimeModels[x].list[y].closeTime = "";
  };

  onChooseAllZone = (id: number, index: number) => {
    if (id == null) return;
    this.clientState.isBusy = true;
    this.zoneService.onGetZoneByDistrict(id).subscribe(res => {
      this.zoneModels = res.content ? <ZoneModel[]>[...res.content] : [];
      this.restaurantModel.deliveryArea[index].deliveryZoneId = [];
      this.zoneModels.map(items => {
        this.restaurantModel.deliveryArea[index].deliveryZoneId.push(items.zoneId);
      })
      this.clientState.isBusy = false;
    },
      (err: ApiError) => {
        this.clientState.isBusy = false;
        this.message = err.message;
        this.isError = true;
      }
    );
  }
}
