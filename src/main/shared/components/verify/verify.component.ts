import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services';
import { ClientState } from '../../state';
import { ApiError } from '../../services/api-response/api-response';
import { I18nService } from '../../core';
import { StorageKey } from '../../services/storage-key/storage-key';

@Component({
  selector: 'page-verify-account',
  templateUrl: './verify.component.html',
})

export class VerifyComponent implements OnInit, OnChanges, OnDestroy {
  private sub: any;
  private token: string;
  private isVerified: boolean;
  private isResend: boolean;
  private isResendSuccess: boolean;
  private statusError: number;
  private currentEmail: string;
  private currentLanguage: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private clientState: ClientState,
    private i18nService: I18nService
  ) {
    this.sub = this.route.queryParams.subscribe(params => {
      this.token = params[StorageKey.Token];
      if (!this.token) {
        this.router.navigate(['']);
      } else {
        this.loginService.onActivateAccount(this.token).subscribe(res => {
          this.isVerified = true;
        }, err => {
          this.isVerified = false;
          if (err.data && err.data.email) {
            this.currentEmail = err.data.email;
            this.isResend = true;
          } else {
            this.isResend = false;
            this.router.navigate(['']);
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.onGetCurrentLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onGetCurrentLanguage();
  }

  onGetCurrentLanguage = () => {
    this.currentLanguage = this.i18nService.language.split('-')[0];
  }

  onResend = () => {
    this.clientState.isBusy = true;
    this.loginService.onResendActivate(this.currentEmail, this.currentLanguage).subscribe(res => {
      this.isResendSuccess = true;
      this.isResend = false;
      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.clientState.isBusy = false;
      this.statusError = err.status;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
