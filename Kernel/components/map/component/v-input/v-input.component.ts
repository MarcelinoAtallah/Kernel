import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'v-input',
  templateUrl: './v-input.component.html',
  styleUrls: ['./v-input.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ]
})

export class InputComponent implements ControlValueAccessor
{
  public value: string = '';
  public changed: (value: string) => void;
  public touched!: () => void;
  public isDisabled!: boolean;
  
  // General elements
  @Input() public parentForm?: FormGroup; // used to specify the formgroup of the element
  @Input() public fieldName: string = ''; // used to set formControl field name
  @Input() public fieldNamee: string = ''; // used to set formControl field name
  @Input() public matAppearance: any = 'fill'; // Mainly used for material design look and feel
  @Input() public label: any; // used to set the label for the input element floating label
  @Input() public required: any = false; // used to set if the input element is required or no
  @Input() public color: any = 'primary'; // Mainly used for checkbox
  @Input() public labelPosition: any; // used to set 'before' | 'after' for radio buttons
  @Input() public fontawesome: any = ''; // used to add fontawesome icons to inputs
  @Input() public disable: any = false; // used to disable input element
  @Input() public readonly: any = false; // used to set readOnly on input element
  @Input() public allowLabel: boolean = true; // to restrict or allow labels
  @Input() public type: any; // used to set the input type
  @Input() public placeholder: any; // used to set input element placeholder
  @Input() public floatingLabel: any = 'never'; // used to restrict or allow floating labels
  // Text area elements
  @Input() public textareaCols: any; // used to set the columns of a text area
  @Input() public textareaRows: any; // used to set the rows of a text area
  // Radio & Select elements
  @Input() public dataURL: string = ''; // used for radio & select elements
  public radioJSON: any = [];
  // Select elements
  @Input() public isMultiSelect: boolean = false; // used to check whether multiple
  public selectJSON: any = [];
  // public selectedData: string[] = ['26'];
  

  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();

  public formFieldd: any;

  get formField(): FormControl
  {
    if (this.fieldName != '')
    {
      return
    }
  }

  // Error value matcher for Angular Materials to handle catching errors
  // matcher = new MyErrorStateMatcher();

  constructor(private http: HttpClient) { }

  public onChange(event: Event): void
  {
    if (this.fieldName != '')
    {
      let value = '';
      if (this.type == 'checkbox') {
        // Check if input type is checkbox to return if checked or no
        value = (<HTMLInputElement>event.target).checked.toString();
        this.changed(value);
      } else if (this.type == 'radio') {
        value = (<HTMLInputElement>event.target).value;
        this.changed(value);
      } else {
        // Check if input type is of text type to return value
        value = (<HTMLInputElement>event.target).value;
        this.changed(value);
      }
    }
    console.log("fieldName ============ ", this.fieldName, " ========== ", event);
  }

  public change(event: any): void
  {
    this.onSelectionChange();
  }

  public onSelectionChange()
  {
    // Used to send change event to parent
    this.onChangeEvent.emit((<HTMLInputElement>event.target).value);
  }

  public writeValue(value: string): void
  {
    this.value = value;
    this.formFieldd = this.parentForm?.get(this.fieldName) as FormControl;

    // Handle enable / disable on form elements
    if (this.fieldName != '')
    {
      if (this.disable)
      {
        this.formFieldd.disable();
      } else
      {
        this.formFieldd.enable();
      }
    }

    // Generate radio button based on api method that returns ID and Value
    if (this.type == 'radio')
    {
      this.radioJSON = [];
      this.http.get<any>(this.dataURL).subscribe((json: [any]) =>
      {
        for (let i = 0; i < json.length; i++)
        {
          if(value != '' && value == json[i].id) {
            this.radioJSON.push({ id: json[i].id, value: json[i].name, checked: true });
          } else {
            this.radioJSON.push({ id: json[i].id, value: json[i].name, checked: false });
          }
        }
      })
    }

    if(this.type == 'select')
    {
      this.selectJSON = [];
      this.http.get<any>(this.dataURL).subscribe((json: [any]) => {
        for (let i = 0; i < json.length; i++) {
          if(value != '' && value == json[i].id) {
            this.selectJSON.push({ id: json[i].id, value: json[i].name});
          } else {
            this.selectJSON.push({ id: json[i].id, value: json[i].name});
           }
        }
      })

      if(this.value != '') {
        if(!this.isMultiSelect) {
          const toSelect = this.selectJSON.find((c: { id: number; }) => c.id == Number(this.value));
          this.parentForm.get(this.fieldName).setValue(toSelect);
        }
      }

    }
  }

  public registerOnChange(fn: any): void
  {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void
  {
    this.touched = fn;
  }

  public setDisabledState(isDisabled: boolean): void
  {
    this.isDisabled = isDisabled;
  }
}