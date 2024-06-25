import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/Kernel/services/data.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-grid-builder-form',
  templateUrl: './grid-builder-form.component.html',
  styleUrls: ['./grid-builder-form.component.css']
})
export class GridBuilderFormComponent implements OnInit {
  public actionType: string = 'add';
  public gridId: any;
  public isUpdate: boolean = false;
  public getQueryName = GlobalConstants.getQueryNameApi;
  public getRowDate = GlobalConstants.rowSourceApi + localStorage.getItem("agGidSelectedLookup_(query)_id");
  gridForm = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),

  });

  constructor(public commonFunctions: CommonFunctions,
    private dataservice: DataService,
    private http: HttpClient,
    private dialog: MatDialog,
    public informationservice: InformationService) { }

  ngOnInit(): void {
    this.actionType = this.dataservice.getactionType();
    if (this.actionType == 'update') {
      this.gridId = this.informationservice.getAgGidSelectedNode();
      this.isUpdate = true;

      this.http.get<any>(GlobalConstants.selectGridApi + this.gridId, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
          } else {
            this.gridForm.get("title").setValue(res[0].gridName)
            this.gridForm.get("query").setValue(res[0].query)
          }
        })
    }
  }
  submit() {
    if (this.actionType == 'update') {
      let allData = {
        gridId: this.informationservice.getAgGidSelectedNode(),
        userId: this.informationservice.getLogeduserId(),
        gridName: this.gridForm.get("title").value,
        query: localStorage.getItem('agGidSelectedLookup_(query)_id'),
      }

      this.http.post<any>(GlobalConstants.updateGrid, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.commonFunctions.reloadPage("/dsp/gridBuilder");
          this.commonFunctions.navigateToPage("/dsp/gridBuilder");
        })
    } else {
      let allData = {
        gridName: this.gridForm.get("title").value,
        query: localStorage.getItem("agGidSelectedLookup_(query)_id"),
        userId: this.informationservice.getLogeduserId(),
      }

      this.http.post<any>(GlobalConstants.addGridApi, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.commonFunctions.reloadPage("/dsp/gridBuilder");
          this.commonFunctions.navigateToPage("/dsp/gridBuilder");
        })
    }
    this.closeDialog();
  }
  closeDialog() {
    this.dialog.closeAll();
  }

}