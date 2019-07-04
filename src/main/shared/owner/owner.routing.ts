import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  OwnerHeaderComponent,
  OwnerLayoutComponent,
  OwnerSideBarComponent
} from "../_layouts";

import {
  OwnerContactInfoComponent,
  OwnerInvoicingAddressComponent,
  OwnerContactsComponent,
  OwnerOrdersComponent,
  OwnerRatingsComponent,
  OwnerArchiveComponent,
  OwnerMerchandiseInfoComponent,
  OwnerMerchandiseOrderStatusComponent,
  OwnerMerchandiseDeliveryBagsComponent,
  OwnerInvoicesComponent,
  OwnerPendingChargesComponent,
  OwnerOnlinePaymentsComponent,
  OwnerMerchandiseBoxesComponent,
  OwnerMerchandiseJacketsComponent,
  OwnerAdvertisementInfoComponent,
  OwnerSoftwareComponent,
  OwnerMenuComponent,
  OwnerMenuCreationComponent,
  OwnerMenuDetailComponent,
  OwnerMenuItemComponent,
  OwnerMenuItemCreationComponent,
  OwnerMenuItemDetailComponent,
  OwnerPromotionComponent,
  OwnerPromotionCreationComponent,
  OwnerPromotionDetailComponent
} from "./components";

import {
  AuthGuardService as AuthGuard,
  RoleGuardService as RoleGuard
} from '../services';

const routes: Routes = [
  {
    path: '',
    component: OwnerLayoutComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'owner'
    },
    children: [
      { path: 'contact-info', component: OwnerContactInfoComponent },
      { path: 'invoicing-address', component: OwnerInvoicingAddressComponent },
      { path: 'contacts', component: OwnerContactsComponent },
      { path: 'live-orders', component: OwnerOrdersComponent },
      { path: 'comments', component: OwnerRatingsComponent },
      { path: 'archive', component: OwnerArchiveComponent },
      { path: 'merchandise-info', component: OwnerMerchandiseInfoComponent },
      { path: 'merchandise-order-status', component: OwnerMerchandiseOrderStatusComponent },
      { path: 'merchandise-delivery-bags', component: OwnerMerchandiseDeliveryBagsComponent },
      { path: 'invoices', component: OwnerInvoicesComponent },
      { path: 'pending-charges', component: OwnerPendingChargesComponent },
      { path: 'online-payments', component: OwnerOnlinePaymentsComponent },
      { path: 'merchandise-boxes', component: OwnerMerchandiseBoxesComponent },
      { path: 'merchandise-jackets', component: OwnerMerchandiseJacketsComponent },
      { path: 'advertisement-info', component: OwnerAdvertisementInfoComponent },
      { path: 'menu', component: OwnerMenuComponent },
      { path: 'menu/new', component: OwnerMenuCreationComponent },
      { path: 'menu/:id', component: OwnerMenuDetailComponent },
      { path: 'menu-item', component: OwnerMenuItemComponent },
      { path: 'menu-item/new', component: OwnerMenuItemCreationComponent },
      { path: 'menu-item/:id', component: OwnerMenuItemDetailComponent },
      { path: 'software', component: OwnerSoftwareComponent },
      { path: 'promotion', component: OwnerPromotionComponent },
      { path: 'promotion/new', component: OwnerPromotionCreationComponent },
      { path: 'promotion/:id', component: OwnerPromotionDetailComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }