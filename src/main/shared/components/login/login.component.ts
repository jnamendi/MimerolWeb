import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";
import { JwtTokenHelper } from '../../common';
import { UserModel, UserResponseModel, UserTokenParsing } from '../../models';
import { ClientState } from '../../state';
import { StorageService, I18nService } from '../../core';
import { UserRole } from '../../models/user/user.model';
import { ApiError } from '../../services/api-response/api-response';
import { StorageKey } from '../../services/storage-key/storage-key';
import { LoginService } from '../../services/api/app/login.service';
import { AppAuthService } from '../../services/auth/auth.service';
import { LanguageService } from '../../services/api/language/language.service';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges, OnDestroy {
  private userLogin: UserModel = new UserModel();
  private isForgotPassword: boolean;
  private recoveryEmail: string;
  private isSendForgotPasswordLink: boolean;
  private userSignin: UserModel = new UserModel();
  private isSigninSuccess: boolean;
  private userInfo: UserTokenParsing;
  private isError: boolean;
  private loginError: ApiError;
  private forgotError: ApiError;
  private signInError: ApiError;
  private loginStatusError: number = 0;
  private forgotStatusError: number = 0;
  private signinStatusError: number = 0;
  private sub: any;
  private currentLanguage: string;
  private returnUrl: string;
  private message: string;

  constructor(
    private loginService: LoginService,
    private clientState: ClientState,
    private appAuthService: AppAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private socialService: AuthService,
    private languageService: LanguageService,
    private authenService: AppAuthService,
    private storageService: StorageService,
    private i18nService: I18nService,
  ) {
    this.sub = this.route.params.subscribe(params => {
      let isForgotState = params['state'] == 'forgot';
      if (isForgotState) {
        this.isForgotPassword = true;
      }
    });
    this.returnUrl = this.route.snapshot.queryParams[StorageKey.ReturnUrl] || '';
  }

  ngOnInit(): void {
    if (this.authenService.isAuthenticated()) {
      this.router.navigate(['']);
    }
    this.onGetCurrentLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.authenService.isAuthenticated()) {
      this.router.navigate(['']);
    }
    this.onGetCurrentLanguage();
  }

  onGetCurrentLanguage = () => {
    this.currentLanguage = this.i18nService.language.split('-')[0];
  }

  onLogin = (isValid: boolean) => {
    if (!isValid) {
      return;
    }
    this.clientState.isBusy = true;
    this.loginService.onLogin({ ...this.userLogin, languageCode: this.currentLanguage }).subscribe(res => {
      this.handleLoginSuccess(res.content);
      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.isError = true;
      this.loginError = err;
      this.loginStatusError = err.status;
      this.clientState.isBusy = false;
    });
  }

  handleLoginSuccess = (responeObj: Object) => {
    let userRes = <UserResponseModel>{ ...responeObj };
    if (!!userRes.token) {
      this.storageService.onSetToken(StorageKey.Token, userRes.token).then(async res => {
        await this.storageService.onSetToken(StorageKey.User, JwtTokenHelper.CreateSigningToken(userRes));

        if (!!this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          // if (JwtTokenHelper.isRole(UserRole.Admin)) {
          //   this.router.navigate(['admin']);
          // } else 
          if (JwtTokenHelper.isRole(UserRole.Owner)) {
            this.router.navigate(['owner']);
          } else {
            this.router.navigate(['']);
          }
        }
      });
    }
  }

  onToggleForgotPassword = (isForgotPassword: boolean) => {
    this.isForgotPassword = isForgotPassword;
    if (!isForgotPassword) {
      this.isSendForgotPasswordLink = false;
      this.recoveryEmail = '';
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['login/forgot']);
    }
  }

  onForgotPassword = (isValid: boolean) => {
    if (!isValid) {
      return;
    }
    this.clientState.isBusy = true;
    this.loginService.onForgotPassword(this.recoveryEmail, this.currentLanguage).subscribe(res => {
      this.isSendForgotPasswordLink = true;
      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.forgotError = err;
      this.isError = true;
      this.forgotStatusError = err.status;
      this.clientState.isBusy = false;
    });
  }

  onSignin = (isValid: boolean) => {
    if (!isValid) {
      return;
    }

    this.clientState.isBusy = true;
    this.loginService.onSignin({ ...this.userSignin, languageCode: this.currentLanguage }).subscribe(res => {
      this.isSigninSuccess = true;
      this.clientState.isBusy = false;
    }, (err: ApiError) => {
      this.signInError = err;
      this.isError = true;
      this.signinStatusError = err.status;
      this.clientState.isBusy = false;
    });
  }

  signInWithGoogle(): void {
    this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
      this.clientState.isBusy = true;
      let fbUser = <UserModel>{ ...res, languageCode: this.currentLanguage };
      this.loginService.onLogin(fbUser).subscribe(res => {
        this.handleLoginSuccess(res.content);
        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.loginError = err;
        this.isError = true;
        this.signinStatusError = err.status;
        this.clientState.isBusy = false;
      });
    }).catch(err => {
      this.clientState.isBusy = false;
      this.message = err.message;
      this.isError = true;
    });
  }

  signInWithFB(): void {
    this.socialService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      this.clientState.isBusy = true;
      let ggUser = <UserModel>{ ...res, languageCode: this.currentLanguage };
      this.loginService.onLogin(ggUser).subscribe(res => {
        this.handleLoginSuccess(res.content);
        this.clientState.isBusy = false;
      }, (err: ApiError) => {
        this.loginError = err;
        this.isError = true;
        this.signinStatusError = err.status;
        this.clientState.isBusy = false;
      });
    }).catch(err => {
      this.clientState.isBusy = false;
    });
  }

  signOut(): void {
    this.socialService.signOut().then(res => {
    }).catch(err => {
      this.message = err.message;
      this.isError = true;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
