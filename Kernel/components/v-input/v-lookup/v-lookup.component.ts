import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'v-lookup',
  templateUrl: './v-lookup.component.html',
  styleUrls: ['./v-lookup.component.css']
})
export class VLookupComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public inDisplayGrid = GlobalConstants.fetchInDispMappingApi;
  public headerCheckboxBoolean:boolean;

  public lookupFieldName: string = "";
  public lookupDataApi: string = "";
  public lookupStaticData: string = "";
  public lookupSelection: string = "";
  public label:any;
  public readonly:boolean;
  constructor(private dialogRef: MatDialogRef<VLookupComponent>, @Inject(MAT_DIALOG_DATA) public lookupData: any,
    public informationservice: InformationService) { }

  ngOnInit(): void {
    this.label=this.lookupData[0].label;
    localStorage.setItem("agGidSelectedLookup_("+this.lookupFieldName+")_id", "");
    localStorage.setItem("agGidSelectedLookup_("+this.lookupFieldName+")_name", "");

    // this.informationservice.setDynamicService("agGidSelectedLookup_("+this.lookupFieldName+")_id", "");
    // this.informationservice.setDynamicService("agGidSelectedLookup_("+this.lookupFieldName+")_name", "");

    this.lookupFieldName = this.lookupData[0].lookupFieldName;
    this.lookupDataApi = this.lookupData[0].lookupDataId;
    this.lookupStaticData = this.lookupData[0].lookupStaticData == '' ? "-1" : this.lookupData[0].lookupStaticData;
    this.lookupSelection = this.lookupData[0].lookupSelection;
    this.readonly = this.lookupData[0].readonly;
    let headerCheckboxSelection: (params: any) => boolean;

    if (this.lookupSelection === 'multiple'){
      this.headerCheckboxBoolean = true;

    } else{
      this.headerCheckboxBoolean = false;

    }


    if (this.readonly) {
      this.setupReadOnlyColumns();
    } else {
      this.setupEditableColumns();
    }
  }

  //   if(this.lookupStaticData != "-1") {
  //     this.agColumnsJson = [
  //       {
  //         headerName: '',
  //         field: '',
  //         checkboxSelection: true,
  //         maxWidth: '50',
  //         headerCheckboxSelection: true
  //       },
  //       {
  //         headerName: 'ID',
  //         field: 'ID',
  //         filter: 'agTextColumnFilter',
  //         sortable: true
  //       },
  //       {
  //         headerName: 'Name',
  //         field: 'NAME',
  //         filter: 'agTextColumnFilter',
  //         sortable: true
  //       }
  //     ]
  //     this.agColumns.push(this.agColumnsJson);
  //   } else {
  //     this.agColumnsJson = [
  //       {
  //         headerName: '',
  //         field: '',
  //         checkboxSelection: true,
  //         maxWidth: '50',
  //         headerCheckboxSelection: true
  //       },
  //       {
  //         headerName: 'ID',
  //         field: 'id',
  //         filter: 'agTextColumnFilter',
  //         sortable: true,
  //         maxWidth: '100',

  //       },
  //       {
  //         headerName: 'Name',
  //         field: 'name',
  //         filter: 'agTextColumnFilter',
  //         sortable: true
  //       }
  //     ]
  //     this.agColumns.push(this.agColumnsJson);
  //   }
  setupReadOnlyColumns(): void {
    if (this.lookupStaticData != "-1") {
      console.log('1 Selection ===================== ', this.lookupSelection);

      this.agColumnsJson = [
        {
          headerName: 'ID',
          field: 'ID',
          filter: 'agTextColumnFilter',
          sortable: true
        },
        {
          headerName: 'Name',
          field: 'NAME',
          filter: 'agTextColumnFilter',
          sortable: true
        }
      ];
    } else {
      this.agColumnsJson = [
        {
          headerName: 'ID',
          field: 'id',
          filter: 'agTextColumnFilter',
          sortable: true,
          maxWidth: '100',
        },
        {
          headerName: 'Name',
          field: 'name',
          filter: 'agTextColumnFilter',
          sortable: true
        }
      ];
    }
    this.agColumns.push(this.agColumnsJson);
  }

  setupEditableColumns(): void {
    if (this.lookupStaticData != "-1") {
      this.agColumnsJson = [
        {
          headerName: '',
          field: '',
          checkboxSelection: true,
          maxWidth: '50',
          headerCheckboxSelection: this.headerCheckboxBoolean,
        },
        {
          headerName: 'ID',
          field: 'ID',
          filter: 'agTextColumnFilter',
          sortable: true
        },
        {
          headerName: 'Name',
          field: 'NAME',
          filter: 'agTextColumnFilter',
          sortable: true
        }
      ];
    } else {
      console.log('2 Selection ===================== ', this.lookupSelection);
      
      this.agColumnsJson = [
        {
          // headerName: '',
          // field: '',
          // checkboxSelection: true,
          // maxWidth: '50',
          // headerCheckboxSelection: true

          headerName: '',
          field: '',
          checkboxSelection: true,
          maxWidth: '50',
          headerCheckboxSelection: this.headerCheckboxBoolean,
        },
        {
          headerName: 'ID',
          field: 'id',
          filter: 'agTextColumnFilter',
          sortable: true,
          maxWidth: '100',
        },
        {
          headerName: 'Name',
          field: 'name',
          filter: 'agTextColumnFilter',
          sortable: true
        }
      ];
    }
    this.agColumns.push(this.agColumnsJson);
  }  







  submitLookup(): void {
     this.informationservice.setLookUpSubmitValue(localStorage.getItem("agGidSelectedLookup_("+this.lookupFieldName+")_id"))
    // localStorage.setItem("agGidSelectedLookup_("+this.lookupFieldName+")_id", "");
    // localStorage.setItem("agGidSelectedLookup_("+this.lookupFieldName+")_name", "");
    this.dialogRef.close("closed");
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
