import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { AddParamsComponent } from './add-params/add-params.component';
import { settings } from 'cluster';
import { InformationService } from 'src/app/Kernel/services/information.service';


@Component({
  selector: 'app-parameter-builder',
  templateUrl: './parameter-builder.component.html',
  styleUrls: ['./parameter-builder.component.css']
})
export class ParameterBuilderComponent implements OnInit {
  public actionType: string='';
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  //public getParamSession: any='';
  public paramArray:any;
  public action:any='';
  public selectedParams:any;
  subsVar: Subscription;
  showGrid:Boolean=true;
  public getParamSession=GlobalConstants.getParamSession+"paramAdd_"+sessionStorage.getItem("session_serial");

  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ParameterBuilderComponent>,
    public informationservice: InformationService

    ) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {
      this.actionType = params.get('actionType');
    });


    
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: false
      },
      {
        headerName: 'Parameter Name',
        field: 'paramName',
      },
      {
        headerName: 'Parameter Type',
        field: 'paramType',
      },     
      {
        headerName: 'Default Value',
        field: 'paramDefault',
      },
     
    ];
    this.agColumns.push(this.agColumnsJson);

  }

 

onAddClick(){
this.action='create';
  let info = {};
    info = {
      action:this.action,
    };
  
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '700px';

  const dialogRef = this.dialog.open(AddParamsComponent, {
    data: info,
    width: '50%',
    height: '60%',
  });

  dialogRef.afterClosed().subscribe(result => {
   this.showGrid=false;
   setTimeout(() => {
    this.showGrid=true;
   }, 100);
  
  });

}

onUpdateClick(){
this.action='update';
if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode()==""){

}else{


this.http.post<any>(GlobalConstants.getParamSession+"paramAdd_"+sessionStorage.getItem("session_serial"),{}, { headers: GlobalConstants.headers }).subscribe(
    (res: any) => {
      let info={
      
        action:this.action,
        paramToUpdate:this.informationservice.getAgGidSelectedNode(),
        paramArray:res
  };

      const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '700px';

  const dialogRef = this.dialog.open(AddParamsComponent, {
    data: info,
    width: '50%',
    height: '60%',
  });

  dialogRef.afterClosed().subscribe(result => {
   this.showGrid=false;
   setTimeout(() => {
    this.showGrid=true;
   }, 100);
  
  });
});

    }
  }

onDeleteClick(){
  if (this.informationservice.getAgGidSelectedNode()==""){
  }else{
    
    this.paramArray = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.paramArray;
    if(selectedNodes.indexOf(",") != -1) {
      selectedNodes = selectedNodes.split(',');
  
     for (let i = 0; i < selectedNodes.length; i++) {
      this.http.delete<any>(GlobalConstants.deleteParameter + selectedNodes[i]+"/"+sessionStorage.getItem("session_serial"),
      {headers: GlobalConstants.headers}).subscribe({
      next:(res) => {
        this.commonFunctions.alert("alert", 'Deleted Successfully');
      },
      error:(error) => {
        console.log(error);
      }
     } );
  }
} else {
  this.http.delete<any>(GlobalConstants.deleteParameter + selectedNodes+"/"+sessionStorage.getItem("session_serial"),
    {headers: GlobalConstants.headers}).subscribe({
    next:(res) => {
      console.log(res);
      this.commonFunctions.alert("alert", 'Deleted Successfully');
    },
   error:(error) => {
      console.log(error);
    }
});
}
}
this.getParamSession='';

setTimeout(() => {
  this.getParamSession=GlobalConstants.getParamSession+"paramAdd_"+sessionStorage.getItem("session_serial");
}, 1000);


}

 
      ngOnDestroy() {
        if (this.subsVar) {
           this.subsVar.unsubscribe()
         }
      }
      
      closeDialog(): void {
        this.dialogRef.close();
      }
    }
    

