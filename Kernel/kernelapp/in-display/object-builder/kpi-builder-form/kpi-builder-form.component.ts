import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/Kernel/services/data.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-kpi-builder-form',
  templateUrl: './kpi-builder-form.component.html',
  styleUrls: ['./kpi-builder-form.component.css']
})
export class KpiBuilderFormComponent implements OnInit {
  public actionType: string = 'add';
  public kpiId: any;
  public isUpdate: boolean = false;
  public kpiData: any[] = [];
  public itemsData: any[] = [];
  public showGrid: boolean ;
  public showChart: boolean ;

  public getQueryName = GlobalConstants.getQueryNameApi;
  public getAllGridforDropdown = GlobalConstants.getAllGridforDropdown;
  public getAllChartforDropdown = GlobalConstants.getAllChartforDropdown;

  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    private dataservice: DataService,
    public informationservice: InformationService) { }
  kpiForm = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),
    grid: new FormControl(''),
    chart: new FormControl(''),
    report: new FormControl(''),
    isRatio: new FormControl(''),
    isPercentage: new FormControl(''),
    dropdownChart:new FormControl(''),
    dropdownGrid:new FormControl(''),

  });

  ngOnInit(): void {
    this.actionType = this.dataservice.getactionType();
    if (this.actionType == 'update') {
      this.kpiId = this.informationservice.getAgGidSelectedNode();
      this.isUpdate = true;
      this.http.get<any>(GlobalConstants.selectKpiApi + this.kpiId, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
          } else {
            let chart;
            if (res[0].chart == 1) {
              chart = true;
              this.showChart = true;
            } else {
              chart = false;
              this.showChart = false;
            }
            let isRatio;
            if (res[0].isRatio == 1) {
              isRatio = true;
            } else {
              isRatio = false;
            }
            let grid;
            if (res[0].grid == 1) {
              grid = true;
              this.showGrid = true;
            } else {
              grid = false;
              this.showGrid = false;
            }
            let report;
            if (res[0].report == 1) {
              report = true;
            } else {
              report = false;
            }

            let isPercentage;
            if (res[0].isPercentage == "true") {
              isPercentage = true;
            } else {
              isPercentage = false;
            }
            this.kpiForm.get("title").setValue(res[0].kpiName);
            this.kpiForm.get("isRatio").setValue(isRatio);
            this.kpiForm.get("query").setValue(res[0].qbeId);
            this.kpiForm.get("chart").setValue(chart);
            this.kpiForm.get("grid").setValue(grid);
            this.kpiForm.get("report").setValue(report);
            this.kpiForm.get("isPercentage").setValue(isPercentage);
            for (let i = 0; i < this.kpiData.length; i++) {
              setTimeout(() => {
                this.itemsData[this.kpiData[i].index] = { id: this.kpiData[i].id, type: this.kpiData[i].type, value: this.kpiData[i].value, mode: this.kpiData[i].mode, formData: this.kpiData[i].formData };
              }, 1000);
            }
          }
        });


    }

  }
  showdropdownChart(){
    if(this.kpiForm.get("chart").value == false){
      this.showChart = true;
     }else{
      this.showChart = false;
     }
  }
  showdropdownGrid(){
    if(this.kpiForm.get("grid").value == false){
      this.showGrid = true;
     }else{
      this.showGrid = false;
     }
  }


  submit() {
    let toggleIsRatioValue;
    let toggleChartValue;
    let toggleGridValue;
    let toggleReportValue;
    let gridDropdownValue;
    let chartDropdownValue;
    if (this.kpiForm.get("isRatio").value == true) {
      toggleIsRatioValue = 1;
    } else {
      toggleIsRatioValue = 0;
    }
    if (this.kpiForm.get("chart").value == true) {
      toggleChartValue = 1;
    } else {
      toggleChartValue = 0;
    }
    if (this.kpiForm.get("grid").value == true) {
      toggleGridValue = 1;
    } else {
      toggleGridValue = 0;
    }
    if (this.kpiForm.get("report").value == true) {
      toggleReportValue = 1;
    } else {
      toggleReportValue = 0;
    }

   if (this.kpiForm.get("dropdownGrid").value == ""){
    gridDropdownValue=null;
   }else{
    gridDropdownValue=this.kpiForm.get("dropdownGrid").value.join(',');
   }

   if (this.kpiForm.get("dropdownChart").value == ""){
    chartDropdownValue=null;
   }else{
    chartDropdownValue=this.kpiForm.get("dropdownChart").value.join(',');
   }
    
    if (this.actionType == 'update') {
      let allData = {
        kpiId: this.kpiId,
        kpiName: this.kpiForm.get("title").value,
        qbeId: localStorage.getItem("agGidSelectedLookup_(query)_id"),
        isRatio: toggleIsRatioValue,
        isPercentage: this.kpiForm.get("isPercentage").value,
        chart: toggleChartValue,
        grid: toggleGridValue,
        report: toggleReportValue,
        userId: this.informationservice.getLogeduserId(),
        dropdownGrid : gridDropdownValue,
        dropdownChart : chartDropdownValue
      }
      this.http.post<any>(GlobalConstants.updateKpiApi, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.commonFunctions.reloadPage("/dsp/kpiBuilder");
          this.commonFunctions.navigateToPage("/dsp/kpiBuilder");
        })

    } else {
      let allData = {
        kpiName: this.kpiForm.get("title").value,
        qbeId: localStorage.getItem("agGidSelectedLookup_(query)_id"),
        isRatio: toggleIsRatioValue,
        isPercentage: this.kpiForm.get("isPercentage").value,
        chart: toggleChartValue,
        grid: toggleGridValue,
        report: toggleReportValue,
        userId: this.informationservice.getLogeduserId(),
        dropdownGrid : gridDropdownValue,
        dropdownChart : chartDropdownValue
      }
      this.http.post<any>(GlobalConstants.addKpiApi, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.commonFunctions.reloadPage("/dsp/kpiBuilder");
          this.commonFunctions.navigateToPage("/dsp/kpiBuilder");
        })
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
