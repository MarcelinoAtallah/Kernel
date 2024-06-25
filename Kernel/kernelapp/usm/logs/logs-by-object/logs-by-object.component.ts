import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
//working exple on swager app:5 app,menu_code=00529 or Skip row selection on context menu, login date=10-10-2017, logoutdate=-1


@Component({
  selector: 'app-logs-by-object',
  templateUrl: './logs-by-object.component.html',
  styleUrls: ['./logs-by-object.component.css']
})
export class LogsByObjectComponent implements OnInit {

  public getApplicationName: any;
  public getMenuName: any;
  public menuNameBody: any;
  public menuIsRequired = false;
  public menuIsDisabled = false;
  public isShown: boolean = false;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public objectLogsGrid: any;



  ObjectForm = new FormGroup({
    application:new FormControl({value:'',disabled: false}),
    loginDate: new FormControl({value: '', disabled: false}, ),
    logoutDate: new FormControl({value: '', disabled: false},),
    menuName:new FormControl({value: '', disabled: false},)
  });
  constructor(public datepipe: DatePipe, private commonFunctions: CommonFunctions) { }

  ngOnInit(): void {
    $("#dropdownStyle").addClass('vh-100');
    this.getApplicationName = GlobalConstants.fetchApplicationCombo;

    this.agColumnsJson = [
      {
        headerName: 'Employee Name',
        field: 'empName',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Menu',
        field: 'menuPath',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Operation Type',
        field: 'operationtype',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Hint',
        field: 'operationHint',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Operation Date',
        field: 'operationDate',
        filter: 'agTextColumnFilter',
        sortable: true
      }
    ];
    this.agColumns.push(this.agColumnsJson);
  }
  ngOnChanges(): void {this.submitForm();}

  submitForm() {
    if (this.ObjectForm.status != "INVALID") {
      $("#dropdownStyle").removeClass('vh-100');


      const loginDate = this.ObjectForm.get('loginDate').value == "" ? "-1" : this.datepipe.transform(this.ObjectForm.get('loginDate').value, 'dd-MM-YYYY');

      const logoutDate = this.ObjectForm.get('logoutDate').value == "" ? "-1" : this.datepipe.transform(this.ObjectForm.get('logoutDate').value, 'dd-MM-YYYY');

      let application = this.ObjectForm.get('application').value == "" ? "-1" : this.ObjectForm.get('application').value;
      //parseInt to eliminate leading zeros
      const menuName = parseInt(this.ObjectForm.get('menuName').value == "" ? "-1" : this.ObjectForm.get('menuName').value,10);
      //console.log('logoutdate',logoutDate);

      if (loginDate != null && logoutDate != null && logoutDate != "-1" && loginDate != "-1") {
        const loginDateTimeStamp = new Date(loginDate).getTime();
        const logoutDateTimeStamp = new Date(logoutDate).getTime();

        if (loginDateTimeStamp > logoutDateTimeStamp) {
          this.commonFunctions.alert("alert", 'Login Date cannot be later than Logout Date');
          return;
        }
      }


      //  console.log('logindate:',loginDate);
      //  console.log('logoutdate:',logoutDate);
      //  console.log('application:',application);
      //  console.log('menuName:',menuName);

  this.objectLogsGrid = GlobalConstants.getObjectLogsApi + application + "/" + menuName + "/" + loginDate + "/" + logoutDate;

//console.log ("objectLogsGrid",this.objectLogsGrid);
this.isShown = true;
  }
}

  onChangeApplicationName(value: any) {
    if (value != '') {
       this.menuIsDisabled = false;
       this.menuIsRequired = true;
        const defaultRoleJson = { 'id': value };
        value = value == 0 ? value : "0" + value;
        this.getMenuName = GlobalConstants.getMenuName + value;
        //alert("getMenuName"+this.getMenuName);
        this.menuNameBody = defaultRoleJson;

    } else {
      this.getMenuName = "";
      this.menuIsRequired = false;
      this.menuIsDisabled = true;
    }
     // Set menuIsDisabled flag based on menuIsRequired flag
  this.menuIsDisabled = !this.menuIsRequired;
  }
}


