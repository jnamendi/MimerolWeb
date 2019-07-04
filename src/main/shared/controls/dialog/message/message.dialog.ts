import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ClientState } from '../../../state';

@Component({
    selector: 'message-dialog',
    templateUrl: './message.dialog.html',
})
export class MessageDialogComponent implements OnInit {
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
