import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  private wowSubscription: Subscription;
  private resSearch: string;

  public userSettings3: any = {
    showCurrentLocation: false,
    geoCountryRestriction: ['es'],
    geoTypes: ['address']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wowService: NgwWowService,
  ) {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      // Reload WoW animations when done navigating to page,
      // but you are free to call it whenever/wherever you like
      window.scroll(0, 0);
      this.wowService.init();
    });
  }

  ngOnInit() {
    // you can subscribe to WOW observable to react when an element is revealed
    this.wowSubscription = this.wowService.itemRevealed$.subscribe(
      (item: HTMLElement) => {
        // do whatever you want with revealed element
      });
  }

  ngOnDestroy() {
    // unsubscribe (if necessary) to WOW observable to prevent memory leaks
    this.wowSubscription.unsubscribe();
  }

  onSearchChild = () => {
    this.router.navigate(['child']);
  }

  getAddressOnChange = (event) => {
    // console.log(event)
  }

  getAddress(place: Object) {
    var location = place['geometry']['location'];
    var lat = location.lat();
    var lng = location.lng();
  }
}
