import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AdminNavModel, AdminNavItem } from '../../../shared/models';

@Component({
  selector: 'owner-layout',
  templateUrl: './owner-layout.component.html',
  styleUrls: ['./owner-layout.component.scss']
})
export class OwnerLayoutComponent implements OnInit {
  isToggleOwnerNav: boolean;

  constructor() {
   
  }
  ngOnInit() {
  }

  onToggleOwnerNav = (isToggleOwnerNav: boolean) => {
    this.isToggleOwnerNav = isToggleOwnerNav;
  }
}
