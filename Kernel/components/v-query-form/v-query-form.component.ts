import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Optional } from 'ag-grid-community';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
//test2
import { InformationService } from 'src/app/Kernel/services/information.service';


@Component({
  selector: 'v-query-form',
  templateUrl: './v-query-form.component.html',
  styleUrls: ['./v-query-form.component.css']
})
export class VQueryFormComponent implements OnInit {
  public actionType:any = 'saveNew';
  public fetchDynamicHeaderData: string='';
  public fetchDynamicData: string='';
  public agColumnsJson: any = [];
  public agColumns: AgColumns[] = [];
  public query:any;
  public queryId:any;
  public queryParams:any;
  queryParamsForm = new FormGroup({});
  public showInput :boolean=false;
  public showExecGrid:boolean=false;
  public parameters: any;
  public agGridSelectedNodes: any = '';
  public currentQuery:any;
  public formExists:boolean=false;
  public execHeads:any;
  public getQueryList=GlobalConstants.getQueryList;
  public queryName:any;
  queryFormpossibleButtons:any[]=[{id:'1',name:'Save'},{id:'2',name:'Execute'},{id:'3',name:'Rule'}];
  public listOfButtons:any[]=[];
  public isRuleTriggered:boolean=false;
  public displayMainQuery:boolean=true;
  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;
  @Input() public objectId:any;
  public paramKeysValues:any []=[];
  public conditionId:any;
  public buttonId:any;
  selectedQueryForm = new FormGroup({
    selectedMainQuery : new FormControl('')
  });

  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router,
    //test2
    public informationservice: InformationService) { }

    get formField(): FormControl {
      return this.parentForm?.get(this.fieldName) as FormControl;
    }

   async ngOnInit() {
   
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('agGidSelectedQueryForm_')) {
        localStorage.removeItem(key);
      }
    }

    console.log("V-QUERY-FORM>>>>>>>",this.objectId);


    const getQueryFormButtonJSONApi=from(axios.get(GlobalConstants.getQueryFormButtonJSON+this.objectId));
    const getQueryFormButtonJSON=await lastValueFrom(getQueryFormButtonJSONApi);

      this.listOfButtons=getQueryFormButtonJSON.data;

      //console.log("LIST OF BUTTONS>>>>>>>>",this.listOfButtons);

      for(let i =0;i<this.listOfButtons.length;i++){
        console.log("LIST OF BUTTONS>>>>>>>>>",this.listOfButtons[i]);
        
        if(this.listOfButtons[i].id=="2"){
            document.getElementById("mainQueryinput").style.display='none';
        }
        
        if(this.listOfButtons[i].id=="3"){
          this.isRuleTriggered=true;
          this.buttonId="Yes";
          
        }
      }
      
      
      if(this.informationservice.getAgGidSelectedNodeRule()!=null || this.informationservice.getAgGidSelectedNodeRule()!=''){
        
        let ruleDataJson=JSON.parse(this.informationservice.getAgGidSelectedNodeRule());
        let ruleCode=parseFloat(ruleDataJson[0].COLVALUE);

        const checkIfConditionExistsApi=from(axios.get(GlobalConstants.checkIfConditionExists+ruleCode));
        const checkIfConditionExists=await lastValueFrom(checkIfConditionExistsApi);

        

        if(checkIfConditionExists.data!=0){
          this.actionType='update';
        }


        console.log("ruleCode>>>>>>>>>",ruleCode);
        const getQueryFormApi=from(axios.get(GlobalConstants.getQueryForm+ruleCode));
        const getQueryForm=await lastValueFrom(getQueryFormApi);
        console.log("Get QUERY FORM DATA>>>>>>>>>>",getQueryForm.data);

        this.selectedQueryForm.controls['selectedMainQuery'].setValue(getQueryForm.data[0][0].qbeId);
        const getQueryNameApi=from(axios.get(GlobalConstants.getQbeName+getQueryForm.data[0][0].qbeId));
        const getQueryName=await lastValueFrom(getQueryNameApi);
        $("#selectedMainQuery_lookupName").val(getQueryName.data);

        this.conditionId=getQueryForm.data[0][0].conditionId;

        const getQueryParamsApi=from(axios.get(GlobalConstants.getQueryParams+getQueryForm.data[0][0].qbeId))
        const getQueryParams=await lastValueFrom(getQueryParamsApi);
        this.query=getQueryParams.data[0].query;
        this.parameters=JSON.parse(getQueryParams.data[0].queryParams);
        this.execHeads=JSON.parse(getQueryParams.data[0].execHeads);
        console.log("QUERYFORM>>>>>>>>>>>>",getQueryForm);
        for(let i=0;i<getQueryForm.data[1].length;i++){
   
          this.queryParamsForm.addControl(getQueryForm.data[1][i].paramName, new FormControl(''));
          this.queryParamsForm.controls[getQueryForm.data[1][i].paramName].setValue(getQueryForm.data[1][i].CONDITION_VAR_VALUE);
          // this.parameters.push({"paramName":getQueryForm.data[1][i].CONDITION_VAR_TECHNICAL_NAME,"paramType":)
    //       localStorage.setItem('agGidSelectedQueryForm_('+getQueryForm.data[1][i].paramName+')',getQueryForm.data[1][i].CONDITION_VAR_VALUE);
    //       localStorage.setItem('agGidSelectedQueryForm_('+getQueryForm.data[1][i].CONDITION_VAR_TECHNICAL_NAME+')',getQueryForm.data[1][i].CONDITION_VAR_VALUE);
    console.log("CONDITION_VAR_TECHNICAL_NAME>>>>>>",getQueryForm.data[1][i].CONDITION_VAR_TECHNICAL_NAME);
    console.log("CONDITION_VAR_VALUE>>>>>>",getQueryForm.data[1][i].CONDITION_VAR_VALUE);
           this.informationservice.setDynamicService('agGidSelectedQueryForm_('+getQueryForm.data[1][i].paramName+')',getQueryForm.data[1][i].CONDITION_VAR_VALUE);


        }
        this.queryName=$("#selectedMainQuery_lookupName").val();

        //this.parameters
        setTimeout(() => {
          this.showInput=true;
          console.log("QQQQQQQQQQQ>>>>",this.queryParamsForm.controls);
          if(getQueryParams.data[0]!=null || getQueryParams.data[0]!='' || getQueryParams.data[0]!='[]'){
            this.formExists=true;
          }
        }, 500);
        
      }

      
      setTimeout(() => {
        if(this.isRuleTriggered){
          if(this.buttonId=="Yes"){
              document.getElementById("mainQueryInputParent").style.display='none';
              document.getElementById("queryTitle").style.display='none';
              document.getElementById("allParamInputs").style.display='none';
              document.getElementById("allButtons").style.display='none';          
          }
          this.execution();
        }
      }, 500);
      
  }

  async execution(){
    this.agColumnsJson=[];
    this.agColumns=[];
    this.showExecGrid=true;

    this.currentQuery=this.query;

    if(this.formExists==true){

      
      
      for(let i=0;i<this.parameters.length;i++){
        if(this.queryParamsForm.get(this.parameters[i].paramName)?.value.includes(",")){
          let multiParam=this.queryParamsForm.get(this.parameters[i].paramName)?.value.replaceAll(",","','");
          this.currentQuery=this.currentQuery.replaceAll("["+this.parameters[i].paramName+"]","'"+multiParam+"'");
        }else{
          this.currentQuery=this.currentQuery.replaceAll("["+this.parameters[i].paramName+"]","'"+this.queryParamsForm.get(this.parameters[i].paramName)?.value+"'");
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
      
          for(let i = 0; i < this.execHeads.length; i++) {
            this.agColumnsJson.push({"headerName": this.execHeads[i].headerName, "field": this.execHeads[i].field});
          }
          this.agColumns.push(this.agColumnsJson);
          this.currentQuery=btoa(this.currentQuery);

          const fetchDynamicDataQueryFormApi=from(axios.post(GlobalConstants.fetchDynamicDataQueryForm,{"query":this.currentQuery}))
          const fetchDynamicDataQueryForm=await lastValueFrom(fetchDynamicDataQueryFormApi);
          this.fetchDynamicData=fetchDynamicDataQueryForm.data;
          console.log("FETCH DYNAMIC DATA>>>>>>>>>>",fetchDynamicDataQueryForm.data);

       //   this.fetchDynamicData=GlobalConstants.fetchDynamicData +this.currentQuery;
      
     
      this.agColumns.push(this.agColumnsJson);

      //console.log("BBBBBBBBBB>>>>>>>>>",this.fetchDynamicData);

        setTimeout(() => {
          this.showExecGrid=false;

        }, 100);
        setTimeout(() => {
          this.showExecGrid=true;
          console.log("DYNAMIC DATA>>>>>>>>>",this.fetchDynamicData);
        }, 300);
          
  }

  async querySelected(event:any){
    console.log("OOPAAAAAAA");
    this.queryParamsForm= new FormGroup({});
    this.queryParamsForm.updateValueAndValidity();

    this.showExecGrid=false;
    this.execHeads=[];
    this.agColumnsJson=[];
    this.agColumns=[];

  const getQueryParamsApi=from(axios.get(GlobalConstants.getQueryParams+this.selectedQueryForm.get("selectedMainQuery").value))
  const getQueryParams=await lastValueFrom(getQueryParamsApi);
  this.query=getQueryParams.data[0].query;
  this.parameters=JSON.parse(getQueryParams.data[0].queryParams);
  this.queryId=getQueryParams.data[0].queryId;
  this.queryName=getQueryParams.data[0].queryName;
  this.execHeads=JSON.parse(getQueryParams.data[0].execHeads);
  for(let i=0;i<this.parameters.length;i++){
  this.queryParamsForm.addControl(this.parameters[i].paramName, new FormControl(''));
  }
console.log("PARAMETERS>>>>>>>>",this.parameters);
  setTimeout(() => {
    this.showInput=true;
  }, 500);

  if(getQueryParams.data[0]!=null || getQueryParams.data[0]!='' || getQueryParams.data[0]!='[]'){
    this.formExists=true;
  }

}

  async saveData(){
    this.paramKeysValues=[];
  console.log("EEEEEEEEEEEE>>>>>>>>",this.queryParamsForm);

  Object.keys(this.queryParamsForm.controls).forEach(key => {
    for(let i =0;i<this.parameters.length;i++){
      if(this.parameters[i].paramName==key){
        this.paramKeysValues.push({"key":key,"value":this.queryParamsForm.controls[key].value,"id":"var_"+this.parameters[i].paramId});
      }
    }
   });


  let jsonData={
    
    ruleCode:parseFloat(JSON.parse(this.informationservice.getAgGidSelectedNodeRule())[0].COLVALUE),
    qbeId:this.selectedQueryForm.get('selectedMainQuery').value,
    paramKeysValues:this.paramKeysValues,
    //test2
    userId:this.informationservice.getLogeduserId()
  }

  console.log("JSONDATA>>>>>>>>>>",jsonData);
   const insertQueryFormApi=from(axios.post(GlobalConstants.insertQueryForm,jsonData));
   const insertQueryForm=await lastValueFrom(insertQueryFormApi);

if(insertQueryForm.data==0){
  this.commonFunctions.alert("alert", "Success");
  setTimeout(() => {
    this.actionType='update';
  }, 200);
}else{
  this.commonFunctions.alert("alert", "Failure To Save");
}

 }


 async updateData(){
  this.paramKeysValues=[];
console.log("EEEEEEEEEEEE>>>>>>>>",this.queryParamsForm);

// Object.keys(this.queryParamsForm.controls).forEach(key => {
//     this.paramKeysValues.push({"key":key,"value":this.queryParamsForm.controls[key].value})
//  });
console.log("PARAMETERS>>>>>>>>>>>>",this.parameters);
console.log("this.queryParamsForm.controls>>>>>>>>>>>>",this.queryParamsForm.controls);

setTimeout(() => {
  Object.keys(this.queryParamsForm.controls).forEach(key => {
    for(let i =0;i<this.parameters.length;i++){
      console.log("PARAMNAME>>>>>>>>>"+this.parameters[i].paramName);
        console.log("KEY>>>>>>>>>>>>>"+key);
      if(this.parameters[i].paramName==key){
       
        this.paramKeysValues.push({"key":key,"value":this.queryParamsForm.controls[key].value,"id":"var_"+this.parameters[i].paramId});
      }
    } 
   });
  
}, 300);

setTimeout(async () => {
  console.log("PARAMKEYSVALUES>>>>>>>>>>>>>>>",this.paramKeysValues);
  let jsonData={
    conditionId:this.conditionId,
    
    ruleCode:parseFloat(JSON.parse(this.informationservice.getAgGidSelectedNodeRule())[0].COLVALUE),
    qbeId:this.selectedQueryForm.get('selectedMainQuery').value,
    paramKeysValues:this.paramKeysValues,
    //test2
    userId:this.informationservice.getLogeduserId()
  }
  
  console.log("JSONDATA>>>>>>>>>>",jsonData);
   const updateQueryFormApi=from(axios.post(GlobalConstants.updateQueryForm,jsonData));
   const updateQueryForm=await lastValueFrom(updateQueryFormApi);
  
  if(updateQueryForm.data==0){
  this.commonFunctions.alert("alert", "Success");
  }else{
  this.commonFunctions.alert("alert", "Failure To Save");
  }
  
}, 700);

}
}
