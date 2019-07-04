import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { AddressModel } from '../../../models/address/address.model';
import { NgForm } from '@angular/forms';
import { ClientState } from '../../../state';
import { Address } from 'ng2-google-place-autocomplete/src/app/ng2-google-place.classes';
import { ApiError } from '../../../services/api-response/api-response';
import { AddressService } from '../../../services/api/address/address.service';
import { GoogleApiService } from '../../../services/google-api/google-api.service';
import { UserResponseModel } from '../../../models/user/user.model';
import { I18nService } from '../../../core/i18n.service';
import { StorageService } from '../../../core/storage.service';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { LatLongModel } from '../../../models/google/country-latlong.model';
import { CityService, DistrictService } from '../../../services';
import { CityModel } from '../../../models/city/city.model';
import { DistrictModel } from '../../../models/district/district.model';

@Component({
    selector: 'address-creation',
    templateUrl: './address-creation.component.html',
    styleUrls: ['./address-creation.component.scss']
})
export class AddressCreationComponent implements OnInit {
    @Input() visible: boolean = false;
    @Output() onSuccess: EventEmitter<boolean> = new EventEmitter();

    private currentUser: UserResponseModel;
    private addressModel: AddressModel = new AddressModel();
    private isProgressing: boolean;
    private city: string;
    private district: string;
    private googleAddress: string = '';
    private placeTimeout: any;
    private error: ApiError;
    private isError: boolean;
    public currentPosition: LatLongModel;
    private currentCountryCode: string;
    private errorTimeout: any;
    private cityModels: CityModel[] = [];
    private districtModels: DistrictModel[] = [];
    constructor(
        private clientState: ClientState,
        private addressService: AddressService,
        private i18nService: I18nService,
        private googleService: GoogleApiService,
        private storageService: StorageService,
        private cityService: CityService,
        private districtService: DistrictService,
        private cdRef: ChangeDetectorRef,
    ) {
        this.currentUser = JwtTokenHelper.GetUserInfo();
        this.currentCountryCode = JwtTokenHelper.countryCode;

        // this.googleService.getCountryCode().subscribe(res => {
        //     let ipInfo: IpInfo = <IpInfo>{ ...res };
        //     this.storageService.onSetToken(StorageKey.IPInfo, JwtTokenHelper.CreateSigningToken(ipInfo));
        // }, err => {
        //     this.currentCountryCode = JwtTokenHelper.countryCode;
        // });
    }

    async ngOnInit(): Promise<void> {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getPosition, err => {
            });
        }
        this.onGetCities();
    }

    getPosition = (position) => {
        this.currentPosition = <LatLongModel>{ lat: position.coords.latitude, lng: position.coords.longitude };
    }

    onGetCities = () => {
        this.cityService.onGetCities().subscribe(res => {
            this.cityModels = res.content && res.content.data ? <CityModel[]>[...res.content.data] : [];
        }, (err: ApiError) => {
            this.error = err;
            this.isError = true;
        });
    }

    onGetDistrictByCity = (cityId: number) => {
        this.districtService.onGetDistrictByCity(cityId).subscribe(res => {
            this.districtModels = res.content ? <DistrictModel[]>[...res.content] : [];
            this.addressModel.districtId = null;
        }, (err: ApiError) => {
            this.error = err;
            this.isError = true;
        });
    }

    onClose = (isSuccess: boolean) => {
        this.onSuccess.emit(isSuccess);
    }

    onCreateAddress = (form: NgForm) => {
        if (!form.valid) {
            return;
        }
        let newAddress = <AddressModel>{ ...this.addressModel, userId: this.currentUser.userId, district: this.district, city: this.city, address: this.googleAddress };
        this.isProgressing = true;
        this.addressService.onCreateAddress(newAddress).subscribe(res => {
            this.isProgressing = false;
            this.onClose(true);
        }, (err: ApiError) => {
            this.isError = true;
            this.error = err;
            if (this.errorTimeout) {
                clearTimeout(this.errorTimeout);
            };
            this.errorTimeout = setTimeout(() => {
                this.error = null;
            }, 5000)
            this.isProgressing = false;
        });
    }

    setAddress = (place: Address) => {
        if (this.placeTimeout) {
            clearTimeout(this.placeTimeout);
        };
        this.placeTimeout = setTimeout(() => {}, 300);
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
}
