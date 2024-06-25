import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ButtonRendererComponent } from './buttonRenderer.component';
import { ExecuteQueryComponent } from './static-query-builder/execute-query/execute-query.component';
import { ImportQueryComponent } from './import-query/import-query.component';
import { InformationService } from 'src/app/Kernel/services/information.service';


@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getQbeQueryApi  = GlobalConstants.fetchQbeMappingApi;
  public showPopup: boolean = false;
  public agGridSelectedNodes: any = '';
  public action:any;
  subsVar: Subscription;
  frameworkComponents:any;

  public selectedQuery:any;
  public isQueryexecute:boolean;


  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService, private dialog: MatDialog,
    public informationservice: InformationService) {

      this.onRunButtonClick = this.onRunButtonClick.bind(this);

      this.frameworkComponents = {
        buttonRenderer: ButtonRendererComponent,
      };
   }

  ngOnInit(){
    
    this.informationservice.removeAgGridSelectedNode();

    this.http.delete<any>(GlobalConstants.deleteSessions+sessionStorage.getItem("session_serial"),
    {headers: GlobalConstants.headers}).subscribe({
    next:(res) => {
      console.log(res);
    //  this.commonFunctions.reloadPage('/qbe/queryBuilder');

    },
    error:(error) => {
      console.log(error);
    }
   });




    sessionStorage.setItem("session_serial",this.generateSerial());

    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Query Id',
        field: 'QBE_ID',
        width: '25px',
      },
      {
        headerName: 'Query Name',
        field: 'QUERY_NAME',
      },
      {
        headerName: 'Run',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClick.bind(this),
          label: 'Click 1'
        }
        
      },
      
      
      
      {
        headerName: 'User Name',
        field: 'EMP_NAME',
      },
      {
        headerName: 'Folder',
        field: '',
      },
      {
        headerName: 'Query Type',
        field: 'import_flag',
      },
      {
        headerName: 'Version',
        field: 'VERSION_NO',
      },
      {
        headerName: 'Creation Date',
        field: 'CREATION_DATE',
      },
      {
        headerName: 'DataStore Id',
        field: 'DATA_STORE_ID',
      },
    ];

    this.agColumns.push(this.agColumnsJson);
    // this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
    //   this.onAddClick();
    // });
    // this.subsVar = this.eventEmitterService.onUpdateClick.subscribe(() => {
    //   this.onUpdateClick();
    // });
    // this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {
    //   this.onDeleteClick();
    // });
  }

  ngOnDestroy() {
    if (this.subsVar) {
       this.subsVar.unsubscribe()
     }
  }


  onRunButtonClick(e:any){
    let info = {};
    if (JSON.parse(this.informationservice.getAgGidSelectedNode()).length>1 || this.informationservice.getAgGidSelectedNode()==""){

    }else{

      this.http.get<any>(GlobalConstants.decodeQuery+sessionStorage.getItem("session_serial")+"/"+JSON.parse(this.informationservice.getAgGidSelectedNode())[0].QBE_ID+"/"+this.informationservice.getLogeduserId(), { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
          } else {
            info = {
              query: res[0].query
            };
          }
        });

    
    setTimeout(() => {
      
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
      this.http.delete<any>(GlobalConstants.deleteSessions+sessionStorage.getItem("session_serial"),
        {headers: GlobalConstants.headers}).subscribe({
        next:(res) => {
          console.log(res);
        //  this.commonFunctions.reloadPage('/qbe/queryBuilder');

        },
        error:(error) => {
          console.log(error);
        }
       });
    });
  }, 1000);


  }
}

  onUpdateClick(){
    this.action='update';
if (JSON.parse(this.informationservice.getAgGidSelectedNode()).length>1 || this.informationservice.getAgGidSelectedNode()==""){
      this.commonFunctions.alert("alert","Select at least 1 row");
}else{

  // this.http.get<any>(GlobalConstants.updateQuery+sessionStorage.getItem("session_serial")+"/"+this.informationservice.getAgGidSelectedNode()+"/"+this.informationservice.getLogeduserId(), { headers: GlobalConstants.headers }).subscribe(
  //   (res: any) => {
  //     if (res.status == 'Fail') {
  //     } else {
      
  //     }
  //   });
  if(JSON.parse(this.informationservice.getAgGidSelectedNode())[0].import_flag=="SQB"){
      console.log('Static Query Builder button clicked');

      this.showPopup = false;
      this.commonFunctions.navigateToPage(
        "/qbe/queryBuilder/form/update/-1");
      }
      if(JSON.parse(this.informationservice.getAgGidSelectedNode())[0].import_flag=="QBE"){
        console.log('Static Query Builder button clicked');
  
        this.showPopup = false;
        this.commonFunctions.navigateToPage(
          "/qbe/queryBuilder/formQBE/update/-1");
        }
  }

  }

  onDeleteClick() {
    
    for(let i=0;i<JSON.parse(this.informationservice.getAgGidSelectedNode()).length;i++){
      
      if(i != JSON.parse(this.informationservice.getAgGidSelectedNode()).length-1){
  
        
        this.agGridSelectedNodes += JSON.parse(this.informationservice.getAgGidSelectedNode())[i].QBE_ID+",";
   
  }else{

    
    this.agGridSelectedNodes += JSON.parse(this.informationservice.getAgGidSelectedNode())[i].QBE_ID;

      }  
  }
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", 'Please select a row to delete');
    } else {
      if(selectedNodes.indexOf(",") != -1) {
      selectedNodes = selectedNodes.split(',');
      
          console.log(" selectedNodes ALL", selectedNodes);

      for (let i = 0; i < selectedNodes.length; i++) {
        console.log(" selectedNodes[i]", selectedNodes[i]);
        this.http.delete<any>(GlobalConstants.deleteQueryData + selectedNodes[i],
          {headers: GlobalConstants.headers}).subscribe({
          next:(res) => {
            console.log(res);
            if(res==null){
              this.commonFunctions.alert("alert", "Query is used in In'Display!");
            }else{
            this.commonFunctions.alert("alert", 'Deleted Successfully');
            this.commonFunctions.reloadPage('/qbe/queryBuilder');
            }
          },
          error:(error) => {
            console.log(error);
          }
         } );
      }
    } else {
      this.http.delete<any>(GlobalConstants.deleteQueryData + selectedNodes,
        {headers: GlobalConstants.headers}).subscribe({
        next:(res) => {
          console.log(res);
          if(res==null){
            this.commonFunctions.alert("alert", "Query is used in In'Display!");
          }else{
          this.commonFunctions.alert("alert", 'Deleted Successfully');
          this.commonFunctions.reloadPage('/qbe/queryBuilder');
          }
        },
       error:(error) => {
          console.log(error);
        }
    });
    }
  }
}  
  
  

    onAddClick(){
      this.showPopup = true;
    }
  
    onQBEClick(): void {
      console.log('QBE button clicked');
      this.showPopup = false;
      this.commonFunctions.navigateToPage(
        "/qbe/queryBuilder/formQBE/create/-1");
    }
  
    onStaticQueryBuilderClick(): void {
      console.log('Static Query Builder button clicked');
      this.showPopup = false;
      this.commonFunctions.navigateToPage(
        "/qbe/queryBuilder/form/create/-1");
        
    }

    onCQLClick(): void {
      console.log('CQL button clicked');
      this.showPopup = false;
      this.commonFunctions.navigateToPage(
        "/qbe/queryBuilder/formCQL/create/-1");
    }

    onExitButtonClick(): void {
      this.showPopup = false;
    }

    generateSerial() {
    
      'use strict';
      
      var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
          
          serialLength = 10,
          
          randomSerial = "",
          
          i,
          
          randomNumber;
      
      for (i = 0; i < serialLength; i = i + 1) {
          
          randomNumber = Math.floor(Math.random() * chars.length);
          
          randomSerial += chars.substring(randomNumber, randomNumber + 1);
          
      }

return randomSerial;
}

importQuery(){

  let info = {};


  
  setTimeout(() => {
    
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '500px';
  
  const dialogRef = this.dialog.open(ImportQueryComponent, {
    data: info,
    width: '50%',
    height: '60%',
  });


  dialogRef.afterClosed().subscribe(result => {
   
  });
}, 1000);

}

exportQuery(){
  if (JSON.parse(this.informationservice.getAgGidSelectedNode()).length>1 || this.informationservice.getAgGidSelectedNode()==""){
     
    this.commonFunctions.alert("alert", "Select one query to export!");

     }else{
 let queryToExport=JSON.parse(this.informationservice.getAgGidSelectedNode())[0].QBE_ID;


 this.http.get<any>(GlobalConstants.exportQuery+queryToExport, { headers: GlobalConstants.headers }).subscribe(
  (res: any) => {
      if(res!=null){
       let queryName=res[0].queryName;
      let  queryFile=res[0].query;
         
            const fileType = 'application/xml';
            const fileName =queryName;
            const byteCharacters = atob(atob(queryFile));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: fileType });

            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();

            URL.revokeObjectURL(url);
      }else{

          this.commonFunctions.alert("alert", "Invalid Query To Export!");
      
        }
    }
  );

}
}
}