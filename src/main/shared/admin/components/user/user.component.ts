import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { UserAdminModel, UserStatus } from '../../../models/user/admin-user.model';
import { UserAdminService } from '../../../services/api/user/admin-user.service';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';
@Component({
  selector: 'admin-user',
  templateUrl: './user.component.html'
})

export class AdminUserComponent implements OnInit, OnDestroy {
  private userAdminModels: UserAdminModel[] = [];
  private isDeletedItems: boolean;
  private paginModel: PagingModel;
  private message: string;
  private isError: boolean;
  private searchingText: string;
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private userStatus: typeof UserStatus = UserStatus;
  private isFirstLoad: boolean;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private userAdminService: UserAdminService,
    private i18nService: I18nService
  ) {
    this.isFirstLoad = true;
    this.dtOptions = {
      pageLength: this.currentPageSize,
      columnDefs: [
        { targets: 0, orderable: false },
        { targets: 8, orderable: false }
      ],
      order: [
        [1, "asc"]
      ],
      destroy: true,
    };
  }

  ngOnInit(): void {
    this.onGetUsers();
  }

  onGetUsers = () => {
    this.clientState.isBusy = true;
    this.userAdminService.getUsers(0, 0).subscribe(res => {
      if (res.content == null) {
        this.userAdminModels = [];
        this.paginModel = { ...res.content };
      } else {
        this.paginModel = { ...res.content };
        this.userAdminModels = res.content.data.map(item => {
          return <UserAdminModel>{ ...item, isDeleted: false }
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
  //   this.onGetUsers(pageIndex);
  // }

  // onSearching = () => {
  //   if (!!this.searchingText) {
  //     this.onGetUsers(this.currentPageIndex, this.currentPageSize, this.searchingText);
  //   } else {
  //     this.onGetUsers(this.currentPageIndex, this.currentPageSize);
  //   }
  // }

  onChangeDeletedItems = () => {
    this.isDeletedItems = !this.isDeletedItems;
  }

  isSelectdAllItems = () => {
    return !this.userAdminModels.some(item => !item.isDeleted);
  }

  isSelectedItem = () => {
    return this.userAdminModels.some(item => item.isDeleted);
  }

  onDeleteItems = () => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      let deletedIds = this.userAdminModels.filter(item => item.isDeleted).map(item => {
        return item.userId;
      });
      if (deletedIds && deletedIds.length > 0) {
        this.clientState.isBusy = true;
        this.userAdminService.deleteManyUser(deletedIds).subscribe(res => {
          this.onGetUsers();
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

  onDeleteItem = (userId: number) => {
    if (window.confirm('Are you sure want to delete the item has been choosen?')) {
      this.userAdminService.deleteUser(userId).subscribe(res => {
        this.onGetUsers();
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
