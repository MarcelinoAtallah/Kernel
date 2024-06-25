import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
declare let alertify: any;

@Component({
  selector: 'ldapRolesMappingForm',
  templateUrl: './ldapRolesMappingForm.html',
  styleUrls: ['./ldapRolesMappingForm.css']
})
export class LdapRolesMappingForm implements OnInit {

  public getUSMLdapConfCombo: any = GlobalConstants.fetchUSMLdapConfCombo;
  public comboUSMObjectTypeCombo: any = GlobalConstants.fetchUSMObjectTypeCombo;
  public comboUSMBugType: any = GlobalConstants.fetchUSMBugTypesComboApi;
  public actionType:string = '';
  public  roleId: string = '';
  public  actType: string = '';

  constructor( private http: HttpClient,
               private _Activatedroute: ActivatedRoute,
               private eventEmitterService: EventEmitterService,
               private commonFunctions: CommonFunctions
             ) {}


ldapForm = new FormGroup({
                          code: new FormControl(''),
                          ldapConfig: new FormControl(''),
                          ldapObjType: new FormControl(''),
                          ldapObjCN: new FormControl(''),
                         });

  ngOnInit(): void
  {
     this._Activatedroute.paramMap.subscribe(params => {
      this.roleId = params.get('id');
      this.actionType = params.get('actionType');
     });


  }

  fetchUserData() {
    this.http.get<any>(GlobalConstants.fetchUSMRoleApi + this.roleId, {headers: GlobalConstants.headers}).subscribe(
      (res: any) => {
        this.ldapForm.controls['name'].setValue(res.name);
        this.ldapForm.controls['bugType'].setValue(res.bugType);
        this.ldapForm.controls['bug'].setValue(res.bug);

      },
      (error) => {
        console.log("fetchUserData ================ ", error);
      }
    );
  }

  submitForm()
  {
    if(this.ldapForm.status != "INVALID") {

      if (this.actionType == 'create') {
        this.http.post<any>(GlobalConstants.addUSMRoleLDAPApi, this.ldapForm.value ,{headers: GlobalConstants.headers}).subscribe(
          (res: any) => {

            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
              this.roleId = res.id;
              this.actionType = 'update';
              this.fetchUserData();
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }

  }

}
