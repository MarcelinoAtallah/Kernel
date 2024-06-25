import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DataService } from 'src/app/Kernel/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-modify-popup',
  templateUrl: './dashboard-modify-popup.component.html',
  styleUrls: ['./dashboard-modify-popup.component.css']
})
export class DashboardModifyPopupComponent implements OnInit {
  public actionType: string = 'add';
  public id: any;
  public dashboardData: any[] = [];
  public itemsData: any[] = [];
  public isUpdate: boolean = false;;
  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    private dataservice: DataService,
    private router: Router) { }
  dashboardPopup: any = new FormGroup({
    templateName: new FormControl(''),
  });
  ngOnInit(): void {
    this.actionType = this.dataservice.getactionType();
    if (this.actionType == 'update') {
      this.id = localStorage.getItem("agGidSelectedNode");
      this.isUpdate = true;
      this.http.get<any>(GlobalConstants.getDashboardTemplateName + this.id, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
          } else {
            this.dashboardPopup.get("templateName").setValue(res[0].templateName);
            this.dashboardData = JSON.parse(res[1].data);
            for (let i = 0; i < this.dashboardData.length; i++) {
              setTimeout(() => {
                this.itemsData[this.dashboardData[i].index] = { id: this.dashboardData[i].id, type: this.dashboardData[i].type, value: this.dashboardData[i].value, mode: this.dashboardData[i].mode, formData: this.dashboardData[i].formData };
              }, 1000);

            }
          }
        });
    }
  }
  Save() {
    if (this.actionType == 'update') {
      let allData = {
        templateID: localStorage.getItem("agGidSelectedNode"),
        templateName: this.dashboardPopup.get("templateName").value
      }
      this.http.post<any>(GlobalConstants.updateDashboardTempalte, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
        })
    } else {
      let allData = {
        templateName: this.dashboardPopup.get("templateName").value,
        userId: localStorage.getItem("logeduserId")
      }
      this.http.post<any>(GlobalConstants.addDashboardTempalte, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
        })
    }
    this.commonFunctions.reloadPage('/dashboard');
    this.commonFunctions.navigateToPage('/dashboard');
  }

}
