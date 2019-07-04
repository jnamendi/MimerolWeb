import { Component, OnInit, Input } from '@angular/core';
import { AdminNavModel, AdminNavItem } from '../../../shared/models';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { adminNavItems } from "./admin-sidebar.model";
import { JwtTokenHelper } from '../../common';
import { I18nService } from '../../core';
@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSideBarComponent implements OnInit {
  @Input() isToggleAdminNav: boolean;

  private navAdminModels: AdminNavModel = { items: adminNavItems };
  private locationPath: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private i18nService: I18nService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.locationPath = event.urlAfterRedirects.slice(1);
        let navigationPaths = this.locationPath.split('/');
        this.navAdminModels.items.map(main => {
          main.children.map(parent => {
            if (parent.url == navigationPaths[1]) {
              parent.isActive = true;
            }
            if (parent.children.some(child => child.url == navigationPaths[1])) {
              parent.isActive = true;
            }
          })
        })
      }
    })
  }

  ngOnInit() {
  }

  onToggleNav = (type: string, item: AdminNavItem) => {
    if (item) {
      if (item.children.length <= 0) {
        this.router.navigate(['admin', item.url]);
      }

      let navAdminItems = this.navAdminModels.items.find(x => x.type == type).children;
      navAdminItems.filter(x => x != item).map(x => {
        x.isActive = false;
      });
      let itemInModel = navAdminItems.find(y => y == item);
      itemInModel.isActive = !itemInModel.isActive;
    }
  }

  checkActivateUrl = (parentItem: AdminNavItem) => {
    let navigationPaths = this.locationPath ? this.locationPath.split('/') : null;

    if (!parentItem && !navigationPaths) {
      return false;
    }

    return parentItem.url == navigationPaths[1] || parentItem.children.some(child => child.url == navigationPaths[1]);
  }

  get userName(): string | null {
    return JwtTokenHelper.userName;
  }
}
