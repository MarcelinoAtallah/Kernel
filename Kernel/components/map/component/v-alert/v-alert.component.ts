import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-v-alert',
  templateUrl: './v-alert.component.html',
  styleUrls: ['./v-alert.component.css'],
})
export class VAlertComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  public alertType: string = '';
  public alertMessage: string = '';


  ngOnInit(): void {
    this.alertType = this.data.type;
    this.alertMessage = this.data.message;

  }

}
