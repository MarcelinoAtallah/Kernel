import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit,ViewChild, Output, SimpleChanges, ViewEncapsulation, Renderer2, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, FormGroupDirective, NgForm, } from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { from, lastValueFrom } from 'rxjs';
import axios from 'axios';

@Component
({
  selector: 'v-dropdown',
  templateUrl: './v-dropdown.component.html',
  styleUrls: ['./v-dropdown.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:
  [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownComponent),
      multi: true,
    },
  ],
})

export class DropDownComponent implements ControlValueAccessor, OnChanges, OnInit
{
  public value: any = -1;

  public changed!: (value: any) => void;
  public touched!: () => void;
  public isDisabled!: boolean;
  public selectedValues: any[] = [];
  public dropdownList: any[] = [];
  public isDropdownEmpty: boolean;
  public selectedItems: any[] = [];
  public dropdownSettings: IDropdownSettings;
  public singleSelection: any;

  @ViewChild('itemElement', { static: false }) itemElement: ElementRef;

  @Input() public isComponentPhoneNumbers: boolean = false;

  @Input() public multipleSelectionDroppDown: boolean = false;
  @Input() public multiple: any = false;
  @Input() public label: any = '';
  @Input() public required: any = false;
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;
  @Input() public dataApi: any = '';
  @Input() public dataBody: any = '';
  @Input() public placeholder: any = '';
  @Input() public matAppearance: any = 'outline';
  @Input() public disabled: any = false; // used to set readOnly on dropdown element
  @Input() public allowLabel: boolean = true;
  @Input() public readonly: any = false;
  @Input() public dependency: boolean = false; // controlling whenever to use post or get method in case we have large parameters to pass to the API
  @Input() public dataJSON: any; // used to pass JSON to combo instead of API
  @Input() public allowSearchInCombo: boolean = true;
  @Input() public dropdownId: any = -1;
  @Input() public dropdownClass: any = -1;
  @Input() public phoneNumberValue: any;
  @Input() public isphone: boolean;

  // Indisplay variables
  @Input() public hasSuspendedStyle: boolean = false;
  @Input() public isForIndisplay: boolean = false;

  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter();
  dropdownListOther: any[];
  selectedItemsOtherDropdown: any[];
  selectedValuesOtherDropdown: any[];
  noneValue: any;

  get formField(): FormControl
  {
    return this.parentForm.get(this.fieldName) as FormControl;
  }

  constructor(private http: HttpClient, private commonFunctions: CommonFunctions,
    private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void
  {
    if(this.isphone===true)
    {
      const dropdownCaret = this.el.nativeElement.querySelector('.dropdown-multiselect__caret');
      this.renderer.setStyle(dropdownCaret, 'left', '65px');
    }

    this.loadData();

    if (this.selectedItems.length > 0)
    {
      this.selectedValues = this.selectedItems;
      this.formField.setValue(this.selectedValues);
    }

    setTimeout(() =>
    {
      if (this.disabled)
      {
        $("#v-dropdown_" + this.fieldName).addClass("disabled-field");
        $("#v-dropdown_" + this.fieldName + " .multiselect-dropdown .disabled > span").addClass("disabled-field");
      }
      else
      {
        $("#v-dropdown_" + this.fieldName).removeClass("disabled-field");
      }
    }, 10);
  }

  public loadData(): Promise<void> {
    console.log("11111111")
    return new Promise<void>((resolve) => {
      if (this.dataApi != '' || this.dataJSON != null) {
        this.dropdownList = [];
        this.selectedItems = [];
  
        // Check if there is no dependency
        if (!this.dependency) {
          let jsonDataPromise: Promise<any>;
  
          if (this.dataApi == '') {
            jsonDataPromise = Promise.resolve(this.dataJSON);
          } else {
            let dropdownDataPromise: Promise<any>;
  
            if (this.dataBody != '') {
              dropdownDataPromise = axios.post(this.dataApi, this.dataBody);
            } else {
              dropdownDataPromise = axios.get(this.dataApi);
            }
  
            jsonDataPromise = dropdownDataPromise.then(dropdownData => dropdownData.data);
          }
  
          // Continue after jsonDataPromise resolves
          jsonDataPromise.then(jsonData => {
            this.processData(jsonData); // Process the data
            this.extractDropdownValues(jsonData); // Extract and save dropdown values
  
            // Handle dynamic attribute for multi-selection or mono
            this.singleSelection = !this.multiple;
            // console.log("singleSelection is >>>>>>>>>> ", this.singleSelection);
            if(this.singleSelection == true){
            //  $('#no-filtered-data').css("margin-left","30px");
            }
  
            this.dropdownSettings = {
              singleSelection: this.singleSelection,
              idField: 'id',
              textField: 'name',
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              itemsShowLimit: 1,
              allowSearchFilter: this.allowSearchInCombo,
              clearSearchFilter: true
            };
  
            // Update isDropdownEmpty after populating dropdownList
            this.isDropdownEmpty = this.dropdownList.length === 0;
  
            resolve(); // Resolve the promise to indicate that loading is complete
          });
        } else {
          resolve(); // Resolve the promise for the dependency case
        }
      } else {
        this.dropdownList = null;
        this.selectedItems = [];
        this.selectedValues = [];
        this.isDropdownEmpty = true; // Set to true when no data is provided
        resolve(); // Resolve the promise when no data is provided
      }
    });
  }
  

  async processData(jsonData: any) {
  // Add delay after API request (0.5 seconds in this case)
  await this.delay(500);

  // Check and process jsonData if it's in a specific format
  if (jsonData.data != undefined) {
    jsonData = jsonData.data;
  }

  // Process jsonData and populate dropdownList
  for (let i = 0; i < jsonData.length; i++) {
    if (jsonData[i].id != null) {
      // Push items to dropdownList
      this.dropdownList.push({ id: jsonData[i].id, name: jsonData[i].name });
    } else {
      // Push items to dropdownList
      this.dropdownList.push({ id: jsonData[i].ID, name: jsonData[i].NAME });
    }
  }


  // Filter out undefined and empty values from dropdownList
  this.dropdownList = this.dropdownList.filter(value => value.name != undefined && value != '');

  // Remove duplicate entries based on id property
  this.dropdownList = this.commonFunctions.removeDuplicatesFromArrayByProperty(this.dropdownList, "id");

  // Set default value to "no" if it is not already set
  const noOption = this.dropdownList.find(item => item.name.toLowerCase() === 'no');
  
  if (noOption && this.value === null) {
    this.value = noOption.id; // Set the value to the ID of "no"
  }

  // Additional logic based on fieldName or specific cases
  this.value = this.value == "" && Number(this.value) !== 0 ? -1 : this.value;
  this.value = this.value === 0 ? this.value = '~A~' : this.value;

  if(this.fieldName=="phoneNumber123456") {
    this.value = this.phoneNumberValue;
  }

  // Update selectedItems based on this.value
  if (this.value != "" && this.value !== -1 && this.value != null)
  {
    let loopItems: any[] = []; // Define loopItems as an array of appropriate type
    for (let i = 0; i < this.dropdownList.length; i++)
    {
      if (typeof (this.value) == 'object')
        {
          let value: any = [];

          for (let i = 0; i < this.value.length; i++)
          {
            if (this.value[i].id != undefined)
            {
              value.push(this.value[i].id);
            }
            else
            {
              value.push(this.value[i])
            }
          }
          this.value = value;

          for (let x = 0; x < this.value.length; x++)
          {
            if (isNaN(Number(this.value[x])) && this.value[x] != 0)
            {
              if (this.dropdownList[i].id === this.value[x])
              {
                loopItems.push(this.dropdownList[i]);
              }
            }
            else
            {
              if (Number(this.dropdownList[i].id) === Number(this.value[x]))
              {
                loopItems.push(this.dropdownList[i]);
              }
            }
          }
        }

        if (isNaN(this.value) && this.value != "~A~")
        {
          if (this.value != undefined)
          {
            if (this.value.indexOf(",") != -1)
            {
              let tt = this.value.toString().split(",");

              for (let u = 0; u < tt.length; u++)
              {
                if (this.dropdownList[i].id === tt[u])
                {
                  loopItems.push(this.dropdownList[i]);
                }
              }
            }
            else
            {
              if (this.dropdownList[i].id === this.value)
              {
                loopItems.push(this.dropdownList[i]);
              }
            }
          }
        }
        else
          if (Number(this.value) || this.value == "~A~")
          {
            this.value = this.value == "~A~" ? 0 : this.value;

            if (Number(this.dropdownList[i].id) === Number(this.value))
            {
              loopItems.push(this.dropdownList[i]);
            }
          }
          else
          {
            if (Number(this.dropdownList[i].id) === Number(this.value))
            {
              loopItems.push(this.dropdownList[i]);
            }
          }
    }

    this.selectedItems = loopItems;
    this.selectedValues = loopItems;
  } else {
    this.selectedItems = [];
    this.selectedValues = [];
  }

  // Handle dynamic attribute for multi selection or mono
  this.dropdownSettings = {
    singleSelection: !this.multiple,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: this.allowSearchInCombo,
    clearSearchFilter: true
  };
}


private extractDropdownValues(jsonData: any): void {
  // Extract dropdown values from jsonData and save them in dropdownList array
  if (jsonData && Array.isArray(jsonData)) {
    this.dropdownList = jsonData.map(item => {
      return {
        id: item.id, // Assuming your API response has an 'id' field
        name: item.name // Assuming your API response has a 'name' field
      };
    });
  }
}

  ngOnChanges(changes: SimpleChanges): void
  {
    this.loadData();
    console.log("Change was detected <<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  }

  onItemSelect(item: any)
  {
    console.log("SELECTED ITEMS>>>>>",this.selectedItems);

    if (this.multiple)
    {
      this.selectedValues.push(item.id);
    }
    else
    {
      this.selectedValues = item.id;
    }

    this.formField.setValue(this.selectedValues);
    this.onSelectionChange();
  }

  onSelectAll(items: any[])
  {
    items.forEach(object =>
    {
      delete object['name'];
    });

    for (var i in items)
    {
      this.selectedValues.push(items[i].id);
    }
    
    this.formField.setValue(this.selectedValues);
    this.onSelectionChange();
  }

  onDeSelectAll()
  {
    this.selectedValues = [];
    this.formField.setValue(this.selectedValues);
    this.onSelectionChange();
  }

  onDeSelect(item: any)
  {
    const items: any[] = [];

    if (this.multiple)
    {
      this.selectedValues = this.commonFunctions.filterItemFromArray(this.selectedValues, item.id);
      
      for (let k = 0; k < this.selectedValues.length; k++)
      {
        if (this.selectedValues[k].id != item.id) {
          if (typeof (this.selectedValues[k].id) == 'undefined')
          {
            items.push(this.selectedValues[k]);
          }
          else
          {
            items.push(this.selectedValues[k].id);
          }
        }
      }
      this.selectedValues = items;
    }
    else
    {
      this.selectedValues = [];
    }
    this.formField.setValue(this.selectedValues);
    this.onSelectionChange();
  }

  writeValue(value: any)
  {
    this.value = value;
  }

  public registerOnChange(fn: any): void
  {
    this.changed = fn;
  }

  public registerOnTouched(fn: any): void
  {
    this.touched = fn;
  }

  public onSelectionChange()
  {
    this.onChangeEvent.emit(this.selectedValues);
  }

  trackByFn(item: any)
  {
    return item.value; // Assuming each item has a 'value' property
  }

  private delay(ms: number): Promise<void>
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
