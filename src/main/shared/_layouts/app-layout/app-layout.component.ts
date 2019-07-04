import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { ClientState } from '../../state';
import { LanguageService } from '../../services/api/language/language.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {
  isToggleNav: boolean;
  isToggleSearch: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientState: ClientState,
    private languageService: LanguageService,
  ) {
  }
  ngOnInit(): void {

  }

  onToggleNav = (isToggle: boolean) => {
    this.isToggleNav = isToggle ? false : !this.isToggleNav;
  }

  onToggleSearch = (isToggleSearch: boolean) => {
    this.isToggleSearch = isToggleSearch == false ? isToggleSearch : !this.isToggleSearch;
  }
}
