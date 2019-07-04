import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
    selector: '[highlight]'
})
export class HighlightTextDirective implements OnInit, OnChanges {
    @Input('highlight') color: string;

    constructor(private _element: ElementRef) { 
        
    }

    ngOnInit() {
        this._changeColor(this.color);
        this._element.nativeElement.style.fontWeight = '700';
    }

    ngOnChanges() {
        this._changeColor(this.color);
    }

    private _changeColor(color: string) {
        this._element.nativeElement.style.color = color || 'black';
    }
}