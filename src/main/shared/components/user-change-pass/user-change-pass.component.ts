import { Component, OnInit } from '@angular/core';
import { UserDetailsModel, UserChangePasswordModel } from '../../models/user/user.model';
import { ClientState } from '../../state';
import { JwtTokenHelper } from '../../common';
import { ApiError } from '../../services/api-response/api-response';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/api/user/user.service';

@Component({
  selector: 'page-change-pass',
  templateUrl: './user-change-pass.component.html',
  styleUrls: ['./user-change-pass.component.scss']
})
export class UserChangePassComponent implements OnInit {
  private userDetailsModel: UserDetailsModel = new UserDetailsModel();
  private userChangePasswordModel: UserChangePasswordModel = new UserChangePasswordModel();
  private isChangePasswordSuccess: boolean;
  private isError: boolean;
  private changePasswordError: string;
  private changePasswordStatusError: number = 0;
  private getUserByIdError: string;
  private getUserByIdStatusError: number = 0;

  constructor(
    private userService: UserService,
    private clientState: ClientState,
  ) {
  }

  async ngOnInit(): Promise<void> {
    let userId = JwtTokenHelper.GetUserInfo().userId;
    this.userService.onGetById(+userId).subscribe(
      res => {
        this.userDetailsModel = <UserDetailsModel>{ ...res.content };
        this.userChangePasswordModel.userId = this.userDetailsModel.userId;
      }, (err: ApiError) => {
        this.getUserByIdError = err.message;
        this.isError = true;
        this.getUserByIdStatusError = err.status;
      });
  }

  onChangePassword = (form: NgForm) => {
    if (!form.valid) {
      return;
    }

    this.clientState.isBusy = true;
    this.userService.changePassword(this.userChangePasswordModel).subscribe(res => {
      this.isChangePasswordSuccess = true;
      this.clientState.isBusy = false;
      this.isError = false;
      form.resetForm();
    }, (err: ApiError) => {
      this.changePasswordError = err.message;
      this.isError = true;
      this.changePasswordStatusError = err.status;
      this.clientState.isBusy = false;
    });
  }
}
