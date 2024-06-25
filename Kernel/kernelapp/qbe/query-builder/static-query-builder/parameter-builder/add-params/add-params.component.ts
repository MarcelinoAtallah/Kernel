import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-add-params',
  templateUrl: './add-params.component.html',
  styleUrls: ['./add-params.component.css']
})
export class AddParamsComponent implements OnInit {
  public actionType: string='';
  public getParamTypes=GlobalConstants.getParamTypes;
  public allParams: any;
  public currentParam:any;
  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router,
    private dialogRef: MatDialogRef<AddParamsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public informationservice: InformationService) { }
    
  paramForm = new FormGroup({
    paramName: new FormControl(''),
    paramType: new FormControl(''),
    paramDefault: new FormControl(''),

  });

  ngOnInit(): void {



    this._Activatedroute.paramMap.subscribe((params) => {
      this.actionType = params.get('actionType');
    });
    if(this.data.action=='create'){

    }else if(this.data.action=='update'){
        this.paramForm.controls['paramName'].setValue(this.data.paramToUpdate);

        this.allParams=this.data.paramArray;

        this.currentParam=this.data.paramToUpdate;

        for(let i=0;i<this.allParams.length;i++){
            if(this.allParams[i].paramName==this.currentParam){
              this.paramForm.controls['paramType'].setValue(this.allParams[i].paramType);
              this.paramForm.controls['paramDefault'].setValue(this.allParams[i].paramDefault);
            }
        }
    }
  }
  
submitForm(){
  
  if (this.data.action == 'create') {
    this.newSessionParamCreation();
  }else if(this.data.action=='update') {
    this.updateSessionParam();
  }
  this.closeDialog();
}

newSessionParamCreation(): any {
  return new Promise((resolve, reject) => {
    let jsonParams = {};

    jsonParams = {
      sessionSerial:sessionStorage.getItem('session_serial'),
      userId: this.informationservice.getLogeduserId(),
      paramName: this.paramForm.get('paramName')?.value,
      paramType:this.paramForm.get('paramType')?.value,
      paramDefault:this.paramForm.get('paramDefault')?.value,  
    };
    this.http.post<any>(GlobalConstants.addParamSession, jsonParams, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        if (res.status == 'Fail') {
          this.commonFunctions.alert("alert", res.description);
        } else {
          this.commonFunctions.alert("alert", res.description);
        }
      });
  })

}

updateSessionParam(): any {
  return new Promise((resolve, reject) => {
    
    for(let i=0;i<this.allParams.length;i++){
      if(this.allParams[i].paramName==this.currentParam){
       
        this.allParams[i].paramName=this.paramForm.get('paramName')?.value;
        this.allParams[i].paramType=this.paramForm.get('paramType')?.value;
        this.allParams[i].paramDefault=this.paramForm.get('paramDefault')?.value;

      }
  }
  let jsonParams={
    allParameters:JSON.stringify(this.allParams),
    sessionSerial:sessionStorage.getItem("session_serial")
  };

    this.http.post<any>(GlobalConstants.updateParamSession, jsonParams, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        if (res.status == 'Fail') {
          this.commonFunctions.alert("alert", res.description);
        } else {
          this.commonFunctions.alert("alert", res.description);
        }
      });
  })

}

closeDialog() {
  this.dialogRef.close();
}
}
