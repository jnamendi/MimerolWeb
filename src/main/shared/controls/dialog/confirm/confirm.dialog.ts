import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ClientState } from '../../../state';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm.dialog.html',
})
export class ConfirmDialogComponent implements OnInit {
    @Input() visible: boolean = false;
    @Input() header: string;
    @Input() content:string;
    @Input() confirmText: string;
    
    @Output() confirm: EventEmitter<boolean> = new EventEmitter();
    constructor(
        private clientState: ClientState,
    ) {
    }

    ngOnInit(): void {
      
    }

    onConfirm = () => {
        this.confirm.emit(true);
    }

    onClose = () => {
        this.confirm.emit(false);
    }

}
