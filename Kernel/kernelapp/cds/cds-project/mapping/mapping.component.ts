import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
declare let alertify: any;

@Component({
  selector: 'mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class Mapping  {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public content: any;
  public agGridSelectedNodes: any = '';
  public comboDatasource = [{}];

  // Update Form Variables
  public getMappingApi: any = GlobalConstants.fetchMappingApi;

  @ViewChild('addContent') addContent: any;
  @ViewChild('updateContent') updateContent: any;

  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    this.agColumnsJson = [
      { headerName: '', field: '', checkboxSelection: true,  headerCheckboxSelection: true },
      { headerName: 'Map Id', field: 'id', filter: 'agTextColumnFilter', sortable: true },
      { headerName: 'Mapping Name', field: 'mapName',isLink: true,link: '/cds/mappingProject/form/update/',linkParameters: 'id', filter: 'agTextColumnFilter', sortable: true },
      { headerName: 'Project Name', field: 'projectName', filter: 'agTextColumnFilter', sortable: true },
      { headerName: 'Type', field: 'flowType', filter: 'agTextColumnFilter', sortable: true },
      { headerName: 'Design', field: '', filter: 'agTextColumnFilter', sortable: true },
      { headerName: 'Simulation', field: '', filter: 'agTextColumnFilter', sortable: true },
      { headerName: 'Bulk Data', field: 'isBulkLoadingApplied', filter: 'agTextColumnFilter', isCheckBox: true,
      isCheckBoxDisabled: true },
      { headerName: 'Truncate', field: 'isDataAppended', filter: 'agTextColumnFilter', isCheckBox: true,
      isCheckBoxDisabled: true }
    ];
    this.agColumns.push(this.agColumnsJson);

    // Handling add / update / delete functions that will be linked to the AMD buttons inside the v-grid
    this.eventEmitterService.onAddClick.subscribe(() => {
      this.commonFunctions.navigateToPage("cds/mappingProject/form/create/-1");
    });
    this.eventEmitterService.onUpdateClick.subscribe(() => {
      this.agGridSelectedNodes = localStorage.getItem('agGidSelectedNode');
      if(this.agGridSelectedNodes == '') {
        this.commonFunctions.alert("alert", "Please select a row");
      } else {
         this.commonFunctions.navigateToPage('cds/mappingProject/form/update/'+this.agGridSelectedNodes);
      }
    });
    this.eventEmitterService.onDeleteClick.subscribe(() => {
        this.onDeleteClick();
    });
  }
   // Dynamic Delete Function that will always take into consideration the ID as parameter
  // Capability to delete multiple rows as well
  onDeleteClick() {
    this.agGridSelectedNodes = localStorage.getItem('agGidSelectedNode');
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", "Please select a row to delete");
    } else {
      selectedNodes = selectedNodes.split(',');
      for (let i = 0; i < selectedNodes.length; i++) {
        //console.log(" selectedNodes[i]", selectedNodes[i])
        this.http.delete<any>(GlobalConstants.deleteUSMUserApi + selectedNodes[i], {headers: GlobalConstants.headers}).subscribe(
          (res) => {
            //console.log(res);
          },
          (error) => {
            //console.log(error);
          }
        );
      }
    }
    this.commonFunctions.reloadPage('/cds/mapping');
  }

}
