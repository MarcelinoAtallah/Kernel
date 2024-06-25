import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public content: any;
  public agGridSelectedNodes: any = '';
  public comboDatasource = [{}];
  subsVar: Subscription;
  public inDisplayGrid = GlobalConstants.fetchInDispTablesApi;


  constructor(
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private commonFunctions: CommonFunctions,
    private route: Router,
    public informationservice: InformationService
  ) { }

  form = new FormGroup({
    name: new FormControl('')
  })

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        maxWidth: '50',
      },
      // {
      //   headerName: 'Owner',
      //   field: 'owner',
      //   filter: 'agTextColumnFilter',
      //   sortable: true,
      //   enableRowGroup: true
      // },
      {
        headerName: 'Table Name',
        field: 'tableName',
        filter: 'agTextColumnFilter',
        sortable: true,
        enableRowGroup: true
      }
      // {
      //   headerName: 'Column Name',
      //   field: 'columnName'
      // }

    ];
    this.agColumns.push(this.agColumnsJson);
  }

  submitForm(): void {
  let List = [];
let NewArray = this.informationservice.getAgGidSelectedNode().split(",");
for(let i=0;i<NewArray.length;i++){
  const jsonParams = {
    ownerName: NewArray[i].split(".")[0],
    tableName: NewArray[i].split(".")[1],
    menuName: this.form.get('name')?.value,
    userId: this.informationservice.getLogeduserId()
  };
  List.push(jsonParams);
}

   this.http.post<any>(GlobalConstants.createFormBuilder, List, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        if (res.status == 'Fail') {
          this.commonFunctions.alert("alert", res.description);
        } else {
          this.commonFunctions.navigateToPage("/dsp/augmentedConfig/");
        }
      });


//     let List = [];
//     List.push(jsonParams);


//     const jsonParams = {
//       tableName: this.informationservice.getAgGidSelectedNode(),
//       menuName: this.form.get('name')?.value,
//       userId: this.informationservice.getLogeduserId()
//     };
// console.log("jsonParams >>>>>>>>>>> ", jsonParams);

  }

}
