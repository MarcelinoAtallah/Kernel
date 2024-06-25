import {Component, Input, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';

@Component({
  selector: 'v-button',
  templateUrl: './v-button.component.html',
  styleUrls: ['./v-button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() class:any ;
  @Input() value :any;
  @Input() btnActionType: any;
  @Input() customStyle: String = "";
  @Input() btnType: any;
  @Input() parentForm: any;
  @Input() fontawesome: String = "";
  @Input() disabled: boolean = false;
  @Input() isLoginBtn: boolean = false;
  @Input() allowErrorAlertOnSubmit: boolean = true;

  constructor(private commonFunctions: CommonFunctions) {}

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
    console.log("this.formGroup =",this.formGroup);
    if(this.formGroup.status == "INVALID" && this.formGroup != undefined) {
      this.formGroup.markAllAsTouched();
      if(this.allowErrorAlertOnSubmit) {
        this.commonFunctions.alert("alert", "Fill in mandatory fields");
      }
    }
  }
}