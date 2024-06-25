import { HttpClient } from '@angular/common/http';
import { Component, OnInit , Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
declare let alertify: any;
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'ldapRolesMapping',
  templateUrl: './ldapRolesMapping.html',
  styleUrls: ['./ldapRolesMapping.css']
})
export class LdapRolesMapping implements OnInit {
 
  public  roleId: string = '';
  public  actType: string = '';
  subsVar: Subscription;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getUSMForLDAPMappingApi: any ;
  public agGridSelectedNodes: any = '';

  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private _Activatedroute: ActivatedRoute,
    public informationservice: InformationService,
  ) {}

  ngOnInit(): void 
  {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.roleId = params.get('id');
      this.actType = params.get('actionType');
    });  
    
    this.getUSMForLDAPMappingApi = GlobalConstants.fetchUSMUsersRoleLDAP +  this.roleId;
    
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true,
      },
      {
        headerName: 'code',
        field: 'code',
        filter: 'agTextColumnFilter',
        sortable: true,
        
      },
      {
        headerName: 'LDAP Server',
        field: 'ldapServer',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'Base Path',
        field: 'basePath',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'LDAP Object Type',
        field: 'ldapObjType',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'LDAP Object CN',
        field: 'ldapObjCN',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
    ];
    this.agColumns.push(this.agColumnsJson);

    this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
      //console.log("menyVariable == 1",this.informationservice.getMenuPath());
      this.commonFunctions.navigateToPage("/usm/role/form/"+this.actType+"/"+this.roleId+"/ldapRolesMappingForm/create/-1");
    });
    this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {    
      // this.onDeleteClick();
    });
  }

  ngOnDestroy() {
    if (this.subsVar) {
       this.subsVar.unsubscribe()
     }
  }

  onDeleteClick() {
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", 'Please select a row to delete');
    } else {
      selectedNodes = selectedNodes.split(',');
      for (let i = 0; i < selectedNodes.length; i++) {
        this.http.delete<any>(GlobalConstants.deleteUSMRoleLDAP + selectedNodes[i], {headers: GlobalConstants.headers}).subscribe(
          (res) => {
            console.log(res);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
    this.commonFunctions.reloadPage("/usm/role/form/"+this.actType+"/"+this.roleId+"/ldapRolesMappingForm");
  }

}
