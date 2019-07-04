import { Component } from '@angular/core';
import { ContactModel } from '../../models';
import { ClientState } from '../../state';
import { ApiError } from '../../services/api-response/api-response';
import { NgForm } from '@angular/forms';
import { ContactService } from '../../services/api/contact/contact.service';

@Component({
  selector: 'page-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  private contactModel: ContactModel = new ContactModel();
  private isCreateContactSuccess: boolean;
  private isError: boolean;
  private createContactError: string;
  private createContactStatusError: number = 0;

  constructor(
    private contactService: ContactService,
    private clientState: ClientState,
  ) {
  }

  onCreateContact = (form: NgForm) => {
    if (!form.valid) {
      return;
    }

    this.clientState.isBusy = true;
    this.contactService.createContact(this.contactModel).subscribe(res => {
      this.isCreateContactSuccess = true;
      this.clientState.isBusy = false;
      this.isError = false;
      form.resetForm();
    }, (err: ApiError) => {
      this.createContactError = err.message;
      this.isError = true;
      this.createContactStatusError = err.status;
      this.clientState.isBusy = false;
    });
  }
}
