import { Component, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService, LoginService, AppAuthService, LanguageCode } from '../../services';
import { StorageService, I18nService } from '../../core';
import { ClientState } from '../../state';
import { UserResponseModel } from '../../models';
import { JwtTokenHelper } from '../../common';
import { StorageKey } from '../../services/storage-key/storage-key';

@Component({
  selector: 'owner-header',
  templateUrl: './owner-header.component.html',
  styleUrls: ['./owner-header.component.scss']
})
export class OwnerHeaderComponent implements OnInit {
  private isToggleOwnerNav: boolean;
  private userInfo: UserResponseModel = new UserResponseModel();
  private isAuthen: boolean;

  @Output() toggleOwnerNav: EventEmitter<boolean> = new EventEmitter();

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

  ngOnInit() {
    this.isAuthen = this.authService.isAuthenticated();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.isAuthen = this.authService.isAuthenticated();
    if (this.isAuthen) {
      this.userInfo = JwtTokenHelper.GetUserInfo();
    }
  }

  onToggleOwnerNav = () => {
    this.isToggleOwnerNav = !this.isToggleOwnerNav;
    this.toggleOwnerNav.emit(this.isToggleOwnerNav);
  }

  onLanguageChange = (langCode: LanguageCode) => {
    this.languageService.setLanguage(langCode);
    window.location.href = window.location.href;
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
