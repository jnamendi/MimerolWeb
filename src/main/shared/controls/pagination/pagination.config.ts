// todo: split
import { Injectable } from '@angular/core';

/** Provides default values for Pagination and pager components */
@Injectable()
export class PaginationConfig {
    private numberOfShowingPages: number = 5;
    constructor() {
        this.numberOfShowingPages = this.numberOfShowingPages >= 3
            ? this.numberOfShowingPages
            : 3;
    }
    public main: any = {
        maxSize: this.numberOfShowingPages,
        itemsPerPage: 10,
        boundaryLinks: false,
        directionLinks: true,
        firstText: 'First',
        previousText: 'Previous',
        nextText: 'Next',
        lastText: 'Last',
        pageBtnClass: '',
        rotate: true
    };
}
