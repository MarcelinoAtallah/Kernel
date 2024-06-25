import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { format } from 'sql-formatter';
import { ReactiveFormsModule } from '@angular/forms';
import * as shajs from 'sha.js';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CellRenderer } from 'src/app/Kernel/kernelapp/in-display/screen-builder/screen-builder-tool/cellRenderer';
import { MatListOption, MatSelectionList } from '@angular/material/list/selection-list';
import { ColDef, GridOptions } from 'ag-grid-community';
import { DataFilterComponent } from './data-filter/data-filter.component';
import { ParameterBuilderComponent } from '../static-query-builder/parameter-builder/parameter-builder.component';
import { ShowGeneratedQueryComponent } from './show-generated-query/show-generated-query.component';
import { ExecuteQueryComponent } from '../static-query-builder/execute-query/execute-query.component';
import { SavequeryComponent } from '../static-query-builder/savequery/savequery.component';
import { from, lastValueFrom } from 'rxjs';
import axios from 'axios';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-qbe-tool',
  templateUrl: './qbe-tool.component.html',
  styleUrls: ['./qbe-tool.component.css']
})
export class QbeToolComponent implements OnInit {
  //selectedOptions: string[] = [];
  public allConditions:any[]=[];
  public itemsData :any[]= [];
  public columnsTableData :any[]= [];

  public showTablesColumns:boolean=true;

  selectedRowIndex: number = -1;
  public sql_query:any;
  public gridOptions: GridOptions;

  public tableGrid:boolean=false;
  public showdetailsGrid: boolean = false;
  public showfilterGrid: boolean = false;

  public agColumns: AgColumns[] = [];
  public detailsTablesColumns : AgColumns[]= [];
  public showPanel:boolean=true;
  
  dataList: Array<any> = [];
  public actionType: string = '';
  
  public menuPath: any = this.informationservice.getMenuPath();
  public showHideTabs = false;
  
  public userId = this.informationservice.getUserId();
  public showSavePopup: boolean = false;

  public queryIdUpdate: any;
  public isUpdate:boolean=false;
  public isSelected:boolean=false;
  public agColumnsJson: any;
  public detailsTablesColumnsJson: any;

public returnedQuery:string;
frameworkComponents:any;

  private isQueryValidated: boolean = false;
  private isQuerySavedBeforeExit: boolean = false;
  showCombo:Boolean;


  public getAllTables=GlobalConstants.getAllTables;

  public query: any;
  validation:any;
  myTextarea: any = '';
  paramSelection: string = '';
  
  showRightButtons = true;
  verticalLayout = true;
  formClass: string = '';
  arrowDirection: string = 'fa-arrow-left';
  isQueryValid: boolean = false;
  isQuerySaved: boolean = false;
  isQueryexecute: boolean;
  isQuerylink: boolean;
  isQuerysecure: boolean;
  isQuerytype: boolean;
  public agColumnsDataFilter: AgColumns[] = [];
  public agColumnsDataFilterJson: any;
  @ViewChild('myTextareaRef', { static: false }) myTextareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;
  
  
  constructor(private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
     private snackBar: MatSnackBar,
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private commonFunctions: CommonFunctions,
    private route: Router,
    public informationservice: InformationService) {

      this.gridOptions = <GridOptions>{};

      this.onRunButtonClick = this.onRunButtonClick.bind(this);

      this.frameworkComponents = {
        cellRenderer: CellRenderer,
      };
     }

    queryForm = new FormGroup({
      query: new FormControl(''),
      queryName: new FormControl(''),
      paramCombo:new FormControl(''),
    });

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {
      console.log("params>>>>", params);
      // this.userId = params.get('id');
      
      this.informationservice.setUserId(this.userId)

      this.actionType = params.get('actionType');
    });


    this.agColumnsJson = [
      {
      headerName: '',
      field: '',
      defaultMinWidth: '40',
      maxWidth: '40',
      cellRenderer: 'cellRenderer',
      cellRendererParams: {
        onClick: this.onRunButtonClick.bind(this),
        label: 'Click 1'
      }
      },
        {
        headerName: 'Table',
        field: 'TABLE_NAME',
        filter: 'agTextColumnFilter',
        sortable: true,
        defaultMinWidth: '300',
        maxWidth: '300',
        
      }
    ];

    this.detailsTablesColumnsJson = [
  
      {
        headerName: 'Table Name',
        field: 'TABLE_NAME',
        sortable: true,
      },
      {
        headerName: 'Elementary Data',
        field: 'Elementary_Data',
        sortable: true,
      },
      {
        headerName: 'Label',
        field: 'Label',
        sortable: true,
      },
    ];

    this.agColumns.push(this.agColumnsJson);
    this.detailsTablesColumns.push(this.detailsTablesColumnsJson);


    
    this.agColumnsDataFilterJson = [
      {
        headerName: 'Grouping',
        field: 'grouping',
      },
      {
        headerName: 'First Operand',
        field: 'firstOperand',
      },
      {
        headerName: 'Value',
        field: 'firstOperandValue',
      },     
      {
        headerName: 'Operator',
        field: 'operator',
      },
      {
        headerName: 'Second Operand',
        field: 'secondOperand',
      },
      {
        headerName: 'Value',
        field: 'secondOperandValue',
      },
    ];
    this.agColumnsDataFilter.push(this.agColumnsDataFilterJson);




    if(this.actionType=="update"){
      this.http.get<any>(GlobalConstants.decodeQuery+sessionStorage.getItem("session_serial")+"/"+JSON.parse(this.informationservice.getAgGidSelectedNode())[0].QBE_ID+"/"+this.informationservice.getLogeduserId(), { headers: GlobalConstants.headers }).subscribe(
        async (res: any) => {
          if (res.status == 'Fail') {
          } else {
            this.isUpdate=true;
            this.queryIdUpdate=res[0].queryId;
            let query=res[0].query;
            query=query.replaceAll("WHERE  ","WHERE None ");
            let queryTables=(((query.split("SELECT ")[1]).split(" FROM ")[1]).split(" WHERE ")[0]).split(",");
            let queryColumns=((query.split("SELECT ")[1]).split(" FROM ")[0]).split(",");
           
            let noCondition=false;
            let queryConditions;
            if(query.includes(" WHERE ")){
             queryConditions=(((query.split("SELECT ")[1]).split(" FROM ")[1]).split(" WHERE ")[1]).split(" ");
             queryConditions.pop();
            }else{
               noCondition=true;
            }
            let allCols;
            // console.log("QUERY TABLES>>>>>>>",queryTables.toString());
            // console.log("QUERY COLUMNS>>>>>>>",queryColumns.toString());

            // console.log("QUERY CONDITIONS>>>>>>>",queryConditions.toString());

            for(let i=0;i<queryTables.length;i++){
              let selectedColumns=[];
              const getTableColumnsApi = from(axios.post(GlobalConstants.getTableColumns + queryTables[i]));
              const getTableColumns = await lastValueFrom(getTableColumnsApi);
              
              allCols=getTableColumns.data;
              console.log("ALL COLUMNS UPDATE >>>>>>>>>",allCols);
                for(let j=0;j<queryColumns.length;j++){
                  if(queryColumns[j].includes(queryTables[i])){
                    selectedColumns.push(queryColumns[j].split(".")[2]);
                    this.columnsTableData.push({"TABLE_NAME":queryTables[i],"Elementary_Data":queryColumns[j].split(".")[2],"Label":queryColumns[j].split(".")[2],"Id":queryColumns[j]});
                    
                  }
                }
              this.itemsData.push({type:'table',data:{tableName:queryTables[i],columns:getTableColumns.data,selectedColumns:selectedColumns}});

            console.log("ITESMDATA UPDATE>>>>>>>>>>>>",this.itemsData);
                
            }
            
            const getParamSessionApi = from(axios.post(GlobalConstants.getParamSession + "paramAdd_"+sessionStorage.getItem("session_serial")));
            const getParamSession = await lastValueFrom(getParamSessionApi);
            
            let params=getParamSession.data;

console.log("PARAMS QBE UPDATE>>>>>>>>>>>",params);

if(noCondition==false){
            let grouping="";
            let firstOp="";
            let firstVal="";
            let ope="";
            let secondOp="";
            let secondVal="";

            let z=0;
           console.log("QUERY CONDITIONS>>>>>>",queryConditions.toString());
            while(z<queryConditions.length){

                grouping=queryConditions[z];
            
              for(let x=0;x<this.itemsData.length;x++){
                for(let k=0;k<this.itemsData[x].data.columns.length;k++){
                  if(this.itemsData[x].data.tableName+'.'+this.itemsData[x].data.columns[k].COLUMN_NAME==queryConditions[z+1]){
                    firstOp="Field";
                    firstVal=queryConditions[z+1];
                    break;
                  }else{
                    firstOp="Expression";
                    firstVal="";
                  }
              }
            }
              ope=queryConditions[z+2];

              for(let x=0;x<this.itemsData.length;x++){
                for(let k=0;k<this.itemsData[x].data.columns.length;k++){
                  if(this.itemsData[x].data.tableName+'.'+this.itemsData[x].data.columns[k].COLUMN_NAME==queryConditions[z+3]){
                    secondOp="Field";
                    secondVal=queryConditions[z+3];
                    break;
                  }
              }
            }

            for(let v=0;v<params.length;v++){
              console.log("SECOND OPERANDDDDD PARAMSSS>>>>>>>",params[v].paramName);
              console.log("SECOND OPERANDDDDD PARAMSSS from query>>>>>>>",queryConditions[z+3].replaceAll("[","").replaceAll("]",""));

              if(params[v].paramName==queryConditions[z+3].replaceAll("[","").replaceAll("]","")){
                  secondOp="Parameter";
                  secondVal=queryConditions[z+3].replaceAll("[","").replaceAll("]","");
              }
            }
              if(secondOp=="" && secondVal==""){
                secondOp="Static";
                secondVal=queryConditions[z+3];
              }
            

              this.allConditions.push({
                "grouping":grouping,
                "firstOperand":firstOp,
                "firstOperandValue":firstVal,
                "operator":ope,
                "secondOperand":secondOp,
                "secondOperandValue":secondVal
              })
              z=z+5;
            }
          }
          }
        });

    }




  }




  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['my-snackbar'],
    });
  }
  openFileExplorer(): void {
    this.fileInputRef.nativeElement.click();
  }
  /////////////////////////////////Exit Button//////////////////////////////////////////////////////////////
  
  onCancelSave() {
    this.showSavePopup = false;
    this.goBackToQueryBuilder();
  }
  onConfirmSave() {
    this.saveQuery();
    this.showSavePopup = false;
    this.isQuerySavedBeforeExit = true;
    this.goBackToQueryBuilder();
  }
  private goBackToQueryBuilder() {
    this.route.navigate(['/qbe/queryBuilder']);
  }

  /////////////////////////////////left-side button functions////////////////////////////////////////////////
  toggleRightButtons() {
    this.showRightButtons = !this.showRightButtons;
    this.arrowDirection = this.showRightButtons ? 'fa-arrow-left' : 'fa-arrow-right';
  }



  openTextarea(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        this.myTextarea = e.target.result;
      };
      reader.readAsText(file);
    }
  }

  downloadTextarea() { 
    const fileName = 'query.sql';
  const blob = new Blob([this.myTextarea], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  }

 printTextarea(zoomFactor: number = 1): void {
    const textToPrint = this.myTextarea;
    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'absolute';
    document.body.appendChild(iframe);
  
    const fontSize = 16 * zoomFactor;
    const style = `
      <style>
        body { font-size: ${fontSize}pt; }
        pre { font-size: ${fontSize}pt; }
      </style>
    `;
  
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`${style}<pre>${textToPrint}</pre>`);
      doc.close();
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 500);
  }
  
  beautifyTextarea() { 
  this.myTextarea=this.myTextarea.replaceAll("[","'[");
  this.myTextarea=this.myTextarea.replaceAll("]","]'");

  this.myTextarea=format(this.myTextarea, { language: 'mysql' });

  this.myTextarea=this.myTextarea.replaceAll("'[","[");
  this.myTextarea=this.myTextarea.replaceAll("]'","]");

  }



 

  validateTextarea(): any {
    return new Promise((resolve, reject) => {

      let jsonParams = {};
      jsonParams = {
                query: this.myTextarea,
                session_serial:sessionStorage.getItem("session_serial")
      };
     this.http.post<any>(GlobalConstants.validateQuery, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.validation=res[0].result;
          if (this.myTextarea.trim() != '' && this.validation=="Success") {
            this.isQueryValid = true;
            this.showSnackBar('Query is valid');
          } else {
            this.isQueryValid = false;
            this.commonFunctions.alert("alert", 'Invalid query:'+this.validation);
          }
        });
    })
    
  }
  requireRevalidation(){
    this.isQueryValid = false;
  }


  ///////////////////////////////////right-side button functions//////////////////////////////////////////////

  saveQuery() {
  this.showSQL(0);
    let info = {};
      info = {
        query: this.sql_query,
        actionType: this.actionType,
        queryFlag:0
      };
      let jsonParams = {};
      jsonParams = {
                query: this.sql_query,
                session_serial:sessionStorage.getItem("session_serial")
      };

      this.http.post<any>(GlobalConstants.validateQuery, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.validation=res[0].result;
          if (this.sql_query.trim() != '' && this.validation=="Success") {
  
                            
                  const dialogConfig = new MatDialogConfig();
                  dialogConfig.width = '700px';
                  dialogConfig.height = '700px';

                  const dialogRef = this.dialog.open(SavequeryComponent, {
                    data: info,
                    width: '50%',
                    height: '60%',
                  });

                  dialogRef.afterClosed().subscribe(result => {
                    this.isQuerySaved = true;
                  });
            
          } else {
            this.commonFunctions.alert("alert", 'Invalid query:'+this.validation);
          }
        });




    

  }
  ///////////////////////////////////////////Popups//////////////////////////////////////////////////////
    parameterBuilder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';

  
    const dialogRef =  this.dialog.open(ParameterBuilderComponent,{
      data: this.showCombo,
      width: '50%',
      height: '60%',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.showCombo=false;
      this.http.get<any>(GlobalConstants.getParamCombo+"paramAdd_"+sessionStorage.getItem("session_serial"), { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res==null){
            this.showCombo=false;
          }else{
            setTimeout(() => {
              console.log(res.toString());
              this.showCombo=true;
             this.dataList=res;

             }, 100);
          }
        });

    });
  }
  

  executeQuery() {

    this.showSQL(0);


    let jsonParams = {};
    jsonParams = {
              query: this.sql_query,
              session_serial:sessionStorage.getItem("session_serial")
    };
    console.log("JSON PARAMS>>>>>>>>>>>>",jsonParams);
    this.http.post<any>(GlobalConstants.validateQuery, jsonParams, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        this.validation=res[0].result;
        console.log("THIS>>VALIDATION>>>>>>>>",res[0].result);
        if (this.sql_query.trim() != '' && this.validation=="Success") {

          let info = {};
          info = {
            query: this.sql_query,
            actionType: this.actionType,
          };
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '700px';
        
        const dialogRef = this.dialog.open(ExecuteQueryComponent, {
          data: info,
          width: '50%',
          height: '60%',
        });
    
    
        dialogRef.afterClosed().subscribe(result => {
          this.isQueryexecute = true;
        });

        } else {
          this.commonFunctions.alert("alert", 'Invalid query:'+this.validation);
        }
      });

    

  }



  


  
  

  onParamSelect(value:any) :void{
console.log("onParamSelect >>>>>>> " , value)
if(value!=""){
    this.myTextarea=this.myTextarea+"["+value+"]";
}
    value=null;


  }

  updateExistingQuery(){
    this.showSQL(0);
    let jsonParams = {};
    jsonParams = {
              query: this.sql_query,
              session_serial:sessionStorage.getItem("session_serial")
    };
    let jsonParams1 = {};
    jsonParams1 = {
      userId: this.informationservice.getLogeduserId(),
      query:this.sql_query,
      session_serial:sessionStorage.getItem("session_serial"),
      queryId:this.queryIdUpdate
    };
    
            this.http.post<any>(GlobalConstants.validateQuery, jsonParams, { headers: GlobalConstants.headers }).subscribe(
              (res: any) => {
                this.validation=res[0].result;
                if (this.sql_query.trim() != '' && this.validation==0) {
           
                  this.http.post<any>(GlobalConstants.updateQuery, jsonParams1, { headers: GlobalConstants.headers }).subscribe(
                    (res: any) => {
                      if (res.status == 'Fail') {
                        
                      } else {
                        this.commonFunctions.navigateToPage("/qbe/queryBuilder");
         
                       
                      }
                    });
                  
                } else {
                  this.commonFunctions.alert("alert", 'Invalid query:'+this.validation);
                }
              });



  }



displayTables(){
  this.showPanel=false;
  this.tableGrid=true;
}

displayDetails(){
if(this.showdetailsGrid ==false){
  this.showdetailsGrid = true;
}else{
  this.showdetailsGrid = false;
}

}

goBack(){
  this.showPanel=true;
  this.tableGrid=false;
}

onRunButtonClick(e:any){
  console.log("ON RUN BUTTON CLICK");
  if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode()==""){
  }else{
setTimeout(() =>  {
  
this.http.post<any>(GlobalConstants.getTableColumns + this.informationservice.getAgGidSelectedNode(), {
headers: GlobalConstants.headers,
}).subscribe((res: any) => {
    this.itemsData.push({type:'table',data:{tableName:this.informationservice.getAgGidSelectedNode(),columns:res,selectedColumns:[]}});

  },
);

}, 50);


}


console.log("ITEMSDATA>>>>>>>>>>>>>>>>>",this.itemsData[0]);
}


onSelectColumn(tableName:string,columnName:string){
  console.log("tableName>>>>>>>>>>",tableName);
  console.log("columnName>>>>>>>>>>",columnName);
  let len=this.itemsData.length;
  for(let i=0;i<len;i++){
    if(this.itemsData[i].data.tableName==tableName){
        if(this.itemsData[i].data.selectedColumns.includes(columnName)){
          console.log("Deselect");

          this.columnsTableData= this.columnsTableData.filter(obj => obj.Id != tableName+'.'+columnName);

          this.itemsData[i].data.selectedColumns= this.itemsData[i].data.selectedColumns.filter((val: any) => val !=columnName);
        //  this.itemsData[i].data.selectedColumns.splice(this.itemsData[i].data.selectedColumns.indexOf(columnName),1);
        
        setTimeout(() => {
          this.showdetailsGrid=false;
          this.showTablesColumns=false;

        }, 100);
        setTimeout(() => {
          this.showdetailsGrid=true;
          this.showTablesColumns=true;

        }, 100);
        }
        else
        {
          console.log("Select");
          this.isSelected = true;
          this.itemsData[i].data.selectedColumns.push(columnName);
          

          this.columnsTableData.push({"TABLE_NAME":tableName,"Elementary_Data":columnName,"Label":columnName,"Id":tableName+'.'+columnName});
          console.log("columnsTableData>>>>>>>>>", JSON.stringify(this.columnsTableData));
          
          setTimeout(() => {
            this.showdetailsGrid=false;
          }, 200);

          setTimeout(() => {
            this.showdetailsGrid=true;
          }, 200);

        }
    }

  }
  console.log("ITEMS DATA JSON>>>>>>>>>>>>>>",this.itemsData);
}

removeTable(tableName:string){

for(let i=0;i<this.itemsData.length;i++){
      if(this.itemsData[i].data.tableName==tableName){
       this.itemsData.splice(i,1);
// this.itemsData[i]= this.itemsData.filter(obj=> obj.tableName != tableName);

      }
    }

this.columnsTableData= this.columnsTableData.filter(obj => obj.TABLE_NAME != tableName);


  setTimeout(() => {
    this.showdetailsGrid=false;
  }, 250);

  setTimeout(() => {
    this.showdetailsGrid=true;
  }, 250);
}



onDeleteClick() {
  
  let json=JSON.parse(this.informationservice.getAgGidSelectedNode());
  console.log("DATA TO BE DELETED>>>>",json);
  let id=json[0].TABLE_NAME+'.'+json[0].Elementary_Data;
 
  console.log("DATAAAAA>>>>",JSON.stringify(this.columnsTableData));
  console.log("IDDDD>>>>",id);
  
  
  this.columnsTableData= this.columnsTableData.filter(obj => obj.Id != id);
  
  for(let i=0;i<this.itemsData.length;i++){
    if(this.itemsData[i].data.tableName==json[0].TABLE_NAME){
      this.itemsData[i].data.selectedColumns= this.itemsData[i].data.selectedColumns.filter((val: any) => val !=json[0].Elementary_Data);
    }
  }

   setTimeout(() => {
    this.showTablesColumns=false;
    this.showdetailsGrid=false;
  }, 100);



  setTimeout(() => {
    this.showdetailsGrid=true;
    this.showTablesColumns=true;

  }, 100);
  
  this.informationservice.setAgGidSelectedNode("");

}



openDataFilter() {

  if(this.showfilterGrid ==false){
    this.showfilterGrid = true;
  }else{
    this.showfilterGrid = false;
  }
  
}


onDataFilterAdd() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '700px';

  const data = {
    itemsData: this.itemsData,
    case:"create"
  };
  const dialogRef =  this.dialog.open(DataFilterComponent,{
    data: data,
    width: '50%',
    height: '60%',
  });

  dialogRef.afterClosed().subscribe(res => {
  if(res[0].grouping!="" && res[0].firstOperand!="" && res[0].firstValue!="" && res[0].operator!="" && res[0].secondOperand!="" && res[0].secondValue!=""){
    this.allConditions.push({
      "grouping":res[0].grouping,
      "firstOperand":res[0].firstOperand,
      "firstOperandValue":res[0].firstValue,
      "operator":res[0].operator,
      "secondOperand":res[0].secondOperand,
      "secondOperandValue":res[0].secondValue
    })

this.showfilterGrid=false;

setTimeout(() => {
  this.showfilterGrid=true;
}, 200);
  }
  });

}


onDataFilterUpdate(){
  let selectedCondition=JSON.parse(this.informationservice.getAgGidSelectedNode());
  const data = {
    itemsData: this.itemsData,
    selectedCondition: selectedCondition,
    case:"update"
  };
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '700px';


  const dialogRef =  this.dialog.open(DataFilterComponent,{
    data: data,
    width: '50%',
    height: '60%',
  });

  dialogRef.afterClosed().subscribe(res => {
  let selectedUpdateCondition=selectedCondition[0].grouping+selectedCondition[0].firstOperand+selectedCondition[0].firstOperandValue+selectedCondition[0].operator+selectedCondition[0].secondOperand+selectedCondition[0].secondOperandValue;
  
  for(let i=0;i<this.allConditions.length;i++){
    console.log("COND1>>>>>>>>>>>>>>>>",this.allConditions[i].grouping+this.allConditions[i].firstOperand+this.allConditions[i].firstOperandValue+this.allConditions[i].operator+this.allConditions[i].secondOperand+this.allConditions[i].secondOperandValue);
    console.log("COND2>>>>>>>>>>>>>>>",selectedUpdateCondition);
    if(this.allConditions[i].grouping+this.allConditions[i].firstOperand+this.allConditions[i].firstOperandValue+this.allConditions[i].operator+this.allConditions[i].secondOperand+this.allConditions[i].secondOperandValue==selectedUpdateCondition){
      this.allConditions[i].grouping=res[0].grouping;
      this.allConditions[i].firstOperand=res[0].firstOperand;
      this.allConditions[i].firstOperandValue=res[0].firstValue;
      this.allConditions[i].operator=res[0].operator;
      this.allConditions[i].secondOperand=res[0].secondOperand;
      this.allConditions[i].secondOperandValue=res[0].secondValue;
    }
  }

this.showfilterGrid=false;

setTimeout(() => {
  this.showfilterGrid=true;
}, 200);
  
  });


}



onDataFilterDelete(){
  
  let selectedCondition=JSON.parse(this.informationservice.getAgGidSelectedNode());
console.log("OBJECT>>>>",selectedCondition[0].grouping+selectedCondition[0].firstOperand+selectedCondition[0].firstOperandValue+selectedCondition[0].operator+selectedCondition[0].secondOperand+selectedCondition[0].secondOperandValue);
  this.allConditions= this.allConditions.filter(obj => obj.grouping+obj.firstOperand+obj.firstOperandValue+obj.operator+obj.secondOperand+obj.secondOperandValue !=selectedCondition[0].grouping+selectedCondition[0].firstOperand+selectedCondition[0].firstOperandValue+selectedCondition[0].operator+selectedCondition[0].secondOperand+selectedCondition[0].secondOperandValue);

}

showSQL(source:number){

let cols="";
let tables="";
let conditions="";

for(let i=0;i<this.itemsData.length;i++){
  for(let j=0;j<this.itemsData[i].data.selectedColumns.length;j++){
    if(j != this.itemsData[i].data.selectedColumns.length-1){
    cols += this.itemsData[i].data.tableName+'.'+ this.itemsData[i].data.selectedColumns[j]+",";  
    }else{
      cols += this.itemsData[i].data.tableName+'.'+ this.itemsData[i].data.selectedColumns[j];  
    }
  }
  if(i!=this.itemsData.length-1){
  tables+=this.itemsData[i].data.tableName+',';
  }else{
    tables+=this.itemsData[i].data.tableName;
  }
}

for(let z=0;z<this.allConditions.length;z++){
  if(this.allConditions[z].grouping == "And" || this.allConditions[z].grouping == "Or"){
      if(this.allConditions[z].secondOperand=="Parameter"){
        conditions+=" "+this.allConditions[z].grouping+" "+this.allConditions[z].firstOperandValue+" "+this.allConditions[z].operator+" ["+this.allConditions[z].secondOperandValue+"] ";
      }else{
        conditions+=" "+this.allConditions[z].grouping+" "+this.allConditions[z].firstOperandValue+" "+this.allConditions[z].operator+" "+this.allConditions[z].secondOperandValue+" ";
      }
  }else{
    if(this.allConditions[z].secondOperand=="Parameter"){
       conditions+=" "+this.allConditions[z].firstOperandValue+" "+this.allConditions[z].operator+" ["+this.allConditions[z].secondOperandValue+"] ";

    }else{
       conditions+=" "+this.allConditions[z].firstOperandValue+" "+this.allConditions[z].operator+" "+this.allConditions[z].secondOperandValue+" ";
    }
  }
}

if(conditions==""){
  this.sql_query="SELECT "+cols+" FROM "+tables;
  }else{
this.sql_query="SELECT "+cols+" FROM "+tables+" WHERE "+conditions;
}

if(source==1){
const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '700px';


  const dialogRef =  this.dialog.open(ShowGeneratedQueryComponent,{
    data: this.sql_query,
    width: '60%',
    height: '60%',
  });

  dialogRef.afterClosed().subscribe(res => {
  
  });




}
}
}
