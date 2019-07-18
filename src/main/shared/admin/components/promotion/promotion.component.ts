import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { PromotionAdminModel, PromotionStatus } from '../../../models/promotion/admin-promotion.model';
import { PromotionAdminService } from '../../../services/api/promotion/admin-promotion.service';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'admin-promotion',
  templateUrl: './promotion.component.html'
})
export class AdminPromotionComponent implements OnInit, OnDestroy {
  private promotionAdminModels: PromotionAdminModel[] = [];
  private isDeletedItems: boolean;
  private paginModel: PagingModel;
  private message: string;
  private isError: boolean;
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private promotionStatus: typeof PromotionStatus = PromotionStatus;
  private isFirstLoad: boolean;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private promotionAdminService: PromotionAdminService,
    private i18nService: I18nService
  ) {
    this.isFirstLoad = true;
    this.dtOptions = {
      pageLength: this.currentPageSize,
      columnDefs: [
        { targets: 0, orderable: false },
        { targets: 10, orderable: false }
      ],
      order: [
        [1, "asc"]
      ],
      destroy: true,
    };
  }

  ngOnInit(): void {
    this.onGetPromotions();
  }

  onGetPromotions = () => {
    let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
    this.promotionAdminService.getPromotions(0, 0, languageCode).subscribe(res => {
      if (res.content == null) {
        this.promotionAdminModels = [];
        this.paginModel = { ...res.content };
      } else {
        this.paginModel = { ...res.content };
        this.promotionAdminModels = res.content.data.map(item => {
          return <PromotionAdminModel>{ ...item, isDeleted: false }
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
    return !this.promotionAdminModels.some(item => !item.isDeleted);
  }

  isSelectedItem = () => {
    return this.promotionAdminModels.some(item => item.isDeleted);
  }

  onDeleteItems = () => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      let deletedIds = this.promotionAdminModels.filter(item => item.isDeleted).map(item => {
        return item.promotionId;
      });
      if (deletedIds && deletedIds.length > 0) {
        this.clientState.isBusy = true;
        this.promotionAdminService.deleteManyPromotion(deletedIds).subscribe({
          complete: () => {
            this.onGetPromotions();
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

  onDeleteItem = (promotionId: number) => {
    if (window.confirm('Are you sure want to delete the item has been choosen?')) {
      this.promotionAdminService.deletePromotion(promotionId).subscribe({
        complete: () => {
          this.onGetPromotions();
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
