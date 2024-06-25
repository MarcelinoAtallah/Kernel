import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public orderMgmApi: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public lookupData: any,
              private dialogRef: MatDialogRef<OrderManagementComponent>,
              private commonFunctions: CommonFunctions) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        maxWidth: '50',
        headerCheckboxSelection: true
      },
      {
        headerName: 'ID',
        field: 'id',
        defaultMinWidth: '180',
        filter: 'agNumberColumnFilter',
        sortable: true
      },
      {
        headerName: 'Description',
        field: 'description',
        defaultMinWidth: '180',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Order No',
        field: 'orderNo',
        defaultMinWidth: '180',
        filter: 'agNumberColumnFilter',
        sortable: true,
        editable: true
      },
    ]
    this.agColumns.push(this.agColumnsJson);
    this.orderMgmApi = GlobalConstants.fieldOrderManagement + this.lookupData[0].objectId;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async gridEventSave(event: any) {
    let updatedData: any[] = event[0].updateList;
    let json: string = '[';
    for(let i = 0; i < updatedData.length; i ++) {
      if(i == updatedData.length - 1) {
        json += "{" + "\"" + "columnId" + "\"" + ":" + "\"" + updatedData[i].id + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "\"" + updatedData[i].orderNo + "\"" + "}";
        json += "]";
      } else {
        json += "{" + "\"" + "columnId" + "\"" + ":" + "\"" + updatedData[i].id + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "\"" + updatedData[i].orderNo + "\"" + "}" + ",";
      }
    }

    if(updatedData.length > 0) {
      try {
        const gridEventSaveApi = from(axios.post(GlobalConstants.updateFieldOrder, JSON.parse(json)));
        const gridEventSave = await lastValueFrom(gridEventSaveApi);
        this.commonFunctions.alert("alert", gridEventSave.data.description);
      } catch (error) {
        console.log("gridEventSave error >>> ", error);
      }
    } else {
      this.commonFunctions.alert("alert", "No changes found");
      return;
    }
  }
}
