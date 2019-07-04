import { Component, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { UserResponseModel } from '../../models';
import { StorageService, I18nService } from '../../core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { JwtTokenHelper } from '../../common';
import { ClientState } from '../../state';
import { AppAuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/api/app/login.service';
import { LanguageService, LanguageCode } from '../../services/api/language/language.service';
import { StorageKey } from '../../services/storage-key/storage-key';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit, OnChanges {
  private isToggleAdminNav: boolean;
  private userInfo: UserResponseModel = new UserResponseModel();
  private isAuthen: boolean;

  @Output() toggleAdminNav: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private loginService: LoginService,
    private authService: AppAuthService,
    private storageService: StorageService,
    private clientState: ClientState,
    private i18nService: I18nService,
  ) {
    this.isAuthen = this.authService.isAuthenticated();
    if (this.isAuthen) {
      this.userInfo = JwtTokenHelper.GetUserInfo();
    }
  }

  onToggleAdmimNav = () => {
    this.isToggleAdminNav = !this.isToggleAdminNav;
    this.toggleAdminNav.emit(this.isToggleAdminNav);
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

  onLanguageChange = (langCode: LanguageCode) => {
    this.languageService.setLanguage(langCode);
  }

  onLogout = () => {
    this.loginService.onLogout().then(res => {
      this.userInfo = null;
      this.storageService.onRemoveToken(StorageKey.User);
      this.router.navigate(['login']);
    });
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
    window.location.href = window.location.href;
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
