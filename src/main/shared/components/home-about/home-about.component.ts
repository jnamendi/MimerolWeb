import { Component, OnInit, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommentService } from '../../services';
import { CommentModel } from '../../models';
declare var $: any;
@Component({
    selector: 'home-about',
    templateUrl: './home-about.component.html',
    styleUrls: ['./home-about.component.scss']
})
export class HomeAboutComponent implements OnInit, OnChanges, AfterViewInit {
    private commentModels: CommentModel[] = [];
    private error: string;

    constructor(
        private commentService: CommentService,
    ) {
    }

    async ngOnInit(): Promise<void> {
        Promise.resolve(this.onLoadCommnets()).then(res => {
            setTimeout(() => {
                this.onInitBxSlider();
            }, 500);
        }, err => {
            this.error = err.message;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.onInitBxSlider();
    }

    ngAfterViewInit(): void {
    }

    onInitBxSlider = () => {
        $('.bxslider').bxSlider({
            mode: 'vertical',
            minSlides: 3,
            maxSlides: 3,
            adaptiveHeight: true,
            infiniteLoop: false,
            pager: false,
            hideControlOnEnd: true,
        });
    }

    onLoadCommnets = () => {
        this.commentService.onGetBySize(10).subscribe(
            res => {
                if (res.content == null) {
                    this.commentModels = [];
                } else {
                    this.commentModels = res.content.map((item, index) => {
                        return <CommentModel>{ ...item };
                    });
                }
            }, err => {
                this.error = err.message;
            })
    }
}
