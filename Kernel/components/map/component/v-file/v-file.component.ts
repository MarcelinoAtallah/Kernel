import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'v-file',
  templateUrl: './v-file.component.html',
  styleUrls: ['./v-file.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VFileComponent),
      multi: true,
    },
  ]
})

export class VFileComponent implements ControlValueAccessor {
  
  // public value!: string;
  // public changed!: (value: string) => void;

  public value!: FormData;
  public changed!: (value: FormData) => void;
  public touched!: () => void;
  public isDisabled!: boolean;

  public selectedFile!: any;
  
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;
  @Input() public required: any;
  @Input() public acceptedFileTypes: any;
  @Input() public label: any;
  @Input() public allowLabel: boolean = true;

  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();

  public formFieldd: any;
  
  // get formField():FormControl {
  //   return this.parentForm?.get( this.fieldName ) as FormControl;
  // }

  constructor() { }

  public onChange(event: HTMLInputEvent):void {
    // If element is being used in a form then create a form data to append the value to it noting that a form data must be used to send data to spring app
    if(this.fieldName != '') {
      const formData = new FormData()
      formData.append(this.fieldName, event.target.files[0]);
      this.changed(formData);
    } else {
      this.onChangeEvent.emit(( event.target.files[0] ));
    }
  }

  public writeValue(value: string): void {

    // If value is being used in a form then create form field
    if(this.fieldName != '') {
      this.formFieldd = this.parentForm?.get( this.fieldName ) as FormControl;
    }

    // Filter browse file based on acceptedFileTypes
    if(typeof(this.acceptedFileTypes) != 'undefined') {
      if(this.acceptedFileTypes.toLowerCase() == 'images') {
        this.acceptedFileTypes = 'image/*';
      } else if(this.acceptedFileTypes.toLowerCase() == 'documents') {
        this.acceptedFileTypes = '.xlsx,.csv,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf';
      } else if(this.acceptedFileTypes.toLowerCase() == 'all') {
        this.acceptedFileTypes = '.xlsx,.xls,.csv,.doc,image/*,.docx,.ppt,.pptx,.txt,.pdf';
      } else {
        this.acceptedFileTypes = "."+this.acceptedFileTypes;
      }
    }
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
