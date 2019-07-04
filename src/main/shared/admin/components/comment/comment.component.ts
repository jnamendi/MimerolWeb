import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../state';
import { PagingModel, ApiError } from '../../../services/api-response/api-response';
import { CommentAdminModel, CommentAdminStatus } from '../../../models/comment/admin-comment.model';
import { CommentAdminService } from '../../../services/api/comment/admin-comment.service';
import { Configs } from '../../../common/configs/configs';
import { I18nService } from '../../../core/i18n.service';
import { DataTableDirective } from '../../../../../../node_modules/angular-datatables';
import { Subject } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'admin-comment',
  templateUrl: './comment.component.html'
})
export class AdminCommentComponent implements OnInit, OnDestroy {
  private commentAdminModels: CommentAdminModel[] = [];
  private isDeletedItems: boolean;
  private paginModel: PagingModel;
  private message: string;
  private isError: boolean;
  private currentPageIndex: number = Configs.PageIndex;
  private currentPageSize: number = Configs.PageSize;
  private commentAdminStatus: typeof CommentAdminStatus = CommentAdminStatus;
  private isFirstLoad: boolean;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  private dtOptions: DataTables.Settings = {};
  private dtTrigger: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private commentAdminService: CommentAdminService,
    private i18nService: I18nService
  ) {
    this.isFirstLoad = true;
    this.dtOptions = {
      pageLength: this.currentPageSize,
      columnDefs: [
        { targets: 0, orderable: false },
        { targets: 5, orderable: false },
        { targets: 6, orderable: false },
        { targets: 8, orderable: false }
      ],
      order: [
        [1, "asc"]
      ],
      destroy: true,
    };
  }

  ngOnInit(): void {
    this.onGetComments();
  }

  onGetComments = () => {
    this.commentAdminService.getComments(0, 0).subscribe(res => {
      if (res.content == null) {
        this.commentAdminModels = [];
        this.paginModel = { ...res.content };
      } else {
        this.paginModel = { ...res.content };
        this.commentAdminModels = res.content.data.map(item => {
          return <CommentAdminModel>{ ...item, isDeleted: false }
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

  // onPageChanged(pageIndex: number = 1) {
  //   if (pageIndex < 0)
  //     return;
  //   this.currentPageIndex = pageIndex;
  //   this.onGetComments(pageIndex);
  // }

  onChangeDeletedItems = () => {
    this.isDeletedItems = !this.isDeletedItems;
  }

  isSelectdAllItems = () => {
    return !this.commentAdminModels.some(item => !item.isDeleted);
  }

  isSelectedItem = () => {
    return this.commentAdminModels.some(item => item.isDeleted);
  }

  onDeleteItems = () => {
    if (window.confirm('Are you sure want to delete all items have been choosen?')) {
      let deletedIds = this.commentAdminModels.filter(item => item.isDeleted).map(item => {
        return item.resCommentId;
      });
      if (deletedIds && deletedIds.length > 0) {
        this.clientState.isBusy = true;
        this.commentAdminService.deleteManyComment(deletedIds).subscribe(res => {
          this.onGetComments();
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

  onDeleteItem = (commentId: number) => {
    if (window.confirm('Are you sure want to delete the item has been choosen?')) {
      this.commentAdminService.deleteComment(commentId).subscribe(res => {
        this.onGetComments();
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
