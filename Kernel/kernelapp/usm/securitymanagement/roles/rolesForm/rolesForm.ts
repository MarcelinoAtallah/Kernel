import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BugNameList } from 'src/app/Kernel/ArrayList/BugNameList';
import { bugListType } from 'src/app/Kernel/ArrayList/bugType';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { USMConstant } from 'src/app/Kernel/kernelapp/usm/USMConstant';
declare let alertify: any;
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-roles-form',
  templateUrl: './rolesForm.html',
  styleUrls: ['./rolesForm.css']
})
export class RolesForm implements OnInit {

  //tab one
  public bugNameId: String = "-1";
  public comboAppType: any = GlobalConstants.fetchUSMRolesAppComboApi;
  public comboRoleType: any = GlobalConstants.fetchUSMRolesRoleTypeComboApi + USMConstant.roleType;
  public comboUSMBugType: any = GlobalConstants.fetchUSMBugTypesComboApi;
  public RoleBugNameCombo: any = [{}];
  public roleId: string = '';
  public actionType: string = '';
  //tab two
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getUSMUsersOfRoleApi: any;
  public isDualAuthentication: boolean;
  public showHideTabs = false;
  public bugIsDisabled: boolean = false;
  public bugIsRequired: boolean = false;
  public bugName = false;
  bugNameList: BugNameList[] = [];
  bugNameList2: BugNameList[] = [];
  AllBugNameSelected: BugNameList[] = [];
  FinalBugNameSelected: BugNameList[] = [];
  bugTypeList: bugListType[] = [];

  public id = -2;
  public isPaused = false;
  
  public menuPath: any = this.informationservice.getMenuPath();


  constructor(private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    private eventEmitterService: EventEmitterService,
    private commonFunctions: CommonFunctions,
    private route: Router,
    public informationservice: InformationService
  ) { }


  roleForm = new FormGroup({
    id: new FormControl(''),
    roleName: new FormControl(''),
    bugType: new FormControl(''),
    bugName: new FormControl(''),
    roleType: new FormControl(''),
    isDualAuthentication: new FormControl('')
  });


  ngOnInit(): void {

    // using comboUSMBugType
    this.http.get<any>(this.comboUSMBugType).subscribe((jsonData: [any]) => {
      for (let i = 0; i < jsonData.length; i++) {
        let first = new bugListType(jsonData[i].id, jsonData[i].name);
        this.bugTypeList.push(first);
      }
      console.log("value of json arrived is >>>>> ", this.bugTypeList);
    });

    this._Activatedroute.paramMap.subscribe(params => {
      this.roleId = params.get('id');
      
      this.informationservice.setRoleId(this.roleId);
      this.actionType = params.get('actionType');
      this.bugIsDisabled = true;
    });

    if (this.roleId != '' && this.actionType == 'update') {
      this.fetchUserData();
      this.showHideTabs = true;

      this.agColumnsJson = [
        {
          headerName: 'User Id',
          field: 'userId',
          filter: 'agTextColumnFilter',
          sortable: true,
          // width: '50px',
        },
        {
          headerName: 'User Name',
          field: 'userName',
          filter: 'agTextColumnFilter',
          sortable: true,
        },
        {
          headerName: 'First Name',
          field: 'firstName',
          filter: 'agTextColumnFilter',
          sortable: true,
        },
        {
          headerName: 'Last Name',
          field: 'lastName',
          filter: 'agTextColumnFilter',
          sortable: true,
        },
      ];
      this.agColumns.push(this.agColumnsJson);

    }
    else {
      this.RoleBugNameCombo = GlobalConstants.fetchRoleBugNameComboApi + this.bugNameId;
    }


  }


  fetchUserData() {

    this.http.get<any>(GlobalConstants.fetchUSMRoleApi + this.roleId,
      { headers: GlobalConstants.headers }).subscribe({
      next:(res: any) => {
        this.roleId = res.id;
        this.roleForm.controls['roleName'].setValue(res.roleName);
        this.roleForm.controls['roleType'].setValue(res.roleType);
        let listOfBugType = res.bugType1;
        let listOfBugName = res.bugName;
        this.roleForm.controls['bugType'].setValue(listOfBugType);
        this.onBugTypeChange('test');

        for (let i = 0; i < this.bugNameList.length; i++) {
          let listOfBugTypeId = [];
          for (let j = 0; j < listOfBugName.length; j++) {
            let bugTypeID = listOfBugName[j].split('/')[1];
            if (this.bugNameList[i].id == bugTypeID) {
              listOfBugTypeId.push(listOfBugName[i].substring(0, listOfBugName[i].indexOf('/')));
            }
          }
          this.roleForm.controls['bugName' + this.bugNameList[i].id].setValue(listOfBugTypeId);
        }

        if (res.isDualAuthentication == '1') {
          this.isDualAuthentication = true;
          this.roleForm.controls['isDualAuthentication'].setValue(this.isDualAuthentication);
        } else {
          this.isDualAuthentication = false;
          this.roleForm.controls['isDualAuthentication'].setValue(this.isDualAuthentication);
        }
        if (res.bugType != '' && res.bugType != null) {
          this.bugIsDisabled = false;
          this.bugIsRequired = true;
        } else {
          this.bugIsDisabled = true;
          this.bugIsRequired = false;
        }

      },
      error:(error) => {
        console.log("fetchUserData ================ ", error);
      }
  });

    this.getUSMUsersOfRoleApi = GlobalConstants.fetchUSMUsersOfRoleApi + this.roleId;

  }

  submitForm() {

    if (this.roleForm.status != "INVALID") {

      let jsonParams = {};
      if (this.actionType == 'create') {
        if (this.roleForm.get('bugType')?.value != "") {
          this.CreateFirstUser();
        }
        else {
          console.log("IN THE ELSE FUNCTION ")
          jsonParams = {
            userId: this.informationservice.getLogeduserId(),
            roleName: this.roleForm.get('roleName')?.value,
            roleType: this.roleForm.get('roleType')?.value,
            isDualAuthentication: this.roleForm.get('isDualAuthentication')?.value,
          };
          this.http.post<any>(GlobalConstants.addUSMRoleApi, jsonParams, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
                this.roleId = res.id;
                this.actionType = 'update';
                this.route.navigateByUrl(this.menuPath + "/form/" + this.actionType + "/" + this.roleId);
                this.fetchUserData();
              }
            });
        }
      }
      if (this.actionType == 'update') {

        let jsonParams = {};

        if (this.roleForm.get('bugName')?.value != "") {
          jsonParams = {
            userId: this.informationservice.getLogeduserId(),
            roleName: this.roleForm.get('roleName')?.value,
            roleType: this.roleForm.get('roleType')?.value,
            isDualAuthentication: this.roleForm.get('isDualAuthentication')?.value,
            bugType: this.roleForm.get('bugType')?.value,
            bugName: this.roleForm.get('bugName')?.value,
          };
        }
        else {
          jsonParams = {
            userId: this.informationservice.getLogeduserId(),
            roleName: this.roleForm.get('roleName')?.value,
            roleType: this.roleForm.get('roleType')?.value,
            isDualAuthentication: this.roleForm.get('isDualAuthentication')?.value,
          };
        }

        this.http.put<any>(GlobalConstants.updateUSMRoleApi + this.roleId, jsonParams, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            this.commonFunctions.alert("alert", res.description);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  CreateFirstUser(): any {
    return new Promise((resolve, reject) => {
      let jsonParams = {};
      jsonParams = {
        id: this.id,
        userId: this.informationservice.getLogeduserId(),
        roleName: this.roleForm.get('roleName')?.value,
        roleType: this.roleForm.get('roleType')?.value,
        isDualAuthentication: this.roleForm.get('isDualAuthentication')?.value,
        bugType: this.bugNameList[0].id,
        bugName: this.roleForm.get('bugName' + this.bugNameList[0].id)?.value,
      };
      this.http.post<any>(GlobalConstants.addUSMRoleApi, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
            this.commonFunctions.alert("alert", res.description);
          } else {
            console.log("save success!!!!");
            this.commonFunctions.alert("alert", res.description);
            this.roleId = res.id;
            this.id = res.id;
            console.log("value id >>>> " + this.id)
            this.CreatOtherUser();
          }
        });
    })

  }

  CreatOtherUser() {
    console.log("this.id : ", this.id);
    let jsonParams = {};
    for (let i = 1; i < this.bugNameList.length; i++) {
      jsonParams = {
        id: this.id,
        userId: this.informationservice.getLogeduserId(),
        roleName: this.roleForm.get('roleName')?.value,
        roleType: this.roleForm.get('roleType')?.value,
        isDualAuthentication: this.roleForm.get('isDualAuthentication')?.value,
        bugType: this.bugNameList[i].id,
        bugName: this.roleForm.get('bugName' + this.bugNameList[i].id)?.value,
      };
      this.http.post<any>(GlobalConstants.addUSMRoleApi, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
            this.commonFunctions.alert("alert", res.description);
          } else {
            console.log("save success!!!!");
            this.commonFunctions.alert("alert", res.description);
          }
        });
    }
  }

  onBugTypeChange(value: any) {
    this.RoleBugNameCombo = GlobalConstants.fetchRoleBugNameComboApi;
    if (value != '') {
      var data = this.roleForm.get('bugType')?.value;
      let nameOfBugType = '';
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < this.bugTypeList.length; j++) {

          if (this.bugTypeList[j].id == data[i]) {
            nameOfBugType = this.bugTypeList[j].Name;
          }
        }
        if (this.bugNameList.find((test) => test.id == data[i]) == undefined) {
          let FirstBugName = new BugNameList(data[i], nameOfBugType, this.RoleBugNameCombo + data[i], 'bugName' + data[i]);

          this.roleForm.addControl(FirstBugName.property, new FormControl(''));
          this.bugNameList.push(FirstBugName);
        }
      }
      this.bugName = true;
      this.bugIsDisabled = false;
      this.bugIsRequired = true;
      if (data.length < this.bugNameList.length) {
        for (let i = 0; i < this.bugNameList.length; i++) {
          if (!data.includes(this.bugNameList[i].id)) {
            this.bugNameList.splice(i, 1);
          }
        }
      }
    }
    else {
      this.bugName = false;
      this.bugIsDisabled = true;
      this.bugIsRequired = false;
    }
  }
}
