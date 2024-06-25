import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css']
})
export class DataFilterComponent implements OnInit {

  public groupingCondition:any[]=[{id:'None',name:'None'},{id:'And',name:'And'},{id:'Or',name:'Or'}];
  public firstOperandTypes:any[]=[{id:'Field',name:'Field'},{id:'Expression',name:'Expression'}];
  public operatorTypes:any[]=[{id:'=',name:'='},{id:'!=',name:'!='},{id:'<',name:'<'},{id:'<=',name:'<='},{id:'>',name:'>'},{id:'>=',name:'>='},{id:'In',name:'In'},{id:'Not In',name:'Not In'},{id:'Contains',name:'Contains'},{id:'Starts With',name:'Starts With'},{id:'Ends With',name:'Ends With'},{id:'Between',name:'Between'},{id:'Is Empty',name:'Is Empty'},{id:'Is Not Empty',name:'Is Not Empty'},{id:'Not Exists',name:'Not Exists'},{id:'Exists',name:'Exists'},{id:'Top',name:'Top'},{id:'Bottom',name:'Bottom'}];
  public secondOperandTypes:any[]=[{id:'Static',name:'Static'},{id:'Field',name:'Field'},{id:'Parameter',name:'Parameter'},{id:'Query',name:'Query'},{id:'Expression',name:'Expression'},{id:'Predefined Filters',name:'Predefined Filters'}];
  public firstValueFieldList:any[]=[];
  public secondValueFieldList:any[]=[];
  public secondValueParameterList:any[]=[];

  public firstOperandSelectedType='Field';
  public secondOperandSelectedType='Field';

  public allConditions:any[]=[];

  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DataFilterComponent>,

    ) { }


    dataFilterForm = new FormGroup({
      firstOperand: new FormControl(''),
      firstValue: new FormControl(''),
      operator: new FormControl(''),
      secondOperand: new FormControl(''),
      secondValue: new FormControl(''),
      grouping: new FormControl(''),
    });

  ngOnInit(): void {
    for(let i=0;i<this.data.itemsData.length;i++){
      for(let j=0;j<this.data.itemsData[i].data.columns.length;j++){
      this.firstValueFieldList.push({id:this.data.itemsData[i].data.tableName+'.'+this.data.itemsData[i].data.columns[j].COLUMN_NAME,name:this.data.itemsData[i].data.tableName+'.'+this.data.itemsData[i].data.columns[j].COLUMN_NAME});
    }
  }
  for(let i=0;i<this.data.itemsData.length;i++){
    for(let j=0;j<this.data.itemsData[i].data.columns.length;j++){
    this.secondValueFieldList.push({id:this.data.itemsData[i].data.tableName+'.'+this.data.itemsData[i].data.columns[j].COLUMN_NAME,name:this.data.itemsData[i].data.tableName+'.'+this.data.itemsData[i].data.columns[j].COLUMN_NAME});
  }
}
 

  this.http.get<any>(GlobalConstants.getParamCombo+"paramAdd_"+sessionStorage.getItem("session_serial"), { headers: GlobalConstants.headers }).subscribe(
    (res: any) => {
      if (res==null){
      }else{
        this.secondValueParameterList=res;
      }
    });

  
    if(this.data.case=="update"){

      this.dataFilterForm.controls['grouping'].setValue(this.data.selectedCondition[0].grouping);
      this.dataFilterForm.controls['firstOperand'].setValue(this.data.selectedCondition[0].firstOperand);
      this.dataFilterForm.controls['firstValue'].setValue(this.data.selectedCondition[0].firstOperandValue);
      this.dataFilterForm.controls['operator'].setValue(this.data.selectedCondition[0].operator);
      this.dataFilterForm.controls['secondOperand'].setValue(this.data.selectedCondition[0].secondOperand);
      this.dataFilterForm.controls['secondValue'].setValue(this.data.selectedCondition[0].secondOperandValue);

    }else if(this.data.case=="create"){
    }
  }

addCondition(){
this.allConditions.push({"grouping":this.dataFilterForm.get('grouping')?.value,
                        "firstOperand":this.dataFilterForm.get('firstOperand')?.value,
                        "firstValue":this.dataFilterForm.get('firstValue')?.value,
                        "operator":this.dataFilterForm.get('operator')?.value,
                        "secondOperand":this.dataFilterForm.get('secondOperand')?.value,
                        "secondValue":this.dataFilterForm.get('secondValue')?.value});


this.dialogRef.close(this.allConditions); 

}

}
