import { Component, EventEmitter, Inject, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CheckboxSelectionCallbackParams, ColDef, ColumnApi, GridApi, GridReadyEvent, IDateFilterParams, RowGroupingDisplayType, RowNode , GridOptions, CsvExportParams, GetContextMenuItemsParams, MenuItemDef, Column, GetDataPath} from 'ag-grid-community';
import { event, param } from 'jquery';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import * as XLSX from 'xlsx';
import { AnyLayer } from 'mapbox-gl';
import CircularJSON from 'circular-json';
import { DataService } from '../../Services/data.service';
import { GenderRenderer } from '../../Services/button-cell-renderer.component';

@Component({
  selector: 'app-v-ag-grid',
  templateUrl: './v-ag-grid.component.html',
  styleUrls: ['./v-ag-grid.component.css'],
 // providers: [  { provide: MAT_DIALOG_DATA, useValue: {} }]
})
@Injectable({
  providedIn: 'root'
})
export class VAgGridComponent implements OnInit {
   @Input() columnDefs: any[];
   @Input() rowData: any[];
   @Input() headerHeight: number;
   @Input() pagination: boolean;
   @Input() Title: String;
   @Input() distinct: boolean;
   @Input() rowGrouping: boolean;
   @Input() contextmenu: boolean;
   @Input() Grid2Type: String;
   @Input() GridID: String;
   @Input() treeData: boolean;

   @Output() selectedarrayemit: EventEmitter<any> = new EventEmitter<any>();
   @Output() sendData   = new EventEmitter();
   @Output() displayclusters2   = new EventEmitter();
   private gridApi!: GridApi;
   private columnApi: ColumnApi;
   // public gridColumnApi: any;
   public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
   public groupDisplayType: RowGroupingDisplayType = 'groupRows';
    Flag:boolean=false;
    showPopup=false;
    public rowSelection: 'single' | 'multiple' = 'multiple';
    selectedRows: any;
    multiselection : String[] = [];
    counter:any=[];
    message :any;
    private gridapi:any;
    private framerworkComponents:any;
    selected:boolean=false;
    arrayofdevices:any=[];
    arrayCoords:any[]=[];

isChecked: boolean = false;
total:any;
public groupRowRendererParams: any = {
  checkbox:true,
  checkboxSelection: true,
  rowSelection: 'multiple',
  groupSelectsChildren: true,
}
 json = {
  device: "",
  count: "",
}
public getDataPath: GetDataPath = (data: any) => {
  // return data.orgHierarchy;
  //console.log("data.orgHierarchy",data)
  return data.orgHierarchy[0].split('/');

};
public groupDefaultExpanded = -1;

  gridOptions: GridOptions;
  selectedarray:any[]=[];
  dataselected:any[]=[];
  constructor(private dataservice:DataService ) {
  }
  @ViewChild('popup') popup: any;
  ngOnInit(): void {

    //console.log('rowdata>>>',this.rowData);
    if(localStorage.getItem('multiselection')){
      this.multiselection=JSON.parse(localStorage.getItem('multiselection'));
    }
   

  }
  frameworkComponents = {
    btnCellRenderer: GenderRenderer,
  };
  getContextMenuItems(params: GetContextMenuItemsParams) {
    if (params.value != null) {
      //console.log("////////////////////////////////",params);
      let condColumndefs=params.column.getUserProvidedColDef().headerName;
      //console.log("//////////////////condColumndefs",condColumndefs);

if(condColumndefs=='date' || condColumndefs=='lat' || condColumndefs=='lng')
{  var result: (string | MenuItemDef)[] = [
    {
      // custom item
      name: 'Copy',
      action: () => {
        //console.log('params>>>', params);
        //console.log('params>>>', params.node.key);
        navigator.clipboard.writeText(params.value);
      },
      cssClasses: ['redFont', 'bold'],
    },
  ];}else if(condColumndefs=='Senario'){
    var result: (string | MenuItemDef)[] = [ {
      // custom item
      name: 'Add new Simulation',
      action: () => {
        //console.log('params>>>', params);
        let parentSenario = params.node.data.id;
        // this.dataservice.setDHselectedDevice(deviceselected);
        localStorage.setItem('parentSenario', parentSenario);
        $('#addnewSenario').click();
      },
      cssClasses: ['redFont', 'bold'],
    },
  ]
  }
  else{
    var result: (string | MenuItemDef)[] = [
      {
        // custom item
        name: 'Copy',
        action: () => {
          //console.log('params>>>', params);
          //console.log('params>>>', params.node.key);
          navigator.clipboard.writeText(params.value);
        },
        cssClasses: ['redFont', 'bold'],
      },
      'export',
    ];
  }
    } else {
      var result: (string | MenuItemDef)[] = [
        {
          // custom item
          name: 'DeviceHistory',
          action: () => {
            //console.log('params>>>', params);
            let deviceselected = params.node.key;
            // this.dataservice.setDHselectedDevice(deviceselected);
            localStorage.setItem('deviceselected', deviceselected);
            $('#RunDeviceHistory1').click();
          },
          cssClasses: ['redFont', 'bold'],
        },
        {
          // custom item
          name: 'Copy',
          action: () => {
            //console.log('params>>>', params);
            //console.log('params>>>', params.node.key);
            navigator.clipboard.writeText(params.node.key);
          },
          cssClasses: ['redFont', 'bold'],
        },
        { 
          name: 'Add To Group',
          action: () => {
            // //console.log('param1111111111111>>>', params);
            // //console.log('params.node11111111111111111111111111>>>', params.node);
            // let dev:any=params.node.key.toString();
            // let nbrhits:any=params.node.allChildrenCount;
            // //console.log('nbrhits>>>', nbrhits);
            // //console.log('dev>>>', dev);

            // localStorage.setItem('deviceselected', dev);
            // localStorage.setItem('nbhits', nbrhits);

            
            // $('#selectedarray').click();
            $('#devaddgroup').click();

          },
          cssClasses: ['redFont', 'bold'],
        }, 
        { 
          name: 'Active Group',
          action: () => {
            //console.log('params>>>', params);
            $('#openaddgrpscreen').click();
          },
          cssClasses: ['redFont', 'bold'],
        },
        {
          name: "Export Selected Row",
          action: () => {
            // Export data for the current row
            let rowData = params.node.data;
            //console.log("params::",params);
            //console.log("params.node::",params.node);
//console.log("params.node.allLeafChildren::",params.node.allLeafChildren);
            let allLeafChildren:any=params.node.allLeafChildren;
            allLeafChildren.forEach((elt:any)=>{
              //console.log("data:::::",elt.data);
            });
          //  allLeafChildren.exportDataAsExcel();
            const exportData = allLeafChildren.map((childNode:any) => childNode.data);
            //console.log("exportData:::::",exportData);

            const exportDataWithoutHitstel = exportData.map((item:any) => {
              // Destructure the item to get all properties except "Hits" and "Coord"
              const { Hits, Tel, ...rest } = item;
              //console.log("rest in selcted row",rest);
              const date = new Date(rest.Date);
              const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                year: 'numeric',
              };
              const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
              //console.log('formattedDate>>>>>>>>>>' , formattedDate);
           
              rest.Date=formattedDate;
              // Return a new object without "Hits" and "Coord"
              return rest;
            });
            
            //console.log("exportDataWithoutHitstel:::::", exportDataWithoutHitstel);
            

            // Convert data to XLSX format
            const worksheet = XLSX.utils.json_to_sheet(exportDataWithoutHitstel);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');
            // Save the workbook as an Excel file
            XLSX.writeFile(workbook, 'exported_data.xlsx');
          },
        },
        'export',
      ];
    }
    return result;
  }



  onSelectionChanged(event:any) {
    
    //if is distinct
    // let outputArray : String[]=[];
    // let uniqueMakes = new Set();

    if(this.distinct==true){
    //console.log("event>>>>",event.api.getRenderedNodes());
    let renderedNodes= event.api.getRenderedNodes()
    //console.log("getSelectedNodes()>>>>",event.api.getSelectedNodes());

    this.selectedarray=event.api.getSelectedNodes();
    this.sendDataToParent();
    


   
    const selectedRows = event.api.getSelectedRows();
    //console.log("selectedRows>>>>",selectedRows);
    // const deviceid = selectedRows[0].Device_id;
    // this.multiselection.push(deviceid);
    // //console.log("multiselection>>>>", this.multiselection);
    event.api.forEachNode((rowNode:any, index:any) => {
      let make = rowNode.selected;
      
      //console.log("rowNode>>>",rowNode.selected);
      
     

      if(make==true){
        //console.log("this is>>>",rowNode.key);
        const deviceid = rowNode.key;
    

        //console.log("multiselection>>>>333", this.multiselection);
        if(!this.multiselection.includes(deviceid)){
          // this.json.device=rowNode.key;
          // this.json.count=rowNode.allChildrenCount;
          // //console.log("json>>>>", this.json);
          // this.arrayofdevices.push(this.json);
          // //console.log("arrayofdevices>>>>", this.arrayofdevices);
          if(deviceid !=null){
            this.multiselection.push(deviceid);
          }
         
          //console.log("multiselection>>>>4444", this.multiselection);
          localStorage.setItem("multiselection", JSON.stringify(this.multiselection))

          const coordSelected=rowNode.allLeafChildren[0].data.Coord;
          let json={
            deviceid:deviceid,
            coordSelected:coordSelected
          }
          
          this.arrayCoords.push(json);
          localStorage.setItem("arrayCoords", JSON.stringify(this.arrayCoords))

        }
      }else{
        const deviceid = rowNode.key;
        const index = this.multiselection.indexOf(deviceid);
        //console.log("index>>>>", index);
      for(let i=0;i<this.arrayCoords.length;i++){
        const index2 = this.arrayCoords[i].deviceid.indexOf(deviceid);
        //console.log("index2>>>>", index2);
        if (index2 > -1) {
          this.arrayCoords.splice(index2, 1);
          //console.log("multiselection>>>>5555", this.multiselection);
          localStorage.setItem("multiselection", JSON.stringify(this.multiselection));
        }
      }
            
        
        if (index > -1) {
          this.multiselection.splice(index, 1);
          //console.log("multiselection>>>>5555", this.multiselection);
          localStorage.setItem("multiselection", JSON.stringify(this.multiselection));
        }
      }
    });
    }else{
      event.api.forEachNode((rowNode:any, index:any) => {
        let make = rowNode.selected;
        if(make==true){

          if(this.treeData==true){
            const simulid = rowNode.data.id;
            //console.log("simulid>>",simulid);
            this.displayclusters2.emit(simulid);

          }else{
            const deviceid = rowNode.data.Device_id;
            //console.log("rowNode>>",rowNode);
  
            //console.log("this is deviceid>>>",deviceid);
    // this.json.device=rowNode.key;
    // this.json.count=rowNode.allChildrenCount;
            if(!this.multiselection.includes(deviceid)){
              this.multiselection.push(deviceid);
              //console.log("multiselection>>>>66666", this.multiselection);
     }
          }

        }
      });
    }
 }  
onFirstDataRendered(params:any): void {
 if(!localStorage.getItem("multiselection")){
  params.api.sizeColumnsToFit();
 }else{
  let devices=JSON.parse(localStorage.getItem("multiselection"));
  //devices.forEach((device:any) => {
    params.api.forEachNode((rowNode:any, index:any) => {
      rowNode.setSelected(devices.includes(rowNode.key))
    });
  //});
 }
// If you want to resize all columns
params.columnApi.autoSizeAllColumns();
}
defaultColDef = {
  resizable: true,
  filter: true,
  flex: 1,
  sortable:true

};

autoGroupColumnDef = {
  // enabled sorting on Row Group Columns only 
  sortable: true,      
  headerName: 'Organisational Hierarchy',
  cellRendererParams: {
    innerRenderer: 'group',
    suppressCount: true,
  },
  
};
//  rowData = [
//     { Device_id: 'Toyota', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota2', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota3', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota5', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
//     { Device_id: 'Toyota', Tel: 35000 ,Date: 'Porsche',Hits: 'Porsche'},
// ];
openpopup() {
  //console.log('rowdata>>>',this.rowData)
  //console.log('Grid2Type>>>',this.Grid2Type)
 $('#'+this.Grid2Type).click();
}
selectShapes(params:any){
if(this.distinct=== true){
    // this.Flag=true;
    //alert(2);
    let outputArray : String[]=[];
    let uniqueMakes = new Set();
    params.api.sizeColumnsToFit();
    params.api.forEachNode((rowNode:any, index:any) => {
      //console.log('node ' + rowNode.data.Device_id + ' is in the grid');
      let make = rowNode.data.Device_id;
      if (!uniqueMakes.has(make)) {
        outputArray.push(rowNode.data);
        uniqueMakes.add(make);
      }
  });
  params.api.setRowData(outputArray);
  }
}
onGroupRowClicked(event: any) {
}
onGridReady(params: GridReadyEvent) {
 
  this.gridApi = params.api;
  this.columnApi = params.columnApi;
  //console.log("params.api.getDisplayedRowCount():::::",params.api.getDisplayedRowCount());
  this.total=params.api.getDisplayedRowCount();
  // this.gridApi.deselectAll();
  this.gridApi.addEventListener('rowGroupOpened', function (event:any) {
    // Check if the row group is related to the "Device_id" column
 
      //console.log('111111111111111111111111111111111111', event);
  
  });
}
handleCheckboxChange(event: any) {
  this.isChecked = event.target.checked;

  // if (this.isChecked) {
 
  //   //console.log('Checkbox is checked');
  //   this.gridApi.selectAll();
  // } else {
  //   // Checkbox is unchecked
  //   //console.log('Checkbox is unchecked');
  //   this.gridApi.deselectAll();
  //   this.multiselection=[];
  // }


  if(this.isChecked){
    this.gridApi.selectAll();

    this.gridApi.forEachNode((rowNode:any) => {

      //console.log('rowNode>>>>',rowNode)

  
      const deviceid = rowNode.key;
      //console.log("multiselection>>>>", this.multiselection);
      if(!this.multiselection.includes(deviceid)){
        // this.json.device=rowNode.key;
        // this.json.count=rowNode.allChildrenCount;
        // //console.log("json>>>>", this.json);
        // this.arrayofdevices.push(this.json);
        // //console.log("arrayofdevices>>>>", this.arrayofdevices);
        if(deviceid !=null){
          this.multiselection.push(deviceid);
        }
       
        //console.log("multiselection>>>>4444", this.multiselection);
        localStorage.setItem("multiselection", JSON.stringify(this.multiselection))
      }
    });
  }else{

    this.gridApi.deselectAll();
    this.gridApi.forEachNode((rowNode:any) => {

  
      //console.log('rowNode>>>>',rowNode)

      const deviceid = rowNode.key;
    const index = this.multiselection.indexOf(deviceid);
    if (index > -1) {
      this.multiselection.splice(index, 1);
      //console.log("multiselection>>>>5555", this.multiselection);
      localStorage.setItem("multiselection", JSON.stringify(this.multiselection));
    }

  });

  }


}
sendDataToParent(){

this.selectedarray.forEach((elt:any)=>{
  //console.log("elt-------------",elt);
this.dataselected.push(elt);
});
this.dataservice.setDHselectedDevice(this.dataselected);
  //console.log("dataaaaaaaaaaa--------------",this.dataselected);
  this.selectedarrayemit.emit(this.selectedarray);
}


}



