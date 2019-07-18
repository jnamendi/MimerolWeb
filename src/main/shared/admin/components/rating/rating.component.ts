import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ClientState } from '../../../state';
import { RatingAdminModel, RatingStatus } from '../../../models/rating/admin-rating.model';
import { ApiError, PagingModel } from '../../../services/api-response/api-response';
import { RatingAdminService } from '../../../services/api/rating/admin-rating.service';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'admin-rating',
  templateUrl: './rating.component.html'
})
export class AdminRatingComponent implements OnInit, OnDestroy {
  private ratingsAdminModels: RatingAdminModel[] = [];
  private paginModel: PagingModel;
  private message: string;
  private isError: boolean;
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private isDeletedItems: boolean;
  private ratingStatus: typeof RatingStatus = RatingStatus;
  private searchingText: string;
  private isFirstLoad: boolean;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private clientState: ClientState,
    private ratingAdminService: RatingAdminService,
    private i18nService: I18nService
  ) {
    this.isFirstLoad = true;
    this.dtOptions = {
      pageLength: this.currentPageSize,
      columnDefs: [
        { targets: 0, orderable: false },
        { targets: 4, orderable: false },
        { targets: 5, orderable: false },
        { targets: 8, orderable: false }
      ],
      order: [
        [1, "asc"]
      ],
      destroy: true,
    };
  }

  ngOnInit(): void {
    this.onGetRatings();
  }

  onGetRatings = () => {
    this.clientState.isBusy = true;
    this.ratingAdminService.getRatings(0, 0).subscribe(res => {
      if (res.content == null) {
        this.ratingsAdminModels = [];
        this.paginModel = { ...res.content };
      } else {
        this.paginModel = { ...res.content };
        this.ratingsAdminModels = res.content.data.map(item => {
          return <RatingAdminModel>{ ...item, isDeleted: false }
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

  onChangeDeletedItems = () => {
    this.isDeletedItems = !this.isDeletedItems;
  }

  isSelectdAllItems = () => {
    return !this.ratingsAdminModels.some(item => !item.isDeleted);
  }

  isSelectedItem = () => {
    return this.ratingsAdminModels.some(item => item.isDeleted);
  }

  onDeleteItems = () => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      let deletedIds = this.ratingsAdminModels.filter(item => item.isDeleted).map(item => {
        return item.ratingId;
      });
      if (deletedIds && deletedIds.length > 0) {
        this.clientState.isBusy = true;

        this.ratingAdminService.deleteManyRating(deletedIds).subscribe({
          complete: () => {
            this.onGetRatings();
            this.message = "Items have been deleted successfully.";
            this.clientState.isBusy = false;
          },
          error: (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
            this.clientState.isBusy = false;
          },
        });
      }
    }
  }

  onDeleteItem = (ratingId: number) => {
    if (window.confirm('Are you sure want to delete the item has been choosen?')) {
      this.ratingAdminService.deleteRating(ratingId).subscribe({
        complete: () => {
          this.onGetRatings();
        },
        error: (err: ApiError) => {
          this.message = err.message;
          this.isError = true;
          this.clientState.isBusy = false;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
