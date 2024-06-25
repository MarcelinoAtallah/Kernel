import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { ButtonRenderComponent } from './button-render.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public content: any;
  public agGridSelectedNodes: any = '';
  public comboDatasource = [{}];
  // subsVar: Subscription;
  public inDisplayGrid = GlobalConstants.fetchInDispMappingApi;
  frameworkComponents:any;

  userForm = new FormGroup({
    FormName: new FormControl('')
  });

  // Update Form Variables
  @ViewChild('addContent') addContent: any;
  @ViewChild('updateContent') updateContent: any;

  constructor(
    private http: HttpClient,
    public commonFunctions: CommonFunctions,
    public informationservice: InformationService
    // private eventEmitterService: EventEmitterService,
  ) {
    this.onBtnClick = this.onBtnClick.bind(this);

    this.frameworkComponents = {
      buttonRender: ButtonRenderComponent,
    };
  }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        maxWidth: '50',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Menu Name',
        field: 'menuName',
        filter: 'agTextColumnFilter',
        sortable: true,
        isLink: true,
        defaultMinWidth: '180',
        maxWidth: '300',
        resizable: true,
        linkType:'field',
        link: "/dsp/augmentedConfig/form/update/",
        linkParameters: "objectId"
      },
      {
        headerName: 'Sequence Id',
        field: 'objectId',
        defaultMinWidth: '180',
        maxWidth: '300',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Preview',
        field: '',
        cellRenderer: 'buttonRender',
        cellRendererParams: {
          onClick: this.onBtnClick.bind(this),
          label: 'Click 1'
        }
        
      },
    ]
    this.agColumns.push(this.agColumnsJson);


    // this.subsVar = this.eventEmitterService.onAddClick.subscribe(() => {
    //   this.commonFunctions.navigateToPage("/dsp/augmentedConfig/form/create/-1/-1/formBuilder");
    //   this.inDisplayGrid = GlobalConstants.fetchInDispMappingApi;
    // });

    // this.subsVar = this.eventEmitterService.onDeleteClick.subscribe(() => {
    //   this.onDeleteClick();
    // });

  }

  onBtnClick(){
    setTimeout(() => {
      let objId: number;
      
      let objectIds = this.informationservice.getAgGidSelectedNode();   
      if(objectIds.indexOf(",") != -1) {
        objId = Number(objectIds.split(",")[0]);
      } else {
        objId = Number(objectIds);
      }
      this.commonFunctions.navigateToPage("/dsp/augmentedConfig/form/update/" + objId + "/-1/previewForm/");
    }, 1);
  }

  onGridAdd() {
    this.commonFunctions.navigateToPage("/dsp/augmentedConfig/form/create/-1/-1/formBuilder");
    this.inDisplayGrid = GlobalConstants.fetchInDispMappingApi;

    //this.commonFunctions.alert("Done", "success", 6000);
  }

  onGridDelete() {
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      this.commonFunctions.alert("alert", 'Please select a row to delete');
    } else {
      if(selectedNodes.indexOf(",") != -1) {
      selectedNodes = selectedNodes.split(',');
      for (let i = 0; i < selectedNodes.length; i++) {
        this.http.delete<any>(GlobalConstants.deleteFormBuilderApi + selectedNodes[i],
          {headers: GlobalConstants.headers}).subscribe({
          next:(res) => {
            this.commonFunctions.alert("alert", 'Deleted Successfully');
            this.commonFunctions.reloadPage('/dsp/augmentedConfig');
          },
          error:(error) => {
            console.log(error);
          }
         } );
      }
    } else {
      this.http.delete<any>(GlobalConstants.deleteFormBuilderApi + selectedNodes,
        {headers: GlobalConstants.headers}).subscribe({
        next:(res) => {
          this.commonFunctions.alert("alert", 'Deleted Successfully');
          this.commonFunctions.reloadPage('/dsp/augmentedConfig');
        },
       error:(error) => {
          console.log(error);
        }
    });
    }
  }
}
}
