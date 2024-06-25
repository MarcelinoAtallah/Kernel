import { Component, EventEmitter, Input, Output,forwardRef } from '@angular/core';
import { FormControl, FormGroup,ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'v-dropdownstatic',
  templateUrl: './v-dropdownstatic.component.html',
  styleUrls: ['./v-dropdownstatic.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VDropdownstaticComponent),
      multi: true,
    },]
})
export class VDropdownstaticComponent implements ControlValueAccessor {
  dataList: Array<any> = [];
  schedule: { branch: '' };
  @Input() dropdownWidth: string;
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;

  // Value accessor properties and methods
  private innerValue: any;
  private onChangeCallback: (value: any) => void;
  private onTouchedCallback: () => void;

  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }

  constructor() {
    this.dataList = [
      { code: 1, name: "week" },
      { code: 2, name: "period" }
    ];
  }
 // ControlValueAccessor methods
  writeValue(value: any): void {
    this.innerValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error('Method not implemented.');
     // Implement this if you need to disable the component
  }
// Event handler for value changes
onValueChange(value: any): void {
  this.innerValue = value;
  this.onChangeCallback(value);
}

// Event handler for touch events
onTouched(): void {
  this.onTouchedCallback();
}
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
}
