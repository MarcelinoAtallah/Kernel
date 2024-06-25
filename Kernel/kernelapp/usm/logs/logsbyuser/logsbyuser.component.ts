import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
//working exple: user:2(charbel.a) application: 5(insystem) logindate:10-10-2017
import { InformationService } from 'src/app/Kernel/services/information.service';
@Component({
  selector: 'app-logsbyuser',
  templateUrl: './logsbyuser.component.html',
  styleUrls: ['./logsbyuser.component.css']
})
export class LogsbyuserComponent implements OnInit {

  public userLogs: any;
  public application: any;
  
  public menuPath: any = this.informationservice.getMenuPath();
  public menuPaths: any ;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public userLogsGrid: any;
  public id:string = '';
  public isShown: boolean = false ;

  constructor(public datepipe: DatePipe,

    public informationservice: InformationService) {}

  logsUserForm = new FormGroup({
    userLogs: new FormControl(''),
    application : new FormControl(''),
    loginDate : new FormControl('')
   });
  ngOnInit(): void {

    $("#formRow").addClass("vh-100");
    this.userLogs = GlobalConstants.fetchUserCombo;
    this.application = GlobalConstants.fetchUSMRolesAppComboApi;

    this.agColumnsJson = [
      {
        headerName: 'Application',
        field: 'application',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Operation Type',
        field: 'operationType',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Operation Description',
        field: 'operationDescription',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Operation Date',
        field: 'operationDate',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Login Date',
        field: 'loginDate',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Logout Date',
        field: 'logoutDate',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'IP',
        field: 'ip',
        filter: 'agTextColumnFilter',
        sortable: true
      }
    ];
    this.agColumns.push(this.agColumnsJson);
  }

  searchForm(){
    if(this.logsUserForm.status != "INVALID")
    {
    $("#formRow").removeClass("vh-100");
    this.isShown = true;

    console.log("userLogs >>> ", this.logsUserForm.get('userLogs').value);
    console.log("application >>> ", this.logsUserForm.get('application').value);

    const loginDate = this.datepipe.transform(this.logsUserForm.get('loginDate').value, 'dd-MM-YYYY');
    console.log("loginDate >>> ", loginDate);

    //let application= this.logsUserForm.get('application').value;
    // if(application.toString().length == 1){
    //   application = '00'+application;
    //         }
    //  if(application.toString().length == 2){
    //  application = '0'+application;
    //                 }
    const userLogs = this.logsUserForm.get('userLogs').value == "" ? "-1" : this.logsUserForm.get('userLogs').value;
    let application = this.logsUserForm.get('application').value == "" ? "-1" : this.logsUserForm.get('application').value;
    this.userLogsGrid = GlobalConstants.getLogsByUserApi + userLogs+"/"+ application+ "/"+loginDate;

    console.log("userLogsGrid>>>>>>>>>>>>  ", this.userLogsGrid);
  }
}
}
