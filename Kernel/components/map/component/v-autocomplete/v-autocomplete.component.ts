import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, FormGroupDirective, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { map, startWith } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'v-autocomplete',
  templateUrl: './v-autocomplete.component.html',
  styleUrls: ['./v-autocomplete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor {

  public value!: string;
  public changed!: (valuee: string) => void;
  public touched!: () => void;
  public isDisabled!: boolean;

  @Input() dataList: string[] = [];
  @Input() placeholder:any;
  @Input() required:any;
  @Input() label:any;
  @Input() parentForm:any;
  @Input() fieldName:any;
  @Input() matAppearance: any;
  @Input() type: any;
  @Input() floatLabel: any;

  filteredOptions?: Observable<string[]>;

  get formField():FormControl {
    return this.parentForm?.get( this.fieldName ) as FormControl;
  }

  matcher = new MyErrorStateMatcher();

  constructor() {}

  public onChange(event: Event):void {
    const value: string = ( <HTMLInputElement>event.target ).value;
    this.changed(value);
  }

  public writeValue(value: string): void {
    if(this.matAppearance == '') {
      this.matAppearance = 'fill';
    }
    this.value = value;
    this.filteredOptions = this.formField.valueChanges.pipe(
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.value = filterValue;
    return this.dataList.filter(dataList => dataList.toLowerCase().includes(filterValue));
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
