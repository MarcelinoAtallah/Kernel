import { DatePipe, ɵNullViewportScroller } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, from, lastValueFrom, map } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { DataService } from 'src/app/Kernel/services/data.service';
import { LoaderService } from 'src/app/Kernel/services/loader.service';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';
import moment from 'moment';
import axios from 'axios';
import { VRejectedComponent } from 'src/app/Kernel/components/v-rejected/v-rejected.component';
//test2
import { InformationService } from 'src/app/Kernel/services/information.service';
import { DynamicReportSaveComponent } from '../dynamic-report-save/dynamic-report-save.component';
import { DynamicReportResultComponent } from 'src/app/Kernel/components/v-dynamic-report/dynamic-report-result/dynamic-report-result.component';


@Component({
  selector: 'am-preview-form',
  templateUrl: './am-preview-form.component.html',
  styleUrls: ['./am-preview-form.component.css']
})
export class AmPreviewFormComponent implements OnInit {

  hiddenForm = new FormGroup({});
  menuForm = new FormGroup({});
  signaturedata: any;
  oldsignature: any;
  public canProceedWithSave: boolean = true;

  public formData: any;
  public InitialData : any = [];
  public test_1: string = '0';
  public fieldsetData: any[] = [];
  public tableOptions1: any[] = [];
  public tableOptionTemp:any[]=[];
  public allTabsTemp:any[]=[];
  public AllTabs: any = [];
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public isLink: any;
  public previewGridApi: string = '';
  public previewGridApiParam: any;
  public objectId: any;
  public test: any[] = [];
  public listOfHeaders: any[] = [];
  public testButtons: any[] = [];
  public testLinks: any[] = [];
  public subsVar: Subscription;
  public dynamicForm: any;
  public dynamicForm_1: any;
  public actionType: string = 'saveNew';
  public columnId: any;
  public isPageGrid: boolean;
  public isFromGridClick: number = 0;
  public gridStaticData: any;
  public resultQuery: any;
  public buttonObjectId: any;
  public allColumnsLibrary: any[] = [];
  public selectedTabName: any;
  public listOfAllFields : any ;
  public allData : any;
  //test2
  public userId: number = Number(this.informationservice.getLogeduserId())
  public whereConditionAr: any[] = [];
  // public jsonQbe: any[];
  public jsonEmpty: any[] = [];
  public canAdd: string = "";
  public canUpdate: string = "";
  public canDelete: string = "";
  public sourceQuery: string = "";
  public toolBar: string = "";
  // public dialogArray: any[] = [];
  public update: boolean = false;
  public required_flag: boolean;
  public isMainTab: number;
  public amInfo: any;
  public columnTypeCode: Number;
  public roleId: any;
  public isExcluded: string = "";
  public listOfData: any;
  public listOfRuleData: any[] = [];
  public mainJsonForApi = "";
  public mainJsonForDataWhenSkip = "";
  public idOfCheckExisting: any;
  public counterOfSave: any = 0;
  public jsonObjectTab: any = '';
  public previewButton: boolean = false;
  public showRequiredMessage: String[] = [];
  public getWhereCond: string = '-1';
  public openedDialogs: any[];
  public allFieldSets: any[] = [];
  public allFields: any[] = [];
  public allHiddenFieldSetsNOField: any[] = [];
  public OpenLikeForm: any = 0;
  public previewDynamicReportbool:boolean=true;
  //for the new grid into the form (show and hide)
  public showGrid: boolean = false;
  public dataApiParam: any = [];
  public addList = '';
  public LastObject: any = [];
  public gridColumns: AgColumns[] = [];
  public allColumnsAr: any[] = [{ id: '', name: '' }];
  public operators = [
    { id: '', name: '' },
    { id: 1, name: 'And' },
    { id: 2, name: 'Or' },
    { id: 3, name: 'No Operator' }
    //test
  ];
  public isUpdateInDynamicReport:boolean=false;

  // Dynamic Rule Builder Data
  public ruleAction = [{ id: 1, name: 'On Change' }, { id: 2, name: 'On Load' }, { id: 3, name: 'On Before Save' }, { id: 4, name: 'On After Save' }, { id: 5, name: 'Where Condition' }];
  public conditions = [{ id: 1, name: '=' }, { id: 2, name: '!=' }, { id: 8, name: 'Fill Into' }, { id: 3, name: '>' }, { id: 4, name: '<' }, { id: 6, name: '<=' }, { id: 7, name: '>=' }, { id: 5, name: 'between' }, { id: 9, name: '>CURRENT_DATE' }, { id: 10, name: '<CURRENT_DATE' }, { id: 11, name: '>=CURRENT_DATE' }, { id: 12, name: '>=CURRENT_DATE' }, { id: 13, name: 'Get CURRENT_DATE' }, { id: 14, name: 'Field Value' }, { id: 15, name: 'Include' },{ id: 16, name: '!Include' }];
  public dateTypes = [{ id: 1, name: 'Date' }, { id: 2, name: 'Field' }, { id: 3, name: 'Value' }, { id: 4, name: 'Field Value' }, { id: 5, name: 'Execute Query' }];
  public operations = [{ id: 1, name: '=' }, { id: 6, name: '!=' }, { id: 2, name: '>' }, { id: 3, name: '<' }, { id: 4, name: '<=' }, { id: 5, name: '>=' }];
  public executionAction = [{ id: 1, name: 'Show Field' }, { id: 2, name: 'Hide Field' }, { id: 6, name: 'Show FieldSet' }, { id: 7, name: 'Hide FieldSet' }, { id: 3, name: 'Execute Query' }, { id: 4, name: 'Required' }, { id: 5, name: 'Optional' }, { id: 8, name: 'Execute Rule Business' }, { id: 9, name: 'Alert' }, { id: 10, name: 'Read Only' }, { id: 11, name: 'Remove Read Only' }, { id: 12, name: 'Rename Field' }, { id: 13, name: 'Hide Button' }, { id: 14, name: 'Show Button' }, { id: 15, name: 'Splash' }];
  public valueSource = [{ id: 1, name: 'Value' }, { id: 2, name: 'Execute Query' }, { id: 3, name: 'Alert' }];
  public ListToFillData: [{
    choosenFielddd: any; 'fieldToFillIn': any, 'choosenValue': any, 'fieldToFillInOrder': any
  }];

  public plusMinusOperator = [
    { id: 1, name: '+' },
    { id: 2, name: '-' },
  ];
  public plusMinusoptions = [
    { id: 1, name: 'Value' },
    { id: 2, name: 'CURRENT_DATE' },
    { id: 3, name: 'Execute Query' }
  ];
  public ruleCallApiData:any=[];

  constructor(private dialogRef: MatDialogRef<AmPreviewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public lookupData: any,
    private http: HttpClient,
    private eventEmitterService: EventEmitterService,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    public dataservice: DataService,
    public loaderService: LoaderService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef,
    private refreshService: RefreshDialogService,
    private ngZone: NgZone,
    public informationservice: InformationService
  ) {
  }




  async loadAllFormColumns(objectId: number) {
    this.loaderService.isLoading.next(true);
    const allColumnsLibraryUrl = from(axios.get(GlobalConstants.getColumnsApi + objectId));
    const allColumns = await lastValueFrom(allColumnsLibraryUrl);
    console.log('allcolumns>>>>>>>',allColumns)
    this.allColumnsLibrary = allColumns.data;
    this.loaderService.isLoading.next(false);
  }

  dynamicIfCondition(value1: any, value2: any, value3: any, operator: string): boolean {
    if (value1 == null || value1 == 'null') {
      value1 = '';
    }
    else if (value2 == null || value2 == 'null') {
      value2 = '';
    }
    else if (value3 == null || value3 == 'null') {
      value3 = '';
    }
    switch (operator) {
      case '=':
        return value1 == value2;
      case '!=':
        return value1 != value2;
      case '>':
        return Number(value1) > Number(value2);
      case '<':
        return Number(value1) < Number(value2);
      case '<=':
        return Number(value1) <= Number(value2);
      case '>=':
        return Number(value1) >= Number(value2);
      case '<CURRENT_DATE':
        return value1 < value2;
      case '>CURRENT_DATE':
        return value1 > value2;
      case '>=CURRENT_DATE':
        return value1 >= value2;
      case '<=CURRENT_DATE':
        return value1 <= value2;
      case 'between':
        return value1 > value2 && value1 < value3;
      default:
        return false; // Handle unsupported operators
    }
  }

  DynamicAdvancedOperator(Operator: any) {
    if (Operator == 'And') {
      return '&&';
    }
    else if (Operator == 'Or') {
      return '||';
    }
    else if (Operator == 'No Operator') {
      return '';
    }
  }

  dynamicFormData(colName: string, colType: string) {
    let returnedValue: string = '';
    let colVal: string = this.dynamicForm.get(colName)?.value;
    if (colName == 'CREATED_BY') {
      //test2
      colVal = this.informationservice.getLogeduserId();
    }

    if (colVal != '' || Number(colVal) == 0) {
      if (colType.toUpperCase() == "DATE") {
        returnedValue = moment(colVal).format('MM/DD/YYYY');
      } else if (colType.toUpperCase() == "DATE TIME") {
        let dateParts = colVal.split('T');
        console.log("dateParts>>>>>>>>>>>>>>>>>>>> :", dateParts);
        if(dateParts.length > 1){
        returnedValue = dateParts[0] + ' ' + dateParts[1].substring(0, 5);
        }else if(dateParts.length == 1 ){
          returnedValue = dateParts[0] ;
        }
      }

      else if (colType.toUpperCase() == "FILE") {

        let colVall = this.dynamicForm.get(colName)?.value;
        returnedValue = colVall;
      } else if (colType.toUpperCase() == "SIGNATURE") {
        let colVall = this.dynamicForm.get(colName)?.value;
        returnedValue = localStorage.getItem("signatureImage");
        localStorage.removeItem("signatureImage");

      } else if (colType.toUpperCase() == "COMBO") {
        let colVall = this.dynamicForm.get(colName)?.value;
        returnedValue = colVall;
      } else if (colType.toUpperCase() == "PHONE") {
        let colVall = this.dynamicForm.get(colName)?.value;
        returnedValue = colVall;
      } else {
        returnedValue = colVal;
      }
    }
    return returnedValue;
  }

  dynamicFormQuering_select(data: any) {
    let jsonArr: string = "[";
    let uniqueArray = data.filter(
      (item: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.tableName === item.tableName && t.tableName != "NO TABLE.NO TABLE")
    );

    let tableName = '';
    let count = 0;
    for (let k = 0; k < uniqueArray.length; k++) {
      jsonArr += "{\"" + "columns" + "\" : [";
      tableName = uniqueArray[k].tableName
      for (let i = 0; i < data.length; i++) {
        count++;
        if (tableName == data[i].tableName) {
          let colId = data[i].colId;
          let colName = data[i].name;
          let colType = data[i].columnType;
          let isLink = data[i].isLink;
          let linkedObjectId = isLink != null ? data[i].menus : -1;
          jsonArr += "{";

          if (isLink == "1") {
            jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"" + "," + "\"" + "isLink" + "\"" + ":" + "\"" + isLink + "\"" + "," + "\"" + "linkedObjectId" + "\"" + ":" + "\"" + linkedObjectId + "\"";
          } else {
            jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
          }
          if (i == data.length - 1) {
            jsonArr += "}";
          } else {
            jsonArr += "},";
          }
        }
      }

      if (k == uniqueArray.length - 1) {
        jsonArr += "],";
        jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"";
        jsonArr += "}]";
        jsonArr = jsonArr.replace("},]", "}]");
      } else {
        jsonArr += "],";
        jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"";
        jsonArr += "},";
        jsonArr = jsonArr.replace("},]", "}]");
      }
    }
    return jsonArr;
  }

  dynamicFormQuering_saveNew(data: any, val: any) {
    let jsonArr: string = "[";
    let uniqueArray = data.filter((item: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.tableName === item.tableName && t.tableName != "NO TABLE.NO TABLE")
    );
    let tableName = '';
    let count = 0;
    let colName = '';
    let colValue = '';
    let colType = '';
    let colId = '';
    let orderNo: any;
    for (let k = 0; k < uniqueArray.length; k++) {
      jsonArr += "{\"" + "columns" + "\" : [";
      tableName = uniqueArray[k].tableName
      orderNo = uniqueArray[k].orderNo;
      let primaryColumn = val.primaryColumn;

      for (let i = 0; i < data.length; i++) {
        count++;
        if (tableName == data[i].tableName) {
          if (data[i].isExcluded != 1) {
            colId = data[i].colId;
            colName = data[i].name;
            colType = data[i].columnType;


            colValue = primaryColumn == colName ? "SEQUENCE_HERE" : this.dynamicFormData(colName, colType);
            jsonArr += "{";
            if (i == data.length - 1) {
              jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"" + "," + "\"" + "colValue" + "\"" + ":" + "\"" + colValue + "\"";
              jsonArr += "}";
            } else {
              jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"" + "," + "\"" + "colValue" + "\"" + ":" + "\"" + colValue + "\"";
              jsonArr += "},";
            }
            jsonArr = jsonArr.replace("},],", "}],");
          }
        }
      }
      if (k == uniqueArray.length - 1) {
        jsonArr += "],";
        jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "\"" + orderNo + "\"";
        jsonArr += "}]";
      } else {
        jsonArr += "],";
        jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "" + orderNo + "";
        jsonArr += "},";
      }
      jsonArr = jsonArr.replace("},]", "}]");
    }
    let modifiedJsonString = jsonArr.replace(/\\/g, '\\\\');
    let jsonVal = JSON.parse(modifiedJsonString);
    let finalJSonArray = jsonVal.sort((a:any, b:any) => a.orderNo - b.orderNo);
    return JSON.stringify(finalJSonArray);
  }

  dynamicFormQuering_update(data: any, val: any) {
    let jsonArr: string = "[";
    let uniqueArray = data.filter(
      (item: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.tableName === item.tableName && t.tableName != "NO TABLE.NO TABLE")
    );
    let tableName = '';
    let count = 0;
    let colName = '';
    let colVal = '';
    let colType = '';
    // let colId = '';


    for (let k = 0; k < uniqueArray.length; k++) {

      let orderNo : any;

      jsonArr += "{\"" + "columns" + "\" : [";
      tableName = uniqueArray[k].tableName
      let primaryColumn = val.primaryColumn;
      orderNo = uniqueArray[k].orderNo;

      for (let i = 0; i < data.length; i++) {
        colName = '';
        colVal = '';
        colType = '';
        if (tableName == data[i].tableName) {
          if (data[i].isExcluded != 1) {
            // Check if column is primary or no
            colName = data[i].name;
            if (primaryColumn == colName) {
              count++;
              colType = data[i].columnType;
              colVal = "SEQUENCE_HERE";
              jsonArr += "{";
              if (i == data.length - 1) {
                jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colValue" + "\"" + ":" + "\"" + colVal + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
                jsonArr += "}";
              } else {
                jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colValue" + "\"" + ":" + "\"" + colVal + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
                jsonArr += "},";
              }
            } else {
              colName = data[i].name;
              const control = this.dynamicForm.controls[colName];
              if (data[i].columnType == "phone number") {
                control.touched = true;
              }
              // && control.touched
              if (control) {
                count++;
                colType = data[i].columnType;
                colVal = this.dynamicFormData(colName, colType);
                jsonArr += "{";
                if (i == data.length - 1) {
                  jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colValue" + "\"" + ":" + "\"" + colVal + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
                  jsonArr += "}";
                } else {
                  jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colValue" + "\"" + ":" + "\"" + colVal + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
                  jsonArr += "},";
                }
              }
            }
          }
        }
      }


      if (k == uniqueArray.length - 1) {
        jsonArr += "],";
        jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "" + orderNo + "";
        jsonArr += "}]";

      } else {
        jsonArr += "],";
        jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "" + orderNo + "";
        jsonArr += "},";
      }
      jsonArr = jsonArr.replace("},]", "}]");
    }
    // return jsonArr;


    let modifiedJsonString = jsonArr.replace(/\\/g, '\\\\');
    let jsonVal = JSON.parse(modifiedJsonString);
    let finalJSonArray = jsonVal.sort((a:any, b:any) => a.orderNo - b.orderNo);
    return JSON.stringify(finalJSonArray);
  }

  dynamicFormQuering(data: any, actionType: string, val: any): string {
    if (actionType == 'select') {
      return this.dynamicFormQuering_select(data);
    }

    if (actionType == 'saveNew') {
      return this.dynamicFormQuering_saveNew(data, val);
    }

    if (actionType == 'update') {
      return this.dynamicFormQuering_update(data, val);
    }
  }

  removeElementsFromArray(jsonArray: any, index: number) {
    if (index < 0) {
      return;
    }

    // Remove the element at the given index
    jsonArray.splice(index, 1);

    // Recursively call the function with the updated index
    this.removeElementsFromArray(jsonArray, index - 1);
  }

  closeDialog(clickOnTab: boolean): void {
    let TimeNumber;
    this.informationservice.setSameSession("");
    //test2
    if (this.informationservice.getTwiceClose() == 'yes') {
      TimeNumber = 2;
    } else {
      TimeNumber = 1;
    }
    for (let i = 0; i < 1; i++) {
      this.refreshService.notifyOther({ refresh: clickOnTab });
      let listOfDialog = this.dataservice.getdialogArray();
      let listOfOpenLikeForm = this.dataservice.getListOfOpenLikeForm();

      if (listOfDialog.length > 1) {
        this.dialogRef = listOfDialog[listOfDialog.length - 1];
        let typeOfOpen = listOfOpenLikeForm[listOfOpenLikeForm.length - 1];
        if (typeOfOpen == 'yes') {
          //test2
          this.informationservice.setOpenLikeForm("yes");
        }
        else {
          //test2
          this.informationservice.setOpenLikeForm("no");
        }
        this.dialogRef.close();
        this.refreshService.notifyOther({ refresh: clickOnTab });
        listOfDialog.pop();
        listOfOpenLikeForm.pop();
        this.dataservice.setListOfOpenLikeForm(listOfOpenLikeForm);
        this.dataservice.SetdialogArray(listOfDialog);

        if (this.isMainTab == 1) {
          this.handleDialogTitle();
        }

        // Remove current form data cause it's not needed after closure
        //test2
        let selectedTabName = this.informationservice.getSelectedTabName();



        this.informationservice.setDynamicService("formData_" + selectedTabName, '');

        setTimeout(() => {
          if (clickOnTab) {
            let tabs = $(".tab-title");
            let activeTabsList: any[] = [];
            for (let j = 0; j < tabs.length; j++) {
              if (tabs[j].className.indexOf("active") != -1) {
                activeTabsList.push(tabs[j]);
              }
            }
            for (let i = 0; i < activeTabsList.length; i++) {
              if (i == activeTabsList.length - 1) {
                $("#" + activeTabsList[i].offsetParent.id + " .tab .tab-title")[0].click();
              }
            }
          }
        }, 1000);
      } else {
        this.dialog.closeAll();
      }
    }


  }

  ngOnDestroy() {
    this.informationservice.setSkip('no');
    let substring: string = 'Initiation';
    let mainString : string = this.informationservice.getPopupBreadcrumb();
    let checkExisting  = this.informationservice.getCheckExisting();
    console.log("localStorage.getItem(closeTwice) =======>",localStorage.getItem("closeTwice"));
    if(localStorage.getItem("closeTwice") == "true"){
      console.log("heyyy should close another one")
      localStorage.setItem("closeTwice","false");
      this.closeDialog(true);
     }
    if((!mainString.includes(substring) && checkExisting == "yes")){
      if(this.informationservice.getOpenLikeForm() == 'yes'){
        this.informationservice.setReopen('yes');
        this.closeDialog(true);
      }
      else if(this.informationservice.getReopen() == 'yes'){
         this.informationservice.setSkip('yes');
         this.onAddClick();
         this.informationservice.setReopen('');
      }
    }
    if(this.informationservice.getPopupBreadcrumb() == "Signature Class" ||
    this.informationservice.getPopupBreadcrumb() == "Authorized Signature"){
      if(this.informationservice.getOpenLikeForm() == 'yes'){
        this.informationservice.setReopen('yes');
        console.log("this.actionType >>>>>> ",this.actionType);
        console.log("this.informationservice.getAgGidSelectedNode()=",this.informationservice.getAgGidSelectedNode())
        this.closeDialog(true);
      }
      else if(this.informationservice.getReopen() == 'yes'){
         this.informationservice.setSkip('yes');

         if( this.actionType == "saveNew"){
          this.onAddClick();
         }else{
          this.informationservice.setAgGidSelectedNode(this.informationservice.getAgGidSelectedNodeRule());
          this.onUpdateClick();
         }
         this.informationservice.setReopen('');
      }
    }


    if (this.subsVar) {
      this.subsVar.unsubscribe();
    }
  }

  dynamicDRBWhereCondition(objectId: number) {
    let url = GlobalConstants.getDBRGridByRuleActionAndColumnId + objectId + "/5/0";
    this.http.post<any>(url, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        if (res != null && res != undefined && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            let tableName;
            let choosenField;
            let condition;
            let conditionValue: string = '';

            let ruleData = JSON.parse(res[i].ruleData);
            let isExcluded = JSON.parse(res[i].isExcluded);
            if (isExcluded != 1) {
              for (let i = 0; i < ruleData.length; i++) {
                if (ruleData[i].step == 0) {
                  tableName = ruleData[i].data;
                } else if (ruleData[i].step == 1) {
                  choosenField = ruleData[i].data;
                } else if (ruleData[i].step == 2) {
                  condition = this.commonFunctions.filterArrayById(this.conditions, ruleData[i].data)[0].name;
                } else if (ruleData[i].step == 33) {
                  conditionValue = ruleData[i].data;
                }
              }
            }
            let whereCondition: any = { tableName: tableName, columnName: choosenField, condition: condition, value: conditionValue }
            this.whereConditionAr.push(whereCondition);
          }
        }
      });
  }

  async dynamicDRBOnBeforeSave(objectId: number) {
    try {
      this.canProceedWithSave = true;
      let url = GlobalConstants.getDBRGridByRuleActionAndColumnId + objectId + "/3/0";
      const dynamicDRBOnBeforeSaveUrl = from(axios.post(url));
      const dynamicDRBOnBeforeSave = await lastValueFrom(dynamicDRBOnBeforeSaveUrl);
      if (dynamicDRBOnBeforeSave.data.length > 0) {
        for (let i = 0; i < dynamicDRBOnBeforeSave.data.length; i++) {
          this.loaderService.isLoading.next(true);
          let ruleAction = this.commonFunctions.filterArrayById(this.ruleAction, dynamicDRBOnBeforeSave.data[i].ruleAction)[0].name;
          let choosenField: any;
          let condition;
          let conditionValue: string = '';
          let executeAction;
          let executeOnField: string | any[];
          let executeQuery;
          let executeOnFieldSet: any;
          let ruleData = JSON.parse(dynamicDRBOnBeforeSave.data[i].ruleData);
          let elements: string[];
          let comboValueField: any;
          let defaultField: any;
          let renameFieldLoad: any;
          let hasAdvanced = JSON.parse(dynamicDRBOnBeforeSave.data[i].hasAdvancedConditions);
          let dataParams = [];
          let finalIfConditions: any;
          let Rule: any;
          let action: any;
          let executeOnFieldAdv: any;
          let executeOnFieldSetAdv: any;
          let ruleIdAdv: any;
          let alertValueAdv: any;
          let renameFieldAdv: any;
          let executeRuleBusiness: any;
          let defaultTest: any;
          let listOfFields: any = [];
          let minusCURRENT_DATE: any;
          let fillintofield: any;
          let executeAction2: any;
          let executeOnField2: any;
          let executeQuery1: any;
          let checkedValue: any;
          let queryRes;
          let conditionRes;
          let alertMessage;
          let allParameters: any;
          let procedureName: any;
          let jsonQbe: any[] = [];
          let isExcluded = JSON.parse(dynamicDRBOnBeforeSave.data[i].isExcluded);
          for (let t = 0; t < ruleData.length; t++) {
            if (ruleData[t].step == 1) {
              this.listOfRuleData.push(ruleData[t].data);
            }
          }


          let actionType;
          if (JSON.parse(dynamicDRBOnBeforeSave.data[i].actionType) == 1) {
            actionType = "saveNew";

          }
          else if (JSON.parse(dynamicDRBOnBeforeSave.data[i].actionType) == 2) {
            actionType = "update";
          }
          if (isExcluded != 1) {
            if (hasAdvanced == 1) {
              for (let i = 0; i < ruleData.length; i++) {
                if (ruleData[i].step == 0) {
                  Rule = ruleData[i].data;
                } else if (ruleData[i].step == 52) { }
                else if (ruleData[i].step == 1 && ruleData[i].data != '') {
                  let queryData = ruleData[i].data;

                  let queryResult = queryData == null ? -1 : queryData;
                  let jsonQbe: any[] = [];
                  if (queryResult != -1) {
                    const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + queryResult));
                    const paramNames = await lastValueFrom(paramNamesUrl);

                    jsonQbe.push(
                      {
                        queryId: queryResult,
                        parameters: [
                          {
                            paramName: 'actionType',
                            paramValue: '' + this.actionType + ''
                          },
                          {
                            paramName: 'userId',
                            paramValue: this.userId
                          }
                        ],
                        link: [],
                        isHidden: [],
                        whereCond: this.getWhereCond
                      }
                    )

                    if (paramNames.data.length > 0) {
                      // Filter ROW_ID information to get only the ones for Grid
                      let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                      if (params != undefined) {
                        let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid,button,combo");
                        for (let i = 0; i < filteredParams.length; i++) {
                          for (let j = 0; j < paramNames.data.length; j++) {
                            if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                              let colName = filteredParams[i].colname;
                              let colVal = filteredParams[i].colvalue;
                              jsonQbe.push(
                                {
                                  queryId: queryResult,
                                  parameters: [
                                    {
                                      paramName: colName,
                                      paramValue: colVal
                                    }
                                  ],
                                  link: this.testLinks,
                                  isHidden: [],
                                  whereCond: this.getWhereCond
                                }
                              );
                            }
                          }
                        }
                      }
                    } else {
                      jsonQbe.push(
                        {
                          queryId: queryResult,
                          parameters: [
                            {
                              paramName: '',
                              paramValue: ''
                            }
                          ],
                          link: [],
                          isHidden: [],
                          whereCond: this.getWhereCond
                        }
                      );
                    }
                  }
                  const queryUrl = from(axios.post(GlobalConstants.getQbeIdApi + queryResult + "/0", jsonQbe));
                  const queryAdd = await lastValueFrom(queryUrl);
                  // if (queryAdd.data[0] == 1) {
                  executeQuery = queryAdd.data[0];
                }
                if (ruleData[i].step == 8 && ruleData[i].data != "") {
                  action = this.commonFunctions.filterArrayById(this.executionAction, ruleData[i].data)[0].name;
                }
                if (ruleData[i].step == 44 && ruleData[i].data != '') {
                  if (action == "Show Field" || action == "Hide Field" || action == "Required" || action == "Optional" || action == "Read Only" || action == "Remove Read Only" || action == "Rename Field") {
                    executeOnFieldAdv = ruleData[i].data;
                  }
                  else if (action == "Show FieldSet" || action == "Hide FieldSet") {
                    executeOnFieldSetAdv = ruleData[i].data;
                  }
                  else if (action == "Execute Rule Business") {
                    executeRuleBusiness = ruleData[i].data;
                    ruleIdAdv = executeRuleBusiness;
                  }
                  else if (action == "Execute Query") {
                    executeQuery = ruleData[i].data;
                    const defaultValueUrl = from(axios.post(GlobalConstants.getQbeIdApi + executeQuery + "/0", this.jsonEmpty));
                    const defaultValuee = await lastValueFrom(defaultValueUrl);
                    // this.dynamicForm.controls[defaultField].setValue(defaultValuee.data[0]);
                    this.handleFormFieldValues(defaultField, defaultValuee.data[0]);
                  }
                  else if (action == "Alert") {

                    alertValueAdv = ruleData[i].data;
                  }
                }
                else if (ruleData[i].step == 6 && ruleData[i].data != '') {
                  renameFieldAdv = ruleData[i].data;
                }
                else if (ruleData[i].step == 5 && ruleData[i].data != '') {
                  alertValueAdv = ruleData[i].data;
                }
                else if (ruleData[i].step == 2 && ruleData[i].data != '') {
                  condition = this.commonFunctions.filterArrayById(this.conditions, ruleData[i].data)[0].name;
                } else if (ruleData[i].step == 3 && ruleData[i].data != '') {
                  conditionRes = ruleData[i].data;
                }
              }
              let jsonObject = JSON.parse(Rule);
              if (jsonObject != -1) {
                let addList = jsonObject.addList;
                let secondList = JSON.stringify(addList);
                let Object = JSON.parse(secondList);

                for (let i = 0; i < Object.length; i++) {
                  let beginCondition = '';
                  let field = '';
                  let condition = '';
                  let value = '';
                  let endCondition = '';
                  let operator = '';
                  let name = '';
                  if (Object[i].beginCondition == undefined) {
                    beginCondition = '';
                  }
                  else if (Object[i].beginCondition != undefined) {
                    beginCondition = Object[i].beginCondition.name;
                  }
                  if (Object[i].field == undefined) {
                    field = '';
                    name = '';
                  }
                  else if (Object[i].field != undefined) {
                    field = Object[i].field.id;
                    name = Object[i].field.name;
                  }
                  if (Object[i].condition == undefined) {
                    condition = '';
                  }
                  else if (Object[i].condition != undefined) {
                    condition = Object[i].condition.name;
                  }
                  if (Object[i].value == undefined) {
                    value = '';
                  }
                  else if (Object[i].value != undefined) {
                    value = Object[i].value;
                  }
                  if (Object[i].endCondition == undefined) {
                    endCondition = '';
                  }
                  else if (Object[i].endCondition != undefined) {
                    endCondition = Object[i].endCondition.name;
                  }
                  if (Object[i].operator == undefined) {
                    operator = '';
                  }
                  else if (Object[i].operator != undefined) {
                    operator = Object[i].operator.name;
                  }

                  let item = {
                    "beginCondition": beginCondition,
                    "field": field,
                    "condition": condition,
                    "value": value,
                    "endCondition": endCondition,
                    "operator": operator,
                    "name": name
                  }

                  dataParams.push(item);
                }


                for (let i = 0; i < dataParams.length; i++) {
                  let val = dataParams[i].value;
                  let condition = '';

                  let valueSelected = this.dynamicForm.controls[dataParams[i].name]?.value;
                  // if (valueSelected == null || valueSelected == 'null') {
                  //   valueSelected = '';
                  // }
                  switch (dataParams[i].condition) {
                    case '=':
                      condition = "==";
                      if (i == 0) {
                        finalIfConditions = "'" + valueSelected + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += "'" + valueSelected + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case '!=':
                      condition = dataParams[i].condition;
                      if (i == 0) {
                        finalIfConditions = "'" + valueSelected + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += "'" + valueSelected + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case '<':
                    case '>':
                    case '>=':
                    case '<=':
                      condition = dataParams[i].condition;
                      if (i == 0) {
                        finalIfConditions = valueSelected + condition + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += valueSelected + condition + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case '< CURRENT_DATE':
                    case '> CURRENT_DATE':
                      if (dataParams[i].value = "") {

                        let conditionsVar = dataParams[i].condition.split(" ");



                        let field = this.dynamicForm.controls[dataParams[i].field]?.value;
                        let fieldDate = new Date(field);
                        let conditionDate = new Date();
                        if (i == 0) {
                          finalIfConditions = "'" + fieldDate + "'" + conditionsVar[0] + "'" + conditionDate + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += "'" + fieldDate + "'" + conditionsVar[0] + "'" + conditionDate + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                      } else {

                        let conditionsVar = dataParams[i].condition.split(" ");
                        let field = this.dynamicForm.controls[dataParams[i].field]?.value;
                        let fieldDate = new Date(field);
                        let conditionDate = new Date();

                        if (conditionsVar[0].includes('<')) {
                          let datedif = conditionDate.getFullYear() - fieldDate.getFullYear();

                          if (i == 0) {
                            finalIfConditions = datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                          else {
                            finalIfConditions += datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                        } else {
                          let datedif = fieldDate.getFullYear() - conditionDate.getFullYear();
                          if (datedif < 0) {
                            datedif = -datedif;
                          }
                          if (i == 0) {
                            finalIfConditions = datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                          else {
                            finalIfConditions += datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                        }
                      }
                      break;
                    case "Get CURRENT_DATE (Year)":
                      let conditionsVar = condition.split(" ");
                      // let field = $("#field_" + dataParams[i].field).val().toString();
                      let field = this.dynamicForm.controls[dataParams[i].name]?.value;
                      let fieldDate = new Date(field);
                      let conditionDate = new Date();
                      let datedif = fieldDate.getFullYear() - conditionDate.getFullYear();
                      if (i == 0) {
                        finalIfConditions = datedif + '<' + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += datedif + '<' + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    default:
                  }
                  //let field = $("#field_" + dataParams[i].field).val().toString();
                  listOfFields.push(dataParams[i].field);
                }

                var result = eval(finalIfConditions);
                if (result) {
                  if (action == 'Alert') {
                    //Stop the Save
                    this.canProceedWithSave = false;
                    this.commonFunctions.alert("alert", alertValueAdv);
                  } else if (action == "Show Field" || action == "Hide Field") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Show FieldSet" || action == "Hide FieldSet") {
                    this.dynamicActionsOnChange(action, executeOnFieldSetAdv);
                  } else if (action == "Required") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Optional") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Read Only") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Remove Read Only") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Rename Field") {
                    document.getElementById("lbl_" + executeOnFieldAdv).innerHTML = renameFieldAdv;
                  } else if (action == "Execute Rule Business") {
                    // columnId = -1
                    // this.dynamicDRBOnchange(columnId, ruleIdAdv);
                  } else if (action == "Execute Query") {
                    if (this.dynamicIfCondition(executeQuery, conditionRes, -1, condition)) {
                      this.commonFunctions.alert("alert", alertValueAdv);
                      this.canProceedWithSave = false;
                    }
                  }
                }
              }
            }
            else {
              for (let i = 0; i < ruleData.length; i++) {
                if (ruleData[i].step == 1) {
                  let queryId = ruleData[i].data;
                  // Add a parameter to an Execute Query Nadine Nicolas
                  const paramQueryUrl = from(axios.get(GlobalConstants.getParamsNameApi + queryId));
                  const paramNames = await lastValueFrom(paramQueryUrl);

                  if (paramNames.data.length > 0) {
                    // Filter ROW_ID information to get only the ones for Grid
                    let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;


                    if (params != undefined) {
                      let filteredParams: any = this.handleSelectedRowIds(params, "combo,button");

                      for (let i = 0; i < filteredParams.length; i++) {
                        for (let j = 0; j < paramNames.data.length; j++) {
                          if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                            let colName = filteredParams[i].colname;
                            let colVal = filteredParams[i].colvalue;

                            jsonQbe.push(
                              {
                                queryId: queryId,
                                parameters: [
                                  {
                                    paramName: colName,
                                    paramValue: colVal
                                  }
                                ],
                                link: [],
                                isHidden: [],
                                whereCond: this.getWhereCond
                              }
                            );
                          }
                        }
                      }
                    }
                  } else {
                    jsonQbe.push(
                      {
                        queryId: queryId,
                        parameters: [
                          {
                            paramName: '',
                            paramValue: ''
                          }
                        ],
                        link: [],
                        isHidden: [],
                        whereCond: this.getWhereCond
                      }
                    );
                  }
                  // --------------------
                  const queryResUrl = from(axios.post(GlobalConstants.getQbeIdApi + queryId + "/0", jsonQbe));
                  const queryRess = await lastValueFrom(queryResUrl);
                  queryRes = queryRess.data[0];
                } else if (ruleData[i].step == 2) {
                  condition = this.commonFunctions.filterArrayById(this.conditions, ruleData[i].data)[0].name;
                } else if (ruleData[i].step == 3) {
                  conditionRes = ruleData[i].data;
                } else if (ruleData[i].step == 5) {
                  alertMessage = ruleData[i].data;
                } else if (ruleData[i].step == 6) {
                  procedureName = ruleData[i].data;
                } else if (ruleData[i].step == 7) {
                  allParameters = ruleData[i].data;
                }
              }
            }
            // if(procedureName != ''){

            //   for (let i = 0; i < allParameters.length; i++) {

            //     if ($("#field_" + allParameters[i]).length > 0) {
            //       let formControlName = $("#field_" + allParameters[i]).attr("class").split(" ")[0];
            //       allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
            //     }

            //     if ($(".field_" + allParameters[i]).length > 0) {
            //       let formControlName = $(".field_" + allParameters[i]).attr("class").split(" ")[0];
            //       allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
            //     }
            //   }

            //   allParameters = allParameters.replace("undefined~","~");

            //   // ProcedureName = ProcedureName.replace("SSDX_ENG.", "");
            //   let jsonArr = {
            //     "procParam": allParameters,
            //     "procedureName": procedureName,
            //     "executedBy": "1"
            //   };
            //   const callApiUrl = from(axios.post(GlobalConstants.callProcedure, jsonArr));
            //   const callApi = await lastValueFrom(callApiUrl);
            // }


            if (this.dynamicIfCondition(queryRes, conditionRes, -1, condition)) {
              this.commonFunctions.alert("alert", alertMessage);
              this.canProceedWithSave = false;
            }
            this.loaderService.isLoading.next(false);
          }
        }
      }
    } catch (error) {
      console.log("dynamicDRBOnBeforeSave error >>> ", error)
    }
  }


  getConditionNameById(id: number): string {
    const condition = this.conditions.find(c => c.id === id);
    return condition ? condition.name : '';
  }

  getFieldNameById(id: number): string {
    const condition = this.test.find(c => c.id === id);
    return condition ? condition.name : '';
  }

  // After Save Functions
  async dynamicDRBOnAfterSave(objectId: number) {
    try {
      let url = GlobalConstants.getDBRGridByRuleActionAndColumnId + objectId + "/4/0";
      const dynamicDRBOnAfterSaveUrl = from(axios.post(url));
      const dynamicDRBOnAfterSave = await lastValueFrom(dynamicDRBOnAfterSaveUrl);
      if (dynamicDRBOnAfterSave.data.length > 0) {
        this.loaderService.isLoading.next(true);
        for (let i = 0; i < dynamicDRBOnAfterSave.data.length; i++) {
          //  this.loaderService.isLoading.next(true);
          let type;
          let endOfUrl;
          let Apiparams;
          let ProcedureParams;
          let ProcedureName;
          let FormFields;
          let condition;
          let typeOfDate;
          let Value;
          let Action;
          let ProcName;
          let ProcParams;
          let executeQuery;
          let ruleData = JSON.parse(dynamicDRBOnAfterSave.data[i].ruleData);
          let isExcluded = JSON.parse(dynamicDRBOnAfterSave.data[i].isExcluded);


          let actionType;


          if (JSON.parse(dynamicDRBOnAfterSave.data[i].actionType) == 1) {
            actionType = "saveNew";
          }
          else if (JSON.parse(dynamicDRBOnAfterSave.data[i].actionType) == 2) {
            actionType = "update";
          }

          if (isExcluded != 1) {
            if (this.actionType == actionType) {
              for (let i = 0; i < ruleData.length; i++) {
                if (ruleData[i].step == 1) {
                  type = ruleData[i].data;
                }
                if (ruleData[i].step == 31) {
                  endOfUrl = ruleData[i].data;
                }
                if (ruleData[i].step == 3) {
                  console.log("ruleData>>>>>>>>",ruleData[i]);
                  Apiparams = ruleData[i].data;
                }
                if (ruleData[i].step == 21) {
                  ProcedureParams = ruleData[i].data;
                }
                if (ruleData[i].step == 2) {
                  ProcedureName = ruleData[i].data;
                }
                if (ruleData[i].step == 4) {
                  FormFields = ruleData[i].data;
                }
                if (ruleData[i].step == 41) {
                  condition = ruleData[i].data;
                }
                if (ruleData[i].step == 42) {
                  typeOfDate = ruleData[i].data;
                }
                if (ruleData[i].step == 43) {
                  Value = ruleData[i].data;
                }
                if (ruleData[i].step == 44) {
                  Action = ruleData[i].data;
                }
                if (ruleData[i].step == 45) {
                  ProcName = ruleData[i].data;
                }
                if (ruleData[i].step == 46) {
                  ProcParams = ruleData[i].data;
                }
                if (ruleData[i].step == 47) {
                  executeQuery = ruleData[i].data;
                }
              }
              //Call Rest Api from Rules
              if (type == 5) {
                let jsonArr = {
                  "userId": this.userId,
                  "Parameters": Apiparams,
                  "ruleCallApiData":this.ruleCallApiData
                }
                const callApiUrl = from(axios.post(GlobalConstants.callApi + endOfUrl, jsonArr));
                const callApi = await lastValueFrom(callApiUrl);


              }
              else if (type == 7) {
                let conditionQuery = executeQuery;
                let jsonCondition: any[] = [];
                // if (conditionQuery != -1) {
                const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + conditionQuery));
                const paramNames = await lastValueFrom(paramNamesUrl);

                jsonCondition.push(
                  {
                    queryId: conditionQuery,
                    parameters: [
                      {
                        paramName: 'actionType',
                        paramValue: '' + this.actionType + ''
                      },
                      {
                        paramName: 'userId',
                        paramValue: this.userId
                      }
                    ],
                    link: [],
                    isHidden: [],
                    whereCond: this.getWhereCond
                  }
                )

                if (paramNames.data.length > 0) {
                  // Filter ROW_ID information to get only the ones for Grid
                  let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                  if (params != undefined) {
                    let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid");
                    for (let i = 0; i < filteredParams.length; i++) {
                      for (let j = 0; j < paramNames.data.length; j++) {
                        if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                          let colName = filteredParams[i].colname;
                          let colVal = filteredParams[i].colvalue;
                          jsonCondition.push(
                            {
                              queryId: conditionQuery,
                              parameters: [
                                {
                                  paramName: colName,
                                  paramValue: colVal
                                }
                              ],
                              link: this.testLinks,
                              isHidden: [],
                              whereCond: this.getWhereCond
                            }
                          );
                        }
                      }
                    }
                  }
                } else {
                  jsonCondition.push(
                    {
                      queryId: conditionQuery,
                      parameters: [
                        {
                          paramName: '',
                          paramValue: ''
                        }
                      ],
                      link: [],
                      isHidden: [],
                      whereCond: this.getWhereCond
                    }
                  );
                  // }

                  const conditionUrl = from(axios.post(GlobalConstants.getQbeIdApi + conditionQuery + "/0", jsonCondition));
                  const ConditionResult = await lastValueFrom(conditionUrl);

                }
              }
              else if (type == 4) {
                let allParameters: any;
                // let sessionId;
                // let customerId;
                // let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;

                // let filteredParams: any = this.handleSelectedRowIds(params, "combo,grid,form");
                //Get the SessionId :
                // for (let i = 0; i < filteredParams.length; i++) {
                //   if (filteredParams[i].colname.toLocaleUpperCase() == 'SESSION_ID') {
                //     sessionId = filteredParams[i].colvalue;
                //   }
                //   if (filteredParams[i].colname.toLocaleUpperCase() == 'CUSTOMER_ID') {
                //     customerId = filteredParams[i].colvalue;
                //   }
                // }
                // for (let i = 0; i < ProcedureParams.length; i++) {
                //   if ($("#field_" + ProcedureParams[i]).attr("class") == undefined) {
                //     allParameters = "CUSTOMER_ID" + "/" + customerId;
                //   } else {
                //     let formControlName = $("#field_" + ProcedureParams[i]).attr("class").split(" ")[0];

                //     allParameters = "CUSTOMER_ID" + "/" + customerId;

                //     if (i == 0) {
                //       if (formControlName.toLocaleUpperCase() == "SESSION_ID") {
                //         allParameters = formControlName + "/" + sessionId;
                //       }
                //       else if (formControlName.toLocaleUpperCase() == "CUSTOMER_ID") {
                //         allParameters = formControlName + "/" + customerId;
                //       }
                //       else {
                //         allParameters = formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                //       }
                //     } else {
                //       if (formControlName.toLocaleUpperCase() == "SESSION_ID") {
                //         allParameters = formControlName + "/" + sessionId;
                //       }
                //       else if (formControlName.toLocaleUpperCase() == "CUSTOMER_ID") {
                //         allParameters = formControlName + "/" + customerId;
                //       } else {
                //         allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                //       }
                //     }
                //   }

                // }


                for (let i = 0; i < ProcedureParams.length; i++) {

                  if ($("#field_" + ProcedureParams[i]).length > 0) {
                    let formControlName = $("#field_" + ProcedureParams[i]).attr("class").split(" ")[0];
                    allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                  }

                  if ($(".field_" + ProcedureParams[i]).length > 0) {
                    let formControlName = $(".field_" + ProcedureParams[i]).attr("class").split(" ")[0];
                    allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                  }
                }

                allParameters = allParameters.replace("undefined~", "~");

                // ProcedureName = ProcedureName.replace("SSDX_ENG.", "");
                let jsonArr = {
                  "procParam": allParameters,
                  "procedureName": ProcedureName,
                  "executedBy": "1"
                };

                const callApiUrl = from(axios.post(GlobalConstants.callProcedure, jsonArr));
                const callApi = await lastValueFrom(callApiUrl);


              }
              else if (type == 6) {
                //Call Procedure
                condition = this.getConditionNameById(condition);
                if (condition == '=') {
                  condition = "==";
                }
                else if (condition == '!=') {
                  condition = "!=";
                }
                let FormFieldsValue = this.getFieldNameById(FormFields.toString());
                let finalCondition = "'" + this.dynamicForm.controls[FormFieldsValue]?.value + "'" + condition + "'" + Value + "'";
                var result = eval(finalCondition);

                if (result == true) {
                  if (Action == '4') {
                    let allParameters: any;
                    let sessionId;
                    let customerId;
                    let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                    let filteredParams: any = this.handleSelectedRowIds(params, "combo,grid");
                    //Get the SessionId :
                    for (let i = 0; i < filteredParams.length; i++) {
                      if (filteredParams[i].colname == 'session_id') {
                        sessionId = filteredParams[i].colvalue;
                      }
                      else if (filteredParams[i].colname == 'customer_id') {
                        customerId = filteredParams[i].colvalue;
                      }
                    }
                    for (let i = 0; i < ProcParams.length; i++) {
                      let formControlName = $("#field_" + ProcParams[i]).attr("class").split(" ")[0];
                      if (i == 0) {
                        if (formControlName.toLocaleUpperCase() == "SESSION_ID") {
                          allParameters = formControlName + "/" + sessionId;
                        }
                        else if (formControlName.toLocaleUpperCase() == "CUSTOMER_ID") {
                          allParameters = formControlName + "/" + customerId;
                        }
                        else {
                          allParameters = formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                        }
                      } else {
                        if (formControlName.toLocaleUpperCase() == "SESSION_ID") {
                          allParameters = formControlName + "/" + sessionId;
                        }
                        else if (formControlName.toLocaleUpperCase() == "CUSTOMER_ID") {
                          allParameters = formControlName + "/" + customerId;
                        }
                        else {
                          allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                        }
                      }
                    }
                    // allParameters = "SESSION_ID/" + sessionId ;
                    // ProcName = ProcName.replace("SSDX_ENG.", "")
                    let jsonArr = {
                      "procParam": allParameters,
                      "procedureName": ProcName,
                      "executedBy": "1"
                    };
                    //Api to call Proc
                    const callApiUrl = from(axios.post(GlobalConstants.callProcedure, jsonArr));
                    const callApi = await lastValueFrom(callApiUrl);



                    //open a dialog
                    const dialogRef = this.dialog.open(VRejectedComponent, {
                      disableClose: true,
                      width: "80%",
                      height: "80%",
                      data: "Rejected"
                    });
                  }
                }
              }
            }
          }
          this.loaderService.isLoading.next(false);
        }
      }

    } catch (error) {
      console.log("dynamicDRBOnAfterSave error >>> ", error)
    }
  }

  async dynamicDRBOnload(objectId: number) {
    try {
      let url = GlobalConstants.getDBRGridByRuleActionAndColumnId + objectId + "/2/0";
      const dynamicDRBOnloadUrl = from(axios.post(url));
      const dynamicDRBOnload = await lastValueFrom(dynamicDRBOnloadUrl);
      if (dynamicDRBOnload.data.length > 0) {
        let step0 = JSON.parse(dynamicDRBOnload.data[0].ruleData)[0];
        for (let j = 0; j < dynamicDRBOnload.data.length; j++) {
          let ruleAction = this.commonFunctions.filterArrayById(this.ruleAction, dynamicDRBOnload.data[j].ruleAction)[0].name;
          let choosenField;
          let ruleId = dynamicDRBOnload.data[j].ruleId;
          let condition;
          let conditionValue: string = '';
          let executeAction;
          let executeOnField: string | any[];
          let executeQuery;
          let executeOnFieldSet: any;
          let ruleData = JSON.parse(dynamicDRBOnload.data[j].ruleData);
          let elements: string[];
          let comboValueField: any;
          let defaultField: any;
          let renameFieldLoad: any;
          let hasAdvanced = JSON.parse(dynamicDRBOnload.data[j].hasAdvancedConditions);
          let dataParams = [];
          let finalIfConditions: any;
          let Rule: any;
          let action: any;
          let executeOnFieldAdv: any;
          let executeOnFieldSetAdv: any;
          let ruleIdAdv: any;
          let alertValueAdv: any;
          let renameFieldAdv: any;
          let executeRuleBusiness: any;
          let defaultTest: any;
          let listOfFields: any = [];
          let minusCURRENT_DATE: any;
          let fillintofield: any;
          let executeAction2: any;
          let executeOnField2: any;
          let executeQuery1: any;
          let checkedValue: any;
          let choosenField2: any;
          let operator: any;
          let operatorOption: any;
          let operatorQuery: any;
          let valueToOperate: any;
          let jsonQbe: any[] = [];
          let queryRes: any;
          let included: any = '';
          let valueOfFieldSelected: any;
          let choosenValue: any;
          let TypeOfAction: any;
          let isExcluded = JSON.parse(dynamicDRBOnload.data[j].isExcluded);
          for (let t = 0; t < ruleData.length; t++) {
            if (ruleData[t].step == 1) {
              this.listOfRuleData.push(ruleData[t].data);
            }
          }
          let actionType;


          if (JSON.parse(dynamicDRBOnload.data[j].actionType) == 1) {
            actionType = "saveNew";
          }
          else if (JSON.parse(dynamicDRBOnload.data[j].actionType) == 2) {
            actionType = "update";
          }
          if (isExcluded != 1) {
            this.loaderService.isLoading.next(true);
            if (this.actionType == actionType) {
              if (hasAdvanced == 1) {
                for (let i = 0; i < ruleData.length; i++) {
                  if (ruleData[i].step == 0) {
                    Rule = ruleData[i].data;
                  } else if (ruleData[i].step == 52) { }
                  if (ruleData[i].step == 4 && ruleData[i].data != "") {
                    action = this.commonFunctions.filterArrayById(this.executionAction, ruleData[i].data)[0].name;
                  }
                  if (ruleData[i].step == 44) {
                    if (action == "Show Field" || action == "Hide Field" || action == "Required" || action == "Optional" || action == "Read Only" || action == "Remove Read Only" || action == "Rename Field") {
                      executeOnFieldAdv = ruleData[i].data;
                    }
                    else if (action == "Show FieldSet" || action == "Hide FieldSet") {
                      executeOnFieldSetAdv = ruleData[i].data;
                    }
                    else if (action == "Execute Rule Business") {
                      executeRuleBusiness = ruleData[i].data;
                      ruleIdAdv = executeRuleBusiness;
                    }
                    else if (action == "Execute Query") {
                      executeQuery = ruleData[i].data;
                      const defaultValueUrl = from(axios.post(GlobalConstants.getQbeIdApi + executeQuery + "/0", this.jsonEmpty));
                      const defaultValuee = await lastValueFrom(defaultValueUrl);
                      // this.dynamicForm.controls[defaultField].setValue(defaultValuee.data[0]);
                      this.handleFormFieldValues(defaultField, defaultValuee.data[0]);
                    }
                    else if (action == "Alert") {
                      alertValueAdv = ruleData[i].data;
                    }
                  }
                  else if (ruleData[i].step == 6) {
                    renameFieldAdv = ruleData[i].data;
                  }
                }
                let jsonObject = JSON.parse(Rule);
                if (jsonObject != -1) {
                  let addList = jsonObject.addList;
                  let secondList = JSON.stringify(addList);
                  let Object = JSON.parse(secondList);

                  for (let i = 0; i < Object.length; i++) {
                    let beginCondition = '';
                    let field = '';
                    let condition = '';
                    let value = '';
                    let endCondition = '';
                    let operator = '';
                    let name = '';
                    if (Object[i].beginCondition == undefined) {
                      beginCondition = '';
                    }
                    else if (Object[i].beginCondition != undefined) {
                      beginCondition = Object[i].beginCondition.name;
                    }
                    if (Object[i].field == undefined) {
                      field = '';
                      name = '';
                    }
                    else if (Object[i].field != undefined) {
                      field = Object[i].field.id;
                      name = Object[i].field.name;
                    }
                    if (Object[i].condition == undefined) {
                      condition = '';
                    }
                    else if (Object[i].condition != undefined) {
                      condition = Object[i].condition.name;
                    }
                    if (Object[i].value == undefined) {
                      value = '';
                    }
                    else if (Object[i].value != undefined) {
                      value = Object[i].value;
                    }
                    if (Object[i].endCondition == undefined) {
                      endCondition = '';
                    }
                    else if (Object[i].endCondition != undefined) {
                      endCondition = Object[i].endCondition.name;
                    }
                    if (Object[i].operator == undefined) {
                      operator = '';
                    }
                    else if (Object[i].operator != undefined) {
                      operator = Object[i].operator.name;
                    }

                    let item = {
                      "beginCondition": beginCondition,
                      "field": field,
                      "condition": condition,
                      "value": value,
                      "endCondition": endCondition,
                      "operator": operator,
                      "name": name
                    }

                    dataParams.push(item);
                  }


                  for (let i = 0; i < dataParams.length; i++) {
                    let val = dataParams[i].value;
                    let condition = '';
                    switch (dataParams[i].condition) {
                      case '=':
                        condition = "==";
                        if (i == 0) {
                          finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        break;
                      case 'included':
                        condition = "included";
                        included = condition;
                        valueOfFieldSelected = this.dynamicForm.controls[dataParams[i].name]?.value;
                        choosenValue = dataParams[i].value;
                        if (i == 0) {
                          finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        break;
                      case '!included':
                        condition = "!included";
                        included = condition;
                        valueOfFieldSelected = this.dynamicForm.controls[dataParams[i].name]?.value;
                        choosenValue = dataParams[i].value;
                        if (i == 0) {
                          finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        break;
                      case '!=':
                        condition = dataParams[i].condition;
                        if (i == 0) {
                          finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].name]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        break;
                      case '<':
                      case '>':
                      case '>=':
                      case '<=':
                        condition = dataParams[i].condition;
                        if (i == 0) {
                          finalIfConditions = this.dynamicForm.controls[dataParams[i].name]?.value + condition + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += this.dynamicForm.controls[dataParams[i].name]?.value + condition + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        break;
                      case '< CURRENT_DATE':
                      case '> CURRENT_DATE':
                        if (dataParams[i].value = "") {

                          let conditionsVar = dataParams[i].condition.split(" ");



                          let field = this.dynamicForm.controls[dataParams[i].field]?.value;
                          let fieldDate = new Date(field);
                          let conditionDate = new Date();
                          if (i == 0) {
                            finalIfConditions = "'" + fieldDate + "'" + conditionsVar[0] + "'" + conditionDate + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                          else {
                            finalIfConditions += "'" + fieldDate + "'" + conditionsVar[0] + "'" + conditionDate + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                        } else {

                          let conditionsVar = dataParams[i].condition.split(" ");
                          let field = this.dynamicForm.controls[dataParams[i].field]?.value;
                          let fieldDate = new Date(field);
                          let conditionDate = new Date();

                          if (conditionsVar[0].includes('<')) {
                            let datedif = conditionDate.getFullYear() - fieldDate.getFullYear();

                            if (i == 0) {
                              finalIfConditions = datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                            }
                            else {
                              finalIfConditions += datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                            }
                          } else {
                            let datedif = fieldDate.getFullYear() - conditionDate.getFullYear();
                            if (datedif < 0) {
                              datedif = -datedif;
                            }
                            if (i == 0) {
                              finalIfConditions = datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                            }
                            else {
                              finalIfConditions += datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                            }
                          }
                        }
                        break;
                      case "Get CURRENT_DATE (Year)":
                        let conditionsVar = condition.split(" ");
                        // let field = $("#field_" + dataParams[i].field).val().toString();
                        let field = this.dynamicForm.controls[dataParams[i].name]?.value;
                        let fieldDate = new Date(field);
                        let conditionDate = new Date();
                        let datedif = fieldDate.getFullYear() - conditionDate.getFullYear();
                        if (i == 0) {
                          finalIfConditions = datedif + '<' + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += datedif + '<' + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        break;
                      default:
                    }
                    //let field = $("#field_" + dataParams[i].field).val().toString();
                    listOfFields.push(dataParams[i].field);
                  }
                  var result;
                  if (included == 'included') {
                    result = valueOfFieldSelected.includes(choosenValue);
                  }
                  else if (included == "!included") {
                    result = !valueOfFieldSelected.includes(choosenValue);
                  }
                  else {
                    result = eval(finalIfConditions);
                  }
                  if (result) {
                    if (action == 'Alert') {
                      this.commonFunctions.alert("alert", alertValueAdv);
                      for (let i = 0; i < listOfFields.length; i++) {
                        this.dynamicForm.controls[listOfFields[i]].setValue('').change();
                      }

                    } else if (action == "Show Field" || action == "Hide Field") {

                      this.dynamicActionsOnChange(action, executeOnFieldAdv);
                    } else if (action == "Show FieldSet" || action == "Hide FieldSet") {
                      this.dynamicActionsOnChange(action, executeOnFieldSetAdv);
                    } else if (action == "Required") {
                      this.dynamicActionsOnChange(action, executeOnFieldAdv);
                    } else if (action == "Optional") {
                      this.dynamicActionsOnChange(action, executeOnFieldAdv);
                    } else if (action == "Read Only") {
                      this.dynamicActionsOnChange(action, executeOnFieldAdv);
                    } else if (action == "Remove Read Only") {
                      this.dynamicActionsOnChange(action, executeOnFieldAdv);
                    } else if (action == "Rename Field") {
                      document.getElementById("lbl_" + executeOnFieldAdv).innerHTML = renameFieldAdv;
                    } else if (action == "Execute Rule Business") {
                      // columnId = -1
                      // this.dynamicDRBOnchange(columnId, ruleIdAdv);
                    } else if (executeAction == "Execute Query") {
                      if (this.dynamicIfCondition(this.dynamicForm.controls[choosenField]?.value, conditionValue, -1, condition)) {
                        // this.dynamicForm.controls[defaultField].setValue(defaultTest);
                        this.handleFormFieldValues(defaultField, defaultTest);
                      }
                    }
                  }
                }
              }
              else {
console.log("ruleID >>>>>>>>>",ruleId);
console.log("ruleData >>>>",ruleData);

                TypeOfAction = ruleData[0].data;
                for (let i = 0; i < ruleData.length; i++) {
                  if (TypeOfAction == 2) {
                    if (ruleData[i].step == 1) {
                      if (ruleData[i].data != "") {

                          let id = ruleData[i].data;
                          let data = this.test.filter((el: any) => {
                            return el.id === ruleData[i].data;
                          });
                          choosenField = data[0].name;
                            if (choosenField == "mat-checkbox") {
                              for (let i = 0; i < this.test.length; i++) {
                                if (id == this.test[i].id) {
                                  choosenField = this.test[i].name;
                                }
                              }
                          }

                      }
                        console.log("choosenField=",choosenField)
                    } else if (ruleData[i].step == 10 && ruleData[i].data != '') {
                      let queryData = ruleData[i].data;

                      let queryResult = queryData == null ? -1 : queryData;
                      let jsonQbe: any[] = [];
                      if (queryResult != -1) {
                        const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + queryResult));
                        const paramNames = await lastValueFrom(paramNamesUrl);

                        jsonQbe.push(
                          {
                            queryId: queryResult,
                            parameters: [
                              {
                                paramName: 'actionType',
                                paramValue: '' + this.actionType + ''
                              },
                              {
                                paramName: 'userId',
                                paramValue: this.userId
                              }
                            ],
                            link: [],
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        )

                        if (paramNames.data.length > 0) {
                          // Filter ROW_ID information to get only the ones for Grid
                          let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                          if (params != undefined) {
                            let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid,button,combo");
                            for (let i = 0; i < filteredParams.length; i++) {
                              for (let j = 0; j < paramNames.data.length; j++) {
                                if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                                  let colName = filteredParams[i].colname;
                                  let colVal = filteredParams[i].colvalue;
                                  jsonQbe.push(
                                    {
                                      queryId: queryResult,
                                      parameters: [
                                        {
                                          paramName: colName,
                                          paramValue: colVal
                                        }
                                      ],
                                      link: this.testLinks,
                                      isHidden: [],
                                      whereCond: this.getWhereCond
                                    }
                                  );
                                }
                              }
                            }
                          }
                        } else {
                          jsonQbe.push(
                            {
                              queryId: queryResult,
                              parameters: [
                                {
                                  paramName: '',
                                  paramValue: ''
                                }
                              ],
                              link: [],
                              isHidden: [],
                              whereCond: this.getWhereCond
                            }
                          );
                        }
                      }
                      const queryUrl = from(axios.post(GlobalConstants.getQbeIdApi + queryResult + "/0", jsonQbe));
                      const queryAdd = await lastValueFrom(queryUrl);
                      executeQuery1 = queryAdd.data[0];
                    }
                  } else {
                    if (ruleData[i].step == 1) {
                      if (ruleData[i].data != "") {
                        let id = ruleData[i].data;
                        let data = this.test.filter((el: any) => {
                          return el.id === ruleData[i].data;
                        });
                        choosenField = data[0].name;
                          if (choosenField == "mat-checkbox") {
                            for (let i = 0; i < this.test.length; i++) {
                              if (id == this.test[i].id) {
                                choosenField = this.test[i].name;
                              }
                            }
                        }
                      }
                    } else if (ruleData[i].step == 2) {
                      if (ruleData[i].data != "") {
                        condition = this.commonFunctions.filterArrayById(this.conditions, ruleData[i].data)[0].name;
                      }
                    } else if (ruleData[i].step == 33) { // in case of coma separated
                      if (ruleData[i].data.indexOf(',') != -1) {
                        conditionValue = '-1';
                        elements = ruleData[i].data.split(',');
                        comboValueField = this.dynamicForm.controls[choosenField]?.value;
                        for (let n = 0; n < elements.length; n++) {
                          if (Number(elements[n]) === Number(comboValueField)) {
                            conditionValue = comboValueField;
                          }
                        }
                      } else {

                        conditionValue = ruleData[i].data;
                      }
                    } else if (ruleData[i].step == 4 && ruleData[i].data != "") {
                      executeAction = this.commonFunctions.filterArrayById(this.executionAction, ruleData[i].data)[0].name;
console.log("executeAction >>>>>>>>>>",executeAction);
                    } else if (ruleData[i].step == 42) {
                      if (ruleData[i].data != "") {
                        // if ($("#field_" + ruleData[i].data)[0]) {
                        //   defaultField = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                        // } else {
                        //   defaultField = $(".field_" + ruleData[i].data).attr("class").split(" ")[0];
                        // }
                          let data = this.test.filter((el: any) => {
                            return el.id === ruleData[i].data;
                          });
                          defaultField = data[0].name;
                      }
                    } else if (ruleData[i].step == 44) {
                      if (executeAction == "Show Field" || executeAction == "Hide Field" || executeAction == "Required" || executeAction == "Optional" || executeAction == "Read Only" || executeAction == "Remove Read Only" || executeAction == "Rename Field" || executeAction == "Show Button" || executeAction == "Hide Button") {
                        executeOnField = ruleData[i].data;
                      }
                      if (executeAction == "Show FieldSet" || executeAction == "Hide FieldSet") {
                        executeOnFieldSet = ruleData[i].data;
                      }
                      if (executeAction == "Execute Query") {
                        executeQuery = ruleData[i].data;
                        const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + executeQuery));
                        const paramNames = await lastValueFrom(paramNamesUrl);

                        let jsonQbe: any[] = [];
                        jsonQbe.push(
                          {
                            queryId: executeQuery,
                            parameters: [
                              {
                                paramName: 'actionType',
                                paramValue: '' + this.actionType + ''
                              },
                              {
                                paramName: 'userId',
                                paramValue: this.userId
                              }
                            ],
                            link: [],
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        )

                        if (paramNames.data.length > 0) {
                          // Filter ROW_ID information to get only the ones for Grid
                          let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                          if (params != undefined) {
                            let filteredParams: any = this.handleSelectedRowIds(params, "grid,form,button");
                            for (let i = 0; i < filteredParams.length; i++) {
                              for (let j = 0; j < paramNames.data.length; j++) {
                                if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                                  let colName = filteredParams[i].colname;
                                  let colVal = filteredParams[i].colvalue;
                                  jsonQbe.push(
                                    {
                                      queryId: executeQuery,
                                      parameters: [
                                        {
                                          paramName: colName,
                                          paramValue: colVal
                                        }
                                      ],
                                      link: [],
                                      isHidden: [],
                                      whereCond: this.getWhereCond
                                    }
                                  );
                                }
                              }
                            }
                          }
                        }
                        else {
                          jsonQbe.push(
                            {
                              queryId: executeQuery,
                              parameters: [
                                {
                                  paramName: '',
                                  paramValue: ''
                                }
                              ],
                              link: [],
                              isHidden: [],
                              whereCond: this.getWhereCond
                            }
                          );
                        }
                        const defaultValueUrl = from(axios.post(GlobalConstants.getQbeIdApi + executeQuery + "/0", this.jsonEmpty));
                        const defaultValuee = await lastValueFrom(defaultValueUrl);
                        queryRes = defaultValuee.data;
                        //hon
                        if (queryRes.toString().toUpperCase() == 'EMPTY') {
                          queryRes = '';
                        } else {
                          queryRes = queryRes;
                        }
                        //jp
                        if (queryRes.length > 1) {
                          let modifiedData = queryRes.map((entry: any) => {
                            return {
                              ID: entry[0],
                              NAME: entry[1]
                            };
                          });
                          queryRes = modifiedData;
                        }
                      }
                    }
                    else if (ruleData[i].step == 6) {
                      renameFieldLoad = ruleData[i].data;
                    } else if (ruleData[i].step == 5) {
                      minusCURRENT_DATE = ruleData[i].data;
                    } else if (ruleData[i].step == 51 && ruleData[i].data != '') {
                      fillintofield = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                    } else if (ruleData[i].step == 52 && ruleData[i].data != '') {
                      choosenField2 = ruleData[i].data;
                    }
                    // else if (ruleData[i].step == 29) {
                    //   if (ruleData[i].data != "") {// + or -
                    //     operator = this.commonFunctions.filterArrayById(this.plusMinusOperator, ruleData[i].data)[0].name
                    //   }
                    // } else if (ruleData[i].step == 30) {
                    //   if (ruleData[i].data != "") {
                    //     operatorOption = ruleData[i].data;
                    //   }
                    // } else if (ruleData[i].step == 301) {
                    //   if (ruleData[i].data != "") {
                    //     operatorQuery = ruleData[i].data;
                    //   }
                    // }
                    else if (ruleData[i].step == 31) {
                      if (ruleData[i].data != "") {
                        valueToOperate = ruleData[i].data;
                        checkedValue = ruleData[i].data;
                      }
                    } else if (ruleData[i].step == 102 && ruleData[i].data != '') {
                      executeAction2 = this.commonFunctions.filterArrayById(this.executionAction, ruleData[i].data)[0].name;
                    }
                    else if (ruleData[i].step == 41 && executeAction2 != "") {
                      executeOnField2 = ruleData[i].data;
                    }
                    else if (ruleData[i].step == 10 && ruleData[i].data != '') {
                      let queryData = ruleData[i].data;

                      let queryResult = queryData == null ? -1 : queryData;
                      let jsonQbe: any[] = [];
                      if (queryResult != -1) {
                        const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + queryResult));
                        const paramNames = await lastValueFrom(paramNamesUrl);

                        jsonQbe.push(
                          {
                            queryId: queryResult,
                            parameters: [
                              {
                                paramName: 'actionType',
                                paramValue: '' + this.actionType + ''
                              },
                              {
                                paramName: 'userId',
                                paramValue: this.userId
                              }
                            ],
                            link: [],
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        )

                        if (paramNames.data.length > 0) {
                          // Filter ROW_ID information to get only the ones for Grid
                          let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                          if (params != undefined) {
                            let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid,button,combo");
                            for (let i = 0; i < filteredParams.length; i++) {
                              for (let j = 0; j < paramNames.data.length; j++) {
                                if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                                  let colName = filteredParams[i].colname;
                                  let colVal = filteredParams[i].colvalue;
                                  jsonQbe.push(
                                    {
                                      queryId: queryResult,
                                      parameters: [
                                        {
                                          paramName: colName,
                                          paramValue: colVal
                                        }
                                      ],
                                      link: this.testLinks,
                                      isHidden: [],
                                      whereCond: this.getWhereCond
                                    }
                                  );
                                }
                              }
                            }
                          }
                        } else {
                          jsonQbe.push(
                            {
                              queryId: queryResult,
                              parameters: [
                                {
                                  paramName: '',
                                  paramValue: ''
                                }
                              ],
                              link: [],
                              isHidden: [],
                              whereCond: this.getWhereCond
                            }
                          );
                        }
                      }
                      const queryUrl = from(axios.post(GlobalConstants.getQbeIdApi + queryResult + "/0", jsonQbe));
                      const queryAdd = await lastValueFrom(queryUrl);
                      executeQuery1 = queryAdd.data[0];
                    }
                  }

                }

                if (ruleAction == "On Load") {
                  // Normal Field Condition
                  if (step0.data == 3) {

                    if (this.dynamicIfCondition(this.getValueOfControlName(choosenField), conditionValue, -1, condition)) {
                      if (executeAction == "Show Field" || executeAction == "Show Button") {
                        this.dynamicActionsOnChange(executeAction, executeOnField);
                      } else if (executeAction == "Hide Field" || executeAction == "Hide Button") {
console.log("Hide Button 1");
                        this.dynamicActionsOnChange(executeAction, executeOnField);
                      } else if (executeAction == "Show FieldSet") {
                        this.dynamicActionsOnChange(executeAction, executeOnFieldSet);
                      } else if (executeAction == "Hide FieldSet") {
                        this.dynamicActionsOnChange(executeAction, executeOnFieldSet);
                      } else if (executeAction == "Required") {
                        this.dynamicActionsOnChange(executeAction, executeOnField);
                      } else if (executeAction == "Optional") {
                        this.dynamicActionsOnChange(executeAction, executeOnField);
                      } else if (executeAction == "Read Only") {
                        if (this.dynamicIfCondition(this.dynamicForm.controls[choosenField]?.value, conditionValue, -1, condition)) {
                          if (executeOnField.length >= 1) {
console.log("executeOnField >>>>>>>>>>",executeOnField);
                            for (let u = 0; u < executeOnField.length; u++) {
                              let fieldId: any;
                              if (executeOnField[u].id) {
                                fieldId = executeOnField[u].id;
                              } else {
                                fieldId = executeOnField[u];
                              }

                              if ($("#field_" + fieldId)[0]) {
                                $("#field_" + fieldId).prop('disabled', true);
                                $("#field_" + fieldId).addClass('disabled-field');
                              } else {
                                $(".field_" + fieldId).addClass('disabled-field');
                                $(".field_" + fieldId).css("pointer-events", "none");
                              }
                            }
                          } else {
                            let fieldId: any;
                            if (executeOnField[0].id) {
                              fieldId = executeOnField[0].id;
                            } else {
                              fieldId = executeOnField[0];
                            }

                            if ($("#field_" + fieldId)) {
                              $("#field_" + fieldId).addClass('disabled-field');
                            } else {
                              $(".field_" + fieldId).addClass('disabled-field');
                              $(".field_" + fieldId).css("pointer-events", "none");
                            }
                          }
                        }
                      } else if (executeAction == "Remove Read Only") {


                        if (this.dynamicIfCondition(this.dynamicForm.controls[choosenField]?.value, conditionValue, -1, condition)) {
                          if (executeOnField.length >= 1) {
                            for (let u = 0; u < executeOnField.length; u++) {
                              let fieldId: any;
                              if (executeOnField[u].id) {
                                fieldId = executeOnField[u].id;
                              } else {
                                fieldId = executeOnField[u];
                              }




                              if ($("#field_" + fieldId)[0]) {

                                for (let c = 0; c < this.test.length; c++) {
                                  if (this.test[c].id === fieldId && this.test[c].columnType == "lookup") {
                                    this.test[c].qbeReadOnly = false;
                                    $('#' + this.test[c].name + "_lookupName").prop("readonly", false);
                                    $('#' + this.test[c].name).prop("readonly", false);


                                    break;
                                  }
                                }
                                $("#field_" + fieldId).prop('disabled', false);
                                $("#field_" + fieldId).removeClass('disabled-field');
                              } else {
                                $(".field_" + fieldId).removeClass('disabled-field');
                                $(".field_" + fieldId).css("pointer-events", "all");
                              }
                            }
                          } else {

                            let fieldId: any;
                            if (executeOnField[0].id) {
                              fieldId = executeOnField[0].id;
                            } else {
                              fieldId = executeOnField[0];
                            }

                            if ($("#field_" + fieldId)) {
                              for (let c = 0; c < this.test.length; c++) {
                                if (this.test[c].id === fieldId && this.test[c].columnType == "lookup") {
                                  this.test[c].qbeReadOnly = false;
                                  $('#' + this.test[c].name + "_lookupName").prop("readonly", false);
                                  $('#' + this.test[c].name).prop("readonly", false);


                                  break;
                                }
                              }
                              $("#field_" + fieldId).prop('disabled', false);
                              $("#field_" + fieldId).removeClass('disabled-field');
                            } else {
                              $(".field_" + fieldId).removeClass('disabled-field');
                              $(".field_" + fieldId).css("pointer-events", "all");
                            }
                          }
                        }
                      }
                      else if (executeAction == "Rename Field") {

                        document.getElementById("lbl_" + executeOnField).innerHTML = renameFieldLoad;
                      }
                      else if (executeAction == "Execute Query") {
                        let element = this.test.filter((el: any) => {
                          return defaultField === el.name;
                        });
                        if (element[0].columnType) {
                          if (element[0].columnType == "combo") {
                            for (let i = 0; i < this.test.length; i++) {
                              if (this.test[i].name == defaultField) {
                                this.test[i].query = queryRes;
                              }
                            }
                          } else {
                            this.dynamicForm.controls[defaultField].setValue(queryRes);
                          }
                        }
                      }
                    }
                  }
                  if (TypeOfAction == 2) {
                    this.dynamicForm.controls[choosenField]?.setValue(executeQuery1);
                  }
                  if (condition == 'Fill Into') { }

                  if (executeAction2 == "Hide Field" || executeAction2 == "Read Only" || executeAction2 == "Required" || executeAction2 == "Optional" || executeAction2 == "Remove Read Only" || executeAction2 == "Rename Field" || executeAction2 == "Show Button" || executeAction2 == "Hide Button") {
                    if (executeQuery1 == checkedValue) {
                      this.dynamicActionsOnChange(executeAction2, executeOnField2);
                    }

                  }
                }
              }
            } else {
            }
          }
          this.loaderService.isLoading.next(false);
        }
      }
    } catch (error) {
      console.log("dynamicDRBOnload error >>> ", error)
    }
  }

  async dynamicDRBOnchange(columnId: number, ruleId: number) {
    try {
      let url = '';
      if (columnId != -1 && ruleId == -1) {
        url = GlobalConstants.getDBRGridByRuleActionAndColumnId + this.objectId + "/1" + "/" + columnId;
      }
      if (columnId == -1 && ruleId != -1) {
        url = GlobalConstants.getDBRGridByRuleActionAndRuleIdApi + this.objectId + "/1" + "/" + ruleId;
      }
      const onChangeUrlApi = from(axios.post(url));
      const onChangeUrl = await lastValueFrom(onChangeUrlApi);

      if (onChangeUrl.data.length > 0) {
        for (let j = 0; j < onChangeUrl.data.length; j++) {
          let ruleAction = this.commonFunctions.filterArrayById(this.ruleAction, onChangeUrl.data[j].ruleAction)[0].name;
          let choosenField: any;
          let checkBoxName: any;
          let comparedField;
          let comparedToField;
          let condition;
          let dateCondition;
          let betweendate1;
          let betweendate2;
          //let conditionValue: string = '';
          let conditionValue: [];
          let executeAction;
          let executeOnField: any;
          let executeRuleBusiness: any;
          let executeQuery;
          let fieldToFillIn: any;
          let fieldToFillInOrder: any;
          let executeOnFieldSet: any;
          let typeOfDifference: any;
          let operations: any;
          let Difference: any;
          let dateTypes: any;
          let fieldValue;
          let actionDecisions;
          let alertValue;
          let ruleData = JSON.parse(onChangeUrl.data[j].ruleData);
          let elements: string[];
          let comboValueField: any;
          let defaultField: any;
          let renameField: any;
          let hasAdvanced = JSON.parse(onChangeUrl.data[j].hasAdvancedConditions);
          let dataParams = [];
          let finalIfConditions: any;
          let Rule: any;
          let action: any;
          let executeOnFieldAdv: any;
          let executeOnFieldSetAdv: any;
          let ruleIdAdv: any;
          let alertValueAdv: any;
          let renameFieldAdv: any;
          let listOfFields: any = [];
          let procName: any;
          let procParams: any = [];
          let minusCURRENT_DATE: any;
          let operator: any;
          let operatorOption: any;

          let typeOfFillInto: any;
          let fillIntoChoosen: any;
          let queryRes: any;
          let testId: any;
          let valueToOperate: any;
          let operatorQuery: any;
          let included: any = '';
          let valueOfFieldSelected: any;
          let choosenValue: any;
          let isExcluded = JSON.parse(onChangeUrl.data[j].isExcluded);


          // 1 => saveNew and 2=> Update
          let actionType;
          if (JSON.parse(onChangeUrl.data[j].actionType) == 1) {
            actionType = "saveNew";
          }
          else if (JSON.parse(onChangeUrl.data[j].actionType) == 2) {
            actionType = "update";
          }
          if (isExcluded != 1) {
            if (actionType == this.actionType) {
              if (hasAdvanced == 1) {
                for (let i = 0; i < ruleData.length; i++) {
                  if (ruleData[i].step == 0) {
                    Rule = ruleData[i].data;
                  }
                  if (ruleData[i].step == 4 && ruleData[i].data != "") {
                    action = this.commonFunctions.filterArrayById(this.executionAction, ruleData[i].data)[0].name;
                  }
                  if (ruleData[i].step == 42 && ruleData[i].data != "") {
                    let data = this.test.filter((el: any) => {
                      return el.id === ruleData[i].data;
                    });
                    defaultField = data[0].name;
                  }

                  if (ruleData[i].step == 44) {
                    if (action == "Show Field" || action == "Hide Field" || action == "Required" || action == "Optional" || action == "Read Only" || action == "Remove Read Only" || action == "Rename Field" || action == "Hide Button" || action == "Show Button") {
                      executeOnFieldAdv = ruleData[i].data;
                    }
                    else if (action == "Show FieldSet" || action == "Hide FieldSet") {
                      executeOnFieldSetAdv = ruleData[i].data;
                    }
                    else if (action == "Execute Rule Business") {
                      executeRuleBusiness = ruleData[i].data;
                      ruleIdAdv = executeRuleBusiness;
                    }
                    else if (action == "Execute Query") {
                      executeQuery = ruleData[i].data;
                      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + executeQuery));
                      const paramNames = await lastValueFrom(paramNamesUrl);

                      let jsonQbe: any[] = [];
                      jsonQbe.push(
                        {
                          queryId: executeQuery,
                          parameters: [
                            {
                              paramName: 'actionType',
                              paramValue: '' + this.actionType + ''
                            },
                            {
                              paramName: 'userId',
                              paramValue: this.userId
                            }
                          ],
                          link: [],
                          isHidden: [],
                          whereCond: this.getWhereCond
                        }
                      )

                      if (paramNames.data.length > 0) {
                        // Filter ROW_ID information to get only the ones for Grid
                        let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                        if (params != undefined) {
                          let filteredParams: any = this.handleSelectedRowIds(params, "grid,form,button");
                          for (let i = 0; i < filteredParams.length; i++) {
                            for (let j = 0; j < paramNames.data.length; j++) {
                              if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                                let colName = filteredParams[i].colname;
                                let colVal = filteredParams[i].colvalue;
                                jsonQbe.push(
                                  {
                                    queryId: executeQuery,
                                    parameters: [
                                      {
                                        paramName: colName,
                                        paramValue: colVal
                                      }
                                    ],
                                    link: [],
                                    isHidden: [],
                                    whereCond: this.getWhereCond
                                  }
                                );
                              }
                            }
                          }
                        }
                      }
                      else {
                        jsonQbe.push(
                          {
                            queryId: executeQuery,
                            parameters: [
                              {
                                paramName: '',
                                paramValue: ''
                              }
                            ],
                            link: [],
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        );
                      }
                      const defaultValueUrl = from(axios.post(GlobalConstants.getQbeIdApi + executeQuery + "/0", jsonQbe));
                      const defaultValuee = await lastValueFrom(defaultValueUrl);
                      queryRes = defaultValuee.data;

                      if (queryRes.toString().toUpperCase() == 'EMPTY') {
                        queryRes = '';
                      } else {
                        queryRes = queryRes;
                      }
                      if (queryRes.length > 0) {
                        let modifiedData = queryRes.map((entry: any) => {
                          return {
                            ID: entry[0],
                            NAME: entry[1]
                          };
                        });
                        queryRes = modifiedData;
                      }

                    }
                    else if (action == "Alert") {
                      alertValueAdv = ruleData[i].data;
                    }
                  }
                  else if (ruleData[i].step == 6) {
                    renameFieldAdv = ruleData[i].data;
                  }
                }
                const jsonObject = JSON.parse(Rule);
                const addList = jsonObject.addList;
                let secondList = JSON.stringify(addList);
                let Object = JSON.parse(secondList);

                for (let i = 0; i < Object.length; i++) {
                  let beginCondition = '';
                  let field = '';
                  let condition = '';
                  let value = '';
                  let endCondition = '';
                  let operator = '';
                  if (Object[i].beginCondition == undefined) {
                    beginCondition = '';
                  }
                  else if (Object[i].beginCondition != undefined) {
                    beginCondition = Object[i].beginCondition.name;
                  }
                  if (Object[i].field == undefined) {
                    field = '';
                  }
                  else if (Object[i].field != undefined) {
                    field = Object[i].field.name;
                  }
                  if (Object[i].condition == undefined) {
                    condition = '';
                  }
                  else if (Object[i].condition != undefined) {
                    condition = Object[i].condition.name;
                  }
                  if (Object[i].value == undefined) {
                    value = '';
                  }
                  else if (Object[i].value != undefined) {
                    value = Object[i].value;
                  }
                  if (Object[i].endCondition == undefined) {
                    endCondition = '';
                  }
                  else if (Object[i].endCondition != undefined) {
                    endCondition = Object[i].endCondition.name;
                  }
                  if (Object[i].operator == undefined) {
                    operator = '';
                  }
                  else if (Object[i].operator != undefined) {
                    operator = Object[i].operator.name;
                  }
                  let item = {
                    "beginCondition": beginCondition,
                    "field": field,
                    "condition": condition,
                    "value": value,
                    "endCondition": endCondition,
                    "operator": operator
                  }
                  dataParams.push(item);
                }
                for (let i = 0; i < dataParams.length; i++) {
                  let val = dataParams[i].value;
                  // let condition = '';
                  switch (dataParams[i].condition) {
                    case '=':
                      condition = "==";
                      if (i == 0) {
                        finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case 'included':
                      condition = "included";
                      included = condition;
                      valueOfFieldSelected = this.dynamicForm.controls[dataParams[i].field]?.value;
                      choosenValue = dataParams[i].value;
                      if (i == 0) {
                        finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case '!included':
                      condition = "!included";
                      included = condition;
                      valueOfFieldSelected = this.dynamicForm.controls[dataParams[i].field]?.value;
                      choosenValue = dataParams[i].value;
                      if (i == 0) {
                        finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case '!=':
                      condition = dataParams[i].condition;
                      if (i == 0) {
                        finalIfConditions = "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += "'" + this.dynamicForm.controls[dataParams[i].field]?.value + "'" + condition + "'" + dataParams[i].value + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case '<':
                    case '>':
                    case '>=':
                    case '<=':
                      condition = dataParams[i].condition;
                      if (i == 0) {
                        finalIfConditions = this.dynamicForm.controls[dataParams[i].field]?.value + condition + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += this.dynamicForm.controls[dataParams[i].field]?.value + condition + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      break;
                    case '< CURRENT_DATE':
                    case '> CURRENT_DATE':
                      if (dataParams[i].value = "") {

                        let conditionsVar = dataParams[i].condition.split(" ");



                        let field = this.dynamicForm.controls[dataParams[i].field]?.value;
                        let fieldDate = new Date(field);
                        let conditionDate = new Date();
                        if (i == 0) {
                          finalIfConditions = "'" + fieldDate + "'" + conditionsVar[0] + "'" + conditionDate + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                        else {
                          finalIfConditions += "'" + fieldDate + "'" + conditionsVar[0] + "'" + conditionDate + "'" + this.DynamicAdvancedOperator(dataParams[i].operator);
                        }
                      } else {
                        let conditionsVar = dataParams[i].condition.split(" ");
                        let field = this.dynamicForm.controls[dataParams[i].field]?.value;
                        let fieldDate = new Date(field);

                        let conditionDate = new Date();

                        if (conditionsVar[0].includes('<')) {
                          let datedif = conditionDate.getFullYear() - fieldDate.getFullYear();

                          if (i == 0) {
                            finalIfConditions = datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);

                          }
                          else {
                            finalIfConditions += datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                        } else {
                          let datedif = fieldDate.getFullYear() - conditionDate.getFullYear();
                          if (datedif < 0) {
                            datedif = -datedif;
                          }
                          if (i == 0) {
                            finalIfConditions = datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                          else {
                            finalIfConditions += datedif + conditionsVar[0] + val + " " + this.DynamicAdvancedOperator(dataParams[i].operator);
                          }
                        }
                      }
                      break;
                    case "Get CURRENT_DATE (Year)":
                      let conditionsVar = condition.split(" ");
                      let field = $("#field_" + dataParams[i].field).val().toString();
                      let fieldDate = new Date(field);
                      let conditionDate = new Date();
                      // if (conditionsVar[0].includes('<')) {
                      //   let datedif = conditionDate.getFullYear() - fieldDate.getFullYear();
                      //   if (i == 0) {
                      //     finalIfConditions = datedif + conditionsVar[0] + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      //   }
                      //   else {
                      //     finalIfConditions += datedif + conditionsVar[0] + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      //   }
                      // } else {
                      let datedif = fieldDate.getFullYear() - conditionDate.getFullYear();
                      if (i == 0) {
                        finalIfConditions = datedif + '<' + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      else {
                        finalIfConditions += datedif + '<' + dataParams[i].value + this.DynamicAdvancedOperator(dataParams[i].operator);
                      }
                      //    }
                      break;
                    default:
                  }
                  listOfFields.push(dataParams[i].field);
                }
                var result;
                if (included == 'included') {
                  result = valueOfFieldSelected.includes(choosenValue);
                }
                else if (included == "!included") {
                  result = !valueOfFieldSelected.includes(choosenValue);
                }
                else {
                  result = eval(finalIfConditions);
                }

                if (result) {
                  if (action == 'Alert') {
                    this.commonFunctions.alert("alert", alertValueAdv);
                    for (let i = 0; i < listOfFields.length; i++) {
                      this.dynamicForm.controls[listOfFields[i]].setValue('').change();
                    }
                  } else if (action == "Show Field" || action == "Hide Field" || action == "Hide Button" || action == "Show Button") {
console.log("Hide Button 2");
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Show FieldSet" || action == "Hide FieldSet") {
                    this.dynamicActionsOnChange(action, executeOnFieldSetAdv);
                  } else if (action == "Required") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Optional") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Read Only") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Remove Read Only") {
                    this.dynamicActionsOnChange(action, executeOnFieldAdv);
                  } else if (action == "Rename Field") {
                    document.getElementById("lbl_" + executeOnFieldAdv).innerHTML = renameFieldAdv;
                  } else if (action == "Execute Rule Business") {
                    columnId = -1
                    this.dynamicDRBOnchange(columnId, ruleIdAdv);
                  } else if (action == "Execute Query") {
                    this.handleFormFieldValues(defaultField, queryRes);
                  }
                }
              } else {

console.log("ruleData >>>>>>>>",ruleData);
                for (let i = 0; i < ruleData.length; i++) {
                  if (ruleData[i].step == 0) {
                    if (ruleData[i].data != "") {
                    }
                  }
                  else if (ruleData[i].step == 1) {
                    if (ruleData[i].data != "") {
                      let id = ruleData[i].data;
                      let data = this.test.filter((el: any) => {
                        return el.id === ruleData[i].data;
                      });
                      choosenField = data[0].name;
                        if (choosenField == "mat-checkbox") {
                          for (let i = 0; i < this.test.length; i++) {
                            if (id == this.test[i].id) {
                              choosenField = this.test[i].name;
                            }
                          }
                      }

                    }
console.log("choosenField=",choosenField);
                  } else if (ruleData[i].step == 2) {
                    if (ruleData[i].data != "") {
                      condition = this.commonFunctions.filterArrayById(this.conditions, ruleData[i].data)[0].name;
                    }
console.log("condition=",condition);
                  } else if (ruleData[i].step == 3) {
                    if (ruleData[i].data != "") {  // this.executionAction
                      actionDecisions = this.commonFunctions.filterArrayById(this.valueSource, ruleData[i].data)[0].name;
                    }
                  } else if (ruleData[i].step == 20) {
                    if (ruleData[i].data != "") {
                      dateTypes = this.commonFunctions.filterArrayById(this.dateTypes, ruleData[i].data)[0].name;
                    }
console.log("dateTypes=",dateTypes);
                  } else if (ruleData[i].step == 200) {
                    if (ruleData[i].data != "") {
                      // fieldValue = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      if ($("#field_" + ruleData[i].data)[0]) {
                        fieldValue = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      } else {
                        fieldValue = $(".field_" + ruleData[i].data).attr("class").split(" ")[0];
                      }
                    }
                  } else if (ruleData[i].step == 201) {
                    if (ruleData[i].data != "") {
                      let data = this.test.filter((el: any) => {
                          return el.id === ruleData[i].data;
                        });
                        comparedField = data[0].name;
                      // comparedField = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      // if ($("#field_" + ruleData[i].data)[0]) {
                      //   let id = ruleData[i].data;
                      //   let data = this.test.filter((el: any) => {
                      //     return el.id === ruleData[i].data;
                      //   });
                      //   comparedField = data[0].name;
                      //   // comparedField = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      // } else {
                      //   comparedField
                      //   comparedField = $(".field_" + ruleData[i].data).attr("class").split(" ")[0];
                      // }
                    }
console.log("comparedField =",comparedField);
                  } else if (ruleData[i].step == 202) {
                    if (ruleData[i].data != "") {
                      // comparedToField = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      if ($("#field_" + ruleData[i].data)[0]) {
                        comparedToField = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      } else {
                        comparedToField = $(".field_" + ruleData[i].data).attr("class").split(" ")[0];
                      }
                    }
                  } else if (ruleData[i].step == 21) {
                    if (ruleData[i].data != "") {
                      dateCondition = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 203 && ruleData[i].data != '') {
                    let queryData = ruleData[i].data;
                    let queryResult = queryData == null ? -1 : queryData;
                    let jsonQbe: any[] = [];
                    if (queryResult != -1) {
                      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + queryResult));
                      const paramNames = await lastValueFrom(paramNamesUrl);

                      jsonQbe.push(
                        {
                          queryId: queryResult,
                          parameters: [
                            {
                              paramName: 'actionType',
                              paramValue: '' + this.actionType + ''
                            },
                            {
                              paramName: 'userId',
                              paramValue: this.userId
                            }
                          ],
                          link: [],
                          isHidden: [],
                          whereCond: this.getWhereCond
                        }
                      )

                      if (paramNames.data.length > 0) {
                        // Filter ROW_ID information to get only the ones for Grid
                        let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                        if (params != undefined) {
                          let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid,button,combo");
                          for (let i = 0; i < filteredParams.length; i++) {
                            for (let j = 0; j < paramNames.data.length; j++) {
                              if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                                let colName = filteredParams[i].colname;
                                let colVal = filteredParams[i].colvalue;
                                jsonQbe.push(
                                  {
                                    queryId: queryResult,
                                    parameters: [
                                      {
                                        paramName: colName,
                                        paramValue: colVal
                                      }
                                    ],
                                    link: this.testLinks,
                                    isHidden: [],
                                    whereCond: this.getWhereCond
                                  }
                                );
                              }
                            }
                          }
                        }
                      } else {
                        jsonQbe.push(
                          {
                            queryId: queryResult,
                            parameters: [
                              {
                                paramName: '',
                                paramValue: ''
                              }
                            ],
                            link: [],
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        );
                      }
                    }
                    const queryUrl = from(axios.post(GlobalConstants.getQbeIdApi + queryResult + "/0", jsonQbe));
                    const queryAdd = await lastValueFrom(queryUrl);
                    executeQuery = queryAdd.data[0];
                  } else if (ruleData[i].step == 22) {
                    if (ruleData[i].data != "") {
                      betweendate1 = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 23) {
                    if (ruleData[i].data != "") {
                      betweendate2 = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 24) {
                    if (ruleData[i].data != "") {
                      // fieldToFillIn = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      if ($("#field_" + ruleData[i].data)[0]) {
                        fieldToFillIn = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                        console.log("fieldToFillIn >>>",fieldToFillIn);
                      } else {
                        fieldToFillIn = $(".field_" + ruleData[i].data).attr("class").split(" ")[0];
                      }
                    }
                  } else if (ruleData[i].step == 26) {
                    if (ruleData[i].data != "") {
                      if ($("#field_" + ruleData[i].data)[0]) {
                        fillIntoChoosen = $("#field_" + ruleData[i].data).attr("class").split(" ")[0];
                      } else {
                        fillIntoChoosen = $(".field_" + ruleData[i].data).attr("class").split(" ")[0];
                      }
                    }
                  } else if (ruleData[i].step == 25) {
                    if (ruleData[i].data != "") {
                      fieldToFillInOrder = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 28) {
                    if (ruleData[i].data != "") {
                      typeOfFillInto = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 27) {
                    if (ruleData[i].data != "") {
                      minusCURRENT_DATE = ruleData[i].data;

                    }
                  }
                  else if (ruleData[i].step == 29) {
                    if (ruleData[i].data != "") {// + or -
                      operator = this.commonFunctions.filterArrayById(this.plusMinusOperator, ruleData[i].data)[0].name
                    }
                  } else if (ruleData[i].step == 30) {
                    if (ruleData[i].data != "") {
                      operatorOption = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 301) {
                    if (ruleData[i].data != "") {
                      operatorQuery = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 31) {
                    if (ruleData[i].data != "") {
                      valueToOperate = ruleData[i].data;
console.log("valueToOperate=",valueToOperate);
                    }
                  } else if (ruleData[i].step == 210) {
                    if (ruleData[i].data != "") {
                      operations = this.commonFunctions.filterArrayById(this.operations, ruleData[i].data)[0].name;
                    }
                  } else if (ruleData[i].step == 211) {
                    if (ruleData[i].data != "") {
                      typeOfDifference = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 212) {
                    if (ruleData[i].data != "") {
                      Difference = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 33) {
                    //COMMENTED BY ELIE

                    // in case of coma separated
                    if (ruleData[i].data != "") {
                      if (ruleData[i].data.indexOf(',') != -1) {
                        if (fieldValue != null) {
                          elements = ruleData[i].data.split(',');
                          comboValueField = this.dynamicForm.controls[fieldValue]?.value;

                          for (let n = 0; n < elements.length; n++) {
                            if (Number(elements[n]) === Number(comboValueField)) {
                              conditionValue = comboValueField;
                            }
                          }
                        } else {
                          elements = ruleData[i].data.split(',');
                          comboValueField = this.dynamicForm.controls[choosenField]?.value;
                          for (let n = 0; n < elements.length; n++) {
                            if (Number(elements[n]) === Number(comboValueField)) {
                              conditionValue = comboValueField;
                            }
                          }
                        }

                      } else {
                        conditionValue = ruleData[i].data;
                      }

                    } else {
                      conditionValue = ruleData[i].data;
                    }
console.log("conditionValue=",conditionValue);
                  } else if (ruleData[i].step == 42) {
                    if (ruleData[i].data != "") {
                      // testId = ruleData[i].data;
                      // let data = this.test.filter((el: any) => {
                      //   return el.id === ruleData[i].data;
                      // });
                      // defaultField = data[0].name;
                      // console.log("defaultField=",defaultField);


                      //jppppppppppp
                      let testIds = Array.isArray(ruleData[i].data) ? ruleData[i].data : [ruleData[i].data];
                    
                      let data = this.test.filter((el: any) => {
                        return testIds.includes(el.id);
                      });
                    
                      let defaultFields = data.map(el => el.name);
                    
                      defaultField = defaultFields.join(', ');
                                        
                    }
                  } else if (ruleData[i].step == 4 && ruleData[i].data != "") {
                    executeAction = this.commonFunctions.filterArrayById(this.executionAction, ruleData[i].data)[0].name;
                  } else if (ruleData[i].step == 44) {
console.log("executeAction=",executeAction);
                    if (ruleData[i].data != "") {
                      if (executeAction == "Show Field" || executeAction == "Hide Field" || executeAction == "Required" || executeAction == "Optional" || executeAction == "Read Only" || executeAction == "Remove Read Only" || executeAction == "Rename Field" || executeAction == "Hide Button" || executeAction == "Show Button") {
                        executeOnField = ruleData[i].data;
                      }
                    }
                    if (executeAction == "Show FieldSet" || executeAction == "Hide FieldSet") {
                      executeOnFieldSet = ruleData[i].data;
                    }
                    if (executeAction == "Execute Rule Business") {
                      executeRuleBusiness = ruleData[i].data;
                      ruleId = executeRuleBusiness;
                    }
                    if (executeAction == "Execute Query") {
                      executeQuery = ruleData[i].data;
                      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + executeQuery));
                      const paramNames = await lastValueFrom(paramNamesUrl);

                      let jsonQbe: any[] = [];
                      jsonQbe.push(
                        {
                          queryId: executeQuery,
                          parameters: [
                            {
                              paramName: 'actionType',
                              paramValue: '' + this.actionType + ''
                            },
                            {
                              paramName: 'userId',
                              paramValue: this.userId
                            }
                          ],
                          link: [],
                          isHidden: [],
                          whereCond: this.getWhereCond
                        }
                      )

                      if (paramNames.data.length > 0) {
                        // Filter ROW_ID information to get only the ones for Grid
                        let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                        if (params != undefined) {
                          let filteredParams: any = this.handleSelectedRowIds(params, "grid,form,button");
                          for (let i = 0; i < filteredParams.length; i++) {
                            for (let j = 0; j < paramNames.data.length; j++) {
                              if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                                let colName = filteredParams[i].colname;
                                let colVal = filteredParams[i].colvalue;
                                jsonQbe.push(
                                  {
                                    queryId: executeQuery,
                                    parameters: [
                                      {
                                        paramName: colName,
                                        paramValue: colVal
                                      }
                                    ],
                                    link: [],
                                    isHidden: [],
                                    whereCond: this.getWhereCond
                                  }
                                );
                              }
                            }
                          }
                        }
                      }
                      else {
                        jsonQbe.push(
                          {
                            queryId: executeQuery,
                            parameters: [
                              {
                                paramName: '',
                                paramValue: ''
                              }
                            ],
                            link: [],
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        );
                      }
                      const defaultValueUrl = from(axios.post(GlobalConstants.getQbeIdApi + executeQuery + "/0", jsonQbe));
                      const defaultValuee = await lastValueFrom(defaultValueUrl);
                      // $("#field_" + defaultField).val(defaultValuee.data[0]);
                      //  queryRes = defaultValuee.data[0];
                      queryRes = defaultValuee.data;
                      if (queryRes.toString().toUpperCase() == 'EMPTY') {

                        queryRes = '';
                      } else {
                        queryRes = queryRes;
                      }
                      //jp
                      if (queryRes.length > 1) {
                        let modifiedData = queryRes.map((entry: any) => {
                          return {
                            ID: entry[0],
                            NAME: entry[1]
                          };
                        });
                        queryRes = modifiedData;
                      }
console.log("queryRes ===",queryRes)
                    }
                    if (executeAction == "Alert") {
                      alertValue = ruleData[i].data;
                    }
                  } else if (ruleData[i].step == 6) {
                    renameField = ruleData[i].data;
                  }
                  else if (ruleData[i].step == 43) {
                    //procName
                    procName = ruleData[i].data;
                  }
                  else if (ruleData[i].step == 430) {
                    //parameters
                    procParams = ruleData[i].data;
                  }
                }
              }
console.log("ruleAction >>>>>>>=",ruleAction)
              if (ruleAction == "On Change") {
                if (condition == '=' || condition == '!=') {
                  if (dateTypes == 'Value' && condition != 'between') {
                    if (executeAction == "Alert") {
                      let choosenFieldValue = this.dynamicForm.controls[choosenField]?.value;
                      if (this.dynamicIfCondition(conditionValue, choosenFieldValue, -1, condition)) {
                        this.commonFunctions.alert("alert", alertValue);
                        // this.dynamicForm.controls[choosenFieldValue].setValue('');
                        this.handleFormFieldValues(choosenFieldValue, "");
                      }
                    }
                    else if (executeAction == 'Execute Query') {
                      for (let c = 0; c < this.test.length; c++) {
                        console.log('default field -----123---->',defaultField);
                        // if (this.test[c].name == defaultField && this.test[c].columnType == "lookup") {
                        //   $('#' + this.test[c].name).val(queryRes);
                        //   $('#' + this.test[c].name + "_lookupName").val(queryRes);
                        //   break;
                        // }
                        //jppppppppppp
                        if (defaultField.includes(this.test[c].name) && this.test[c].columnType == "lookup") {
                          $('#' + this.test[c].name).val(queryRes);
                          $('#' + this.test[c].name + "_lookupName").val(queryRes);
                          break;
                        }
                      }

                      let choosenFieldValue: any = this.dynamicForm.controls[choosenField]?.value;
                      console.log("choosenFieldValue----------->",choosenFieldValue)
                      //JANA AND RONY
                      if (this.dynamicIfCondition(conditionValue, choosenFieldValue, -1, condition)) {
                      //change here---> (change data of the dropdown):
                      let data = this.test.filter((el: any) => {
                        return el.name === defaultField;
                      });

                     if(queryRes.length == 1){
                      this.handleFormFieldValues(defaultField,queryRes);
                     }else{
                      this.dynamicForm.removeControl(defaultField);
                      this.dynamicForm.addControl(defaultField, new FormControl(''));
                      data[0].query = [];
                      this.cdr.detectChanges();
                      data[0].query = queryRes;
                      this.dynamicForm.controls[defaultField].setValue('');

                     }



                      }
                    }
                    else if (executeAction == 'Splash') {
                      let allParameters: any;
                      let sessionId;
                      let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                      let filteredParams: any = this.handleSelectedRowIds(params, "combo,grid");
                      //Get the SessionId :
                      for (let i = 0; i < filteredParams.length; i++) {
                        if (filteredParams[i].colname == 'session_id') {
                          sessionId = filteredParams[i].colvalue;
                        }
                      }
                      for (let i = 0; i < procParams.length; i++) {
                        let formControlName = $("#field_" + procParams[i]).attr("class").split(" ")[0];
                        if (i == 0) {
                          if (formControlName.toLocaleUpperCase() == "SESSION_ID") {
                            allParameters = formControlName + "/" + sessionId;
                          } else {
                            allParameters = formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                          }
                        } else {
                          if (formControlName.toLocaleUpperCase() == "SESSION_ID") {
                            allParameters = formControlName + "/" + sessionId;
                          } else {
                            allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                          }
                        }
                      }

                      // allParameters = "SESSION_ID/" + sessionId ;
                      // procName = procName.replace("SSDX_ENG.", "")
                      let jsonArr = {
                        "procParam": allParameters,
                        "procedureName": procName,
                        "executedBy": "1"
                      };
                      //Api to call Proc
                      const callApiUrl = from(axios.post(GlobalConstants.callProcedure, jsonArr));
                      const callApi = await lastValueFrom(callApiUrl);

                      //open a dialog
                      const dialogRef = this.dialog.open(VRejectedComponent, {
                        disableClose: true,
                        width: "80%",
                        height: "80%",
                        data: "Rejected"
                      });
                    }

                  } else if (dateTypes == 'Field Value' && condition != 'between') {
                    if (executeAction == "Alert") {

                      let choosenFieldValue = this.dynamicForm.controls[choosenField]?.value
                      let comparedValue = this.dynamicForm.controls[comparedField]?.value

                      if (this.dynamicIfCondition(choosenFieldValue, comparedValue, -1, condition)) {
                        this.commonFunctions.alert("alert", alertValue);
                        // this.dynamicForm.controls[choosenFieldValue].setValue('');
                        this.handleFormFieldValues(choosenField, "");
                      }
                    }
                    //rony empty dropdown
                    if(executeAction == "Execute Query"){
                      let choosenFieldValue = this.dynamicForm.controls[choosenField]?.value;
                      let comparedValue = this.dynamicForm.controls[comparedField]?.value;
                      if (this.dynamicIfCondition(choosenFieldValue, comparedValue, -1, condition)) {
                        this.handleFormFieldValues(choosenField, queryRes);
                      }
                    }
                  } else if (dateTypes == 'Execute Query' && condition != 'between') {
                    if (executeAction == "Alert") {
                      let choosenFieldValue = this.dynamicForm.controls[choosenField]?.value;
                      //check if comma
                      let stringArray: any[] = [];
                      if (executeQuery.includes(',')) {
                        stringArray = executeQuery.split(',').map((item: any) => item.trim());
                        let filteredArr = stringArray.filter((el: any) => {
                          return el === choosenFieldValue;
                        });
                        if (filteredArr.length > 0) {
                          this.commonFunctions.alert("alert", alertValue);
                          // this.dynamicForm.controls[choosenFieldValue].setValue('');
                          this.handleFormFieldValues(choosenField, "");
                        }
                      } else {
                        if (this.dynamicIfCondition(executeQuery, choosenFieldValue, -1, condition)) {
                          this.commonFunctions.alert("alert", alertValue);
                          // this.dynamicForm.controls[choosenFieldValue].setValue('');
                          this.handleFormFieldValues(choosenField, "");
                        }
                      }

                    }
                  }
                  if (this.dynamicIfCondition(this.getValueOfControlName(choosenField), conditionValue, -1, condition)) {
                    // to remove disabled the field before the condition of disabled
                    if (executeOnField != null) {
                      if (executeOnField.length > 1) {
                        for (let u = 0; u < executeOnField.length; u++) {

                          let fieldId: any;
                          if (executeOnField[u].id) {
                            fieldId = executeOnField[u].id;
                          } else {
                            fieldId = executeOnField[u];
                          }

                          if ($("#field_" + fieldId)[0]) {
                            $("#field_" + fieldId).prop('disabled', false);
                            $("#field_" + fieldId).removeClass('disabled-field');
                          } else {
                            $("#field_" + fieldId).css("pointer-event", "all");
                            $("#field_" + fieldId).removeClass('disabled-field');
                          }
                        }
                      } else {

                        let fieldId: any;
                        if (executeOnField[0].id) {
                          fieldId = executeOnField[0].id;
                        } else {
                          fieldId = executeOnField[0];
                        }

                        if ($("#field_" + fieldId)) {
                          $("#field_" + fieldId).prop('disabled', false);
                          $("#field_" + fieldId).removeClass('disabled-field');
                        } else {
                          $("#field_" + fieldId).css("pointer-event", "all");
                          $("#field_" + fieldId).removeClass('disabled-field');
                        }
                      }
                    }
                    if (executeAction == "Show Field" || executeAction == "Show Button") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    }
                    else if (executeAction == "Hide Field" || executeAction == "Hide Button") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    }
                    else if (executeAction == "Show FieldSet") {
                      this.dynamicActionsOnChange(executeAction, executeOnFieldSet);
                    } else if (executeAction == "Hide FieldSet") {
                      this.dynamicActionsOnChange(executeAction, executeOnFieldSet);
                    } else if (executeAction == "Required") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    } else if (executeAction == "Optional") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    } else if (executeAction == "Read Only") {
                      console.log("readOnly>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                      console.log("choosenField>>>>>> :",choosenField);
                      console.log("conditionValue>>>>>>>>>>",conditionValue)
                      console.log("condition>>>>>>>>>>",condition)



                      if (this.dynamicIfCondition(this.dynamicForm.controls[choosenField]?.value, conditionValue, -1, condition)) {
                        console.log("executeOnField>>>>>>>>>>",executeOnField)

                        if (executeOnField.length >= 1) {
                          for (let u = 0; u < executeOnField.length; u++) {

                            let fieldId: any;
                            if (executeOnField[u].id) {
                              fieldId = executeOnField[u].id;
                            } else {
                              fieldId = executeOnField[u];

                            }

                            if ($("#field_" + fieldId)[0]) {
                              for (let c = 0; c < this.test.length; c++) {
                                console.log(this.test[c].columnType)

                                if (this.test[c].id === fieldId && this.test[c].columnType == "lookup") {
                                  this.test[c].qbeReadOnly = true;
                                  $('#' + this.test[c].name + "_lookupName").prop("readonly", true);
                                  $('#' + this.test[c].name).prop("readonly", true);


                                  break;
                                }else if(this.test[c].id === fieldId && this.test[c].columnType == "phone number"){
                                  console.log("11111111111111111122222222221111111111111111111",this.test[c]);
                                  this.test[c].qbeReadOnly = true;
                                }
                              }
                              $("#field_" + fieldId).prop('disabled', true);
                              $("#field_" + fieldId).addClass('disabled-field');
                            } else {

                              $(".field_" + fieldId).addClass('disabled-field');
                              $(".field_" + fieldId).css("pointer-events", "none");
                            }
                          }
                        } else {

                          let fieldId: any;
                          if (executeOnField[0].id) {
                            fieldId = executeOnField[0].id;
                          } else {
                            fieldId = executeOnField[0];
                          }

                          if ($("#field_" + fieldId)) {
                            $("#field_" + fieldId).addClass('disabled-field');
                          } else {
                            $(".field_" + fieldId).addClass('disabled-field');
                            $(".field_" + fieldId).css("pointer-events", "none");
                          }
                        }
                      }
                    } else if (executeAction == "Remove Read Only") {
                      if (this.dynamicIfCondition(this.dynamicForm.controls[choosenField]?.value, conditionValue, -1, condition)) {
                        if (executeOnField.length >= 1) {
                          for (let u = 0; u < executeOnField.length; u++) {

                            let fieldId: any;
                            if (executeOnField[u].id) {
                              fieldId = executeOnField[u].id;

                            } else {

                              fieldId = executeOnField[u];
                              $(".field_" + fieldId).prop('disabled', false);
                              $(".field_" + fieldId).removeClass('disabled-field');
                              $(".field_" + fieldId).css("pointer-events", "all");

                            }

                            if ($("#field_" + fieldId)[0]) {
                              for (let c = 0; c < this.test.length; c++) {
                                if (this.test[c].id === fieldId && this.test[c].columnType == "lookup") {
                                  this.test[c].qbeReadOnly = false;
                                  $('#' + this.test[c].name + "_lookupName").prop("readonly", false);
                                  $('#' + this.test[c].name).prop("readonly", false);
                                  break;
                                }
                              }


                              $("#field_" + fieldId).prop('disabled', false);
                              $("#field_" + fieldId).removeClass('disabled-field');
                              $("#field_" + fieldId).prop("readonly", false);

                            } else {

                              $(".field_" + executeOnField[u].id).removeClass('disabled-field');
                              $(".field_" + executeOnField[u].id).css("pointer-events", "all");
                            }
                          }
                        } else {

                          let fieldId: any;
                          if (executeOnField[0].id) {
                            fieldId = executeOnField[0].id;

                          } else {
                            fieldId = executeOnField[0];
                          }

                          if ($("#field_" + fieldId)) {
                            $("#field_" + fieldId).prop('disabled', false);
                            $("#field_" + fieldId).removeClass('disabled-field');

                          } else {
                            $(".field_" + fieldId).removeClass('disabled-field');
                            $(".field_" + fieldId).css("pointer-events", "all");
                          }
                        }
                      }
                    }
                    else if (executeAction == "Rename Field") {
                      document.getElementById("lbl_" + executeOnField).innerHTML = renameField;
                    } else if (executeAction == "Execute Query") {
                      let element = this.test.filter((el: any) => {
                        return defaultField === el.name;
                      });
                      if (element[0].columnType == "combo") {
                        for (let i = 0; i < this.test.length; i++) {
                          if (this.test[i].name == defaultField) {
                            this.test[i].query = queryRes;
                          }
                        }
                      } else {
                        this.dynamicForm.controls[defaultField].setValue(queryRes);

                      }

                    }
                  }
                } else if (condition == '<' || condition == '>' || condition == '>=' || condition == '<=') {
                  // In case of > or < for date value condition
                  if (dateTypes == 'Date' && condition != 'between') {
                    const choosenFieldDate: Date = new Date(this.dynamicForm.controls[choosenField]?.value);
                    const comparedDate: Date = new Date(dateCondition);
                    if (this.dynamicIfCondition(choosenFieldDate, comparedDate, -1, condition)) {
                      this.commonFunctions.alert("alert", alertValue);
                      // this.dynamicForm.controls[choosenField].setValue('');
                      this.handleFormFieldValues(choosenField, "");
                    }
                  } else if (dateTypes == 'Field' && condition != 'between') {

                    const choosenFieldDate: Date = new Date(this.dynamicForm.controls[choosenField]?.value);
                    const comparedFieldDate: Date = new Date(this.dynamicForm.controls[comparedField]?.value);

                    if (this.dynamicIfCondition(choosenFieldDate, comparedFieldDate, -1, condition)) {
                      this.commonFunctions.alert("alert", alertValue);
                      // this.dynamicForm.controls[choosenField].setValue('');
                      this.handleFormFieldValues(choosenField, "");
                    }
                  } else if (dateTypes == 'Value' && condition != 'between') {
                    if (executeAction == "Alert") {
                      let choosenFieldValue = this.dynamicForm.controls[choosenField]?.value
                      if (this.dynamicIfCondition(conditionValue, choosenFieldValue, -1, condition)) {
                        //this.commonFunctions.alert("alert", alertValue);
                        this.commonFunctions.alert("alert", alertValue);
                        // this.dynamicForm.controls[choosenFieldValue].setValue('');
                        this.handleFormFieldValues(choosenFieldValue, "");
                      }
                    }
                  } else if (dateTypes == 'Field Value' && condition != 'between') {
                    if (executeAction == "Alert") {

                      let choosenFieldValue = this.dynamicForm.controls[choosenField]?.value;
                      let comparedValue = this.dynamicForm.controls[comparedField]?.value;
                      let finalIfConditions = choosenFieldValue + condition + comparedValue;

                      if (this.dynamicIfCondition(choosenFieldValue, comparedValue, -1, condition)) {
                        this.commonFunctions.alert("alert", alertValue);
                        // this.dynamicForm.controls[choosenField].setValue('');
                        this.handleFormFieldValues(choosenField, "");
                      }
                    }
                  }
                } else if (condition == '<CURRENT_DATE' || condition == '>CURRENT_DATE' || condition == '>=CURRENT_DATE' || condition == '<=CURRENT_DATE') {
                  // In case of > or < for date value condition
                  let CURRENT_DATE = new Date();
                  const comparedDate = CURRENT_DATE;
                  const choosenFieldDate: Date = new Date(this.dynamicForm.controls[choosenField]?.value);

                  if (this.dynamicIfCondition(choosenFieldDate, comparedDate, -1, condition)) {
                    if (alertValue != "") {
                      this.commonFunctions.alert("alert", alertValue);
                    } else {
                      this.commonFunctions.alert("alert", alertValue);
                    }
                    // this.dynamicForm.controls[choosenField].setValue('');
                    this.handleFormFieldValues(choosenField, "");
                  }
                } else if (condition == 'Get CURRENT_DATE') {
                  const choosenFieldDate: Date = new Date(this.dynamicForm.controls[choosenField]?.value);
                  let CURRENT_DATE = new Date();
                  const timeDifferences = CURRENT_DATE.getTime() - choosenFieldDate.getTime();

                  if (typeOfDifference == 1) {
                    const daysdiff = Math.floor(timeDifferences / (1000 * 60 * 60 * 24));
                    const monthdiff = Math.floor(daysdiff / (30.44));
                    const yearsdiff = Math.floor(monthdiff / (12));
                    if (this.dynamicIfCondition(yearsdiff, Difference, -1, operations)) {
                      this.commonFunctions.alert("alert", conditionValue.toString());
                      // this.dynamicForm.controls[choosenField].setValue('');
                      this.handleFormFieldValues(choosenField, "");
                    }
                  } else if (typeOfDifference == 2) {
                    const daysdiff = Math.floor(timeDifferences / (1000 * 60 * 60 * 24));
                    const monthdiff = Math.floor(daysdiff / (30.44));
                    if (this.dynamicIfCondition(monthdiff, Difference, -1, operations)) {
                      this.commonFunctions.alert("alert", conditionValue.toString());
                      // this.dynamicForm.controls[choosenField].setValue('');
                      this.handleFormFieldValues(choosenField, "");
                    }
                  } else if (typeOfDifference == 3) {
                    const daysdiff = Math.floor(timeDifferences / (1000 * 60 * 60 * 24));
                    if (this.dynamicIfCondition(daysdiff, Difference, -1, operations)) {
                      this.commonFunctions.alert("alert", conditionValue.toString());
                      // this.dynamicForm.controls[choosenField].setValue('');
                      this.handleFormFieldValues(choosenField, "");
                    }
                  }
                } else if (condition == 'between') {
                  if (dateTypes == 'Field') {
                    // In case of between date value comparission
                    const choosenFieldDate: Date = new Date(this.dynamicForm.controls[choosenField]?.value);
                    const betweenDate1Date: Date = new Date(this.dynamicForm.controls[comparedField]?.value);
                    const betweenDate2Date: Date = new Date(this.dynamicForm.controls[comparedToField]?.value);
                    if (!this.dynamicIfCondition(choosenFieldDate, betweenDate1Date, betweenDate2Date, condition)) {
                      this.commonFunctions.alert("alert", alertValue);
                      // this.dynamicForm.controls[choosenField].setValue('');
                      this.handleFormFieldValues(choosenField, "");
                    }
                  } else if (dateTypes == 'Date') {
                    // In case of between date value comparission
                    const choosenFieldDate: Date = new Date(this.dynamicForm.controls[choosenField]?.value);
                    const betweenDate3Date: Date = new Date(betweendate1);
                    const betweenDate4Date: Date = new Date(betweendate2);
                    if (!this.dynamicIfCondition(choosenFieldDate, betweenDate3Date, betweenDate4Date, condition)) {
                      this.commonFunctions.alert("alert", alertValue);
                      // this.dynamicForm.controls[choosenField].setValue('');
                      this.handleFormFieldValues(choosenField, "");
                    }
                  }
                } else if (condition == 'Fill Into') {

                  if (typeOfFillInto == undefined) {
                    let choosenValue;
                    for (let i = 0; i < this.test.length; i++) {
                      if (this.test[i].name == choosenField) {
                        if (this.test[i].columnType == "combo") {
                          for (let j = 0; j < this.test[i].query.length; j++) {
                            if (this.test[i].query[j].ID == this.dynamicForm.controls[choosenField]?.value) {
                              choosenValue = this.test[i].query[j].NAME;
                            }
                          }
                        } else {
                          choosenValue = this.dynamicForm.controls[choosenField]?.value;
                        }
                      }
                    }

                    let user = {
                      'fieldToFillIn': fieldToFillIn,
                      'choosenValue': choosenValue,
                      'choosenFielddd': choosenField,
                      'fieldToFillInOrder': fieldToFillInOrder
                    }

                    if (operatorOption == "2") {// if operator is CURRENT_DATE

                      // user = {
                      //   'fieldToFillIn': fieldToFillIn,
                      //   'choosenValue': this.calculateDifference(choosenValue),
                      //   'choosenFielddd': choosenField,
                      //   'fieldToFillInOrder': fieldToFillInOrder
                      // }

                    } else if (operatorOption == "1") {// if operator is Value
                      let choosenValue = this.dynamicForm.controls[fillIntoChoosen]?.value
                      const dateObject = new Date(choosenValue);
                      const thirtyDaysAgo = new Date(dateObject);
                      if (operator == '-') {
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - valueToOperate);
                      } else if (operator == '+') {
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + valueToOperate);
                      }
                      let lastDate = this.datepipe.transform(thirtyDaysAgo, 'yyyy-MM-dd');
                      this.dynamicForm.controls[fieldToFillIn].setValue(lastDate);

                    } else if (operatorOption == "3") {// if operator is Execute Query

                      let jsonQbe: any[] = [];
                      let queryId = operatorQuery;
                      // Add a parameter to an Execute Query Nadine Nicolas
                      const paramQueryUrl = from(axios.get(GlobalConstants.getParamsNameApi + queryId));
                      const paramNames = await lastValueFrom(paramQueryUrl);

                      if (paramNames.data.length > 0) {
                        // Filter ROW_ID information to get only the ones for Grid
                        let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;


                        if (params != undefined) {
                          let filteredParams: any = this.handleSelectedRowIds(params, "combo,button");

                          for (let i = 0; i < filteredParams.length; i++) {
                            for (let j = 0; j < paramNames.data.length; j++) {
                              if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                                let colName = filteredParams[i].colname;
                                let colVal = filteredParams[i].colvalue;

                                jsonQbe.push(
                                  {
                                    queryId: queryId,
                                    parameters: [
                                      {
                                        paramName: colName,
                                        paramValue: colVal
                                      }
                                    ],
                                    link: [],
                                    isHidden: [],
                                    whereCond: this.getWhereCond
                                  }
                                );
                              }
                            }
                          }
                        }
                      } else {
                        jsonQbe.push(
                          {
                            queryId: queryId,
                            parameters: [
                              {
                                paramName: '',
                                paramValue: ''
                              }
                            ],
                            link: [],
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        );
                      }
                      // --------------------
                      const queryResUrl = from(axios.post(GlobalConstants.getQbeIdApi + queryId + "/0", jsonQbe));
                      const queryRess = await lastValueFrom(queryResUrl);
                      queryRes = queryRess.data[0];

                      let choosenValue = this.dynamicForm.controls[fillIntoChoosen]?.value
                      const dateObject = new Date(choosenValue);
                      const thirtyDaysAgo = new Date(dateObject);
                      if (operator == '-') {
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - queryRes);
                      } else if (operator == '+') {
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + queryRes);
                      }
                      let lastDate = this.datepipe.transform(thirtyDaysAgo, 'yyyy-MM-dd');
                      this.dynamicForm.controls[fieldToFillIn].setValue(lastDate);

                    }
                    else {
                      let fieldToFillValue = [];
                      if (this.ListToFillData.length == 1) {
                        this.ListToFillData.push(user);
                      } else {
                        let index = -1;
                        for (let i = 0; i < this.ListToFillData.length; i++) {
                          if (user.fieldToFillIn == this.ListToFillData[i].fieldToFillIn && user.fieldToFillInOrder == this.ListToFillData[i].fieldToFillInOrder) {
                            index = i;
                          }
                        }
                        if (index != -1) {
                          this.ListToFillData.splice(index, 1);
                        }
                        this.ListToFillData.push(user);
                      }

                      let NameToFill = '';
                      let choosenFieldd = '';
                      fieldToFillValue = this.ListToFillData.sort((a, b) => parseInt(a.fieldToFillInOrder) - parseInt(b.fieldToFillInOrder));

                      let fieldsToFillIn = "";
                      for (let j = 0; j < fieldToFillValue.length; j++) {
                        if (fieldsToFillIn.indexOf(fieldToFillValue[j].fieldToFillIn) == -1) {
                          if (fieldToFillValue.length - 1 == j) {
                            fieldsToFillIn += fieldToFillValue[j].fieldToFillIn;
                          } else {
                            fieldsToFillIn += fieldToFillValue[j].fieldToFillIn + ",";
                          }
                        }
                      }

                      // Gathering the fieldstofillin in order to run a split for loop
                      fieldsToFillIn = fieldsToFillIn = fieldsToFillIn.replace(/,\s*$/, "");
                      for (let k = 0; k < fieldsToFillIn.split(",").length; k++) {
                        let filteredArr = fieldToFillValue.filter((el: any) => {
                          return el.fieldToFillIn === fieldsToFillIn.split(",")[k];
                        });

                        NameToFill = "";
                        for (let j = 0; j < filteredArr.length; j++) {
                          let valueOfField = this.dynamicForm.controls[fieldsToFillIn.split(",")[k]]?.value;
                          if (choosenFieldd == "") {
                            // check if value is date then remove - and replace it with empty other then that put value as is
                            let valuee = filteredArr[j].choosenValue;
                            let formats = [moment.ISO_8601, "MM/DD/YYYY  :)  HH*mm*ss"];
                            let checkDateValidity = moment(valuee, formats, true).isValid();
                            valuee = checkDateValidity ? valuee.replace(/-/g, '') : valuee;
                            NameToFill = NameToFill + " " + valuee;
                          } else if (choosenFieldd != filteredArr[j].fieldToFillIn && (valueOfField == "" || valueOfField == undefined)) {
                            NameToFill = "";
                            // check if value is date then remove - and replace it with empty other then that put value as is
                            let valuee = filteredArr[j].choosenValue;
                            let formats = [moment.ISO_8601, "MM/DD/YYYY  :)  HH*mm*ss"];
                            let checkDateValidity = moment(valuee, formats, true).isValid();
                            valuee = checkDateValidity ? valuee.replace(/-/g, '') : valuee;
                            NameToFill = NameToFill + " " + valuee;
                          } else if (choosenFieldd != filteredArr[j].fieldToFillIn && (valueOfField != "" || valueOfField != undefined)) {
                            NameToFill = valueOfField;
                            // check if value is date then remove - and replace it with empty other then that put value as is
                            let valuee = filteredArr[j].choosenValue;
                            let formats = [moment.ISO_8601, "MM/DD/YYYY  :)  HH*mm*ss"];
                            let checkDateValidity = moment(valuee, formats, true).isValid();
                            valuee = checkDateValidity ? valuee.replace(/-/g, '') : valuee;
                            NameToFill = NameToFill + " " + valuee;
                          }

                          if (j == filteredArr.length - 1) {
                            // this.dynamicForm.controls[fieldsToFillIn.split(",")[k]].setValue(NameToFill);
                            this.handleFormFieldValues(fieldsToFillIn.split(",")[k], NameToFill);
                          }
                        }
                      }
                    }
                  } else if (typeOfFillInto == 3) { // get CURRENT_DATE with time
                    let time = this.datepipe.transform((new Date), 'yyyy-MM-ddTHH:mm');
                    this.handleFormFieldValues(fieldToFillIn, time);
                  } else if (typeOfFillInto == 2) { // get the value of a choosen field rule 26
                    let valueOfField = this.dynamicForm.controls[fillIntoChoosen]?.value

                    if (minusCURRENT_DATE[0] == "1") {
                      valueOfField = this.calculateDifference(valueOfField);
                    }
                    this.handleFormFieldValues(fieldToFillIn, valueOfField);


                  }


                } else if (condition == 'Field Value') {
                  let fieldVal = this.dynamicForm.controls[fieldValue]?.value;
                  if (this.dynamicIfCondition(fieldVal, conditionValue, -1, operations)) {
                    if (executeAction == "Execute Rule Business") {
                      columnId = -1
                      this.dynamicDRBOnchange(columnId, ruleId);
                    } else if (executeAction == "Show Field") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    } else if (executeAction == "Hide Field") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    } else if (executeAction == "Hide Button") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    } else if (executeAction == "Show Button") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    } else if (executeAction == "Show FieldSet") {
                      this.dynamicActionsOnChange(executeAction, executeOnFieldSet);
                    } else if (executeAction == "Hide FieldSet") {
                      this.dynamicActionsOnChange(executeAction, executeOnFieldSet);
                    } else if (executeAction == "Required") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    } else if (executeAction == "Optional") {
                      this.dynamicActionsOnChange(executeAction, executeOnField);
                    }

                  }
                }
                else if(condition == 'Include' || condition == '!Include'){
                  if (executeAction == "Alert") {
                    let choosenFieldValue = this.dynamicForm.controls[choosenField]?.value;
                    let comparedFieldValue = this.dynamicForm.controls[comparedField]?.value;
                     if(condition == 'Include'){
                      const include = choosenFieldValue.includes(comparedFieldValue);
                      console.log("includeValue is =",include);
                      if(include == true){
                      this.commonFunctions.alert("alert", alertValue);
                      this.handleFormFieldValues(choosenField, "");
                      }
                     }
                  }
                }
              }
            } else {

            }
          }
        }
      }
    } catch (error) {
      console.log("dynamicDRBOnchange error >>> ", error);
    }
  }


  // Function To avoid repetition for Actions(hide,show,required,..)
  dynamicActionsOnChange(executeAction: any, execution: any) {

    let fieldsetColumns: any[] = [];
    let data_1: any[] = [];
    for (let i = 0; i < execution.length; i++) {
      let d = this.allColumnsLibrary.filter((el: any) => {
        return Number(el.groupId) === Number(execution[i]);
      });
      data_1.push(d);
    }
    for (let i = 0; i < data_1.length; i++) {
      for (let j = 0; j < data_1[i].length; j++) {
        fieldsetColumns.push({
          "columnId": data_1[i][j].id,
          "columnName": data_1[i][j].name,
          "isMandatory": data_1[i][j].isMandatory,
          "fieldsetId": data_1[i][j].groupId
        });
      }
    }

    if (executeAction == "Remove Read Only") {
      if (executeAction.length >= 1) {
        for (let u = 0; u < executeAction.length; u++) {
          if ($("#field_" + executeAction[u])[0]) {
            $("#field_" + executeAction[u]).prop('disabled', false);
            $("#field_" + executeAction[u]).removeClass('disabled-field');
          } else {
            $(".field_" + executeAction[u]).removeClass('disabled-field');
            $(".field_" + executeAction[u]).css("pointer-events", "all");
          }
        }
      } else {
        if ($("#field_" + executeAction[0])) {
          $("#field_" + executeAction[0]).prop('disabled', false);
          $("#field_" + executeAction[0]).removeClass('disabled-field');
        } else {
          $(".field_" + executeAction[0]).removeClass('disabled-field');
          $(".field_" + executeAction[0]).css("pointer-events", "all");
        }
      }
    }

    if (executeAction == "Show FieldSet") {
      if (fieldsetColumns.length >= 1) {
        for (let u = 0; u < fieldsetColumns.length; u++) {
          const field = this.dynamicForm.get(fieldsetColumns[u].columnName);
          if (field) {
            $("#lbl_" + fieldsetColumns[u].columnId).show();
            $("#field_" + fieldsetColumns[u].columnId).show();
            $("#lbl_" + fieldsetColumns[u].columnId).parent().parent().parent().parent().show();
            $("#fieldSet_" + fieldsetColumns[u].fieldsetId).show();
            if (fieldsetColumns[u].isMandatory == 1 || fieldsetColumns[u].isMandatory == 2) {
              $("#lbl_" + fieldsetColumns[u].columnId).removeClass("label");
              $("#lbl_" + fieldsetColumns[u].columnId).addClass("required");
              $("#lbl_" + fieldsetColumns[u].columnId).addClass("label-required");

              this.dynamicForm.controls[fieldsetColumns[u].columnName].setValidators([Validators.required]);
              this.dynamicForm.controls[fieldsetColumns[u].columnName].updateValueAndValidity();
            }
          }
        }
      } else {
        const field = this.dynamicForm.get(fieldsetColumns[0].columnName);
        if (field) {
          $("#lbl_" + fieldsetColumns[0].columnId).show();
          $("#field_" + fieldsetColumns[0].columnId).show();
          $("#lbl_" + fieldsetColumns[0].columnId).parent().parent().parent().parent().show();
          $("#fieldSet_" + fieldsetColumns[0].fieldsetId).show();

          if (fieldsetColumns[0].isMandatory == 1 || fieldsetColumns[0].isMandatory == 2) {
            $("#lbl_" + fieldsetColumns[0].columnId).removeClass("label");
            $("#lbl_" + fieldsetColumns[0].columnId).addClass("required");
            $("#lbl_" + fieldsetColumns[0].columnId).addClass("label-required");

            this.dynamicForm.controls[fieldsetColumns[0].columnName].setValidators([Validators.required]);
            this.dynamicForm.controls[fieldsetColumns[0].columnName].updateValueAndValidity();
          }
        }
      }
    }

    if (executeAction == "Hide FieldSet") {
      if (fieldsetColumns.length > 1) {
        for (let u = 0; u < fieldsetColumns.length; u++) {
          const field = this.dynamicForm.get(fieldsetColumns[u].columnName);
          if (field) {
            $("#lbl_" + fieldsetColumns[u].columnId).hide();
            $("#field_" + fieldsetColumns[u].columnId).hide();
            $("#lbl_" + fieldsetColumns[u].columnId).parent().parent().parent().parent().hide();
            $("#fieldSet_" + fieldsetColumns[u].fieldsetId).hide();

            $("#lbl_" + fieldsetColumns[u].columnId).addClass("label");
            $("#lbl_" + fieldsetColumns[u].columnId).removeClass("required");
            $("#lbl_" + fieldsetColumns[u].columnId).removeClass("label-required");

            this.clearFormControl(fieldsetColumns[u].columnName);
          }
        }
      } else {
        if (fieldsetColumns[0]) {
          const field = this.dynamicForm.get(fieldsetColumns[0].columnName);
          if (field) {
            $("#lbl_" + fieldsetColumns[0].columnId).hide();
            $("#field_" + fieldsetColumns[0].columnId).hide();
            $("#lbl_" + fieldsetColumns[0].columnId).parent().parent().parent().parent().hide();
            $("#fieldSet_" + fieldsetColumns[0].fieldsetId).hide();

            $("#lbl_" + fieldsetColumns[0].columnId).addClass("label");
            $("#lbl_" + fieldsetColumns[0].columnId).removeClass("required");
            $("#lbl_" + fieldsetColumns[0].columnId).removeClass("label-required");

            this.clearFormControl(fieldsetColumns[0].columnName);
          }
        }
      }
    }

    if (executeAction == "Show Field" || executeAction == "Show Button") {
      if (execution.length > 1) {
        for (let u = 0; u < execution.length; u++) {
          let fieldId: number = -1;
          if (execution[u].id) {
            fieldId = execution[u].id;
          } else {
            fieldId = execution[u];
          }

          $("#lbl_" + fieldId).show();
          $("#field_" + fieldId).show();
          $("#lbl_" + fieldId).parent().parent().parent().parent().show();
        }
      } else {
        let fieldId: number = -1;
        if (execution[0].id) {
          fieldId = execution[0].id;
        } else {
          fieldId = execution[0];
        }

        $("#lbl_" + fieldId).show();
        $("#field_" + fieldId).show();
        $("#lbl_" + fieldId).parent().parent().parent().parent().show();
      }
    }

    if (executeAction == "Read Only") {
console.log('execution-----------> :',execution)
      if (execution.length >= 1) {
        for (let u = 0; u < execution.length; u++) {
          if ($("#field_" + execution[u])[0]) {
            $("#field_" + execution[u]).prop('disabled', true);
            $("#field_" + execution[u]).addClass('disabled-field');

          } else {

            $(".field_" + execution[u]).addClass('disabled-field');
            $(".field_" + execution[u]).css("pointer-events", "none");
          }
        }
      } else {

        if ($("#field_" + execution[0])) {
          $("#field_" + execution[0]).addClass('disabled-field');

        } else {
          $(".field_" + execution[0]).addClass('disabled-field');
          $(".field_" + execution[0]).css("pointer-events", "none");
        }
      }
    }

    if (executeAction == "Hide Field" || executeAction == "Hide Button") {
      if (execution.length > 1) {
        for (let u = 0; u < execution.length; u++) {
          let fieldId: number = -1;
          if (execution[u].id) {
            fieldId = execution[u].id;
          } else {
            fieldId = execution[u];
          }

          let fieldName: any[] = this.allColumnsLibrary.filter((el: any) => {
            return el.id === fieldId;
          });

          if (fieldName.length > 0) {
            if (fieldName[0] != undefined) {
              const field = this.dynamicForm.get(fieldName[0].name);
              if (field) {
                $("#lbl_" + fieldId).hide();
                $("#field_" + fieldId).hide();
                $("#lbl_" + fieldId).parent().parent().parent().parent().hide();
                // this.ClearFormControlAndRemoveMendatory(fieldName[0].name);
                this.clearFormControl(fieldName[0].name);
                //remove mendatory of the field (case appear for the staff)
                for (let i = 0; i < this.test.length; i++) {
                  if (this.test[i].name == fieldName[0].name) {
                    if (this.test[i].columnType == "lookup") {
                      this.test[i].isMandatory = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        let fieldId: number = -1;
        if (execution[0].id) {
          fieldId = execution[0].id;
        } else {
          fieldId = execution[0];
        }

        let fieldName: any[] = this.allColumnsLibrary.filter((el: any) => {
          return el.id === fieldId;
        });

        if (fieldName.length > 0) {
          if (fieldName[0] != undefined) {
            const field = this.dynamicForm.get(fieldName[0].name);
            if (field) {
              $("#lbl_" + fieldId).hide();
              $("#field_" + fieldId).hide();
              $("#lbl_" + fieldId).parent().parent().parent().parent().hide();

              // this.ClearFormControlAndRemoveMendatory(fieldName[0].name);
              this.clearFormControl(fieldName[0].name);
              //remove mendatory of the field
              // for (let i = 0; i < this.test.length; i++) {
              //   if (this.test[i].name == fieldName[0].name) {
              //     this.test[i].isMandatory = false;
              //     break;
              //   }
              // }
            }
          }
        }
        else {
          $("#lbl_" + fieldId).hide();
          $("#field_" + fieldId).hide();
          $("#lbl_" + fieldId).parent().parent().parent().parent().hide();
        }
      }
    }

    if (executeAction == "Required") {
      if (execution.length > 1) {
        for (let u = 0; u < execution.length; u++) {
          let fieldId: number = -1;
          if (execution[u].id) {
            fieldId = execution[u].id;
          } else {
            fieldId = execution[u];
          }

          if (typeof fieldId == "string") {
            let fieldName: any[] = this.allColumnsLibrary.filter((el: any) => {
              return el.id === fieldId;
            });

            if (fieldName[0] != undefined) {
              const field = this.dynamicForm.get(fieldName[0].name);
              if (field) {

                this.dynamicForm.controls[fieldName[0].name].setValidators([Validators.required]);
                this.dynamicForm.controls[fieldName[0].name].updateValueAndValidity();
                $("#lbl_" + fieldId).removeClass("label");
                $("#lbl_" + fieldId).addClass("required");
                $("#lbl_" + fieldId).addClass("label-required");
              }
            }
          }
        }
      } else {

        let fieldId: number = -1;
        if (execution[0].id) {
          fieldId = execution[0].id;
        } else {
          fieldId = execution[0];
        }

        let fieldName: any[] = this.allColumnsLibrary.filter((el: any) => {
          return el.id === fieldId;
        });

        if (fieldName[0] != undefined) {
          const field = this.dynamicForm.get(fieldName[0].name);
          if (field) {

            this.dynamicForm.controls[fieldName[0].name].setValidators([Validators.required]);
            this.dynamicForm.controls[fieldName[0].name].updateValueAndValidity();
            $("#lbl_" + fieldId).removeClass("label");
            $("#lbl_" + fieldId).addClass("required");
            $("#lbl_" + fieldId).addClass("label-required");
          }
        }
      }
    }
    if (executeAction == "Optional") {
      if (execution.length > 1) {
        for (let u = 0; u < execution.length; u++) {

          let fieldId: number = -1;
          if (execution[u].id) {
            fieldId = execution[u].id;
          } else {
            fieldId = execution[u];
          }

          let fieldName: any[] = this.allColumnsLibrary.filter((el: any) => {
            return el.id === fieldId;
          });

          if (fieldName.length > 0) {
            if (fieldName[0] != undefined) {
              const field = this.dynamicForm.get(fieldName[0].name);
              if (field) {
                $("#lbl_" + fieldId).addClass("label");
                $("#lbl_" + fieldId).removeClass("required");
                $("#lbl_" + fieldId).removeClass("label-required");
                this.clearFormControl(fieldName[0].name);
              }
            }
          }
        }
      } else {
        let fieldId: number = -1;
        if (execution[0].id) {
          fieldId = execution[0].id;
        } else {
          fieldId = execution[0];
        }

        let fieldName: any[] = this.allColumnsLibrary.filter((el: any) => {
          return el.id === fieldId;
        });

        if (fieldName.length > 0) {
          if (fieldName[0] != undefined) {
            const field = this.dynamicForm.get(fieldName[0].name);
            if (field) {

              $("#lbl_" + fieldId).removeClass("label-required");
              $("#lbl_" + fieldId).removeClass("required");
              $("#lbl_" + fieldId).addClass("label");

              this.clearFormControl(fieldName[0].name);
            }
          }
        }
      }
    }
  }

  async loadAM(isFromDialogClose: boolean) {
    console.log("this.amInfo======", this.amInfo);

    try {
      this.ListToFillData = [{ 'fieldToFillIn': '', 'choosenValue': '', 'fieldToFillInOrder': '', 'choosenFielddd': '' }];
      this.AllTabs = [];
      this.tableOptions1 = [];
      this.test_1 = "0";

      // $(".nav-tabs").show();

      // let lookupData = this.data[0];
      this.isFromGridClick = this.amInfo.isFromGridClick;
      this.actionType = this.amInfo.actionType;

      if (this.actionType == undefined) {
        this.actionType == 'update';
      }

      const getAllTabsUrl = from(axios.get(GlobalConstants.getAllTabs + this.amInfo.objectId));
      const getAllTabs = await lastValueFrom(getAllTabsUrl);
      this.allTabsTemp=getAllTabs.data;
      this.loaderService.isLoading.next(true);
      for (let i = 0; i < getAllTabs.data.length; i++) {

        // this.jsonQbe = [];

        // Add Common Paramters
        // this.jsonQbe.push(
        //   {
        //     queryId: '',
        //     parameters: [
        //       {
        //         paramName: 'userId',
        //         paramValue: this.userId
        //       }
        //     ],
        //     link: this.testLinks,
        //isHidden: [],
        //     gridCombos: []
        //   },{
        //     queryId: '',
        //     parameters: [
        //       {
        //         paramName: 'actionType',
        //         paramValue: this.actionType
        //       }
        //     ],
        //     link: this.testLinks,
        //isHidden: [],
        //     gridCombos: []
        //   }
        // )

        let isGrid = 1;
console.log("getAllTabs.data[i] ====",getAllTabs.data[i]);
        if (getAllTabs.data[i].isMain == 1) {
          isGrid = 0;
        } else {
          isGrid = getAllTabs.data[i].isGrid;
        }
console.log("isGrid ========",isGrid);
        // If condition lookup to disable a tab on onload
        let conditionTest: any;
        let condition = getAllTabs.data[i].condition == null ? -1 : getAllTabs.data[i].condition;

        if (condition != -1) {
          const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + condition));
          const paramNames = await lastValueFrom(paramNamesUrl);
          let jsonQbe: any[] = [];
          jsonQbe.push(
            {
              queryId: condition,
              parameters: [
                {
                  paramName: 'actionType',
                  paramValue: '' + this.actionType + ''
                },
                {
                  paramName: 'userId',
                  paramValue: this.userId
                }
              ],
              link: [],
              isHidden: [],
              whereCond: this.getWhereCond
            }
          );

          let checkIfParamsAreEmpty = 0;
          if (paramNames.data.length > 0) {
            // Filter ROW_ID information to get only the ones for Grid
            let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
            if (params != undefined) {
              let filteredParams: any = this.handleSelectedRowIds(params, "tab,button,grid,form");
              for (let i = 0; i < filteredParams.length; i++) {
                for (let j = 0; j < paramNames.data.length; j++) {
                  if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                    let colName = filteredParams[i].colname;
                    let colVal = filteredParams[i].colvalue;

                    if (colVal == "" || colVal == null || colVal == undefined) {
                      checkIfParamsAreEmpty++;
                    }
                    jsonQbe.push(
                      {
                        queryId: condition,
                        parameters: [
                          {
                            paramName: colName,
                            paramValue: colVal
                          }
                        ],
                        link: this.testLinks,
                        isHidden: [],
                        whereCond: this.getWhereCond
                      }
                    );
                  }
                }
              }
            } else {
              checkIfParamsAreEmpty = paramNames.data.length;
            }
          } else {
            jsonQbe.push(
              {
                queryId: condition,
                parameters: [
                  {
                    paramName: '',
                    paramValue: ''
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            );
          }

          const conditionUrl = from(axios.post(GlobalConstants.getQbeIdApi + condition + "/0", jsonQbe));
          const conditionT = await lastValueFrom(conditionUrl);

          // if (this.actionType == "update") {
          if (conditionT.data[0] == 1) {
            conditionTest = 0;
          } else if (conditionT.data[0] == undefined && checkIfParamsAreEmpty == paramNames.data.length) {
            conditionTest = 0;
          } else {
            conditionTest = 1;
          }
          // }
          // else {
          //   conditionTest = 0;
          // }
        }

        // Is Save Button lookup to hide a save on onload
        let isSaveBtn: any;
        let isSave = getAllTabs.data[i].isSave == null ? -1 : getAllTabs.data[i].isSave;

        if (isSave != -1) {
          const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + isSave));
          const paramNames = await lastValueFrom(paramNamesUrl);
          let jsonQbe: any[] = [];
          jsonQbe.push(
            {
              queryId: isSave,
              parameters: [
                {
                  paramName: 'actionType',
                  paramValue: '' + this.actionType + ''
                },
                {
                  paramName: 'userId',
                  paramValue: this.userId
                }
              ],
              link: [],
              isHidden: [],
              whereCond: this.getWhereCond
            }
          )

          if (paramNames.data.length > 0) {
            // Filter ROW_ID information to get only the ones for Grid
            let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
            if (params != undefined) {
              let filteredParams: any = this.handleSelectedRowIds(params, "tab,button");
              for (let i = 0; i < filteredParams.length; i++) {
                for (let j = 0; j < paramNames.data.length; j++) {
                  if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                    let colName = filteredParams[i].colname;
                    let colVal = filteredParams[i].colvalue;
                    jsonQbe.push(
                      {
                        queryId: isSave,
                        parameters: [
                          {
                            paramName: colName,
                            paramValue: colVal
                          }
                        ],
                        link: this.testLinks,
                        isHidden: [],
                        whereCond: this.getWhereCond
                      }
                    );
                  }
                }
              }
            }
          } else {
            jsonQbe.push(
              {
                queryId: isSave,
                parameters: [
                  {
                    paramName: '',
                    paramValue: ''
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            );
          }
          const isSaveUrl = from(axios.post(GlobalConstants.getQbeIdApi + isSave + "/0", jsonQbe));
          const isSaveT = await lastValueFrom(isSaveUrl);
          if (isSaveT.data[0] == 1) {
            isSaveBtn = 1;
          } else {
            isSaveBtn = 0;
          }
        }

        this.hiddenForm.addControl("hidden_" + getAllTabs.data[i].menuName + "_objId", new FormControl(''));
        this.hiddenForm.controls["hidden_" + getAllTabs.data[i].menuName + "_objId"].setValue(getAllTabs.data[i].objectId);

        // Handling Read Only under Tab with Parameters

        let isReadOnly = getAllTabs.data[i].readOnlyQbeId == null ? -1 : getAllTabs.data[i].readOnlyQbeId;
        let isReadOnlyB: boolean;

        if (isReadOnly != -1) {
          const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + isReadOnly));
          const paramNames = await lastValueFrom(paramNamesUrl);
          let jsonQbe: any[] = [];
          jsonQbe.push(
            {
              queryId: isReadOnly,
              parameters: [
                {
                  paramName: 'actionType',
                  paramValue: '' + this.actionType + ''
                },
                {
                  paramName: 'userId',
                  paramValue: this.userId
                }
              ],
              link: [],
              isHidden: [],
              whereCond: this.getWhereCond
            }
          )

          if (paramNames.data.length > 0) {
            // Filter ROW_ID information to get only the ones for Grid
            let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
            if (params != undefined) {
              let filteredParams: any = this.handleSelectedRowIds(params, "tab,form");
              for (let i = 0; i < filteredParams.length; i++) {
                for (let j = 0; j < paramNames.data.length; j++) {
                  if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                    let colName = filteredParams[i].colname;
                    let colVal = filteredParams[i].colvalue;
                    jsonQbe.push(
                      {
                        queryId: isReadOnly,
                        parameters: [
                          {
                            paramName: colName,
                            paramValue: colVal
                          }
                        ],
                        link: this.testLinks,
                        isHidden: [],
                        whereCond: this.getWhereCond
                      }
                    );
                  }
                }
              }
            }
          } else {
            jsonQbe.push(
              {
                queryId: isReadOnly,
                parameters: [
                  {
                    paramName: '',
                    paramValue: ''
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            );
          }

          const isReadOnlyURL = from(axios.post(GlobalConstants.getQbeIdApi + isReadOnly + "/0", jsonQbe));
          const isReadOnlyT = await lastValueFrom(isReadOnlyURL);

          if (isReadOnlyT.data[0] == 1) {
            isReadOnlyB = true;
          } else {
            isReadOnlyB = false;
          }


        }

        this.tableOptions1.push({
          "tableName": getAllTabs.data[i].menuName,
          "canAdd": getAllTabs.data[i].canAdd,
          "canDelete": getAllTabs.data[i].canDelete,
          "canModify": getAllTabs.data[i].canModify,
          "condition": conditionTest,
          "sourceQuery": getAllTabs.data[i].sourceQuery,
          "isAdvancedSearch": getAllTabs.data[i].isAdvancedSearch,
          "isQueryForm": getAllTabs.data[i].isQueryForm,
          "isDynamicReport": getAllTabs.data[i].isDynamicReport,
          "isGrid": isGrid,
          "objectId": getAllTabs.data[i].objectId,
          "isMain": getAllTabs.data[i].isMain,
          "tabId": "tabbId_" + getAllTabs.data[i].objectId,
          "isSave": isSaveBtn,
          "isReadOnly": isReadOnlyB
        });
        console.log("TEST>>>>>>>>>>>>",this.tableOptions1);
        console.log("getAllTabs.data[i] >>>>",getAllTabs.data[i]);
        if (getAllTabs.data[i].isMain == "1") {
          //test2
          let previousTab = this.informationservice.getPreviousMainTab();

          //test2
          if (this.informationservice.getMainTab() != null && this.informationservice.getMainTab() != "") {
            this.informationservice.setPreviousMainTab(this.informationservice.getMainTab());
          }
          if (previousTab) {
            this.informationservice.setMainTab(previousTab);
          }
          if (!previousTab) {
            console.log("previousTab wiiiiiiii=",getAllTabs.data[i].menuName);
            // this.informationservice.setMainTab(getAllTabs.data[i].menuName);
            this.informationservice.setMainTab(this.informationservice.getPreviousMainTab());
          }
        }
      }
      this.loaderService.isLoading.next(false);

      // Handle screen container body height depending if 1 tab or many tabs
      if (this.tableOptions1.length > 1) {
        $("#screen-container").css({ "height": "55vh", "overflow-y": "auto", "overflow-x": "hidden" });
      } else if (this.tableOptions1.length == 1) {
        $("#screen-container").css({ "height": "80vh", "overflow-y": "auto", "overflow-x": "hidden" });
      }
      // rony for close dialog
      this.dialogRef.disableClose = true;

    } catch (error) {
      console.log("Onload error >>> ", error);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Check if the pressed key is the up or down arrow key
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // Prevent the default behavior for these keys
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.type === 'number') {
      this.handleNumericInput(inputElement);
    }
  }

  private handleNumericInput(inputElement: HTMLInputElement): void {
    const value = inputElement.value;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      inputElement.value = parsedValue.toString();
    } else {
      inputElement.value = '';
    }
  }

  async ngOnInit(): Promise<void> {

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('agGidSelectedLookup_')) {
        localStorage.removeItem(key);
      }
    }

    this.counterOfSave = 0;
    //test2
    this.roleId = this.informationservice.getUserRoleId();
    if (this.amInfo == undefined) {
      this.amInfo = this.lookupData[0];
    }

    this.loadAM(false);
    this.subsVar = this.eventEmitterService.onTabActionClick.subscribe(() => {
      // this.loadAM(false);
      this.getAllColums();
    });
    setTimeout(() => {
      this.previewDynamicReportbool=false;
    }, 100);
  }

  setFormValues(): void {
    Object.keys(this.dynamicForm.controls).forEach(controlName => {
      const control = this.dynamicForm.get(controlName);
      if (this.formData.hasOwnProperty(controlName)) {
        control.patchValue(this.formData[controlName]);
      }
    });
  }

  async getAllColums() {
    //SERVICE1998

    console.log("number into this function >>>>>>>>>>>>>>>>>")
    this.informationservice.setDynamicService("~" + this.informationservice.getSelectedTabName() + "~", JSON.stringify(this.amInfo));

    this.loaderService.isLoading.next(true);
    let hasSourceQuery: number = 0;
    let foreignId: string = '';
    let foreignValue: string = '';
    this.test = [];
    this.test_1 = '0';
    this.dynamicForm = "";
    // this.jsonQbe = [];
    this.toolBar = "";

    // let lookupData = this.data[0];
    let isGrid: any = '';
    let objectId: any;

    this.actionType = this.amInfo.actionType;
    objectId = this.amInfo.objectId;

console.log("objectId >>>>>>>>>>>>>>>>>>>>>>>>",objectId);
    const getMenuNameApiUrl = from(axios.get(GlobalConstants.getMenuNameApi + objectId));
    const getMenuNameApi = await lastValueFrom(getMenuNameApiUrl);

    this.AllTabs = getMenuNameApi.data;

    // if (this.AllTabs.length == 1) {
    //   $(".nav-tabs").hide();
    // }

    // localStorage.setItem("allTabs",this.AllTabs[0]);
    // for(let i=1;i<this.AllTabs.length;i++){
    // localStorage.setItem("allTabs",localStorage.getItem("allTabs")+~+this.AllTabs[i]);
    // }

    //test2
    this.selectedTabName = this.informationservice.getSelectedTabName();

    this.AllTabs = this.AllTabs.filter((el: any) => {
      return el.menuName == this.selectedTabName;
    });

    if (this.AllTabs[0] == undefined)
      return;

    //test2
    if (this.informationservice.getMainTab() == this.AllTabs[0].menuName) {
      this.informationservice.setDynamicService("~" + this.AllTabs[0].menuName + "~", JSON.stringify(this.amInfo));
      // localStorage.setItem("~"+this.AllTabs[0].menuName+"~", JSON.stringify(this.amInfo));
    }

    this.objectId = this.AllTabs[0].objectId;
    this.loadAllFormColumns(this.objectId);

    // Filter tableOptions on selected tab
    console.log("ALL OPTIONS>>>>>>>>>>>>>",this.tableOptions1)
    let tableOptions: any = this.tableOptions1.filter((el: any) => {
      return Number(el.objectId) === Number(this.objectId);
    });
    this.tableOptionTemp=tableOptions;
    // Check if tab is main
    this.isMainTab = tableOptions[0].isMain;
    // Build breadcrumb
    //if (this.isMainTab == 1) {
    this.handleDialogTitle();
    // }

    // Handle AMD controls
    let x = tableOptions[0].canAdd == null ? -1 : tableOptions[0].canAdd;
    let y = tableOptions[0].canDelete == null ? -1 : tableOptions[0].canDelete;
    let z = tableOptions[0].canModify == null ? -1 : tableOptions[0].canModify;
    let w = tableOptions[0].sourceQuery == null ? -1 : tableOptions[0].sourceQuery;
    let readOnly = tableOptions[0].readOnlyQbeId == null ? -1 : tableOptions[0].readOnlyQbeId;
    let jsonQbe_canAdd: any[] = [];
    let jsonQbe_canDelete: any[] = [];
    let jsonQbe_canUpdate: any[] = [];
    let jsonCondition: any[] = [];

    if (x != -1) {
      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + x));
      const paramNames = await lastValueFrom(paramNamesUrl);

      jsonQbe_canAdd.push(
        {
          queryId: x,
          parameters: [
            {
              paramName: 'actionType',
              paramValue: '' + this.actionType + ''
            },
            {
              paramName: 'userId',
              paramValue: this.userId
            }
          ],
          link: [],
          isHidden: [],
          whereCond: this.getWhereCond
        }
      )

      if (paramNames.data.length > 0) {
        // Filter ROW_ID information to get only the ones for Grid
        let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
        if (params != undefined) {
          let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid");

          for (let i = 0; i < filteredParams.length; i++) {
            for (let j = 0; j < paramNames.data.length; j++) {
              if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                let colName = filteredParams[i].colname;
                let colVal = filteredParams[i].colvalue;
                jsonQbe_canAdd.push(
                  {
                    queryId: x,
                    parameters: [
                      {
                        paramName: colName,
                        paramValue: colVal
                      }
                    ],
                    link: this.testLinks,
                    isHidden: [],
                    whereCond: this.getWhereCond
                  }
                );
              }
            }
          }
        }
      } else {
        jsonQbe_canAdd.push(
          {
            queryId: x,
            parameters: [
              {
                paramName: '',
                paramValue: ''
              }
            ],
            link: [],
            isHidden: [],
            whereCond: this.getWhereCond
          }
        );
      }
    }

    const canAddUrl = from(axios.post(GlobalConstants.getQbeIdApi + x + "/0", jsonQbe_canAdd));
    const canAdd = await lastValueFrom(canAddUrl);

    if (y != -1) {
      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + y));
      const paramNames = await lastValueFrom(paramNamesUrl);

      jsonQbe_canDelete.push(
        {
          queryId: y,
          parameters: [
            {
              paramName: 'actionType',
              paramValue: '' + this.actionType + ''
            },
            {
              paramName: 'userId',
              paramValue: this.userId
            }
          ],
          link: [],
          isHidden: [],
          whereCond: this.getWhereCond
        }
      )

      if (paramNames.data.length > 0) {
        // Filter ROW_ID information to get only the ones for Grid
        let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
        if (params != undefined) {
          let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid");
          for (let i = 0; i < filteredParams.length; i++) {
            for (let j = 0; j < paramNames.data.length; j++) {
              if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                let colName = filteredParams[i].colname;
                let colVal = filteredParams[i].colvalue;
                jsonQbe_canDelete.push(
                  {
                    queryId: y,
                    parameters: [
                      {
                        paramName: colName,
                        paramValue: colVal
                      }
                    ],
                    link: this.testLinks,
                    isHidden: [],
                    whereCond: this.getWhereCond
                  }
                );
              }
            }
          }
        }
      } else {
        jsonQbe_canDelete.push(
          {
            queryId: y,
            parameters: [
              {
                paramName: '',
                paramValue: ''
              }
            ],
            link: [],
            isHidden: [],
            whereCond: this.getWhereCond
          }
        );
      }
    }
    const canDeleteUrl = from(axios.post(GlobalConstants.getQbeIdApi + y + "/0", jsonQbe_canDelete));
    const canDelete = await lastValueFrom(canDeleteUrl);

    if (z != -1) {
      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + z));
      const paramNames = await lastValueFrom(paramNamesUrl);

      jsonQbe_canUpdate.push(
        {
          queryId: z,
          parameters: [
            {
              paramName: 'actionType',
              paramValue: '' + this.actionType + ''
            },
            {
              paramName: 'userId',
              paramValue: this.userId
            }
          ],
          link: [],
          isHidden: [],
          whereCond: this.getWhereCond
        }
      )

      if (paramNames.data.length > 0) {
        // Filter ROW_ID information to get only the ones for Grid
        let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
        if (params != undefined) {
          let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid");
          for (let i = 0; i < filteredParams.length; i++) {
            for (let j = 0; j < paramNames.data.length; j++) {
              if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                let colName = filteredParams[i].colname;
                let colVal = filteredParams[i].colvalue;
                jsonQbe_canUpdate.push(
                  {
                    queryId: z,
                    parameters: [
                      {
                        paramName: colName,
                        paramValue: colVal
                      }
                    ],
                    link: this.testLinks,
                    isHidden: [],
                    whereCond: this.getWhereCond
                  }
                );
              }
            }
          }
        }
      } else {
        jsonQbe_canUpdate.push(
          {
            queryId: z,
            parameters: [
              {
                paramName: '',
                paramValue: ''
              }
            ],
            link: [],
            isHidden: [],
            whereCond: this.getWhereCond
          }
        );
      }
    }

    const canUpdateUrl = from(axios.post(GlobalConstants.getQbeIdApi + z + "/0", jsonQbe_canUpdate));
    const canUpdate = await lastValueFrom(canUpdateUrl);

    if (canAdd.data[0] == 1) {
      this.toolBar += "a";
    }
    if (canUpdate.data[0] == 1) {
      this.toolBar += "m";
    }
    if (canDelete.data[0] == 1) {
      this.toolBar += "d";
    }

    if (w != -1) {
      hasSourceQuery = 1;
    }

    const getTabConfigurationApiUrl = from(axios.get(GlobalConstants.getTabConfigurationApi + this.objectId));
    const getTabConfigurationApi = await lastValueFrom(getTabConfigurationApiUrl);
    isGrid = getTabConfigurationApi.data[0].isGrid;

console.log("is grid ya  >>>>>>>>>>>>>>>>>>>>>>> : " , isGrid);
console.log("all TABS>>>>>>>>>>>>>>>",this.allTabsTemp);
    ////////////////elie//////////////////////////////////
    console.log("AMINFO>>>>>>>>>>>>",this.amInfo);
    console.log("getTabConfigurationApi.data[0].isMain>>>>>>>>>>>>",getTabConfigurationApi.data[0].isMain);

    if (this.amInfo.isFromLink && this.amInfo.isFromLink == 1 && !this.amInfo.isFromButtonClick && getTabConfigurationApi.data[0].isMain == "1") {
      //test2
      console.log("this.informationservice.getPopupBreadcrumb():",this.informationservice.getPopupBreadcrumb());
      console.log("this.informationservice.getPreviousMainTab():",this.informationservice.getPreviousMainTab());
      console.log("getTabConfigurationApi.data[0].menuName:",getTabConfigurationApi.data[0].menuName);

      if (getTabConfigurationApi.data[0].menuName == this.informationservice.getPreviousMainTab()) {
        isGrid = 0;
        console.log("tes1");
      }
      console.log("TABLE OPTIONS>>>>>>>>>>>>> " , this.tableOptions1);
      console.log("ALL TABS TEMP>>>>>>>>>>",this.allTabsTemp);
      console.log("ALL TABS TEMP LENGTH>>>>>>>>>>",this.allTabsTemp.length);

      //////for alert monitoring kyc general info////////////
      if(this.allTabsTemp.length>1){
      for(let i=0;i<this.allTabsTemp.length;i++){
        if(this.allTabsTemp[i].parentId==null){
          isGrid=0;
          break;
        }


        //if(this.allTabsTemp[i].parentId==null && this.allTabsTemp[i].objec){}
          //if(this.allTabsTemp[i])
      }
    }
      /////////////////////////////////////////////////
      ///////////////////////////////////////////////
    }

    else
      if (this.amInfo.isFromLink && this.amInfo.isFromLink == 1 && !this.amInfo.isFromButtonClick) {

        isGrid = getTabConfigurationApi.data[0].isGrid;

      } else {
        if (getTabConfigurationApi.data[0].isMain == "1" &&
            getTabConfigurationApi.data[0].isGrid == "1" &&
            this.amInfo.buttonClick == undefined) {
          isGrid = 0
        } else if (getTabConfigurationApi.data[0].isMain == "0" &&
                   getTabConfigurationApi.data[0].isGrid == "1" &&
                   this.isFromGridClick == 1) {
          isGrid = 0
        } else if (getTabConfigurationApi.data[0].isMain == "1" &&
                   getTabConfigurationApi.data[0].isGrid == "1" &&
                   this.amInfo.buttonClick == 14) {
          isGrid = getTabConfigurationApi.data[0].isGrid;
        } else {
          isGrid = getTabConfigurationApi.data[0].isGrid;
        }
      }
    if (this.amInfo.isFromButtonClick && this.amInfo.isFromButtonClick == 1) {
      isGrid = getTabConfigurationApi.data[0].isGrid;
    }

    if (getTabConfigurationApi.data[0].isMain == "1" && getTabConfigurationApi.data[0].isGrid == "0" && this.amInfo.buttonClick == 14) {
      this.actionType = 'update';
    }


    console.log("button grid >>>>>>>>>>>>>>>>>>>> : " , isGrid);
    this.isPageGrid = isGrid == 1 ? true : false;
    //make buttons appear under a grid
    const getColumnsApiUrl = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
    const getColumnsApi = await lastValueFrom(getColumnsApiUrl);
    let buttons: any = getColumnsApi.data.filter((el: any) => {
      console.log("my val >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : " ,el);

      return el.columnTypeCode === "14";
    });
    this.testButtons = buttons;

    if (isGrid == 0) {
      this.informationservice.setFormToOpen("yes");
    }
    else {
      this.informationservice.setFormToOpen("no");
    }

    const getColumnsApiUrl0 = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
    const getColumns0Api = await lastValueFrom(getColumnsApiUrl0);
    if (isGrid == 1 && hasSourceQuery == 0) {
      this.agColumns = [];
      this.agColumnsJson = "";

      let jsonData = JSON.parse(this.dynamicFormQuering(getColumnsApi.data, 'select', this.amInfo));
      console.log("TESTTABLE>>>>>>>>>>>",jsonData);
      let tableNames: string = '';
      for (let u = 0; u < jsonData.length; u++) {
        tableNames = tableNames + "," + jsonData[u].tableName;
      }
      tableNames = tableNames.substring(1);
      let param1 = this.amInfo.selectedRowId;

      let jsonVal = [{
        objectId: this.objectId,
        selectedRowId: JSON.stringify(this.handleSelectedRowIds(param1, "grid,button")),
        primaryColumn: "ROW_ID",
        dynamicTable: jsonData,
      }];

      const getDynamicGridHeadersUrl = from(axios.post(GlobalConstants.getDynamicGridHeaders, jsonVal));
      const getDynamicGridHeaders = await lastValueFrom(getDynamicGridHeadersUrl);
      let headerData = getDynamicGridHeaders.data;
      const getColumnIdApiUrl2 = from(axios.post(GlobalConstants.getDynamicGridHeaders, jsonVal));
      const getColumnIdApi2 = await lastValueFrom(getColumnIdApiUrl2);
      this.columnId = getColumnIdApi2.data.description;
      //test2
      this.informationservice.setROW_ID(this.columnId);

      this.agColumnsJson = headerData;
      this.agColumns.push(this.agColumnsJson);
      this.previewGridApi = GlobalConstants.getDynamicGridData;
      this.previewGridApiParam = jsonVal;
      this.isFromGridClick = 0;
      this.gridStaticData = -1;
      this.test_1 = '1';

      // Show a Button if it is a main or Preview saved from button creation(newButtonComponent.ts)
      let listOfButtons: any = getColumns0Api.data.filter((el: any) => {

        return el.columnTypeCode == 14;
      });
      for (let i = 0; i < listOfButtons.length; i++) {
        if (listOfButtons[i].columnTypeCode == 14) {

          const getButtonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + listOfButtons[i].id));
          const getButtonData = await lastValueFrom(getButtonDataUrl);
          let data1 = getButtonData.data;
          if (data1.blobFile != null && data1.blobFile != undefined) {
            const base64EncodedString = data1.blobFile;
            const decodedString = atob(base64EncodedString);

            let n = decodedString.split("~A~");
            // let lastPart = n.pop();
            let lastPart = decodedString.split("~A~")[4];
            if (lastPart == "false") {
              this.previewButton = false;
            } else {
              this.previewButton = true;
            }
          }
        }
      }

    } else if (isGrid == 1 && hasSourceQuery == 1) {
      //Make Button ReadOnly (Send for approval)
      for (let i = 0; i < this.testButtons.length; i++) {
        const getButtonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + this.testButtons[i].id));
        const getButtonData = await lastValueFrom(getButtonDataUrl);
        let data1 = getButtonData.data;

console.log("data1 ------->",data1);
        if (data1.blobFile != null && data1.blobFile != undefined) {
          const base64EncodedString = data1.blobFile;
          const decodedString = atob(base64EncodedString);
          let condition: any = decodedString.split("~A~")[5];
          let conditionQuery = condition == null ? -1 : condition;
           if(condition == 'null'){
            conditionQuery = -1;
           }
          if (conditionQuery != -1 && conditionQuery != "") {
            const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + conditionQuery));
            const paramNames = await lastValueFrom(paramNamesUrl);

            jsonCondition.push(
              {
                queryId: conditionQuery,
                parameters: [
                  {
                    paramName: 'actionType',
                    paramValue: '' + this.actionType + ''
                  },
                  {
                    paramName: 'userId',
                    paramValue: this.userId
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            )

            if (paramNames.data.length > 0) {
              // Filter ROW_ID information to get only the ones for Grid
              let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
              if (params != undefined) {
                let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid");
                for (let i = 0; i < filteredParams.length; i++) {
                  for (let j = 0; j < paramNames.data.length; j++) {
                    if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                      let colName = filteredParams[i].colname;
                      let colVal = filteredParams[i].colvalue;
                      jsonCondition.push(
                        {
                          queryId: conditionQuery,
                          parameters: [
                            {
                              paramName: colName,
                              paramValue: colVal
                            }
                          ],
                          link: this.testLinks,
                          isHidden: [],
                          whereCond: this.getWhereCond
                        }
                      );
                    }
                  }
                }
              }
            } else {
              jsonCondition.push(
                {
                  queryId: conditionQuery,
                  parameters: [
                    {
                      paramName: '',
                      paramValue: ''
                    }
                  ],
                  link: [],
                  isHidden: [],
                  whereCond: this.getWhereCond
                }
              );
            }
          }

          if (conditionQuery != "" && conditionQuery != null) {
            console.log("test hahahahhahahaha ");
            const conditionUrl = from(axios.post(GlobalConstants.getQbeIdApi + conditionQuery + "/0", jsonCondition));
            const ConditionResult = await lastValueFrom(conditionUrl);
            if (ConditionResult.data[0] == 1) {
              this.testButtons[i].readOnly = true;
            }
            else {
              this.testButtons[i].readOnly = false;
            }
          }
        }
      }
      //end of ReadOnly
      this.testLinks = [];
      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + w));
      const paramNames = await lastValueFrom(paramNamesUrl);
      // Show a Button if it is a main or Preview saved from button creation(newButtonComponent.ts)
      const getColumnsApiUrl0 = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
      const getColumns0Api = await lastValueFrom(getColumnsApiUrl0);

      let listOfButtons: any = getColumns0Api.data.filter((el: any) => {

        return el.columnTypeCode == 14;
      });

      for (let i = 0; i < listOfButtons.length; i++) {
        if (listOfButtons[i].columnTypeCode == 14) {
          const getButtonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + listOfButtons[i].id));
          const getButtonData = await lastValueFrom(getButtonDataUrl);
          let data1 = getButtonData.data;
          if (data1.blobFile != null && data1.blobFile != undefined) {
            const base64EncodedString = data1.blobFile;
            const decodedString = atob(base64EncodedString);

            let n = decodedString.split("~A~");
            let lastPart = decodedString.split("~A~")[4];
            if (lastPart == "false") {
              this.previewButton = false;
            } else {
              this.previewButton = true;
            }
          }
        }
      }


      let linkColumn: any = getColumns0Api.data.filter((el: any) => {
        return el.isLink === "1";
      });
      for (let f = 0; f < linkColumn.length; f++) {
        let item = {
          colName: linkColumn[f].name,
          isLink: linkColumn[f].isLink,
          menuName: linkColumn[f].menus,
          colDesc: linkColumn[f].columnDescription
        }
        this.testLinks.push(item);
      }

      let jsonQbe_sourceQuery: any[] = [];
      jsonQbe_sourceQuery.push(
        {
          queryId: w,
          parameters: [
            {
              paramName: 'actionType',
              paramValue: '' + this.actionType + ''
            },
            {
              paramName: 'userId',
              paramValue: this.userId
            }
          ],
          link: [],
          isHidden: [],
          whereCond: this.getWhereCond
        }
      )

      if (paramNames.data.length > 0) {
        if (this.amInfo.isFromButtonClick == 1) {

          for (let i = 0; i < this.amInfo.selectedRowId.length; i++) {
            let colName = this.amInfo.selectedRowId[i].colName;
            let colVal = this.amInfo.selectedRowId[i].colVal;
            jsonQbe_sourceQuery.push(
              {
                queryId: w,
                parameters: [
                  {
                    paramName: colName,
                    paramValue: colVal
                  }
                ],
                link: this.testLinks,
                isHidden: [],
                whereCond: this.getWhereCond
              }
            );
          }
        } else {
          // Filter ROW_ID information to get only the ones for Grid
          let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
          if (params != undefined) {
            let filteredParams: any = this.handleSelectedRowIds(params, "grid,button,form,combo");
            for (let i = 0; i < filteredParams.length; i++) {
              for (let j = 0; j < paramNames.data.length; j++) {

                if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {

                  let colName = filteredParams[i].colname;
                  let colVal = filteredParams[i].colvalue;
                  jsonQbe_sourceQuery.push(
                    {
                      queryId: w,
                      parameters: [
                        {
                          paramName: colName,
                          paramValue: colVal
                        }
                      ],
                      link: this.testLinks,
                      isHidden: [],
                      whereCond: this.getWhereCond
                    }
                  );
                }
              }
            }
          }
        }
      } else {
        jsonQbe_sourceQuery.push(
          {
            queryId: w,
            parameters: [
              {
                paramName: '',
                paramValue: ''
              }
            ],
            link: [],
            isHidden: [],
            whereCond: this.getWhereCond
          }
        );
      }
      const sourceQueryUrl = from(axios.post(GlobalConstants.getQbeIdApi + w + "/1", jsonQbe_sourceQuery));
      const sourceQuery = await lastValueFrom(sourceQueryUrl);
      if (sourceQuery.data.length > 0) {
        this.sourceQuery = sourceQuery.data[0];
        if (this.sourceQuery != "-1") {
          let gridHeaders = sourceQuery.data[0].headers[0];
          let gridResults = sourceQuery.data[0].result[0];

          this.agColumns = [];
          this.columnId = "ROW_ID";
          this.agColumnsJson = gridHeaders;
          this.agColumns.push(this.agColumnsJson);
          this.gridStaticData = gridResults;
          this.test_1 = '1';


        }
      }
    } else if (isGrid == 0) {
      this.dynamicDRBWhereCondition(this.objectId);

      const getColumnsApiUrl3 = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
      const getColumnsApi3 = await lastValueFrom(getColumnsApiUrl3);

      const getAllFieldSetsApiUrl = from(axios.get(GlobalConstants.getAllFieldSetsApi + this.objectId));
      const getAllFieldSetsApi = await lastValueFrom(getAllFieldSetsApiUrl);
      this.dynamicForm = new FormGroup({});
      this.loaderService.isLoading.next(true);
      for (let g = 0; g < getAllFieldSetsApi.data.length; g++) {
        let data_0 = getColumnsApi3.data.filter((el: any) => {
          return Number(el.groupId) === Number(getAllFieldSetsApi.data[g].id);
        });
        // data_0[i].columnTypeCode;
        this.test.push({ fieldSetId: getAllFieldSetsApi.data[g].id, fieldSetName: getAllFieldSetsApi.data[g].name });
        for (let i = 0; i < data_0.length; i++) {
          this.loaderService.isLoading.next(true);
          console.log("DATA>>>>>>>>>>>>",data_0[i].tableId);
          if (data_0[i].tableId == -1) {
console.log("data_0 >>>>>>>>>>>>>> ",data_0[i]);
            this.columnTypeCode = data_0[i].columnTypeCode;
          }
          // Handle Mandatory Fields
          if (data_0[i].isMandatory == 1 || data_0[i].isMandatory == 2) {
            data_0[i].isMandatory = true;
          } else {
            data_0[i].isMandatory = false;
          }

          // Handle Mandatory on fields based on a query
          let mandatoryQueryId = data_0[i].mandatoryQuery == null ? -1 : data_0[i].mandatoryQuery;
          let jsonQbe_mandatoryQuery: any[] = [];

          if (mandatoryQueryId != -1) {
            const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + mandatoryQueryId));
            const paramNames = await lastValueFrom(paramNamesUrl);
            jsonQbe_mandatoryQuery.push(
              {
                queryId: mandatoryQueryId,
                parameters: [
                  {
                    paramName: 'actionType',
                    paramValue: '' + this.actionType + ''
                  },
                  {
                    paramName: 'userId',
                    paramValue: this.userId
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            )

            if (paramNames.data.length > 0) {
              // Filter ROW_ID information to get only the ones for Grid
              let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
              if (params != undefined) {
                let filteredParams: any = this.handleSelectedRowIds(params, "tab,form,grid");
                for (let i = 0; i < filteredParams.length; i++) {
                  for (let j = 0; j < paramNames.data.length; j++) {
                    if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                      let colName = filteredParams[i].colname;
                      let colVal = filteredParams[i].colvalue;
                      jsonQbe_mandatoryQuery.push(
                        {
                          queryId: mandatoryQueryId,
                          parameters: [
                            {
                              paramName: colName,
                              paramValue: colVal
                            }
                          ],
                          link: this.testLinks,
                          isHidden: [],
                          whereCond: this.getWhereCond
                        }
                      );
                    }
                  }
                }
              }
            } else {
              jsonQbe_mandatoryQuery.push(
                {
                  queryId: mandatoryQueryId,
                  parameters: [
                    {
                      paramName: '',
                      paramValue: ''
                    }
                  ],
                  link: [],
                  isHidden: [],
                  whereCond: this.getWhereCond
                }
              );
            }
          }

          const mandatoryQueryUrl = from(axios.post(GlobalConstants.getQbeIdApi + mandatoryQueryId + "/0", jsonQbe_mandatoryQuery));
          const mandatoryQuery = await lastValueFrom(mandatoryQueryUrl);

          if (mandatoryQuery.data[0] == 1) {
            data_0[i].mandatoryQuery = true;
          } else {
            data_0[i].mandatoryQuery = false;
          }

          // Handle suspended Fields
          if (data_0[i].isSuspended == 1) {
            data_0[i].isSuspended = true;
          } else {
            data_0[i].isSuspended = false;
          }

          // Handle readOnly on fields based on a query
          if (data_0[i].qbeReadOnly != undefined) {
            const qbeReadOnlyUrl = from(axios.post(GlobalConstants.getQbeIdApi + data_0[i].qbeReadOnly + "/0", this.jsonEmpty));
            const qbeReadOnly = await lastValueFrom(qbeReadOnlyUrl);
            data_0[i].qbeReadOnly = qbeReadOnly.data[0] ? true : false;
          } else {
            data_0[i].qbeReadOnly = false;
          }

          // Handle combo data if it's set as a combo and query is filled
          if (data_0[i].query != undefined) {
            let queryId = data_0[i].query;
            const paramQueryUrl = from(axios.get(GlobalConstants.getParamsNameApi + queryId));
            const paramNames = await lastValueFrom(paramQueryUrl);

            let jsonQbe: any[] = [];
            jsonQbe.push(
              {
                queryId: queryId,
                parameters: [
                  {
                    paramName: 'actionType',
                    paramValue: '' + this.actionType + ''
                  },
                  {
                    paramName: 'userId',
                    paramValue: this.userId
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            )

            if (paramNames.data.length > 0) {
              // Filter ROW_ID information to get only the ones for Grid
              let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;

              if (params != undefined) {
                let filteredParams: any = this.handleSelectedRowIds(params, "form,combo,button");

                for (let i = 0; i < filteredParams.length; i++) {
                  for (let j = 0; j < paramNames.data.length; j++) {
                    if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                      let colName = filteredParams[i].colname;
                      let colVal = filteredParams[i].colvalue;

                      jsonQbe.push(
                        {
                          queryId: queryId,
                          parameters: [
                            {
                              paramName: colName,
                              paramValue: colVal
                            }
                          ],
                          link: [],
                          isHidden: [],
                          whereCond: this.getWhereCond
                        }
                      );
                    }
                  }
                }
              }
            } else {
              jsonQbe.push(
                {
                  queryId: queryId,
                  parameters: [
                    {
                      paramName: '',
                      paramValue: ''
                    }
                  ],
                  link: [],
                  isHidden: [],
                  whereCond: this.getWhereCond
                }
              );
            }
            const queryUrl = from(axios.post(GlobalConstants.getQbeIdApi + data_0[i].query + "/2", jsonQbe));
            const query = await lastValueFrom(queryUrl);
            data_0[i].query = query.data;
          }

          // Append field to dynamicForm
          //add Validators.email
          this.dynamicForm.addControl(data_0[i].name, new FormControl(''));

          // Handle basic standard columns automatically
          if (data_0[i].name == "UPDATE_DATE") {
            // Update Date to be set empty and hidden cause it's not needed on save new scenarios
            data_0[i].columnType = "hidden";
            data_0[i].isMandatory = false;
          } else if (data_0[i].name == "UPDATED_BY") {
            // Updated by to be set empty and hidden cause it's not needed on save new scenarios
            data_0[i].columnType = "hidden";
            data_0[i].isMandatory = false;
          } else if (data_0[i].name == "CREATED_BY") {
            // Created By to be set automatically by the user logged in to the application
            data_0[i].columnType = "hidden";
            data_0[i].isMandatory = false;
            this.handleFormFieldValues(data_0[i].name, this.userId);
          } else if (data_0[i].name == "CREATION_DATE") {
            // Creation date to be hidden and set by default system date
            data_0[i].columnType = "hidden";
            data_0[i].isMandatory = false;
            let currentDateTime = this.datepipe.transform((new Date), 'MM/dd/yyyy');
            this.handleFormFieldValues(data_0[i].name, currentDateTime);
          }

          // Fill foregin column by main screen's primary value
          if (foreignId === data_0[i].name) {
            data_0[i].columnType = "hidden";
            data_0[i].isMandatory = false;
            data_0[i].qbeReadOnly = 1;
            this.handleFormFieldValues(data_0[i].name, foreignValue);
          }

          // Primary column hidden because it will be auto generated by sequence
          if (data_0[i].name === this.amInfo.primaryColumn) {
            data_0[i].columnType = "hidden";
            data_0[i].isMandatory = false;
          }

          // In case of field is suspended
          if (data_0[i].isSuspended == true) {
            data_0[i].columnType = "hidden";
            data_0[i].isMandatory = false;
          }

          // Handle default value on saveNew scenarios only
          if (data_0[i].defaultValue != undefined) {

            let defaultValueVar = data_0[i].defaultValue;
            const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + defaultValueVar));
            const paramNames = await lastValueFrom(paramNamesUrl);

            let jsonQbe: any[] = [];
            jsonQbe.push(
              {
                queryId: defaultValueVar,
                parameters: [
                  {
                    paramName: 'actionType',
                    paramValue: '' + this.actionType + ''
                  },
                  {
                    paramName: 'userId',
                    paramValue: this.userId
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            )

            if (paramNames.data.length > 0) {
              // Filter ROW_ID information to get only the ones for Grid
              let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
              if (params != undefined) {
                let filteredParams: any = this.handleSelectedRowIds(params, "gridlink,grid,form,combo,button");
                for (let i = 0; i < filteredParams.length; i++) {
                  for (let j = 0; j < paramNames.data.length; j++) {
                    if (paramNames.data[j].paramName != "" && filteredParams[i].colname != "") {
                      if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                        let colName = filteredParams[i].colname;
                        let colVal = filteredParams[i].colvalue;
                        jsonQbe.push(
                          {
                            queryId: defaultValueVar,
                            parameters: [
                              {
                                paramName: colName,
                                paramValue: colVal
                              }
                            ],
                            link: this.testLinks,
                            isHidden: [],
                            whereCond: this.getWhereCond
                          }
                        );
                      }
                    }
                  }
                }
              }
            } else {
              jsonQbe.push(
                {
                  queryId: defaultValueVar,
                  parameters: [
                    {
                      paramName: '',
                      paramValue: ''
                    }
                  ],
                  link: [],
                  isHidden: [],
                  whereCond: this.getWhereCond
                }
              );
            }
            const defaultValueUrl = from(axios.post(GlobalConstants.getQbeIdApi + defaultValueVar + "/0", jsonQbe));
            const defaultValuee = await lastValueFrom(defaultValueUrl);

            let defaultVal: any = '';
            let result = defaultValuee.data[0];

            if (typeof (result) == "string") {
              let formats = [moment.ISO_8601, "MM/DD/YYYY  :)  HH*mm*ss"];
              let checkDateValidity = moment(result, formats, true).isValid();
              if (checkDateValidity) {
                defaultVal = result.substring(0, result.indexOf("T"));
              } else {
                defaultVal = result;
              }
            } else {
              defaultVal = result;
            }
            this.handleFormFieldDefaultValues(data_0[i].name, defaultVal);
          }

          data_0[i].fieldSetId = getAllFieldSetsApi.data[g].id;
          data_0[i].fieldSetName = '';

          // Show a Button if it is a main or Preview saved from button creation(newButtonComponent.ts)
          if (data_0[i].columnTypeCode == 14) {

            const getButtonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + data_0[i].id));
            const getButtonData = await lastValueFrom(getButtonDataUrl);

            let data1 = getButtonData.data;
            //nadine
            if (data1.blobFile != null && data1.blobFile != undefined) {
              const base64EncodedString = data1.blobFile;
              const decodedString = atob(base64EncodedString);

              let n = decodedString.split("~A~");
              let condition = decodedString.split("~A~")[5];
              // let lastPart = n.pop();
              let lastPart = decodedString.split("~A~")[4];
              if (lastPart == "false") {
                data_0[i].mainAndPreview = false;
                this.previewButton = false;
              } else {
                data_0[i].mainAndPreview = true;
                this.previewButton = true;
              }

              let conditionQuery = condition == null ? -1 : condition;

            }
          }

          // close a dialog and return data
          if(this.listOfData == undefined){
            if(this.informationservice.getListOfData() != ''){
              this.listOfData = this.informationservice.getListOfData();
              this.informationservice.removeListOfData();
            }
          }
          if (this.listOfData != undefined) {
            if (this.listOfData.columns == undefined) {
              this.dynamicForm.patchValue(this.listOfData);
              const controlNames = Object.keys(this.dynamicForm.controls);
              let data = controlNames.filter((el: any) => {
                return el === data_0[i].name;
              });
              this.handleFormFieldValues(data[0], this.dynamicForm.controls[data[0]]?.value);
            }
          }

          if (data_0[i].isEditable == "0") {
            this.test.push(data_0[i]);
            if (i == data_0.length - 1) {
              this.test_1 = '1';
            }
          } else {
            this.listOfHeaders.push(data_0[i])
          }
          this.loaderService.isLoading.next(false);
        }
      }

      this.loaderService.isLoading.next(false);
      if (this.actionType == "update") {

        let jsonData = JSON.parse(this.dynamicFormQuering(getColumnsApi3.data, 'select', '-1'));

        let jsonVal = [{
          objectId: this.objectId,
          selectedRowId: JSON.stringify(this.handleSelectedRowIds(this.amInfo.selectedRowId, "form,button")),
          primaryColumn: "ROW_ID",
          dynamicTable: jsonData,
          whereConditions: this.whereConditionAr
        }];
        // Load dynamic form data
        let dataa:any=[];
        if(this.tableOptionTemp[0].isDynamicReport=='1'){
          const getDynamicReportDataUrl = from(axios.get(GlobalConstants.getDynamicReportData+this.informationservice.getDynamicReportId()));
          const getDynamicReportData = await lastValueFrom(getDynamicReportDataUrl);
          dataa = getDynamicReportData.data;
        }else{console.log("jsonVal ------------",jsonVal)
          const getDynamicFormDataUrl = from(axios.post(GlobalConstants.getDynamicFormData, jsonVal));
          const getDynamicFormData = await lastValueFrom(getDynamicFormDataUrl);
          dataa = getDynamicFormData.data;
        }

        console.log("dataa ------",dataa)

        for (let i = 0; i < dataa.length; i++) {
          this.loaderService.isLoading.next(true);
          let colName = dataa[i].colName.toUpperCase();
          let colValue = dataa[i].colValue;
          let colType = dataa[i].colType;
          // Remove time from date value
          if (colType == "date") {
            let date = new Date(colValue.substring(0, 10));
            colValue = date.toISOString().substring(0, 10);
            this.handleFormFieldValues(colName, colValue);
          }


          if (colType == "date time") {
            // let date = new Date(colValue.substring(0, 10));
            // colValue = date.toISOString().slice(0, 16);
            this.handleFormFieldValues(colName, colValue);
          }

          if (colType == "time") {
            let date = new Date(colValue.substring(0, 10));
            colValue = colValue.toString();
            this.handleFormFieldValues(colName, colValue);
          }

          if (colType == "checkbox") {
            //test1
            console.log("THIS IS A CHECKBOX>>>>>>>>>>",colValue);
            if(colValue=="true"){

              colValue=true;
              console.log("TRUE CHECKBOX",colValue);

            }else{

              colValue=false;
              console.log("FALSE CHECKBOX",colValue);

            }
          }

          if (colType == "lookup") {

            let occ = 0;
            if (colValue.includes(",")) {
              let colArrayVal = colValue.split(",")
              for (let o = 0; o < colArrayVal.length; o++) {
                for (let h = 0; h < this.test.length; h++) {
                  if (this.test[h].query) {
                    for (let k = 0; k < this.test[h].query.length; k++) {
                      if (this.test[h].query[k].ID == colArrayVal[o] && this.test[h].name == colName) {
                        occ = occ + 1;
                        break;
                      }

                    }
                  }
                }
                this.handleFormFieldValues(colName, colValue);
                $('#' + colName + "_lookupName").val("Selected (" + occ + ")");

                localStorage.setItem('agGidSelectedLookup_(' + colName + ')_id', colValue);
                localStorage.setItem('agGidSelectedLookup_(' + colName + ')_name', "Selected (" + occ + ")");
                // this.informationservice.setDynamicService('agGidSelectedLookup_(' + colName + ')_id', colValue);
                // this.informationservice.setDynamicService('agGidSelectedLookup_(' + colName + ')_name', "Selected (" + occ + ")");

              }
            } else {

              let b = false;
              let colId = '';
              let fieldName = '';
              for (let h = 0; h < this.test.length; h++) {

                if (this.test[h].query) {


                  for (let k = 0; k < this.test[h].query.length; k++) {
                    //elie updated
                    if (this.test[h].query[k].ID == colValue && colName==this.test[h].name) {
                      b = true;
                      colId = this.test[h].query[k].ID;
                      fieldName = colName;
                      colValue = this.test[h].query[k].NAME;
                      break;
                    }
                  }
                }

                if (b) {
                  localStorage.setItem('agGidSelectedLookup_(' + colName + ')_id', colId);
                  localStorage.setItem('agGidSelectedLookup_(' + colName + ')_name', colValue);
                  // this.informationservice.setDynamicService('agGidSelectedLookup_(' + colName + ')_id', colId);
                  // this.informationservice.setDynamicService('agGidSelectedLookup_(' + colName + ')_name', colValue);
                  break;

                }
              }

              this.handleFormFieldValues(colName, colId);
              if(this.dynamicForm.controls[fieldName + "_lookupName"]){
                this.dynamicForm.controls[fieldName + "_lookupName"].setValue(colValue);
              }
               $('#' + fieldName + "_lookupName").val(colValue);
            }
          }


          if (colType == "text" || colType == "textarea" || colType == "combo" || colType == "number" || colType == "file" || colType == "phone number" || colType == "e-mail" || colType == "signature" || colType == "checkbox") {
            this.handleFormFieldValues(colName, colValue);
          }

          if (colType == "hidden") {
            if (colName == "UPDATE_DATE") {
              let currentDateTime = this.datepipe.transform((new Date), 'MM/dd/yyyy');
              this.handleFormFieldValues(colName, currentDateTime);
            } else if (colName == "UPDATED_BY") {
              this.handleFormFieldValues(colName, this.userId);
            } else if (colName == "CREATED_BY") {
              this.handleFormFieldValues(colName, colValue);
            } else if (colName == "CREATION_DATE") {
              let date = new Date(colValue);
              let datee = this.datepipe.transform(date, 'MM/dd/yyyy');
              this.handleFormFieldValues(colName, datee);
            } else {
              this.handleFormFieldValues(colName, colValue);
            }
          }

          if (foreignId === colName) {
            this.handleFormFieldValues(colName, colValue);
          } else if (colName === this.amInfo.primaryColumn) {
            this.handleFormFieldValues(colName, colValue);
          }
          this.loaderService.isLoading.next(false);
        }

        // Load field dependencies
        setTimeout(async () => {
          this.loadFieldDependencyForForm();
        }, 100);

        this.dynamicDRBOnload(this.objectId);
      }
      this.isFromGridClick = 0;

      // Hide all fieldsets that contain all it's fields hidden
      setTimeout(() => {
        this.handleFormFieldsetsAfterLoad();
        this.showTheGridIntoForm();
      }, 150);

      // Run Dynamic Rule Builder onLoad rules
      setTimeout(() => {
console.log("befor calling the load rules");
        this.dynamicDRBOnload(this.objectId);
      }, 1200)
    }
    setTimeout(() => {
      this.handleSaveButton();
    }, 900);

    this.loaderService.isLoading.next(false);
    this.listOfData = undefined;
    //fill the form (after close a popup)
    console.log("this.test >>>>>>>>><><><><>>>>>>>>>",this.test);
    this.allData = this.test;
    console.log("in the end of getAllColums ==",this.columnTypeCode);
    console.log("this.amInfo=",this.amInfo)

    //test2
    let selectedTabName = this.informationservice.getSelectedTabName();

    if (this.informationservice.getDynamicService("formData_" + selectedTabName)) {

      this.formData = JSON.parse(this.informationservice.getDynamicService("formData_" + selectedTabName));
      if (this.formData) {
        this.setFormValues();
      }
    }
  }


  handleSaveButton() {
    console.log("handleSaveButton()");
    let groupId = '';
    for (let i = 0; i < this.testButtons.length; i++) {
      if (this.testButtons[i].name == 'Check Existing') {
        this.idOfCheckExisting = this.testButtons[i].id;
        groupId = this.testButtons[i].groupId;
        //test2
        if (this.informationservice.getCheckExisting() == 'yes') {
          this.showAndHideButtons(1234, this.idOfCheckExisting);
        }
        else if(this.informationservice.getSkip() == "yes"){
          this.showAndHideButtons(1234, this.idOfCheckExisting);
        }
        else {
          if (this.actionType == "saveNew") {
            this.showAndHideButtons(this.idOfCheckExisting, 1234);
            $("#fieldSet_" + groupId).show();// show
          }
          if (this.actionType == "update") {
            this.showAndHideButtons(1234, this.idOfCheckExisting);
            $("#fieldSet_" + groupId).hide();// hide
          }
        }
        //test2
        this.informationservice.setCheckExisting('no');
      }
    }
  }

  handleFormFieldsetsAfterLoad() {
    let allPageFieldsets = $(".fieldsetElem");


    for (let i = 0; i < allPageFieldsets.length; i++) {
      let fieldsetelem_id = allPageFieldsets[i].id;
      let allFieldsetFields = $("." + fieldsetelem_id);
      let NbOfFields = allFieldsetFields.length;
      let foundHiddenElems: number = 0;
      for (let j = 0; j < allFieldsetFields.length; j++) {
        if (allFieldsetFields[j].id != "") {
          if ($("#" + allFieldsetFields[j].id).attr("type") == "hidden") {
            foundHiddenElems += 1;
          }
        }
      }
      if (foundHiddenElems == NbOfFields) {
        $("#" + fieldsetelem_id).addClass("hidden");
      }

    }


  }

  handleFormFieldDefaultValues(fieldName: string, value: any) {
    this.dynamicForm.controls[fieldName].setValue('');
    if (this.dynamicForm.get(fieldName)) {
      this.dynamicForm.removeControl(fieldName);
      this.dynamicForm.addControl(fieldName, new FormControl(''));
      if (value == 0) {
        this.dynamicForm.controls[fieldName].setValue('0');
      } else {
        this.dynamicForm.controls[fieldName].setValue(value);
      }
      if (value != null) {
        this.registerTouchedField(fieldName);
      }
      this.cdr.detectChanges();
    }
  }

  handleFormFieldValues(fieldName: string, value: any) {
    // for (let i = 0; i < this.test.length; i++) {
    //   if (this.test[i].columnType == "signature" && this.test[i].name == fieldName) {
    //     localStorage.setItem("signatureImage",value);
    //     this.oldsignature = value;
    //     break;
    //   }
    // }
    // let data = this.test.filter((el: any) => {
    //   return el.name === fieldName;
    // });
    // this.dynamicForm.controls[fieldName].setValue('');
    // if (this.dynamicForm.get(fieldName)) {
    //   this.dynamicForm.removeControl(fieldName);
    //   this.dynamicForm.addControl(fieldName, new FormControl(''));

    //jppppppppppp
    console.log("fieldName=",fieldName);
    console.log("CHECKBOX VALUE>>>>>>",value);
    const fieldNames = fieldName.split(',');

    // Loop over each field name
    for (let j = 0; j < fieldNames.length; j++) {
        const currentFieldName = fieldNames[j].trim();
    for (let i = 0; i < this.test.length; i++) {
      
      if (this.test[i].columnType == "signature" && this.test[i].name == currentFieldName) {
        localStorage.setItem("signatureImage",value);
        this.oldsignature = value;
        break;
      }
    }
    let data = this.test.filter((el: any) => {
      return el.name === currentFieldName;
    });

    this.dynamicForm.controls[currentFieldName].setValue('');
    console.log('currentFieldName ----------',currentFieldName)

    if (this.dynamicForm.get(currentFieldName)) {
      this.dynamicForm.removeControl(currentFieldName);
      this.dynamicForm.addControl(currentFieldName, new FormControl(''));
console.log('value ----------',value)
      if (value == null || value == 'null' || value == 'empty') {
        value = '';
      }
      if(data[0] != undefined && data[0].columnType == "combo"){
        let newQuery : any;
        newQuery = data[0].query;
        // change this code to a dynamic code
        // if(newQuery = [0]){
        //   newQuery = [{id: '0', name: 'NO'}, {id: '1', name: 'YES'}]
        // }
        console.log("newQuery ===>",newQuery);
        data[0].query = [];
        this.cdr.detectChanges();
        data[0].query = newQuery;
        this.dynamicForm.controls[currentFieldName].setValue(value.toString());
    } else if(data[0] != undefined && data[0].columnType == "checkbox"){
      console.log("CHECKBOX VALUE 3333333>>>>>>>>>>",value);
        this.dynamicForm.controls[currentFieldName].setValue(value);
    }
      else {
        this.dynamicForm.controls[currentFieldName].setValue(value.toString());
      }
      if (value != null) {
        this.registerTouchedField(currentFieldName);
      }
      this.cdr.detectChanges();
    }
  }
  }

  async loadFieldDependencyForForm() {

    const getFieldDependenciesUrl = from(axios.post(GlobalConstants.getFieldDependencies + this.objectId));
    const getFieldDependencies = await lastValueFrom(getFieldDependenciesUrl);
    let data = getFieldDependencies.data;


    let fieldName: string = '';
    for (let i = 0; i < data.length; i++) {


      if ($("#field_" + data[i].COLUMN_ID).length > 0) {
        fieldName = $("#field_" + data[i].COLUMN_ID).attr("class").split(" ")[0];
      } else {
        fieldName = $(".field_" + data[i].COLUMN_ID).attr("class").split(" ")[0];
      }


      const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + data[i].DEPENDENT_QBE_ID));
      const paramNames = await lastValueFrom(paramNamesUrl);
      let dataa = paramNames.data;
      // this.jsonQbe = [];
      this.testLinks = [];
      let jsonQbe: any[] = [];
      jsonQbe.push(
        {
          queryId: data[i].DEPENDENT_QBE_ID,
          parameters: [
            {
              paramName: 'actionType',
              paramValue: '' + this.actionType + ''
            },
            {
              paramName: 'userId',
              paramValue: this.userId
            }
          ],
          link: [],
          isHidden: [],
          whereCond: this.getWhereCond
        }
      )

      let hasEmptyValues = 0;
      for (let h = 0; h < dataa.length; h++) {
        let value = this.dynamicForm.controls[dataa[h].paramName]?.value;
        if (value == "") {
          hasEmptyValues = 1;
        }

        jsonQbe.push(
          {
            queryId: data[i].DEPENDENT_QBE_ID,
            parameters: [
              {
                paramName: dataa[h].paramName,
                paramValue: value
              }
            ],
            link: this.testLinks,
            isHidden: [],
            whereCond: this.getWhereCond
          }
        );
      }

      if (hasEmptyValues == 0) {
        const dependentDefaultValUrl = from(axios.post(GlobalConstants.getQbeIdApi + data[i].DEPENDENT_QBE_ID + "/0", jsonQbe));
        const dependentDefaultVal = await lastValueFrom(dependentDefaultValUrl);
        let b = false;
        let colId = '';
        let colValue = '';
        let columnType = '';

        for (let h = 0; h < this.test.length; h++) {

          if (this.test[h].query) {
            for (let k = 0; k < this.test[h].query.length; k++) {
              if (this.test[h].query[k].ID == dependentDefaultVal.data[0]) {
                b = true;
                colId = this.test[h].query[k].ID;
                colValue = this.test[h].query[k].NAME;
                columnType = this.test[h].query[k].NAME
                break;
              }
            }
          }
          if (b) {

            localStorage.setItem('agGidSelectedLookup_(' + fieldName + ')_id', colId);
            localStorage.setItem('agGidSelectedLookup_(' + fieldName + ')_name', colValue);
            this.handleFormFieldValues(fieldName, colId);
            $('#' + fieldName + "_lookupName").val(colValue);
            break;

          }
        }



        if (!b) {
          if (dependentDefaultVal.data[0]) {
            this.handleFormFieldValues(fieldName, dependentDefaultVal.data[0]);
          }
        }
      }
    }
  }
//jp
  async onShowButtonForm(buttonId: number) {
    this.informationservice.setPreviousTab(this.informationservice.getSelectedTabName());
    let mainTab = this.informationservice.getMainTab();
    const getButtonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + buttonId));
    const getButtonData = await lastValueFrom(getButtonDataUrl);
    let data1 = getButtonData.data;
    this.columnTypeCode = data1.columnType;

    if (data1.blobFile != null && data1.blobFile != undefined) {
      const base64EncodedString = data1.blobFile;
      const decodedString = atob(base64EncodedString);

      let procedureName = decodedString.split("~A~")[0];
      let buttonAction: any = decodedString.split("~A~")[1];
      let isMainPreview: any = decodedString.split("~A~")[4];

      let params = decodedString.split("~A~")[2];
      let url = decodedString.split("~A~")[3];
      let otherCondition = decodedString.split("~A~")[6];
      let alertValue = decodedString.split("~A~")[7];
      let thirdCondition = decodedString.split("~A~")[8];
      let alertMessage = decodedString.split("~A~")[9];
      this.buttonObjectId = procedureName;
      // Call Procedure
      if (buttonAction == 2) {
        let obj;
        if (otherCondition != null && otherCondition != "") {
          //call the query:
          let jsonCondition: any[] = [];
          let conditionQuery = otherCondition;
          const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + conditionQuery));
          const paramNames = await lastValueFrom(paramNamesUrl);

          jsonCondition.push(
            {
              queryId: conditionQuery,
              parameters: [
                {
                  paramName: 'actionType',
                  paramValue: '' + this.actionType + ''
                },
                {
                  paramName: 'userId',
                  paramValue: this.userId
                }
              ],
              link: [],
              isHidden: [],
              whereCond: this.getWhereCond
            }
          )

          if (paramNames.data.length > 0) {
            // Filter ROW_ID information to get only the ones for Grid
            let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
            if (params != undefined) {
              let filteredParams: any = this.handleSelectedRowIds(params, "button");
              for (let i = 0; i < filteredParams.length; i++) {
                for (let j = 0; j < paramNames.data.length; j++) {
                  if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                    let colName = filteredParams[i].colname;
                    let colVal = filteredParams[i].colvalue;
                    jsonCondition.push(
                      {
                        queryId: conditionQuery,
                        parameters: [
                          {
                            paramName: colName,
                            paramValue: colVal
                          }
                        ],
                        link: this.testLinks,
                        isHidden: [],
                        whereCond: this.getWhereCond
                      }
                    );
                  }
                }
              }
            }
          } else {
            jsonCondition.push(
              {
                queryId: conditionQuery,
                parameters: [
                  {
                    paramName: '',
                    paramValue: ''
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            );
          }
          const conditionUrl = from(axios.post(GlobalConstants.getQbeIdApi + conditionQuery + "/0", jsonCondition));
          const ConditionResult = await lastValueFrom(conditionUrl);
          if (ConditionResult.data[0] == 1) {
            this.commonFunctions.alert("alert", alertValue);
            return;
          }
        }

        // 100%
        if (thirdCondition != null && thirdCondition != "") {
          //call the query:
          let jsonCondition: any[] = [];
          let conditionQuery = thirdCondition;
          const paramNamesUrl = from(axios.get(GlobalConstants.getParamsNameApi + conditionQuery));
          const paramNames = await lastValueFrom(paramNamesUrl);

          jsonCondition.push(
            {
              queryId: conditionQuery,
              parameters: [
                {
                  paramName: 'actionType',
                  paramValue: '' + this.actionType + ''
                },
                {
                  paramName: 'userId',
                  paramValue: this.userId
                }
              ],
              link: [],
              isHidden: [],
              whereCond: this.getWhereCond
            }
          )

          if (paramNames.data.length > 0) {
            // Filter ROW_ID information to get only the ones for Grid
            let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
            if (params != undefined) {
              let filteredParams: any = this.handleSelectedRowIds(params, "button");
              for (let i = 0; i < filteredParams.length; i++) {
                for (let j = 0; j < paramNames.data.length; j++) {
                  if (filteredParams[i].colname.toUpperCase() == paramNames.data[j].paramName.toUpperCase()) {
                    let colName = filteredParams[i].colname;
                    let colVal = filteredParams[i].colvalue;
                    jsonCondition.push(
                      {
                        queryId: conditionQuery,
                        parameters: [
                          {
                            paramName: colName,
                            paramValue: colVal
                          }
                        ],
                        link: this.testLinks,
                        isHidden: [],
                        whereCond: this.getWhereCond
                      }
                    );
                  }
                }
              }
            }
          } else {
            jsonCondition.push(
              {
                queryId: conditionQuery,
                parameters: [
                  {
                    paramName: '',
                    paramValue: ''
                  }
                ],
                link: [],
                isHidden: [],
                whereCond: this.getWhereCond
              }
            );
          }
          const conditionUrl = from(axios.post(GlobalConstants.getQbeIdApi + conditionQuery + "/0", jsonCondition));
          const ConditionResult = await lastValueFrom(conditionUrl);
          if (ConditionResult.data[0] == 1) {

            this.commonFunctions.alert("alert", alertMessage);
            return;
          }
        }

        if (params == undefined) {
          let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
          obj = {
            "procedureName": procedureName,
            "procParam": this.handleSelectedRowIds(params, "mainId")[0].colvalue,
            //test2
            "executedBy": this.informationservice.getLogeduserId()
          };
        } else {
          if (params.indexOf(",") != -1) {
            const arrayFromString = params.split(',').map(Number);
            // more than parameter
            let allParameters = "";
            for (let i = 0; i < arrayFromString.length; i++) {
              let formControlName = "";
              if ($("#field_" + arrayFromString[i]).length > 0) {
                formControlName = $("#field_" + arrayFromString[i]).attr("class").split(" ")[0];
                if (i == 0) {
                  allParameters = formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                } else {
                  allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                }
              } else if ($(".field_" + arrayFromString[i]).length > 0) {
                formControlName = $(".field_" + arrayFromString[i]).attr("class").split(" ")[0];
                if (i == 0) {
                  allParameters = formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                } else {
                  allParameters = allParameters + "~" + formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
                }
              }
            }
            if (allParameters != "") {
              obj = {
                "procedureName": procedureName,
                "procParam": allParameters,
                //test2
                "executedBy": this.informationservice.getLogeduserId()
              };
            }
          } else {
            let formControlName = "";
            let parameters = "";
            if ($("#field_" + params).length > 0) {
              formControlName = $("#field_" + params).attr("class").split(" ")[0];
              parameters = formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
              obj = {
                "procedureName": procedureName,
                "procParam": parameters,
                //test2
                "executedBy": this.informationservice.getLogeduserId()
              };
            } else if ($(".field_" + params).length > 0) {
              formControlName = $(".field_" + params).attr("class").split(" ")[0];
              parameters = formControlName + "/" + this.dynamicForm.controls[formControlName]?.value;
              obj = {
                "procedureName": procedureName,
                "procParam": parameters,
                //test2
                "executedBy": this.informationservice.getLogeduserId()
              };
            } else {
              let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
              obj = {
                "procedureName": procedureName,
                "procParam": this.handleSelectedRowIds(params, "mainId")[0].colvalue,
                //test2
                "executedBy": this.informationservice.getLogeduserId()
              };
            }
          }
        }


        if (this.dynamicForm.status == "INVALID" && !this.isPageGrid) {
          this.commonFunctions.alert("alert", "Please fill in mandatory fields");
        } else {
          this.http.post(GlobalConstants.callProcedure, obj).subscribe((data: any) => {

            this.commonFunctions.alert("alert", data.description);
            this.closeDialog(true);
          })
        }
      }
      // Form Opening
      else if (buttonAction == "1") {

        let formData = this.dynamicForm.value;
        //test2
        let selectedTabName = this.informationservice.getSelectedTabName();

        if(formData){
          this.listOfData = JSON.parse(JSON.stringify(formData));
        }
        this.informationservice.setDynamicService("formData_" + selectedTabName, JSON.stringify(formData));
       let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;

       if(this.informationservice.getAgGidSelectedNodeRule() != undefined){
        params =typeof (this.informationservice.getAgGidSelectedNodeRule()) == "string" ? JSON.parse(this.informationservice.getAgGidSelectedNodeRule()) : this.informationservice.getAgGidSelectedNodeRule();
       }
       console.log("params>>>>>>>>>>>",params);
        let data = [{
          actionType: this.amInfo.actionType,
          objectId: this.buttonObjectId,
          isFromGridClick: 0,
          primaryColumn: this.columnId,
          buttonClick: this.columnTypeCode,
          selectedRowId: this.handleSelectedRowIds(params, "grid,button,form,combo,gridlink"),
        }];

console.log("data testtt>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data);
        this.dialogRef = this.dialog.open(AmPreviewFormComponent, {
          width: "80%",
          height: "80%",
          data: data
        });

        this.dataservice.PushdialogArray(this.dialogRef);
        //test2
        this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());
        this.informationservice.setListOFData(this.listOfData);
        this.dialogRef.disableClose = true;
      }
      // Call Api
      else if (buttonAction == "3") {

        let formData = this.dynamicForm.value;
        if (formData) {
          this.listOfData = JSON.parse(JSON.stringify(formData));
        }

        let customerId = -1;
        let sessionId = -1;
        //test2
        let userId = this.informationservice.getLogeduserId();

        let nearBy = 0;
        let sameSession = 0;
        //test2
        if (this.informationservice.getStatusOfCheckExisting() == "nearMatch") {
          nearBy = 1;
        } else {
          nearBy = 0;
        }

        if(this.informationservice.getSameSession() == "sameSession"){
          sameSession = 1;
        }else{
          sameSession = 0;
        }


        if (params == '') {
          //test2
          params = this.informationservice.getAgGidSelectedNode();

          if (!isNaN(Number(params))) {

          } else {
            if (params.indexOf(",") != -1) {
              customerId = Number(params.split(",")[0].split('=')[1].trim());
              sessionId = Number(params.split(",")[1].split('=')[1].trim());
            } else {
              customerId = Number(params.split('=')[1].trim());
            }
          }


          let globalInfo = "{";
          globalInfo += "\"" + "colName" + "\"" + ":" + "\"" + "customer_id" + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + customerId + "\"" + "},";
          globalInfo += "{" + "\"" + "colName" + "\"" + ":" + "\"" + "session_id" + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + sessionId + "\"" + "}";

          let jsonArr: string = "{";
          //test2
          let ListOfData = JSON.parse(this.informationservice.getMainJsonForDataWhenSkip());

          jsonArr += "\"" + "columns" + "\" : [";
          for (let i = 0; i < ListOfData.columns.length; i++) {
            jsonArr += "{";

            jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + ListOfData.columns[i].colName + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + ListOfData.columns[i].colVal + "\"";

            if (i == ListOfData.columns.length - 1) {
              jsonArr += "}," + globalInfo;
            } else {
              jsonArr += "},";
            }
          }
          console.log("hey 3333 >>>>>>>>>>>");
          // jsonArr += "]," + "\"" + "sessionId" + "\"" + ":" + "\"" + sessionId + "\"" + "," + "\"" + "customerId" + "\"" + ":" + "\"" + customerId + "\"" + "," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + nearBy + "\"" + "}";
          jsonArr += "]," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + nearBy + "\"" + "," + "\"" + "sameSession" + "\"" + ":" + "\"" + sameSession + "\"" + "}";
          // jsonArr += "]," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + nearBy + "\"" + "}";
          this.mainJsonForApi = jsonArr;
          //test2
          this.informationservice.setMainJsonForDataWhenSkip(this.mainJsonForApi);
        }
        else {
          //globalJson ---> to get the session and the customer id
          let globalInfo: any[] = this.handleSelectedRowIds(this.amInfo.selectedRowId, "grid,form,button");
          let globalJson = "{";
          if (globalInfo.toString() == "-1") {
            globalJson = "";
          } else {
            for (let y = 0; y < globalInfo.length; y++) {
              if (globalInfo.length - 1 == y) {
                globalJson += "\"" + "colName" + "\"" + ":" + "\"" + globalInfo[y].colname + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + globalInfo[y].colvalue + "\"";
              } else {
                globalJson += "\"" + "colName" + "\"" + ":" + "\"" + globalInfo[y].colname + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + globalInfo[y].colvalue + "\"" + ",";
              }
            }
            globalJson += "}";
          }

          const arrayFromString = params.split(',').map(Number);
          const dynamicDRBOnBeforeSaveUrl = from(axios.post(GlobalConstants.getColNameAndColId, arrayFromString));
          const dynamicDRBOnBeforeSave = await lastValueFrom(dynamicDRBOnBeforeSaveUrl);

          const dynamicDRBOnBeforeSaveUrl1 = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
          const ApiResultGetAllColums = await lastValueFrom(dynamicDRBOnBeforeSaveUrl1);

          //creating Json to use it when i do a skip
          let JsonForDataWhenSkip = "{";
          JsonForDataWhenSkip += "\"" + "columns" + "\" : [";
          for (let i = 0; i < ApiResultGetAllColums.data.length; i++) {
            JsonForDataWhenSkip += "{";

            JsonForDataWhenSkip += "\"" + "colName" + "\"" + ":" + "\"" + ApiResultGetAllColums.data[i].name + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + this.dynamicForm.controls[ApiResultGetAllColums.data[i].name]?.value + "\"" + "," + "\"" + "colId" + "\"" + ":" + "\"" + ApiResultGetAllColums.data[i].id + "\"";

            if (i == ApiResultGetAllColums.data.length - 1) {
              if (globalJson == "") {
                JsonForDataWhenSkip += "}";
              } else {
                JsonForDataWhenSkip += "}," + globalJson;
              }
            } else {
              JsonForDataWhenSkip += "},";
            }
          }
          console.log("hrty213234562436244356");
          JsonForDataWhenSkip += "]," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + nearBy + "\"" +  "," + "\"" + "sameSession" + "\"" + ":" + "\"" + sameSession + "\"" + "}";
          this.mainJsonForDataWhenSkip = JsonForDataWhenSkip;
          this.informationservice.setMainJsonForDataWhenSkip(this.mainJsonForDataWhenSkip);


          let jsonArr: string = "{";
          jsonArr += "\"" + "columns" + "\" : [";
          for (let i = 0; i < dynamicDRBOnBeforeSave.data.length; i++) {
            jsonArr += "{";

            jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + dynamicDRBOnBeforeSave.data[i].name + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + this.dynamicForm.controls[dynamicDRBOnBeforeSave.data[i].name]?.value + "\"";

            if (i == dynamicDRBOnBeforeSave.data.length - 1) {
              if (globalJson == "") {
                jsonArr += "}";
              } else {
                jsonArr += "}," + globalJson;
              }
            } else {
              jsonArr += "},";
            }
          }
          console.log("hommmmmmmmm2 >>>>>>");
          jsonArr += "]," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + nearBy + "\"" + "," + "\"" + "sameSession" + "\"" + ":" + "\"" + sameSession + "\"" + "}";
          this.mainJsonForApi = jsonArr;
        }

        console.log("this.mainJsonForApi) = ",this.mainJsonForApi);
        let apiUrl = GlobalConstants.callingApi + url;
        const callingApi = from(axios.post(apiUrl, JSON.parse(this.mainJsonForApi)));
        const ResultOfCallingApi = await lastValueFrom(callingApi);
        //test2
        this.informationservice.setStatusOfCheckExisting(ResultOfCallingApi.data.status);
        this.informationservice.setSameSession(ResultOfCallingApi.data.code);

        if (ResultOfCallingApi.data.description == "alert") {
          this.listOfData = [];
          this.commonFunctions.alert("alert", ResultOfCallingApi.data.status);
          if (ResultOfCallingApi.data.showSaveButton == 1) {
            this.showAndHideButtons(1234, this.idOfCheckExisting);
          }
        }
        else if (ResultOfCallingApi.data.description == "open") {

          //test2
          this.informationservice.setCheckExisting('yes');
          let result = ResultOfCallingApi.data.objectId;
          let data = [{
            objectId: result.split("~A~")[0],
            isFromGridClick: 0,
            isFromButtonClick: 1,
            primaryColumn: this.columnId,
            buttonClick: this.columnTypeCode,
            selectedRowId: JSON.parse(result.split("~A~")[1])
          }];

          this.dialogRef = this.dialog.open(AmPreviewFormComponent, {
            width: "80%",
            height: "80%",
            data: data
          });

          this.dataservice.PushdialogArray(this.dialogRef);
          //test2
          this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());

          //test2
          this.informationservice.setTabToBeSelectedOnValidate(this.informationservice.getSelectedTabId());

        }
        else if (ResultOfCallingApi.data.description == "validate") {
          // let ValidatedSessionId = ResultOfCallingApi.data.code;
          //test2
          this.listOfData = [];
          if (this.informationservice.getPopupBreadcrumb().includes("Initiation")) {
            this.dialog.closeAll();
          }
          else {
            localStorage.setItem("closeTwice","true");
            this.closeDialog(true);
          }
        }

        console.log("this.listOfData ====",this.listOfData);
        this.informationservice.setListOFData(this.listOfData);
      }
      // Close Popup
      else if (buttonAction == "4") {


        console.log("selectedTabName --->",this.informationservice.getChoosenTab())
        this.closeDialog(true);
      } else if (buttonAction == "5") {
        let customerId = -1;
        let userId = this.informationservice.getLogeduserId();
        let params = this.informationservice.getAgGidSelectedNode();
        customerId = JSON.parse(params)[0].COLVALUE;
        let customerType=JSON.parse(params)[2].COLVALUE;
        console.log("CUSTOMER TYPE>>>>>>>>>>",customerType);
        let jsonArr: string = "{";
        jsonArr += "\"" + "columns" + "\" : [";
        jsonArr += "{";
        jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + "custId" + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + customerId + "\"";
        jsonArr += "}"
        jsonArr += "]," + "\"" + "customerId" + "\"" + ":" + "\"" + customerId + "\"" + "," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + 0 + "\"" + "}";
        //  const callingApi = from(axios.post(url,JSON.parse(jsonArr)));
        //  const ResultOfCallingApi = await lastValueFrom(callingApi);
        let headerOptions = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
          //   'Accept': 'application/octet-stream', // for excel file
        });
        let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };

        if(customerType==='7'){
          url=url.replace("31900","31899");
        }
        // url is : executeReportwithOneParam/31849
        let ApiUrl = "http://" + GlobalConstants.endPointAddress + ":7001/api/" + url;

        this.http.post(ApiUrl, JSON.parse(jsonArr), requestOptions).pipe(map((data: any) => {
          let blob = new Blob([data], {
            type: 'application/pdf' // must match the Accept type
          });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          // link.download = 'samplePDFFile.pdf';
          link.target = '_blank';
          link.click();
          window.URL.revokeObjectURL(link.href);

        })).subscribe((result: any) => {
        });
      }
    }
  }


  showTheGridIntoForm() {
    if (this.listOfHeaders.length > 0) {
      this.agColumnsJson = [];
      this.agColumnsJson.push(
        {
          headerName: '',
          field: '',
          checkboxSelection: true,
          maxWidth: '50',
          headerCheckboxSelection: true
        });


      for (let i = 0; i < this.listOfHeaders.length; i++) {
        if (this.listOfHeaders[i].columnType == "combo") {
          let lastvalue: any = [];
          for (let t = 0; t < this.listOfHeaders[i].query.length; t++) {
            let item = {
              id: this.listOfHeaders[i].query[t].ID,
              name: this.listOfHeaders[i].query[t].NAME
            };
            lastvalue.push(item);
          }
          this.agColumnsJson.push({
            headerName: this.listOfHeaders[i].columnDescription,
            field: this.listOfHeaders[i].name,
            cellEditor: 'agRichSelectCellEditor',
            cellRenderer: DropdownCellRenderer,
            keyCreator: (params: any) => {
              return params.values.id;
            },
            cellEditorParams: {
              cellRenderer: DropdownCellRenderer,
              values: lastvalue,
            },
            editable: true,
            cellDataType: true
          });
        } else {
          this.agColumnsJson.push({
            headerName: this.listOfHeaders[i].columnDescription,
            field: this.listOfHeaders[i].name,
            cellEditor: 'agTextCellEditor',
            editable: true
          });
        }
      }
      this.gridColumns.push(this.agColumnsJson);
      this.showGrid = true;
    }


  }

  gridEventSave(event: any) {
    this.LastObject = [];
    const addList = event[0].addList;
    this.addList = JSON.stringify(addList);
    this.LastObject = JSON.parse(this.addList);
  }

  async submitForm() {

    let ProbInGridIntoForm: any = 0;
    if(this.tableOptionTemp[0].isDynamicReport!='1'){
    if(this.dynamicForm.get('PARTY_TYPE_CODE') !== null){
    if (this.dynamicForm.controls['PARTY_TYPE_CODE']?.value == 7) {
      for (let i = 0; i < this.test.length; i++) {
        if (this.test[i].columnType == "combo" && this.test[i].isMandatory == true && this.dynamicForm.controls[this.test[i].name]?.value == null) {
          if (this.test[i].name == "PERSON_GENDER") {
            this.dynamicForm.controls[this.test[i].name].reset();
            this.dynamicForm.controls[this.test[i].name].setValidators(Validators.required);
            this.dynamicForm.controls[this.test[i].name].updateValueAndValidity();
          }
        }
      }
    }
  }
}
    await this.dynamicDRBOnBeforeSave(this.objectId);
    if (this.canProceedWithSave) {

      this.loaderService.isLoading.next(true);
      //for the grid into the form
      if (this.showGrid == true) {
        if (this.LastObject.length > 0) {
          for (let i = 0; i < this.LastObject.length; i++) {
            let list = this.LastObject[i];
            for (let key in list) {
              if (list.hasOwnProperty(key)) {
                const value = list[key];
                if (typeof value === 'object') {
                  this.dynamicForm.controls[key].setValue(value.id);
                } else {
                  this.dynamicForm.controls[key].setValue(value);
                }
              }
            }
          }
          ProbInGridIntoForm = 0;
        } else {
          this.commonFunctions.alert("alert", "Please fill data into grid and click Submit");
          ProbInGridIntoForm = 1;
        }

      }
      if (this.dynamicForm.status != 'INVALID' && ProbInGridIntoForm == 0) {
        this.actionType = this.amInfo.actionType;
        if (this.actionType == 'saveNew') {
          console.log("TEST RUN>>>>>>>>",this.tableOptionTemp[0].isDynamicReport);
          if(this.tableOptionTemp[0].isDynamicReport=='1'){
            this.counterOfSave=0
          }

          console.log("SAVE COUNTER>>>>>>>>>>",this.counterOfSave);

          if (this.counterOfSave == 0) {
            console.log("this.objectId ====",this.objectId);
            this.http.get<any>(GlobalConstants.getColumnsApi + this.objectId).subscribe(async (data: any) => {
              let jsonData = JSON.parse(this.dynamicFormQuering(data, 'saveNew', this.amInfo));

              if (this.isMainTab == 1) {
                this.counterOfSave++;
                let params: any;
                if (this.amInfo.selectedRowId == undefined) {
                  params = -1;
                } else {
                  params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
                }

                let jsonVal = [{
                  objectId: this.objectId,
                  selectedRowId: params == -1 ? params : JSON.stringify(this.handleSelectedRowIds(params, "grid,button")),
                  primaryColumn: "ROW_ID",
                  dynamicTable: jsonData
                }];

                this.ruleCallApiData=params == -1 ? params : JSON.stringify(this.handleSelectedRowIds(params, "grid,button"));
                console.log("tableOptionTemp>>>>>>",this.tableOptionTemp);






                if(this.tableOptionTemp[0].isDynamicReport=='1'){

                  console.log("IS A DYNAMIC REPORT");
                  console.log("DYNAMIC REPORT JSONVALUE>>>>>>>>",jsonVal);

                  if(this.previewDynamicReportbool){



                    console.log("PREVIEW DYNAMIC DATA");
                    let info = {
                      userId:localStorage.getItem('LogeduserId'),
                      isGrid:this.isPageGrid,
                      jsonVal:jsonVal
                      };
                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.width = '700px';
                    dialogConfig.height = '200px';

                    const dialogRef = this.dialog.open(DynamicReportResultComponent, {
                      data: info,
                      width: '90%',
                      height: '90%',
                    });

                    dialogRef.afterClosed().subscribe(result => {
                    });


                  }

                  else{
                  this.insertDynamicReport(jsonVal);
                  }
                  }else{
                    console.log("IS IN DISPLAY INSERT");
                    this.http.post<any>(GlobalConstants.previewInsertDynamicApi, jsonVal, { headers: GlobalConstants.headers }).subscribe(
                      (res: any) => {
                        this.commonFunctions.alert("alert", res.description);
                        this.informationservice.setOpenLikeForm("no");
                        this.dynamicDRBOnAfterSave(this.objectId);
                      },
                      (error) => {
                        this.commonFunctions.alert("alert", error.error.message);
                        this.counterOfSave = 0;
                      });
                  }



              } else {
                this.counterOfSave++;
                let jsonVal = [{
                  objectId: this.objectId,
                  selectedRowId: JSON.stringify(this.handleSelectedRowIds(this.amInfo.selectedRowId, "grid,button")),
                  primaryColumn: "ROW_ID",
                  dynamicTable: jsonData
                }];

                console.log("EEEEEEEEEEEEEEEE>>>>>>>>>>>>>>",this.tableOptionTemp);
                if(this.tableOptionTemp[0].isDynamicReport=='1'){

                  console.log("IS A DYNAMIC REPORT");
                  console.log("DYNAMIC REPORT JSONVALUE>>>>>>>>",jsonVal);
                  this.insertDynamicReport(jsonVal);

              }else{
                this.http.post<any>(GlobalConstants.previewInsertDynamicApi, jsonVal, { headers: GlobalConstants.headers }).subscribe(
                  (res: any) => {
                    this.commonFunctions.alert("alert", res.description);
                    this.informationservice.setOpenLikeForm("no");
                    this.dynamicDRBOnAfterSave(this.objectId);
                  },
                  (error) => {
                    this.commonFunctions.alert("alert", error.error.message);
                    this.counterOfSave = 0;
                  });              }
              }
            });
          }
          else {
            this.commonFunctions.alert("alert", "Already Saved");
          }
        }

        if (this.actionType == 'update') {
          this.counterOfSave++;
          let jsonArr = "[{";
          jsonArr += " \"" + "columns" + "\" : [";
          this.http.get<any>(GlobalConstants.getColumnsApi + this.objectId).subscribe((data: any) => {
            let jsonData = JSON.parse(this.dynamicFormQuering(data, 'update', this.amInfo));

            let jsonVal = [{
              objectId: this.objectId,
              selectedRowId: JSON.stringify(this.handleSelectedRowIds(this.amInfo.selectedRowId, "form,button")),
              primaryColumn: "ROW_ID",
              dynamicTable: jsonData
            }];

            this.ruleCallApiData=JSON.stringify(this.handleSelectedRowIds(this.amInfo.selectedRowId, "form,button"));

            this.http.post<any>(GlobalConstants.updateDynForm, jsonVal, { headers: GlobalConstants.headers }).subscribe(
              (res: any) => {
                this.commonFunctions.alert("alert", res.description);
                this.informationservice.setOpenLikeForm("no");
                this.dynamicDRBOnAfterSave(this.objectId);
              },
              (error) => {
                this.commonFunctions.alert("alert", error.error.message);
                this.counterOfSave = 0;
              });
          });
        }
      }
      else if (this.dynamicForm.status == 'INVALID' && ProbInGridIntoForm == 0) {
        const formControls: { [key: string]: AbstractControl } = this.dynamicForm.controls;
        let requiredFields: string = '';
        // Now you can iterate through the form controls
        for (const controlName in formControls) {
          if (formControls.hasOwnProperty(controlName)) {
            const control: any = formControls[controlName];

            // Check if the "required" validator is present
            // const isRequired: boolean = control.hasError('required');
            const invalidFields = control.status;
            if (invalidFields == "INVALID") {
              // Do something with the control and the "required" validator information
              let fieldId: any;
              if ($("." + controlName)) {
                fieldId = $("." + controlName).attr("id");
              } else {
                fieldId = $("#" + controlName).attr("id");
              }

              if (fieldId.indexOf("field") == -1) {
                fieldId = $("." + controlName).attr("class").split(" ")[2];
              }
              fieldId = fieldId.substring(fieldId.indexOf("_") + 1);
              //required message
              // $('#lbl_' + fieldId).css("color","red");

              let fieldLblName = $("#lbl_" + fieldId).html();
              if (fieldLblName) {
                fieldLblName = fieldLblName.replace("&nbsp;&nbsp;", "");
                fieldLblName = fieldLblName.replace(" ", "");

                if (fieldLblName !== undefined) {
                  requiredFields = requiredFields + fieldLblName.trim() + ", ";
                  //required message
                  this.showRequiredMessage.push(controlName);
                }
              }
            }
          }
        }
        requiredFields = requiredFields.slice(0, -2);
        this.commonFunctions.alert("alert", "Please fill in the following mandatory fields = " + requiredFields);
      }
      this.loaderService.isLoading.next(false);
    } else {
      //Cannot proceed with save, all onBeforeSave rules must be satisfied
      return;
    }


  }

  onAddClick() {
    this.actionType = "saveNew";
    //test2
    // General Info
    console.log("this.informationservice.getSelectedTabName()=", this.informationservice.getSelectedTabName());
    this.informationservice.setPreviousTab(this.informationservice.getSelectedTabName());

    let params = typeof (this.amInfo.selectedRowId) == "string" ? JSON.parse(this.amInfo.selectedRowId) : this.amInfo.selectedRowId;
    let data = [{
      objectId: this.objectId,
      actionType: this.actionType,
      primaryColumn: this.columnId,
      selectedRowId: this.handleSelectedRowIds(params, "gridlink,grid,form,combo,button"),
      isFromGridClick: 1
    }];
    console.log("data =========", data);
    this.dialogRef = this.dialog.open(AmPreviewFormComponent, {
      width: "80%",
      height: "80%",
      data: data
    });
    //rony
    this.dataservice.PushdialogArray(this.dialogRef);
    //test2
    this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());
  }

  onUpdateClick() {
    this.update = true;
    this.actionType = "update";

    //test2
    this.informationservice.setPreviousTab(this.informationservice.getSelectedTabName())

    //test2
    console.log("this.informationservice.getAgGidSelectedNode()==============",this.informationservice.getAgGidSelectedNode());
    let dd = JSON.parse(this.informationservice.getAgGidSelectedNode())

    let data = [{
      objectId: this.objectId,
      selectedRowId: this.handleSelectedRowIds(dd, "gridlink,grid,form,combo,button"),
      actionType: this.actionType,
      primaryColumn: this.columnId,
      isFromGridClick: 1
    }];

    // this.dialogRef.close();

    this.dialogRef = this.dialog.open(AmPreviewFormComponent, {
      width: "80%",
      height: "80%",
      data: data
    });
    //rony
    this.dataservice.PushdialogArray(this.dialogRef);
    //test2
    this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());

  }

  onSearchSubmit(getWhereCond: any) {
    this.getWhereCond = getWhereCond.data;
    this.getAllColums();
  }

  async onDeleteClick() {
    this.actionType = "select";
    //test2
    let dd = JSON.parse(this.informationservice.getAgGidSelectedNode())
    const getColumnsApiUrl = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
    const getColumnsApi = await lastValueFrom(getColumnsApiUrl);
    let jsonData = JSON.parse(this.dynamicFormQuering(getColumnsApi.data, 'select', this.amInfo));

    let jsonVal = [{
      objectId: this.objectId,
      selectedRowId: JSON.stringify(this.handleSelectedRowIds(dd, "grid")),
      primaryColumn: "ROW_ID",
      dynamicTable: jsonData,
      whereConditions: this.whereConditionAr
    }];
    this.http.post<any>(GlobalConstants.dynamicDeleteFormBuilderApi, jsonVal).subscribe({
      next: (res) => {
        this.commonFunctions.alert("alert", "Deleted Successfully");
        this.getAllColums();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  handleDialogTitle() {
    let previousMainTab = this.informationservice.getPreviousMainTab();
    console.log("previousMainTab>>>>>>",previousMainTab);
    let previousMainHeader = this.informationservice.getPreviousMainTab2();
    console.log("previousMainHeader>>>",previousMainHeader);
    this.informationservice.setPreviousMainTab2(previousMainTab);

    let dialogTitle: string = this.informationservice.getPopupBreadcrumb() == null ? "-1" : this.informationservice.getPopupBreadcrumb();
    console.log("dialogTitle>>>>>>>>>>",dialogTitle);
    console.log("selectedTabName >>>>>>",this.selectedTabName)
    if (dialogTitle.indexOf(this.selectedTabName) == 0) {
      dialogTitle = this.selectedTabName;
    }
    else if (dialogTitle.includes("/" + this.selectedTabName + "/") || dialogTitle.endsWith("/" + this.selectedTabName)) {

 //  else if (dialogTitle.indexOf(this.selectedTabName) != -1) {
      dialogTitle = dialogTitle.replace(this.selectedTabName + "/", "").replace("/" + this.selectedTabName, "");
    } else if (dialogTitle == "-1") {
      dialogTitle = this.selectedTabName;
    } else {
      if (previousMainTab != null && previousMainTab != previousMainHeader) {
        //dialogTitle = dialogTitle + "/" + this.selectedTabName;
        dialogTitle = this.selectedTabName;
      } else {
        dialogTitle = this.selectedTabName;
      }
    }

    dialogTitle = dialogTitle.replace("//", "/");
    this.informationservice.setPopupBreadcrumb(dialogTitle);

    $(".dialogTitle").html("<span>" + dialogTitle + "</span>")
    $(".dialogTitle span").css({ "font-size": "15px", "letter-spacing": "1px", "color": "var(--popup-title-color)", "font-weight": "bold" });
  }

  triggerClickOnElementWithId(id: string) {
    const element = document.getElementById(id);
    if (element) {
      this.renderer.selectRootElement(element).click();
    }
  }

  //send data for the query(Ex: customer_id)
  handleSelectedRowIds(data: any, compare: string) {
    console.log('data--------> ',data);
    console.log('compare--------> ',compare);

    let newDD: any;
console.log("data >>>>>>>>>>>>testing ids =",data);
    try {
      let dd: any;
      if (typeof (data) == "string") {
        let d = data.toLowerCase();
        dd = JSON.parse(d);
      } else {
        let d = JSON.stringify(data);
        dd = JSON.parse(d.toLowerCase());
      }
      if (compare.indexOf(",") != -1) {
        newDD = dd.filter((el: any) => {
          return el.type.toLowerCase() === compare.split(",")[0] || el.type.toLowerCase() === compare.split(",")[1] || el.type.toLowerCase() === compare.split(",")[2] || el.type.toLowerCase() === compare.split(",")[3] || el.type.toLowerCase() === compare.split(",")[4];
          // return el.type.toLowerCase() === compare.split(",")[0] || el.type.toLowerCase() === compare.split(",")[1] ;

        });
      } else {
        newDD = dd.filter((el: any) => {
          return el.type.toLowerCase() === compare.toLowerCase();
        });
      }
    } catch (error) {
      console.log("error on handleSelectedRowIds >>>> ", error)
      newDD = -1;
    }
    return newDD;
  }

  handleComboOnChangeEvents(fieldId: any, ruleId: any) {
    this.dynamicDRBOnchange(fieldId, ruleId);
    setTimeout(() => {
      this.loadFieldDependencyForForm();
    }, 100)
  }

  handleLookupOnChangeEvents(fieldId: any, ruleId: any) {
    this.dynamicDRBOnchange(fieldId, ruleId);
    setTimeout(() => {
      this.loadFieldDependencyForForm();
    }, 100)  }

  showAndHideButtons(buttonToShow: any, buttonToHide: any) {
    //ronyyy
    // setTimeout(() => {
    $("#field_" + buttonToShow).show();
    $("#field_" + buttonToHide).hide();
  }

  checkIfArabic(fields: any) {
    if (fields.isArabic == "137") {
      const arabicLettersRegex = /[\u0600-\u06FF]/g;
      // const englishLettersRegex = /[a-zA-Z]/;
      let arabicInput = this.dynamicForm.controls[fields.name]?.value;
      if (arabicInput != "") {
        if (!arabicLettersRegex.test(arabicInput)) {
          this.commonFunctions.alert("alert", "Please Fill Arabic Letters");
          this.dynamicForm.controls[fields.name].setValue('');
        }
      }
    }
  }

  clearFormControl(name: string) {

    if (this.dynamicForm.get(name)) {

      let value = this.dynamicForm.get(name).value;
      this.dynamicForm.removeControl(name);
      this.dynamicForm.addControl(name, new FormControl());

      if (value != "" && value != null) {
        this.handleFormFieldValues(name, value);
      }

      const control = this.dynamicForm.get(name);
      control.clearValidators();
      control.updateValueAndValidity();
    }

  }

  registerTouchedField(fieldName: string) {
    this.showRequiredMessage = this.showRequiredMessage.filter(item => item !== fieldName);
    const control = this.dynamicForm.get(fieldName);
    if (control) {
      control.markAsTouched();
    }
  }

  EmailValidation(fieldName: any) {
    let email = this.dynamicForm.controls[fieldName]?.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.commonFunctions.alert("alert", "Please enter a valid email.");
      this.dynamicForm.controls[fieldName].setValue('');
    }
  }

  calculateDifference(givenDate: string): string {
    const date1 = new Date(givenDate);
    const date2 = new Date();
    let years: any;
    let months: any;
    let days: any;
    let hours: any;

    if (date2 > date1) {
      years = date2.getFullYear() - date1.getFullYear();
      months = date2.getMonth() - date1.getMonth();
      days = date2.getDate() - date1.getDate();
      hours = date2.getHours() - date1.getHours();
    } else {
      years = date1.getFullYear() - date2.getFullYear();
      months = date1.getMonth() - date2.getMonth();
      days = date1.getDate() - date2.getDate();
      hours = date1.getHours() - date2.getHours();
    }

    // Adjust for negative differences
    if (months < 0 || (months === 0 && date2.getDate() < date1.getDate())) {
      years--;
      months += 12;
    }
    if (days < 0 || (days === 0 && date2.getHours() < date1.getHours())) {
      months--;
      days += new Date(date2.getFullYear(), date2.getMonth() + 1, 0).getDate();
    }
    if (hours < 0) {
      days--;
      hours += 24;
    }

    // return `${years} years ${months} months ${days} days ${hours} hours`;
    let result = '';
    if (years > 0) {
      result += `${years} years `;
    }
    if (months > 0) {
      result += `${months} months `;
    }
    if (days > 0) {
      result += `${days} days `;
    }
    if (hours > 0) {
      result += `${hours} hours `;
    }
    return result;
  }

  signaturedatafct(signaturedata: any) {
    this.signaturedata = signaturedata;
  }

  getValueOfControlName(fieldName: any) {
    let result: any;
    if (this.dynamicForm.controls[fieldName]?.value === true) {
      result = "true";
    }
    else if (this.dynamicForm.controls[fieldName]?.value === false) {
      result = "false";
    }
    else {
      result = this.dynamicForm.controls[fieldName]?.value;
    }
    return result;
  }

  saveAsDynamicReport(){
    if(!this.isPageGrid){
      this.submitForm();
    }else{
      console.log("GRID SELECTED DATA>>>>>>>>",this.informationservice.getAgGidSelectedNode());
      this.insertDynamicReport(this.informationservice.getAgGidSelectedNode());
    }

  }

  previewDynamicReport(){
    this.previewDynamicReportbool=true;
    this.submitForm();
    setTimeout(() => {
      this.previewDynamicReportbool=false;

    }, 200);

  }

  async insertDynamicReport(jsonVal:any){
    console.log("IS PAGE GRID>>>>>>>>>>>>>>",this.isPageGrid);
    if(this.isPageGrid){
      if(this.informationservice.getDynamicReportId()==''){

          let info = {
          userId:localStorage.getItem('LogeduserId'),
          isGrid:this.isPageGrid,
          jsonVal:jsonVal
          };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '700px';

        const dialogRef = this.dialog.open(DynamicReportSaveComponent, {
          data: info,
          width: '50%',
          height: '25%',
        });

        dialogRef.afterClosed().subscribe(result => {
        });

      }else{

        let selectedRowsArray=JSON.parse(this.informationservice.getAgGidSelectedNode());
        let selectedRows='';

    for(let i=0;i<selectedRowsArray.length;i++){
      if(i==selectedRowsArray.length-1){
        selectedRows+=selectedRowsArray[i].COLVALUE;
      }else{
        selectedRows+=selectedRowsArray[i].COLVALUE+",";
      }
    }

        const updateDynamicReportGridApi = from(axios.post(GlobalConstants.updateDynamicReportGridApi+this.informationservice.getLogeduserId()+"/"+this.informationservice.getDynamicReportId()+"/"+selectedRows));
        const updateDynamicReportGrid= await lastValueFrom(updateDynamicReportGridApi);
        this.commonFunctions.alert("alert", "Report Updated");

      }


    }else{
      if(this.informationservice.getDynamicReportId()==''){

        let info = {
          userId:localStorage.getItem('LogeduserId'),
          isGrid:this.isPageGrid,
          jsonVal:jsonVal
          };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '200px';

        const dialogRef = this.dialog.open(DynamicReportSaveComponent, {
          data: info,
          width: '50%',
          height: '20%',
        });

        dialogRef.afterClosed().subscribe(result => {
        });

    }else{
        const updateDynamicReportFormApi = from(axios.post(GlobalConstants.updateDynamicReportFormApi+this.informationservice.getLogeduserId()+"/"+this.informationservice.getDynamicReportId(),jsonVal));
        const updateDynamicReportForm= await lastValueFrom(updateDynamicReportFormApi);
        this.commonFunctions.alert("alert", "Report Updated");

      }
    }
  }
}


class DropdownCellRenderer {
  setValues(filteredValues: any) {
    throw new Error('Method not implemented.');
  }
  eGui: any;

  init(params: any) {
    if (params.value != undefined) {
      if (params.value.name != undefined) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `<span style="overflow: hidden; text-overflow: ellipsis">${params.value.name}</span>`;
      } else {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `<span style="overflow: hidden; text-overflow: ellipsis">${params.value}</span>`;
      }
    }
  }
  getGui() {
    return this.eGui;
  }
  refresh(params: any) {
    return false;
  }


}
