import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-execute-query',
  templateUrl: './execute-query.component.html',
  styleUrls: ['./execute-query.component.css']
})
export class ExecuteQueryComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  // public agColumnsJson:any = [];
  
  public parameters: any;
  public showPopup: boolean = false;
  public agGridSelectedNodes: any = '';
  public queryParam :any=this.data.query;
  public fetchDynamicHeaderData: string='';
  public fetchDynamicData: string='';
  public getParamSession: string='';

  public formExists:boolean=false;
  public showInput :boolean=false;
  public showExecGrid:boolean=false;
  public formValues:any=[];
  public currentQuery:any;
  public subQuery:any;
  paramValForm = new FormGroup({});

  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router,
    public informationservice: InformationService) { }


    public agColumnsJson: any = [];

  ngOnInit(): void {

    this.http.post<any>(GlobalConstants.getParamSession+"paramAdd_"+sessionStorage.getItem("session_serial"),{}).subscribe(
      async (res: any) => {
        if (res.status == 'Fail') {

        } else {

          for(let i = 0; i < res.length; i++) {
            console.log("PARAM>>>>>>>>",res[i]);
         // if(res[i].paramType=="query"){
          // const getSubQueriesApi=from(axios.get(GlobalConstants.getSubQueries+sessionStorage.getItem("session_serial")+"/"+res[i].paramDefault+"/"+this.informationservice.getLogeduserId()))
          // const getSubQueries=await lastValueFrom(getSubQueriesApi);
          // this.subQuery=getSubQueries.data[0].query;

           // this.data.query=this.data.query.replaceAll("["+res[i].paramName+"]",this.subQuery);

       //   }else{
          this.paramValForm.addControl(res[i].paramName, new FormControl(''));
        //  }
          }
        this.parameters = res;
        console.log("THIS PARAMETERS>>>>>>>>>>",this.parameters);
        console.log("THIS PARAMETERS FORM>>>>>>>>>>",this.paramValForm);

          setTimeout(() => {
            console.log("ELIE1")
            this.showInput=true;
          }, 700);

          if(res!=null || res!='' || res!='[]'){
            console.log("ELIE2")

            this.formExists=true;
          }

        }
      });
  }

  // execution(){
  //   this.showExecGrid=true;

  //   this.currentQuery=this.data.query;

  //   if(this.formExists==true){

  //     for(let i=0;i<this.parameters.length;i++){   
  //       if(this.parameters[i].paramType!="query"){
  //       this.currentQuery=this.currentQuery.replaceAll("["+this.parameters[i].paramName+"]","'"+this.paramValForm.get(this.parameters[i].paramName)?.value+"'");
  //       }
  //     }
  //   }
    
  

  //   this.http.get<any>(GlobalConstants.fetchDynamicHeaderData+"execHeads_"+sessionStorage.getItem("session_serial")).subscribe(
  //     (res: any) => {
  //       if (res.status == 'Fail') {
  //         this.commonFunctions.alert("alert", res.description);
  //       } else {
          
  //         for(let i = 0; i < res.length; i++) {
  //           this.agColumnsJson.push({"headerName": res[i].headerName, "field": res[i].field});
  //         }
  //         this.agColumns.push(this.agColumnsJson);
  //         this.currentQuery=btoa(this.currentQuery);

  //         this.fetchDynamicData=GlobalConstants.fetchDynamicData +this.currentQuery;
      
  //       }

  //     });
     
  //   this.agColumns.push(this.agColumnsJson);
  // }

  async execution(){
    this.agColumnsJson=[];
    this.agColumns=[];
    this.showExecGrid=true;

    this.currentQuery=this.data.query;

    if(this.formExists==true){

      console.log("CUURENT QUERY>>>>>>>",this.currentQuery);

      
      for(let i=0;i<this.parameters.length;i++){
        console.log("PENETRATION>>>>>>>>",this.paramValForm.get(this.parameters[i].paramName)?.value);

        if(this.paramValForm.get(this.parameters[i].paramName)?.value.includes(",")){
          let multiParam=this.paramValForm.get(this.parameters[i].paramName)?.value.replaceAll(",","','");
          this.currentQuery=this.currentQuery.replaceAll("["+this.parameters[i].paramName+"]","'"+multiParam+"'");
        }else{
          this.currentQuery=this.currentQuery.replaceAll("["+this.parameters[i].paramName+"]","'"+this.paramValForm.get(this.parameters[i].paramName)?.value+"'");
        }
      }

      console.log("The current Query is>>>>>>>>",this.currentQuery);

      console.log("The encoded Query is>>>>>>",btoa(this.currentQuery));

    }
    
      
    // this.agColumnsJson.push({
    //     headerName: '',
    //     field: '',
    //     checkboxSelection: true,
    //     width: '25px',
    //     headerCheckboxSelection: true
    //   });
      
            this.http.get<any>(GlobalConstants.fetchDynamicHeaderData+"execHeads_"+sessionStorage.getItem("session_serial")).subscribe(
      (res: any) => {
        if (res.status == 'Fail') {
          this.commonFunctions.alert("alert", res.description);
        } else {
          
          for(let i = 0; i < res.length; i++) {
            this.agColumnsJson.push({"headerName": res[i].headerName, "field": res[i].field});
          }
          this.agColumns.push(this.agColumnsJson);
          this.currentQuery=btoa(this.currentQuery);

          this.fetchDynamicData=GlobalConstants.fetchDynamicData +this.currentQuery;
      
        }

      });
     
      this.agColumns.push(this.agColumnsJson);

        setTimeout(() => {
          this.showExecGrid=false;

        }, 100);
        setTimeout(() => {
          this.showExecGrid=true;
          console.log("DYNAMIC DATA>>>>>>>>>",this.fetchDynamicData);
        }, 300);
          
  }


}
