import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { HttpClient } from '@angular/common/http';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  public agColumnsJson1: any;
  agColumns1: AgColumns[] = [];
  public comboAppType: any;
  subsVar: Subscription;
  public agGridSelectedNodes: any = '';
    constructor(private eventEmitterService: EventEmitterService,
      public commonFunctions: CommonFunctions,private http: HttpClient,
      public informationservice: InformationService
    ) { }

  // ngOnInit(): void {
  //   this.agColumnsJson1 = [
  //     {
  //       headerName: 'ID',
  //       field: 'id',
  //       width: '25px',
  //     },
  //     {
  //       headerName: 'Application Name',
  //       field: 'name',
  //       filter: 'agTextColumnFilter',
  //       isLink: true,
  //       link: '/usm/userMgmt/form/update/1/accessRights/update/',
  //       linkParameters: 'id'
  //     }
  //   ];
  //   this.agColumns1.push(this.agColumnsJson1);
  //   this.comboAppType=GlobalConstants.getUSMApplicationRelatedUserId + this.informationservice.getUserId();

  //     this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
  //     this.commonFunctions.navigateToPage("/usm/userMgmt/form/update/1/accessRights/create/1");
  //   });
  // }
  ngOnInit(): void {
    
    const menuPath = this.informationservice.getMenuPath();

    const checktodelete = {
      headerName: '',
      field: '',
      checkboxSelection: true,
      width: '25px',
      headerCheckboxSelection: true,
    };

    const commonColumns = {

      headerName: 'ID',
      field: 'id',
      width: '25px',
    };

    const userMgmtColumns = {
      headerName: 'Application Name',
      field: 'name',
      filter: 'agTextColumnFilter',
      isLink: true,
      linkType:'field',
      link: '/usm/userMgmt/form/update/1/accessRights/update/',
      linkParameters: 'id',
      width: '25px'
    };

    const roleColumns = {
      headerName: 'Application Name',
      field: 'name',
      filter: 'agTextColumnFilter',
      isLink: true,
      linkType:'field',
      link: '/usm/role/form/update/1/accessRights/update/',
      linkParameters: 'id',
    };

    if (menuPath === 'usm/userMgmt') {
      this.agColumnsJson1 = [checktodelete,commonColumns, userMgmtColumns];
      this.agColumns1.push(this.agColumnsJson1);
      this.comboAppType=GlobalConstants.getUSMApplicationRelatedUserId + this.informationservice.getLogeduserId();
      // this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
      //   this.commonFunctions.navigateToPage("/usm/userMgmt/form/update/-1/accessRights/create/-1");
      // });

    } else if (menuPath === 'usm/role') {
      this.agColumnsJson1 = [checktodelete,commonColumns, roleColumns];
      this.agColumns1.push(this.agColumnsJson1);
      
      this.comboAppType=GlobalConstants.getUSMApplicationRelatedRoleId + this.informationservice.getRoleId();
      // this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
      //   this.commonFunctions.navigateToPage("/usm/role/form/update/-1/accessRights/create/-1");
      // });

    }
    // this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {
    //   this.onDeleteClick();
    // });
  }
  onAddClick() {
    this.commonFunctions.navigateToPage("/usm/role/form/create/-1/accessRights/create/-1");
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
    
    const menuPath = this.informationservice.getMenuPath();
    let selectedNodes = this.agGridSelectedNodes;
    
    const StoredUserId=this.informationservice.getUserId();
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", 'Please select a row to delete');
    } else {
      if (selectedNodes.indexOf(',') != -1) {
        selectedNodes = selectedNodes.split(',');
        for (let i = 0; i < selectedNodes.length; i++) {
          if (menuPath === 'usm/userMgmt') {

          this.http
          
            .delete<any>(GlobalConstants.deleteApp +this.informationservice.getUserId()+"/userMgmt/"+ selectedNodes[i], {
              headers: GlobalConstants.headers,
            })
            .subscribe({
              next:(res) => {
                console.log(res);
                this.commonFunctions.alert("alert", 'Deleted Successfully');
                this.commonFunctions.reloadPage('usm/userMgmt/form');
              },
              error:(error) => {
                console.log(error);
              }
        });
        }else if (menuPath === 'usm/role') {
          this.http
            .delete<any>(GlobalConstants.deleteApp +localStorage.getItem('roleId')+"/role/"+  selectedNodes[i], {
              headers: GlobalConstants.headers,
            })
            .subscribe({
              next:(res) => {
                console.log(res);
                this.commonFunctions.alert("alert", 'Deleted Successfully');
                this.commonFunctions.reloadPage('/usm/role/form');
              },
              error:(error) => {
                console.log(error);
              }
             } );
        }

    }
  }  else {
    if (menuPath === 'usm/userMgmt') {

      this.http
        
        .delete<any>(GlobalConstants.deleteApp +this.informationservice.getUserId()+"/userMgmt/"+  selectedNodes, {
          headers: GlobalConstants.headers,
        })
        .subscribe({
          next:(res) => {
            console.log(res);
            this.commonFunctions.alert("alert", 'Deleted Successfully');
            this.commonFunctions.reloadPage('usm/userMgmt/form');
          },
          error:(error) => {
            console.log(error);
          }
    });
    }else if (menuPath === 'usm/role') {
      this.http
        .delete<any>(GlobalConstants.deleteApp +localStorage.getItem('roleId')+"/role/"+  selectedNodes, {
          headers: GlobalConstants.headers,
        })
        .subscribe({
          next:(res) => {
            console.log(res);
            this.commonFunctions.alert("alert", 'Deleted Successfully');
            this.commonFunctions.reloadPage('/usm/role/form');
          },
          error:(error) => {
            console.log(error);
          }
         } );
    }

  }

}
  }
}

