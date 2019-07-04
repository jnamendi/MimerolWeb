import { Component, OnInit } from '@angular/core';
import { UserDetailsModel } from '../../models/user/user.model';
import { ClientState } from '../../state';
import { JwtTokenHelper } from '../../common';
import { ApiError } from '../../services/api-response/api-response';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/api/user/user.service';

@Component({
  selector: 'page-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  private userDetailsModel: UserDetailsModel = new UserDetailsModel();
  private updateUserDetailsSuccess: boolean;
  private isError: boolean;
  private getUserByIdError: string;
  private getUserByIdStatusError: number = 0;
  private updateUserDetailsError: string;
  private updateUserDetailsStatusError: number = 0;

  constructor(
    private userService: UserService,
    private clientState: ClientState,
  ) {
  }

  async ngOnInit(): Promise<void> {
    let userId = JwtTokenHelper.GetUserInfo().userId;
    this.userService.onGetById(userId).subscribe(
      res => {
        this.userDetailsModel = <UserDetailsModel>{ ...res.content };
      }, (err: ApiError) => {
        this.getUserByIdError = err.message;
        this.isError = true;
        this.getUserByIdStatusError = err.status;
      });
  }

  onUpdateUserDetails = (form: NgForm) => {
    if (!form.valid) {
      return;
    }

    this.clientState.isBusy = true;
    this.userService.updateUserDetails(this.userDetailsModel).subscribe(res => {
      this.updateUserDetailsSuccess = true;
      this.clientState.isBusy = false;
      this.isError = false;
      // form.resetForm();
    }, (err: ApiError) => {
      this.updateUserDetailsError = err.message;
      this.isError = true;
      this.updateUserDetailsStatusError = err.status;
      this.clientState.isBusy = false;
    });
  }
}
