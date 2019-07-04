import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { PromotionOwnerModel, PromotionStatus } from '../../../models/promotion/owner-promotion.model';
import { PromotionOwnerService } from '../../../services/api/promotion/owner-promotion.service';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { JwtTokenHelper } from '../../../common/jwt-token-helper/jwt-token-helper';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'owner-promotion',
  templateUrl: './promotion.component.html'
})
export class OwnerPromotionComponent implements OnInit, OnDestroy {
  private promotionOwnerModels: PromotionOwnerModel[] = [];
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
    private promotionOwnerService: PromotionOwnerService,
    private i18nService: I18nService
  ) {
    this.isFirstLoad = true;
    this.dtOptions = {
      pageLength: this.currentPageSize,
      columnDefs: [
        { targets: 9, orderable: false }
      ],
      order: [
        [0, "asc"]
      ],
      destroy: true,
    };
  }

  ngOnInit(): void {
    this.onGetPromotionsByOwner();
  }

  onGetPromotionsByOwner = () => {
    this.clientState.isBusy = true;
    let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
    let userId = JwtTokenHelper.GetUserInfo() && JwtTokenHelper.GetUserInfo().userId;
    this.promotionOwnerService.getPromotionsByOwner(0, 0, languageCode, userId).subscribe(res => {
      if (res.content == null) {
        this.promotionOwnerModels = [];
      } else {
        this.paginModel = { ...res.content };
        this.promotionOwnerModels = res.content.data.map(item => {
          return <PromotionOwnerModel>{ ...item, isDeleted: false }
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
  //   this.onGetPromotionsByOwner(pageIndex);
  // }

  onChangeDeletedItems = () => {
    this.isDeletedItems = !this.isDeletedItems;
    this.promotionOwnerModels.map(item => {
      item.isDeleted = this.isDeletedItems;
    })
  }

  isSelectdAllItems = () => {
    return !this.promotionOwnerModels.some(item => !item.isDeleted);
  }

  isSelectedItem = () => {
    return this.promotionOwnerModels.some(item => item.isDeleted);
  }

  onDeleteItems = () => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      let deletedIds = this.promotionOwnerModels.filter(item => item.isDeleted).map(item => {
        return item.promotionId;
      });
      if (deletedIds && deletedIds.length > 0) {
        this.clientState.isBusy = true;
        this.promotionOwnerService.deleteManyPromotion(deletedIds).subscribe(res => {
          this.onGetPromotionsByOwner();
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

  onDeleteItem = (promotionId: number) => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      this.promotionOwnerService.deletePromotion(promotionId).subscribe(res => {
        this.onGetPromotionsByOwner();
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
