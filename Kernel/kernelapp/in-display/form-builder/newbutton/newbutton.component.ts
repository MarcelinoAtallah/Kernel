import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-newbutton',
  templateUrl: './newbutton.component.html',
  styleUrls: ['./newbutton.component.css']
})
export class NewbuttonComponent implements OnInit {

  public buttonPosition: any;
  public objectId: any;
  public AllFieldSet: any;
  public actionType: string = '';
  public buttonId: number;
  public AllAction: any = [{ id: 1, name: 'Form Opening' }, { id: 2, name: 'Call Procedure' },{ id: 3, name: 'Call Api' },{ id: 4, name: 'Close Popup'},{ id: 5, name: 'Generate Report'}];
  public FormOpeningSelected: boolean = false;
  public ApiSelected: boolean = false;
  public ApiSelected1: boolean = false;
  public AllMenus: any;
  public objectButtonId: any;
  public ALLcol : any;

  // public getAllTablesCombo: any = GlobalConstants.getAllTablesCombo;
  public Condition =false;
  public getSourceQuery = GlobalConstants.getSourceQueryApi;

  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public lookupData: any,
    private dialogRef: MatDialogRef<NewbuttonComponent>,
    private commonFunctions: CommonFunctions,
    public informationservice: InformationService) { }

  buttonForm = new FormGroup({
    buttonId: new FormControl(''),
    buttonName: new FormControl(''),
    buttonOrder: new FormControl(''),
    fieldSet: new FormControl(''),
    ButtonAction: new FormControl(''),
    Menus: new FormControl(''),
    procedureName: new FormControl(''),
    allColumns: new FormControl(''),
    condition: new FormControl(''),
    OtherCondition: new FormControl(''),
    url : new FormControl(''),
    alertValue : new FormControl(''),
    isMainPreview: new FormControl(''),
    thirdCondition: new FormControl(''),
    alertMessage : new FormControl(''),

  });

  closeDialog(): void {
    this.dialogRef.close();
  }

  async ngOnInit(): Promise<void> {
    this.FormOpeningSelected = false;
    this.ApiSelected = false;
    this.ApiSelected1 = false;
    let ButtonAction : any;

    this.objectId = this.lookupData[0].objectId;
    this.actionType = this.lookupData[0].actionType;
    this.AllMenus = GlobalConstants.getMenusButton;
    this.buttonPosition = GlobalConstants.getButtonPosition;
    this.AllFieldSet = GlobalConstants.getAllFieldSets + this.objectId;
    let isMain = this.buttonForm.controls['isMainPreview']?.value;

    // this.ALLcol = GlobalConstants.getColumnsApi + this.objectId;

    const allColuumsUrl = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
    const allColuums = await lastValueFrom(allColuumsUrl);
    this.ALLcol = allColuums.data;

    if (this.actionType == "update") {
      this.buttonId = this.lookupData[0].formBtnId;

      const buttonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + this.buttonId));
      const buttonData = await lastValueFrom(buttonDataUrl);

      let data = buttonData.data;

      // this.http.get<any>(GlobalConstants.getButtonDataApi + this.buttonId, { headers: GlobalConstants.headers }).subscribe(
      //   (data: any) => {

          const base64EncodedString = data.blobFile;

          const decodedString = atob(base64EncodedString);
          let menuId = decodedString.split("~A~")[0];
          ButtonAction = decodedString.split("~A~")[1];
          let isMainPreview: any = decodedString.split("~A~")[4];

          this.buttonForm.controls["buttonName"].setValue(data.columnName);
          this.buttonForm.controls["buttonOrder"].setValue(data.orderNo);
          this.buttonForm.controls["fieldSet"].setValue(data.groupId);
          this.buttonForm.controls["buttonId"].setValue(data.columnId);
          this.buttonForm.controls["Menus"].setValue(menuId);
          this.buttonForm.controls["ButtonAction"].setValue(ButtonAction);
          if(isMainPreview == "false"){
            this.buttonForm.controls["isMainPreview"].setValue(false);
          }
          else if(isMainPreview == "true"){
            this.buttonForm.controls["isMainPreview"].setValue(true);
          }
          if (ButtonAction == 1) {
            this.FormOpeningSelected = true;
            this.ApiSelected = false;
            this.ApiSelected1 = false;
            this.Condition = true;
          }

          if(ButtonAction == 2) {
            this.buttonForm.controls["procedureName"].setValue(menuId);
            this.buttonForm.controls["allColumns"].setValue(decodedString.split("~A~")[2]);

            this.ApiSelected = true;
            this.ApiSelected1 = true;
            //added by nadine
            this.FormOpeningSelected = false;
            this.Condition = true;
          }
          
          if(ButtonAction == 3) {
            this.buttonForm.controls["url"].setValue(decodedString.split("~A~")[3]);
            this.buttonForm.controls["allColumns"].setValue(decodedString.split("~A~")[2])

            this.ApiSelected = false;
            this.ApiSelected1 = true;
            this.FormOpeningSelected = false;
            this.Condition = false;
          }

          if(ButtonAction == 4){
            this.ApiSelected = false;
            this.ApiSelected1 = false;
            this.FormOpeningSelected = false;
            this.Condition = false;
          }

          if(ButtonAction == 5) {
            this.buttonForm.controls["url"].setValue(decodedString.split("~A~")[3]);
            this.buttonForm.controls["allColumns"].setValue(decodedString.split("~A~")[2])

            this.ApiSelected = false;
            this.ApiSelected1 = true;
            this.FormOpeningSelected = false;
            this.Condition = false;
          }
        // });
    }
  }

  submitForm() {
    if (this.buttonForm.status != 'INVALID') {
      if (this.actionType == 'saveNew') {
        let buttonName = this.buttonForm.controls['buttonName']?.value;
        let buttonOrder = this.buttonForm.controls['buttonOrder']?.value;
        let buttonAction = this.buttonForm.controls['ButtonAction']?.value;
        let fieldSet = this.buttonForm.controls['fieldSet']?.value;
        let objectButtonId;
        let selectedCols;
        let URL;
        let isMainPreview;
        let condition;
        let OtherCondition;
        let alertValue;
        let thirdCondition;
        let alertMessage;
        if(buttonAction == 1){
          objectButtonId = this.buttonForm.controls['Menus']?.value;
          selectedCols = '';
          URL = '';
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;
        }else if(buttonAction == 2){
          objectButtonId = this.buttonForm.controls['procedureName']?.value;
          selectedCols = this.buttonForm.controls['allColumns']?.value;
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;

        }
        else if(buttonAction == 3){
          selectedCols = this.buttonForm.controls['allColumns']?.value;
          URL = this.buttonForm.controls['url']?.value;
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;

        }
        else if(buttonAction == 4){
          selectedCols = '';
          URL = '';
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = null;
          OtherCondition = null;
          alertValue = null;
          thirdCondition = null;
          alertMessage = null;
        }
        else if(buttonAction == 5){
          selectedCols = this.buttonForm.controls['allColumns']?.value;
          URL = this.buttonForm.controls['url']?.value;
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;

        }
        let object = {
          "buttonName": buttonName,
          "position": 0,
          "order": buttonOrder,
          "fieldSet": fieldSet,
          "createdBy": this.informationservice.getLogeduserId(),
          "objectButtonId": objectButtonId + "~A~" + buttonAction + "~A~" + selectedCols + "~A~"+ URL + "~A~" +isMainPreview + "~A~" +condition + "~A~" + OtherCondition + "~A~" + alertValue + "~A~" + thirdCondition + "~A~" + alertMessage
        }

console.log("object ===",object);        

        this.http.post<any>(GlobalConstants.createFormButton + this.objectId, object, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
            }
          });
      }

      if (this.actionType == 'update') {
        let buttonId = this.buttonForm.controls['buttonId']?.value;
        let buttonName = this.buttonForm.controls['buttonName']?.value;
        let buttonOrder = this.buttonForm.controls['buttonOrder']?.value;
        let fieldSet = this.buttonForm.controls['fieldSet']?.value;
        let buttonAction = this.buttonForm.controls['ButtonAction']?.value;
        
        let objectButtonId;
        let selectedCols;
        let URL;
        let isMainPreview;
        let condition;
        let OtherCondition;
        let alertValue;
        let thirdCondition;
        let alertMessage;
        if(buttonAction == 1){
          objectButtonId = this.buttonForm.controls['Menus']?.value;
          selectedCols = '';
          URL = '';
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;
        }else if(buttonAction == 2){
          objectButtonId = this.buttonForm.controls['procedureName']?.value;
          selectedCols = this.buttonForm.controls['allColumns']?.value;
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;
        }
        else if(buttonAction == 3){
          selectedCols = this.buttonForm.controls['allColumns']?.value;
          URL = this.buttonForm.controls['url']?.value;
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;
        }
        else if(buttonAction == 4){
          selectedCols = '';
          URL = '';
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = null;
          OtherCondition = null;
          thirdCondition = null;
          alertValue = null;
        }
        ///////elie///////////////
        else if(buttonAction == 5){
          selectedCols = this.buttonForm.controls['allColumns']?.value;
          URL = this.buttonForm.controls['url']?.value;
          isMainPreview = this.buttonForm.controls['isMainPreview']?.value;
          condition = this.buttonForm.controls['condition']?.value;
          OtherCondition = this.buttonForm.controls['OtherCondition']?.value;
          alertValue = this.buttonForm.controls['alertValue']?.value;
          thirdCondition = this.buttonForm.controls['thirdCondition']?.value;
          alertMessage = this.buttonForm.controls['alertMessage']?.value;
        }
        let object = {
          "buttonName": buttonName,
          "position": 0,
          "order": buttonOrder,
          "fieldSet": fieldSet,
          "createdBy": this.informationservice.getLogeduserId(),
          "buttonId": buttonId,
          "objectButtonId": objectButtonId + "~A~" + buttonAction + "~A~" + selectedCols + "~A~"+ URL + "~A~" + isMainPreview + "~A~" +condition + "~A~" + OtherCondition + "~A~" + alertValue + "~A~" + thirdCondition + "~A~" + alertMessage,
        }

        this.http.post<any>(GlobalConstants.updateFormButton + this.objectId, object, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
            }
          });
      }
    }
  }

  onActionChange() {
    let ButtonAction = this.buttonForm.controls['ButtonAction']?.value;
    let isMain = this.buttonForm.controls['isMainPreview']?.value;
    //hide the condition
    this.Condition = false;
    if (ButtonAction == 1) {
      this.FormOpeningSelected = true;
      this.ApiSelected = false;
      this.ApiSelected1 = false;
    }
    if (ButtonAction == 2) {
      this.ApiSelected = true;
      this.ApiSelected1 = true;
      this.FormOpeningSelected = false;
    }
    if(ButtonAction == 3){
      this.ApiSelected = false;
      this.ApiSelected1 = true;
      this.FormOpeningSelected = false;
    }
    if(ButtonAction == 4){
      this.ApiSelected = false;
      this.ApiSelected1 = false;
      this.FormOpeningSelected = false;
    }
  }
  showCondition(){
    this.Condition = true;
  }

}
