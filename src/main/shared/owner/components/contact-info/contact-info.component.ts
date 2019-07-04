import { Component } from '@angular/core';
import { UserOwnerModel } from '../../../models/user/owner-user.model';
import { ClientState } from '../../../state/client/client-state';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { UserOwnerService } from '../../../services/api/user/owner-user.service';
import { ApiError } from '../../../services/api-response/api-response';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'owner-contact-info',
  templateUrl: './contact-info.component.html'
})
export class OwnerContactInfoComponent {
  private userOwnerModel: UserOwnerModel = new UserOwnerModel();
  private userOwnerModelArray: UserOwnerModel[] = [];
  private updateSuccess: boolean;

  constructor(
    private userOwnerService: UserOwnerService,
    private clientState: ClientState,
  ) {
  }

  ngOnInit(): void {
    this.onGetByUserId();
    this.onInitContactInfo();
  }

  onGetByUserId = () => {
    this.clientState.isBusy = true;
    let userId = JwtTokenHelper.GetUserInfo().userId;
    this.userOwnerService.onGetByUserId(userId).subscribe(
      res => {
        if (res.content == null) {
          this.userOwnerModelArray = [];
        } else {
          this.userOwnerModelArray = res.content.map((item, index) => {
            return <UserOwnerModel>{ ...item };
          });
        }
        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.clientState.isBusy = false;
      });
  }

  onInitContactInfo = () => {
    this.userOwnerModel = <UserOwnerModel>{
      contactName: '',
      email: '',
      emergencyNumber1: '',
      emergencyNumber2: '',
      userInfoId: null,
      website: ''
    };
  }

  onCreateContactInfo = (form: NgForm) => {
    if (!form.valid) {
      return;
    }

    this.clientState.isBusy = true;
    let userId = JwtTokenHelper.GetUserInfo().userId;

    let newUserOwner = <UserOwnerModel>{
      ...this.userOwnerModel,
      userId: userId,
    };
    this.userOwnerService.createUserInfo(newUserOwner).subscribe(res => {
      this.updateSuccess = true;
      this.clientState.isBusy = false;
      window.location.href = window.location.href;
    }, (err: ApiError) => {
      this.clientState.isBusy = false;
    });
  }

  onUpdateContactInfo = (form: NgForm) => {
    if (!form.valid) {
      return;
    }

    this.clientState.isBusy = true;
    let userId = JwtTokenHelper.GetUserInfo().userId;
    let newUserOwner = <UserOwnerModel>{
      ...this.userOwnerModelArray[0],
      userId: userId,
    };

    this.userOwnerService.updateUserInfo(newUserOwner).subscribe(res => {
      this.updateSuccess = true;
      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.clientState.isBusy = false;
    });
  }
}
