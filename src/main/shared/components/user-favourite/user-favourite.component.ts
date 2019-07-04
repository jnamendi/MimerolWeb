import { Component } from '@angular/core';
import { FavouriteService } from '../../services/api/favourite/favourite.service';
import { JwtTokenHelper } from '../../common/jwt-token-helper/jwt-token-helper';
import { ApiError } from '../../services/api-response/api-response';
import { FavouriteModel } from '../../models/favourite/favourite.model';
import { ClientState } from '../../state/client/client-state';

@Component({
  selector: 'page-user-favourite',
  templateUrl: './user-favourite.component.html',
  styleUrls: ['./user-favourite.component.scss']
})

export class UserFavouriteComponent {
  private favouriteModel: FavouriteModel[] = [];
  private isError: boolean;
  private error: string;
  private statusError: number = 0;

  constructor(
    private favouriteService: FavouriteService,
    private clientState: ClientState,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.onLoadFavouriteByUserId();
  }

  onLoadFavouriteByUserId = () => {
    let userId = JwtTokenHelper.GetUserInfo().userId;
    this.favouriteService.getFavouriteByUserId(userId).subscribe(
      res => {
        if (res.content == null) {
          this.favouriteModel = [];
        } else {
          this.favouriteModel = res.content.map((item, index) => {
            return <FavouriteModel>{ ...item };
          });
        }
      }, (err: ApiError) => {
        this.error = err.message;
        this.isError = true;
        this.statusError = err.status;
      });
  }
}