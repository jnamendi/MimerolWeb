import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../core';

@Component({
    selector: 'order-confirm-dialog',
    templateUrl: './order-confirm.dialog.html',
    styleUrls: ['./order-confirm.dialog.scss']
})
export class OrderConfirmComponent implements OnInit {
    @Input() visible: boolean;
    @Input() isEmpty: boolean;
    @Input() isResClose: boolean;
    @Input() existingEmail: boolean;
    @Output() onClose: EventEmitter<boolean> = new EventEmitter();
    @Output() onConfirmNavigate: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService
    ) {

    }

    ngOnInit(): void {
    }

    onCheckRoute = () => {
        this.visible = false;
    }

    onClosePopup = () => {
        this.visible = false;
        this.onClose.emit(true);
    }

    onNavigate = () => {
        this.visible = false;
        this.onConfirmNavigate.emit(true);
    }
}
