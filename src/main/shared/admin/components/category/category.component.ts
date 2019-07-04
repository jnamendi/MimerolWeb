import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { CategoryAdminModel, CategoryStatus } from '../../../models/category/admin-category.model';
import { CategoryAdminService } from '../../../services/api/category/admin-category.service';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'admin-category',
  templateUrl: './category.component.html'
})
export class AdminCategoryComponent implements OnInit, OnDestroy {
  private categoryAdminModels: CategoryAdminModel[] = [];
  private isDeletedItems: boolean;
  private paginModel: PagingModel;
  private message: string;
  private isError: boolean;
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private categoryStatus: typeof CategoryStatus = CategoryStatus;
  private isFirstLoad: boolean;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private categoryAdminService: CategoryAdminService,
    private i18nService: I18nService
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
    this.onGetCategories();
  }

  onGetCategories = () => {
    this.clientState.isBusy = true;
    let languageCode = this.i18nService.language.split('-')[0].toLocaleLowerCase();
    this.categoryAdminService.getCategories(0, 0, languageCode).subscribe(res => {
      if (res.content == null) {
        this.paginModel = { ...res.content };
        this.categoryAdminModels = [];
      } else {
        this.paginModel = { ...res.content };
        this.categoryAdminModels = res.content.data.map(item => {
          return <CategoryAdminModel>{ ...item, isDeleted: false }
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
  //   this.onGetCategories(pageIndex);
  // }

  onChangeDeletedItems = () => {
    this.isDeletedItems = !this.isDeletedItems;
  }

  isSelectdAllItems = () => {
    return !this.categoryAdminModels.some(item => !item.isDeleted);
  }

  isSelectedItem = () => {
    return this.categoryAdminModels.some(item => item.isDeleted);
  }

  onDeleteItems = () => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      let deletedIds = this.categoryAdminModels.filter(item => item.isDeleted).map(item => {
        return item.categoryId;
      });
      if (deletedIds && deletedIds.length > 0) {
        this.clientState.isBusy = true;
        this.categoryAdminService.deleteManyCategory(deletedIds).subscribe(res => {
          this.onGetCategories();
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

  onDeleteItem = (categoryId: number) => {
    if (window.confirm('Are you sure want to delete the item has been choosen?')) {
      this.categoryAdminService.deleteCategory(categoryId).subscribe(res => {
        this.onGetCategories();
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
