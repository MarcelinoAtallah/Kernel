import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { VLookupV2Component } from '../v-lookup-v2.component';

@Component({
  selector: 'v-query-details',
  templateUrl: './v-query-details.component.html',
  styleUrls: ['./v-query-details.component.css']
})
export class VQueryDetailsComponent implements OnInit {
  
  public fetchDynamicHeaderData: string='';
  public fetchDynamicData: string='';
  public agColumnsJson: any = [];
  public agColumns: AgColumns[] = [];
  public query:any;
  public queryId:any;
  public queryParams:any;
  paramValForm = new FormGroup({});
  public showInput :boolean=false;
  public showExecGrid:boolean=false;
  public parameters: any[]=[];
  public agGridSelectedNodes: any = '';
  public currentQuery:any;
  public formExists:boolean=false;
  public execHeads:any;
  public agPrimaryGridHeads:any;
  public label:any;
  public hideExecuteButton:boolean;

  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router,
    private dialogRef: MatDialogRef<VQueryDetailsComponent>,
    ) { }

  async ngOnInit(): Promise<void> {
    this.label=this.data.label;
    const getQueryParamsLookupApi=from(axios.get(GlobalConstants.getQueryParamsLookup+parseFloat(this.data.queryId)))
    const getQueryParamsLookup=await lastValueFrom(getQueryParamsLookupApi);
    this.query=getQueryParamsLookup.data[0].query;
    this.parameters=JSON.parse(getQueryParamsLookup.data[0].queryParams);
    this.queryId=getQueryParamsLookup.data[0].queryId;
    this.execHeads=JSON.parse(getQueryParamsLookup.data[0].execHeads);
    //console.log("PARAMETERS>>>>>>>>>>",this.parameters);
    let paramString=getQueryParamsLookup.data[0].queryParams.replaceAll("\\","").replaceAll("[","").replaceAll("]","").substring(1);
    let finalParamString="["+paramString.substring(0, paramString.length - 1)+"]";
    this.parameters=JSON.parse(finalParamString);

    for(let i=0;i<this.parameters.length;i++){
    this.paramValForm.addControl(this.parameters[i].paramName, new FormControl(''));
    }
    setTimeout(() => {
      this.showInput=true;
    }, 500);

    if(getQueryParamsLookup.data[0]!=null || getQueryParamsLookup.data[0]!='' || getQueryParamsLookup.data[0]!='[]'){
      this.formExists=true;
    }
    this.agPrimaryGridHeads=""
    this.agPrimaryGridHeads+=this.execHeads[0].headerName

    // for(let i = 0; i < this.execHeads.length; i++) {
    //   this.agPrimaryGridHeads+=this.execHeads[i].headerName
    //   if(i!=this.execHeads.length-1){
    //     this.agPrimaryGridHeads+=","
    //   }
    // }

    if(this.parameters.length==0){
      this.hideExecuteButton=true;
      this.execution();
    }



  }

  execution(){
    this.showExecGrid=true;

    this.currentQuery=this.query;

    if(this.formExists==true){

      
      for(let i=0;i<this.parameters.length;i++){   
        this.currentQuery=this.currentQuery.replaceAll("["+this.parameters[i].paramName+"]","'"+this.paramValForm.get(this.parameters[i].paramName)?.value+"'");
      }

    }
    
    this.agColumnsJson.push({
        headerName: '',
        field: '',
        checkboxSelection: true,
        maxWidth: '50',
        headerCheckboxSelection: true
      });
      
          for(let i = 0; i < this.execHeads.length; i++) {
            this.agColumnsJson.push({"headerName": this.execHeads[i].headerName, "field": this.execHeads[i].field});
          }
          this.agColumns.push(this.agColumnsJson);
          this.currentQuery=btoa(this.currentQuery);

          this.fetchDynamicData=GlobalConstants.fetchDynamicData +this.currentQuery;
      
     
      this.agColumns.push(this.agColumnsJson);
  }

  closeDialog(): void {
    this.dialogRef.close();
    
}

}
