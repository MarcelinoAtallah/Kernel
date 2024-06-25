import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
//import {MatButtonToggleModule} from '@angular/material/button-toggle';
@Component({
  selector: 'v-toggle',
  templateUrl: './v-toggle.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VToggleComponent),
      multi: true,
    },
  ],
})

export class VToggleComponent implements ControlValueAccessor, AfterViewInit {

  public value!: boolean;
  public change!: (value: boolean) => void;
  public touched!: () => void;
  public isDisabled!: boolean;

  @Input() public label: any;
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: string = '';
  @Input() public color: string = ''; // Acceptable colors: primary, warn
  @Input() public checked: boolean  = false;
  @Input() public disabled :any = false;
  @Output() changed = new EventEmitter<void>();

  @Output() toggleChange = new EventEmitter<void>();

  toggleValue: boolean = false;

 constructor() {
    if(this.color == '') {
      this.color = "primary";
    }
  }

  ngAfterViewInit(): void {
    if(this.fieldName != "") {
      this.formField.setValue(this.checked, {emitEvent:false});
    }
  }

  get formField():FormControl {
    if(this.fieldName != '') {
      return this.parentForm?.get( this.fieldName ) as FormControl;
    }
  }

  onchange(event: Event) {
    let value = (<HTMLInputElement>event.target).checked;
    this.checked = value;
    if(this.fieldName == "") {
      this.changed.emit();
    }
  }

  writeValue(obj: any): void {
    this.checked = this.convertStringToBoolean(obj);
    if(this.fieldName == "") {
      this.changed.emit();
    }
  }

  public convertStringToBoolean(value: any) {
    if(value == "1") {
      return true;
    } else if(value == "0") {
      return false;
    } else {
      return false;
    }
  }

  registerOnChange(fn: any): void {
    this.changed = fn;
  }

  registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

// add by rony
  onToggleChange(event: any): void {
    let toggleValue: boolean = event;
    this.toggleChange.emit();
  }
}
