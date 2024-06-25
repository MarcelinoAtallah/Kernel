import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-fieldsetconfiguration',
  templateUrl: './fieldsetconfiguration.component.html',
  styleUrls: ['./fieldsetconfiguration.component.css']
})
export class FieldsetconfigurationComponent implements OnInit {
  public actionType: any;
  public objectId: number;
  public fieldsetId: number;

  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public lookupData: any,
    private dialogRef: MatDialogRef<FieldsetconfigurationComponent>,
    private commonFunctions: CommonFunctions,
    public informationservice: InformationService) { }

  fieldSetForm = new FormGroup({
    fieldsetId: new FormControl(''),
    fieldsetName: new FormControl(''),
    orderField: new FormControl('')
  });

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.actionType = this.lookupData[0].actionType;
    this.objectId = this.lookupData[0].objectId;

    if (this.actionType == "update") {
      this.fieldsetId = this.lookupData[0].fieldsetId;
      this.http.get<any>(GlobalConstants.getFieldSetDataApi + this.objectId + "/" + this.fieldsetId, { headers: GlobalConstants.headers }).subscribe(
        (data: any) => {
          this.fieldSetForm.controls["fieldsetName"].setValue(data[0].name);
          this.fieldSetForm.controls["orderField"].setValue(data[0].orderNb);
          this.fieldSetForm.controls["fieldsetId"].setValue(data[0].id);
        });
    }
  }

  submitForm() {
    if (this.fieldSetForm.status != 'INVALID') {
      if (this.actionType == 'saveNew') {
        let List = [];
        const jsonParams = {
          filedsetName: this.fieldSetForm.controls['fieldsetName']?.value,
          orderField: this.fieldSetForm.controls['orderField']?.value,
          objectId: this.objectId,
          userId: this.informationservice.getLogeduserId()
        };
        List.push(jsonParams);

        this.http.post<any>(GlobalConstants.addFieldSetApi, List, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
            }
          });

      }

      if (this.actionType == 'update') {
        let updateList = [];
        const jsonParams = {
          filedsetName: this.fieldSetForm.controls['fieldsetName']?.value,
          orderField: this.fieldSetForm.controls['orderField']?.value,
          fieldsetId: this.fieldSetForm.controls['fieldsetId']?.value
        };
        updateList.push(jsonParams);

        this.http.post<any>(GlobalConstants.updateFieldSetApi, updateList, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
            }
          });
      }
    }
  }
}
