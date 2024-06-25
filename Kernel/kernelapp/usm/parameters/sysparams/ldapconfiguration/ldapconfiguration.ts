import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
declare let alertify: any;
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-ldapconfiguration',
  templateUrl: './ldapconfiguration.html',
  styleUrls: ['./ldapconfiguration.css'],
})
export class LdapconfigurationComponent {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getUSMForLDAPMappingApi: any = GlobalConstants.fetchLdapApi;
  public agGidSelectedNode: any = '';
  subsVar: Subscription;


  // Fetching all declared variables from the AG-Grid Component
  @ViewChild('addContent') addContent: any;
  @ViewChild('updateContent') updateContent: any;

  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    public informationservice: InformationService
  ) {}

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
        field: 'ldapConfigId',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'LDAP Search Base',
        field: 'ldapSearchBase',
        filter: 'agTextColumnFilter',
        sortable: true,
        isLink: true,
        link: '/usm/ldapConfig/form/update/',
        linkParameters: 'ldapConfigId',
      },
      {
        headerName: 'LDAP Configuration URL',
        field: 'ldapServerUrl',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'LDAP Configuration Port',
        field: 'ldapServerPort',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
    ];
    this.agColumns.push(this.agColumnsJson);

    // Handling add / update / delete functions that will be linked to the AMD buttons inside the v-grid
    this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
      this.commonFunctions.navigateToPage('/usm/ldapConfig/form/create/-1');
    });

    this.subsVar = this.eventEmitterService.onUpdateClick.subscribe(() => {
      
      this.agGidSelectedNode = this.informationservice.getAgGidSelectedNode();

      if (this.agGidSelectedNode == '') {
        this.commonFunctions.alert("alert", 'Please select a row');
      } else {
        this.commonFunctions.navigateToPage(
          '/usm/ldapConfig/form/update/' + this.agGidSelectedNode
        );
      }
    });

    this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {
      this.onDeleteClick();
    });
  }

  ngOnDestroy() {
    if (this.subsVar) {
      this.subsVar.unsubscribe();
    }
  }

  // Dynamic Delete Function that will always take into consideration the ID as parameter
  // Capability to delete multiple rows as well
  onDeleteClick() {
    
    this.agGidSelectedNode = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGidSelectedNode;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", 'Please select a row to delete');
    } else {
      if (selectedNodes.indexOf(',') != -1) {
        selectedNodes = selectedNodes.split(',');
        for (let i = 0; i < selectedNodes.length; i++) {
          this.http.delete<any>(GlobalConstants.deleteLdapConfigApi + selectedNodes[i], { headers: GlobalConstants.headers,})
          .subscribe(
              (res) => {
                console.log(res);
                this.commonFunctions.alert("alert", 'Deleted Successfully');
                this.commonFunctions.reloadPage('/usm/ldapConfig');
              },
              (error) => {
                console.log(error);
              }
            );
        }
      } else {
        this.http.delete<any>(GlobalConstants.deleteLdapConfigApi + selectedNodes, { headers: GlobalConstants.headers}).subscribe(
            (res) => {
              this.commonFunctions.alert("alert", 'Deleted Successfully');
              this.commonFunctions.reloadPage('/usm/ldapConfig');
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }
}
