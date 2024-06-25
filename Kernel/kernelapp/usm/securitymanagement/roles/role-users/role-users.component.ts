import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-role-users',
  templateUrl: './role-users.component.html',
  styleUrls: ['./role-users.component.css']
})
export class RoleUsersComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public agGridSelectedNodes: any = '';
  public getUSMUsersOfRoleApi: any;
  public roleId: string = '';


  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private _Activatedroute: ActivatedRoute,
    public informationservice: InformationService) { }

  ngOnInit(): void {

    this._Activatedroute.paramMap.subscribe(params => {
      this.roleId = params.get('id');
      
      this.informationservice.setRoleId(this.roleId);

    });

    this.getUSMUsersOfRoleApi = GlobalConstants.fetchUSMUsersOfRoleApi + this.roleId;
    

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

}
