import { Component, OnInit } from '@angular/core';
import {Contact} from "../../../model/contact";
import {ContactService} from '../../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact: Contact = {
    name: '',
    email : '',
    phone : '',
    message : ''

}as Contact;
  messageAr = '';
  messageEn = '';
  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
  }
  contactMessages(contact:Contact): void {
    this.contactService.saveContact(contact).subscribe(
      response => {
        this.contact = response;
        this.messageAr = 'تم الارسال بنجاح و سيتم التواصل معك في اقرب وقت';
        this.messageEn = 'Message was sent Successfully, and you will be contacted soon';
        this.contact = new Contact();
        setTimeout(()=> {
          this.messageEn = '';
          this.messageAr = '';
        },3000
        );
      },error => {
        this.messageAr = error.error.bundleMessage.ar || 'فشل في الارسال';
        this.messageEn = error.error.bundleMessage.en || 'failed to send message';
        setTimeout(()=> {
          this.messageEn = '';
          this.messageAr = '';
        },3000
        );
      }
    );
  }

}
