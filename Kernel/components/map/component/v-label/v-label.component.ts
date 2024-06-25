import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'v-label',
  templateUrl: './v-label.component.html',
  styleUrls: ['./v-label.component.css']
})
export class LabelComponent implements OnInit {

  @Input() public text: any;
  @Input() public required: any = "false";
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: string = '';

  constructor() {}

  get formField():FormControl {
    if(this.fieldName != '') {
      return this.parentForm?.get( this.fieldName ) as FormControl;
    }
  }

  ngOnInit(): void {
  }

}
