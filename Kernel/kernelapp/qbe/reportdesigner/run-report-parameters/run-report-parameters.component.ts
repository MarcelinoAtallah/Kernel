import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { NewbuttonComponent } from 'src/app/Kernel/kernelapp/in-display/form-builder/newbutton/newbutton.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-run-report-parameters',
  templateUrl: './run-report-parameters.component.html',
  styleUrls: ['./run-report-parameters.component.css']
})
export class RunReportParametersComponent implements OnInit {

  public showInput :boolean=false;
  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public lookupData: any,
    private dialogRef: MatDialogRef<NewbuttonComponent>,
    public commonFunctions: CommonFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public informationservice: InformationService) { }
    reportParameters:any[]=[];
    reportParameterForm = new FormGroup({});

  ngOnInit(): void {
    this.showInput=true;

  console.log("DATA>>>>>>>>",this.data);
    for(let i = 0; i < this.data.length; i++) {

      console.log("DATA "+i+" "+this.data[i].paramName);
      this.reportParameterForm.addControl(this.data[i].paramName, new FormControl(''));
     
      }

    this.reportParameters=this.data;
    console.log("REPORT PARAMETER FORM>>>>>>>>",this.reportParameterForm);
    this.showInput=true;
  }



  closeDialog(): void {
    this.dialogRef.close();
  }

execution(){
 let jsonarray:any[]=[];
  for(let i=0;i<this.reportParameters.length;i++){
    jsonarray.push({colName:this.reportParameters[i].paramName,colVal:this.reportParameterForm.get(this.reportParameters[i].paramName)?.value})
  }

  let urlParam=GlobalConstants.executeReportwithParameters;
  let headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
      
      //   'Accept': 'application/octet-stream', // for excel file
  });
  let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };

  let jsonParams = {
    columns: jsonarray
  };

this.closeDialog();
  
  this.http.post(urlParam+this.informationservice.getAgGidSelectedNode(), jsonParams, requestOptions).pipe(map((data: any) => {
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

}
