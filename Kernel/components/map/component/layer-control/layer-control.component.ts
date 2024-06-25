import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter, Output ,Input
} from '@angular/core';

@Component({
  selector: 'app-layer-control',
  templateUrl: './layer-control.component.html',
  styleUrls: ['./layer-control.component.css']
})
export class LayerControlComponent implements OnInit {
  @Output() tooltipChange = new EventEmitter<boolean>();
  @Output() datetooltipChange = new EventEmitter<boolean>();
  @Output() activityDensityChange = new EventEmitter<boolean>();
  @Output() activityHotspotChange = new EventEmitter<boolean>();
  @Output() areaDemographicsChange = new EventEmitter<boolean>();
  @Output() sectorchange = new EventEmitter<boolean>();
  @Output() sectorTechnologychange = new EventEmitter<{event:any;technology:any}>();
  @Output() filterData2change = new EventEmitter<boolean>();
  @Output() sectorCellIdchange = new EventEmitter<{event:any;cdrType:any}>();
  @Output() Routechange = new EventEmitter<boolean>();
  @Output() RouteDevice = new EventEmitter<boolean>();

  // @Output() deviceClustersChange = new EventEmitter<{ event: any; name: any }>();
  @Output() deviceClustersChange = new EventEmitter<{ event: any; name: any; checkedCount: number; namearray: any[] }>();
  @Input() Names: any[] = [];
  @Input() routes: any[] = [];
  @Input() display: boolean=false;
  @Input() displayclusters: boolean=false;
  @Input() displaysectors: boolean=false;
  @Input() displayRoute: boolean=false;

  loadedNames: any[] = [];
batchSize = 15;
currentBatch = 0;
searchQuery: string = '';
popupOpen:boolean=false;
isChecked:boolean=false;
dataTable: { layer_control: string; }[] = [];
filters:any[]=[];
routing:boolean=false;
@ViewChild('showMeasure2', { static: false }) showMeasure2!: ElementRef;
/* lazy */

  public namesdata = this.dataTable;
  
  // private dataTableInstance: DataTable;

  constructor() { }
  
  ngOnInit(): void {
 
    //console.log("routes:::;;",this.routes);
    //console.log("displayclusters:::;;",this.displayclusters);
    //console.log("displaysectors:::;;",this.displaysectors);
 
  this.loadedNames=[];
  // this.dataTable=[];

  // this.namesdata=[];

   //console.log("namessssssss:",this.Names);
   this.loadedNames=[];
    for (let i = 0; i < this.Names.length; i++) {
      // const randomIndex = Math.floor(Math.random() * this.Names.length);
      const randomWord = this.Names[i];

      this.dataTable.push({
        layer_control: randomWord,
      });
    }
    //console.log("dataTable:::;;",this.dataTable);
    this.loadedNamesf();

   
  }



  /* lazy */
  loadedNamesf() {
 
    const startIndex = this.currentBatch * this.batchSize;
    const endIndex = startIndex + this.batchSize;
    const newNames = this.namesdata
    .slice(startIndex, endIndex)
    .filter(newName => !this.loadedNames.some(loadedName => loadedName.layer_control === newName.layer_control));

  this.loadedNames = [...this.loadedNames, ...newNames];
  // if(this.Names.length>15){
    this.currentBatch++;
  // }
  
  }

  performSearch() {
    // Clear any previous search results or selections
    this.loadedNames = [];
    this.currentBatch = 0;
  
    // Perform the search on the entire 'books' array
    const filteredNames = this.namesdata.filter(name => name.layer_control.toLowerCase().includes(this.searchQuery.toLowerCase()));
  
    // Slice the filtered results to load and display
    const startIndex = this.currentBatch * this.batchSize;
    const endIndex = startIndex + this.batchSize;
    this.loadedNames = filteredNames.slice(startIndex, endIndex);
  
    if(this.Names.length>15){
      this.currentBatch++;
    }
    
  }

  onScroll() {
    const element = document.getElementById('LazyLoad');
    if (element && element.scrollTop + element.clientHeight >= element.scrollHeight - 50) {
      this.loadedNamesf();
    }
  }

  /* lazy */
  onTooltipChange(event: any) {
    this.tooltipChange.emit(event.target.checked);
  }

  onActivityDensityChange(event: any) {
    this.activityDensityChange.emit(event.target.checked);
  }

  onActivityHotspotChange(event: any) {
    this.activityHotspotChange.emit(event.target.checked);
  }

  onAreaDemographicsChange(event: any) {
    this.areaDemographicsChange.emit(event.target.checked);
  }
  onSectorchange(event: any) {
    this.sectorchange.emit(event.target.checked);
  }

  onSectorTechnologychange(event: any,technology:any) {
    this.sectorTechnologychange.emit({event,technology});
  }
  
  
  ondeviceClustersChange(event:any,name:any) {
    this.isChecked = event.target.checked;
    //console.log("eventt:????????/",this.isChecked);

    //console.log("eventt:",event,",,,,,,,,,,,name:",name);
    // this.deviceClustersChange.emit({ event,name });
    this.countCheckedCheckboxes();
    let { checkedCount, namearray } = this.countCheckedCheckboxes();
    this.deviceClustersChange.emit({ event, name, checkedCount, namearray });
    // if(this.displayRoute===true){
    //   this.RouteDevice.emit(event);
    // }
 

  }

  onDateTooltipChange(event: any) {
 
    this.datetooltipChange.emit(event.target.checked);
  }
  onCellIdchange(event: any,cdrType:any) {
    this.sectorCellIdchange.emit({event,cdrType});
  }


  countCheckedCheckboxes() {
    let checkedCount = 0;
    let namearray=[];

    for (const name of this.loadedNames) {
      const checkbox = document.getElementById(name.layer_control) as HTMLInputElement;

      if (checkbox && checkbox.checked) {
        checkedCount++;
        namearray.push(name)
      }
    }

   return {checkedCount,namearray};
  }
  onRoutechange(event:any){
      
      this.Routechange.emit(event);

  }
  onRoutedevice(event:any){
    //console.log("eventt:????????/",event);
    //console.log("idddd:????????/",event.target.id);
    let device=event.target.id;
    this.RouteDevice.emit(event);
  }
}
