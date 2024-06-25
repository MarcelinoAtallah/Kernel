import {Component, HostListener, Input, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'v-button',
  templateUrl: './v-button.component.html',
  styleUrls: ['./v-button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() class:any ;
  @Input() value :any;
  @Input() btnActionType:any;
  @Input() customStyle: any;
  @Input() btnType: any;
  @Input() parentForm: any;
  @Input() fontawesome: any;
  @Input() disabled: boolean = false;
  @Input() btnClass: string = 'defaultBtn';
  @Input() step='';

  constructor() {}

  get formGroup():FormGroup {
    return this.parentForm as FormGroup;
  }

  ngOnInit(): void {
    if(typeof(this.btnActionType) == 'undefined') {
      this.btnActionType = 'button';
    }

    if(typeof(this.value) == 'undefined') {
      this.value = '';
    }

    if(typeof(this.fontawesome) == 'undefined') {
      this.fontawesome = '';
    }
  }

  formValidation() {
    if(this.formGroup.status == "INVALID") {
      // $("#v-submit-btn").addClass("vibrate");
      this.step='true';
      setTimeout(() => {
        this.step='';
      }, 1000);
      this.formGroup.markAllAsTouched();
    }
  }
}