import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AdminNavModel, AdminNavItem } from '../../../shared/models';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { JwtTokenHelper } from '../../common';
import { UserRole } from '../../models/user/user.model';

@Component({
  selector: 'admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  isToggleAdminNav: boolean;
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {

    // this.sub = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     if (this.router.url == '/admin') {
    //       this.router.navigate(['admin', 'restaurant'])
    //     }
    //     if (!JwtTokenHelper.isRole(UserRole.Admin)) {
    //       this.router.navigate(['login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
    //     }
    //   }
    // });
  }
  ngOnInit() {

  }

  onToggleAdmimNav = (isToggleAdminNav: boolean) => {
    this.isToggleAdminNav = isToggleAdminNav;
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }
}
