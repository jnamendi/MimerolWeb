import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AdminNavModel, AdminNavItem, UserTokenParsing, UserResponseModel } from '../../../shared/models';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { I18nService, StorageService } from '../../core';
import { JwtTokenHelper } from '../../common';
import { StorageKey } from '../../services/storage-key/storage-key';
import { LanguageService, LanguageCode } from '../../services/api/language/language.service';
import { LoginService } from '../../services/api/app/login.service';
import { AppAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss']
})
export class AppSideBarComponent implements OnInit, OnChanges {
  @Input() isToggleNav: boolean;
  @Output() onToggleAppNav: EventEmitter<boolean> = new EventEmitter();
  private locationPath: string;
  private userInfo: UserResponseModel = new UserResponseModel();
  private isAuthen: boolean;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private loginService: LoginService,
    private authService: AppAuthService,
    private storageService: StorageService,
    private i18nService: I18nService,
  ) {
  }

  ngOnInit() {
    this.isAuthen = this.authService.isAuthenticated();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.isAuthen = this.authService.isAuthenticated();
    if (this.isAuthen) {
      this.userInfo = JwtTokenHelper.GetUserInfo();
    }
  }

  onToggleNav = (isToggleNav: boolean) => {
    this.onToggleAppNav.emit(isToggleNav);
  }

  onLanguageChange = (langCode: LanguageCode) => {
    this.languageService.setLanguage(langCode);
    this.onToggleNav(true);
  }

  onLogout = () => {
    this.loginService.onLogout().then(res => {
      this.userInfo = null;
      this.storageService.onRemoveToken(StorageKey.User);
      this.storageService.onRemoveAllTokens();
      this.router.navigate(['login']);
      this.onToggleNav(true);
    });
  }

  setLanguage(language: string) {
    let isChange = language != this.i18nService.language;
    this.i18nService.language = language;
    this.onToggleNav(true);
    if (isChange) {
      window.location.reload();
    }
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get userName(): string | null {
    return JwtTokenHelper.userName;
  }
}
