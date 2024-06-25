import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-invalidlogin',
  templateUrl: './invalidlogin.html',
  styleUrls: ['./invalidlogin.css']
})
export class InvalidloginComponent implements OnInit  {
  public agColumnsJson: any;
  public content: any;

  agColumns: AgColumns[] = [];
  isShown: boolean;

  public getUSMInvalidLoginApi: any ;//= GlobalConstants.fetchUSMInvalidLoginApi;

  invalidLoginForm = new FormGroup({
    invalidloginDate: new FormControl(''),
    // performer: new FormControl(''),
    // loginInDate: new FormControl(''),
    // loginIp: new FormControl(''),
  });




  constructor(

    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    public datepipe: DatePipe,
  ) { }


  ngOnInit(): void {

    this.agColumnsJson = [
      //grid columns
      { headerName: 'Performer',field: 'performer', filter: 'agTextColumnFilter' },
      { headerName: 'Login Date',field: 'loginDate', filter: 'agTextColumnFilter' },
      { headerName: 'Login IP',field: 'loginIp', filter: 'agTextColumnFilter' },

    ];
    this.agColumns.push(this.agColumnsJson);

    }

  gridShow(){
    if(this.invalidLoginForm.status != "INVALID")
    {


    this.isShown = true;
//calling field name fieldName
    const invalidloginDate = this.datepipe.transform(this.invalidLoginForm.get('invalidloginDate').value, 'MM-dd-YYYY');
    //console.log("tes3 >>> ", loginDate);

    this.getUSMInvalidLoginApi = GlobalConstants.getInvalidLogsApi +"/"+invalidloginDate;
    //console.log("test>>>>>>>>>>>>  ", this.userLogsGrid);

    }
  }
}
