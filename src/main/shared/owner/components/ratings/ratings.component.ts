import { Component, ViewChild, OnDestroy } from '@angular/core';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { ClientState } from '../../../state/client/client-state';
import { RestaurantCommentOwnerModel, RestaurantCommentStatus } from '../../../models/restaurant-comment/owner-restaurant-comment.model';
import { RestaurantCommentOwnerService } from '../../../services/api/restaurant-comment/owner-restaurant-comment.service';
import { RestaurantOwnerService } from '../../../services/api/restaurant/owner-restaurant.service';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { RestaurantOwnerModel } from '../../../models/restaurant/owner-restaurant.model';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'owner-ratings',
  templateUrl: './ratings.component.html'
})
export class OwnerRatingsComponent implements OnDestroy {
  private restaurantCommentOwnerModels: RestaurantCommentOwnerModel[] = [];
  private restaurantOwnerModels: RestaurantOwnerModel[] = [];
  private paginModel: PagingModel;
  private message: string;
  private isError: boolean;
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private isDeletedItems: boolean;
  private restaurantCommentStatus: typeof RestaurantCommentStatus = RestaurantCommentStatus;
  private isFirstLoad: boolean;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private clientState: ClientState,
    private restaurantCommentOwnerService: RestaurantCommentOwnerService,
    private restaurantOwnerService: RestaurantOwnerService,
  ) {
    this.isFirstLoad = true;
    this.dtOptions = {
      pageLength: this.currentPageSize,
      columnDefs: [
        { targets: 4, orderable: false },
        { targets: 5, orderable: false }
      ],
      order: [
        [0, "asc"]
      ],
      destroy: true,
    };
  }

  ngOnInit(): void {
    this.onGetRestaurantCommentByOwner();
  }

  onGetRestaurantCommentByOwner = () => {
    this.clientState.isBusy = true;
    let userId = JwtTokenHelper.GetUserInfo() && JwtTokenHelper.GetUserInfo().userId;

    this.restaurantCommentOwnerService.getCommentByOwner(userId).subscribe(res => {
      if (res.content == null) {
        this.restaurantCommentOwnerModels = [];
      } else {
        this.restaurantCommentOwnerModels = res.content.map(item => {
          return <RestaurantCommentOwnerModel>{ ...item }
        });

        if (this.isFirstLoad) {
          this.dtTrigger.next();
          this.isFirstLoad = false;
        }

        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
          dtInstance.columns().every(function () {
            const that = this;
            $('input', this.footer()).on('keyup change', function () {
              if (that.search() !== this['value']) {
                that.search(this['value']).draw();
              }
            });
          });
        });
      }

      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.message = err.message;
      this.isError = true;
      this.clientState.isBusy = false;
    });
  }

  // onPageChanged = (pageIndex: number = 1) => {
  //   if (pageIndex < 0)
  //     return;
  //   this.currentPageIndex = pageIndex;
  //   this.onGetRestaurantCommentByResId(pageIndex);
  // }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
