import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'v-label',
  templateUrl: './v-label.component.html',
  styleUrls: ['./v-label.component.css']
})
export class LabelComponent implements OnInit {

  @Input() public text: any;
  @Input() public required: boolean = false;
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: string = '';
  
  // Indisplay variables
  @Input() public hasSuspendedStyle: boolean = false;
  @Input() public isForIndisplay: boolean = false;
  @Output() onLabelClick = new EventEmitter<void>();

  constructor() {}

  get formField():FormControl {
    if(this.fieldName != '') {
      return this.parentForm?.get( this.fieldName ) as FormControl;
    }
  }

  onLabelClickFn() {
    this.onLabelClick.emit();
  }

  ngOnInit(): void {
  }

}
