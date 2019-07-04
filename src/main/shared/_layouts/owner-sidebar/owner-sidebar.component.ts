import { Component, OnInit, Input } from '@angular/core';
import { AdminNavModel, AdminNavItem } from '../../../shared/models';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { ownerNavItems } from './owner-sidebar.model';
import { JwtTokenHelper } from '../../common';
import { I18nService } from '../../core';
@Component({
  selector: 'owner-sidebar',
  templateUrl: './owner-sidebar.component.html',
  styleUrls: ['./owner-sidebar.component.scss']
})
export class OwnerSideBarComponent implements OnInit {
  @Input() isToggleOwnerNav: boolean;

  private navOwnerModels: AdminNavModel = { items: ownerNavItems };
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
        this.navOwnerModels.items.map(main => {
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

      let navAdminItems = this.navOwnerModels.items.find(x => x.type == type).children;
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
