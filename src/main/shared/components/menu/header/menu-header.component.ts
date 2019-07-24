import { Component, OnInit, Input } from '@angular/core';
import { ClientState } from '../../../state';
import { I18nService } from '../../../core';
import { ApiError } from '../../../services/api-response/api-response';
import { AppRestaurantModel } from '../../../models/restaurant/app-restaurant.model';
import { RestaurantAppService } from '../../../services/api/restaurant/app-restaurant.service';
import { FavouriteService } from '../../../services/api/favourite/favourite.service';
import { FavouriteModel } from '../../../models/favourite/favourite.model';
import { ActivatedRoute } from '@angular/router';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { AppAuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent implements OnInit {
  @Input() restaurantId: number;
  private sub: any;
  private restaurantModel: AppRestaurantModel = new AppRestaurantModel();
  private favouriteModel: FavouriteModel = new FavouriteModel();
  private favouriteModel1: FavouriteModel[] = [];
  private message: string;
  private isError: boolean;
  private isAuthen: boolean;
  private error: string;
  private ratingPercent: number = 0;

  constructor(
    private route: ActivatedRoute,
    private clientState: ClientState,
    private appRestaurantService: RestaurantAppService,
    private i18nService: I18nService,
    private favouriteService: FavouriteService,
    private authService: AppAuthService,
  ) {
  }

  ngOnInit(): void {
    this.onGetRestaurantDetails();
    this.isAuthen = this.authService.isAuthenticated();
    if (this.isAuthen) {
      this.onLoadFavouriteByRestaurantIdAndUserId();
    }
  }

  onGetRestaurantDetails = () => {
    if (this.restaurantId && this.restaurantId != 0) {
      this.clientState.isBusy = true;
      let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
      this.appRestaurantService.getRestaurantDetails(this.restaurantId, languageCode).subscribe(res => {
        this.restaurantModel = <AppRestaurantModel>{ ...res.content };

        //--- Calculate rating
        if (this.restaurantModel.rating > 0) {
          this.ratingPercent = (this.restaurantModel.rating * 100) / 5;
        }

        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      });
    }
  }

  onLoadFavouriteByRestaurantIdAndUserId = () => {
    let userId = JwtTokenHelper.GetUserInfo() && JwtTokenHelper.GetUserInfo().userId;
    if (this.restaurantId && this.restaurantId != 0) {
      this.favouriteService.getFavouriteByRestaurantIdAndUserId(this.restaurantId, userId).subscribe(
        res => {
          if (res.content == null) {
            this.favouriteModel1 = [];
          } else {
            this.favouriteModel1 = res.content.map((item, index) => {
              return <FavouriteModel>{ ...item };
            });
          }
        }, (err: ApiError) => {
          this.error = err.message;
          this.isError = true;
        });
    }
  }

  onAddFavourite(): void {
    this.isAuthen = this.authService.isAuthenticated();
    if (!this.isAuthen) {
      return;
    }

    this.clientState.isBusy = true;
    let userId = JwtTokenHelper.GetUserInfo().userId;

    if (this.favouriteModel1.length > 0 && this.favouriteModel1[0].restaurantId === this.restaurantId) {
      this.favouriteModel.restaurantId = this.restaurantId;
      this.favouriteModel.userId = userId;
      this.favouriteModel.favoriesId = this.favouriteModel1[0].favoriesId;
      if (this.favouriteModel1[0].status === 1) {
        this.favouriteModel.status = 0;
      } else {
        this.favouriteModel.status = 1;
      }

      this.favouriteService.updateFavourite(this.favouriteModel).subscribe(res => {
        this.onGetRestaurantDetails();
        this.onLoadFavouriteByRestaurantIdAndUserId();
        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      });
    } else {
      this.favouriteModel.restaurantId = this.restaurantId;
      this.favouriteModel.userId = userId;
      this.favouriteModel.status = 1;
      this.favouriteService.createFavourite(this.favouriteModel).subscribe(res => {
        this.onGetRestaurantDetails();
        this.onLoadFavouriteByRestaurantIdAndUserId();
        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      });
    }
  }
}
