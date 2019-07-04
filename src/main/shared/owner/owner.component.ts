import { Component } from '@angular/core';
import { ApiService } from '../services';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent {
  title: string;
  languages: Array<any>;
  isToggleNav: boolean;
  isToggleSearch: boolean;

  constructor(private _api: ApiService,
  ) {
    this.title = this._api.title;
  }

  onToggleNav = (isToggle: boolean) => {
    this.isToggleNav = isToggle ? false : !this.isToggleNav;
  }

  onToggleSearch = () => {
    this.isToggleSearch = !this.isToggleSearch;
  }
}
