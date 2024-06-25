import {Component, EventEmitter, forwardRef, Input, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { VLookupComponent } from './v-lookup/v-lookup.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { InformationService } from 'src/app/Kernel/services/information.service';

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
  ],
})
export class InputComponent implements ControlValueAccessor {
  public value: string = '';
  public changed: (value: string) => void;
  public touched!: () => void;
  public isDisabled!: boolean;
  public jsonEmpty: any[] = [];
  public fieldLookupName: string = '';

  @Input() public type: any; // used to set the input type
  @Input() public placeholder: any; // used to set input element placeholder
  @Input() public label: any; // used to set the label for the input element floating label
  @Input() public required: any = false; // used to set if the input element is required or no
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: string = ''; // used to set formControl field name
  @Input() public matAppearance: any = 'outline'; // Mainly used for material design look and feel
  @Input() public textareaCols: string = '5';
  @Input() public textareaRows: string = '5';
  @Input() public radioData: any;
  @Input() public color: any = 'yellow'; // Mainly used for checkbox
  @Input() public labelPosition: any; // used to set 'before' | 'after' for radio buttons
  @Input() public fontawesome: any = ''; // used to add fontawesome icons to inputs
  @Input() public disable: any = false; // used to disable input element
  @Input() public readonly: any; // used to set readOnly on input element
  @Input() public customStyle: any = '';
  @Input() public allowLabel: boolean = true;

  // Lookup parameters
  @Input() public lookupDataApi: any = '';
  @Input() public lookupStaticData: any = '';
  @Input() public lookupHeight: any = '500px';
  @Input() public lookupWidth: any = '600px';
  @Input() public lookupSelection: string = 'single';
  

  // Max Length for an input
  @Input() public maxlength: number = 9999;
  @Input() public defaultValue: string = '';

  // Indisplay paramters
  @Input() public isForIndisplay: boolean = false;
  @Input() public hasSuspendedStyle: boolean = false;

  // @Output event emitters
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() lookupOnChange: EventEmitter<any> = new EventEmitter();

  get formField(): FormControl {
    if (this.fieldName != '') {
      return this.parentForm?.get(this.fieldName) as FormControl;
    }
  }
  
  constructor(
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    private http: HttpClient,
    public informationservice: InformationService
  ) {
    const isHidden = true;
  }

  public onChange(event: Event): void {
    if (this.fieldName != '') {
      let value = '';
      if (this.type == 'checkbox') {
        // Check if input type is checkbox to return if checked or no
        value = (<HTMLInputElement>event.target).checked.toString();
        this.changed(value);
        this.parentForm.controls[this.fieldName].markAsTouched();
      } else if (this.type == 'radio') {
        value = (<HTMLInputElement>event.target).value;
        this.changed(value);
        this.parentForm.controls[this.fieldName].markAsTouched();
      } else if (this.type == 'lookup') {
        // value = (<HTMLInputElement>event.target).value;
        
        value = localStorage.getItem('agGidSelectedLookup_(' + this.fieldName + ')_id');
        // value = this.informationservice.getDynamicService('agGidSelectedLookup_(' + this.fieldName + ')_id');
        this.changed(value);
        this.parentForm.controls[this.fieldName].markAsTouched();
      } else if (this.type == 'date') {
        value = (<HTMLInputElement>event.target).value;
        this.changed(value);
        this.parentForm.controls[this.fieldName].markAsTouched();
      }else {
        // Check if input type is of text type to return value
        value = (<HTMLInputElement>event.target).value;
        this.changed(value);
        this.parentForm.controls[this.fieldName].markAsTouched();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.parentForm?.get(this.fieldName) as FormControl;
  }

  public change(event: any): void {
    this.onSelectionChange();
  }

  public onSelectionChange() {
    // Used to send change event to parent
    this.onChangeEvent.emit((<HTMLInputElement>event.target).value);
  }

  public writeValue(value: string): void {
    this.value = value == '' ? this.defaultValue : value;

    // If this.type is for lookup component then the below should be executed
    if (this.type == 'lookup') {
      this.fieldLookupName = this.fieldName + '_lookupName';
      if (this.value != undefined) {
        localStorage.setItem('agGidSelectedLookup_(' + this.fieldName + ')_id', this.value);
      //  this.informationservice.setDynamicService('agGidSelectedLookup_(' + this.fieldName + ')_id', this.value);
      }
    }

    // If this.value is from inDisplay screen and contains '_DV' then it will execute an API to get default value from it
    if (this.value != undefined) {
      if (this.value.toString().indexOf('_DV') != -1) {
        let val = this.value.substring(0, this.value.indexOf('_DV'));
        this.http
          .post<any>(GlobalConstants.getQbeIdApi + val + '/0', this.jsonEmpty, {
            headers: GlobalConstants.headers,
          })
          .subscribe((data3: any) => {
            this.value = data3[0];
          });
      }
    }

    // If this.readyOnly is from inDisplay screen then the below if condition should be triggered
    if (typeof this.readonly == 'string') {
      this.readonly = this.readonly == '1' ? true : false;
    }

    if (this.type == 'hidden') {
      setTimeout(() => {
        $('#' + this.fieldName).parent().parent().parent().parent().hide();
      }, 10);
    }

    // Handle enable / disable on form elements
    setTimeout(() => {
      if (this.fieldName != '') {
        if (this.disable) {
          this.formField.disable();
          if(this.type == 'lookup') {
            $("#"+this.fieldName+"_lookupName").addClass("disabled-field");
          } else {
            $("#"+this.fieldName).addClass("disabled-field");
          }
        } else {
          this.formField.enable();
          if(this.type == 'lookup') {
            $("#"+this.fieldName+"_lookupName").removeClass("disabled-field");
          } else {
            $("#"+this.fieldName).removeClass("disabled-field");
          }
        }
      }
    },10);
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

  // Method used to open lookup component
  openLookup(event: Event) {
    console.log("IS READ ONLY?????>>>>",this.readonly);
    // if(this.readonly!=true){

    let data: any[];
    if (this.lookupDataApi != '') {
      data = [
        {
          lookupDataId: this.lookupDataApi,
          lookupStaticData: '',
          lookupFieldName: this.fieldName,
          lookupSelection: this.lookupSelection,
          label:this.label,
          readonly:this.readonly
        },
      ];
    } else {
      data = [
        {
          lookupDataId: '',
          lookupStaticData: this.lookupStaticData,
          lookupFieldName: this.fieldName,
          lookupSelection: this.lookupSelection,
          label:this.label,
          readonly:this.readonly
        },
      ];
    }

    const dialogRef = this.dialog.open(VLookupComponent, {
      width: this.lookupWidth,
      height: this.lookupHeight,
      data: data 
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        
        this.parentForm?.controls[this.fieldName].setValue(localStorage.getItem('agGidSelectedLookup_(' + this.fieldName + ')_id'));
        // this.parentForm?.controls[this.fieldName].setValue(this.informationservice.getDynamicService('agGidSelectedLookup_(' + this.fieldName + ')_id'));
        
        $('#' + this.fieldLookupName).val(localStorage.getItem('agGidSelectedLookup_(' + this.fieldName + ')_name'));
        // $('#' + this.fieldLookupName).val(this.informationservice.getDynamicService('agGidSelectedLookup_(' + this.fieldName + ')_name'));
        this.onChange(event);
        this.lookupOnChange.emit();
      }
    });
  }
  

  // Method used to clear lookup field
  emptyLookup() {
    if(this.readonly!=true){
      if(!this.disable) {
        $('#' + this.fieldName).val('');
        $('#' + this.fieldName + '_lookupName').val('');
        
        localStorage.setItem("agGidSelectedLookup_("+this.fieldName+")_id", "");
        localStorage.setItem("agGidSelectedLookup_("+this.fieldName+")_name", "");

        // this.informationservice.setDynamicService("agGidSelectedLookup_("+this.fieldName+")_id", "");
        // this.informationservice.setDynamicService("agGidSelectedLookup_("+this.fieldName+")_name", "");
        this.changed('');
      }
    }
  }

  //Worfkflow added types:
  // Unable to use form controls on table elements, we use the information service
  //to save the data selected by the user
  days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hoveredIndex: string | null = null;

  //When clicking on a table td, it selects the day by adding it to the service variable
  //and if it was already selected, it turns it back off, removing it from the service
  handleClickDay(day: string) {
    if(this.informationservice.getSelectDay() == day){
      this.informationservice.removeSelectDay();
    }else{
      this.informationservice.setSelectDay(day);
    }
  }

  //For the months selection
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  hoveredIndex2: string | null = null;

  //When clicking on a table td, it selects the month, adding it to the service array
  handleClickMonth(month: string) {
    if (!this.isSelected(month)) {
      this.informationservice.addSelectMonths(month);
    } else {
      //But when said clicked td's value would already be in the array, we remove it, deselecting
      // it from the needed months
      this.informationservice.setSelectMonths(
        this.informationservice.getSelectMonths().filter((m: string) => m !== month)
      );
    }
  }

  //color the cells of the month table blue when they are present in the service's array
  isSelected(month: string): boolean {
    return this.informationservice.getSelectMonths().includes(month);
  }
}
