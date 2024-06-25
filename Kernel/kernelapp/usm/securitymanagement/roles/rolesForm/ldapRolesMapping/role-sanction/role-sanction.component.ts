import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-role-sanction',
  templateUrl: './role-sanction.component.html',
  styleUrls: ['./role-sanction.component.css']
})
export class RoleSanctionComponent implements OnInit {

public getUSMRolesApi: any
public agColumnsJson: any;
public agColumns: AgColumns[] = [];

  constructor(private commonFunctions: CommonFunctions,
    public informationservice: InformationService) { }

  ngOnInit(): void {
    
    let roleId =  parseInt(this.informationservice.getUserRoleId());
    this.getUSMRolesApi = GlobalConstants.getRoleSanctionList +'/'+ roleId;

    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true,
      },
      {
        headerName: 'ID',
        field: 'id',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'Source Code',
        field: 'refCode',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'Source Name',
        field: 'abbrev',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
    ];
    this.agColumns.push(this.agColumnsJson);
  }
  onAddClick() {
    this.commonFunctions.navigateToPage("/usm/role/formSanction/create/-1");
  }
  onDeleteClick() {}
}
