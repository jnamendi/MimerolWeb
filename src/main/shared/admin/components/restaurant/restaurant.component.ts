import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { RestaurantAdminService } from '../../../services';
import { RestaurantAdminModel, RestaurantStatus } from '../../../models/restaurant/admin-restaurant.model';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { Subject } from '../../../../../../node_modules/rxjs';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';

@Component({
  selector: 'admin-restaurant',
  templateUrl: './restaurant.component.html'
})

export class AdminRestaurantComponent implements OnInit, OnDestroy {
  private restaurantAdminModels: RestaurantAdminModel[] = [];
  private isDeletedItems: boolean;
  private paginModel: PagingModel;
  private message: string;
  private isError: boolean;
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private restaurantStatus: typeof RestaurantStatus = RestaurantStatus;
  private isFirstLoad: boolean;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private restaurantAdminService: RestaurantAdminService,
    private i18nService: I18nService,
  ) {
    this.isFirstLoad = true;
    this.dtOptions = {
      pageLength: this.currentPageSize,
      columnDefs: [
        { targets: 0, orderable: false },
        { targets: 5, orderable: false }
      ],
      order: [
        [1, "asc"]
      ],
      destroy: true,
    };
  }

  ngOnInit(): void {
    this.onGetRestaurants();
  }

  onGetRestaurants = () => {
    this.clientState.isBusy = true;
    this.restaurantAdminService.getRestaurants(0, 0).subscribe(res => {
      if (res.content == null) {
        this.restaurantAdminModels = [];
        this.paginModel = { ...res.content };
      } else {
        this.paginModel = { ...res.content };
        this.restaurantAdminModels = res.content.data.map(item => {
          return <RestaurantAdminModel>{ ...item, isDeleted: false }
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

  // onPageChanged(pageIndex: number = 1) {
  //   if (pageIndex < 0)
  //     return;
  //   this.currentPageIndex = pageIndex;
  //   this.onGetRestaurants(pageIndex);
  // }

  onChangeDeletedItems = () => {
    this.isDeletedItems = !this.isDeletedItems;
  }

  isSelectdAllItems = () => {
    return !this.restaurantAdminModels.some(item => !item.isDeleted);
  }

  isSelectedItem = () => {
    return this.restaurantAdminModels.some(item => item.isDeleted);
  }

  onDeleteItems = () => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      let deletedIds = this.restaurantAdminModels.filter(item => item.isDeleted).map(item => {
        return item.restaurantId;
      });
      if (deletedIds && deletedIds.length > 0) {
        this.clientState.isBusy = true;
        this.restaurantAdminService.deleteManyRestaurant(deletedIds).subscribe(res => {
          this.onGetRestaurants();
          this.message = "Items have been deleted successfully.";
          this.clientState.isBusy = false;
        }, (err: ApiError) => {
          this.message = err.message;
          this.isError = true;
          this.clientState.isBusy = false;
        });
      }
    }
  }

  onDeleteItem = (menuId: number) => {
    if (window.confirm('Are you sure want to delete the item has been choosen?')) {
      this.restaurantAdminService.deleteRestaurant(menuId).subscribe(res => {
        this.onGetRestaurants();
      }, (err: ApiError) => {
        this.message = err.message;
        this.isError = true;
        this.clientState.isBusy = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
