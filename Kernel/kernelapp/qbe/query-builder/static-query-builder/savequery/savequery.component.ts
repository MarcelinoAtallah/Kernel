import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-savequery',
  templateUrl: './savequery.component.html',
  styleUrls: ['./savequery.component.css']
})
export class SavequeryComponent implements OnInit {
  query : any;
  public actionType: string = '';
  
  public menuPath: any = this.informationservice.getMenuPath();
  public showHideTabs = false;
  
  public userId = this.informationservice.getUserId();



  constructor(private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data:any,
  private dialog: MatDialog, private snackBar: MatSnackBar,
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private commonFunctions: CommonFunctions,
    private route: Router,
    private dialogRef: MatDialogRef<SavequeryComponent>,
    public informationservice: InformationService) { }

   
    queryForm = new FormGroup({
      queryName: new FormControl(''),
      queryTheme: new FormControl(''),
      queryFolder: new FormControl(''),
      queryComments: new FormControl(''),
      queryVersion: new FormControl(''),
  
    });


  ngOnInit(): void {
this._Activatedroute.paramMap.subscribe((params) => {
  console.log("params>>>>",params);
  
  this.informationservice.setUserId(this.userId);

  this.actionType =this.data.actionType;
});


  }
  submitForm(){
    if (this.actionType == 'create') {
        this.CreateQuery();
      }else {
      }
  }
  
  CreateQuery(): any {
    return new Promise((resolve, reject) => {
      if(this.queryForm.get('queryName')?.value=='' || this.queryForm.get('queryVersion')?.value==''){
     
        this.showSnackBar("Fill the required fields");
     
      }else{
        console.log("DATA RECEIVED TO FORM>>>>>>>>>>>",this.data.query);
      let jsonParams = {};
      jsonParams = {
        query: this.data.query,
        userId: this.informationservice.getLogeduserId(),
        queryName: this.queryForm.get('queryName')?.value,
        queryComments:this.queryForm.get('queryComments')?.value,
        queryVersion:this.queryForm.get('queryVersion')?.value,
        session_serial:sessionStorage.getItem("session_serial"),
        queryFlag:this.data.queryFlag
      };
      this.http.post<any>(GlobalConstants.addQueryData, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
            this.commonFunctions.alert("alert", res.description);
          } else {
            this.commonFunctions.alert("alert", res.description);
            this.closeDialog();
            this.commonFunctions.navigateToPage("/qbe/queryBuilder");
          }
        });
        // this.closeDialog();
        // this.commonFunctions.navigateToPage("/qbe/queryBuilder");

      }
    })
  
  }
  closeDialog() {
    this.dialogRef.close();
  }

  
  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['my-snackbar'],
    });
  }
}
