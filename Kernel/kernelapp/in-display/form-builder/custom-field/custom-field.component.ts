import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public lookupData: any,
              private dialogRef: MatDialogRef<CustomFieldComponent>,
              public commonFunctions: CommonFunctions,
              public informationservice: InformationService) { }

  public allColumnsData: any[] = [];
  public getTablesLinkedToForm = GlobalConstants.getTablesLinkedToForm + this.lookupData[0].objectId;

  newCustomField = new FormGroup({
    description: new FormControl(''),
    commonColumn: new FormControl(''),
    commonVal: new FormControl(''),
    destinationField: new FormControl(''),
    table: new FormControl('')
  });

  async ngOnInit(): Promise<void> {
    const getColumnsApiURL = from(axios.get(GlobalConstants.getColumnsApi + this.lookupData[0].objectId));
    const getColumnsApi = await lastValueFrom(getColumnsApiURL);
    this.allColumnsData = getColumnsApi.data;
  }

  async submitForm() {
    if(this.newCustomField.status != "INVALID") {
      let commonColumn = this.newCustomField.get("commonColumn")?.value;
      let commonVal = this.newCustomField.get("commonVal")?.value;
      let table = this.newCustomField.get("table")?.value;
      let destinationField = this.newCustomField.get("destinationField")?.value;

      const getCommonColNameUrl = from(axios.get(GlobalConstants.getColNameByColumnId+commonColumn));
      const getCommonColName = await lastValueFrom(getCommonColNameUrl);

      const getDestFieldNameUrl = from(axios.get(GlobalConstants.getColNameByColumnId+destinationField));
      const getDestFieldName = await lastValueFrom(getDestFieldNameUrl);

      if(getCommonColName.data.indexOf("Custom_") != -1) {
        this.commonFunctions.alert("alert", "Cannot have a custom field as commun column");
        return;
      }

      if(getDestFieldName.data.indexOf("Custom_") != -1) {
        this.commonFunctions.alert("alert", "Cannot have a custom field as destination field");
        return;
      }

      let columnName = "Custom_"+commonColumn+"_"+commonVal+"_"+destinationField+"_"+table;
      let columnDescription = this.newCustomField.get("description")?.value;

      let jsonData = [
        {
          columnName: columnName, 
          columnDescription: columnDescription,
          createdBy: Number(this.informationservice.getLogeduserId()),
          objectId:  Number(this.lookupData[0].objectId)
        }
      ];

      const insertCustomFieldUrl = from(axios.post(GlobalConstants.insertCustomField, jsonData));
      const insertCustomField = await lastValueFrom(insertCustomFieldUrl);

      if(insertCustomField.data.code == 100) {
        this.commonFunctions.alert("alert", insertCustomField.data.description);
        this.closeDialog();
      } else {
        this.commonFunctions.alert("alert", insertCustomField.data.description);
      }

    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
