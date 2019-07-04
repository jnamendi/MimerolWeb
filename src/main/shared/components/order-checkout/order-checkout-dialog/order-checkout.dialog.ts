import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../core';
import { JwtTokenHelper } from '../../../common';
import { OrderCheckoutModel } from '../../../models/order/order.model';
import { Configs } from '../../../common/configs/configs';
import { ApiUrl } from '../../../services/api-url/api-url';

@Component({
    selector: 'order-checkout-dialog',
    templateUrl: './order-checkout.dialog.html',
    styleUrls: ['./order-checkout.dialog.scss']
})
export class OrderCheckoutDialogComponent implements OnInit {

    @Input() visible: boolean;
    @Input() checkedoutItem: OrderCheckoutModel;
    private baseUrl = ApiUrl.BaseUrl;
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

    onClose = () => {
        this.visible = false;
    }
}
