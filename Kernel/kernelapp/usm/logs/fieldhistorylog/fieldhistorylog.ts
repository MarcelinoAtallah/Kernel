import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-fieldhistorylog',
  templateUrl: './fieldhistorylog.html',
  styleUrls: ['./fieldhistorylog.css']
})
export class FieldhistorylogComponent implements OnInit {
  public getUSMApplicationComboApi: any;
  public getUserApi: any;
  public getMenuApi: any;
  public getFieldApi: any;
  public agColumnsJson: any;
  public content: any;
  public menuNameBody: any;
  agColumns: AgColumns[] = [];
  isShown: boolean;



  public getUSMFieldHistoryLog: any ;


  fieldHistoryLogForm = new FormGroup({
    application: new FormControl(''),
    user: new FormControl(''),
    menu: new FormControl(''),
    field: new FormControl(''),
    getUSMApplicationComboApi: new FormControl(''),
    getUserApi: new FormControl(''),
    getMenuApi: new FormControl(''),
    getFieldApi: new FormControl(''),
    fromdate: new FormControl({value: new Date(new Date().setDate(new Date().getDate()-8)).toISOString().substring(0,10), disabled: false}, ),
    todate: new FormControl({value: new Date().toISOString().substring(0,10), disabled: false},),

  });


  constructor( private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    public datepipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      { headerName: 'Menu',field: 'menu', filter: 'agTextColumnFilter' },
      { headerName: 'Object ID',field: 'objectId', filter: 'agTextColumnFilter' },
      { headerName: 'Field',field: 'field', filter: 'agTextColumnFilter' },
      { headerName: 'User',field: 'user', filter: 'agTextColumnFilter' },
      { headerName: 'Old Value',field: 'oldValue', filter: 'agTextColumnFilter' },
      { headerName: 'New Value',field: 'newValue', filter: 'agTextColumnFilter' },
      { headerName: 'Creation Date',field: 'creationDate', filter: 'agTextColumnFilter' },

    ];
    this.agColumns.push(this.agColumnsJson);
    this.getUSMApplicationComboApi = GlobalConstants.fetchUSMRolesAppComboApi;
    this.getUserApi = GlobalConstants.fetchUserCombo;

    //this.getMenuApi = GlobalConstants.getMenuName+value;

    this.getFieldApi = GlobalConstants.fetchUSMFieldApi;

    }

  gridShow(){
    console.log("value of the actionType is >>> ",this.fieldHistoryLogForm.status);

    if(this.fieldHistoryLogForm.status != "INVALID")
    {

    this.isShown = true;
    const fromdate = this.fieldHistoryLogForm.get('fromdate').value  == "" ? "-1" : this.datepipe.transform(this.fieldHistoryLogForm.get('fromdate').value, 'dd-MM-YYYY');
    const todate = this.fieldHistoryLogForm.get('todate').value  == "" ? "-1" : this.datepipe.transform(this.fieldHistoryLogForm.get('todate').value, 'dd-MM-YYYY');
    const fieldHistoryApplication= this.fieldHistoryLogForm.get('application').value == "" ? "-1" : this.fieldHistoryLogForm.get('application').value; //fieldname from html = application
    const fieldHistoryField=this.fieldHistoryLogForm.get('field').value  == "" ? "-1" : this.fieldHistoryLogForm.get('field').value;
    const fieldHistoryMenu=this.fieldHistoryLogForm.get('menu').value == "" ? "-1" : this.fieldHistoryLogForm.get('menu').value;
    const fielHistoryApplicationUser=this.fieldHistoryLogForm.get('user').value == "" ? "-1" : this.fieldHistoryLogForm.get('user').value;

    console.log('logoutdate',todate);
    console.log('fromdate',fromdate);
    if (fromdate != null && todate != null && todate != "-1" && fromdate != "-1") {
      const loginDateTimeStamp = new Date(fromdate).getTime();
      const logoutDateTimeStamp = new Date(todate).getTime();

      if (loginDateTimeStamp > logoutDateTimeStamp) {
        this.commonFunctions.alert("alert", 'Login Date cannot be later than Logout Date');
        return;
      }
    }

    this.getUSMFieldHistoryLog = GlobalConstants.getFieldHistoryLog + "/" + fieldHistoryApplication+"/"+fieldHistoryMenu+ "/"+ fielHistoryApplicationUser+"/"+fieldHistoryField +"/"+fromdate+"/"+todate;

    console.log("all url is >>>   ", this.getUSMFieldHistoryLog);

  }
  // GlobalConstants.getLogsByUserApi
  }
  onChangeApplicationName(value: any) {
    if (value != '') {

        const defaultRoleJson = { 'id': value };
        value = value == 0 ? value : "0" + value;
        this.getMenuApi = GlobalConstants.getMenuName + value;

        this.menuNameBody = defaultRoleJson;
    } else {
      this.getMenuApi = "";

    }
  }
}
