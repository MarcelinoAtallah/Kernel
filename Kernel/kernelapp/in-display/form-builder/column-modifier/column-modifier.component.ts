import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DataService } from 'src/app/Kernel/services/data.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
@Component({
  selector: 'app-column-modifier',
  templateUrl: './column-modifier.component.html',
  styleUrls: ['./column-modifier.component.css']
})
export class ColumnModifierComponent implements OnInit {
  public columnType: any;
  public getAllColumns: any;
  public objectId: any;
  public columnTypeCode: any;
  public columnId: any;
  public getSourceQuery = GlobalConstants.getSourceQueryApi;
  public allFieldSizes = [{ id: 1, name: '1x' }, { id: 2, name: '2x' }, { id: 3, name: '3x' }];
  public mandatoryFlag: any;
  public canReadOnly: any;
  readOnly: boolean = false;
  public test_1: string = '0';
  public getAllFieldSets: any;
  public AllMenus: string;
  public isLinkFlag: boolean = false;
  public toggleAppTheme: boolean;
  public toggleValue : any;

  public toggleIsLink: boolean;
  public checked : boolean;
  public readOnlyIsExluced : boolean;


  modifierForm = new FormGroup({
    columnName: new FormControl(''),
    columnDescription: new FormControl(''),
    columnType: new FormControl(''),
    columnLength: new FormControl(''),
    isMandatory: new FormControl(''),
    isSuspended: new FormControl(''),
    isLink: new FormControl(''),
    isArabic: new FormControl(''),
    isExcludedd: new FormControl(''),
    menus: new FormControl(''),
    isMultiple: new FormControl(''),
    destinationField: new FormControl(''),
    query: new FormControl(''),
    orderField: new FormControl(''),
    qbeReadOnly: new FormControl(''),
    defaultValue: new FormControl(''),
    mandatoryQuery: new FormControl(''),
    sizeField: new FormControl(''),
    fieldSet: new FormControl(''),
    tableName: new FormControl(''),
    dependencyDefaultValue: new FormControl(''),
    isGridHidden: new FormControl(''),
    isEditable: new FormControl('')
  });


  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private _Activatedroute: ActivatedRoute,
    private dataService: DataService,
    public informationservice: InformationService
  ) { }

  ngOnInit(): void {
    this.toggleValue = 0;

    this.informationservice.setFirstOpenGrid('1');

    this.AllMenus = GlobalConstants.getMenusButton;

    this._Activatedroute.paramMap.subscribe((params) => {
      this.objectId = params.get('childId');
      this.columnId = params.get('columnId');
      this.isLinkFlag = Number(params.get("isLink")) == 1 ? true : false;
    });

    // this.columnId = this.lookupData[0].columnId;
    // let isLink = this.lookupData[0].isLink;

    // if (isLink == 1) {
    //   this.isLinkFlag = true;
    // } else {
    //   this.isLinkFlag = false;
    // }

    this.columnType = GlobalConstants.getSysLinesDataWithIdsApi + 426 + "/" + "1,2,3,4,6,11,5,13,15,16,17,18,19";
    this.getAllColumns = GlobalConstants.getColumnsApi + this.objectId;
    this.getAllFieldSets = GlobalConstants.getAllFieldSetsApi + this.objectId;

    this.fetchColData();
    this.test_1 = '1';
  }

  // closeDialog(): void {
  //   this.dialogRef.close();
  // }

  onLinkChange() {
    let ButtonAction = this.modifierForm.controls['isLink']?.value;
    if (ButtonAction == true) {
      this.isLinkFlag = true;
    } else {
      this.isLinkFlag = false;
    }
  }

  submitForm() {
    if (this.modifierForm.status != "INVALID") {
      let columnModifier = [];

      let defaultValue = this.modifierForm.controls['defaultValue']?.value;
      let mandatoryQuery = this.modifierForm.controls['mandatoryQuery']?.value;
      let dependencyDefaultValue = this.modifierForm.controls['dependencyDefaultValue']?.value;
      let menus = this.modifierForm.controls['menus']?.value;
      let qbeReadOnly = this.modifierForm.controls['qbeReadOnly']?.value;
      let query = this.modifierForm.controls['query']?.value;
      let isArabic = this.modifierForm.controls['isArabic']?.value;
      let isEditable = this.modifierForm.controls['isEditable']?.value;
      if(defaultValue == undefined){
        defaultValue = 0;
      } 

      if(mandatoryQuery == undefined){
        mandatoryQuery = 0;
      }

      if(dependencyDefaultValue == undefined){
        dependencyDefaultValue = 0;
      }
      if(menus == undefined){
        menus = 0;
      }
      if(qbeReadOnly == undefined){
        qbeReadOnly = 0;
      }
      if(query == undefined){
        query = 0;
      }
      if(isArabic == true){
        isArabic = "true";
      }
      if(isArabic == false){
        isArabic = "false";
      }
      if(isEditable == true){
        isEditable = "true";
      }
      if(isEditable == false){
        isEditable = "false";
      }

      const jsonParams = {
        "columnDescription": this.modifierForm.controls['columnDescription']?.value,
        "columnName": this.modifierForm.controls['columnName']?.value,
        "columnType": this.modifierForm.controls['columnType']?.value,
        "columnLength": this.modifierForm.controls['columnLength']?.value,
        "isMandatory": this.modifierForm.controls['isMandatory']?.value,
        "isMultiple": this.modifierForm.controls['isMultiple']?.value,
        "isSuspended": this.modifierForm.controls['isSuspended']?.value,
        "isLink": this.modifierForm.controls['isLink']?.value,
        "isExcluded": this.modifierForm.controls['isExcludedd']?.value,
        "isArabic": isArabic,
        "menus": menus,
        "qbeReadOnly": qbeReadOnly,
        "query": query,
        "orderNo": this.modifierForm.controls['orderField']?.value,
        "defaultValue": defaultValue,
        "mandatoryQuery": mandatoryQuery,
        "sizeField": this.modifierForm.controls['sizeField']?.value,
        "fieldSet": this.modifierForm.controls['fieldSet']?.value,
        "dependencyDefaultValue": dependencyDefaultValue,
        "isGridHidden": this.modifierForm.controls['isGridHidden']?.value,
        "isEditable": this.modifierForm.controls['isEditable']?.value,

      };

      columnModifier.push(jsonParams);
      let columnModifier1 = JSON.stringify(columnModifier);

      this.http.post<any>(GlobalConstants.columnModifierApi + this.columnId, columnModifier1, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
            this.commonFunctions.alert("alert", res.description);
          } else {
            this.commonFunctions.alert("alert", res.description);
          }
        });

      this.dataService.setMessage(this.modifierForm.controls['isMultiple']?.value);
    }
  }

  fetchColData() {
    this.http.get<any>(GlobalConstants.getColumnConfigurationApi + this.columnId, { headers: GlobalConstants.headers, }).subscribe(
      (res: any) => {
        this.modifierForm.controls['columnDescription'].setValue(res[0].columnDescription);
        this.modifierForm.controls['columnName'].setValue(res[0].columnName);
        this.modifierForm.controls['columnType'].setValue(res[0].columnType);
        this.modifierForm.controls['columnLength'].setValue(res[0].columnLength);
        this.modifierForm.controls['orderField'].setValue(res[0].orderNo);
        this.modifierForm.controls['query'].setValue(res[0].query);
        this.modifierForm.controls['sizeField'].setValue(res[0].sizeField);
        this.modifierForm.controls['fieldSet'].setValue(res[0].fieldSet);
        this.modifierForm.controls['menus'].setValue(res[0].menus);
        this.modifierForm.controls['destinationField'].setValue(this.columnId);
        this.modifierForm.controls['qbeReadOnly'].setValue(res[0].qbeReadOnly);
        this.modifierForm.controls['defaultValue'].setValue(res[0].defaultValue);
        this.modifierForm.controls['mandatoryQuery'].setValue(res[0].mandatoryQuery);
        this.modifierForm.controls['tableName'].setValue(res[0].tableName);
        this.modifierForm.controls['dependencyDefaultValue'].setValue(res[0].dependencyDefaultValue);
console.log("value of isEditable >>>>>>> ",res[0].isEditable);        
        if (res[0].isMandatory == "0") {
          this.modifierForm.controls['isMandatory'].setValue(false);
        } else if (res[0].isMandatory == "1") {
          this.modifierForm.controls['isMandatory'].setValue(true);
        } else if (res[0].isMandatory == "2") {
          this.modifierForm.controls['isMandatory'].setValue(true);
        }
        
        if (res[0].isMultiple == "0") {
          this.modifierForm.controls['isMultiple'].setValue(false);
        } else {
          this.modifierForm.controls['isMultiple'].setValue(true);
        }

        if (res[0].isSuspended == "0") {
          this.modifierForm.controls['isSuspended'].setValue(false);
      } else {
          this.modifierForm.controls['isSuspended'].setValue(true);
        }

        if (res[0].isLink == "0") {
          this.modifierForm.controls['isLink'].setValue(false);
        } else {
          this.modifierForm.controls['isLink'].setValue(true);
        }
        if (res[0].isExcluded == "0") {
          this.modifierForm.controls['isExcludedd'].setValue(false);
        }else {
          this.modifierForm.controls['isExcludedd'].setValue(true);
        }
        if (res[0].isArabic == "13") {
          this.modifierForm.controls['isArabic'].setValue(false);
        }else {
          this.modifierForm.controls['isArabic'].setValue(true);
        }
        if(res[0].isEditable == "0"){
          this.modifierForm.controls['isEditable'].setValue(false);
        }else{
          this.modifierForm.controls['isEditable'].setValue(true);
        }
       
        this.mandatoryFlag = res[0].isMandatory;
        
        this.commonFunctions.handleLookupElem("query", this.modifierForm);
        this.commonFunctions.handleLookupElem("qbeReadOnly", this.modifierForm);
        this.commonFunctions.handleLookupElem("defaultValue", this.modifierForm);
        this.commonFunctions.handleLookupElem("mandatoryQuery", this.modifierForm);
        this.commonFunctions.handleLookupElem("dependencyDefaultValue", this.modifierForm);
         
        if(this.mandatoryFlag == 0){
          this.toggleValue = 1;
          this.readOnlyIsExluced = false;
        }else{
          this.toggleValue=2;
          this.readOnlyIsExluced = true;
        }
      });
      
  }

  toggleChange(){
      let toggleValue = this.modifierForm.controls['isMandatory']?.value;
      if(toggleValue){
        this.readOnlyIsExluced = true;
      }else{
        this.readOnlyIsExluced = false;
      }
  }
}
