import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { Subscription } from 'rxjs/internal/Subscription';
declare let alertify: any;
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'Usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css'],
})
export class Usermanagement {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public content: any;
  public agGridSelectedNodes: any = '';
  public comboDatasource = [{}];
  subsVar: Subscription;

  // Update Form Variables
  public getUSMUsersApi: any = GlobalConstants.fetchUSMUsersApi;

  @ViewChild('addContent') addContent: any;
  @ViewChild('updateContent') updateContent: any;

  constructor(
    private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    public informationservice: InformationService,
  ) {}

  ngOnInit() {

    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Id',
        field: 'ID',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Login',
        field: 'USERNAME',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Name',
        field: 'FULLNAME',
        filter: 'agTextColumnFilter',
        sortable: true,
        isLink: true,
        linkType:'field',
        link: "/usm/userMgmt/form/update/",
        linkParameters: "ID"
      },
      {
        headerName: 'Status',
        field: 'STATUS',
        filter: 'agTextColumnFilter',
        sortable: true ,
        editable: true
      },
      {
        headerName: 'Default Role',
        field: 'DEFAULTROLE',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'LDAP user',
        field: 'ISPWDLDAPAUTH',
        filter: 'agTextColumnFilter',
        isCheckBox: true,
        isCheckBoxDisabled: true
      }
    ];
    this.agColumns.push(this.agColumnsJson);
  }


  onAddClick() {
    this.commonFunctions.navigateToPage("/usm/userMgmt/form/create/-1");

  }

  onUpdateClick() {
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    if(this.agGridSelectedNodes == '') {
      this.commonFunctions.alert("alert", "Please select a row");
    } else {
      
      this.commonFunctions.navigateToPage("/usm/userMgmt/form/update/"+this.informationservice.getAgGidSelectedNode());
    }
  }

  ngOnDestroy() {
    if (this.subsVar) {
       this.subsVar.unsubscribe()
     }
  }

  // Dynamic Delete Function that will always take into consideration the ID as parameter
  // Capability to delete multiple rows as well
  onDeleteClick() {
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", 'Please select a row to delete');
    } else {
      if(selectedNodes.indexOf(",") != -1) {
      selectedNodes = selectedNodes.split(',');
      for (let i = 0; i < selectedNodes.length; i++) {
        this.http.delete<any>(GlobalConstants.deleteUSMUserApi + selectedNodes[i],
          {headers: GlobalConstants.headers}).subscribe({
          next:(res) => {
            console.log(res);
            this.commonFunctions.alert("alert", 'Deleted Successfully');
            this.commonFunctions.reloadPage('/usm/userMgmt');
          },
          error:(error) => {
            console.log(error);
          }
         } );
      }
    } else {
      this.http.delete<any>(GlobalConstants.deleteUSMUserApi + selectedNodes,
        {headers: GlobalConstants.headers}).subscribe({
        next:(res) => {
          this.commonFunctions.alert("alert", 'Deleted Successfully');
          this.commonFunctions.reloadPage('/usm/userMgmt');
        },
       error:(error) => {
          console.log(error);
        }
    });
    }
  }
}
}
