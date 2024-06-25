import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { ActivatedRoute } from '@angular/router';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-form-update',
  templateUrl: './form-update.component.html',
  styleUrls: ['./form-update.component.css']
})
export class FormUpdateComponent implements OnInit {
  public actionType: any = "";
  public GetColVal: any = "";
  public getOrders: any = "";
  public getAllTablesCombo: any = GlobalConstants.getAllTablesCombo;
  public getOneTableCombo: any = "";

  public objectId: any;
  public objectPId: any;
  public tableId: any;
  public oldSelectedValues: any;
  public LoadingOrder : any;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<FormUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public lookupData: any,
    private _Activatedroute: ActivatedRoute,
    private commonFunctions: CommonFunctions,
    public informationservice: InformationService
  ) { }


  formUpdate = new FormGroup({
    tables: new FormControl(''),
    columns: new FormControl(['']),
    order: new FormControl(''),
  });
  ngOnInit(): void {


    this.objectId = this.lookupData[0].objectId;
    this.objectPId = this.lookupData[0].objectPId;
    this.actionType = this.lookupData[0].actionType;
    // let NewArray = this.informationservice.getAgGidSelectedNode().split(',');
    let NewArray = JSON.parse(this.informationservice.getAgGidSelectedNode());
    console.log("my data on update >>>>>>> : " , NewArray);

    for (let i = 0; i < NewArray.length; i++) {
      if (NewArray[i].rowSlectedStatus == "insert") {
        this.tableId = NewArray[i].id;
      }
    }
    if (this.actionType == "update") {
      this.tableId = NewArray[0].id;
      this.getOneTableCombo = GlobalConstants.getOneTableCombo + this.objectId + "/" + this.tableId;
      this.fetchTabData();
    }


  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  fetchTabData() {
    this.http.post<any>(GlobalConstants.getTabTablesFormRecords + this.objectId + "/" + this.tableId, { headers: GlobalConstants.headers, }).subscribe(
      (res: any) => {
        this.formUpdate.controls['order'].setValue(res[0].orderNo);
        this.LoadingOrder = res[0].orderNo;
        let columns: any[] = [];
        this.GetColVal = GlobalConstants.GetColVal + "/" + res[0].tableOwner + "." + res[0].tableName;
        for (var i = 0; i < res.length; i++) {
          columns.push(res[i].columnName);
        }
        this.formUpdate.controls['tables'].setValue(res[0].tableOwner + "." + res[0].tableName);
        this.oldSelectedValues = columns;
        this.formUpdate.controls['columns'].setValue(columns);
      });
  }

  onTablesChange() {
    var tables = this.formUpdate.get('tables').value;
    this.GetColVal = GlobalConstants.GetColVal + tables;
    let Url = GlobalConstants.getRelationBetween2tables;
    let Data =
    {
      "tableName": tables,
      "tableMainId": this.objectPId
    };
  }

  onOrderChange() {
    this.getOrders = GlobalConstants.getOrdersApi + this.objectId;
  }

  submitForm() {
    var table = this.formUpdate.get('tables').value.split('.')[1];
    var ownerName = this.formUpdate.get('tables').value.split('.')[0];
    var columns = this.formUpdate.get('columns').value;
    var order = this.formUpdate.get('order').value;

    if (this.formUpdate.status != 'INVALID') {
      let NewArrayUpdateJson: any[] = []
      let allColumnsAray: any[] = [];
      let allColumnsWithID: any[] = [];
      let object: any = "";

      if (this.actionType == "saveNew") {
        let columnsAr: any[] = [];
        let json: string = '';
        for (let i = 0; i < columns.length; i++) {
          let json: any = { columnName: columns[i] }
          columnsAr.push(json)
        }
        object = {
          "tableOwner": ownerName,
          "tableName": table,
          "columns": columnsAr,
          "rowSlectedStatus": "insert",
          "orderNo": order,
          "type": "saveNew"
        };
        NewArrayUpdateJson.push(object);

        this.http.post<any>(GlobalConstants.updateGridApi + this.objectId, NewArrayUpdateJson, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {

            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
            }
          });
      }

      if (this.actionType == "update") {
        this.http.get<any>(GlobalConstants.getTableInfo + this.objectId + "/" + table + "/" + ownerName, { headers: GlobalConstants.headers }).subscribe(
          (tableId: any) => {
            this.http.get<any>(GlobalConstants.checkColumnsExist + this.objectId + "/" + tableId, { headers: GlobalConstants.headers }).subscribe(
              (res: any) => {
                for (let i = 0; i < res.length; i++) {
                  allColumnsWithID.push(res[i]);
                  allColumnsAray.push(res[i].columnName);
                }

                // let commonValues = allColumnsAray.filter((value: any) => columns.includes(value));
                // let uncommonValues = allColumnsAray.concat(columns).filter((value: any) => !commonValues.includes(value));
                // let deletedValues = allColumnsAray.filter((value: any) => uncommonValues.includes(value));
                // let addedValues = uncommonValues.concat(deletedValues).filter((value: any) => !deletedValues.includes(value));

                let oldValueSelected = this.formUpdate.controls['columns']?.value;
                let newValueSelected: any = [];
                for (let i = 0; i < oldValueSelected.length; i++) {
                  if (oldValueSelected[i].name != undefined) {
                    newValueSelected.push(oldValueSelected[i].name);
                  } else {
                    newValueSelected.push(oldValueSelected[i]);
                  }
                }
                let deletedValues = this.oldSelectedValues.filter((value: any) => !newValueSelected.includes(value));
                let valueTobeNotAdded = this.oldSelectedValues.filter((value: any) => newValueSelected.includes(value));
                let addedValues = newValueSelected.filter((itemA: any) => !valueTobeNotAdded.includes(itemA));
                //rony
                let order = this.formUpdate.controls['order']?.value;

                if (addedValues.length > 0 || deletedValues.length > 0 || this.LoadingOrder != order) {

                  let deleteJson: string = '';
                  let deleteJsonId: any = [];

                  for (let i = 0; i < deletedValues.length; i++) {
                    for (let j = 0; j < allColumnsWithID.length; j++) {
                      if (deletedValues[i] == allColumnsWithID[j].columnName) {
                        deleteJsonId.push(allColumnsWithID[j].columnId);
                      }
                    }
                  }
                  for (let i = 0; i < deletedValues.length; i++) {
                    if (i == deletedValues.length - 1) {
                      deleteJson += "{" + "\"" + "columnName" + "\"" + ":" + "\"" + deletedValues[i] + "\"" + "}";
                      deleteJson = "[" + deleteJson + "]";

                      object = {
                        "tableOwner": ownerName,
                        "tableName": table,
                        "columns": JSON.parse(deleteJson),
                        "rowSlectedStatus": "deleted",
                        "orderNo": order,
                        "type": "update",
                        "columnsId": deleteJsonId

                      };
                      NewArrayUpdateJson.push(object);
                    } else {
                      deleteJson += "{" + "\"" + "columnName" + "\"" + ":" + "\"" + deletedValues[i] + "\"" + "}" + ",";
                    }
                  }
                  let insertJson: string = '';
                  for (let i = 0; i < addedValues.length; i++) {
                    if (typeof addedValues[i] != "object") {
                      if (i == addedValues.length - 1) {
                        insertJson += "{" + "\"" + "columnName" + "\"" + ":" + "\"" + addedValues[i] + "\"" + "}";
                        insertJson = "[" + insertJson + "]";
                        object = {
                          "tableOwner": ownerName,
                          "tableName": table,
                          "columns": JSON.parse(insertJson),
                          "rowSlectedStatus": "insert",
                          "orderNo": order,
                          "type": "update",
                          "columnsId": deleteJsonId
                        };
                        NewArrayUpdateJson.push(object);
                      } else {
                        insertJson += "{" + "\"" + "columnName" + "\"" + ":" + "\"" + addedValues[i] + "\"" + "}" + ",";
                      }
                    }
                  }

                  this.http.post<any>(GlobalConstants.updateGridApi + this.objectId, NewArrayUpdateJson, { headers: GlobalConstants.headers }).subscribe(
                    (res: any) => {
                      if (res.status == 'Fail') {
                        this.commonFunctions.alert("alert", res.description);
                      } else {
                        this.commonFunctions.alert("alert", res.description);
                      }
                    });
                } else {
                  this.commonFunctions.alert("alert", "No Changes");
                }
              });
          });
      }

    }

  }
}



