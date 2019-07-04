import { Component, OnInit } from '@angular/core';
import { ClientState } from '../../state';
import { AddressService } from '../../services';
import { AddressModel } from '../../models/address/address.model';
import { UserResponseModel } from '../../models';
import { JwtTokenHelper } from '../../common';
import { ApiError } from '../../services/api-response/api-response';

@Component({
  selector: 'page-user-addresses',
  templateUrl: './user-addresses.component.html',
  styleUrls: ['./user-addresses.component.scss']
})
export class UserAddressesComponent implements OnInit {
  private isCreation: boolean;
  private addressModels: AddressModel[] = [];
  private currentUser: UserResponseModel;
  private currentCountryCode: string;
  private isUpdation: boolean;
  private selectedAddressId: number;
  private isDeleteConfirm: boolean;

  constructor(
    private clientState: ClientState,
    private addressService: AddressService,
  ) {
    this.currentUser = JwtTokenHelper.GetUserInfo();
    this.currentCountryCode = JwtTokenHelper.countryCode;
  }

  ngOnInit(): void {
    this.onGetAddressForCurrentUser();
  }

  onGetAddressForCurrentUser = () => {
    this.addressService.onGetByUser(this.currentUser.userId).subscribe(res => {
      if (res.content == null) {
        this.addressModels == [];
      } else {
        this.addressModels = [...res.content.data];
      }
    }, (err: ApiError) => {
      if (err.status == 8) {
        this.addressModels = [];
      }
    });
  }

  onOpenCreateAddress = () => {
    if (this.isCreation) {
      return;
    }
    this.isCreation = true;
  }

  onOpenUpdateAddress = (addressId: number) => {
    if (this.isUpdation) {
      return;
    }
    this.selectedAddressId = addressId;
    this.isUpdation = true;
  }

  onSuccess = (isSaveSuccess: boolean) => {
    this.isCreation = false;
    this.isUpdation = false;
    this.selectedAddressId = 0;
    if (isSaveSuccess) {
      this.onGetAddressForCurrentUser();
    }
  }

  onOpenDelete = (addressId: number) => {
    if (!this.isDeleteConfirm) {
      this.selectedAddressId = addressId;
      this.isDeleteConfirm = true;
    }
  }

  onDeleteAddress = (isConfirm: boolean) => {
    this.isDeleteConfirm = false;
    if (isConfirm) {
      this.clientState.isBusy = true;
      this.addressService.onDeleteAddress(this.selectedAddressId).subscribe(res => {
        this.isDeleteConfirm = false;
        this.onGetAddressForCurrentUser();
        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.clientState.isBusy = false;
      });
    }
  }
}
