import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';

@Component({
  selector: 'GroupMappingTabComponent',
  templateUrl: './group-mapping-tab.component.html',
  styleUrls: ['./group-mapping-tab.component.css']
})
export class GroupMappingTabComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public AddGroupMapping : any
  constructor() { }

  ngOnInit(): void {
    this.agColumnsJson = [
      { 
        headerName: '', 
        field: '', 
        checkboxSelection: true, 
        width: '25px', 
        headerCheckboxSelection: true 
      },
      { 
        headerName: 'Code', 
        field: 'id', 
        filter: 'agTextColumnFilter', 
        sortable: true 
      },
      { 
        headerName: 'LDAP server', 
        field: 'username', 
        filter: 'agTextColumnFilter', 
        sortable: true 
      },
      { 
        headerName: 'Base Path', 
        field: 'fullName',
        filter: 'agTextColumnFilter', 
        sortable: true, 
        //isLink: true,
        //link: "/usm/userMgmt/form/update/",
        //linkParameters: "id"
      },
      { 
        headerName: 'LDAP Object Type', 
        field: 'status', 
        filter: 'agTextColumnFilter', 
        sortable: true 
      },
      { 
        headerName: 'LDAP Object CN', 
        field: 'defaultRole', 
        filter: 'agTextColumnFilter', 
        sortable: true 
      }
    ];
    this.agColumns.push(this.agColumnsJson);
  }

}
