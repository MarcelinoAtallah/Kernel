import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { ButtonRendererComponent } from '../buttonRenderer.component';
import { VVarGridLinkComponent } from '../v-var-grid-link.component';
import { VReportGenerationComponent } from '../v-report-generation/v-report-generation.component';

@Component({
  selector: 'v-dynamic-report',
  templateUrl: './v-dynamic-report.component.html',
  styleUrls: ['./v-dynamic-report.component.css']
})
export class VDynamicReportComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  public getDynReports  = GlobalConstants.getDynReports;
  frameworkComponents:any;


  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService, private dialog: MatDialog,
    //test2
    public informationservice: InformationService) {

      this.onRunButtonClickGenerate = this.onRunButtonClickGenerate.bind(this);

    this.onRunButtonClickReexecute = this.onRunButtonClickReexecute.bind(this);
    this.onRunVarGridLinkClick=this.onRunVarGridLinkClick.bind(this);
        this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      staticGridLink:VVarGridLinkComponent
    };

   }

  ngOnInit(): void {
    // + "\"link\" : \"/dsp/augmentedConfig/form/update/:objectId/-1/previewForm/\","
    // + "\"linkValue\" : \"" + menuId + "\", "
    // + "\"linkType\" : \"linkPopUp\"" + "}";
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Report Id',
        field: 'reportDynamicConfigId',
        hide:true
      },
      {
        headerName: 'Report',
        field: 'reportName',
        cellRenderer: 'staticGridLink',
        cellRendererParams: {
          onClick: this.onRunVarGridLinkClick.bind(this),
          label: 'Click 1',
        }
      },
      {
        headerName: 'Executed By',
        field: 'executedBy',
      },
      {
        headerName: 'Last Execution Data',
        field: 'executionDate',
      },
      {
        headerName: 'Report Generation',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClickGenerate.bind(this),
          label: 'Click 1'
        }
        
      },
      {
        headerName: 'Re-execute Report',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClickReexecute.bind(this),
          label: 'Click 1'
        }
        
      },

    ];

    this.agColumns.push(this.agColumnsJson);




  }

  onDeleteClick() {
      
  }  
  
  onAddClick(){
    
   }

   onRunButtonClickGenerate(e:any){

   }
   onRunButtonClickReexecute(e:any){
    alert(1);
   }

   onRunVarGridLinkClick(e:any){
    // this.query=this.myTextarea;
    // let info = {};
    //   info = {
    //     query: this.myTextarea,
    //     actionType: this.actionType,
    //     queryFlag:1
    //   };
    
    const dialogRef = this.dialog.open(VReportGenerationComponent, {
    //  data: info,
      width: '90%',
      height: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    }
   
}
