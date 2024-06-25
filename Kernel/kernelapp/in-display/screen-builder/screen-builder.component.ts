import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-screen-builder',
  templateUrl: './screen-builder.component.html',
  styleUrls: ['./screen-builder.component.css']
})
export class ScreenBuilderComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getAllScreens  = GlobalConstants.getAllScreens;
  public showPopup: boolean = false;
  public agGridSelectedNodes: any = '';
  public action:any;
  subsVar: Subscription;
  frameworkComponents:any;
  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService, private dialog: MatDialog,
    public informationservice: InformationService) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Id',
        field: 'ID',
        width: '25px',
      },
      {
        headerName: 'Application',
        field: 'Application',
      },
      {
        headerName: 'Parent Menu',
        field: 'PARENT_MENU',
                
      },
      
      {
        headerName: 'Screen Name',
        field: 'SCREEN_NAME',
      },
      {
        headerName: 'State',
        field: 'STATE',
     
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
  ngOnDestroy() {
    if (this.subsVar) {
       this.subsVar.unsubscribe()
     }
  }
onAddClick(){
  this.commonFunctions.navigateToPage(
    "/dsp/augmentedConfigScratch/form/create/-1");

}

onUpdateClick(){
  console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ")
  if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode()==""){

  }else{
    
        this.showPopup = false;
        this.commonFunctions.navigateToPage(
          "/dsp/augmentedConfigScratch/form/update/"+this.informationservice.getAgGidSelectedNode());
    }
  
    }
 
    

    onDeleteClick() {
      
      this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
      let selectedNodes = this.agGridSelectedNodes;
      if (selectedNodes.length == 0) {
        this.commonFunctions.alert("alert", 'Please select a row to delete');
      } else {
        if(selectedNodes.indexOf(",") != -1) {
        selectedNodes = selectedNodes.split(',');
        
            console.log(" selectedNodes ALL", selectedNodes);
  
        for (let i = 0; i < selectedNodes.length; i++) {
          console.log(" selectedNodes[i]", selectedNodes[i]);
          this.http.delete<any>(GlobalConstants.deleteScreen + selectedNodes[i],
            {headers: GlobalConstants.headers}).subscribe({
            next:(res) => {
              console.log(res);
              this.commonFunctions.reloadPage('/dsp/augmentedConfigScratch');
  
            },
            error:(error) => {
              console.log(error);
            }
           } );
        }
      } else {
        this.http.delete<any>(GlobalConstants.deleteScreen + selectedNodes,
          {headers: GlobalConstants.headers}).subscribe({
          next:(res) => {
            console.log(res);
            this.commonFunctions.reloadPage('/dsp/augmentedConfigScratch');
          },
         error:(error) => {
            console.log(error);
          }
      });
      }
    }
  }  

}


