import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { format } from 'sql-formatter';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HeadersQueryComponent } from '../static-query-builder/headers-query/headers-query.component';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SavequeryComponent } from '../static-query-builder/savequery/savequery.component';
import { SecurityQueryComponent } from '../static-query-builder/security-query/security-query.component';
import { TypeQueryComponent } from '../static-query-builder/type-query/type-query.component';
import { LinkProcedureComponent } from '../static-query-builder/link-procedure/link-procedure.component';
import { ExecuteQueryComponent } from '../static-query-builder/execute-query/execute-query.component';
import { ParameterBuilderComponent } from '../static-query-builder/parameter-builder/parameter-builder.component';
import { LinkQueryComponent } from '../static-query-builder/link-query/link-query.component';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cqlsh',
  templateUrl: './cqlsh.component.html',
  styleUrls: ['./cqlsh.component.css']
})
export class CqlshComponent implements OnInit {
  dataList: Array<any> = [];
  public actionType: string = '';
  
  public menuPath: any = this.informationservice.getMenuPath();
  public showHideTabs = false;
  
  public userId = this.informationservice.getUserId();
  public showSavePopup: boolean = false;

  public queryIdUpdate: any;
  public isUpdate:boolean=false;

public returnedQuery:string;

  private isQueryValidated: boolean = false;
  private isQuerySavedBeforeExit: boolean = false;
  showCombo:Boolean;

  public getParamCombo=GlobalConstants.getParamCombo+"paramAdd_"+sessionStorage.getItem("session_serial");

  public selectionStart:any;
  public selectionEnd:any;

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
    public informationservice: InformationService) { }

  queryForm = new FormGroup({
    query: new FormControl(''),
    queryName: new FormControl(''),
    paramCombo:new FormControl(''),
  });
  ngOnInit(): void {
    
    this._Activatedroute.paramMap.subscribe((params) => {
      console.log("params>>>>", params);
      // this.userId = params.get('id');
      
      this.informationservice.setUserId(this.userId);

      this.actionType = params.get('actionType');
    });
    
    if(this.actionType=='update'){
      this.http.get<any>(GlobalConstants.decodeQuery+sessionStorage.getItem("session_serial")+"/"+JSON.parse(this.informationservice.getAgGidSelectedNode())[0].QBE_ID+"/"+this.informationservice.getLogeduserId(), { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
          } else {
            this.isUpdate=true;
            this.queryForm.controls['query'].setValue(res[0].query);
            this.queryIdUpdate=res[0].queryId;
          }
        });

    }


    setTimeout(() => {
      

    this.http.get<any>(GlobalConstants.getParamCombo+"paramAdd_"+sessionStorage.getItem("session_serial"), { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        if (res==null){
          this.showCombo=false;
        }else{
          this.showCombo=true;
          this.dataList=res;
        }
      });

    //?????????????????????????????????????????
    this.queryForm.valueChanges.subscribe((value) => {
      this.isQueryValidated = false; // Marks the query as not validated when changes are made
    });
//?????????????????????????????????????????????????
if(this.actionType=='update'){
  this.validateTextarea();
}
}, 500);





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
  onExitButtonClick() {
    if (this.isQueryValid && !this.isQuerySavedBeforeExit) {
      this.showSavePopup = true;
    } else {
      this.goBackToQueryBuilder();
    }
  }
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

  clearTextarea() {
    this.myTextarea = '';
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

  showHeaders() { 
    // this.query=this.myTextarea;
    // let info = {};
    //   info = {
    //     query: this.myTextarea,
    //     actionType: this.actionType,
    //   };
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';
    
    const dialogRef = this.dialog.open(HeadersQueryComponent, {
     // data: info,
      width: '50%',
      height: '60%',
    });


    dialogRef.afterClosed().subscribe(result => {
      this.isQueryexecute = true;
    });

  }

 

  validateTextarea(): any {
    return new Promise((resolve, reject) => {

      let jsonParams = {};
      jsonParams = {
                query: this.myTextarea,
                session_serial:sessionStorage.getItem("session_serial")
      };
     this.http.post<any>(GlobalConstants.cqlValidateQuery, jsonParams, { headers: GlobalConstants.headers }).subscribe(
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
    this.query=this.myTextarea;
    let info = {};
      info = {
        query: this.myTextarea,
        actionType: this.actionType,
        queryFlag:1
      };
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

  }

 


  ///////////////////////////////////////////Popups//////////////////////////////////////////////////////
    openParameterBuilder() {
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
    this.query=this.myTextarea;
    let info = {};
      info = {
        query: this.myTextarea,
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

  }

  linkQuery() {
    if (!this.isQuerySaved) {
      this.showSnackBar('You have to save the query before setting its menu attachment');
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';
    
    const dialogRef =  this.dialog.open(LinkQueryComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      this.isQuerylink = true;
    });
  }

  securityQuery()
  {
    if(this.actionType!='update'){
      this.showSnackBar('You have to save the query before setting its type');
      return;
    }
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '400px';
    
    const dialogRef =  this.dialog.open(SecurityQueryComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      this.isQuerytype = true;
    });
  }

  typeQuery() {

    if(this.actionType!='update'){
      this.showSnackBar('You have to save the query before setting its type');
      return;
    }
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';
    
    const dialogRef =  this.dialog.open(TypeQueryComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      this.isQuerytype = true;
    });
  }
  
  linkProcedure() {
    if (!this.isQuerySaved) {
      this.showSnackBar('You have to save the query before linking it to a procedure');
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';
    
    const dialogRef =  this.dialog.open(LinkProcedureComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      this.isQuerytype = true;
    });
  }

  onParamSelect(value:any) :void{
console.log("onParamSelect >>>>>>> " , value)
if(value!=""){
  if (this.selectionStart!== -1) {
    this.myTextarea = this.myTextarea.substring(0, this.selectionStart) +"["+value+"]"+ this.myTextarea.substring(this.selectionEnd);
  }
  //  this.myTextarea=this.myTextarea+"["+value+"]";
}
    value=null;
  }

  updateExistingQuery(){

    let jsonParams = {};
    jsonParams = {
      userId: this.informationservice.getLogeduserId(),
      query:this.queryForm.get('query')?.value,
      session_serial:sessionStorage.getItem("session_serial"),
      queryId:this.queryIdUpdate
    };
    this.http.post<any>(GlobalConstants.updateQuery, jsonParams, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                
              } else {
                this.commonFunctions.navigateToPage("/qbe/queryBuilder");
 
               
              }
            });
        
  }
 
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  // submitForm() {
  //   let jsonParams = {};
  //   if (this.actionType == 'create') {
  //     this.CreateFirstUser();
  //   }
  // }


  // CreateFirstUser(): any {
  //   return new Promise((resolve, reject) => {
  //     let jsonParams = {};
  //     jsonParams = {
  //       //id: this.id,
  //       userId: this.informationservice.getLogeduserId(),
  //       queryName: this.queryForm.get('queryName')?.value,
  //       query: this.queryForm.get('query')?.value,
  //     };
  //     this.http.post<any>(GlobalConstants.addQueryData, jsonParams, { headers: GlobalConstants.headers }).subscribe(
  //       (res: any) => {
  //         if (res.status == 'Fail') {
  //           alert(res.description);
  //         } else {
  //           console.log("save success!!!!");
  //           alert(res.description);
  //           // this.roleId = res.id;
  //           // this.id = res.id;
  //           // console.log("value id >>>> " + this.id)
  //           // this.CreatOtherUser();
  //         }
  //       });
  //   })

  // }
  testShow(event:any){
    this.selectionStart = event.target.selectionStart;
    this.selectionEnd = event.target.selectionEnd;
    console.log('Selection Start:', this.selectionStart);
    console.log('Selection End:', this.selectionEnd);

  }
}