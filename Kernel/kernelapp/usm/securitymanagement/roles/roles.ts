import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
declare let alertify: any;
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.html',
  styleUrls: ['./roles.css'],
})
export class USMRole {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getUSMRolesApi: any = GlobalConstants.fetchUSMRolesApi;
  public agGridSelectedNodes: any = '';
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
        headerCheckboxSelection: true,
      },
      {
        headerName: 'ID',
        field: 'id',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'Role',
        field: 'roleName',
        filter: 'agTextColumnFilter',
        sortable: true,
        linkType:'field',
        isLink: true,
        link: '/usm/role/form/update/',
        linkParameters: 'id',
      },
      {
        headerName: 'Type',
        field: 'roleTypeName',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
    ];

    this.agColumns.push(this.agColumnsJson);

    // Handling add / update / delete functions that will be linked to the AMD buttons inside the v-grid
    // this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
    //   //console.log("menyVariable == 1",this.informationservice.getMenuPath());
    //   this.commonFunctions.navigateToPage('/usm/role/form/create/-1');
    // });
    // this.subsVar = this.eventEmitterService.onUpdateClick.subscribe(() => {
    //   this.agGridSelectedNodes = localStorage.getItem('agGridSelectedNodes');
    //   if (this.agGridSelectedNodes == '') {
    //     alert("Please select a row");
    //   } else {
    //     console.log("this.agGridSelectedNodes:::",this.agGridSelectedNodes);
    //     this.commonFunctions.navigateToPage(
    //       "/usm/role/form/update/" + this.agGridSelectedNodes

    //     );
    //   }
    // });
    // this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {
    //   this.onDeleteClick();
    // });

  }

  onAddClick() {
    this.commonFunctions.navigateToPage("/usm/role/form/create/-1");
  }

  onUpdateClick() {
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    if(this.agGridSelectedNodes == '') {
      this.commonFunctions.alert("alert","Please select a row");
    } else {
      this.commonFunctions.navigateToPage(
        
        "/usm/role/form/update/"+this.informationservice.getAgGidSelectedNode());
    }
  }

  ngOnDestroy() {
    if (this.subsVar) {
      this.subsVar.unsubscribe();
    }
  }

  // Dynamic Delete Function that will always take into consideration the ID as parameter
  // Capability to delete multiple rows as well
  onDeleteClick() {
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert",'Please select a row to delete');
    } else {
      if (selectedNodes.indexOf(',') != -1) {
        selectedNodes = selectedNodes.split(',');
        for (let i = 0; i < selectedNodes.length; i++) {
          this.http
            .delete<any>(GlobalConstants.deleteUSMRoleApi + selectedNodes[i], {
              headers: GlobalConstants.headers,
            })
            .subscribe({
              next:(res) => {
                this.commonFunctions.alert("alert","Deleted Successfully");
                this.commonFunctions.reloadPage('/usm/role');
              },
              error:(error) => {
                console.log(error);
              }
        });
        }
      } else {
        this.http
          .delete<any>(GlobalConstants.deleteUSMRoleApi + selectedNodes, {
            headers: GlobalConstants.headers,
          })
          .subscribe({
            next:(res) => {
              this.commonFunctions.alert("alert","Deleted Successfully");
              this.commonFunctions.reloadPage('/usm/role');
            },
            error:(error) => {
              console.log(error);
            }
           } );
      }
    }
  }
}
