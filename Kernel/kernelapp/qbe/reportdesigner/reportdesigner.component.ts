import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { AddReportComponent } from './add-report/add-report.component';
import { data } from 'jquery';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { RunReportParametersComponent } from './run-report-parameters/run-report-parameters.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-reportdesigner',
  templateUrl: './reportdesigner.component.html',
  styleUrls: ['./reportdesigner.component.css']
})
export class ReportdesignerComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getReportsData=GlobalConstants.getReportsData;

  constructor(private http: HttpClient,
    private dialog: MatDialog,
    public commonFunctions: CommonFunctions,
    public informationservice: InformationService) { }

  ngOnInit(): void {


    this.agColumnsJson = [
      {
        headerName: 'Report Id',
        field: 'REPORT_ID',
        
      },
      {
        headerName: 'Report Name',
        field: 'REPORT_NAME',
      },
      {
        headerName: 'Creation Date',
        field: 'CREATION_DATE',
      }
    ];

    this.agColumns.push(this.agColumnsJson);
    // this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
    //   this.onAddClick();
    // });
    // this.subsVar = this.eventEmitterService.onUpdateClick.subscribe(() => {
    //   this.onUpdateClick();
    // });
    // this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {
    //   this.onDeleteClick();
    // });




  }

  onAddClick(){
    const dialogRef = this.dialog.open(AddReportComponent, {
      width: "500px",
      height: "300px",
      data: "add"
    });
    dialogRef.disableClose = true;
    
  }
  onUpdateClick(){
    const dialogRef = this.dialog.open(AddReportComponent, {
      width: "500px",
      height: "300px",
      data: "update"
    });
    dialogRef.disableClose = true;
    
  }
  onDeleteClick(){
    
    this.http.delete<any>(GlobalConstants.deleteReport+this.informationservice.getAgGidSelectedNode(),
      {headers: GlobalConstants.headers}).subscribe({
      next:(res) => {
        console.log(res);
        this.commonFunctions.alert("alert", "Deleted Successfully");
        this.commonFunctions.reloadPage('/qbe/reportDesigner');
      },
      error:(error) => {
        console.log(error);
      }
     } );
  }

  execution() {

    
    this.http.get<any>(GlobalConstants.checkParameters+this.informationservice.getAgGidSelectedNode()).subscribe(
      (res: any) => {
        if (res.length != 0) {
          const dialogRef = this.dialog.open(RunReportParametersComponent, {
            width: "500px",
            height: "300px",
            data: res
          });
          dialogRef.disableClose = true;
        } else {
          
          let url = GlobalConstants.executeReport;
          let urlParam=GlobalConstants.executeReportwithOneParam;
          let headerOptions = new HttpHeaders({
              'Content-Type': 'application/json',
              'Accept': 'application/pdf'
              
              //   'Accept': 'application/octet-stream', // for excel file
          });
          let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };
      
          let jsonParams = {
            columns: [{colName:"kycId",colVal:"18452"}]
          };
      
          
          this.http.post(url+this.informationservice.getAgGidSelectedNode(), jsonParams, requestOptions).pipe(map((data: any) => {
              let blob = new Blob([data], {
                  type: 'application/pdf' // must match the Accept type
                  // type: 'application/octet-stream' // for excel 
              });
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              // link.download = 'samplePDFFile.pdf';
              link.target = '_blank';
              link.click();
              window.URL.revokeObjectURL(link.href);
      
          })).subscribe((result: any) => {
          });



        }

      });











    
}
  
// execution2(){
 

//       // this.http.post(GlobalConstants.executeReport, {} ,  { headers: GlobalConstants.headers }).pipe(map((data: any) => {
//         // let blob = new Blob([data], {
//         //     type: 'application/pdf' // must match the Accept type
//         //     // type: 'application/octet-stream' // for excel 
//         // });
//         // var link = document.createElement('a');
//         // link.href = window.URL.createObjectURL(blob);
//         // // link.download = 'samplePDFFile.pdf';
//         // link.target = '_blank';
//         // link.click();
//         // window.URL.revokeObjectURL(link.href);

//       // })).subscribe((result: any) => {

//       //   console.log("result",result)

//       // });

      
    
//     }
  
} 
  



