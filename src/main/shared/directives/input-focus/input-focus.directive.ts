import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2, HostListener } from '@angular/core';

@Directive({
    selector: '[inputFocus]'
})
export class InputFocusDirective implements OnInit, OnChanges {

    constructor(private renderer: Renderer2, private el: ElementRef) {

    }

    ngOnInit() {
        setTimeout(() => {
            if (this.isHasValue()) {
                this.onActive();
            }
        }, 200)
    }

    ngOnChanges() {
        if (this.isHasValue()) {
            this.onActive();
        }
    }

    @HostListener('focus') onFocus() {
        this.onActive();
    }

    @HostListener('focusout') onFocusout() {
        if (!this.isHasValue()) {
            this.onInActive();
        }
    }

    onActive = () => {
        this.renderer.addClass(this.el.nativeElement, 'active');
    }

    onInActive = () => {
        this.renderer.removeClass(this.el.nativeElement, 'active');
    }

    isHasValue = (): boolean => {
        return !!this.el.nativeElement.value;
    }
}