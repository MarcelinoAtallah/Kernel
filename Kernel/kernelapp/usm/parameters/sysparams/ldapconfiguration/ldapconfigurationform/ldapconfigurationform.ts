import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
declare let alertify: any;
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-ldapconfigurationform',
  templateUrl: './ldapconfigurationform.html',
  styleUrls: ['./ldapconfigurationform.css'],
})
export class LdapconfigurationformComponent implements OnInit {
  public isDefaultConfiguration: boolean;
  public agColumnsJson: any;
  public actionType: string = '';
  public agColumns: AgColumns[] = [];
  
  public menuPath: any = this.informationservice.getMenuPath();
  public jsonParams: any;
  public ldapConfigId: string = '';
  public getBugLdapMapping: any = GlobalConstants.fetchBugLdap;
  public showHideTabs = false;
  public getldapConfigApi: any;



  constructor(
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    private eventEmitterService: EventEmitterService,
    private commonFunctions: CommonFunctions,
    private route: Router,
    public informationservice: InformationService
  ) { }

  ldapConfigurationForm = new FormGroup({
    defaultConfiguration: new FormControl(''),
    ldapServerUrl: new FormControl(''),
    ldapServerPort: new FormControl(''),
    ldapAdminLogin: new FormControl(''),
    ldapAdminPwd: new FormControl(''),
    ldapSearchBaseRoot: new FormControl(''),
    ldapSearchBase: new FormControl(''),
    ldapConnectionTimeoutPeriod: new FormControl(''),
    ldapResponseTimeoutPeriod: new FormControl(''),
  });

  bugLdapForm = new FormGroup({
  });

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {
      this.ldapConfigId = params.get('id');
      this.actionType = params.get('actionType');
    });

    if (this.ldapConfigId != '' && this.actionType == 'update') {
      this.fetchUserData();
      this.showHideTabs = true;


      this.agColumnsJson = [
        {
          headerName: '',
          field: '',
          checkboxSelection: true,
          width: '25px',
          headerCheckboxSelection: true
        },
        {
          headerName: 'BUG',
          field: 'bug',
          filter: 'agTextColumnFilter',
          sortable: true,
        },
        {
          headerName: 'LDAP Type',
          field: 'ldapType',
          filter: 'agTextColumnFilter',
          sortable: true,
        },
        {
          headerName: 'LDAP CN',
          field: 'ldapCn',
          filter: 'agTextColumnFilter',
          sortable: true,
        },
      ];
      this.agColumns.push(this.agColumnsJson);
    }
  }


  //fetchUserData:

  fetchUserData() {
    this.http.get<any>(GlobalConstants.fetchLdapConfigurationInfos + this.ldapConfigId, {headers: GlobalConstants.headers,}).subscribe(
        (res: any) => {
          this.ldapConfigurationForm.controls['ldapServerUrl'].setValue(res.ldapServerUrl);
          this.ldapConfigurationForm.controls['ldapServerPort'].setValue(res.ldapServerPort);
          this.ldapConfigurationForm.controls['ldapAdminLogin'].setValue(res.ldapAdminLogin);
          this.ldapConfigurationForm.controls['ldapAdminPwd'].setValue(res.ldapAdminPwd);
          this.ldapConfigurationForm.controls['ldapSearchBaseRoot'].setValue(res.ldapSearchBaseRoot);
          this.ldapConfigurationForm.controls['ldapSearchBase'].setValue(res.ldapSearchBase);

          if (res.defaultConfiguration == '1') {
            this.isDefaultConfiguration = true;
            this.ldapConfigurationForm.controls['defaultConfiguration'].setValue(this.isDefaultConfiguration);

          } else {
            this.isDefaultConfiguration = false;
            this.ldapConfigurationForm.controls['defaultConfiguration'].setValue(this.isDefaultConfiguration);
          }

        },
        (error) => {
        }
      );
      this.getldapConfigApi = GlobalConstants.fetchLdapApi + this.ldapConfigId;
  }

  // Submit Form Action
  submitForm() {
    if (this.ldapConfigurationForm.status != 'INVALID') {
      if (this.actionType == 'create') {
        let jsonParams = {};
        jsonParams = {
          ldapServerUrl: this.ldapConfigurationForm.get('ldapServerUrl')?.value,

          ldapServerPort: this.ldapConfigurationForm.get('ldapServerPort')?.value,

          ldapAdminLogin: this.ldapConfigurationForm.get('ldapAdminLogin')?.value,

          ldapAdminPwd: this.ldapConfigurationForm.get('ldapAdminPwd')?.value,

          ldapSearchBaseRoot: this.ldapConfigurationForm.get('ldapSearchBaseRoot')?.value,

          ldapSearchBase: this.ldapConfigurationForm.get('ldapSearchBase')?.value,
        };

        this.http.post<any>(GlobalConstants.addLdapConfigApi,jsonParams,{headers: GlobalConstants.headers}).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                alert(res.description);
              } else {
                alert(res.description);
                this.ldapConfigId = res.id;
                this.actionType = 'update';
                this.route.navigateByUrl(this.menuPath +"/form/"+ this.actionType +"/"+ this.ldapConfigId);
                this.fetchUserData();
              }
            },
            (error) => {
              console.log(error);
            }
          );
      }

      if (this.actionType == 'update') {
        let jsonParams = {};
        jsonParams = {
          ldapConfigId: this.ldapConfigId,

          ldapServerUrl: this.ldapConfigurationForm.get('ldapServerUrl')?.value,

          ldapServerPort: this.ldapConfigurationForm.get('ldapServerPort')?.value,

          ldapAdminLogin: this.ldapConfigurationForm.get('ldapAdminLogin')?.value,

          ldapAdminPwd: this.ldapConfigurationForm.get('ldapAdminPwd')?.value,

          ldapSearchBaseRoot: this.ldapConfigurationForm.get('ldapSearchBaseRoot')?.value,

          ldapSearchBase: this.ldapConfigurationForm.get('ldapSearchBase')?.value,
        };



this.http.put<any>(GlobalConstants.updateLdapConfigApi + this.ldapConfigId, jsonParams, {headers: GlobalConstants.headers}).subscribe(
            (res: any) => {
              alert(res.description);
               this.ldapConfigId = res.id;
               this.actionType = 'update';
               this.fetchUserData();
               this.route.navigateByUrl(this.menuPath +"/form/"+ this.actionType +"/"+ this.ldapConfigId);
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }
}
