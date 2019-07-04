import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserResponseModel } from '../../../models';
import { JwtTokenHelper } from '../../../common';
import { ClientState } from '../../../state';
import { RestaurantCommentService } from '../../../services';
import { I18nService } from '../../../core';
import { ApiError } from '../../../services/api-response/api-response';
import { RestaurantCommentModel } from '../../../models/restaurant-comment/restaurant-comment.model';

@Component({
  selector: 'restaurant-reviews',
  templateUrl: './restaurant-reviews.component.html',
  styleUrls: ['./restaurant-reviews.component.scss']
})
export class RestaurantReviewsComponent implements OnInit {
  @Input() restaurantId: number;
  private resCommentModel: RestaurantCommentModel = new RestaurantCommentModel();
  private userInfo: UserResponseModel = new UserResponseModel();
  private restaurantComments: RestaurantCommentModel[] = [];
  private saveCommentSuccess: boolean;
  private message: string;
  private isError: boolean;
  private rateEmpty: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private restaurantCommentService: RestaurantCommentService,
    private i18nService: I18nService,
  ) {
    this.userInfo = JwtTokenHelper.GetUserInfo();
  }

  ngOnInit(): void {
    this.onGetRestaurantComments();
  }

  onGetRestaurantComments = () => {
    if (this.restaurantId && this.restaurantId != 0) {
      this.restaurantCommentService.getRestaurantComment(10, this.restaurantId).subscribe(res => {
        if (res.content == null) {
          this.restaurantComments = [];
          return;
        }
        this.restaurantComments = <RestaurantCommentModel[]>[...res.content];
      }, (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
      });
    }
  }

  onSubmitComment = (form: NgForm) => {
    if (!this.userInfo) {
      this.router.navigate(['login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
      return;
    }

    this.rateEmpty = false;

    if (!form.valid) {
      return;
    }

    if (this.resCommentModel.starShip == 0 || this.resCommentModel.starQuality == 0) {
      this.rateEmpty = true;
      return;
    }

    let newRestaurantComment = <RestaurantCommentModel>{ ...this.resCommentModel, restaurantId: this.restaurantId, userId: this.userInfo.userId };

    this.clientState.isBusy = true;
    this.saveCommentSuccess = false;
    this.restaurantCommentService.createRestaurantComment(newRestaurantComment).subscribe(res => {
      this.saveCommentSuccess = true;
      this.clientState.isBusy = false;
      form.resetForm();
    }, (err: ApiError) => {
      this.saveCommentSuccess = false;
      this.clientState.isBusy = false;
    });
  }

  onClosePopup = (isConfirm: boolean) => {
    this.saveCommentSuccess = false;
  }
}
