import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
//import {AGGridComponent} from 'src/app/Kernel/Kernel/components/v-grid/v-grid.components';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.html',
  styleUrls: ['./filters.css']
})
export class FiltersComponent implements OnInit {

  public getUSMApplicationComboApi: any;
  public getMenuApi: any;
  public getApplicationEvent: any;
  public agColumnsJson: any;
  agColumns: AgColumns[] = [];
  agLogsByUsers: AgColumns[] = [];
  isShown: boolean=false;
  applicationForm = new FormGroup({
    application:new FormControl({value:'',disabled: false}),
    loginDate: new FormControl({value: '', disabled: false}, ),
    logoutDate: new FormControl({value: '', disabled: false},),
  });


  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,public datepipe: DatePipe) { }


  ngOnInit(): void {

    this.getUSMApplicationComboApi = GlobalConstants.getUSMApplicationComboApi;
    this.agColumnsJson = [
      { headerName: 'Emp Name',field: 'empName', filter: 'agTextColumnFilter' },
      { headerName: 'Login Date',field: 'loginDate', filter: 'agTextColumnFilter', sortable: true },
      { headerName: 'Logout Date',field: 'logoutDate', filter: 'agTextColumnFilter' },
      { headerName: 'Logout Incidence',field: 'logoutIncidence', filter: 'agTextColumnFilter' },
      { headerName: 'Connected IP Address',field: 'connectedIpAddress', filter: 'agTextColumnFilter' },
      { headerName: 'Actions',field: 'actions', filter: 'agTextColumnFilter' },
      { headerName: 'Exceptions',field: 'exceptions', filter: 'agTextColumnFilter' },
    ];
    this.agColumns.push(this.agColumnsJson);

  }
  ngOnChanges(): void {

    this.gridShow();}

  gridShow(){

    if (this.applicationForm.status != "INVALID") {
      const loginDate = this.applicationForm.get('loginDate').value == "" ? "-1" : this.datepipe.transform(this.applicationForm.get('loginDate').value, 'dd-MM-YYYY');
      const logoutDate = this.applicationForm.get('logoutDate').value == "" ? "-1" : this.datepipe.transform(this.applicationForm.get('logoutDate').value, 'dd-MM-YYYY');
      let application = this.applicationForm.get('application').value == "" ? "-1" : this.applicationForm.get('application').value;

       if(application.toString().length == 1){
        application = '00'+application;
              }
       if(application.toString().length == 2){
       application = '0'+application;
                      }
                      console.log('logoutdate',logoutDate);
                      if (loginDate != '' && logoutDate != '' && logoutDate != "-1" && loginDate != "-1") {
                        const loginDateTimeStamp = new Date(loginDate).getTime();
                        const logoutDateTimeStamp = new Date(logoutDate).getTime();

                        if (loginDateTimeStamp > logoutDateTimeStamp) {
                          this.commonFunctions.alert("alert", 'Login Date cannot be later than Logout Date');
                          return;
                        }
                      }
console.log("logoutdate",logoutDate);
      this.getApplicationEvent = GlobalConstants.getUSMApplicationEvent + application + "/"  + loginDate + "/" + logoutDate;
     console.log (this.getApplicationEvent);

     this.isShown = true;
    }
  }

}

