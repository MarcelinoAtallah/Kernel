import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'v-phone',
  templateUrl: './v-phone.component.html',
  styleUrls: ['./v-phone.component.css']
})
export class VPhoneComponent implements OnInit {
  @Input() value: any;
  @Input() public readonly: any;
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;
  @Input() public queryId: any;
  @Input() public label: any;
  public fetchDialNums = GlobalConstants.fetchDialNums;
  public phoneNumberModel:any;
  public returnedValue:any
  public vall:any;
  public isDropdownValueSelected: boolean = false;
  
  public isComponentPhoneNumber: boolean = true;
 
  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }
 

  constructor(private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
     private snackBar: MatSnackBar,
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private commonFunctions: CommonFunctions,
    private route: Router) { }

  phoneNumberForm = new FormGroup({
    phoneNumber123456: new FormControl(''),
  });

  ngOnInit(): void {
    setTimeout(() => {

     

      const fieldValue = this.parentForm.get(this.fieldName).value;
      //console.log("fieldValue>>>>>>>>>>>", fieldValue);
  
      if (fieldValue && fieldValue !== '') {
        // Split the fieldValue to extract the initial values
        const phoneNumberParts = fieldValue.split(" ");
        //take the phone number part
        this.phoneNumberModel = phoneNumberParts[phoneNumberParts.length - 1];
        //take the dropdown value part and trim it
        this.vall = fieldValue.replace(this.phoneNumberModel, '').trim();
        // Set the value in the dropdown
        this.phoneNumberForm.controls["phoneNumber123456"].setValue(this.vall);
  
        //console.log("this.phoneNumberModel>>>>>>>", this.phoneNumberModel);
        //console.log("this.vall>>>>>", this.vall);
        //console.log("this.phoneNumberForm.controlsphoneNumber123456.value>>>>>", this.phoneNumberForm.controls["phoneNumber123456"].value);

        //turning the input on for when editing an already filled dropdown
        this.isDropdownValueSelected = true;
      }
    }, 2000);
  }
  

  getFullNumber(e:any){
    const phoneNumberValue = this.phoneNumberForm.get('phoneNumber123456').value;

    if (Array.isArray(phoneNumberValue) && phoneNumberValue.length === 0) {
      // If phoneNumberValue is an empty array, set isDropdownValueSelected to false, empty the input field, the return value and the final value
      this.isDropdownValueSelected = false;
      this.phoneNumberModel = '';
      this.returnedValue = '';
      this.parentForm.controls[this.fieldName].setValue('');
      //console.log("isDropdownValueSelected :>>>>>>>", this.isDropdownValueSelected);
      //console.log("this.phoneNumberModel should be empty:>>>>>>>", this.phoneNumberModel);
      //console.log("this.returnedValue should be empty:>>>>>>>", this.returnedValue);
      //console.log("this.parentForm.get(this.fieldName).value>>>>>>>", this.parentForm.get(this.fieldName).value);
    } else {
      // If phoneNumberValue is not an empty array, set isDropdownValueSelected to true, save the return value, create the final value
      this.isDropdownValueSelected = true;
      this.returnedValue = phoneNumberValue + " " + this.phoneNumberModel;
      this.parentForm.controls[this.fieldName].setValue(this.returnedValue);
      //console.log("isDropdownValueSelected :>>>>>>>", this.isDropdownValueSelected);
      //console.log("this.phoneNumberModel>>>>>>>", this.phoneNumberModel);
      console.log("this.returnedValue>>>>>>>", this.returnedValue);
      console.log("this.parentForm.get(this.fieldName).value>>>>>>>", this.parentForm.get(this.fieldName).value);
    }
      // this.phoneNumberForm.controls["phoneNumber"].setValue(this.parentForm.get(this.fieldName).value.split(this.phoneNumberModel)[0])
      // console.log("this.phoneNumberModel>>>>>>>",this.parentForm.get(this.fieldName).value.split(" ")[this.parentForm.get(this.fieldName).value.split(" ").length-1]);
      // console.log("this.phoneNumberForm.controls>>>>>",this.phoneNumberForm.get("phoneNumber").value);
  
  }
}