import { Directive, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GoogleApiService } from '../../services';

declare var google: any;

@Directive({
    selector: '[Googleplace]',
    providers: [NgModel],
    host: {
        '(input)': 'onInputChange()'
    }
})
export class GoogleplaceDirective implements OnInit {
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    modelValue: any;
    autocomplete: any;
    map: any;
    input: any;
    infowindow: any;
    service: any;
    private _el: HTMLElement;

    constructor(private el: ElementRef, private model: NgModel, private googleApiService: GoogleApiService) {
        this._el = el.nativeElement;
        this.modelValue = this.model;
        this.input = this._el;
        // this.autocomplete = new google.maps.places.Autocomplete(input, {});
        // google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
        //     var place = this.autocomplete.getPlace();
        //     this.invokeEvent(place);

        // });
        // this.autocomplete = new google.maps.places.PlacesService(input);
        // google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
        //     var place = this.autocomplete.getPlace();
        //     this.invokeEvent(place);

        // });
    }

    ngOnInit(): void {
        // this.map = new google.maps.Map(document.getElementById('map'), {
        //     center: { lat: 20.296100, lng: 85.824500 },
        //     zoom: 13,
        //     mapTypeId: 'roadmap'
        // });

        // this.onInitAutocomplete();
        this.initMap();
    }

    createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: this.map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function () {
            this.infowindow.setContent(place.name);
            this.infowindow.open(this.map, this);
        });
    }

    callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                // this.createMarker(results[i]);
            }
        }
    }

    initMap() {
        var pyrmont = { lat: 41.390205, lng: 2.154007 };

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: pyrmont,
            zoom: 15
        });

        this.infowindow = new google.maps.InfoWindow();
        this.service = new google.maps.places.PlacesService(this.map);

    }

    onInitAutocomplete = () => {
        // Create the search box and link it to the UI element.
        var searchBox = new google.maps.places.SearchBox(this.input);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);

        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener('bounds_changed', function () {
            searchBox.setBounds(this.map && this.map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                // markers.push(new google.maps.Marker({
                //     map: this.map || null,
                //     icon: icon,
                //     title: place.name,
                //     position: place.geometry.location
                // }));

                // if (place.geometry.viewport) {
                //     // Only geocodes have viewport.
                //     bounds.union(place.geometry.viewport);
                // } else {
                //     bounds.extend(place.geometry.location);
                // }
            });
            // this.map.fitBounds(bounds);
        });
    }

    loadMap() {
        // this.geolocation.getCurrentPosition().then((position) => {

        //   this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //   alert(this.latLng);
        //   this.mapOptions = {
        //     center: this.latLng,
        //     zoom: 14,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        //   }   

        //   this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

        // }, (err) => {
        //   alert('err '+err);
        // });

    }

    nearbyPlace() {
        // this.loadMap();
        // this.markers = [];
        let service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch({
            location: [-33.8669710, 151.1958750],
            types: ['restaurant']
        }, (results, status) => {
            this.callback(results, status);
        });
    }

    // callback(results, status) {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         for (var i = 0; i < results.length; i++) {
    //         }
    //     }
    // }

    getRestaurants(latLng): Promise<any> {
        var service = new google.maps.places.PlacesService();
        let request = {
            location: latLng,
            radius: 10000,
            types: ["restaurant"]
        };
        return new Promise((resolve, reject) => {
            service.nearbySearch(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }

            });
        });

    }

    invokeEvent(place: Object) {
        // this.setAddress.emit(place);
    }

    onInputChange() {
        // this.googleApiService.onGetRestaurants().subscribe(res => {
        // }, err => {})
        // this.nearbyPlace();
        var pyrmont = { lat: 41.390205, lng: 2.154007 };

        this.service.nearbySearch({
            location: pyrmont,
            radius: 500,
            type: ['restaurant']
        }, this.callback);
    }
}