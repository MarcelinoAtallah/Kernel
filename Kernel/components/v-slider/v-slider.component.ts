import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'v-slider',
  templateUrl: './v-slider.component.html',
  styleUrls: ['./v-slider.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements ControlValueAccessor {

  public sliderValue!: string;
  public changed!: (sliderValue: string) => void;
  public touched!: () => void;
  public isDisabled!: boolean;

  @Input() public min : any;
  @Input() public max : any;
  @Input() public label : any;
  @Input() public matAppearance : any;
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;
  @Input() public value: any;
  @Input() public floatLabel: any;

  get formField():FormControl {
    return this.parentForm?.get( this.fieldName ) as FormControl;
  }

  constructor() {}

  public writeValue() {
    if(this.matAppearance == '') {
      this.matAppearance = 'fill';
    }
  }

  onchange(event: any) {
    this.value = event.source.value;
    this.changed(event.source.value);
  }

  public registerOnChange(fn: any): void {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

}
