//<!-- Author : Zaher Najib -->
import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  Renderer2,
  Injectable,
  Input,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

import { AgGridModule } from "ag-grid-angular";
import { PopupComponent } from "../component/popup/popup.component";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet-measure";
import "leaflet-measure-path";
import "leaflet-mouse-position";

import "leaflet-draw";
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { empty, from, interval, lastValueFrom, Observable, of, Subscriber, Subscription, switchMap } from "rxjs";
import "leaflet-draw/dist/leaflet.draw.css";
import $ from "jquery";
import { ActivatedRoute } from "@angular/router";
import * as turf from "@turf/turf";
import { VAgGridComponent } from "../component/v-ag-grid/v-ag-grid.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import 'leaflet-fullscreen/dist/Leaflet.fullscreen';
import "leaflet-measure";
import { VAlertComponent } from "../component/v-alert/v-alert.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import e from "cors";
import 'leaflet.heat';
import 'jquery-ui';
import 'jqueryui';
import mapboxgl, { AnyLayer } from "mapbox-gl";
import { DatePickerComponent } from "../component/datepicker/datepicker.component";
import { NotificationComponent } from "../component/notification/notification.component";
import 'leaflet-routing-machine';
import Swal from "sweetalert2";
// import 'leaflet-arc';
import 'leaflet-arc';
import { ICellRendererParams } from "ag-grid-community";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { VTableComponent } from "../component/v-table/v-table.component";
import { MatMenuTrigger } from '@angular/material/menu';
import { Icon } from "leaflet";
import { GlobalConstants } from "src/app/Kernel/common/GlobalConstants";
import { AgGridJson } from "../Interface/ag-grid-json";
import { DatePipe } from "@angular/common";
import { ContentmodalComponent } from "../../contentmodal/contentmodal.component";
import { Queryjson } from "../Interface/queryjson";
import { ShapesArray } from "../Interface/shapes-array";
import { LoaderService } from "../Services/loader.service";
import { WorkerService } from "../Services/worker.service";
import { SaveshapeModalComponent } from "../component/saveshape-modal/saveshape-modal.component";
import { ChatService, Message } from "../Services/chat.service";
import { Coords } from "../Interface/coords";
import { DatacrowdService } from "../Services/datacrowd.service";
import { DataService } from "../Services/data.service";
import 'leaflet.markercluster';

declare let alertify: any;

class BTSObject {
  ids: any;
  sqlcond: String;

  constructor(ids: any, sqlcond: String) {
    this.ids = ids;
    this.sqlcond = sqlcond;
  }
}


@Injectable({
  providedIn: 'root'
})
@Component({
  selector: "map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  @ViewChild(VAgGridComponent) agGrid: VAgGridComponent;
  @ViewChild('childRef', { static: false }) childComponent: VTableComponent;
  @ViewChild('RCsearch') RCsearch: any;
  @ViewChild(MatMenuTrigger)contextMenu: MatMenuTrigger;
  @ViewChild('prompt') prompt: any;
  // @Output() senarioIdOutput:any= new EventEmitter<any>();
  @Input() changes:any;
  navbarSimulId:any;
  selectedId: any;
  BTSObject: any ;
  map: any;
  map2: L.Map;
  locationName: any;
  jsonDataResult: any;
  private currentMapType = "roadmap";
  reportName: any;
  reportType: any;
  reportTypeId: any;
  TimeZone: any;
  RecipientUser: any;
  DateTimeFrom: any;
  RecipientEmail: any;
  DateTimeTo: any;
  Devices: any;
  isCSVAttached: any;
  dataType: any;
  telephoneNumber: any;
  coords: any;
  database: any;
  reportJsonParamId: any;
  fixedElementMarker: any;
  fixedElementMarkerLoop: any;
  usercode: any;
  private circle: L.Circle;
  private rectangle: L.Rectangle;
  private polyline: L.Polyline;
  private polygon: L.Polygon;
  private sector: any;
  private sectorLoop: any;
  private sectorId: number = 0;
  private marker: L.MarkerClusterGroup;
  private markerLoop: L.MarkerClusterGroup;
  private markerclusterControl: any = L.MarkerClusterGroup;
  private fixedMarkersGroup: L.MarkerClusterGroup;
  private fixedMarkersGroupLoop: L.MarkerClusterGroup;
  private sectorCluster: L.MarkerClusterGroup;

  private markers: L.Marker;
  layerControl: L.Control;
  tileLayer: L.TileLayer;
  semiCircle: L.Path; // Manually declare semiCircle as L.Path


  heat: any;
  modalRef: any
  ipAddress: any = GlobalConstants.ipAddress;
  fixedMarkersArray: string[] = [];
  fixedMarkersArrayLoop: string[] = [];
  objAoi: { [key: string]: any }[] = [];
  private datajson: any;
  isRunning: boolean = false;
 // isFormVisible = true;
  indexTimeline: number = 0;
  startTime: Date;
  selectedTime: number = 0;
  ShowTimeline: boolean = false;
  Timecoverted: any;
  speedTime: any = 1;
  interval: any;
  startDateControl: any = new FormControl();
  nameFormControl: any = new FormControl();
  typeFormControl: any = new FormControl();
  private routedatajson: any;

  isSelectMode = false;
  myMarker: any;
  allMarkers: any[]=[];
  myMarker2: any;
  graphtools: any;
  moretools: any;
  layerGroup: L.LayerGroup = L.layerGroup(); 
  layerGroupLoop: L.LayerGroup = L.layerGroup(); 
  elementCount: any;
  isTcd: boolean = false;
  findedObject: any;
  shapesDataArray: Array<any> = [];
  showDrawingTools: boolean = false;
  deletingModeEnabled: boolean = false;
  datingModeEnabled: boolean = false;
  MeasurementEnabled: boolean = false;

  isFixedElementsall: any;
  controlLayers: any;
  singledeviceMarkersClusters: L.MarkerClusterGroup;
  deviceMarkersClusters: any;
  clickedShapeID: any;
  drawingEnabled: boolean = false;
  finisheddrawing: boolean = false;
  ControlArray: any[] = [];
  // squareLimit = 0.00004;
  // toFixedValue = 5;
  // standard = 0.00002;
  // circleLimit = 400;
  // polygoneLimit = 100000;
  // globalCoord:["33.96346","35.41809"];

  squareLimit: any;
  toFixedValue: any;
  standard: any;
  circleLimit: any;
  polygoneLimit: any;
  globalCoord: any;
  zoom: any;
  deletedLimit: any;
  multiselection: any;
  simulationid: any;
  urlCassandraServer: string = this.ipAddress;
  meter: any;
  EDGEHEIGHT: any;
  showtools: boolean = true;
  showControls: boolean = false;
  shapeId = 0;
  clickZoom = 15;
  thisshape: any;
  isNotRoute: any;
  AoiIds: any;
  saveCheckbox: boolean = false;
  A_locSimulId: any;
  A_ISCase: any;
  ImsiID: any;
  tooltipInstance: any;
  tooltipInstanceArray: any[] = [];
  selectedTypess: any;
  showPopup = false;
  aggridjson: AgGridJson;
  maptypes: any;
  isSimul: boolean = false;
  isFixedElements: boolean = false;
  isBTS: boolean = false;
  isBtsall: boolean = false;
  isSqlCond:String;
  isAOi: boolean = false;
  ObjectID: any;
  ExecutionParam: any;
  fixedElementIds: any;
  Aoiresp: any;
  shapeName: any;
  tooltipName: any = "";
  deletStatus: boolean = false;
  oldTilelayer: any;
  cRdaius: any;
  markersArray: Array<any> = [];
  markersArray2: Array<any> = [];
  overlayMaps: any;
  LastSimualtionID: any;
  map3d: any;
  selectedStartDate: any;
  selectedEndDate: any;
  popup2: any;
  drawPlugin: any;
  pageSize = 10000; // Number of markers to load per page
  pageNumber = 0;
  display: boolean = false;
  uniqueNames: any[] = [];
  _maxNativeZoom = 19;
  _maxZoom = 25;
  chunkSize = 1000;
  clusters2: any[] = [];
  clusterFeatures2: any[] = [];
  markerControlArray: any[] = [];


  beginOperation: any;
  endOperation: any;
  deviceIdArr: any;
  reportId: any;
  AOIsimulId: any;
  AOICountArr: any;
  cotravelermarker: any;
  deviceCoordinatesArr: any;
  shapId: any;
  shapeIdArr: any;
  LNGArr: any;
  LATArr: any;
  AoiResultCoordArr: any;
  AOICircleRadius = 100;
  endOperationSec: any;
  beginOperationSec: any;
  comarkers: any;
  name: any;
  comarkersArray: any[] = [];
  Datatable: any[] = [];
  displayedColumns: any;
  openTable: boolean = false;
  Lng: any = [];
  lat: any = [];
  event: any = []
  Time: any = [];
  messages: any[] = [];
  inQueueArray: any = [];
  ImgFirstCoord:any;
  Sectorfeatures :any= [];
  SectorfeaturesLoop :any= [];
  checkCoTravelerCounter :number;
  checkAoiCounter :number;
  coTravelerSubscription: Subscription;
  aoiSubscription: Subscription;
  coTravelerId :any;
  DisplayCoTravelerflag :number = 0;
  coRelationId :any;
  coRelationSubscription :Subscription;
  checkCoRelationCounter :any;
  DisplayCoRelationflag :number =0;
  aoiId :any;
  inQueueTiming: any;
  executeOfflineId:any;
  selectedType: number = 1; 
  deviceValue: string = '';
  countryValue: string = '';
  MeterFromValue: string = '';
  MeterToValue: string = '';
  TimeLimitValue: string = '';
  IMSI_IDValue: string = '';
  GROUPSValue: string = '';
  endOperation2: string = '';
  beginOperation2: string = '';
  intervalSubscription :Subscription;
  inQueueSubscription :Subscription;
  flagInQueue :number = 0;  
  confirmBreakRes: boolean = false;
  isImage:boolean=false;
  imagepath:any='/assets/img/ba4eaf7e-33a6-4c65-8dc2-626345a3ab70.png';
  magnifyingGlass:any;
  obj2:any={
    "reportName": "No Name",
    "reportType": "1",
    "reportTypeId": "1",
    "TimeZone": "",
    "RecipientUser": "",
    "DateTimeFrom": "04/11/2023 00:00",
    "RecipientEmail": "",
    "DateTimeTo": "04/11/2024 00:00",
    "Coordinates": [
        {
            "ID": 283,
            "Name": "",
            "Value": "",
            "Type": "Circle",
            "Bounds": "",
            "radius": 10.462865440760638,
            "center": {
                "lat": 33.896628222692826,
                "lng": 35.56599900126458
            },
            "leafletid": 283,
            "PolyBoundsCoords": "",
            "selectedStartDate": "",
            "selectedEndDate": "",
            "countrycodes": [
                [
                    "145",
                    "142",
                    [
                        "422"
                    ]
                ]
            ]
        }
    ],
    "meter": "",
    "Devices": "",
    "isCSVAttached": "",
    "dataType": "",
    "telephoneNumber": "",
    "EDGEHEIGHT": "10",
    "simulationId": "175360",
    "userCode": "8158 ",
    "imsiId": "",
    "countryCode": "",
    "senario": "-1"
};



  tns_alert_m1 = "Limit Exceeded!";
  tns_alert_m2 = "No Data Available";
  tns_alert_m3 = "Device history cannot be generated if shapes are drawn on the map";
  tns_alert_m4 = "You need to select at least one Area Of Interest!";
  tns_alert_m5 = "You need to select more than one Area Of Interest!";
  tns_alert_m6 = "Your Query is in Queue";
  tns_alert_m7 = "Attention! you have touched a restricted Area";
  tns_alert_m8 = "Please Select Data ... !";
  tns_alert_m9 = "Are you sure you want save?";
  tns_alert_m10 = "Error";
  tns_alert_m11 = "Square limit exceeded";
  tns_alert_m12 = "Polygon limit exceeded";
  tns_alert_m13 = "Are you sure you want to save the shapes in the AOI library?";
  tns_alert_m14 = "You can not import the same report twice.";
  tns_alert_m15 = "Device History Has No Polygones";
  tns_alert_m16 = "Circle limit exceeded";
  tns_alert_m17 = "Shape name ready exist";
  tns_alert_m18 = "Query Saved";
  tns_alert_m19 = "Query Name Already Exist";
  tns_alert_m20 = "Enter Shape Name";
  tns_alert_m21 = "Re-enter Shape Name";
  tns_alert_m22 = "No fixed Elements Available";
  tns_alert_m23 = "Please fill in both Type and Name fields";
  tns_alert_m24 = "Please fill in the Type field";
  tns_alert_m25 = "Please fill in the name field";
  tns_alert_m26 = "Please fill in both device and color fields";
  tns_alert_m27 = "Please fill in the device field";
  tns_alert_m28 = "Please fill in the color field";
  tns_alert_m29 = "Saved successfully";
  simulationtypeValue:any;
  layerControl2: any;
  dialogConfig2 = new MatDialogConfig();
  mousePositionOptions = {
    position: 'bottomright', // Change the position as needed
    separator: ', ',
    emptyString: 'Unknown location',
    lngFirst: false,
    numDigits: 5,
    prefix: ''
  };
  geoJsonLayer: L.GeoJSON<any>;
  countrycode: any;
  geojsonData:any;


  counter: number;
  intervalId: number;
  isFromJsp: boolean;
  isInterval: number;
  // menuItems:any=[];
  menuItems = [
    { label: 'Item 1', subItems: [] },
    { label: 'Item 2', subItems: [{ label: 'Item 2.1' }, { label: 'Item 2.2' }] }
 ];
mydata =[{"orgHierarchy":["173488"],"Name":"173488","id":173488},{"orgHierarchy":["173488/173488.3"],"Name":"173488.3","id":173491},{"orgHierarchy":["173488/173488.1"],"Name":"173488.1","id":173489},{"orgHierarchy":["173488/173488.2"],"Name":"173488.2","id":173490},{"orgHierarchy":["173488/173488.2/173488.2.1"],"Name":"173488.2.1","id":173491}];
 menuStack :any= [];

  messageInput:string = '';
  arrowMarker: L.Marker=null;
  isDrawingInProgress: boolean;
  isDrawingFinished: boolean=false;
  magnifiedMap:any;
  zoommagnifymap: number=18;
  timelineFlag: number;
  displayTarget: boolean;
  simulationtype: any;
  simulationData: any;
  records: any;

  countryCellRenderer(params: ICellRendererParams) {
    const flag =
      '<img border="0" width="15" height="10" src="/cybercrowd/angular/assets/img/singleperson.png">';
    return flag;
  }

  SectorMeter: number ;
  SectorColor: any ;
  SectorFillColor: any ;
  currentSectorColor:any;

  columnDefs = [
    {
      headerName: "Device_id",
      field: "Device_id",
      sortable: true,
      filter: "agSetColumnFilter",
      width: 400,
      wrapText: true,
      autoHeight: true,
      rowGroup: true,
      hide: true,
      checkboxSelection: true,
      cellStyle: { color: "#03f8fc" },
      cellRenderer: 'btnCellRenderer',
    },
    {
      headerName: "Date",
      field: "Date",
      sortable: true,
      filter: "agSetColumnFilter",
      // autoSizeColumns: true,
      sort: 'desc',
      cellStyle: { "text-align": "right" },
      width: 500,
      valueGetter: (params: any) => {
        if (typeof (params.data) != "undefined") {
         console.log("date",params.data)
          return this.dateTtoDate(params.data.Date);

        }
      }
    },
    {
      headerName: "Coord",
      field: "Coord",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      sort: 'desc',


    },

  ];

  columnDefs2 = [

    {
      headerName: "Device_id",
      field: "Device_id",
      sortable: true,
      filter: "agSetColumnFilter",
      width: 400,
      wrapText: true,
      autoHeight: true,
      cellStyle: { "flex": '1', color: "#03f8fc" },
      onCellClicked: this.onTelColumnClicked.bind(this),

    },
    {
      headerName: "Date",
      field: "Date",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      sort: 'desc',
      wrapText: true,
      cellStyle: { "text-align": "-webkit-center", "flex": '1' },
    
      valueGetter: (params: any) => {
        if (typeof (params.data) != "undefined") {
          console.log("date",params.data)

          const date = new Date(params.data.Date);
        
          const formattedDate = date.toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          });
          const sortableDate = date.getTime(); // Get the timestamp for sorting
          return { displayValue: formattedDate, sortValue: sortableDate }; // Return an object with both displayValue and sortValue
        }
      },
      comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) => {
        return valueA.sortValue - valueB.sortValue; // Comparator function to compare the numeric timestamps for sorting
      },
      cellRenderer: (params: any) => {
        return params.value.displayValue; // Display the formatted date string
      }
      }
    ,
    {
      headerName: "Coordinates",
      field: "Coord",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      // sort: 'desc',
      wrapText: true,
      cellStyle: { "text-align": "-webkit-center", "flex": '1' },
    },
    {
      headerName: "Hits",
      field: "Hits",
      sortable: false,
      filter: false,
      autoSizeColumns: true,
      width: 100,
      valueGetter: function (params: any) {
        var count = 0;
        params.api.forEachNode(function (node: any) {
          if (node.data.Device_id === params.data.Device_id) {
            count++;
          }
        });
        return count;
      },
      cellStyle: { "text-align": "-webkit-center", "flex": '1' },
    },

  ];


  columnDefsCdr = [

    // {
    //   headerName: "Type",
    //   field: "Type",
    //   sortable: true,
    //   filter: "agSetColumnFilter",
    //   autoSizeColumns: true,
    //   padding: 0,


    // },
    {
      headerName: "Location",
      field: "Location",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      width: 250,


    },
    {
      headerName: "BtsName",
      field: "BtsName",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      width: 250,


    },
    {
      headerName: "Sector",
      field: "Sector",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,


    },
    {
      headerName: "Technology",
      field: "Technology",
      sortable: true,
      filter: "agSetColumnFilter",
      width: 400,
      wrapText: true,
      autoHeight: true,
      rowGroup: true,
      hide: true,
      autoSizeColumns: true,
      padding: 0,
      sort: 'desc',



    },
    {
      headerName: "Frequency",
      field: "Frequency",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,


    },

    {
      headerName: "Lng",
      field: "Lng",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 100,


    },
    {
      headerName: "Lat",
      field: "Lat",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 100,


    },
    {
      headerName: "Azimuth",
      field: "Azimuth",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 200,


    }

  ];


  SenariocolumnDefs = [
    {
      headerName: 'Senario',
      field: 'orgHierarchy',
      minWidth: 200,
      cellRenderer: 'agGroupCellRenderer',
      // checkboxSelection: true,
      sort: 'asc',
      comparator: function (valueA:any, valueB:any, nodeA:any, nodeB:any, isInverted:any) {
        // Compare ids of two rows
        const idA = nodeA.data.id;
        const idB = nodeB.data.id;
        
        // Return comparison result
        if (idA < idB) {
          return -1;
        } else if (idA > idB) {
          return 1;
        } else {
          return 0;
        }
      },
    cellClassRules: {
  'parent-row': function(params:any) {
    // Check if the row has children
    //console.log('params.node',params.node.childrenAfterSort.length > 0 && params.node.childrenAfterGroup.length > 0 && params.node.childrenAfterFilter.length > 0)
    return  params.node.childrenAfterSort.length > 0 && params.node.childrenAfterGroup.length > 0 && params.node.childrenAfterFilter.length > 0;
  },
  'current-row': (params:any) =>{
    // Check if the row has children
    //console.log('params<>><<>',params.data.id)
    return params.data.id==this.simulationid;
  },
}

    }
  ];
  

  // SenariocolumnDefs = [


  //   // {
  //   //   headerName: "Technology",
  //   //   field: "Technology",
  //   //   sortable: true,
  //   //   filter: "agSetColumnFilter",
  //   //   width: 400,
  //   //   wrapText: true,
  //   //   autoHeight: true,
  //   //   rowGroup: true,
  //   //   hide: true,
  //   //   autoSizeColumns: true,
  //   //   padding: 0,
  //   //   sort: 'desc',



  //   // },
  //   {
  //     headerName: "Id",
  //     field: "Id",
  //     filter: "agSetColumnFilter",
  //     autoSizeColumns: true,
  //     cellStyle: '',
  //     padding: 0,
  //     width: 100,


  //   },
  //   {
  //     headerName: "Name",
  //     field: "Name",
  //     filter: "agSetColumnFilter",
  //     autoSizeColumns: true,
  //     cellStyle: '',
  //     padding: 0,
  //     width: 100,


  //   },
  
  //   {
  //     headerName: "Parent",
  //     field: "Parent",
  //     filter: "agSetColumnFilter",
  //     cellStyle: '',
  //     padding: 0,
  //     width: 0,
  //     wrapText: true,
  //     autoHeight: true,
  //     rowGroup: true,
  //     hide: true,
  //     autoSizeColumns: true,
  //     sort: 'asc',


  //   },
  //   {
  //     headerName: "dis",
  //     field: "dis",
  //     filter: "agSetColumnFilter",
  //     cellStyle: '',
  //     padding: 0,
  //     width: 0,
  //     wrapText: true,
  //     autoHeight: true,
  //     rowGroup: true,
  //     hide: true,
  //     autoSizeColumns: true,
  //     sort: 'asc',


  //   }
    

  // ];
  columnDefsCdr2 = [

    // {
    //   headerName: "Type",
    //   field: "Type",
    //   sortable: true,
    //   filter: "agSetColumnFilter",
    //   autoSizeColumns: true,
    //   padding: 0,


    // },
    {
      headerName: "Location",
      field: "Location",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      width: 250,


    },
    {
      headerName: "BtsName",
      field: "BtsName",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      width: 250,


    },
    
    {
      headerName: "Coord",
      field: "Coord",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      sort: 'desc',


    },


  ];
  columnDefsTcd = [

    {
      headerName: "imsi_id",
      field: "imsi_id",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
    },
    {
      headerName: "imei_id",
      field: "imei_id",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      width: 250,


    },
    {
      headerName: "service_provider_id",
      field: "service_provider_id",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      width: 250,


    },
    {
      headerName: "usage_timeframe",
      field: "usage_timeframe",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
         valueGetter: (params: any) => {
        if (typeof (params.data) != "undefined") {
          //console.log("params.data.Date",params.data)
          const date = new Date(params.data.usage_timeframe);
        
          const formattedDate = date.toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          });
          const sortableDate = date.getTime(); // Get the timestamp for sorting
          return { displayValue: formattedDate, sortValue: sortableDate }; // Return an object with both displayValue and sortValue
        }
      },
      comparator: (valueA: any, valueB: any, nodeA: any, nodeB: any, isInverted: any) => {
        return valueA.sortValue - valueB.sortValue; // Comparator function to compare the numeric timestamps for sorting
      },
      cellRenderer: (params: any) => {
        return params.value.displayValue; // Display the formatted date string
      }


    },
    {
      headerName: "location_latitude",
      field: "location_latitude",
      sortable: true,
      filter: "agSetColumnFilter",
      width: 400,
      wrapText: true,
      autoHeight: true,
      autoSizeColumns: true,
      padding: 0,
      //sort: 'desc',



    },
    {
      headerName: "location_longitude",
      field: "location_longitude",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,


    },

    {
      headerName: "cgi_id",
      field: "cgi_id",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 100,


    },
    {
      headerName: "location_azimuth",
      field: "location_azimuth",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 100,


    },
    {
      headerName: "type_id",
      field: "type_id",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 200,


    }
    ,
    {
      headerName: "phone_number",
      field: "phone_number",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 200,


    },
    {
      headerName: "Technology",
      field: "Technology",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      width: 200,
      rowGroup: true,
      hide: true,


    }
  ];
  columnDefsTcd2 = [

    {
      headerName: "imsi_id",
      field: "imsi_id",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
    },
    {
      headerName: "imei_id",
      field: "imei_id",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      // width: 250,


    },
    {
      headerName: "service_provider_id",
      field: "service_provider_id", 
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,
      //  width: 250,


    },
    {
      headerName: "usage_timeframe",
      field: "usage_timeframe",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,


    },
    {
      headerName: "location_latitude",
      field: "location_latitude",
      sortable: true,
      filter: "agSetColumnFilter",
      // width: 400,
      wrapText: true,
      autoHeight: true,
      autoSizeColumns: true,
      padding: 0,
      //sort: 'desc',



    },
    {
      headerName: "location_longitude",
      field: "location_longitude",
      sortable: true,
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      padding: 0,


    },

    {
      headerName: "cgi_id",
      field: "cgi_id",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      // width: 100,


    },
    {
      headerName: "location_azimuth",
      field: "location_azimuth",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      // width: 100,


    },
    {
      headerName: "type_id",
      field: "type_id",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      // width: 200,


    }
    ,
    {
      headerName: "phone_number",
      field: "phone_number",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      // width: 200,


    },
    {
      headerName: "Technology",
      field: "Technology",
      filter: "agSetColumnFilter",
      autoSizeColumns: true,
      cellStyle: '',
      padding: 0,
      // width: 200,

    }
  ];


  rowData = [{ Device_id: "", Tel: "", Date: "", Hits: "", Coord: "" }];
  CdrRowData: any = [{ Location: "", BtsName: "", Sector: "", Technology: "", Frequency: "", Lng: "", Lat: "", Azimuth: "" }];
  CdrRowData2: any = [{ Location: "", BtsName: "",  Coord: "" }];
  SenarioRowData: any = [{ Id: "", Name: "", Parent: "",dis: ""}];

  TcdRowData: any = [{ imsi_id: "", imei_id: "", service_provider_id: "", usage_timeframe: "", location_latitude: "", location_longitude: "", cgi_id: "", location_azimuth: "", type_id: "", phone_number: "", Technology: "" }];
  Coord: Array<Coords> = [];
  tns_alert_1 = "Enter Simulation Name";
  tns_alert_2 = "Please save the simulation";
  tns_alert_3 = "Please refresh a simulation";
  tns_alert_4 = "Query Saved";
  tns_alert_5 = "Query Name Already Exist";
  tns_alert_6 = "Required fields";
  tns_alert_7 = "Please save a new simulation";
  tns_alert_8 = "Please fill in the simulation name";
  tns_alert_22 = "please name the AOI";
  datasource: any[] = [];
  locationCenter: any;
  drawnLayer: any;
  lineLength: any;
  area: number;
  perimeter: any;
  timelimit: any;
  mapLayoutType: any;
  lastSimulationDesc: any;
  drawnLayers: L.Layer[] = [];
  currentPage: any;
  polylinearray: Array<any> = [];
  sectorarray: Array<any> = [];
  sectorarrayLoop: Array<any> = [];
  tooltipInstanceName: any[] = [];
  tooltipInstanceNameArray: any[] = [];
  fixedelementsObject: any;
  center: any;
  pathCoordinates: any;
  route1: any;
  currentIndex: number = 0;
  endIndex: number = 0;
  batchSize: number = 100;
  startMarker: any;
  person2Marker: any;
  robberymarker: any;
  boatmarker: any;
  busmarker: any;

  animatedmarker: any;
  animationStopped: boolean = false;
  skipAnimation: boolean = false;
  selectedPolyline: any;
  IsCdr: boolean = false;
  CdrData: any;
  GridType1: string = 'btn-54';
  GridType2: string = 'opentcd'
  BtsTypeSlected: string = '';

  animationMarkers: any[] = [];
  devaddgrparray:any[]=[];
  hitsaddgrpnb:any[]=[];
  devicesArray:any[]=[];
  tablerow:any=1;
  showbarstart:boolean=false;
  showbarreverse:boolean=false;
  markerClusterGroup:L.MarkerClusterGroup;
  Datatablereverse:any[]=[];
  Datatable1:any[]=[];
  Datatable2:any[]=[];
  index:number=0;
  displayclusters:boolean=false;
  displaysectors:boolean=false;
  removesectors:any[]=[];
  technologyarray:any[]=[];
  techarray2:any[]=[];
  btsarray:any[]=[];
  similutionIdArray:any[]=[];
  count:number=0;
  dimmedPrev:boolean=false;
  dimmedNext:boolean=false;
  fixedeltsTypes:any[]=[];
  locationbts:any
  senarioFlag:boolean=false;
  senariocount:number=0;
  senarioParentName:any;
  firstsenario:any;
  internalcode:any;
  isClicked:boolean=false;
  addnewsenariocount:number=0;
  templates:any[]=[];
  dimmedTemplate:boolean=false;
  colorFormControl: any = new FormControl();
  templateForm: FormGroup;
  formValues: any[] = [];
  templateForms: FormGroup[] = [];
  allRoutedatajson:any[]=[];
  routeDevices:any;
  usagetime:any[]=[];
  animatedmarkerArray:any[]=[];
  pathCoordinatesDev:any[]=[];
  infoAnimateMarker:any[]=[];
  routingControlArray:any[]=[];
  routingTools:boolean=false;
  displayRoute:boolean=false;
  routingdeviceArray:any[]=[];
  backgroundColor: string = 'white';
  clickCount: number = 0;
  messagesArray: Message[] = [];
  value: string;
  isGreen: boolean = true;
  displayroute:boolean=false;
  arraystatic2:any[]=[];
  arraystatic:any[]=[];
  isRunningRoute:boolean=false;
  selectedDeviceId:any;
  routingpolyline:any[]=[];
  routingicons:any[]=[];
  animatedmarker1:any;
  routingMarkerArr:any[]=[];
  routingMarkerArrLoop:any[]=[];
  typeofdata:any;
  routeDeviceArray:any[]=[];
  routeDeviceArrayLoop:any[]=[];
  routeDevicestable:any[]=[];
  routecountobj:number=0;
  layers:any[]=[];
  openMagnifier:boolean=false;
  polylineRouteArray:any[]=[];
  polylineRouteArrayLoop:any[]=[];
  xroutearray:any[]=[];
  indexRoute:number=0;
  speedTimeRoute:number=1;
  Senario_reportType:any;
  isDimmed:boolean=false;
  cursorlnglat:any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private datePipe: DatePipe,
    private datacrowdService: DatacrowdService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    public loaderService: LoaderService,
    private modalService: NgbModal,
    private dataService: DataService,
    private renderer: Renderer2,
    private el: ElementRef,
    private workerService: WorkerService,
    // private notif:NotificationComponent,
    private formBuilder: FormBuilder,
    // public chatService: ChatService,
    private http:HttpClient

  ) { }
  @ViewChild('popup') popup: any;
  @ViewChild('dialog') dialog2: any;
  // @ViewChild('popupContent') popupContent: any;
  @ViewChild('bulkdraw') bulkdraw: any;
  @ViewChild('BtsType') BtsType: any;
  @ViewChild('tabletest') tabletest: any;
  @ViewChild('datepicker') datepicker: any;

  @ViewChild('popupContent', { static: false }) popupContent: ElementRef;
  @ViewChild('popupContent1', { static: false }) popupContent1: ElementRef;
  @ViewChild('CdrContent', { static: false }) CdrContent: ElementRef;
  @ViewChild('TCDContent', { static: false }) TCDContent: ElementRef;
  @ViewChild('CoTravelersReady') CoTravelersReady: any;
  @ViewChild('CoRelationsReady') CoRelationsReady: any;
  @ViewChild('Queue2') Queue2: any;
  @ViewChild('Queue') Queue: any;
  @ViewChild('AddsenarioName') AddsenarioName: any;
  @ViewChild('SenarioContent', { static: false }) SenarioContent: ElementRef;
  @ViewChild('saveSimul') saveSimul: any;
  @ViewChild('approuting') approuting: any;
  @ViewChild('SimulInfo') SimulInfo: any;


  
  async ngOnInit(): Promise<void> {
    $('#refresh').css('display', 'none');
    $('.magnifying-glass1').css('display', 'none');
   // $('#showAdditionalInputs').css('display', 'none');
    $('#controlbutton').css('display', 'none');

    $('.leaflet-draw-toolbar').css('display', 'none');

    $('.graphtools').css('display', 'none');
    $('#moretools').css('display', 'none');
    var button = document.getElementById("refreshJsp");
    var div = document.getElementById("refresh");

    button.addEventListener("contextmenu", function(event) {
        event.preventDefault(); // Prevent the default right-click menu from appearing
        if (div.style.display === "none") {
            div.style.display = "block"; // Show the div
        } else {
            div.style.display = "none"; // Hide the div
        }
    });
    // //console.log('ang window.parent.parent>>>', window.parent.parent);
    await this.datacrowdService.getShapelimit().then((res: any) => {
      console.log('getShapelimit>>', res)
      const myArray: any = res;

      this.polygoneLimit = myArray[0][1];
      this.circleLimit = myArray[0][2];
      this.squareLimit = myArray[0][3];
      this.timelimit = myArray[0][4];
      this.mapLayoutType = myArray[0][5];
      this.globalCoord = myArray[0][6];
      this.zoom = myArray[0][7];
      this.inQueueTiming=myArray[0][9];

      this.lastSimulationDesc = myArray[0][10];
      this.SectorMeter = myArray[0][11];
      this.SectorColor = myArray[0][12];
      this.SectorFillColor = myArray[0][13];
      this.currentSectorColor = myArray[0][14];

   

      var words = myArray[0][6].split(',');
      //console.log('center', words);
      this.map.setView([words[0], words[1]], this.zoom)


    });
    if (this.simulationtype && this.simulationtype.length > 0) {
      this.selectedType = this.simulationtype[0][0]; // Selecting the value of the first option
    }
  
    await this.datacrowdService.getgraphtools().then((res: any) => {
      this.graphtools = res;
      //console.log('this.graphtools', this.graphtools)
    });


    await this.datacrowdService.getmoretools().then((res: any) => {
      this.moretools = res;
      //console.log('moretools >>>>>>>>>>>>>>>>>', this.moretools)
    });

    await this.datacrowdService.getSimulationTypes().then((res: any) => {
      this.simulationtype = res;
      console.log('simulationtype >>>>>>>>>>>>>>>>>', this.simulationtype)
    });


    await this.datacrowdService.getmaptypes().then((res: any) => {
      this.maptypes = res;
      //console.log('getmaptypes>>>.', this.maptypes);

      let mapobj = this.maptypes.find((a: any) => a[0] == this.mapLayoutType);
      //console.log('ee>>>11.', mapobj);
      if (typeof mapobj !== 'undefined') {
        //console.log('ee>>>222.', mapobj);

        this.changeMap(mapobj[1]);

      }



    });


    await  this.httpClient.get('/assets/custom.geo.json').subscribe((geojsonData: any) => {
        const geoJsonOptions: L.GeoJSONOptions = {
          style: this.customStyleFunction, // Optional: Define a custom styling function

        };
        // this.geoJsonLayer = L.geoJSON(geojsonData, geoJsonOptions).addTo(this.map);
        this.geojsonData=geojsonData;
        console.log("geojsonData",geojsonData)
      });
  

    if ((window.parent as any) && (window.parent as any).AV2_userCode) {
      this.usercode = (window.parent as any).AV2_userCode;

    }
    this.loadSimulationTypes();

    if (this.lastSimulationDesc == 'on') {
      await this.datacrowdService.getLastSimualtionID(this.usercode).then((res:any) => {
        if (res != "null") {
          this.LastSimualtionID = res
          //console.log('getLastSimualtionID>>>.', this.LastSimualtionID);
          if (this.LastSimualtionID != null) {
            if (!localStorage.getItem("locSimulId")) {
              localStorage.setItem("locSimulId", this.LastSimualtionID[0]);
              localStorage.setItem("userCode", this.LastSimualtionID[1]);
            }
          }

        }




      });
    } else {
      //localStorage.setItem("locSimulId",'');

    }




    //console.log("data from jsp=", (window.parent.parent.parent[7] as any))
    // alert("A_ISCase>>>>>>>>>>>>>>>="+(window.parent.parent.parent[7] as any).A_ISCase);
    // alert("A_locSimulId>>>>>>>>>>>>>>>="+(window.parent.parent.parent[7] as any).A_locSimulId);


    L.control.mousePosition({
      "emptyString": "Unavailable",
      "lngFirst": false,
      "numDigits": 5,
      "position": "bottomright",
      "prefix": "",
      "separator": " : "
    }).addTo(this.map);


    this.openTools();


    //console.log("fullscreen>>>>", $(".leaflet-control-fullscreen"))
    // $(".leaflet-control-fullscreen").css("top","660px");
    // $(".leaflet-control-measure").css("top","0px ");
    // $(".leaflet-control-measure").css("left","-950px ");


    //  this.addfullscreen();


    //     //console.log('tilelayer>>>',localStorage.getItem("tilelayer"));
    //     if(!localStorage.getItem("tilelayer")){
    //     }else{

    //       this.map.eachLayer((layer: any) => {
    //         this.map.removeLayer(layer);
    //       })

    //      let  tilelayer=localStorage.getItem("tilelayer");
    //      let newLayer= L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    //     '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    //     'Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxNativeZoom: 19,
    //     maxZoom: 25,
    //     id: tilelayer, 
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     accessToken:'pk.eyJ1IjoidmFsb29yZXMiLCJhIjoiY2wzd21md3VkMDgxZTNibzhpc2dhOGx0MCJ9.CSG26gI-rCZLv0HV0rJwxw'
    //   })

    // //Add new tile layer to the map
    //  this.map.addLayer(newLayer);
    //     }




    //console.log('popopopopopopo', this.popup)

    this.layerGroup = new L.LayerGroup();

    if (localStorage.getItem("userCode")) {
      if ((localStorage.getItem("locSimulId"))) {
        this.displaycaseSimulation();

      }
    }
    //  this.clearShapes();
    $('.button_plus').click(function() {
      $(".button_plus").addClass('clicked');
    });

// // @ts-ignore
//  this.magnifyingGlass = L.magnifyingGlass({
//     layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')]
// }).addTo(this.map);


 

//  this.magnifiedMap = L.map('magnifying-glass').setView([35,33],12);
//  L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
//   maxNativeZoom: 19,
//   maxZoom: 25,
//   subdomains: ["mt0", "mt1", "mt2", "mt3"],
// }).addTo(this.magnifiedMap);

//  this.magnifiedMap.zoomControl.remove();

// L.marker([35, 33]).addTo(this.magnifiedMap);
//   L.marker([35, 33]).addTo(this.map);
this.magnifiedMap = L.map('magnifying-glass1', {
  scrollWheelZoom: 'center',
  zoomControl: false
}).setView([35, 33], 18);

let idtype = 'mapbox/satellite-streets-v11';
let newLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
  maxNativeZoom: 19,
  maxZoom: 25,
  id: idtype,
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoidmFsb29yZXMiLCJhIjoiY2wzd21md3VkMDgxZTNibzhpc2dhOGx0MCJ9.CSG26gI-rCZLv0HV0rJwxw'
});

// Add new tile layer to the map
this.magnifiedMap.addLayer(newLayer);

// Attach click event listener to the layer
 
 
$('.magnifying-glass1').css('display', 'none');

 

this.map.on('mousemove', (event:any) => {
 
  if(this.openMagnifier==true){
  this.cursorlnglat = event.latlng;
  this.updateMagnifyingGlass(event);
  
  }

});

this.map.on('click', (event:any) => {
  
  if(this.openMagnifier==true){
  $('.magnifying-glass1').css('display','');
  const magnifyingGlass = document.getElementById('magnifying-glass1');

  const currentWidth = parseFloat(window.getComputedStyle(magnifyingGlass).width);
  const currentHeight = parseFloat(window.getComputedStyle(magnifyingGlass).height);
console.log("currentWidth----",currentWidth,"---currentHeight---",currentHeight)
  magnifyingGlass.style.width = `${currentWidth + 0}px`;
  magnifyingGlass.style.height = `${currentHeight + 0}px`;
  this.updateMagnifyingGlassSize();
  this.updateMagnifyingGlass(event);
  }

});


}

async loadSimulationTypes() {
  try {
    const res = await this.datacrowdService.getSimulationTypes();
    this.simulationtype = res;
    console.log('simulationtype >>>>>>>>>>>>>>>>>', this.simulationtype);
  } catch (error) {
    console.error('Error fetching simulation types', error);
  }
}

 
ngOnChanges(changes: any) {
  console.log("changes",changes);
  console.log("currentValue",changes.changes.currentValue);

  if(typeof changes.changes.currentValue=="undefined"){

  }else{
    if(changes.changes.currentValue.action=="addnewSenario"){
let senarioParentName=changes.changes.currentValue.simulID;

this.addnewSenario();
    }else {

    }
  }
  
}

  ngAfterViewInit() {
    // Now it's safe to access childComponent
    //console.log("0000000000000000000",this.childComponent);
  }
  

  dbtype = "Cassandra";
  shapesArray: Array<ShapesArray> = [];
  QueryJSON: Array<Queryjson> = [];

  homeCoords = {
    lat: 33.88153,
    lon: 35.6,
  };

  popupText = "Some popup text";

  // markerIcon = {
  //   icon: L.icon({
  //     iconSize: [25, 41],
  //     iconAnchor: [10, 41],
  //     popupAnchor: [2, -40],
  //     // specify the path here
  //     iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  //     shadowUrl:
  //       "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
  //   }),
  // };


  markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      // iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
    }),
  };
  singlepersonicon = L.icon({
    iconUrl: "/cybercrowd/angular/assets/img/singleperson.png",
    iconSize: [32, 32],
  });

  groupicon = L.icon({
    iconUrl: "/cybercrowd/angular/assets/img/group.png",
    iconSize: [32, 32],
  });
  caricon = L.icon({
    iconUrl: "/cybercrowd/angular/assets/img/car.png",
    iconSize: [32, 32],
  });

  robbery = L.icon({
    iconUrl: "/cybercrowd/angular/assets/img/robbery.png",
    iconSize: [32, 32],
  });
  boat = L.icon({
    iconUrl: "/cybercrowd/angular/assets/img/boat1.png",
    iconSize: [32, 32],
  });
  bus = L.icon({
    iconUrl: "/assets/img/bus.png",
    iconSize: [32, 32],
  });
  options = {
    layers: [
      L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxNativeZoom: 19,
        maxZoom: 25,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }),


    ],
    zoom: 7,
    center: L.latLng(0, 0),
    renderer: L.canvas(), 
    fullscreenControl: {
      position: 'bottomleft',

    },
    // measureControl: {
    //   position: 'bottomleft',

    // },

    //33.88153, 35.63931 lebanon
    //33.02755,43.40163  iraq
    // L.latLng(parseFloat(JSON.parse(localStorage.getItem('globalCoord'))[0]),parseFloat(JSON.parse(localStorage.getItem('globalCoord'))[1])),
    //center: L.latLng(parseFloat(localStorage.getItem('globalCoord lat')),parseFloat(localStorage.getItem('globalCoord lng'))),

  };



  initMarkers() {
    const popupInfo = `<b style="color: red; background-color: white">${this.popupText}</b>`;

    L.marker([this.homeCoords.lat, this.homeCoords.lon], this.markerIcon)
      .addTo(this.map)
      .bindPopup(popupInfo);
  }

  drawnItems: L.FeatureGroup = L.featureGroup();
  drawnItemsLoop: L.FeatureGroup = L.featureGroup();
  drawnItems2: L.FeatureGroup = L.featureGroup();

  drawOptions = {

    draw: {
      marker: {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl:
            "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
          iconRetinaUrl: "680f69f3c2e6b90c1812a813edf67fd7.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
        }),
      },
      polyline: {
        shapeOptions: {},
      },
      circle: {
        shapeOptions: {},
      },
      rectangle: {
        shapeOptions: {},
      },

      circlemarker: false as false,
    },
    edit: {
      featureGroup: this.drawnItems,
    },
    position: "topleft" as "topleft",
  };




  public onEdit(e: any) { }

  public onDrawCreated(e: any) {


    this.drawnItems.addLayer((e as L.DrawEvents.Created).layer);


 

    if (e.layerType == "circle") {
      // alert(111);
      this.CircleCoordinate(L.featureGroup, e, e.layer._leaflet_id);
      var centerCoords = e.layer.getLatLng();
      var title = '';
     //console.log("zzz e>>>>>> ",e)
      let finishDrawing:boolean=false;
      //console.log("zzz finishDrawing>>>>>> ",finishDrawing)

      var tooltip = e.layer.unbindTooltip(`${title}`, {
        permanent: true,
        interactive: true,
        noWrap: true,
        opacity: 0.9,
        direction: "center"
      }).openTooltip();
//  e.layer.on('click', (event: any) => {

      tooltip.on('click', (event: any) => {
          
        
        //console.log("tooltip>>>", tooltip);
        //console.log("deletingModeEnabled>>>", this.deletingModeEnabled);

        if (this.deletingModeEnabled == false) {



         if(this.isDrawingFinished==true ){


          if (tooltip._tooltip) {
            this.tooltipName = tooltip._tooltip._content;
          } else {
            this.tooltipName = '';
          }
  
    
          // if(deletStatus == false) {
          //console.log("this.tooltipName>>>>>>>>>>>",this.tooltipName);
          if (this.tooltipName != "" && typeof (this.tooltipName) != "undefined") {
            //reenter shape name
  
            const dialogConfig = new MatDialogConfig();
            if (this.datingModeEnabled == false) {
              dialogConfig.data = {
                content: 'Re-Enter Shape Name',
                value: tooltip._tooltip._content
              };
            }
  
            //console.log("ttttttt");
  
            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);
  
            dialogRef.afterClosed().subscribe(result => {
              this.namingshapes(e);
  
            });
  
          } else {
            //enter shape name
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              width: '350px',
              content: 'Enter Shape Name',
            };
  
            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);
  
            dialogRef.afterClosed().subscribe((result: any) => {
              this.namingshapes(e);
  
            });
          }
  
         } 


          if (this.map.getZoom() >= this.clickZoom) {
            var myShapeName = "";
            //if(namingAccess) {
            if (e.layer._tooltip) {
              myShapeName = (e.layer._tooltip._content);
            }
            this.isNotRoute = 1;
          }
          //} 
          else {
            this.map.setView(tooltip._latlng, this.clickZoom)
          }
          // }  
        } else {
          // this.onselectedShape(e.layer);
          //          selectedShapesArray.push(coords.find(a => a.Type === "Route"))
        }
      });

      // this.onselectedShape(e.layer);

    // });
      tooltip.addEventListener('contextmenu', async (event: any) => {
 
        // this.modalRef =this.modalService.open(this.date);
        //console.log("tooltip>>>", tooltip);
        //console.log("event>>>", event);
        //console.log("e>>>", e);
        //console.log("tooltip>>>", tooltip._leaflet_id);
        this.clickedShapeID = tooltip._leaflet_id;

        if (typeof (tooltip._tooltip) != "undefined") {
          //console.log("tooltip._tooltip>>>", tooltip._tooltip._content);
          let x = tooltip._tooltip._content;
          const parts = x.split('<br>');
          const beginOperation = parts[0].split(': ')[1];
          const endOperation = parts[1].split(': ')[1];
          //console.log(beginOperation);
          //console.log(endOperation);
          const BeginTime = beginOperation.split(' ')[1];
          const EndTime = endOperation.split(' ')[1];
          //console.log('BeginTime',BeginTime);
          //console.log('EndTime',EndTime);
          //const dialogConfig = new MatDialogConfig();
          this.dialogConfig2.disableClose = true;
          this.dialogConfig2.data = {
            width: '400px',
            height: '400px',
            beginOperation: beginOperation,
            endOperation: endOperation
          };
          this.dataService.setStartDate(beginOperation);
          this.dataService.setendDate(endOperation);
          this.dataService.setBeginTime(BeginTime);
          this.dataService.setEndTime(EndTime);


        } else {
          // const dialogConfig = new MatDialogConfig();

          this.dataService.setStartDate('');
          this.dataService.setendDate('');


        }
        //////////////here 




        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            DatePickerComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        //componentref.instance.rowData = this.rowData;
        componentref.changeDetectorRef.detectChanges();

        const html1 = componentref.location.nativeElement;
        await html1;


        //console.log('getLatLng>>>>>', e.layer.getLatLng)


        this.popup2 = this.map.openPopup(html1, e.layer.getLatLng());
        //console.log('circlessss id>>>>>', e.layer._leaflet_id);
        this.selectedId = e.layer._leaflet_id;

        this.popup2.on('popupclose', async () => {
          //console.log("data>>>><<<<", this.dataService.getData());
          let data = await this.dataService.getData();
          //console.log("date time--------------",data);
          this.selectedStartDate = data.selectedStartDate;
          this.selectedEndDate = data.selectedEndDate;
          //console.log("shape ID=", e.layer._leaflet_id);


          let x: any = this.Coord.find(a => a.ID === this.selectedId);
          if (x) {
            if (typeof (this.selectedStartDate) == "undefined" || this.selectedStartDate == null) {
              this.selectedStartDate = "";
            }

            if (typeof (this.selectedEndDate) == "undefined" || this.selectedEndDate == null) {
              this.selectedEndDate = "";
            }
            x.selectedStartDate = this.selectedStartDate;
            x.selectedEndDate = this.selectedEndDate;
          }
          //console.log("x", x);



          if (e.layer._leaflet_id == this.clickedShapeID) {

            this.DatingShapes(e);


          }

        });


      });
    // });

   
  }
   else if (e.layerType == "polygon") {
      this.PolygonCoordinate(L.featureGroup, e, e.layer._leaflet_id);
 
       e.layer.on('click', (event: any) => {
              var polygoneArray = [];
        polygoneArray = e.layer._latlngs[0];
      for (const e of polygoneArray) {
        polygoneArray.push([e.lat, e.lng]);
      }
      var getCentroid = function (arr: any) {
        return arr.reduce(function (x: any, y: any) {
          return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length]
        }, [0, 0])
      }
      var centerCoords = getCentroid(polygoneArray);
      var title = '';
      var tooltip = e.layer.unbindTooltip(`${title}`, {
        permanent: true,
        interactive: true,
        noWrap: true,
        opacity: 0.9,
        direction: "center"
      }).openTooltip();
      tooltip.on('click', (event: any) => {
        // this.dialog.open(SaveshapeModalComponent,{
        //   width: '350px',
        // });

        
        if (this.deletingModeEnabled == false) {
          if (tooltip._tooltip) {
            this.tooltipName = tooltip._tooltip._content;
          } else {
            this.tooltipName = '';
          }
          //if(deletStatus == false) {
          if (this.tooltipName != '' && typeof (this.tooltipName) != "undefined") {
            //reenter shape name
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              content: 'Re-Enter Shape Name',
              value: tooltip._tooltip._content
            };
            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
              this.namingshapes(e);

            });

          } else {
            //enter shape name
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              width: '350px',
              content: 'Enter Shape Name',
            };

            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
              this.namingshapes(e);

            });

          }
          if (this.map.getZoom() >= this.clickZoom) {
            var myShapeName = "";
            // if(namingAccess) {
            if (e.layer._tooltip) {
              myShapeName = (e.layer._tooltip._content);
            }
            this.isNotRoute = 1;
            // }
          } else {
            this.map.setView(tooltip._latlngs[0][0], this.clickZoom);
          }
          //}
        }
        else {
          //this.onselectedShape(e.layer);
          //          selectedShapesArray.push(coords.find(a => a.Type === "Route"))
        }
      });

    });
      tooltip.addEventListener('contextmenu', async (event: any) => {

        // this.modalRef =this.modalService.open(this.date);
        //console.log("tooltip>>>", tooltip);
        this.clickedShapeID = tooltip._leaflet_id;

        if (typeof (tooltip._tooltip) != "undefined") {
          //console.log("tooltip._tooltip>>>", tooltip._tooltip._content);
          let x = tooltip._tooltip._content;
          const parts = x.split('<br>');
          const beginOperation = parts[0].split(': ')[1];
          const endOperation = parts[1].split(': ')[1];
          //console.log(beginOperation);
          //console.log(endOperation);
          //const dialogConfig = new MatDialogConfig();
          this.dialogConfig2.disableClose = true;
          this.dialogConfig2.data = {
            width: '400px',
            height: '400px',
            beginOperation: beginOperation,
            endOperation: endOperation
          };
          this.dataService.setStartDate(beginOperation);
          this.dataService.setendDate(endOperation);


        } else {

          // const dialogConfig = new MatDialogConfig();
          this.dataService.setStartDate('');
          this.dataService.setendDate('');


        }
        //////////////here 




        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            DatePickerComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        //componentref.instance.rowData = this.rowData;
        componentref.changeDetectorRef.detectChanges();

        const html1 = componentref.location.nativeElement;
        await html1;


        //console.log('layerrr>>>>', e.layer);

        this.popup2 = this.map.openPopup(html1, [e.layer._latlngs[0][0].lat, e.layer._latlngs[0][1].lng]);
        //console.log('polygonnn id>>>>>', e.layer._leaflet_id);
        this.selectedId = e.layer._leaflet_id;
        this.popup2.on('popupclose', async () => {

          this.map.closePopup(); // Close the Leaflet popup when the close button is clicked
          componentref.destroy();
          //console.log("data>>>><<<<", this.dataService.getData());
          let data = await this.dataService.getData();
          this.selectedStartDate = data.selectedStartDate;
          this.selectedEndDate = data.selectedEndDate;
          //console.log("shape ID=", e.layer._leaflet_id);



          let x: any = this.Coord.find(a => a.ID === this.selectedId);
          if (x) {
            if (typeof (this.selectedStartDate) == "undefined" || this.selectedStartDate == null) {
              this.selectedStartDate = "";
            }

            if (typeof (this.selectedEndDate) == "undefined" || this.selectedEndDate == null) {
              this.selectedEndDate = "";
            }
            x.selectedStartDate = this.selectedStartDate;
            x.selectedEndDate = this.selectedEndDate;
          }
          //console.log("x", x);

          if (e.layer._leaflet_id == this.clickedShapeID) {
            this.DatingShapes(e);

          }
        });





      });

   
   } else if (e.layerType == "rectangle") {
      this.RectangleCoordinate(L.featureGroup, e, e.layer._leaflet_id);
     
      // e.layer.on('click', (event: any) => { 
        var polygoneArray = [];
      var polygoneArryObject = e.layer._latlngs[0];
      for (const e of polygoneArryObject) {
        polygoneArray.push([e.lat, e.lng]);
      }
      var getCentroid = function (arr: any) {
        return arr.reduce(function (x: any, y: any) {
          return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length]
        }, [0, 0])
      }
      var centerCoords = getCentroid(polygoneArray);
      var title = '';
      var tooltip = e.layer.unbindTooltip(`${title}`, {
        permanent: true,
        direction: "center"
      }).openTooltip();
      tooltip.on('click', (event: any) => {
        // this.dialog.open(SaveshapeModalComponent,{
        //   width: '350px',
        // });
        if (this.deletingModeEnabled == false) {

        if (this.deletingModeEnabled == false) {
          if (tooltip._tooltip) {
            this.tooltipName = tooltip._tooltip._content;
          } else {
            this.tooltipName = '';
          }
          // if(deletStatus == false) {
          if (this.tooltipName != '' && typeof (this.tooltipName) != "undefined") {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              content: 'Re-Enter Shape Name',
              value: tooltip._tooltip._content
            };
            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
              this.namingshapes(e);

            });
          } else {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              width: '350px',
              content: 'Enter Shape Name',
            };

            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
              this.namingshapes(e);

            });
          }

          if (this.map.getZoom() >= this.clickZoom) {
            var myShapeName = "";
            //  if(namingAccess) {
            if (e.layer._tooltip) {
              myShapeName = (e.layer._tooltip._content);
            }
            this.isNotRoute = 1;
            // }
          } else {
            this.map.setView(tooltip._latlngs[0][0], this.clickZoom);
          }
          // }
        }

        else {
        }
      }
      });

      tooltip.addEventListener('contextmenu', async (event: any) => {
        // alert("right click rectangle")

        // this.modalRef =this.modalService.open(this.date);
        //console.log("tooltip>>>", tooltip);
        this.clickedShapeID = tooltip._leaflet_id;

        if (typeof (tooltip._tooltip) != "undefined") {
          //console.log("tooltip._tooltip>>>", tooltip._tooltip._content);
          let x = tooltip._tooltip._content;
          const parts = x.split('<br>');
          const beginOperation = parts[0].split(': ')[1];
          const endOperation = parts[1].split(': ')[1];
          //console.log(beginOperation);
          //console.log(endOperation);
          //const dialogConfig = new MatDialogConfig();
          this.dialogConfig2.disableClose = true;
          this.dialogConfig2.data = {
            width: '400px',
            height: '400px',
            beginOperation: beginOperation,
            endOperation: endOperation
          };
          this.dataService.setStartDate(beginOperation);
          this.dataService.setendDate(endOperation);


        } else {

          this.dataService.setStartDate('');
          this.dataService.setendDate('');



        }
        //////////////here 




        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            DatePickerComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        //componentref.instance.rowData = this.rowData;
        componentref.changeDetectorRef.detectChanges();

        const html1 = componentref.location.nativeElement;
        await html1;


        //console.log('layer>>>>>', e.layer)

        this.popup2 = this.map.openPopup(html1, [e.layer._latlngs[0][0].lat, e.layer._latlngs[0][1].lng]);
        //console.log('rectangle id>>>>>', e.layer._leaflet_id);
        this.selectedId = e.layer._leaflet_id;
        this.popup2.on('popupclose', async () => {


          //console.log("data>>>><<<<", this.dataService.getData());
          let data = await this.dataService.getData();
          this.selectedStartDate = data.selectedStartDate;
          this.selectedEndDate = data.selectedEndDate;
          //console.log("shape ID=", e.layer._leaflet_id);


          let x: any = this.Coord.find(a => a.ID === this.selectedId);
          if (x) {
            if (typeof (this.selectedStartDate) == "undefined" || this.selectedStartDate == null) {
              this.selectedStartDate = "";
            }

            if (typeof (this.selectedEndDate) == "undefined" || this.selectedEndDate == null) {
              this.selectedEndDate = "";
            }
            x.selectedStartDate = this.selectedStartDate;
            x.selectedEndDate = this.selectedEndDate;
          }
          //console.log("x", x);



          if (e.layer._leaflet_id == this.clickedShapeID) {
            this.DatingShapes(e);

          }
        });





      });

    // });
   
   
   }
    else if (e.layerType == "polyline") {
      this.PolylineCoordinate(L.featureGroup, e, e.layer._leaflet_id);
      e.layer.on('click', (event: any) => {
      var polylinePointsArray = [];
      var polylinePointsDrawn = 0;
      var polylineArray = [];
      var polylineArrayObject = e.layer._latlngs;
      
      for (const e of polylineArrayObject) {
        polylineArray.push([e.lat, e.lng]);
      }
      var getCentroid = function (arr: any) {
        return arr.reduce(function (x: any, y: any) {
          return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length]
        }, [0, 0])
      }
      var centerCoords = getCentroid(polylineArray);
      var title = '';
      var tooltip = e.layer.unbindTooltip(`${title}`, {
        permanent: true,
        direction: "center"
      }).openTooltip();
      tooltip.on('click', (event: any) => {
        // this.dialog.open(SaveshapeModalComponent,{
        //   width: '350px',
        // });
        if (this.deletingModeEnabled == false) {
          if (tooltip._tooltip) {
            this.tooltipName = tooltip._tooltip._content;
          } else {
            this.tooltipName = '';
          }
          // if(deletStatus == false) {
          if (this.tooltipName != '' && typeof (this.tooltipName) != "undefined") {
            //reenter shape name
            //console.log("tooltip",tooltip)
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              content: 'Re-Enter Shape Name',
              value: tooltip._tooltip._content
            };
            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
              this.namingshapes(e);

            });

          } else {
            //enter shape name
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              width: '350px',
              content: 'Enter Shape Name',
            };

            const dialogRef = this.dialog.open(SaveshapeModalComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
              this.namingshapes(e);

            });
          }

          if (this.map.getZoom() >= this.clickZoom) {
            var myShapeName = "";
            //  if(namingAccess) {
            if (e.layer._tooltip) {
              myShapeName = (e.layer._tooltip._content);
            }
            this.isNotRoute = 1;
            // }
          } else {
            this.map.setView(tooltip._latlngs[0], this.clickZoom);
          }
          //  }
        }
        else {
          //  this.onselectedShape(e.layer);
          //          selectedShapesArray.push(coords.find(a => a.Type === "Route"))
        }


      });
    });
      tooltip.addEventListener('contextmenu', async (event: any) => {
        // alert("right click polyline");

        // this.modalRef =this.modalService.open(this.date);
        //console.log("tooltip>>>", tooltip);
        this.clickedShapeID = tooltip._leaflet_id;

        if (typeof (tooltip._tooltip) != "undefined") {
          //console.log("tooltip._tooltip>>>", tooltip._tooltip._content);
          let x = tooltip._tooltip._content;
          const parts = x.split('<br>');
          const beginOperation = parts[0].split(': ')[1];
          const endOperation = parts[1].split(': ')[1];
          //console.log(beginOperation);
          //console.log(endOperation);
          //const dialogConfig = new MatDialogConfig();
          this.dialogConfig2.disableClose = true;
          this.dialogConfig2.data = {
            width: '400px',
            height: '400px',
            beginOperation: beginOperation,
            endOperation: endOperation
          };
          this.dataService.setStartDate(beginOperation);
          this.dataService.setendDate(endOperation);


        } else {

          // const dialogConfig = new MatDialogConfig();
          this.dataService.setStartDate('');
          this.dataService.setendDate('');



        }




        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            DatePickerComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        //componentref.instance.rowData = this.rowData;
        componentref.changeDetectorRef.detectChanges();

        const html1 = componentref.location.nativeElement;
        await html1;


        //console.log('layer>>>>>', e.layer)

        this.popup2 = this.map.openPopup(html1, [e.layer._latlngs[0].lat, e.layer._latlngs[0].lng]);
        //console.log('polyline id>>>>>', e.layer._leaflet_id);
        this.selectedId = e.layer._leaflet_id;
        this.popup2.on('popupclose', async () => {
          //console.log("data>>>><<<<", this.dataService.getData());
          let data = await this.dataService.getData();
          this.selectedStartDate = data.selectedStartDate;
          this.selectedEndDate = data.selectedEndDate;
          //console.log("shape ID=", e.layer._leaflet_id);

          let x: any = this.Coord.find(a => a.ID === this.selectedId);
          if (x) {
            if (typeof (this.selectedStartDate) == "undefined" || this.selectedStartDate == null) {
              this.selectedStartDate = "";
            }

            if (typeof (this.selectedEndDate) == "undefined" || this.selectedEndDate == null) {
              this.selectedEndDate = "";
            }
            x.selectedStartDate = this.selectedStartDate;
            x.selectedEndDate = this.selectedEndDate;
          }
          //console.log("x", x);
          //console.log("Coord<><><><<><><>", this.Coord);


          if (e.layer._leaflet_id == this.clickedShapeID) {
            this.DatingShapes(e);

          }
        });





    

    });
   }

    //console.log("coord final>>",this.Coord);
    this.isDrawingInProgress = true;

  }
  startTimeline() {
    // $('.timeline').css('display', 'none');
    $('.tabletest').css('display', 'none');


    this.openTable=false;
    this.ShowTimeline = true;
    this.showbarstart=true;
    this.showbarreverse=false;
    //console.log("starttimeline>>>>>>>>>>>>>");
    this.Datatable=[];
    this.Datatablereverse=[];
    this.openTable=true;
    //console.log("4444444444444444--------",this.Datatable1.length);
    //console.log("333333333333333333--------",this.index);

    this.Datatable1=[...this.Datatable1.slice(0, this.Datatable1.length-this.index)];
    //console.log("11111111111111111--------",this.Datatable1);
    //console.log("2222222222222222--------",this.Datatable1.length);
    this.index=0;
    this.isRunning = true;
    this.ImgFirstCoord=L.latLng(this.CdrData.CDR[0].IMSILocation[0][0],this.CdrData.CDR[0].IMSILocation[0][1]);
    //console.log('ImgFirstCoord',this.ImgFirstCoord);
    this.startLoop();
    $('#tabledatabtn').css('display', '');

  }

  ReverseTimeline() {
    this.ShowTimeline = true;
    this.showbarreverse = true;
    this.showbarstart=false;
    this.openTable=false;
    this.Datatable=[];
    // this.Datatablereverse=[];

    //console.log("starttimeline>>>>>>>>>>>>>");

    this.isRunning = true;
    this.openTable=true;

    this.reverseloop();

  }

  resetTimeline(){
    $('#tabletest').css('display', 'none');
    this.openTable=false;
    this.showbarstart=false;
    this.showbarreverse = false;
    this.Datatable=[];
    this.Datatable1=[];
    this.index=0;
    this.Datatablereverse=[];
    this.speedTime=1;
    this.sectorarray.forEach((element:any,key:any)=>{
      element.setStyle({
        fillOpacity: 0.3,
        color: this.SectorColor,
        fillColor: this.SectorColor,
      });
    });
    this.indexTimeline=0;
  }


  reverseloop() {
    let imsilocation:any=this.GroupIMSI(this.CdrData.CDR[0].IMSILocation);

    if (!this.isRunning || this.indexTimeline < 1) {
   
      if (this.indexTimeline < 1) {
        Swal.fire({
          text: 'Reverse Timeline Finished!!!',
          icon: 'warning',
          // showCancelButton: true,
        });
      }

      return;
    }

    let xElement = imsilocation[this.indexTimeline];

    let findedSector2: any = this.sectorarray.filter((sector: any) => {
      return sector.Azimuth == xElement[0][2] && sector.lng === xElement[0][1] && sector.lat === xElement[0][0];
    });

    //console.log('findedSector2', findedSector2);
    for(let i =0;i<xElement[1].length;i++){
    //console.log('xElement[1][i]',xElement[1][i]);

      let x = {
        Time: this.dateTtoDate(xElement[1][i]),
        event: 'calls',
        Lng: xElement[0][1],
        lat: xElement[0][0]
      }
      //console.log('x', x);

      this.index++;
      this.tablerow++;
      this.Datatablereverse.unshift(x);
      this.Datatable=this.Datatablereverse;
      //  this.Datatable.unshift(x);
       $('#firstpage').click();
       //console.log("Datatablereverse----------",this.Datatablereverse);


      // this.Datatable1=  this.Datatable1.filter(x => !this.Datatablereverse.includes(x));
     
    }

      //  this.Datatable2= this.Datatable1.filter(item=> 
      //  {//console.log("item----------",item);
      //  //console.log("Datatablereverse[this.index]--------",this.Datatablereverse[this.index]);

      //   item !== this.Datatablereverse[this.index]
      // });

      // this.Datatable1 = this.Datatable1.filter((item:any,index:any) =>
      //  {
      //   //console.log("111111111111111111111111----------",this.Datatablereverse.includes(item));
      //   //console.log("222222222222222----------",item);

      //   !this.Datatablereverse.includes(item)
      // }
      //  );

       //console.log("indexxxxx----------",this.index);

    // const array3 = array1.filter((n) => !array2.includes(n));
    //  this.Datatable1=  this.Datatable1.map((item, index) => item - this.Datatablereverse[index]);
    // //console.log("Datatablereverse after reverse--------",this.Datatablereverse);
    //console.log("Datatablereverse lengthhhhhhhh--------",this.Datatablereverse.length);
    //console.log("Datatable1 lengthhhhhhhh--------",this.Datatable1.length);

    if (findedSector2.length > 0) {
      for (let j = 0; j < 5; j++) {
        setTimeout(() => {

          //console.log('j>>>', j);
          if (j == 0) {
            //console.log('on when j =0>>>', j);

            findedSector2[0].setStyle({
              fillOpacity: 0.7,
              opacity: 0.7,
              color: this.SectorColor,
              fillColor: this.SectorColor,
            });
          } else {
            if (findedSector2[0].options.fillOpacity === 0.7) {
              // Sector is currently "on", turn it "off"
              //console.log('off>>>', j);

              findedSector2[0].setStyle({
                fillOpacity: 0,
                opacity: 0,
              });
            } else {
              // Sector is currently "off", turn it "on"
              //console.log('on>>>', j);

              findedSector2[0].setStyle({
                fillOpacity: 0.7,
                opacity: 0.7,
                color: this.SectorColor,
              fillColor: this.SectorColor,
              });
            }
          }


        }, (250 * j) / this.speedTime); // This will delay each iteration by 2

      }
      let linestring:number=0;
      linestring=this.ImgFirstCoord.distanceTo(L.latLng(xElement[0][0],xElement[0][1]));
      //console.log('linestring between '+this.ImgFirstCoord+' and '+L.latLng(xElement[0][0],xElement[0][1])+' is ',linestring);
// let linestring= latlngs[i].distanceTo(latlngs[i + 1];
if(this.indexTimeline==1){
  this.map.setView([findedSector2[0].lat, findedSector2[0].lng], 15);

}else{ 
  if(linestring<2472){

  }else{
    this.map.setView([findedSector2[0].lat, findedSector2[0].lng], 15);
    this.ImgFirstCoord=L.latLng([xElement[0][0],xElement[0][1]]);
  }
}

      this.selectedTime = xElement[1];


    }


    setTimeout(async () => {
      //console.log('speed', this.speedTime)
      this.indexTimeline = this.indexTimeline - 1;
      //console.log('indexTimeline', this.indexTimeline)

      await this.reverseloop();
    }, 4000 / this.speedTime);
  }



  startLoop() {

    let imsilocation:any=this.GroupIMSI(this.CdrData.CDR[0].IMSILocation)
 
    // let imsilocation:any=this.CdrData.CDR[0].IMSILocation;
    

    //console.log('imsilocation',imsilocation);
    if (!this.isRunning || this.indexTimeline >= imsilocation.length) {
      if (this.indexTimeline >= imsilocation.length) {
        Swal.fire({
          text: 'Timeline Finished!!!',
          icon: 'warning',
          // showCancelButton: true,
        });
      }
      return;
    }

    let xElement = imsilocation[this.indexTimeline];
    //console.log("xElement------------",xElement)
    let findedSector2: any = this.sectorarray.filter((sector: any) => {
      return sector.Azimuth == xElement[0][2] && sector.lng === xElement[0][1] && sector.lat === xElement[0][0];
    });

    //console.log('findedSector2', findedSector2);

    for(let i =0;i<xElement[1].length;i++){

      let x:any = {
        // imsi:xElement[1][i],
        Time: this.dateTtoDate(xElement[1][i]),
        event: 'calls',
        Lng: xElement[0][1],
        lat: xElement[0][0],
      }
      // this.Datatable.push(x);
      this.tablerow++;
      this.Datatable1.unshift(x);
      this.Datatable=this.Datatable1;
      //  this.Datatable.unshift(x);
       
      // this.Datatable=x;
      //console.log('in map2---------',this.Datatable);
      $('#firstpage').click();
    }
    //console.log("datable11111111111111 --------",this.Datatable1.length);
    
    if (findedSector2.length > 0) {
      for (let j = 0; j < 5; j++) {
        setTimeout(() => {

          if (j == 0) {

            findedSector2[0].setStyle({
              fillOpacity: 0.7,
              opacity: 0.7,
              color: this.currentSectorColor,
              fillColor: this.SectorFillColor,
            });
          } else {
            if (findedSector2[0].options.fillOpacity === 0.7) {
              // Sector is currently "on", turn it "off"
              //console.log('off>>>', j);

              findedSector2[0].setStyle({
                fillOpacity: 0,
                opacity: 0,
              });
            } else {
              // Sector is currently "off", turn it "on"
              //console.log('on>>>', j);

              findedSector2[0].setStyle({
                fillOpacity: 0.7,
                opacity: 0.7,
                color: this.currentSectorColor,
                fillColor: this.SectorFillColor,
              });
            }
          }


        }, (250 * j) / this.speedTime); // This will delay each iteration by 2

      }
      let linestring:number=0;
      linestring=this.ImgFirstCoord.distanceTo(L.latLng(xElement[0][0],xElement[0][1]));
// let linestring= latlngs[i].distanceTo(latlngs[i + 1];
if(this.indexTimeline==1){
  this.map.setView([findedSector2[0].lat, findedSector2[0].lng], 15);

}else{ 
  if(linestring<2472){

  }else{
    this.map.setView([findedSector2[0].lat, findedSector2[0].lng], 15);
    this.ImgFirstCoord=L.latLng([xElement[0][0],xElement[0][1]]);
  }
}

      this.selectedTime = xElement[1];


    }

    setTimeout(async () => {
      //console.log('speed', this.speedTime)
      this.indexTimeline = this.indexTimeline + 1;
      await this.startLoop();
    }, 4000 / this.speedTime);
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopTimeline() {
    this.isRunning = false;
    // clearInterval(this.interval);
  }

  updateTime() {
    // clearInterval(this.interval);
  }
  enableEditing() {
    const options = {
      edit: {
        featureGroup: this.drawnItems,
      },
    };
  }



  clearShapes() {

    if(this.flagInQueue == 0){
      this.inQueueArray =[];
      this.executeOfflineId ="";
    }
    //console.log("in clearshapes>>>>>>")
    this.reportName = "";
    this.Coord = [];
    if (typeof this.layerGroup != "undefined") {
      this.layerGroup.clearLayers();
    }
    this.deletingModeEnabled = false;
    this.datingModeEnabled = false;
    this.selectedStartDate = "";
    this.selectedEndDate = "";

    this.drawnItems.clearLayers();
    if (this.marker) {
      this.marker.clearLayers();

    }
    if (this.marker) {
      this.map.removeLayer(this.marker);

    }

    if (this.markerLoop) {
      this.markerLoop.clearLayers();

    }
    if (this.markerLoop) {
      this.magnifiedMap.removeLayer(this.markerLoop);

    }
  
    if (this.deviceMarkersClusters) {
      this.map.removeLayer(this.deviceMarkersClusters);

    }
    if (this.markers) {
      this.map.removeLayer(this.markers);

    }
    if (this.circle) {
      this.map.removeLayer(this.circle);

    }
    if (this.polyline) {
      this.map.removeLayer(this.polyline);

    }
    if (this.polygon) {
      this.map.removeLayer(this.polygon);

    }
    if (this.myMarker) {
      this.map.removeLayer(this.myMarker);

    }


    if (this.fixedMarkersGroup) {
      this.map.removeLayer(this.fixedMarkersGroup);

    }
    if (this.fixedElementMarker) {
      this.map.removeLayer(this.fixedElementMarker);

    }

    if (this.fixedMarkersGroupLoop) {
      this.magnifiedMap.removeLayer(this.fixedMarkersGroupLoop);

    }
    if (this.fixedElementMarkerLoop) {
      this.magnifiedMap.removeLayer(this.fixedElementMarkerLoop);

    }

    if (this.singledeviceMarkersClusters) {
      this.map.removeLayer(this.singledeviceMarkersClusters);
      this.singledeviceMarkersClusters.clearLayers();


    }
    if (this.locationCenter != null) {
      this.map.removeLayer(this.locationCenter);
    }


    if (this.fixedMarkersArray.length > 0) {
      this.map.removeLayer(this.fixedMarkersGroup);
      this.fixedMarkersArray = [];
    }

    if (this.fixedMarkersArrayLoop.length > 0) {
      this.magnifiedMap.removeLayer(this.fixedMarkersGroupLoop);
      this.fixedMarkersArrayLoop = [];
    }

    if (this.markerclusterControl) {
      -
      this.map.removeLayer(this.markerclusterControl);

    }


    this.markersArray.forEach((element: any, key: any) => {
      this.marker.removeLayer(element);
      this.map.removeLayer(element);


    })

  


    for (const layer of this.polylinearray) {
      this.map.removeLayer(layer);
    }

    for (const layer of this.drawnLayers) {
      this.map.removeLayer(layer);
    }

    // for (const layer of this.polylinearray) {
    //   this.map.removeLayer(layer);
    // }


    // this.map.removeLayer(this.drawnLayer);


    if (typeof this.polygon != "undefined") {
      this.map.removeLayer(this.polygon);
    }
    if (typeof this.circle != "undefined") {
      this.map.removeLayer(this.circle);
    }
    if (typeof this.rectangle != "undefined") {
      this.map.removeLayer(this.rectangle);
    }
    if (typeof this.polyline != "undefined") {
      this.map.removeLayer(this.polyline);
    }
    if (typeof this.marker != "undefined") {
      this.map.removeLayer(this.marker, this.markerIcon);
    }
    if (typeof this.markerIcon != "undefined") {
      this.map.removeLayer(this.markerIcon);
    }
    if (this.heat) {
      this.map.removeLayer(this.heat);

    }

    if (this.cotravelermarker) {
      this.map.removeLayer(this.cotravelermarker);

    }
    if (this.isSimul == true) {
      //console.log("clearforsimul>>>>");
      (window.parent.parent.parent[7] as any).clearforsimul();

    }
    else {
      //console.log("clearshapes>>>>");
// if((window.parent.parent.parent[7] as any)){
//   (window.parent.parent.parent[7] as any).clearshapes();

// }

    }



    if (this.layerControl) {
      this.map.removeControl(this.layerControl);
      this.layerControl.remove();
    }

    if (this.controlLayers) {
      this.controlLayers.remove();

    }


    if (this.thisshape) {
      this.map.removeLayer(this.thisshape);
    }

    localStorage.clear();
    //console.log('ang isMapAngular  7 >>', (window.parent.parent.parent[7] as any));
    $('#controlbutton').css('display', 'none');

    if (this.layerControl2) {
      //this.map.removeControl(this.layerControl2);
      //console.log("myControl>>>>>>>>>>>>>", $('#myControl'))

      this.layerControl2 = null;
      //  $('#myControl').css('display','none');
      $('#myControl').remove();
      this.datasource = [];
    }

    this.animatedmarkerArray.forEach((element: any, key: any) => {
      this.map.removeLayer(element);
    });

    if (this.map && this.routingControlArray.length > 0) {
      this.routingControlArray.forEach((control: any) => {
          control.remove(); // Remove from the map
      });
      this.routingControlArray = []; // Empty the array
  }

    this.multiselection = [];
    this.AoiIds = [];
    this.objAoi = [];
    this.shapeName = "";
    this.shapesArray = [];
    this.shapesDataArray = [];
    this.Aoiresp = [];
    this.fixedElementMarker = [];
    this.fixedElementMarkerLoop = [];
    this.fixedMarkersArray = [];
    this.fixedMarkersArrayLoop = [];
    this.ObjectID = [];
    this.isAOi = false;
    this.isSimul = false;
    this.markersArray = [];
    this.isFixedElements = false;
    this.Devices = [];
    this.datasource = [];
    this.isSqlCond = "";
    this.Datatable1=[];
    this.Datatable=[];
    this.Datatablereverse=[];
    this.index=0;
    this.displaysectors=false;
    this.displayclusters=false;
    this.dimmedPrev=false;
    this.dimmedNext=false;
    this.count=0;
    this.animatedmarkerArray=[];
    this.deviceIdArr=[];
    this.routingTools=false;
    this.displayRoute=false;
    // (window.parent.parent.parent[7] as any).A_IsSimul=false;
    // (window.parent.parent.parent[7] as any).A_isAOi=false;
    // (window.parent.parent.parent[7] as any).A_AoiIds=[];
    // (window.parent.parent.parent[7] as any).A_isFixedElements=false;

    //console.log("coord after clear", this.Coord);

    //console.log("fixedMarkersArray after clear", this.fixedMarkersArray);
    this.datacrowdService.deleteLastSimualtionID(this.usercode);
    //console.log("searchlocation>>>>><<<<", $("#searchlocation"));
    $('#searchlocation').val('');
    this.dataService.setData('');
    this.tooltipInstanceArray = [];
    this.fixedelementsObject = "";

    this.markerControlArray.forEach((element: any, key: any) => {


      this.map.removeLayer(element);

    });

    this.markerControlArray = [];

    if (this.sector) {
      this.map.removeLayer(this.sector);

    }
    
    if (this.sectorLoop) {
      this.magnifiedMap.removeLayer(this.sectorLoop);

    }

    for (const layer of this.sectorarray) {
      this.map.removeLayer(layer);
    }

    this.sectorarray = [];

    for (const layer of this.sectorarrayLoop) {
      this.magnifiedMap.removeLayer(layer);
    }

    this.sectorarrayLoop = [];


    for (const layer of this.routeDeviceArrayLoop) {
      this.magnifiedMap.removeLayer(layer);
    }

    this.routeDeviceArrayLoop = [];

    for (const layer of this.routeDeviceArray) {
      this.map.removeLayer(layer);
    }

    this.routeDeviceArray = [];

    this.isTcd = false;
    this.indexTimeline = 0;
    this.isRunning = false;

    $('.timeline').css('display', 'none');
    for (const marker of this.allMarkers) {
      this.map.removeLayer(marker);
    }
    this.allMarkers=[];
    this.CdrRowData=[];
    this.CdrRowData2=[];
    this.openTable = false;
this.ImsiID="";
this.devaddgrparray=[];
this.hitsaddgrpnb=[];
    this.devicesArray=[];
this.showbarstart=false;
this.routingicons.forEach((element: any) => {
  this.map.removeLayer(element);
});
this.routingicons=[];

this.routingpolyline.forEach((element: any) => {
  this.map.removeLayer(element);
});
this.routingpolyline=[];
this.BtsTypeSlected=null;
this.routedatajson=[];
    this.routeDevicestable=[];
    this.routeDevices=[];
    this.datajson=[];
// this.dataService.setroutedevices("");
  }


  onMapReady(map: L.Map) {

    map.on('draw:deletestart', this.onDeleteStart.bind(this));
    $('.leaflet-draw').css('display', 'none');


    //  // Set cursor icon
    //  this.map.getContainer().style.cursor = 'url(src/assets/images\searchIcon.png), auto';
   

    this.map = map;
    map.zoomControl.remove();

    // document.getElementById('map').addEventListener('mousemove', (e:any)=> {
    //   this.updateMagnifyingGlass(e);
   
    // });

    // $('.leaflet-control-fullscreen-button').click(function() {
    //   // $(".leaflet-control-fullscreen").css("top","922px ");
    //   // $(".leaflet-control-measure").css("left","-1050px ");
    //   alert("in")


    // });

    //     document.addEventListener('fullscreenchange', (event) => {
    //       if (!document.fullscreenElement) {
    //         // Full screen mode has been exited
    //       // $(".leaflet-control-fullscreen").css("top","660px ");
    //       // $(".leaflet-control-measure").css("left","-950px ");

    //       //   var mapElement = $(".map");
    //       // var mapElement = document.getElementById('my-map');
    //       // //console.log("fullscreenchange out",mapElement);
    //       // mapElement.dispatchEvent(new Event('focus'));
    //       // //console.log("fullscreenchange out")
    // }
    //     });



  
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const type = e.layerType,
        layer = e.layer;

      if (type === "polygon") {
        const latlngs = layer.getLatLngs();
        //console.log(latlngs);
      } else if (type === "polyline") {
        const latlngs = layer.getLatLngs();
        //console.log(latlngs);
      } else if (type === "rectangle") {
        const bounds = layer.getBounds();
        //console.log(bounds);
      } else if (type === "circle") {
        const latlng = layer.getLatLng();
        const radius = layer.getRadius();
        this.coords = latlng + "," + radius;
      } else if (type === "marker") {
        const latlng = layer.getLatLng();
        //console.log(latlng);
      }

      map.addLayer(layer);

    });

//  // Show the magnifying glass when the mouse enters the map
//  document.getElementById('map').addEventListener('mouseenter', (e:any)=> {
//   const magnifyingGlass = document.getElementById('magnifying-glass');
//   magnifyingGlass.style.display = 'block';
//   this.updateMagnifyingGlass(e);
// });

// // Hide the magnifying glass when the mouse leaves the map
// document.getElementById('map').addEventListener('mouseleave', () =>{
//   const magnifyingGlass = document.getElementById('magnifying-glass');
//   magnifyingGlass.style.display = 'none';
// });

// Update the magnifying glass position and background image on mouse move

// document.getElementById('map').addEventListener('mousemove', (e:any)=> {
//   this.updateMagnifyingGlass(e);
// });


    // const baseLayers = {
    //   'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: 'Map data Â© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    //   }),
    //   'Satellite Map': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    //     attribution: 'Map data Â© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    //   })
    // };

    //L.control.layers(baseLayers).addTo(this.map);
    //baseLayers['Street Map'].addTo(this.map);
    //   var heat = L.heatLayer(heatCoords, {
    //     radius: 20
    //   });
    //  let  activityDensity = heat.addTo(map);



  }

  enableEdit(e: any) {
    var selectedFeature: any[] = [];
    this.map.eachLayer(function (layer: any) {
      // //console.log(layer);
      if (layer instanceof L.Polygon) {
        //console.log(layer);
        layer.on("click", function (e) {
          if (selectedFeature)
            //selectedFeature.editing.disable();
            selectedFeature = e.target;
          e.target.editing.enable();
        });
      }
    });
  }
  polygonDrawer: L.Draw.Polygon = null;
  startDraw() {
    const polygon_options = {
      showArea: false,
      shapeOptions: {
        stroke: true,
        color: "#6e83f0",
        weight: 4,
        opacity: 0.5,
        fill: true,
        fillColor: "", //same as color by default
        fillOpacity: 0.5,
        clickable: true,
      },
    };
    this.polygonDrawer = new L.Draw.Polygon(this.map, polygon_options);
    this.polygonDrawer.enable();
  }

  stopDraw() {
    this.polygonDrawer.disable();
  }

  removeLastDot() {
    this.polygonDrawer.deleteLastVertex();
  }

  clickLeaf(data: any) {
    // this.enableEdit(data);
    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      //console.log('event>>>> CREATED', event);
   

    });

    this.map.on(L.Draw.Event.DRAWSTART, () => {
      // Disable clicking on shapes until drawing is finished
      this.isDrawingFinished = false;
      //  alert("start ")
    });

    this.map.on(L.Draw.Event.DRAWSTOP, () => {
      // Enable clicking on shapes as drawing is finished
      setTimeout(() => {
        this.isDrawingFinished = true;
      // alert("finished ")

      }, 1000); // Set to true after 2 seconds      // alert("end ")

    });
    this.map.on(L.Draw.Event.DELETED, (event: L.DrawEvents.Deleted) => {
      event.layers.eachLayer((layer: any) => {
        //console.log('Deleted layer', layer);
        const deletedLayerID = layer._leaflet_id; // assuming you have assigned an ID to each layer
        //console.log('Deleted layer ID:', deletedLayerID);
        var items = this.Coord.filter((item: any) => item.ID !== deletedLayerID);
        //console.log('Coord after remove the layer>>>:', items);
        this.Coord = items;
        // localStorage.setItem("coords", JSON.stringify(this.Coord));

      });
    });

    this.map.on(L.Draw.Event.EDITED, (event: L.DrawEvents.Edited) => {
      event.layers.eachLayer((layer: any) => {
        //console.log('Edited layer', layer);
        const deletedLayerID = layer._leaflet_id; // assuming you have assigned an ID to each layer
        //console.log('Edited layer ID:', deletedLayerID);

        var items: any = this.Coord.filter((item: any) => item.ID === deletedLayerID);
        //console.log('item:', items);
        //console.log('item shape:', items[0].Type);
        const editedShapeType = items[0].Type
        if (editedShapeType == 'Circle') {
          let coordafteredit = this.editCircleCoordinate(layer);
          items = coordafteredit;
          //console.log("Coord>>>>", this.Coord);
          // localStorage.setItem("coords", JSON.stringify(this.Coord));
        } else if (editedShapeType == 'Polygon') {
          let coordafteredit = this.editPolygonCoordinate(layer);
          items = coordafteredit;
          //console.log("Coord>>>>", this.Coord);
          // localStorage.setItem("coords", JSON.stringify(this.Coord));
        } else if (editedShapeType == 'Rectangle') {
          let coordafteredit = this.editRectangleCoordinate(layer);
          items = coordafteredit;
          //console.log("Coord>>>>", this.Coord);
          //  localStorage.setItem("coords", JSON.stringify(this.Coord));
        } else if (editedShapeType == 'Polyline') {
          let coordafteredit = this.editPolylineCoordinate(layer);
          items = coordafteredit;
          //console.log("Coord>>>>", this.Coord);
          //  localStorage.setItem("coords", JSON.stringify(this.Coord));
        }




      });
    });



  }


  async CircleCoordinate(featureGroup: any, shape: any, shapeId: any) {
    var shapeLeafletId = shape.layer._leaflet_id;
    ////console.log("shape>>>>>>>>",shape);

    if (shape.layer._mRadius >= this.circleLimit) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Circle limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(shape.layer);


      });

    } else {

      

      this.deletedLimit = true;
      var radius = shape.layer.getRadius();
      var circleCenterPoint = shape.layer.getLatLng();
      console.log('circleCenterPoint-------',circleCenterPoint)
      var Circlecoords = "";
      var point = circleCenterPoint;
      var circleCoordsArray = [];
      if (this.dbtype != "Cassandra") {
        var fixedlng = point.lng;
        var fixedlat = point.lat;
        fixedlng = Number(fixedlng.toFixed());
        fixedlat = Number(fixedlat.toFixed());
        this.standard = Number(this.standard.toFixed());
        point = {
          lat: fixedlat,
          lng: fixedlng,
        };
        var latpoint = fixedlat;
        while (Math.abs(circleCenterPoint.distanceTo(point)) <= radius) {
          latpoint = Number((latpoint + this.standard).toFixed());
          for (
            var lngpoint = fixedlng;
            Math.abs(circleCenterPoint.distanceTo(point)) <= radius;
            lngpoint += this.standard
          ) {
            lngpoint = Number(lngpoint.toFixed());
            point = {
              lat: latpoint,
              lng: lngpoint,
            };
            Circlecoords += "(" + latpoint + "," + lngpoint + "),";
            circleCoordsArray.push(point);
          }
          point = {
            lat: fixedlat,
            lng: fixedlng,
          };
          for (
            var lngpoint = fixedlng;
            Math.abs(circleCenterPoint.distanceTo(point)) <= radius;
            lngpoint -= this.standard
          ) {
            lngpoint = Number(lngpoint.toFixed());
            point = {
              lat: latpoint,
              lng: lngpoint,
            };
            Circlecoords += "(" + latpoint + "," + lngpoint + "),";
            circleCoordsArray.push(point);
          }
          point = {
            lat: latpoint,
            lng: fixedlng,
          };
        }
        point = {
          lat: fixedlat,
          lng: fixedlng,
        };
        latpoint = fixedlat + this.standard;
        while (Math.abs(circleCenterPoint.distanceTo(point)) <= radius) {
          latpoint = Number((latpoint - this.standard).toFixed());
          for (
            var lngpoint = fixedlng + this.standard;
            Math.abs(circleCenterPoint.distanceTo(point)) <= radius;
            lngpoint += this.standard
          ) {
            lngpoint = Number(lngpoint.toFixed());
            point = {
              lat: latpoint,
              lng: lngpoint,
            };
            Circlecoords += "(" + latpoint + "," + lngpoint + "),";
            circleCoordsArray.push(point);
          }
          point = {
            lat: fixedlat,
            lng: fixedlng,
          };
          for (
            var lngpoint = fixedlng;
            Math.abs(circleCenterPoint.distanceTo(point)) <= radius;
            lngpoint -= this.standard
          ) {
            lngpoint = Number(lngpoint.toFixed());
            point = {
              lat: latpoint,
              lng: lngpoint,
            };
            Circlecoords += "(" + latpoint + "," + lngpoint + "),";
            circleCoordsArray.push(point);
          }
          point = {
            lat: latpoint,
            lng: fixedlng,
          };
        }


        //alert("in circle Coordinate")
        this.Coord.push({
          ID: shapeId,
          Name: "",
          Value: circleCoordsArray,
          Type: "Circle",
          Bounds: "",
          radius: radius,
          center: circleCenterPoint,
          leafletid: shapeLeafletId,
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",
        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          Value: Circlecoords,
          Type: "Circle",
          radius: radius,
          center: circleCenterPoint,
          leafletid: shapeLeafletId,
          Bounds: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",
        });
      } else {
        //console.log("geoJsonLayer ",this.geoJsonLayer);
        //console.log("shape.layer>>>>> ",shape.layer);

      let  C_countryCodes:any
        
  //      let zz:any= this.determineIntersectingRegions(shape.layer,this.geojsonData,'circle');
  //      //console.log("zz ",zz);

  //     //  const defaultValueUrl = from(axios.post(this.ipAddress+"/api/getcountry/",zz));
  //     //  const defaultValuee = await lastValueFrom(defaultValueUrl);
  //     //  //console.log("defaultValuee",defaultValuee);

  //  await this.datacrowdService.getcountry(zz).then((ress:any)=>{
  //   //console.log('getcountry>>>>',ress);
  //   // C_subregion=ress[0];
  //   // C_region=ress[1];
  //   // C_Country=ress[2];
  //   C_countryCodes=ress;
  
  // }) 

        this.Coord.push({
          ID: shapeId,
          Name: "",
          Value: "",
          Type: "Circle",
          Bounds: "",
          radius: radius,
          center: circleCenterPoint,
          leafletid: shapeLeafletId,
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          // countrycodes:this.convertCountryCode(C_countryCodes)
          countrycodes:C_countryCodes

        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          Value: "",
          Type: "Circle",
          radius: radius,
          center: circleCenterPoint,
          leafletid: shapeLeafletId,
          Bounds: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          // countrycodes:this.convertCountryCode(C_countryCodes)
          countrycodes:C_countryCodes
          
        });
      //console.log('after',this.Coord);
      this.circle = L.circle(circleCenterPoint, radius, {
        color: "#6e83f0",
        fillOpacity: 0.5,
        radius: radius,
      }).addTo(this.magnifiedMap);

      }
      
  

      //     if(localStorage.getItem("coordsimul")){
      //  let x=JSON.parse(localStorage.getItem("coordsimul"));
      // this.Coord.push({
      //   ID: x[0].ID,
      //   Name: "",
      //   Value: "",
      //   Type: x[0].Type,
      //   Bounds: "",
      //   radius:  x[0].radius,
      //   center: x[0].center,
      //   leafletid: x[0].leafletid,
      //   PolyBoundsCoords: "",
      // });
      // localStorage.clear();
      //     }

      //     //console.log('after',this.Coord)


      //localStorage.setItem("coords", JSON.stringify(this.Coord));

      // localStorage.setItem("ZOOM", this.map.getZoom());

    }


  }


  editCircleCoordinate(shape: any) {
    var shapeLeafletId = (shape._leaflet_id);
    if (shape._mRadius >= this.circleLimit) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Circle limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(shape);
        //  featureGroup.removeLayer(item.layer);


      });

    } else {
      var radius = shape.getRadius();
      var circleCenterPoint = shape.getLatLng();
      var Circlecoords = '';
      var point = circleCenterPoint;
      var circleCoordsArray = [];
      if (this.dbtype != "Cassandra") {
        var fixedlng = point.lng;
        var fixedlat = point.lat;
        fixedlng = Number((fixedlng).toFixed(this.toFixedValue));
        fixedlat = Number((fixedlat).toFixed(this.toFixedValue));
        this.standard = Number((this.standard).toFixed(this.toFixedValue));
        point = {
          'lat': fixedlat,
          'lng': fixedlng
        };
        var latpoint = fixedlat;
        while (Math.abs(circleCenterPoint.distanceTo(point)) <= radius) {
          latpoint = Number((latpoint + this.standard).toFixed(this.toFixedValue));
          for (var lngpoint = fixedlng; Math.abs(circleCenterPoint.distanceTo(point)) <= radius; lngpoint += this.standard) {
            lngpoint = Number((lngpoint).toFixed(this.toFixedValue));
            point = {
              'lat': latpoint,
              'lng': lngpoint
            };
            Circlecoords += '(' + latpoint + ',' + lngpoint + '),';
            circleCoordsArray.push(point);
          }
          point = {
            'lat': fixedlat,
            'lng': fixedlng
          };
          for (var lngpoint = fixedlng; Math.abs(circleCenterPoint.distanceTo(point)) <= radius; lngpoint -= this.standard) {
            lngpoint = Number((lngpoint).toFixed(this.toFixedValue));
            point = {
              'lat': latpoint,
              'lng': lngpoint
            };
            Circlecoords += '(' + latpoint + ',' + lngpoint + '),';
            circleCoordsArray.push(point);
          }
          point = {
            'lat': latpoint,
            'lng': fixedlng
          };
        }
        point = {
          'lat': fixedlat,
          'lng': fixedlng
        };
        latpoint = fixedlat + this.standard;
        while (Math.abs(circleCenterPoint.distanceTo(point)) <= radius) {
          latpoint = Number((latpoint - this.standard).toFixed(this.toFixedValue));
          for (var lngpoint = fixedlng + this.standard; Math.abs(circleCenterPoint.distanceTo(point)) <= radius; lngpoint += this.standard) {
            lngpoint = Number((lngpoint).toFixed(this.toFixedValue));
            point = {
              'lat': latpoint,
              'lng': lngpoint
            };
            Circlecoords += '(' + latpoint + ',' + lngpoint + '),';
            circleCoordsArray.push(point);
          }
          point = {
            'lat': fixedlat,
            'lng': fixedlng
          };
          for (var lngpoint = fixedlng; Math.abs(circleCenterPoint.distanceTo(point)) <= radius; lngpoint -= this.standard) {
            lngpoint = Number((lngpoint).toFixed(this.toFixedValue));
            point = {
              'lat': latpoint,
              'lng': lngpoint
            };
            Circlecoords += '(' + latpoint + ',' + lngpoint + '),';
            circleCoordsArray.push(point);
          }
          point = {
            'lat': latpoint,
            'lng': fixedlng
          };
        }
        while (Math.abs(circleCenterPoint.distanceTo(point)) <= radius) this.Coord.find((a: any) => a.leafletid === shapeLeafletId)['Value'] = Circlecoords;
        this.Coord.find(a => a.leafletid === shapeLeafletId)['radius'] = radius;
        this.Coord.find(a => a.leafletid === shapeLeafletId)['center'] = circleCenterPoint;
      } else {
        this.Coord.find(a => a.leafletid === shapeLeafletId)['radius'] = radius;
        this.Coord.find(a => a.leafletid === shapeLeafletId)['center'] = circleCenterPoint;
      }
    }
    //console.log("circle after edit >>>>", this.Coord);
    return this.Coord;
  }


  metersToFeet(meters: number): number {
    const feet = meters / 0.3048; // 1 meter is equal to 3.28084 feet
    return feet;
  }
  feetToMeters(feet: number): number {
    const meters = feet * 0.3048; // 1 meter is equal to 3.28084 feet
    return meters;
  }

  async RectangleCoordinate(featureGroup: any, item: any, shapeId: any) {
    var rectangleCenter = item.layer.getBounds().getCenter();
    var shapeLeafletId = item.layer._leaflet_id;
    var rectangleBounds = item.layer._latlngs[0];
    var botleft = rectangleBounds[0];
    var topleft = rectangleBounds[1];
    var topright = rectangleBounds[2];
    var botright = rectangleBounds[3];
    var Rectanglecoords = "";
    var rectangleCoordsArray = [];
    var topLngLeftPoint = Number(topleft.lng.toFixed()); //start
    var toplatLeftPoint = Number(topleft.lat.toFixed()); //end
    var botlngLeftLpoint = Number(botleft.lng.toFixed());
    var botlatLeftLpoint = Number(botleft.lat.toFixed()); //start
    var toplatRightPoint = Number(topright.lat.toFixed()); //end
    var toplngRightPoint = Number(topright.lng.toFixed()); //end
    var botlatrightPoint = Number(botright.lat.toFixed());
    var botlngrightPoint = Number(botright.lng.toFixed());
    var horizontalCoords;
    var shapesArrayIndex = [];
    var vertdist = toplatLeftPoint - botlatLeftLpoint;
    var hordist = botlngLeftLpoint - botlngrightPoint;
    var hypsquare = Math.pow(hordist, 2) + Math.pow(vertdist, 2);
    var point;
    if (hypsquare >= this.squareLimit) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Rectangle limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(item.layer);
        //  featureGroup.removeLayer(item.layer);


      });

    } else {

      if (this.dbtype != "Cassandra") {
        for (
          var j = botlatLeftLpoint;
          j <= toplatLeftPoint;
          j += this.standard
        ) {
          j = Number(j.toFixed());
          for (
            var i = topLngLeftPoint;
            i <= toplngRightPoint;
            i += this.standard
          ) {
            i = Number(i.toFixed());
            Rectanglecoords += "(" + j + "," + i + "),";
            point = {
              lat: j,
              lng: i,
            };
            rectangleCoordsArray.push(point);
          }
        }
      }
      
      
      let rectangleBounds:any = {
        topLeft: topleft,
        topRight: topright,
        bottomLeft: botleft,
        bottomRight: botright,
      };


      if (this.dbtype != "Cassandra") {
        this.Coord.push({
          ID: shapeId,
          Name: "",
          Bounds: rectangleBounds,
          Value: rectangleCoordsArray,
          center: rectangleCenter,
          Type: "Rectangle",
          leafletid: shapeLeafletId,
          radius: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",

        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          Bounds: rectangleBounds,
          Value: Rectanglecoords,
          center: rectangleCenter,
          Type: "Rectangle",
          leafletid: shapeLeafletId,
          radius: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",

        });
      } else {
        
//       let countrycode:any;
//       let countrycodearray:any[]=[];
//       let  promises:any = [];
      let  C_countryCodes:any;




//       for (const point in rectangleBounds) {
//         const { lat, lng } = rectangleBounds[point];
//         // //console.log(`${point}: Latitude ${lat}, Longitude ${lng}`);

//         promises.push(
//           this.datacrowdService.reverseGeocode(lat,lng).then((res: any) => {
//             countrycode = res.countryCode;
//             countrycodearray.push(countrycode);
//             //console.log('reverseGeocode>>>>', res);
//           })
//         );
//     }
    
    
//       // Wait for all promises to resolve
//       await Promise.all(promises);

// // Now the loop has finished, and you can log the result
// // //console.log('countrycodearray  >>>>', this.getUniqueString(countrycodearray));
// countrycodearray=this.getUniqueString(countrycodearray);
// // //console.log('countrycodearray  dqewdewqdewde>>>>', this.getUniqueString(countrycodearray));

// await this.datacrowdService.getcountry(countrycodearray).then((ress:any)=>{
//   //console.log('getcountry>>>>',ress);
//   // C_subregion=ress[0];
//   // C_region=ress[1];
//   // C_Country=ress[2];
//   C_countryCodes=ress;

// }) 
let zz:any= this.determineIntersectingRegions(item.layer,this.geojsonData,'rectangle');
//console.log("zz ",zz);

await this.datacrowdService.getcountry(zz).then((ress:any)=>{
  //console.log('getcountry>>>>',ress);
  // C_subregion=ress[0];
  // C_region=ress[1];
  // C_Country=ress[2];
  C_countryCodes=ress;

}) 


        this.Coord.push({
          ID: shapeId,
          Name: "",
          Bounds: rectangleBounds,
          Value: "",
          center: rectangleCenter,
          Type: "Rectangle",
          leafletid: shapeLeafletId,
          radius: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:this.convertCountryCode(C_countryCodes)

        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          Bounds: rectangleBounds,
          Value: "",
          center: rectangleCenter,
          Type: "Rectangle",
          leafletid: shapeLeafletId,
          radius: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:this.convertCountryCode(C_countryCodes)

        });
      }

      // localStorage.setItem("coords", JSON.stringify(this.Coord));
      //localStorage.setItem("ZOOM", this.map.getZoom());

    }
  }

  async PolygonCoordinate(featureGroup: any, item: any, shapeId: any) {
    //console.log('limitttt', L.GeometryUtil.geodesicArea(item.layer._latlngs[0]))

    if (
      L.GeometryUtil.geodesicArea(item.layer._latlngs[0]) > this.polygoneLimit
    ) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Polygon limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(item.layer);


      });

    } else {
      this.deletedLimit = true;
      var polygonCenter = item.layer.getBounds().getCenter();
      var polyCoords = item.layer.editing.latlngs[0][0];
      var Pointsarray = [];
      var vertdist;
      var horzdist;
      var lats = [];
      var lngs = [];
      var polyPoints = "";
      var polyPointsArray:any = [];
      var outsidepolyPoints = [];
      var polygonBounds = item.layer._latlngs[0];
      var shapeLeafletId = item.layer._leaflet_id;
      var point;
      if (this.dbtype != "Cassandra") {
        for (var i = 0; i < polyCoords.length; i++) {
          lats.push(polyCoords[i].lat); //y
          lngs.push(polyCoords[i].lng); //x
          Pointsarray.push([polyCoords[i].lat, polyCoords[i].lng]);
        }
        Pointsarray.push([polyCoords[0].lat, polyCoords[0].lng]);
        var polygon = turf.polygon([Pointsarray]);

        function sortNumber(a: any, b: any) {
          return a - b;
        }
        var sortedLats = lats.sort(sortNumber);
        var sortedLngs = lngs.sort(sortNumber);
        for (
          var m = sortedLats[0];
          m < sortedLats[sortedLats.length - 1];
          m += this.standard
        ) {
          m = Number(this.toFixedValue.toFixed());
          for (
            var n = sortedLngs[0];
            n < sortedLngs[sortedLngs.length - 1];
            n += this.standard
          ) {
            var polygonCoords = turf.point([m, n]);
            if (turf.inside(polygonCoords, polygon) == true) {
              n = Number(this.toFixedValue.toFixed());
              polyPoints += "(" + m + "," + n + "),";
              point = {
                lat: m,
                lng: n,
              };
              polyPointsArray.push(point);
            }
          }
        }

        

        this.Coord.push({
          ID: shapeId,
          Name: "",
          leafletid: shapeLeafletId,
          center: polygonCenter,
          PolyBoundsCoords: polyCoords,
          Value: polyPointsArray,
          Type: "Polygon",
          Bounds: polygonBounds,
          radius: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",

        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          leafletid: shapeLeafletId,
          center: polygonCenter,
          PolyBoundsCoords: polyCoords,
          Value: polyPoints,
          Type: "Polygon",
          Bounds: polygonBounds,
          radius: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",

        });

      } else {


        // let countrycode:any;
        // let countrycodearray:any[]=[];
        // let  promises:any = [];
        let  C_countryCodes:any;
      
  //             polygonBounds.forEach((element: any, key: any) => {
  //         // Push each promise to the array
  //         promises.push(
  //           this.datacrowdService.reverseGeocode(element.lat, element.lng).then((res: any) => {
  //             countrycode = res.countryCode;
  //             countrycodearray.push(countrycode);
  //             //console.log('reverseGeocode>>>>', res);
  //           })
  //         );
  //       });
  
  //       // Wait for all promises to resolve
  //       await Promise.all(promises);
  
  // // Now the loop has finished, and you can log the result
  // //console.log('countrycodearray  >>>>', this.getUniqueString(countrycodearray));
  // countrycodearray=this.getUniqueString(countrycodearray);
  // //console.log('countrycodearray  dqewdewqdewde>>>>', this.getUniqueString(countrycodearray));
  
  // await this.datacrowdService.getcountry(countrycodearray).then((ress:any)=>{
  //   //console.log('getcountry>>>>',ress);
  //   // C_subregion=ress[0];
  //   // C_region=ress[1];
  //   // C_Country=ress[2];
  //   C_countryCodes=ress;
  
  // }) ;


  let zz:any= this.determineIntersectingRegions(item.layer,this.geojsonData,'polygon');
  //console.log("zz ",zz);

    await this.datacrowdService.getcountry(zz).then((ress:any)=>{
    //console.log('getcountry>>>>',ress);
    // C_subregion=ress[0];
    // C_region=ress[1];
    // C_Country=ress[2];
    C_countryCodes=ress;
  
  }) ;

  
        this.Coord.push({
          ID: shapeId,
          Name: "",
          leafletid: shapeLeafletId,
          center: polygonCenter,
          PolyBoundsCoords: polyCoords,
          Value: "",
          Type: "Polygon",
          Bounds: polygonBounds,
          radius: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:this.convertCountryCode(C_countryCodes)

        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          leafletid: shapeLeafletId,
          center: polygonCenter,
          PolyBoundsCoords: polyCoords,
          Value: "",
          Type: "Polygon",
          Bounds: polygonBounds,
          radius: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:this.convertCountryCode(C_countryCodes)

        });

      }
      for (var i = 0; i < polyCoords.length; i++) {
        lats.push(polyCoords[i].lat); //y
        lngs.push(polyCoords[i].lng); //x
        Pointsarray.push([polyCoords[i].lat, polyCoords[i].lng]);
      }
      Pointsarray.push([polyCoords[0].lat, polyCoords[0].lng]);
      var polygon = turf.polygon([Pointsarray]);
      const area = turf.area(polygon);
      //console.log('Area:', area.toFixed(2), 'square meters');
      var perimeter = 0;
      for (let i = 0; i < polyCoords.length - 1; i++) {
        const latLng1 = L.latLng(polyCoords[i].lat, polyCoords[i].lng);
        const latLng2 = L.latLng(polyCoords[i + 1].lat, polyCoords[i + 1].lng);
        perimeter += latLng1.distanceTo(latLng2);
      }
      //console.log('perimeter:', perimeter.toFixed(2), ' meters');
      //console.log('polygonBounds:',polygonBounds);
      //console.log('Coord:',this.Coord);


 
      // var popupContent =
      // `<strong>Area:</strong> ${area.toFixed(2)} square meters<br>
      //   <strong>Perimeter:</strong> ${perimeter.toFixed(2)} meters`;
      // item.layer.bindPopup(popupContent).openPopup();

      //localStorage.setItem("coords", JSON.stringify(this.Coord));
      // localStorage.setItem("ZOOM", this.map.getZoom());
    }
  }

  async editPolygonCoordinate(item: any) {
    if (L.GeometryUtil.geodesicArea(item._latlngs[0]) > this.polygoneLimit) {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Polygon limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(item);


      });

    } else {
      var polyCoords = item.editing.latlngs[0][0];
      var Pointsarray = [];
      var vertdist;
      var horzdist;
      var lats = [];
      var lngs = [];
      var polyPoints = '';
      var polyPointsArray = [];
      var outsidepolyPoints = [];
      var polygonBounds = item._latlngs[0];
      var point;
      var shapeLeafletId = (item._leaflet_id);
      if (this.dbtype != "Cassandra") {
        for (var i = 0; i < polyCoords.length; i++) {
          lats.push(polyCoords[i].lat); //y
          lngs.push(polyCoords[i].lng); //x
          Pointsarray.push([polyCoords[i].lat, polyCoords[i].lng]);
        }
        Pointsarray.push([polyCoords[0].lat, polyCoords[0].lng]);
        var polygon = turf.polygon([Pointsarray]);

        function sortNumber(a: any, b: any) {
          return a - b;
        }
        var sortedLats = lats.sort(sortNumber);
        var sortedLngs = lngs.sort(sortNumber);
        for (var m = sortedLats[0]; m < sortedLats[sortedLats.length - 1]; m += this.standard) {
          m = Number(m.toFixed(this.toFixedValue))
          for (var n = sortedLngs[0]; n < sortedLngs[sortedLngs.length - 1]; n += this.standard) {
            var polygonCoords = turf.point([m, n]);
            if (turf.inside(polygonCoords, polygon) == true) {
              n = Number(n.toFixed(this.toFixedValue))
              point = {
                'lat': m,
                'lng': n
              };
              polyPoints += '(' + m + ',' + n + '),';
              polyPointsArray.push(point);
            }
          }
        }
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Value'] = polyPoints;
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Bounds'] = polygonBounds;
      } else {
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Bounds'] = polygonBounds;
        let countrycode:any;
        let countrycodearray:any[]=[];
        let  promises:any = [];
        let  C_countryCodes:any;


 
  
  
  
      
        //       polygonBounds.forEach((element: any, key: any) => {
        //   // Push each promise to the array
        //   promises.push(
        //     this.datacrowdService.reverseGeocode(element.lat, element.lng).then((res: any) => {
        //       countrycode = res.countryCode;
        //       countrycodearray.push(countrycode);
        //       //console.log('reverseGeocode>>>>', res);
        //     })
        //   );
        // });
  
        // // Wait for all promises to resolve
        // await Promise.all(promises);
  
  // Now the loop has finished, and you can log the result
  // //console.log('countrycodearray  >>>>', this.getUniqueString(countrycodearray));
  // countrycodearray=this.getUniqueString(countrycodearray);
  // //console.log('countrycodearray  dqewdewqdewde>>>>', this.getUniqueString(countrycodearray));
  let zz:any= this.determineIntersectingRegions(item.layer,this.geojsonData,'polygon');
  //console.log("zz ",zz);

    await this.datacrowdService.getcountry(zz).then((ress:any)=>{
    //console.log('getcountry>>>>',ress);
    // C_subregion=ress[0];
    // C_region=ress[1];
    // C_Country=ress[2];
    C_countryCodes=ress;
  
  }) ;

        
      }
    }
    //console.log("polygon after edit ", this.Coord)
    return this.Coord;
  }

  async PolylineCoordinate(featureGroup: any, item: any, shapeId: any) {
    var tempLatLng: any = null;
    var totalDistance = 0.0;
    $.each(item.layer._latlngs, function (i:any, latlng:any) {
      if (tempLatLng == null) {
        tempLatLng = latlng;
        return;
      }
      totalDistance += tempLatLng.distanceTo(latlng);
      tempLatLng = latlng;
    });
    if (totalDistance > 1000) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Polyline limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(item.layer);


      });
    } else {
      this.deletedLimit = true;
      var polylineCenter = item.layer.getBounds().getCenter();
      var polylineBounds = item.layer._latlngs;
      var polylinePointsString = "";
      var line;
      var polyCoords = item.layer.editing.latlngs[0];
      var options;
      var lineoptions;
      var along;
      var coordinatesArray: any[];
      var shapeLeafletId = item.layer._leaflet_id;
      var step;
      var point;
      if (this.dbtype != "Cassandra") {
        for (var i = 0; i < polyCoords.length - 1; i++) {
          line = turf.lineString([
            [polyCoords[i].lat, polyCoords[i].lng],
            [polyCoords[i + 1].lat, polyCoords[i + 1].lng],
          ]);
          options: {
            units: "kilometers";
          }
          lineoptions = {
            ignoreEndVertices: false,
          };
          let limit = polyCoords[i].distanceTo(polyCoords[i + 1]);
          limit /= 1000;
          for (step = 0; step < limit; step += this.standard) {
            along = turf.along(line, step, options);
            var coord0 = along.geometry.coordinates[0].toFixed();
            var coord1 = along.geometry.coordinates[1].toFixed();
            if (
              !coordinatesArray.some((e) => e[0] == coord0) &&
              !coordinatesArray.some((e) => e[1] == coord1)
            ) {
              point = {
                lat: coord0,
                lng: coord1,
              };
              polylinePointsString += "(" + coord0 + "," + coord1 + ")";
              coordinatesArray.push(point);
            }
          }
        }
        this.Coord.push({
          ID: shapeId,
          Name: "",
          Bounds: polylineBounds,
          center: polylineCenter,
          Value: coordinatesArray,
          Type: "Polyline",
          leafletid: shapeLeafletId,
          radius: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",

        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          Bounds: polylineBounds,
          center: polylineCenter,
          Value: polylinePointsString,
          Type: "Polyline",
          leafletid: shapeLeafletId,
          PolyBoundsCoords: "",
          radius: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",

        });
      } else {

     
        let countrycode:any;
        let countrycodearray:any[]=[];
        let  promises:any = [];
        let  C_countryCodes:any;
  
  
  
  
        for (const point in polylineBounds) {
          const { lat, lng } = polylineBounds[point];
          // //console.log(`${point}: Latitude ${lat}, Longitude ${lng}`);
  
          promises.push(
            this.datacrowdService.reverseGeocode(lat,lng).then((res: any) => {
              countrycode = res.countryCode;
              countrycodearray.push(countrycode);
              //console.log('reverseGeocode>>>>', res);
            })
          );
      }
      
      
        // Wait for all promises to resolve
        await Promise.all(promises);
  
  // Now the loop has finished, and you can log the result
  // //console.log('countrycodearray  >>>>', this.getUniqueString(countrycodearray));
  countrycodearray=this.getUniqueString(countrycodearray);
  // //console.log('countrycodearray  dqewdewqdewde>>>>', this.getUniqueString(countrycodearray));
  
  await this.datacrowdService.getcountry(countrycodearray).then((ress:any)=>{
    //console.log('getcountry>>>>',ress);
    // C_subregion=ress[0];
    // C_region=ress[1];
    // C_Country=ress[2];
    C_countryCodes=ress;
  
  }) 


        this.Coord.push({
          ID: shapeId,
          Name: "",
          Bounds: polylineBounds,
          center: polylineCenter,
          Value: "",
          Type: "Polyline",
          leafletid: shapeLeafletId,
          radius: "",
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:this.convertCountryCode(C_countryCodes)

        });
        this.shapesArray.push({
          ID: shapeId,
          Name: "",
          Bounds: polylineBounds,
          center: polylineCenter,
          Value: "",
          Type: "Polyline",
          leafletid: shapeLeafletId,
          PolyBoundsCoords: "",
          radius: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:this.convertCountryCode(C_countryCodes)

        });
        // localStorage.setItem("coords", JSON.stringify(this.Coord));
        // localStorage.setItem("ZOOM", this.map.getZoom());

      }
    }
  }

  editPolylineCoordinate(item: any) {
    var tempLatLng: any = null;
    var totalDistance = 0.00000;
    $.each(item._latlngs, function (i:any, latlng:any) {
      if (tempLatLng == null) {
        tempLatLng = latlng;
        return;
      }
      totalDistance += tempLatLng.distanceTo(latlng);
      tempLatLng = latlng;
    });
    if (totalDistance > 1000) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Polyline limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(item);


      });
    } else {
      var polylineBounds = item._latlngs;
      var polylinePointsString = '';
      var line;
      var polyCoords = item.editing.latlngs[0];
      var options;
      var lineoptions;
      var along;
      var coordinatesArray: any[];
      var shapeLeafletId = (item._leaflet_id);
      var step;
      var point;
      if (this.dbtype != "Cassandra") {
        for (let i = 0; i < polyCoords.length - 1; i++) {
          line = turf.lineString([
            [polyCoords[i].lat, polyCoords[i].lng],
            [polyCoords[i + 1].lat, polyCoords[i + 1].lng]
          ]);
          options: {
            units: 'kilometers'
          };
          lineoptions = {
            ignoreEndVertices: false
          };
          let limit = polyCoords[i].distanceTo(polyCoords[i + 1]);
          limit /= 1000;
          for (step = 0; step < limit; step += this.standard) {
            along = turf.along(line, step, options);
            var coord0 = along.geometry.coordinates[0].toFixed(this.toFixedValue);
            var coord1 = along.geometry.coordinates[1].toFixed(this.toFixedValue);
            if (!coordinatesArray.some(e => e[0] == coord0) && !coordinatesArray.some(e => e[1] == coord1)) {
              point = {
                'lat': coord0,
                'lng': coord1
              };
              polylinePointsString += '(' + coord0 + ',' + coord1 + ')'
              coordinatesArray.push(point);
            }
          }
        }
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Value'] = polylinePointsString;
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Bounds'] = polylineBounds;
      } else {
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Bounds'] = polylineBounds;
      }
    }
  }



  editRectangleCoordinate(item: any) {
    var shapeLeafletId = (item._leaflet_id);
    var rectangleBounds = item._latlngs[0];
    var botleft = rectangleBounds[0];
    var topleft = rectangleBounds[1];
    var topright = rectangleBounds[2];
    var botright = rectangleBounds[3];
    var Rectanglecoords = '';
    var rectangleCoordsArray = [];
    var topLngLeftPoint = Number(topleft.lng.toFixed(this.toFixedValue)); //start
    var toplatLeftPoint = Number(topleft.lat.toFixed(this.toFixedValue)); //end
    var botlngLeftLpoint = Number(botleft.lng.toFixed(this.toFixedValue));
    var botlatLeftLpoint = Number(botleft.lat.toFixed(this.toFixedValue)); //start
    var toplatRightPoint = Number(topright.lat.toFixed(this.toFixedValue)); //end
    var toplngRightPoint = Number(topright.lng.toFixed(this.toFixedValue)); //end
    var botlatrightPoint = Number(botright.lat.toFixed(this.toFixedValue));
    var botlngrightPoint = Number(botright.lng.toFixed(this.toFixedValue));
    var horizontalCoords;
    var shapesArrayIndex = [];
    var vertdist = (toplatLeftPoint - botlatLeftLpoint);
    var hordist = (botlngLeftLpoint - botlngrightPoint);
    var hypsquare = Math.pow(hordist, 2) + Math.pow(vertdist, 2);
    var point;
    if (hypsquare >= this.squareLimit) {


      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Rectangle limit exeeded!',
      };

      let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        //featureGroup.removeLayer(item.layer);
        this.map.removeLayer(item);


      });

    } else {
      if (this.dbtype != "Cassandra") {
        for (var j = botlatLeftLpoint; j <= toplatLeftPoint; j += this.standard) {
          j = Number(j.toFixed(this.toFixedValue));
          for (var i = topLngLeftPoint; i <= toplngRightPoint; i += this.standard) {
            i = Number(i.toFixed(this.toFixedValue));
            Rectanglecoords += '(' + j + ',' + i + '),';
            point = {
              'lat': j,
              'lng': i
            };
            rectangleCoordsArray.push([j, i]);
          }
        }
      }
      let rectangleBounds = {
        "topLeft": topleft,
        "topRight": topright,
        "bottomLeft": botleft,
        "bottomRight": botright
      };
      if (this.dbtype != "Cassandra") {
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Bounds'] = rectangleBounds;
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Value'] = Rectanglecoords;
      } else {
        this.Coord.find(a => a.leafletid === shapeLeafletId)['Bounds'] = rectangleBounds;
      }
    }
  }


  private getCurrentPosition() {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  // changeMapType(mapType: string) {
  //   this.currentMapType = mapType;
  //   this.updateMap();
  // }

  updateMap() {
    // this.map.eachLayer((layer: any) => {
    //   this.map.removeLayer(layer);
    // });
    switch (this.currentMapType) {
      case "roadmap":
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
        break;
      case "satellite":
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          }
        ).addTo(this.map);

        break;
      case "terrain":
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        break;
    }
  }




  searchLocation(locationName: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const [firstResult] = json;
        const lat = firstResult.lat;
        const lng = firstResult.lon;
        return L.latLng([lat, lng]);
      });
  }


  search(locationName: string) {

    if (locationName == "" || typeof locationName == "undefined" || locationName == "undefined") {
      return;
    } else {
      this.searchLocation(locationName).then(center => {
        this.locationbts=center;
        this.map.setView(center, 12);
        // const marker = L.marker(center, { icon: L.icon({
        //   iconSize: [25, 41],
        //   iconAnchor: [10, 41],
        //   popupAnchor: [2, -40],
        //   // specify the path here
        //   iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
        //   shadowUrl:
        //     "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
        // })}).addTo(this.map);

        if (this.locationCenter != null) {
          this.map.removeLayer(this.locationCenter);
        }

        const popupInfo = `<b style="color: white; background-color: white">${locationName}</b>`;
        this.locationCenter = L.marker([center.lat, center.lng], this.markerIcon).addTo(this.map);
       // this.locationCenter.off("click");              
       this.datacrowdService.getTypeFixedelements().then((res: any) => {
        //console.log("typeeeeeeee------",res);
        this.fixedeltsTypes=res;
       });
       document.addEventListener("contextmenu",e=>e.preventDefault());

        this.locationCenter.on("mousedown", (e: any) => { 
         
          if (e.originalEvent.buttons == 2) {
                                                            

            const dialogRef = this.dialog.open(this.RCsearch)
            //  //console.log("cRdaius111>>",$('.bulkRadius'))
      
      
            // dialogRef.afterClosed().subscribe(async result => {

            // });
          }else{
           
          }
          // if (e.originalEvent.buttons == 1) {
          //    alert(1);
          // }

        });
      });
    }
  }

  arrayToString(arr: any[]): string {
    return arr.join(",");
  }

  updateMap2(id: any, center: any) {
    // Update the zoom and center properties
    this.options.zoom = id;
    this.options.center = center;
    this.map.setView(center, id);

  }

  getDistinctNumbers(arr: number[]): number[] {
    // Use the Set object to remove duplicates
    const distinctNumbers = [...new Set(arr)];

    // Return the array of distinct numbe rs
    return distinctNumbers;
  }

  getDistinctDevices() {
    const deviceArray = this.Devices.split(",");
    const deviceSet = new Set(deviceArray);

    this.Devices = Array.from(deviceSet).join(",");
    //console.log("Devices>>>>>>>>>>>>", this.Devices);
    return this.Devices;
  }



  async callCassandraApi(obj: any) {
    let result: String = "";

    try {
      let result = await this.httpClient
        .post<any>(
          this.urlCassandraServer + "/api/getAllData",
          JSON.stringify(obj),
          { headers: GlobalConstants.headers }
        )
        .subscribe(
          (res) => {
            result = res;
          },
          (error) => {
            //console.log("error >>>>>>>>>>>>>>", error);
          }
        );
    } catch (error) {
      //console.log(" failure exception ");
      //console.log("Fail - Please contact valoores team");
    }

    return result;
  }


  // async getSimulationData(obj: any) {
  //  // try {
  //     let response = await this.datacrowdService.getSimulationData(obj);
  //     console.log(" response getSimulationData>>>>>> ", response);
  // clearInterval(this.intervalId);

  //     return response;
  //   //} 
  //   //catch (error) {
  //   //   //console.log(" failure exception ", error);
  //   //   //console.log("Fail - Please contact valoores team");
  //   //   this.intervalSubscription.unsubscribe();
  //   // }
  // }



  async getSimulationData(obj: any) {
    //  this.datacrowdService.getSimulationData(obj)
    //   .then(response => {
    //     console.log('getSimulationData>>>>>> 0', response);
    //     this.simulationData = response;
    //   })
    //   .catch(error => {
    //     console.error('Error fetching simulation data', error);
    //   });



    await this.datacrowdService.getSimulationData(obj).then((data:any) => {
        this.records = data ;

        let parsedJson = {};
        console.log('array buffer response ---------------',this.records);
         
       
 
      }); 
      let e=  this.byteToJson(this.records);
       console.log('eeeeeeeee>>>>>> 0', e);
      return e;
      
    }
async getSimulationNextAction(obj: any) { 
  await this.datacrowdService.getSimulationNextAction(obj).then((data:any) => {
    this.records = data ;
console.log('iiiiiii>>>>>> 0', this.records)
  });   

}

    byteToJson(records:any){
      
      console.log("tttttttttttttttt ------------");
      let contentType = records.headers.get('content-type');
      let byteArray = new Uint8Array(records.body);
 
                console.log('byteArray>>>>>> 0', byteArray);
                  // Use TextDecoder to convert byteArray to string
  const decoder = new TextDecoder('utf-8');
  let bytesString = decoder.decode(byteArray);

  console.log('Bytes to string: ', bytesString);
                // let bytesString = String.fromCharCode(...byteArray)

                // console.log('Bytes to string: ', bytesString);
                let stringtojson = JSON.parse(bytesString);
                console.log('JSON:111111111 ', stringtojson );
                return stringtojson;
    }
//   async getSimulationData(obj: any) {
//     try {
//         await this.datacrowdService.getSimulationData(obj).then((res:any)=>{

// let data:any;
// let data2:any=[];


//         let blobData: Blob = res.body;
//         let fileReader = new FileReader();
//         fileReader.onload = (event) => {
//           // Once the FileReader has loaded the blob data, you can access it here
//          data = fileReader.result;
//           //console.log('Blob data:', data);

//           // You can further process the blob data here
//         };
//         fileReader.readAsText(blobData); // You can choose the appropriate method based on your blob content type
    
//         //console.log('data2:', data2.push(data));

//         return data;
//       });
//       // //console.log(" response getSimulationData>>>>>> ", response);
//       clearInterval(this.intervalId);

//       // return response;
//     } catch (error) {
//       //console.log(" failure exception ", error);
//       //console.log("Fail - Please contact valoores team");
//       this.intervalSubscription.unsubscribe();
//     }
//   }





  async refresh() {
    if (this.controlLayers) {
      this.controlLayers.remove();

    }

    if (this.polyline) {
      this.map.removeLayer(this.polyline);

    }

    console.log('Coords = ',this.Coord);

    let coordinates = this.Coord;
    if (!coordinates) {
      coordinates = [];
    }

    if (!JSON.parse(localStorage.getItem("multiselection"))) {
      this.multiselection = [];

    } else {
      //console.log('multiselection>>>>', JSON.parse(localStorage.getItem("multiselection")));
      //console.log('multiselection>>>>', JSON.parse(localStorage.getItem("multiselection")).join());

      this.multiselection = JSON.parse(localStorage.getItem("multiselection")).join();
      if (this.Devices == "" || typeof this.Devices == "undefined") {

        this.Devices = this.multiselection;
      } else {

        this.Devices = this.Devices + ',' + this.multiselection;

      }
    }

    if (
      (window.parent.parent.parent[7] as any) &&
      (window.parent.parent.parent[7] as any).A_COUNTRY_CODE
    ) {
      this.countrycode = (window.parent.parent.parent[7] as any).A_COUNTRY_CODE;
      //console.log('countrycode:::::', this.countrycode);

      if (typeof this.countrycode !== 'undefined') {
        //console.log('countrycode not empty>>>>');

          let numArr = this.countrycode.split(',').map(Number);
      numArr = this.getDistinctNumbers(numArr);
      //console.log('numArr>>>>>>>', numArr);
      this.countrycode=numArr;
       await this.datacrowdService.getcountry2(this.countrycode).then((res:any)=>{
          //console.log('getcountry2>>>>',res);
          this.countrycode=res;
          this.countrycode=this.convertCountryCode(this.countrycode);
        })
      }

    }else{
      if(this.reportType!=1 && this.reportType!=10 && this.reportType!=3 && this.reportType!=8 && this.reportType!=9 && this.reportType!=11){
        await this.datacrowdService.getALLcountryIDS().then(async (res:any)=>{
          //console.log('getALLcountryIDS>>>>',res);
  
          this.countrycode=res;
  
           await this.datacrowdService.getcountry2(this.countrycode).then((res:any)=>{
              //console.log('getcountry2>>>>',res);
              this.countrycode=res;
              this.countrycode=this.convertCountryCode(this.countrycode);
              //console.log("countrycode finall",this.countrycode)
            })
  
        })
      }
     
    }

   
    if (typeof this.countrycode == 'undefined') {
      this.countrycode = '';
    }
    this.similutionIdArray.push(this.simulationid);


    ////console.log("deviceeee afterrrr=",this.getDistinctDevices());
    let queryjson:any ;
    //console.log('this.senarioFlag>>',this.senarioFlag)
    //console.log('this.senariocount>>>',this.senariocount);

    let A_isSenarioFromcase:any = (window.parent.parent.parent[7] as any).A_isSenarioFromcase;
    //console.log("isSimul>>>>>>>>>>>>>>>>>> A_isSenarioFromcase",A_isSenarioFromcase);

    if(A_isSenarioFromcase==true){
   

      await this.datacrowdService.getinternalcode(this.senarioParentName).then((res:any)=>{
        console.log("res>>>>>>>>>>>",res);
        this.internalcode=res[0];
        this.senariocount=res[1];
  
      });
      this.senariocount++;

    }else{
      if(this.senariocount==0){
        this.senarioParentName=this.simulationid;
        this.firstsenario=this.simulationid;
        this.internalcode=this.simulationid;
  
      }
    }

    
    if(this.senarioFlag==true){
       queryjson = {
        reportName: "No Name",
        reportType: this.reportType,
        reportTypeId: this.reportTypeId,
        TimeZone: this.TimeZone,
        RecipientUser: this.RecipientUser,
        DateTimeFrom: this.DateTimeFrom,
        RecipientEmail: this.RecipientEmail,
        DateTimeTo: this.DateTimeTo,
        Coordinates: coordinates,
        meter: this.meter,
        Devices: this.Devices,
        isCSVAttached: this.isCSVAttached,
        dataType: this.dataType,
        telephoneNumber: this.telephoneNumber,
        // provider: "",
        EDGEHEIGHT: this.EDGEHEIGHT,
        simulationId: this.simulationid,
        userCode: this.usercode,
        imsiId: this.ImsiID,
        countryCode: this.countrycode,
        senario:{parent:this.senarioParentName,
          internalcode:this.internalcode,
         senariocount: this.senariocount.toString()},
         BtsTypeSlected:""
      };
      this.routeDevices=this.Devices;
      this.dataService.setroutedevices(this.Devices);

      (window.parent.parent.parent[7] as any).A_IsSenario=true;

// if(this.senariocount==0 && this.addnewsenariocount==0){
//   (window.parent.parent.parent[7] as any).A_isfirstSenario=true;
// }else{
//   (window.parent.parent.parent[7] as any).A_isfirstSenario=false;

// }
    
//console.log("senariocount", this.senariocount);
//console.log("addnewsenariocount", this.addnewsenariocount);

//console.log("zzzz", (window.parent.parent.parent[7] as any));
      
    }else{
       queryjson = {
        reportName: "No Name",
        reportType: this.reportType,
        reportTypeId: this.reportTypeId,
        TimeZone: this.TimeZone,
        RecipientUser: this.RecipientUser,
        DateTimeFrom: this.DateTimeFrom,
        RecipientEmail: this.RecipientEmail,
        DateTimeTo: this.DateTimeTo,
        Coordinates: coordinates,
        meter: this.meter,
        Devices: this.Devices,
        isCSVAttached: this.isCSVAttached,
        dataType: this.dataType,
        telephoneNumber: this.telephoneNumber,
        // provider: "",
        EDGEHEIGHT: this.EDGEHEIGHT,
        simulationId: this.simulationid,
        userCode: this.usercode,
        imsiId: this.ImsiID,
        countryCode: this.countrycode,
        senario:"-1",
        BtsTypeSlected:""

      };
      this.routeDevices=this.Devices;
      this.dataService.setroutedevices(this.Devices);
    }
 
    console.log("queryjson>>>>", queryjson);
    //   if(this.DateTimeFrom == "" || this.DateTimeTo== "")
    //   {
    //  alert(this.tns_alert_6);
    //   return;
    //   }


    if (this.reportType == 1) {

      if (this.Coord.length == 0) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          content: 'Select at least one Area',
        };

        this.dialog.open(ContentmodalComponent, dialogConfig);
        //this.clearShapes();

      } else {
        this.test(queryjson)
      }


    }
    else if (this.reportType == 3) {
      //console.log("zzz>>>", this.Coord.length)






      if (!this.Coord || this.Coord.length < 2) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          content: 'Select more than one Area',
        };

        this.dialog.open(ContentmodalComponent, dialogConfig);

        localStorage.clear();
      } else {
        let shouldExecuteTest = true; // Flag variable

        await this.Coord.forEach((obj : any) => {
          //console.log('obj>>>>>>>>', obj);
          if (
            obj.selectedStartDate === '' ||
            obj.selectedEndDate === '' ||
            typeof obj.selectedStartDate === 'undefined' ||
            typeof obj.selectedEndDate === 'undefined'
          ) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              content: 'Date each Shape!!!',
            };

            this.dialog.open(ContentmodalComponent, dialogConfig);
            shouldExecuteTest = false; // Set the flag to false if any object meets the condition
          }
        });

        if (shouldExecuteTest) {
          this.test(queryjson);
        }

      }

    }

    else if (this.reportType == 2) {
      this.displayroute=true;
      // //console.log('this.Devices=',this.Devices);
      // //console.log('this.multiselection=',this.multiselection)
      if ((this.Devices == "" || typeof this.Devices == "undefined") && (this.multiselection == "" || typeof this.multiselection == "undefined") && (this.telephoneNumber == "" || typeof this.telephoneNumber == "undefined")) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          content: 'No filter exists!',
        };

        this.dialog.open(ContentmodalComponent, dialogConfig);
      } else {

        this.test(queryjson)

      }
    } else if (this.reportType == 7) {
      if ((this.Devices == "" || typeof this.Devices == "undefined") && (this.multiselection == "" || typeof this.multiselection == "undefined") && (this.telephoneNumber == "" || typeof this.telephoneNumber == "undefined")) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          content: 'No Devices exists!',
        };

        this.dialog.open(ContentmodalComponent, dialogConfig);
      } else {


        var words = this.Devices.split(',');
        if (words.length < 2) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            content: 'devices should be at least 2',
          };

          this.dialog.open(ContentmodalComponent, dialogConfig);


        } else {
          this.test(queryjson);
        }



      }



    } else if (
      (this.reportType == 9 || this.reportType == 8) &&
      this.Coord.length != 0
    ) {


   for (const elt of this.Coord as any) {
      if(elt.Type==='Circle'){
        let turfshape:any = turf.circle([elt.center.lng, elt.center.lat], elt.radius / 1000, { units: 'kilometers' });

        const intersectingRegions:any = [];
   
        //console.log("geoJsonData ",this.geojsonData);
        // Iterate through each feature in the GeoJSON data
        
        this.geojsonData.features.forEach((feature: any) => {
 
          // Check if the circle intersects with the feature
         const doesIntersect = turf.booleanOverlap(turf.simplify(feature),turf.simplify(turfshape));
          //console.log('doesIntersect' ,doesIntersect)
      
          // //console.log('doesIntersect2', doesIntersect2);
          
      
          if (doesIntersect) {
            intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
           }else{
           const doesIntersect2 = turf.booleanPointInPolygon(
             turf.point([elt.center.lng, elt.center.lat]), // Create a Turf.js Point from circle center
             feature // Assuming the GeoJSON feature is a Polygon
           );
            if (doesIntersect2) {
              intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
            }
          }
 
 
 
         
        });
    
        //console.log('zz circle>>>>',intersectingRegions);


        ///
        let  C_countryCodes:any
      
 
 
    await this.datacrowdService.getcountry(intersectingRegions).then((ress:any)=>{
     //console.log('getcountry>>>>',ress);
     // C_subregion=ress[0];
     // C_region=ress[1];
     // C_Country=ress[2];
     C_countryCodes=ress;
   
   }) 
 

        elt.countrycodes=this.convertCountryCode(C_countryCodes);
      }
    };

      const dialogRef = this.dialog.open(this.BtsType);
      //  //console.log("cRdaius111>>",$('.bulkRadius'))



      dialogRef.afterClosed().subscribe(result => {


        //console.log('BtsTypeSlected>>>', this.BtsTypeSlected);

        let numArr2: any = [];

        //remove the old fixedelements and markers
        if (this.fixedMarkersArray.length > 0) {
          this.map.removeLayer(this.fixedMarkersGroup);
          this.fixedMarkersArray = [];
        }
        this.fixedElementMarker = [];
        this.fixedMarkersArray = [];
        queryjson.BtsTypeSlected=this.BtsTypeSlected;
        this.datacrowdService.ScanfixedElements(queryjson).then((response: any) => {
          response = response;

          this.datacrowdService
            .getVcisfixedelementsID(this.simulationid)
            .then(async (response2: any) => {
              response2 = response2;
              //console.log('getVcisfixedelementsID>>>', response2);
              //console.log('getVcisfixedelementsID>>>', response2.length);

              //console.log('in fixed element scan');


              for (var i = 0; i < response2.length; i++) {
                //console.log(response2[i][0]);
                numArr2.push(Number(response2[i][0]));
              }
              //console.log('numArr>>', numArr2);
              //console.log('typeof numArr>>', typeof numArr2);

   

              if (this.reportType == 9) {
                //console.log('in fixed element activity scan');

                await this.datacrowdService.getsimualtion(this.simulationid, this.usercode).then((res: any) => {
                  this.datajson = res;
                  //console.log("getsimultion response >>>>", this.datajson);

                });



                //console.log("this.datajson.markerPositions<<<>>>>>", this.datajson.markerPositions.length);
                if(this.marker){
                  this.map.removeLayer(this.marker);
                }
                this.marker = L.markerClusterGroup({
                  spiderfyOnMaxZoom: false,
                  animate: true,
                  singleMarkerMode: true,
                });
                this.displayClusters2(this.simulationid);
               

              }
              if (this.reportTypeId == 9) {
                if (this.datajson.markerPositions.length == 0) {
                  const dialogConfig = new MatDialogConfig();
                  dialogConfig.data = {
                    content: this.tns_alert_m2,
                  };
                  // this.intervalSubscription.unsubscribe();
                  this.dialog.open(ContentmodalComponent, dialogConfig);
                  // (window.parent.parent.parent[7] as any).clearshapes();
                }
                if (response2.length == 0) {
                  const dialogConfig = new MatDialogConfig();
                  dialogConfig.data = {
                    content: this.tns_alert_m22,
                  };
                  // this.intervalSubscription.unsubscribe();
                  this.dialog.open(ContentmodalComponent, dialogConfig);

                }
              } else {
                if (response2.length == 0) {
                  const dialogConfig = new MatDialogConfig();
                  dialogConfig.data = {
                    content: this.tns_alert_m22,
                  };
                  // this.intervalSubscription.unsubscribe();

                  this.dialog.open(ContentmodalComponent, dialogConfig);

                }
              }

              if (this.BtsTypeSlected == 'BTS') {

                if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_sqlcond) {
                  //console.log("A_sqlcond", (window.parent.parent.parent[7] as any).A_sqlcond)
                  this.isSqlCond = (window.parent.parent.parent[7] as any).A_sqlcond;
                  //console.log("A_sqlcond>>", this.isSqlCond)
            
                }

            

                if (typeof (window.parent.parent.parent[7] as any).A_sqlcond == "undefined") {
                  this.isSqlCond = "";
                }
            
                // this.BTSObject= new BTSObject(numArr2,this.isSqlCond);
                


                this.BTSObject= {
                  sqlcond:this.isSqlCond,
                  ids:numArr2
                }

                
                this.datacrowdService.getfixedelementsObject2BTS(JSON.stringify(this.BTSObject), this.usercode).then((res: any) => {
                  //console.log('getfixedelementsObject2BTS>>>>', res);
                  //localStorage.setItem('getfixedelementsObject2BTS',JSON.stringify(res));


                  this.CdrData = res;



                  this.CdrRowData = [];
                  this.CdrRowData2 = [];


                  //console.log('x', this.CdrData);
                  //console.log('x000', this.CdrData[0]);


                  this.fixedMarkersGroup = new L.MarkerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    animate: true,
                    singleMarkerMode: false,
                    zoomToBoundsOnClick: false,
                    maxClusterRadius: function (zoom) {
                      if (zoom >= 12) {
                        //console.log('innnnnnnnnnnnnnnnnn')
                        return 0;
                      } else {
                        //console.log('innnnnnnnnnnnnnnnnn')

                        return 50 / zoom;
                      }
                    },
                    iconCreateFunction: function (cluster) {
                      var markers = cluster.getAllChildMarkers();
                      var html = '<div  class="elementGroup" >' + markers.length + '</div>';

                      return L.divIcon({
                        html: html,
                        className: 'mycluster',
                        iconSize: L.point(32, 32)
                      });
                    },
                  });

                  this.fixedMarkersGroupLoop = new L.MarkerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    animate: true,
                    singleMarkerMode: false,
                    zoomToBoundsOnClick: false,
                    maxClusterRadius: function (zoom) {
                      if (zoom >= 12) {
                        //console.log('innnnnnnnnnnnnnnnnn')
                        return 0;
                      } else {
                        //console.log('innnnnnnnnnnnnnnnnn')

                        return 50 / zoom;
                      }
                    },
                    iconCreateFunction: function (cluster) {
                      var markers = cluster.getAllChildMarkers();
                      var html = '<div  class="elementGroup" >' + markers.length + '</div>';

                      return L.divIcon({
                        html: html,
                        className: 'mycluster',
                        iconSize: L.point(32, 32)
                      });
                    },
                  });


                  for (let i = 0; i < this.CdrData[0].length; i++) {
                
                    this.displayBTS(this.CdrData[0][i].BTS);
                    //console.log('this.CdrData[0][i]>>>', this.CdrData[0][i].BTS);


                    for (let j = 0; j < this.CdrData[0][i].SECTORS.length; j++) {
                      // //console.log('this.CdrData[1]>>>',this.CdrData[1]);
                      ////console.log('this.CdrData[1][i][j]>>>',this.CdrData[1][i][j]);
                      this.drawarc(Number(this.CdrData[0][i].BTS.LATITUDE), Number(this.CdrData[0][i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(this.CdrData[0][i].SECTORS[j]) - 22.5, 90 + Number(this.CdrData[0][i].SECTORS[j]) + 22.5, this.SectorColor, '', '');

                    }
                  }


                })
              } else if (this.BtsTypeSlected == 'FixedElements') {
                for (const layer of this.sectorarray) {
                  this.map.removeLayer(layer);
                }
                this.datacrowdService
                  .getfixedelementsObject(numArr2)
                  .then(async (res: any) => {
                    //console.log('display scan fixed elements>>', res)
                    this.displayFixedElements(res);

                  });

              }

              ;
            });
        });

      });





    }
    else if(this.reportType == 14){
      for (const elt of this.Coord) {
        if(elt.Type==='Circle'){
          let turfshape:any = turf.circle([elt.center.lng, elt.center.lat], elt.radius / 1000, { units: 'kilometers' });
  
          const intersectingRegions:any = [];
     
          //console.log("geoJsonData ",this.geojsonData);
          // Iterate through each feature in the GeoJSON data
          
          this.geojsonData.features.forEach((feature: any) => {
   
            // Check if the circle intersects with the feature
           const doesIntersect = turf.booleanOverlap(turf.simplify(feature),turf.simplify(turfshape));
            //console.log('doesIntersect' ,doesIntersect)
        
            // //console.log('doesIntersect2', doesIntersect2);
            
        
            if (doesIntersect) {
              intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
             }else{
             const doesIntersect2 = turf.booleanPointInPolygon(
               turf.point([elt.center.lng, elt.center.lat]), // Create a Turf.js Point from circle center
               feature // Assuming the GeoJSON feature is a Polygon
             );
              if (doesIntersect2) {
                intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
              }
            }
   
   
   
           
          });
      
          //console.log('zz circle>>>>',intersectingRegions);
  
  
          ///
          let  C_countryCodes:any
      await this.datacrowdService.getcountry(intersectingRegions).then((ress:any)=>{
       //console.log('getcountry>>>>',ress);
       // C_subregion=ress[0];
       // C_region=ress[1];
       // C_Country=ress[2];
       C_countryCodes=ress;
     
     }) 
          elt.countrycodes=this.convertCountryCode(C_countryCodes);
        }
      };
      const dialogRef = this.dialog.open(this.BtsType);
      dialogRef.afterClosed().subscribe(result => {
        //console.log('BtsTypeSlected>>>', this.BtsTypeSlected);
        let numArr2: any = [];
        //remove the old fixedelements and markers
        if (this.fixedMarkersArray.length > 0) {
          this.map.removeLayer(this.fixedMarkersGroup);
          this.fixedMarkersArray = [];
        }
        this.fixedElementMarker = [];
        this.fixedMarkersArray = [];

        this.datacrowdService.ScanfixedElements(queryjson).then((response: any) => {
          response = response;
          //console.log('this.simulationid>>>', this.simulationid);
          //console.log('response>>>',response);

          this.datacrowdService
            .getVcisfixedelementsID(this.simulationid)
            .then(async (response2: any) => {

              //console.log('response2>>>', response2);
              response2 = response2;
              //console.log('getVcisfixedelementsID>>>', response2);
              //console.log('getVcisfixedelementsID>>>', response2.length);

              //console.log('in fixed element scan');


              for (var i = 0; i < response2.length; i++) {
                //console.log(response2[i][0]);
                numArr2.push(Number(response2[i][0]));
              }
              //console.log('numArr>>', numArr2);
              //console.log('typeof numArr>>', typeof numArr2);
           
                if (response2.length == 0) {
                  const dialogConfig = new MatDialogConfig();
                  dialogConfig.data = {
                    content: this.tns_alert_m22,
                  };

                  this.dialog.open(ContentmodalComponent, dialogConfig);

                }
              

              if (this.BtsTypeSlected == 'BTS') {

                if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_sqlcond) {
                  //console.log("A_sqlcond", (window.parent.parent.parent[7] as any).A_sqlcond)
                  this.isSqlCond = (window.parent.parent.parent[7] as any).A_sqlcond;
                  //console.log("A_sqlcond>>", this.isSqlCond)
            
                }

            

                if (typeof (window.parent.parent.parent[7] as any).A_sqlcond == "undefined") {
                  this.isSqlCond = "";
                }
            
                // this.BTSObject= new BTSObject(numArr2,this.isSqlCond);
                


                this.BTSObject= {
                  sqlcond:this.isSqlCond,
                  ids:numArr2
                }

                
                this.datacrowdService.getfixedelementsObject2BTS(JSON.stringify(this.BTSObject), this.usercode).then((res: any) => {
                  //console.log('getfixedelementsObject2BTS>>>>', res);
                  //localStorage.setItem('getfixedelementsObject2BTS',JSON.stringify(res));


                  this.CdrData = res;



                  this.CdrRowData = [];
                  this.CdrRowData2 = [];


                  //console.log('x', this.CdrData);
                  //console.log('x000', this.CdrData[0]);


                  this.fixedMarkersGroup = new L.MarkerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    animate: true,
                    singleMarkerMode: false,
                    zoomToBoundsOnClick: false,
                    maxClusterRadius: function (zoom) {
                      if (zoom >= 12) {
                        //console.log('innnnnnnnnnnnnnnnnn')
                        return 0;
                      } else {
                        //console.log('innnnnnnnnnnnnnnnnn')

                        return 50 / zoom;
                      }
                    },
                    iconCreateFunction: function (cluster) {
                      var markers = cluster.getAllChildMarkers();
                      var html = '<div  class="elementGroup" >' + markers.length + '</div>';

                      return L.divIcon({
                        html: html,
                        className: 'mycluster',
                        iconSize: L.point(32, 32)
                      });
                    },
                  });
                  this.fixedMarkersGroupLoop = new L.MarkerClusterGroup({
                    spiderfyOnMaxZoom: true,
                    animate: true,
                    singleMarkerMode: false,
                    zoomToBoundsOnClick: false,
                    maxClusterRadius: function (zoom) {
                      if (zoom >= 12) {
                        //console.log('innnnnnnnnnnnnnnnnn')
                        return 0;
                      } else {
                        //console.log('innnnnnnnnnnnnnnnnn')

                        return 50 / zoom;
                      }
                    },
                    iconCreateFunction: function (cluster) {
                      var markers = cluster.getAllChildMarkers();
                      var html = '<div  class="elementGroup" >' + markers.length + '</div>';

                      return L.divIcon({
                        html: html,
                        className: 'mycluster',
                        iconSize: L.point(32, 32)
                      });
                    },
                  });



                  for (let i = 0; i < this.CdrData[0].length; i++) {
                    this.displayBTS(this.CdrData[0][i].BTS);
                    //console.log('this.CdrData[0][i]>>>', this.CdrData[0][i].BTS);
                    //console.log('5555555555555555555555');
                    this.btsarray.push(this.CdrData[0][i].BTS);
                    //console.log('this.btsarray----------',this.btsarray);


                    for (let j = 0; j < this.CdrData[0][i].SECTORS.length; j++) {
                      // //console.log('this.CdrData[1]>>>',this.CdrData[1]);
                      ////console.log('this.CdrData[1][i][j]>>>',this.CdrData[1][i][j]);
                      this.drawarc(Number(this.CdrData[0][i].BTS.LATITUDE), Number(this.CdrData[0][i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(this.CdrData[0][i].SECTORS[j]) - 22.5, 90 + Number(this.CdrData[0][i].SECTORS[j]) + 22.5, this.SectorColor, '', '');

                    }
                  }


                })

              } else if (this.BtsTypeSlected == 'FixedElements') {
                for (const layer of this.sectorarray) {
                  this.map.removeLayer(layer);
                }
                this.datacrowdService
                  .getfixedelementsObject(numArr2)
                  .then(async (res: any) => {
                    //console.log('display scan fixed elements>>', res);
                    this.displayFixedElements(res);

                  });

              }

              ;
            });
        });

      });
      //console.log('btsarray111111111111111111>>>>', this.btsarray);
      queryjson.Devices=this.btsarray.toString();
      //console.log('777777777777777>>>>', queryjson.Devices);

      this.datajson = await this.getSimulationData(queryjson);
      console.log('datajson111111111111111111>>>>', this.datajson);


 

  
 
    }else {

   
      // let mergeArrays:any= this.mergeArrays(arrayofCountryCodes[0],queryjson.countryCode);
      // //console.log("mergeArrays",mergeArrays);
      this.test(queryjson)
    }

    (window.parent.parent.parent[7] as any).CopyMultiselection(this.multiselection);

    this.Devices = [];
    localStorage.clear();




    // this.executeMapExplore(queryjson);
    // this.getSimulationData(queryjson)

    // this.test(queryjson)
    if(this.senarioFlag==true){
      this.senariocount++;

    }
    this.routeDevices=this.Devices;

  }

  //  dateTtoDate(date: any) {
  //   date = new Date(date);
  //   // date = String(date);
  //   // var getDate = date.split("GMT");
  //   // date = getDate[0];


  //    return date;
  //   // const date = new Date(timestamp ); // Convert to milliseconds
  //   // return this.datePipe.transform(date, 'EEEE, MMMM d, y h:mm:ss a');
  // }

  // dateTtoDate(milliseconds: number): string {
  //   const formattedDate = this.datePipe.transform(new Date(milliseconds), 'yyyy-MM-dd HH:mm:ss');
  //   // return formattedDate || '';
  //   //console.log('test>>>>>>>>>>' , formattedDate)
  //   return formattedDate || '';
  // }

  dateTtoDate(milliseconds: number): string {
  
    const date = new Date(milliseconds);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric', 
     month: 'numeric',
      year: 'numeric',
     hour: 'numeric',
      minute: 'numeric',
      hour12: true
     
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    console.log('test>>>>>>>>>>' , formattedDate);
    return formattedDate;
  }

  

  binddata(
    obj0: any,
    obj1: any,
    obj2: any,
    obj3: any,
    obj4: any,
    obj5: any,
    hits: any
  ) {
    var hit = 0;
    if (hits == "") {
      hit = 1;
    } else {
      hit = hits;
    }
    if (this.isSelectMode) {
      return L.marker([obj0, obj1]);
    } else {

      return L.marker([obj0, obj1])
    }
  }
  binddataCotravelers(
    obj0: any,
    obj1: any,
    obj2: any,
    obj3: any,
    obj4: any,
    obj5: any,
    hits: any
  ) {
    var hit = 0;
    if (hits == "") {
      hit = 1;
    } else {
      hit = hits;
    }
    if (this.isSelectMode) {
      return L.marker([obj0, obj1], { icon: this.singlepersonicon });
    } else {

      return L.marker([obj0, obj1], { icon: this.singlepersonicon })
    }
  }

  initializeGrid() {
    this.showPopup = true;
  }


  async test(obj: any) {
   
    let resp: any;
    // (window.parent.parent.parent[7] as any).clearAfterSimul(); 

    if (this.heat) {
      this.map.removeLayer(this.heat);

    }


    this.deletingModeEnabled = true;//this variable is used for disable the popup of naming aoi (naming shapes)

    // this.datajson = await this.datacrowdService.getcoord();
  //   //console.log('obj queryjson>>', obj);
    for (const elt of obj.Coordinates) {
      if(elt.Type==='Circle'){
        let turfshape:any = turf.circle([elt.center.lng, elt.center.lat], elt.radius / 1000, { units: 'kilometers' });

        const intersectingRegions:any = [];
   
        //console.log("geoJsonData ",this.geojsonData);
        // Iterate through each feature in the GeoJSON data
        
        this.geojsonData.features.forEach((feature: any) => {
 
          // Check if the circle intersects with the feature
         const doesIntersect = turf.booleanOverlap(turf.simplify(feature),turf.simplify(turfshape));
          //console.log('doesIntersect' ,doesIntersect)
      
          // //console.log('doesIntersect2', doesIntersect2);
          
      
          if (doesIntersect) {
            intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
           }else{
           const doesIntersect2 = turf.booleanPointInPolygon(
             turf.point([elt.center.lng, elt.center.lat]), // Create a Turf.js Point from circle center
             feature // Assuming the GeoJSON feature is a Polygon
           );
            if (doesIntersect2) {
              intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
            }
          }
 
 
 
         
        });
    
        //console.log('zz circle>>>>',intersectingRegions);


        ///
        let  C_countryCodes:any
      
 
 
    await this.datacrowdService.getcountry(intersectingRegions).then((ress:any)=>{
     console.log('getcountry>>>>',ress);
     // C_subregion=ress[0];
     // C_region=ress[1];
     // C_Country=ress[2];
     C_countryCodes=ress;
   
   }) 
 

        elt.countrycodes=this.convertCountryCode(C_countryCodes);
      }
    };

    if(this.reportType==6){
      let arrayofCountryCodes:any[]=[];
      //console.log("Coord>>>",this.Coord);
    //console.log("arrayofCountryCodes first >>>",arrayofCountryCodes);

      if(this.Coord){
        this.Coord.forEach((element:any,key:any)=>{
    //console.log("arrayofCountryCodes before >>>",arrayofCountryCodes);

      //console.log("element>>>",element.countrycodes);
      //console.log("element.countrycodes[0]>>>",element.countrycodes[0]);
      if(element.countrycodes[0].length>0){
      arrayofCountryCodes.push(element.countrycodes[0]);
    }
    //console.log("arrayofCountryCodes after >>>",arrayofCountryCodes);

        })


      }
      //console.log("queryjson countryCode",obj.countryCode);
      obj.countryCode.forEach((element2:any,key:any)=>{
        arrayofCountryCodes.push(element2);

      });
      //console.log("arrayofCountryCodes final>>>",arrayofCountryCodes);
      //console.log("arrayofCountryCodes2222>>>",this.convertCountryCode2(arrayofCountryCodes));
      obj.countryCode=this.convertCountryCode2(arrayofCountryCodes);
    }

    //console.log('obj queryjson final>>', obj);

    this.datajson = await this.getSimulationData(obj);
    console.log('obj queryjson final>>', this.datajson);

  if(this.flagInQueue == 1){
    //console.log('flagInQueue>>>>>>>>>>>>>>>>',this.flagInQueue);
    this.datajson = "";
    return;
  }else{
    //console.log('datajson>>>>', this.datajson)
	
    if (this.reportType == '10') {
      this.scandevices();
    } else
      if (this.reportType == '11') {
   
        this.tcd();
      } else {
        if (this.datajson.markerPositions == null || this.datajson.heatCoords == null) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            content: this.tns_alert_m2,
          };
          this.intervalSubscription.unsubscribe();
          this.dialog.open(ContentmodalComponent, dialogConfig);
          (window.parent.parent.parent[7] as any).clearshapes();
        } else {




          if (this.marker) {
            //console.log("marker>>>", this.marker);
            this.map.removeLayer(this.marker);
          }
          if (this.markers) {
            this.map.removeLayer(this.markers);

          }

          // //console.log("this.datajson.markerPositions>>>>>", this.datajson)
          this.marker = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            animate: true,
            singleMarkerMode: true,
          });
          this.heat = L.heatLayer(this.datajson.heatCoords, {
            radius: 20
          });
          // let activityDensity = this.heat.addTo(this.map);

          let activityHotspots = L.layerGroup([this.marker]).addTo(this.map);
          if (this.reportType == 2) {
            this.overlayMaps = {
              //   "Activity Density": activityDensity,
              "Activity Hotspots": activityHotspots,
            };
          } else {

            // let areaDemographics:any=this.datacrowdService.getsimualtion(this.simulationid,this.usercode);
            // let areaDemographicsLayers = this.getDrawAreasDemographics(areaDemographics, this.map);
            // let  areaDemographies = L.layerGroup(areaDemographicsLayers).addTo(this.map);
            // //loop over areaDemographics get centers and add them to the markers array and filter section
            //  this.markersArray = [];
            // areaDemographics.Coordinates.forEach((element:any, key:any) => {
            //   if(element.center) this.markersArray.push(L.marker([element.center.lat, element.center.lng]));
            // });
            // var demographicMarkers = L.layerGroup(this.markersArray).addTo(this.map);
            var Tooltip = new L.LayerGroup();
            Tooltip.on('add', () => {
              this.map.eachLayer((l: any) => {
                if (l.getTooltip) {
                  var toolTip = l.getTooltip();
                  if (toolTip) {
                    this.map.addLayer(toolTip);
                  }
                }
              });
            })
            Tooltip.on('remove', () => {
              this.map.eachLayer((l: any) => {
                if (l.getTooltip) {
                  var toolTip = l.getTooltip();
                  if (toolTip) {
                    this.map.closeTooltip(toolTip);
                  }
                }
              });
            });
            this.overlayMaps = {
              "Tooltip": Tooltip,
              // "Activity Density": activityDensity,
              "Activity Hotspots": activityHotspots,
              // "Area Demographics": areaDemographies,
              //"Demographic Markers": demographicMarkers,
            };
            this.datasource.push({ name: "Tooltip" }, { name: "DateTooltip" }, { name: "activityDensity" }, { name: "activityHotspots" })

          }


          const baseLayers = {
            'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Map data Â© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            }),
            'Satellite Map': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: 'Map data Â© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            })
          };

  
          this.displayClusters2(this.simulationid);
       

        }
        if (this.reportType == '7') {
          for (var i = 0; i < this.datajson.Shape.length; i++) {
      
            this.circle = L.circle([this.datajson.Shape[i].Center.lat, this.datajson.Shape[i].Center.lng], this.datajson.Shape[i].Radius, {
              color: "#6e83f0",
              fillOpacity: 0.5,
              radius: this.datajson.Shape[i].Radius,
            });
            this.layerGroup.addLayer(this.circle);

          }
          this.circle.addTo(this.map);

          // this.layerGroup.addLayer(this.circle);
          this.layerGroup.addTo(this.map);
        }
        else if (this.reportType == '2') {
          this.map.setView([
            Number(this.datajson.markerPositions[0][0]),
            Number(this.datajson.markerPositions[0][1]),
          ], 12);
        }
 
      }

    $('#controlbutton').css('display', '');
  }

  //console.log("zzsenariocount",this.senariocount)
  //console.log("zzaddnewsenariocount",this.addnewsenariocount)
  //console.log("zzsenarioFlag",this.senarioFlag);

if(this.senarioFlag==true && this.senariocount==1 && this.addnewsenariocount==0){
  Swal.fire({
    text: "Please save The Simulation",
    icon: 'warning',
    // showCancelButton: true,
  });

}

  let obj22:any={
    senarioParentName:this.senarioParentName,
    simulationid:this.simulationid,
    Action:"addnewMenu",
    senariocount:this.senariocount,
    senarioFlag:this.senarioFlag,
    reportType:this.reportType
  }
    
  // this.senarioIdOutput.emit(obj22);
      this.navbarSimulId=obj22;


}
  breakProcess() {
  window.location.href = 'https://'+window.location.hostname+':9999/cybercrowd/angular/index.html'; 
}

  async test2() {
    let resp: any;



    this.datacrowdService.getData().then((data: any) => {
      this.datajson = data;
    });
    //console.log('datajson>>>>', this.datajson)

    this.marker = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      animate: true,
      singleMarkerMode: true,
    });
    // this.marker = L.markerClusterGroup({
    //   chunkedLoading: true,
    //   chunkInterval: 200, // process markers for a maximum of 200ms
    //   chunkDelay: 50, // delay between processes
    //   //chunkProgress: updateProgressBar 
    //   });
    for (var j = 0; j < 1; j++) {
      for (var i = 0; i < this.datajson.markerPositions.length; i++) {
        this.myMarker = L.marker([
          Number(this.datajson.markerPositions[i][0]),
          Number(this.datajson.markerPositions[i][1]),
        ]);


      }
      this.rowData = [];
      this.datajson.markerPositions.forEach((element: any, key: any) => {
        this.myMarker = this.binddata(
          element[0],
          element[1],
          element[2],
          element[3],
          element[4],
          element[5],
          ""
        );
        this.myMarker.lat = element[0];
        this.myMarker.lng = element[1];
        this.myMarker.timestamp = element[3];
        this.myMarker.tel = element[2];
        this.myMarker.name = element[4];
        this.myMarker.off("click");

        // this.marker.addLayer(this.myMarker);
        this.markersArray.push(this.myMarker);

      });

    };


    this.marker.addLayers(this.markersArray);

    this.map.addLayer(this.marker);
    //  this.marker.addTo(this.map);


  }




  openTools() {
    if (this.showtools == true) {
      this.showtools = false;
      // //console.log('element >>>> ',element)
      //console.log('toolbar >>>', $('.leaflet-draw-toolbar'))
      $('.leaflet-draw-toolbar').css('display', 'none');
      $('.graphtools').css('display', 'none');
      $('#moretools').css('display', 'none');
    } else {
      this.showtools = true;

      $('.leaflet-draw-toolbar').css('display', '');
      $('.graphtools').css('display', '');
      $('#moretools').css('display', '');

    }


  }

  openPopup2() {


    if (this.popupContent) {
      const componentfactory =
        this.componentFactoryResolver.resolveComponentFactory(
          VAgGridComponent
        );
      const componentref =
        this.viewContainerRef.createComponent(componentfactory);
      componentref.instance.rowData = this.rowData;
      componentref.instance.columnDefs = this.columnDefs2;
      componentref.instance.headerHeight = 30;
      // componentref.instance.selectdevices = true;
      componentref.instance.Title = "";
      componentref.instance.distinct = true;
      componentref.instance.rowGrouping = false;
      componentref.changeDetectorRef.detectChanges();
      const html1 = componentref.location.nativeElement;

      this.map.closePopup()

      this.modalRef = this.modalService.open(this.popupContent);



      $(".modal-content").css("width", "650px");
      $(".modal-content").css("right", "200px");
      $(".modal-content").css("padding", "10px");
      $(".modal-content").css("top", "85px");
      $(".modal-content").draggable({
        axis: "both",
        cursor: "move"
      });

    }

  }

  opentcdGrid() {

    if (this.TCDContent) {
        const componentfactory =
        this.componentFactoryResolver.resolveComponentFactory(
          VAgGridComponent
        );
      const componentref =
        this.viewContainerRef.createComponent(componentfactory);
      componentref.instance.rowData = this.TcdRowData;
      componentref.instance.columnDefs = this.columnDefsTcd2;
      componentref.instance.headerHeight = 30;
      // componentref.instance.selectdevices = true;
      componentref.instance.Title = "";
      componentref.instance.distinct = true;
      componentref.instance.rowGrouping=false;
      componentref.changeDetectorRef.detectChanges();
      const html1 = componentref.location.nativeElement;

      //  L.popup({closeOnClick: false, autoClose: false, closeButton: true}).openPopup();
      this.map.closePopup()
      //this.popup.open();

      this.modalRef = this.modalService.open(this.TCDContent);



      $(".modal-content").css("width", "650px");
      $(".modal-content").css("right", "200px");
      $(".modal-content").css("padding", "10px");
      $(".modal-content").css("top", "85px");
      $(".modal-content").draggable({
        axis: "both",
        cursor: "move"
      });

    } 

  }
  opencdrGrid() {

    if (this.CdrContent) {
   
      this.map.closePopup()
      //this.popup.open();

      this.modalRef = this.modalService.open(this.CdrContent);



      $(".modal-content").css("width", "650px");
      $(".modal-content").css("right", "200px");
      $(".modal-content").css("padding", "10px");
      $(".modal-content").css("top", "85px");
      $(".modal-content").draggable({
        axis: "both",
        cursor: "move"
      });

    }

  }
  
  closedialogall() {
    //close for the  dialog(contentmodal)
    this.dialog.closeAll();


  }
  closepopup() {
    this.map.closePopup();

  }

  closedialog() {
    //close for the save shapes dialog(saveshapecomponent)
    //console.log("value of the mat dialog is >>>>>> ", $("#inputValue").val());
    this.dialog.closeAll();
    if ($("#inputValue").val() == "" || $("#inputValue").val() == "undefined" || typeof ($("#inputValue").val()) == "undefined" || this.shapeName == "") {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: this.tns_alert_22,
      };

      this.dialog.open(ContentmodalComponent, dialogConfig);
    }
  }

  closedialog2() {
    //close for the save shapes dialog(saveshapecomponent) if the user click save
    //console.log("value of the mat dialog is >>>>>> ", $("#inputValue").val());
    this.shapeName = $("#inputValue").val();
    this.saveCheckbox = $("#save").is(":checked");
    this.dialog.closeAll();
  }



  receiveData(data: string) {
    //alert("receivedata")
    //console.log(data);
    // Do something with the data
  }

  CallFunctions(value: any) {
    $('#hiddenbutton').css('display', '');
    //console.log("hiddenbutton>>>>", $('#hiddenbutton'));

    //console.log("value is : ", value);
    const functionName = value;
    const result = eval(`this.${functionName}()`)

  }


  changeMap(id: any) {
    // //console.log('Selected ID:', this.selectedId);
    //alert("id="+id)
    let idtype;
    let newLayer;
    // Remove current tile layer
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        this.map.removeLayer(layer);
      }
    })

    if (id == "googleStreets") {

  // Clean up the map when the component is destroyed
  if (this.map3d) {
    this.map3d.remove(); // This removes the map instance and its event listeners
  }

      idtype = "s,h&x";
      let googleLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=' + idtype + '={x}&y={y}&z={z}', {
        maxNativeZoom: 19,
        maxZoom: 25,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });
      this.map.addLayer(googleLayer);
    } else if (id == "googleStreets1") {

  // Clean up the map when the component is destroyed
    if (this.map3d) {
      this.map3d.remove(); // This removes the map instance and its event listeners
    }
      idtype = "m&x";
      let googleLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=' + idtype + '={x}&y={y}&z={z}', {
        maxNativeZoom: 19,
        maxZoom: 25,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });
      this.map.addLayer(googleLayer);
    }
    else if (id == "outdoors-v11-3D") {
      this.clearShapes();

      this.map3d = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [35.63931, 33.88153],
        zoom: 7,
        accessToken: 'pk.eyJ1IjoidmFsb29yZXMiLCJhIjoiY2wzd21md3VkMDgxZTNibzhpc2dhOGx0MCJ9.CSG26gI-rCZLv0HV0rJwxw'
      });

      this.map3d.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
      this.map3d.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    } else if (id == "streets-v11-3D") {
      this.clearShapes();

      this.map3d = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [35.63931, 33.88153],
        zoom: 7,
        accessToken: 'pk.eyJ1IjoidmFsb29yZXMiLCJhIjoiY2wzd21md3VkMDgxZTNibzhpc2dhOGx0MCJ9.CSG26gI-rCZLv0HV0rJwxw'
      });

      this.map3d.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
      this.map3d.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    } else if (id == "satellite-streets-v11-3D") {
      this.clearShapes();

      this.map3d = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [35.63931, 33.88153],
        zoom: 7,
        accessToken: 'pk.eyJ1IjoidmFsb29yZXMiLCJhIjoiY2wzd21md3VkMDgxZTNibzhpc2dhOGx0MCJ9.CSG26gI-rCZLv0HV0rJwxw'
      });

      this.map3d.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
      this.map3d.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    }
    else {

      idtype = 'mapbox/' + id;
      newLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
        maxNativeZoom: 19,
        maxZoom: 25,
        id: idtype,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoidmFsb29yZXMiLCJhIjoiY2wzd21md3VkMDgxZTNibzhpc2dhOGx0MCJ9.CSG26gI-rCZLv0HV0rJwxw'
      })

      // Add new tile layer to the map
      this.map.addLayer(newLayer);
    }




  }

  getaoiactivity(bodyParam: any) {

    //   let response:any;
    let queryId: String;
    queryId = bodyParam.queryId;
    this.datacrowdService.distanceAPI(bodyParam).then((response: any) => {
      response = response;
      //console.log("responceee>>>", response);
    });

  }


  getDrawAreasDemographics(shapesArr: any, map: any) {

    const allShapes: any[] = [];
    const multiareaselection: any[] = [];
    const areaselection: any[] = [];
    const layers: any[] = [];

    var shapesCoordinates = shapesArr.Coordinates;
    coords: [];
    shapesCoordinates.forEach((element: any, key: any) => {

      this.shapeId++;
      this.Coord.push(shapesCoordinates[key]);


      this.shapesArray.push(element);
      var shapeType = element.Type;
      if (shapeType == 'Circle') {
        this.thisshape = L.circle([element.center.lat, element.center.lng], element.radius);
        this.thisshape.bindTooltip(`${element.Name}`, {
          permanent: true,
          interactive: true,
          opacity: 0.9,
          direction: "center"
        }).addTo(map);

        layers.push(this.thisshape);
      } else if (shapeType == 'Rectangle') {



        let bnds = L.latLngBounds(
          L.latLng(
            element.Bounds.topLeft.lat,
            element.Bounds.topLeft.lng
          ),
          L.latLng(
            element.Bounds.bottomRight.lat,
            element.Bounds.bottomRight.lng
          )
        );



        this.thisshape = L.rectangle(bnds);
        this.thisshape.bindTooltip(`${element.Name}`, {
          permanent: true,
          interactive: true,
          opacity: 0.9,
          direction: "center"
        }).addTo(map);

        layers.push(this.thisshape);
      } else if (shapeType == 'Polygon') {
        var polygonPoints = element.Bounds;
        this.thisshape = L.polygon(polygonPoints);
        this.thisshape.bindTooltip(`${element.Name}`, {
          permanent: true,
          interactive: true,
          opacity: 0.9,
          direction: "center"
        }).addTo(map);

        layers.push(this.thisshape);
      } else if (shapeType == 'Polyline') {
        var bounds = element.Bounds;
        var boundsArray = [];
        for (const e of bounds) { // You can use `let` instead of `const` if you like
          boundsArray.push(new L.LatLng(e.lat, e.lng));
        }
        this.thisshape = new L.Polyline(boundsArray, {
          weight: 3,
          opacity: 0.5,
          smoothFactor: 1
        });
        this.thisshape.bindTooltip(`${element.Name}`, {
          permanent: true,
          interactive: true,
          opacity: 0.9,
          direction: "center"
        }).addTo(map);

        layers.push(this.thisshape);
      }
     

      allShapes[this.shapeId - 1] = this.thisshape;
      
      this.shapesArray.find(a => a.leafletid === element.leafletid)['leafletid'] = this.thisshape._leaflet_id;
      // areaselection(thisshape,thisshape._leaflet_id)
      map.setView([element.center.lat, element.center.lng], 12);
    });
    return layers;
  }


  displayBTS(object: any) {
    //console.log(" object element   ====", object)


   
    //console.log(" object element22   ====", object);
   
    var thisCenter = this.globalCoord;
    //console.log(" object====", object);

    thisCenter = [Number(object.LATITUDE), Number(object.LONGITUDE)];
    //console.log("thisCenter " + thisCenter);

    //var iconVar = "/assets/img/icons/"+element[2]+".png";
    var iconVar = "assets/img/icons/" + object.TYPE + ".png";
    //console.log("iconVar=", iconVar);


    if (!this.imageExists(iconVar)) {
      //console.log("image NOT  exists >>> ")

      iconVar = "/assets/img/icons/percentage.png";
    }
    else {
      //console.log("image exists >>> ")


    }

    if (object.TYPE == "percentage") {

      this.fixedElementMarker = this.binddataforfixedElements(Number(object.LATITUDE), Number(object.LONGITUDE), object.TYPE + "  " + object.TYPE + " %", iconVar).on('click', e => e.target.remove());
      console.log("fixedElementMarker===",this.fixedElementMarker);
      this.fixedElementMarkerLoop = this.binddataforfixedElementsLoop(Number(object.LATITUDE), Number(object.LONGITUDE), object.TYPE + "  " + object.TYPE + " %", iconVar).on('click', e => e.target.remove());
      console.log("fixedElementMarkerLoop===",this.fixedElementMarkerLoop);
    }

    else {
      this.fixedElementMarker = this.binddataforfixedElements(Number(object.LATITUDE), Number(object.LONGITUDE), object.TYPE, iconVar).on('click', e => e.target.remove());
      console.log("fixedElementMarker===",this.fixedElementMarker);
      this.fixedElementMarkerLoop = this.binddataforfixedElementsLoop(Number(object.LATITUDE), Number(object.LONGITUDE), object.TYPE, iconVar).on('click', e => e.target.remove());
      console.log("fixedElementMarkerLoop===",this.fixedElementMarkerLoop);
    }
    // this.fixedElementMarker.time=112213232213;
    //console.log('fixedElementMarker>>>', this.fixedElementMarker);
    this.fixedElementMarker.off("click");
    this.fixedElementMarker.on("mousedown", async (a: any) => {
      if (a.originalEvent.buttons == 2) {
        this.CdrRowData = [];
        this.CdrRowData2 = [];

        //console.log(" this.CdrData", this.CdrData);
        //console.log('istcd', this.isTcd);

        ///   let findedObject1=  this.CdrData[0].filter((item:any) => //console.log('item>>>>',item) );
        if (this.isTcd == true) {
          this.findedObject = this.CdrData.BTS[0].filter((item: any) => item.BTS.LATITUDE === object.LATITUDE && item.BTS.LONGITUDE === object.LONGITUDE);
        } else {
          this.findedObject = this.CdrData[0].filter((item: any) => item.BTS.LATITUDE === object.LATITUDE && item.BTS.LONGITUDE === object.LONGITUDE);
        }
        // console.log('info>>>', info);

        console.log(" this.findedObject", this.findedObject);
        const uniqueElements = new Set();

        this.findedObject.forEach((element1: any, key: any) => {
          // console.log('element>>>', element1);
     
          element1.INFO.forEach((info: any, key: any) => {

            if(!uniqueElements.has(info[9])) {
              // Add the element1 to the Set
              console.log("uniqueElements<>",uniqueElements)
              uniqueElements.add(info[9]);

                 
            var Cdrjsonaggrid =
            {
             // Type: object.TYPE,
              Location: info[5],
              BtsName: info[9],
              Sector: info[1],
              Technology: info[10],
              Frequency: info[6],
              Lng: info[2],
              Lat: info[3],
              Azimuth: info[1]
            };
            var Cdrjsonaggrid2 =
            {
              //Type: object.TYPE,
              Location: info[5],
              BtsName: info[9],
           
              Coord:info[3]+','+info[2]
            };

            this.CdrRowData.push(Cdrjsonaggrid);
            this.CdrRowData2.push(Cdrjsonaggrid2);
            }else{

            }
            // console.log('info>>>', info);

            //info=JSON.parse(info);
            ////console.log('info>>>',info);

       
          });

        });

     
        //console.log('e', e);
        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            VAgGridComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        componentref.instance.rowData = this.CdrRowData2;
        componentref.instance.columnDefs = this.columnDefsCdr2;
        componentref.instance.headerHeight = 20;
        // componentref.instance.selectdevices = true;
        componentref.instance.Title = "Here On";
        componentref.instance.distinct = false;
        componentref.changeDetectorRef.detectChanges();
        componentref.instance.pagination = false;
        componentref.instance.rowGrouping = true;
        componentref.instance.contextmenu = false;
        componentref.instance.Grid2Type = 'btn-54';
        componentref.instance.GridID = 'tcdGrid1';


        const cdrcontnet = componentref.location.nativeElement;
        await cdrcontnet;
        this.map.openPopup(cdrcontnet, a.target.getLatLng());
      

        $('.ag-theme-balham').css('height', ' 250px ');



        // a.target.openPopup();
        //console.log('leaflet-popup-content-wrapper>>>', $('.leaflet-popup-content-wrapper').css('width', '100px'))

        $('.leaflet-popup-content-wrapper').css('width', '100px');
        $('.leaflet-popup-content').addClass('layoutColor dialogTitleColor')
        $('.maptd').addClass('dialogTitleColor');

      } else
        if (a.originalEvent.buttons == 1) {
          this.map.setView([object.LATITUDE, object.LONGITUDE], 22)

        }

    });
    this.fixedMarkersArray.push(this.fixedElementMarker);
    console.log("fixedMarkersArray===",this.fixedMarkersArray);

    this.fixedMarkersArrayLoop.push(this.fixedElementMarkerLoop);
    console.log("fixedMarkersArrayLoop===",this.fixedMarkersArrayLoop);


    this.fixedMarkersGroup.addLayer(this.fixedElementMarker);
    console.log("fixedMarkersGroup===",this.fixedMarkersGroup);

    if(this.fixedMarkersGroupLoop!=undefined){
     
      this.fixedMarkersGroupLoop.addLayer(this.fixedElementMarkerLoop);
      this.fixedMarkersGroupLoop.addTo(this.magnifiedMap);
      console.log("fixedMarkersGroupLoop===",this.fixedMarkersGroupLoop);
    }

  
    //console.log('fixedMarkersArray>>>', this.fixedMarkersArray);
    this.fixedMarkersGroup.addTo(this.map);
 
    let x = this.map.getZoom();


  }

  displayFixedElements(object: any) {
    //console.log(" object element   ====", object)

    const fixelementsString = object;
    //console.log("fixelementsString   ====", fixelementsString)

    //console.log(" object element22   ====", object)
    if (object.length > 0) {
      this.dataType
      this.fixedMarkersGroup = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        animate: true,
        singleMarkerMode: false,
        zoomToBoundsOnClick: false,
        iconCreateFunction: function (cluster) {
          var markers = cluster.getAllChildMarkers();
          var html = '<div  class="elementGroup" >' + markers.length + '</div>';

          return L.divIcon({
            html: html,
            className: 'mycluster',
            iconSize: L.point(32, 32)
          });
        },
      });

      this.fixedMarkersGroupLoop = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        animate: true,
        singleMarkerMode: false,
        zoomToBoundsOnClick: false,
        iconCreateFunction: function (cluster) {
          var markers = cluster.getAllChildMarkers();
          var html = '<div  class="elementGroup" >' + markers.length + '</div>';

          return L.divIcon({
            html: html,
            className: 'mycluster',
            iconSize: L.point(32, 32)
          });
        },
      });


      var thisCenter = this.globalCoord;
      object.forEach((element: any, key: any) => {
        //console.log('elementfixed >>>>>>', element)
        if (element[4].replace(/[^.]/g, "").length == 1) {
          thisCenter = [element[4], element[3]];
          //var iconVar = "/assets/img/icons/"+element[2]+".png";
          var iconVar = "assets/img/icons/" + element[2] + ".png";
          //console.log("iconVar=" + iconVar);


          if (!this.imageExists(iconVar)) {
            //console.log("image exists >>> ")
            iconVar = "/cybercrowd/angular/assets/img/icons/percentage.png";
          }
          else { }

          if (element[2] == "percentage") {
            this.fixedElementMarker = this.binddataforfixedElements(element[4], element[3], element[2] + "  " + element.percentage + " %", iconVar).on('click', e => e.target.remove());
            this.fixedElementMarkerLoop = this.binddataforfixedElements(element[4], element[3], element[2] + "  " + element.percentage + " %", iconVar).on('click', e => e.target.remove());
          }
          else {
            this.fixedElementMarker = this.binddataforfixedElements(element[4], element[3], element[1], iconVar).on('click', e => e.target.remove()).bindPopup(`<strong>${element[1]}</strong>`);;
            this.fixedElementMarkerLoop = this.binddataforfixedElements(element[4], element[3], element[1], iconVar).on('click', e => e.target.remove()).bindPopup(`<strong>${element[1]}</strong>`);;
          }
          //console.log('fixedElementMarker>>>', this.fixedElementMarker);
          // 					drawShapes(bulkdraw , allShapes, shapeId++);
          this.fixedElementMarker.off("click");
          this.fixedElementMarker.on("mousedown", (a: any) => {
            if (a.originalEvent.buttons == 2) {
               //console.log("aaaaaaaaaaaaaaaa----",a);

            // Inside the forEach loop where you create fixedElementMarker
            // this.showPopupOnRightClick(this.fixedElementMarker, element[2]);

              a.target.openPopup();
              //console.log('leaflet-popup-content-wrapper>>>', $('.leaflet-popup-content-wrapper').css('width', '100px'))

              $('.leaflet-popup-content-wrapper').css('width', '100px');
              $('.leaflet-popup-content-wrapper').css('text-align', 'center');
              $('.leaflet-popup-content').addClass('layoutColor dialogTitleColor')
              $('.maptd').addClass('dialogTitleColor');

            } else
              if (a.originalEvent.buttons == 1) {
                this.map.setView([element[4], element[3]], 22)

              }

          });
          this.fixedMarkersArray.push(this.fixedElementMarker);
          this.fixedMarkersArrayLoop.push(this.fixedElementMarkerLoop);

          this.fixedMarkersGroup.addLayer(this.fixedElementMarker);
          this.fixedMarkersGroupLoop.addLayer(this.fixedElementMarkerLoop);
        }
      });
      if (this.fixedMarkersArray.length > 1) {
        this.map.setView(thisCenter, 5);
      } else {
        this.map.setView(thisCenter, 16);

      }          // 		fixedMarkersGroup = markersClusters;
      //console.log('fixedMarkersArray>>>', this.fixedMarkersArray);
      this.fixedMarkersGroup.addTo(this.map);
      this.fixedMarkersGroupLoop.addTo(this.magnifiedMap);

      this.fixedMarkersGroup.on('click', function (a) {
        const isNotRoute = 1;
      });
    } else {
    }
  }


  showPopupOnRightClick(marker: any, element: any) {
    marker.off('contextmenu');
    marker.on('contextmenu', (event: any) => {
      //console.log("event-----------",event);
      const popupContent = `<strong>${element}</strong>`;
      //console.log("popupContent-----------",popupContent);
  
      const popup = L.popup()
        .setLatLng(event.latlng)
        .setContent(popupContent)
        .openOn(this.map);
  
      // You can customize the popup content or style here
    });
  }
  
  imageExists(image_url: any) {

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

  }
   getIconSize(zoom: number): [number, number] {
    const baseSize = 32; // Base size of the icon
    const minSize = 16;  // Minimum size of the icon
    const maxSize = 64;  // Maximum size of the icon
    const size = Math.max(minSize, Math.min(maxSize, baseSize * (1 / zoom)));
    return [size, size];
  }

  binddataforfixedElements(LAT: any, LNG: any, NAME: any, ICON: any) {
  console.log("getZoom",this.map.getZoom())
  console.log("iconzise",this.getIconSize(this.map.getZoom()))

    var fixedElementIcon = L.icon({
      iconUrl: ICON,
      iconSize: this.getIconSize(this.map.getZoom()),
    });
    var marker = L.marker([LAT, LNG], {
      icon: fixedElementIcon,

    });
    // var popupContent =  `<div style='overflow:auto;'><div style='text-align:center'><strong>${NAME}</div></strong></div>`


    return marker;

  }

  binddataforfixedElementsLoop(LAT: any, LNG: any, NAME: any, ICON: any) {
 
 
  
      var fixedElementIcon = L.icon({
        iconUrl: ICON,
        iconSize: this.getIconSize(this.magnifiedMap.getZoom()),
      });
      var marker = L.marker([LAT, LNG], {
        icon: fixedElementIcon,
  
      });
      // var popupContent =  `<div style='overflow:auto;'><div style='text-align:center'><strong>${NAME}</div></strong></div>`
  
  
      return marker;
  
    }
  


  onselectedShape(e: any) {

    e.setStyle({
      color: 'yellow'
    });
    //selectedShapeArray = removeIdFromArray(e._leaflet_id, selectedShapeArray)

  }


  saveBulkdrawRaduis() {

    //console.log("cRdaius111>>", $('.bulkRadius'))
    //console.log("cRdaius>>", $('.bulkRadius').val())
    this.cRdaius = $('.bulkRadius').val();
    this.dialog.closeAll();
  }


  bullseye() {

    //console.log('this.fixedMarkersArray>>>>', this.fixedMarkersArray);
    //console.log('this.fixedelementsObject>>>>', JSON.parse(localStorage.getItem("fixedelementsObject")));


    if (this.fixedMarkersArray.length == 0 && JSON.parse(localStorage.getItem("fixedelementsObject")!).length == 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'Select 1 or more Fixed Elements!',
      };

      this.dialog.open(ContentmodalComponent, dialogConfig);

    }
    else {
      const dialogRef = this.dialog.open(this.bulkdraw)
      //  //console.log("cRdaius111>>",$('.bulkRadius'))


      dialogRef.afterClosed().subscribe(async result => {

        this.cRdaius = parseInt(this.cRdaius);
        if (this.cRdaius >= this.circleLimit) {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            content: 'Circle limit exeeded!',
          };

          let dialogRef = this.dialog.open(ContentmodalComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {


            //  this.map.removeLayer(shape);
            //  featureGroup.removeLayer(item.layer);


          });

        } else {
          //console.log("fixedelementsObject1111>>>>", this.fixedelementsObject)

          //console.log("fixedelementsObject>>>>", JSON.parse(localStorage.getItem("fixedelementsObject")));
          var shapeId = 0;
          if (JSON.parse(localStorage.getItem("fixedelementsObject")) === null) {

            if (this.fixedMarkersArray.length > 0) {
              //console.log('fixedMarkersArraylength>><<<><><', this.fixedMarkersArray.length);

              //console.log('fixedMarkersArray>><<<><><', this.fixedMarkersArray);
              //console.log("111111111")
              for (let element of this.fixedMarkersArray as any) {
                //console.log("222222222")
              
              // this.fixedMarkersArray.forEach(async (element: any, key: any) => {
                //console.log('center>>>', [element._latlng.lat, element._latlng.lng])
                this.circle = L.circle([element._latlng.lat, element._latlng.lng], {
                  color: "#6e83f0",
                  fillOpacity: 0.5,
                  radius: this.cRdaius,
                });


                this.center = {
                  lng: element._latlng.lng,
                  lat: element._latlng.lat
                };

                let  C_countryCodes:any=""
      
        

                this.Coord.push({
                  ID: shapeId,
                  Name: "",
                  Value: "",
                  Type: "Circle",
                  Bounds: "",
                  radius: this.cRdaius,
                  center: this.center,
                  leafletid: shapeId,
                  PolyBoundsCoords: "",
                  selectedStartDate: "",
                  selectedEndDate: "",
                  countrycodes:C_countryCodes,

                });


                //  localStorage.setItem("coords", JSON.stringify(this.Coord));

                //console.log("this.coord", this.Coord)

                this.layerGroup.addLayer(this.circle);

              };

            }
          } else {
            //console.log("else")

            this.fixedelementsObject = JSON.parse(localStorage.getItem("fixedelementsObject"));
            //console.log("fixedelementsObject>>>>", this.fixedelementsObject);
            //console.log("fixedelementsObjectlength>>>>", this.fixedelementsObject.length);

            // this.fixedelementsObject.forEach(async (element: any, key: any) => {
              for (const element of this.fixedelementsObject) {
                //console.log("555555555")

              //console.log('center>>>', [element[3], element[4]])
              this.circle = L.circle([element[4], element[3]], {
                color: "#6e83f0",
                fillOpacity: 0.5,
                radius: this.cRdaius,
              });

              this.center = {
                lng: element[3],
                lat: element[4]
              };

              let  C_countryCodes:any;
        
              let zz:any= await this.determineIntersectingRegions(this.circle,this.geojsonData,'circle');
              //console.log("zz ",zz);
       
         await this.datacrowdService.getcountry(zz).then((ress:any)=>{
           //console.log('getcountry>>>>',ress);
           // C_subregion=ress[0];
           // C_region=ress[1];
           // C_Country=ress[2];
           C_countryCodes=ress;
         
         }) 
       

              this.Coord.push({
                ID: shapeId,
                Name: "",
                Value: "",
                Type: "Circle",
                Bounds: "",
                radius: this.cRdaius,
                center: this.center,
                leafletid: shapeId,
                PolyBoundsCoords: "",
                selectedStartDate: "",
                selectedEndDate: "",
                countrycodes:C_countryCodes,

              });


              //  localStorage.setItem("coords", JSON.stringify(this.Coord));

              //console.log("this.coord", this.Coord)

              this.layerGroup.addLayer(this.circle);
              //console.log('shapeId1111111111', shapeId);
              //console.log("7777777777777777777")

              shapeId++;
              //console.log('shapeId22222222222', shapeId);

            };
          }
          //console.log('layerGroup', this.layerGroup);

          this.layerGroup.addTo(this.map);


          // this.map.setView(center, this.clickZoom)


        }
      });
    }

  }

  DatingShapes(e: any) {
    //console.log("e DatingShapes>>>>>", e);
    //console.log("Coord>>>>>", this.Coord);
    //console.log("DatingShapes selectedStartDate=", this.selectedStartDate);
    //console.log("DatingShapes typeof selectedStartDate=", typeof (this.selectedStartDate));

    //console.log("DatingShapes selectedEndDate=", this.selectedEndDate);
    //console.log("DatingShapes typeof selectedEndDate=", typeof (this.selectedEndDate));
    if (this.selectedStartDate == "" || this.selectedStartDate === undefined || typeof this.selectedStartDate === 'undefined' || this.selectedEndDate == "" || this.selectedEndDate === undefined || typeof this.selectedEndDate === 'undefined') {

      if (this.dataService.getOk() == true) {

        this.dataService.setData('');
        this.dataService.setStartDate('');
        this.dataService.setendDate('');
        e.layer.unbindTooltip();
        this.tooltipInstance = e.layer.bindTooltip(`Begin Operation: ${this.selectedStartDate}<br>End Operation: ${this.selectedEndDate}`, {
          permanent: true,
          interactive: true,
          noWrap: true,
          opacity: 0.9,

        });
        this.tooltipInstanceArray.push(this.tooltipInstance);
        this.tooltipInstance.closeTooltip();

        this.selectedStartDate = "";
        this.selectedEndDate = "";
        this.datingModeEnabled = true;
   
      }
      this.dataService.setOK(false);
    }
    else {
      this.shapeId = e.layer._leaflet_id;

      //console.log("shapeId>>>>", this.shapeId);
      if (this.dataService.getOk() == true) {


        e.layer.unbindTooltip();
        this.tooltipInstance = e.layer.bindTooltip(`Begin Operation: ${this.selectedStartDate}<br>End Operation: ${this.selectedEndDate}`, {
          permanent: true,
          interactive: true,
          noWrap: true,
          opacity: 0.9,

        });
        this.tooltipInstanceArray.push(this.tooltipInstance);
        //this.hideTooltip();
        this.selectedStartDate = "";
        this.selectedEndDate = "";
        this.datingModeEnabled = true;
        // this.dataService.setData('');
        // this.dataService.setStartDate('');
        // this.dataService.setendDate('');
      }
      this.dataService.setOK(false);
    }
  }
  namingshapes(e: any) {
    //console.log("e namingshapes>>>>>", e);
    //console.log("Coord>>>>>", this.Coord);


    // this.shapeName = $("#inputValue").val();
    //   this.saveCheckbox=$("#save").is(":checked");
    //console.log("namingshapes shapeName=", this.shapeName);
    //console.log("namingshapes typeof shapeName=", typeof (this.shapeName));
    //var save = document.getElementById("save");
    //const ShapeName = document.getElementById("text").value;
    if (this.shapeName == "" || this.shapeName === undefined || typeof this.shapeName === 'undefined') {

    }
    else {
      this.shapeId = e.layer._leaflet_id;
      if (this.saveCheckbox == true) {
        e.layer.unbindTooltip();
        this.tooltipInstanceName = e.layer.bindTooltip(`${this.shapeName}`, {
          permanent: true,
          interactive: true,
          noWrap: true,
          opacity: 0.9,
          direction: "center"
        }).openTooltip();
        this.tooltipInstanceNameArray.push(this.tooltipInstanceName);
        this.Coord.find(a => a.leafletid === this.shapeId)["Name"] = this.shapeName;
        //console.log('this.shapeName1>>>', this.shapeName);

        var str = e.layerType;
        //console.log('str>>>', str);
        var str2 = str.charAt(0).toUpperCase() + str.slice(1);
        //console.log('str2>>>', str2);
        var drawbElement = this.Coord.find(a => a.leafletid === e.layer._leaflet_id);
        //console.log('drawbElement>>>', drawbElement);
        var drawbElementId = drawbElement["ID"];
        //console.log('drawbElement>>>', drawbElement);
        this.Coord.find(a => a.ID === drawbElementId)['Name'] = this.shapeName;
        //console.log(' this.shapeName2>>>', this.shapeName);
        this.shapesArray.find(a => a.ID === drawbElementId)['Name'] = this.shapeName;
        var myObject = this.Coord.find(a => a.ID === drawbElementId);
        //console.log('myObject>>>>', myObject)
        this.shapesDataArray.push({
          "Name": drawbElementId,
          "Type": str2

        });

        //console.log('shapesDataArray>>>', this.shapesDataArray);
        var drawbElementName = drawbElement["Name"];
        var shapeValueData = this.Coord.find(a => a.ID === drawbElementId)["Value"];
        // USER  id combo

        this.datacrowdService.SaveShape(JSON.stringify(myObject)).then((res: { status: string; }) => {

          //console.log('SaveShape>>>>>>>>>>>', res);
          if (res.status == "fail") {


            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              content: 'Shape Name Already Exists',
            };

            this.dialog.open(ContentmodalComponent, dialogConfig);




          }
        });

      } else {
        e.layer.unbindTooltip();
        this.tooltipInstanceName = e.layer.bindTooltip(`${this.shapeName}`, {
          permanent: true,
          interactive: true,
          noWrap: true,
          opacity: 0.9,
          direction: "center"
        }).openTooltip();

        this.tooltipInstanceNameArray.push(this.tooltipInstanceName);

        this.Coord.find(a => a.leafletid === this.shapeId)["Name"] = this.shapeName;
      }
    }


    // else{
    // //   const dialogConfig = new MatDialogConfig();
    // //   dialogConfig.data = {
    // //     content: this.tns_alert_22,
    // //   };

    // // this.dialog.open(ContentmodalComponent, dialogConfig)	;
    // }

    this.shapeName = "";
    this.datingModeEnabled = false;
  };
  direction() {


    if (this.reportType == 6||this.reportType == 2) {
      //console.log("multiselection>>>", this.multiselection)

      this.datacrowdService.getdirection(this.simulationid, JSON.parse(localStorage.getItem("multiselection"))).then((res: any) => {
        //console.log('data>><<', res);

        let data: any = res;
        for (var i = 0; i < data.length; i++) {

          this.polyline = new L.Polyline(data[i].Bounds, {
            color: "#0c1a10",
            fillColor: "#0c1a10",
            fillOpacity: 0.5,
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
          });
          this.polylinearray.push(this.polyline);
          this.layerGroup.addLayer(this.polyline);
          this.drawnItems.addLayer(this.polyline);
          this.map.addLayer(this.polyline);
          this.polyline.on('click', (event: any) => {
            this.selectedPolyline = this.polyline;
          });
        }
      });


    }
    else {
      //console.log("report type", this.reportType);
      //console.log("report type222", (window.parent.parent.parent[7] as any));

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'The type must be Device History Or Device History Pattern!',
      };

      this.dialog.open(ContentmodalComponent, dialogConfig);
    }

  }

  getdirectionByTime() {


    if (this.reportType == 6||this.reportType == 2) {
      //console.log("multiselection>>>", this.multiselection)

      this.datacrowdService.getdirectionByTime(this.simulationid, JSON.parse(localStorage.getItem("multiselection"))).then((res: any) => {
        //console.log('getdirectionByTime>><<', res);

        let data: any = res;
        for (var i = 0; i < data.length; i++) {

          this.polyline = new L.Polyline(data[i].Bounds, {
            color: "#3388ff",
            fillColor: "#3388ff",
            fillOpacity: 0.5,
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
          });
          this.polylinearray.push(this.polyline);
          this.drawnItems.addLayer(this.polyline);

          this.layerGroup.addLayer(this.polyline);
          this.map.addLayer(this.polyline);

        }
      });


    }
    else {
      //console.log("report type", this.reportType);
      //console.log("report type222", (window.parent.parent.parent[7] as any));

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        content: 'The type must be Device History Or Device History Pattern!',
      };

      this.dialog.open(ContentmodalComponent, dialogConfig);
    }

  }


  public sayHello() {
    //console.log('Hello from Angular!');
  }

  async refreshSimulation() {
    this.flagInQueue == 0;
    
    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_IsSimul) {
      //console.log("A_IsSimul", (window.parent.parent.parent[7] as any).A_IsSimul)
      this.isSimul = (window.parent.parent.parent[7] as any).A_IsSimul;
      //console.log("isSimul>>", this.isSimul);
    }
    this.datajson = null;
    this.isFromJsp = false;
    this.isInterval = 1;
    this.isFromJsp = (window.parent.parent.parent[7] as any).A_isFromJsp;
    
    if (this.flagInQueue == 1) {
      this.inQueueSubscription.unsubscribe();
    }


    this.isFromJsp = false;
    this.isInterval = 1;
    this.isFromJsp = (window.parent.parent.parent[7] as any).A_isFromJsp;
    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_DateTimeFrom) {
      //console.log("A_DateTimeFrom", (window.parent.parent.parent[7] as any).A_DateTimeFrom)

    } else {
      //console.log("not A_DateTimeFrom");


    }

    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_simulationid) {
      this.simulationid = (window.parent.parent.parent[7] as any).A_simulationid;
    }

    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_usercode) {
      this.usercode = (window.parent.parent.parent[7] as any).A_usercode;

    }
    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_isFixedElements) {
      //console.log("A_isFixedElements", (window.parent.parent.parent[7] as any).A_isFixedElements)
      this.isFixedElements = (window.parent.parent.parent[7] as any).A_isFixedElements;
      //console.log("isFixedElements>>", this.isFixedElements)

    }
    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_isFixedElementsall) {
      //console.log("A_isFixedElementsall", (window.parent.parent.parent[7] as any).A_isFixedElementsall)
      this.isFixedElementsall = (window.parent.parent.parent[7] as any).A_isFixedElementsall;
      //console.log("isFixedElementsall>>", this.isFixedElementsall)

    }
    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_isAOi) {
      this.isAOi = (window.parent.parent.parent[7] as any).A_isAOi;

    }
    
    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_ImsiID) {

      this.ImsiID = (window.parent.parent.parent[7] as any).A_ImsiID;
    }
    if (typeof (window.parent.parent.parent[7] as any).A_ImsiID == "undefined") {
      this.ImsiID = "";
    }
    //console.log("simulationid", this.simulationid);
    if (this.isFromJsp === true    && this.isSimul === false && this.isAOi === false && this.isFixedElements === false) {
      //console.log(" in >>>>>>>>>>>> = = ", this.isFromJsp);

      this.counter = 0;
      this.intervalSubscription = interval(1000).subscribe(() => {
        //console.log(" this.inQueueTiming 1111 -==== ", this.inQueueTiming)
        //console.log("this.intervalId 1111111-==== ", this.intervalId)
        //console.log("this.counter111111111 -==== ", this.counter)
        //console.log(" this.inQueueTiming* 1000 111111 -==== ", this.inQueueTiming * 1000)
        this.counter += 1;
        if (this.counter == this.inQueueTiming   && this.datajson == null) {
          this.loaderService.hide();
          this.intervalSubscription.unsubscribe();
          const dialogRef = this.dialog.open(this.Queue2);
        }
        else if (this.inQueueTiming < this.counter) {
          this.loaderService.hide();
          // const dialogRef = this.dialog.open(this.Queue2);
          this.intervalSubscription.unsubscribe();
        }
         else if(this.datajson != null){
           this.intervalSubscription.unsubscribe();
         }
      });
    } 
	
	

    //console.log('ang window.parent>>>', window.parent);
    //console.log('ang isMapAngular  >>', (window.parent as any).isMapAngular);
    //console.log('ang isMapAngular window.parent.parent >>', (window.parent.parent as any));
    //console.log('ang isMapAngular  >>', (window.parent.parent.parent as any));
    //console.log('ang isMapAngular  7 >>', (window.parent.parent.parent[7] as any));

   
    if (this.isSimul == true) {
      //console.log("isSimul>>>>>>>>>>>>>>>>>>");

      this.reportType = (window.parent.parent.parent[7] as any).A_reportType;
      this.reportTypeId = (window.parent.parent.parent[7] as any).A_reportTypeId;

      let A_isSenarioFromcase:any = (window.parent.parent.parent[7] as any).A_isSenarioFromcase;
      //console.log("isSimul>>>>>>>>>>>>>>>>>> A_isSenarioFromcase",A_isSenarioFromcase);
      if(A_isSenarioFromcase==true){
        if(this.senarioFlag==true){

        }else{
          $("#toggleColor").click();

        }
        this.senarioParentName=this.simulationid;
        let obj:any={
          senarioParentName:this.senarioParentName,
          simulationid:this.simulationid,
          Action:"DisplayFromSenario",
          senariocount:this.senariocount,
          senarioFlag:this.senarioFlag,
          reportType:this.reportType


        }
        // this.senarioIdOutput.emit(this.senarioParentName);
        this.navbarSimulId=obj;


      }else{
        if(this.senarioFlag==false){

        }else{
          $("#toggleColor").click();

        }
      }

      // this.ObjectID=(window.parent.parent.parent[7] as any).A_ObjectID;

      (window.parent.parent.parent[7] as any).ResetBooleanVar();
      this.clearShapes();

      //alert("in isSImul angular="+this.isSimul)
      this.isAOi = false;
      this.isFixedElements = false;
      this.isSimul = false;
      // alert("is simul >>>>>>>>>>>>>>>>>>>>>>>>>");
      this.datasource.push({ name: "Tooltip" }, { name: "DateTooltip" }, { name: "activityDensity" }, { name: "activityHotspots" })

      // if(!localStorage.getItem("userCode")){
      //   if(!JSON.parse(localStorage.getItem("locSimulId"))){
      localStorage.setItem("locSimulId", this.simulationid);
      localStorage.setItem("userCode", this.usercode);
      this.senarioParentName=this.simulationid;
      //   }
      // }

      if (this.reportType == 11) {
        await this.datacrowdService.getsimualtion(this.simulationid, this.usercode).then((res: any) => {
          this.datajson = res;
          console.log("getsimultion response >>>>", this.datajson);

        });
        
        $('#controlbutton').css('display', '');
        this.tcd();

      }
      else if (this.reportType == 8){
        let numArr2: any = [];

        this.datacrowdService
        .getVcisfixedelementsID(this.simulationid)
        .then(async (response2: any) => {

          //console.log('response2>>>', response2);
          response2 = response2;
          //console.log('getVcisfixedelementsID>>>', response2);
          //console.log('getVcisfixedelementsID>>>', response2.length);

          //console.log('in fixed element scan');


          for (var i = 0; i < response2.length; i++) {
            //console.log(response2[i][0]);
            numArr2.push(Number(response2[i][0]));
          }
          //console.log('numArr>>', numArr2);
          //console.log('typeof numArr>>', typeof numArr2);
       
            if (response2.length == 0) {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                content: this.tns_alert_m22,
              };

              this.dialog.open(ContentmodalComponent, dialogConfig);

            }
          

          if (this.BtsTypeSlected == 'BTS') {

            if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_sqlcond) {
              //console.log("A_sqlcond", (window.parent.parent.parent[7] as any).A_sqlcond)
              this.isSqlCond = (window.parent.parent.parent[7] as any).A_sqlcond;
              //console.log("A_sqlcond>>", this.isSqlCond)
        
            }

        

            if (typeof (window.parent.parent.parent[7] as any).A_sqlcond == "undefined") {
              this.isSqlCond = "";
            }
        
            // this.BTSObject= new BTSObject(numArr2,this.isSqlCond);
            


            this.BTSObject= {
              sqlcond:this.isSqlCond,
              ids:numArr2
            }

            
            this.datacrowdService.getfixedelementsObject2BTS(JSON.stringify(this.BTSObject), this.usercode).then((res: any) => {
              //console.log('getfixedelementsObject2BTS>>>>', res);
              //localStorage.setItem('getfixedelementsObject2BTS',JSON.stringify(res));


              this.CdrData = res;



              this.CdrRowData = [];
              this.CdrRowData2 = [];


              //console.log('x', this.CdrData);
              //console.log('x000', this.CdrData[0]);


              this.fixedMarkersGroup = new L.MarkerClusterGroup({
                spiderfyOnMaxZoom: true,
                animate: true,
                singleMarkerMode: false,
                zoomToBoundsOnClick: false,
                maxClusterRadius: function (zoom) {
                  if (zoom >= 12) {
                    //console.log('innnnnnnnnnnnnnnnnn')
                    return 0;
                  } else {
                    //console.log('innnnnnnnnnnnnnnnnn')

                    return 50 / zoom;
                  }
                },
                iconCreateFunction: function (cluster) {
                  var markers = cluster.getAllChildMarkers();
                  var html = '<div  class="elementGroup" >' + markers.length + '</div>';

                  return L.divIcon({
                    html: html,
                    className: 'mycluster',
                    iconSize: L.point(32, 32)
                  });
                },
              });

              this.fixedMarkersGroupLoop = new L.MarkerClusterGroup({
                spiderfyOnMaxZoom: true,
                animate: true,
                singleMarkerMode: false,
                zoomToBoundsOnClick: false,
                maxClusterRadius: function (zoom) {
                  if (zoom >= 12) {
                    //console.log('innnnnnnnnnnnnnnnnn')
                    return 0;
                  } else {
                    //console.log('innnnnnnnnnnnnnnnnn')

                    return 50 / zoom;
                  }
                },
                iconCreateFunction: function (cluster) {
                  var markers = cluster.getAllChildMarkers();
                  var html = '<div  class="elementGroup" >' + markers.length + '</div>';

                  return L.divIcon({
                    html: html,
                    className: 'mycluster',
                    iconSize: L.point(32, 32)
                  });
                },
              });

              for (let i = 0; i < this.CdrData[0].length; i++) {
                this.displayBTS(this.CdrData[0][i].BTS);
                //console.log('this.CdrData[0][i]>>>', this.CdrData[0][i].BTS);
                //console.log('5555555555555555555555');
                this.btsarray.push(this.CdrData[0][i].BTS);
                //console.log('this.btsarray----------',this.btsarray);


                for (let j = 0; j < this.CdrData[0][i].SECTORS.length; j++) {
                  // //console.log('this.CdrData[1]>>>',this.CdrData[1]);
                  ////console.log('this.CdrData[1][i][j]>>>',this.CdrData[1][i][j]);
                  this.drawarc(Number(this.CdrData[0][i].BTS.LATITUDE), Number(this.CdrData[0][i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(this.CdrData[0][i].SECTORS[j]) - 22.5, 90 + Number(this.CdrData[0][i].SECTORS[j]) + 22.5, this.SectorColor, '', '');

                }
              }


            })

          } else if (this.BtsTypeSlected == 'FixedElements') {
            for (const layer of this.sectorarray) {
              this.map.removeLayer(layer);
            }
            this.datacrowdService
              .getfixedelementsObject(numArr2)
              .then(async (res: any) => {
                //console.log('display scan fixed elements>>', res);
                this.displayFixedElements(res);

              });

          }

          ;
        });
      }
      
      
      else {
        await this.datacrowdService.getsimualtion(this.simulationid, this.usercode).then((res: any) => {
          this.datajson = res;
          //console.log("getsimultion response >>>>", this.datajson);

        });
        //console.log("this.datajson.markerPositions<<<>>>>>", this.datajson.markerPositions.length)
        this.marker = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          animate: true,
          singleMarkerMode: true,
        });
        this.displayClusters2(this.simulationid);
   
        this.heat = L.heatLayer(this.datajson.heatCoords, {
          radius: 20
        });
        let activityDensity = this.heat;

        let activityHotspots = L.layerGroup([this.marker]).addTo(this.map);
        if (this.reportType == 2) {
          this.overlayMaps = {
            "Activity Density": activityDensity,
            "Activity Hotspots": activityHotspots,
          };
        } else {


          var Tooltip = new L.LayerGroup();

          this.overlayMaps = {
            "Tooltip": Tooltip,
            "Activity Density": activityDensity,
            "Activity Hotspots": activityHotspots,
            // "Area Demographics": areaDemographies,
            //"Demographic Markers": demographicMarkers,
          };
        }


        const baseLayers = {
          'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data Â© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          }),
          'Satellite Map': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Map data Â© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          })
        };

        // this.controlLayers = L.control.layers({},this.overlayMaps,{position: "topleft"})
        // this.controlLayers.addTo(this.map);
        //}


        await this.datacrowdService.getExecutionParam(this.simulationid).then((res: any) => {
          this.ExecutionParam = res;
          //console.log("getExecutionParam response >>>>", this.ExecutionParam.Coordinates);
          let circlecoord = this.ExecutionParam.Coordinates;

          localStorage.setItem("coordsimul", JSON.stringify(circlecoord));



          for (
            var j = 0;
            j < circlecoord.length;
            j++
          ) {
            if (circlecoord[j].Type == "Circle") {
              this.Coord.push({
                ID: circlecoord[0].ID,
                Name: "",
                Value: "",
                Type: circlecoord[0].Type,
                Bounds: "",
                radius: circlecoord[0].radius,
                center: circlecoord[0].center,
                leafletid: circlecoord[0].leafletid,
                PolyBoundsCoords: "",
                selectedStartDate: "",
                selectedEndDate: "",
                countrycodes:"",

              });

              this.circle = L.circle(circlecoord[j].center, {
                color: "#6e83f0",
                fillOpacity: 0.5,
                radius: circlecoord[j].radius,
              });

              this.layerGroup.addLayer(this.circle);
              this.map.setView(circlecoord[j].center, 12)

            } else if (circlecoord[j].Type == "Rectangle") {

              let bnds = L.latLngBounds(
                L.latLng(
                  circlecoord[j].Bounds.topLeft.lat,
                  circlecoord[j].Bounds.topLeft.lng
                ),
                L.latLng(
                  circlecoord[j].Bounds.bottomRight.lat,
                  circlecoord[j].Bounds.bottomRight.lng
                )
              );

              this.rectangle = L.rectangle(bnds, {
                color: "#6e83f0",
                fillOpacity: 0.5,
              });
              this.layerGroup.addLayer(this.rectangle);

            } else if (circlecoord[j].Type == "Polygon") {
              this.polygon = L.polygon(circlecoord[j].Bounds, {
                color: "#6e83f0",
                fillOpacity: 0.5,
              });

              this.layerGroup.addLayer(this.polygon);
            } else if (circlecoord[j].Type == "Polyline") {
              this.polyline = L.polyline(circlecoord[j].Bounds, {
                color: "#6e83f0",
                fillOpacity: 0.5,
              });
              this.layerGroup.addLayer(this.polyline);
            }

            this.layerGroup.addTo(this.map);
          }


        });
        // this.filterData2(this.datajson.markerPositions, this.marker, this.controlLayers);
        $('#controlbutton').css('display', '');
        if (this.reportType == 2) {
          this.displayroute=true;
        }else{
          this.displayroute=false;
        }
      }
    

    } else if (this.isAOi == true) {
      //console.log("isAOi>>>>>>>>>>>>>>>>>>");

      (window.parent.parent.parent[7] as any).ResetBooleanVar();
      //alert("isAOI");
      this.AoiIds = (window.parent.parent.parent[7] as any).A_AoiIds;
      //console.log("AoiIds>>>>>", this.AoiIds);
      // let arr = this.AoiIds.split(",");
      // //console.log("arr>>>>>",arr);
      // // let numArr = arr.map(Number);
      // // //console.log("numArr>>>>>",numArr);
      // //console.log('arr.length>>>>',arr.length)

      for (let i = 0; i < this.AoiIds.length; i++) {
        this.datacrowdService.getSelectedShape(this.AoiIds[i]).then((res: any) => {
          //console.log('getSelectedShape>>>>', res);
          this.Aoiresp = res;
          //console.log('myres=', this.Aoiresp);
          //add aoi shape to  coord 
          this.Coord.push(this.Aoiresp);
          //  
          if (this.Aoiresp.Type == "Circle") {
            this.circle = L.circle(this.Aoiresp.center, {
              color: "#6e83f0",
              fillOpacity: 0.5,
              radius: this.Aoiresp.radius,
            }).bindTooltip(`${this.Aoiresp.Name}`, {
              permanent: true,
              interactive: true,
              opacity: 0.9,
              direction: "center"
            }).openTooltip();

            this.layerGroup.addLayer(this.circle);
          } else if (this.Aoiresp.Type == "Rectangle") {
            let bnds = L.latLngBounds(
              L.latLng(
                this.Aoiresp.Bounds.topLeft.lat,
                this.Aoiresp.Bounds.topLeft.lng
              ),
              L.latLng(
                this.Aoiresp.Bounds.bottomRight.lat,
                this.Aoiresp.Bounds.bottomRight.lng
              )
            );

            this.rectangle = L.rectangle(bnds, {
              color: "#6e83f0",
              fillOpacity: 0.5,
            }).bindTooltip(`${this.Aoiresp.Name}`, {
              permanent: true,
              interactive: true,
              opacity: 0.9,
              direction: "center"
            })
            //.openTooltip();
            this.layerGroup.addLayer(this.rectangle);
          } else if (this.Aoiresp.Type == "Polygon") {
            this.polygon = L.polygon(this.Aoiresp.Bounds, {
              color: "#6e83f0",
              fillOpacity: 0.5,
            }).bindTooltip(`${this.Aoiresp.Name}`, {
              permanent: true,
              interactive: true,
              opacity: 0.9,
              direction: "center"
            })
            //.openTooltip();

            this.layerGroup.addLayer(this.polygon);
          } else if (this.Aoiresp.Type == "Polyline") {
            this.polyline = L.polyline(this.Aoiresp.Bounds, {
              color: "#6e83f0",
              fillOpacity: 0.5,
            }).bindTooltip(`${this.Aoiresp.Name}`, {
              permanent: true,
              interactive: true,
              opacity: 0.9,
              direction: "center"
            })
            //.openTooltip();
            this.layerGroup.addLayer(this.polyline);
          }
        
          if (this.AoiIds.length > 1) {
            //console.log('ttttestttttttttttttt>>>>>>>>>>>>>>>')
            this.map.setView(this.Aoiresp.center, 5);
          }
          else {
            this.map.setView(this.Aoiresp.center, 12);

          };

          this.layerGroup.addTo(this.map);
          //this.map.setView(this.Aoiresp.center,12);

          //this.objAoi.push(this.Aoiresp);

        });


      }

      ////console.log('objAoi>>>>',this.objAoi)
      this.isSimul = false;
      this.isFixedElements = false;
      this.isAOi = false;

    } else if (this.isFixedElements == true) {
      if (this.fixedMarkersGroup) {
        this.map.removeLayer(this.fixedElementMarker);

      }
      if (this.fixedElementMarker) {
        this.map.removeLayer(this.fixedElementMarker);

      }
      if (this.fixedMarkersArray.length > 0) {
        this.map.removeLayer(this.fixedMarkersGroup);
        this.fixedMarkersArray = [];
      }

      //console.log("isFixedElements>>>>>>>>>>>>>>>>>>");

      //console.log("isFixedElements>>>>>>>>>>>>>>>>>>");

      (window.parent.parent.parent[7] as any).ResetBooleanVar();

      //alert("isFixedElements");
      //console.log("ObjectID beforeeee>>>>>", this.ObjectID);
      let numArrbefore;
      if (typeof this.ObjectID != "undefined") {
        numArrbefore = this.ObjectID.join().split(",").map(Number)

      }

      this.ObjectID = (window.parent.parent.parent[7] as any).A_ObjectID;
      // this.ObjectID=this.ObjectID.push((window.parent.parent.parent[7] as any).A_ObjectID);
      //console.log("ObjectID>>>>>", this.ObjectID);
      //console.log("ObjectID join>>>>>", this.ObjectID.join());
      //console.log("ObjectID join>>>>>stringggg", this.ObjectID.join().toString());

      //console.log("ObjectID join2>>>>>", this.ObjectID.join().split(",").map(Number));
      // let arr = this.ObjectID.split(",");
      // //console.log("arr>>>>>",arr);
      // let numArr = arr.map(Number);
      // //console.log("numArr>>>>>",numArr);
      let numArr = this.ObjectID.join().split(",").map(Number);
      if (typeof numArrbefore != "undefined") {
        for (let i = 0; i < numArr.length; i++) {
          numArrbefore.push(numArr[i]);

        }
        //console.log("numArrbefore>>>>>", numArrbefore);

        //console.log(" getUniqueNumbers>>>>>", this.getUniqueNumbers(numArrbefore));
        numArr = this.getUniqueNumbers(numArrbefore);
      }
      //console.log("numArr>>>>>", numArr);
      let numArrfinall = numArr.map((num: any) => num.toString());
      //console.log("numArrfinall>>>>>", numArr);
      this.ObjectID = numArrfinall;

      // this.datacrowdService.getfixedelementsObject(numArr).then((res)=>{
      // //console.log('getfixedelementsObject>>>>',res);
      // localStorage.setItem('fixedelementsObject',JSON.stringify(res));
      // this.displayFixedElements(res);



      // }); 
      //this.ObjectID.join().toString()
      if (this.isFixedElementsall == true) {

        this.datacrowdService.getfixedelementsObject2(this.ObjectID).then((res: any) => {
          //console.log('getfixedelementsObject2>>>>', res);
          localStorage.setItem('getfixedelementsObject2', JSON.stringify(res));
          this.displayFixedElements(res);



        });
      } else {
        this.datacrowdService.getfixedelementsObject(numArr).then((res: any) => {
          //console.log('getfixedelementsObject>>>>', res);
          localStorage.setItem('fixedelementsObject', JSON.stringify(res));
          this.displayFixedElements(res);



        });
      }

      this.isAOi = false;
      this.isSimul = false;
      this.isFixedElements = false;
      this.isFixedElementsall = false;


    }
    else {
      //console.log("activityscan>>>>>>>>>>>>>>>>>>");

      if (JSON.parse(localStorage.getItem("coordsimul"))) {
        let coordsimul = JSON.parse(localStorage.getItem("coordsimul"));
        //console.log("coordsimul>>>", coordsimul);
        // //console.log("coordsimul>>>",coordsimul[0].leafletid);


        //console.log("coordsimul3>>>", this.layerGroup.getLayers());

        let shapetoremove = this.layerGroup.getLayers();
        // this.layerGroup.removeLayer(shapetoremove[0])
        ////console.log("shapetoremove>>>",shapetoremove);

        if (this.marker) {
          this.map.removeLayer(this.marker);

        }
        if (this.markers) {
          this.map.removeLayer(this.markers);

        }

      }




      (window.parent.parent.parent[7] as any).ResetBooleanVar();
      // alert("not simullllll>>>>.")
      this.reportName = (window.parent.parent.parent[7] as any).A_reportName;
      this.reportType = (window.parent.parent.parent[7] as any).A_reportType;
      this.reportTypeId = (window.parent.parent.parent[7] as any).A_reportTypeId;
      this.TimeZone = (window.parent.parent.parent[7] as any).A_TimeZone;
      this.RecipientUser = (window.parent.parent.parent[7] as any).A_RecipientUser;
      if (this.RecipientUser === "empty" || this.RecipientUser === null) {
        this.RecipientUser = "";
      }
      //this.RecipientUser="";
      if ((window.parent.parent.parent[7] as any).A_DateTimeFrom != null) {
        this.DateTimeFrom = this.datePipe.transform(
          (window.parent.parent.parent[7] as any).A_DateTimeFrom,
          "MM/dd/yyyy HH:mm"
        );
      }

      if ((window.parent.parent.parent[7] as any).A_DateTimeTo != null) {

        this.DateTimeTo = this.datePipe.transform(
          (window.parent.parent.parent[7] as any).A_DateTimeTo,
          "MM/dd/yyyy HH:mm"
        );
      }

      if (this.RecipientEmail === "empty" || this.RecipientEmail === null) {
        this.RecipientEmail = "";
      }

      if (this.RecipientUser === "empty" || this.RecipientUser === null) {
        this.RecipientUser = "";
      }
      //this.RecipientEmail = (window.parent.parent.parent[7] as any).A_RecipientEmail ;
      this.RecipientEmail = "";
      this.Devices = (window.parent.parent.parent[7] as any).A_Devices;
      this.isCSVAttached = (window.parent.parent.parent[7] as any).A_isCSVAttached;
      this.dataType = (window.parent.parent.parent[7] as any).A_dataType;
      this.telephoneNumber = (window.parent.parent.parent[7] as any).A_telephoneNumber;
      this.usercode = (window.parent.parent.parent[7] as any).A_usercode;
      this.meter = (window.parent.parent.parent[7] as any).A_meter;
      this.EDGEHEIGHT = (window.parent.parent.parent[7] as any).A_EDGEHEIGHT;
      //console.log("Devices-----------",this.Devices);


      //check id the device is empty or null from jsp
      if (this.Devices === "empty" || this.Devices === "null") {
        this.Devices = "";
      }

      if (this.dataType === "empty" || this.dataType === "null") {
        // this.dataType = "9,10,11,12,8,6,16,17,15";
        this.dataType = "";
      }

      if (this.meter === "empty" || this.meter === "null") {
        this.meter = "";
      }
      if (this.EDGEHEIGHT === "empty" || this.EDGEHEIGHT === "null") {
        this.EDGEHEIGHT = "";
      }
      if (
        this.telephoneNumber == "empty" ||
        this.telephoneNumber == "null" ||
        typeof this.telephoneNumber == "undefined"
      ) {
        this.telephoneNumber = "";
      }

      if (
        this.isCSVAttached == "empty" ||
        this.isCSVAttached == "null" ||
        typeof this.isCSVAttached == "undefined"
      ) {
        this.isCSVAttached = "";
      }

      if (
        this.TimeZone == "empty" ||
        this.TimeZone == "null" ||
        typeof this.TimeZone == "undefined"
      ) {
        this.TimeZone = "";
      }
      // if date isnt null than is coming from jsp framework
      if (this.DateTimeFrom != null) {
        if (!JSON.parse(localStorage.getItem("fixedelementsObject"))) {
        } else {

          if (this.fixedElementMarker) {
            this.map.removeLayer(this.fixedElementMarker);

          }
          //console.log("fixedMarkersArray-----------",this.fixedMarkersArray);
          if (this.fixedMarkersArray) {
            this.fixedMarkersArray.forEach((element: any, key: any) => {
              this.fixedMarkersGroup.removeLayer(element);
              this.map.removeLayer(element);


            })
          }
          //console.log("fixedelementsObject-----------",JSON.parse(localStorage.getItem("fixedelementsObject")));

          this.displayFixedElements(JSON.parse(localStorage.getItem("fixedelementsObject")))

        }

        this.refresh();
 
      } else {

        localStorage.clear();
      }


    }

    setTimeout(() => {
      clearInterval(this.intervalId);
    },  this.inQueueTiming* 1000);

  }


  closemodalservice() {
    // this.modalService.close();
    if(this.modalRef){
      this.modalRef.close();

    }
  }
  // executeAOIActivity(simulationId:any){

  //   //let simulationid :String;
  //   this.notif.type='info';
  //   this.notif.message='Processing AOI';
  //   this.notif.loader=true;
  //   this.notif.showtoast();

  //   this.loaderService.isAOI='TRUE';
  //   this.datacrowdService.executeAOIActivity(simulationId).then(response=>{
  //     response = response;
  //   //console.log("executeAOIActivity>>>",response);
  //   //console.log("executeAOIActivity111>>>",response);
  //  this.notif.type='success';
  //  this.notif.message='AOI Completed';
  //  this.notif.loader=true;
  //  this.notif.showtoast();
  //   });
  //  }
  /*
  getgraphAPI(bodyParam:any){
 
   let queryParams :String;
  // queryParams=bodyParam; //.queryId;
   this.datacrowdService.graphAPI(bodyParam).then(response=>{
     response = response;
   //console.log("responceee>>>",response);
   });
 
  }
 */


  public onDeleteStart() {
    this.deletingModeEnabled = true;
    // this.drawnItems.eachLayer((layer: any) => {
    //   // Disable popups for all layers in drawnItems;
    //   //console.log("layer onDeleteStart",layer)
    //   layer.unbindTooltip();
    // });
  }

  onTelColumnClicked(params: any) {
    // alert("in TelColumnClicked")
    // Access the row data for the clicked cell
    const rowData = params.data.Device_id;

    // Call your desired function or perform any action here
    (window.parent.parent.parent[7] as any).openkyc(rowData);
    //because one each click we add teh device to the multislection
    localStorage.clear();
  }

  async displaycaseSimulation() { 
 
    // if(this.A_ISCase==1){
    if (localStorage.getItem("userCode")) {
   

      if ((localStorage.getItem("locSimulId"))) {

        this.A_locSimulId = (localStorage.getItem("locSimulId"));
        this.usercode = localStorage.getItem("userCode");
        //console.log("displaycaseSimulation>>>>>>>>>>>>>>>>>>");

        let locArray: number[] = this.A_locSimulId.split(",").map(Number);
      //console.log("locArray>>>>>>>>>>>>>>>>>>",locArray);

        for(let e=0;e<locArray.length;e++)
     {   

      let simulId=locArray[e];
      //console.log("simulId>>>>>>>>>>>>>>>>>>",simulId);

      await this.datacrowdService.getsimualtion(simulId, this.usercode).then((res: any) => {
          this.datajson = res;
          //console.log("getsimultion response >>>>", this.datajson);

        });



        //console.log("this.datajson.markerPositions<<<>>>>>", this.datajson.markerPositions.length)
        this.marker = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          animate: true,
          singleMarkerMode: true,
        });
        for (var j = 0; j < 1; j++) {
          for (var i = 0; i < this.datajson.markerPositions.length; i++) {
            this.myMarker = L.marker([
              Number(this.datajson.markerPositions[i][0]),
              Number(this.datajson.markerPositions[i][1]),
            ]);
            // this.marker.addLayer(this.markers);
            this.myMarker.off("click");
            this.myMarker.on("mousedown", (e: any) => {
              if (e.originalEvent.buttons == 2) {
                e.target.openPopup();
                // alert(2);
              }
              if (e.originalEvent.buttons == 1) {
                //  alert(1);
              }

            });

          }
          this.rowData = [];
          this.datajson.markerPositions.forEach((element: any, key: any) => {
            this.myMarker = this.binddata(
              element[0],
              element[1],
              element[2],
              element[3],
              element[4],
              element[5],
              ""
            );
            this.myMarker.lat = element[0];
            this.myMarker.lng = element[1];
            this.myMarker.timestamp = element[3];
            this.myMarker.tel = element[2];
            this.myMarker.name = element[4];
            this.myMarker.off("click");
            this.myMarker.on("mousedown", async (e: any) => {
              if (e.originalEvent.buttons == 2) {
                //console.log("markerChildrensssssss", e.target)
                this.rowData = [];
                var jsonaggrid = {
                  Device_id: e.target.tel,
                  Tel: e.target.name,
                  Date: e.target.timestamp,
                  Hits: "1",
                  Coord: e.target.lat + ',' + e.target.lng,

                };
                this.rowData.push(jsonaggrid);


                const componentfactory =
                  this.componentFactoryResolver.resolveComponentFactory(
                    VAgGridComponent
                  );
                const componentref =
                  this.viewContainerRef.createComponent(componentfactory);
                componentref.instance.rowData = this.rowData;
                componentref.instance.columnDefs = this.columnDefs;
                componentref.instance.headerHeight = 0;
                // componentref.instance.selectdevices = true;
                componentref.instance.Title = "Here On";
                componentref.instance.distinct = true;
                componentref.changeDetectorRef.detectChanges();
                const html2 = componentref.location.nativeElement;
                componentref.instance.Grid2Type = 'btn-54';

                await html2;

                $('.ag-theme-balham').css('height', '130px');

                // /  e.target.openPopup(html2, e.target._latlng);
                this.map.openPopup(html2, e.target._latlng);


              } else if (e.originalEvent.buttons == 1) {

              }

            });
            this.marker.addLayer(this.myMarker);
            //  this.filterData2(this.datajson.markerPositions, this.marker, this.controlLayers);
            $('#controlbutton').css('display', '');

          })

        };

        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        const html1 = (componentref.location.nativeElement.style.display = "none");
        componentref.instance.columnDefs = this.columnDefs;
        componentref.changeDetectorRef.detectChanges();
        this.marker.off("click");
        this.marker.on("clustermousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            var markerChildrens = e.layer.getAllChildMarkers();

            //console.log("markerChildrens>>><<<", markerChildrens)
            //console.log('rowdata before1>>>>>>', this.rowData)

            this.rowData = [];
            //console.log('rowdata before2>>>>>>', this.rowData)

            for (var j = 0; j < markerChildrens.length; j++) {
              var jsonaggrid = {
                Device_id: markerChildrens[j].tel,
                Tel: markerChildrens[j].name,
                Date: markerChildrens[j].timestamp,
                Hits: "1",
                Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,

              };
              //console.log('rowdata jsonaggrid>>>>', jsonaggrid)
              this.rowData.push(jsonaggrid);
            }
            //console.log('rowdata after>>>>>>', this.rowData)
            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            // componentref.instance.selectdevices = true;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.pagination = false;
            componentref.instance.rowGrouping = true;
            componentref.instance.contextmenu = false;
            componentref.instance.Grid2Type = 'btn-54';

            const html1 = componentref.location.nativeElement;
            await html1;


            if (markerChildrens.length < 3) {
              // $('#agGrid').css('height','10px');
              $('.ag-theme-balham').css('height', '130px');

            } else {
              $('.ag-theme-balham').css('height', ' 250px ');

            }

            this.map.openPopup(html1, e.layer.getLatLng());
          }
        });

        this.map.addLayer(this.marker);
        //console.log("11111111111111111111111111111111111111111 >>>>" );

        await this.datacrowdService.getExecutionParam(simulId).then((res: any) => {
          this.ExecutionParam = res;
          //console.log("getExecutionParam response >>>>", this.ExecutionParam.Coordinates);
          let circlecoord = this.ExecutionParam.Coordinates;

          // localStorage.setItem("coordsimul", JSON.stringify(circlecoord));



          for (
            var j = 0;
            j < circlecoord.length;
            j++
          ) {
            if (circlecoord[j].Type == "Circle") {
              this.Coord.push({
                ID: circlecoord[0].ID,
                Name: "",
                Value: "",
                Type: circlecoord[0].Type,
                Bounds: "",
                radius: circlecoord[0].radius,
                center: circlecoord[0].center,
                leafletid: circlecoord[0].leafletid,
                PolyBoundsCoords: "",
                selectedStartDate: "",
                selectedEndDate: "",
                countrycodes:"",


              });

              this.circle = L.circle(circlecoord[j].center, {
                color: "#6e83f0",
                fillOpacity: 0.5,
                radius: circlecoord[j].radius,
              });

              this.layerGroup.addLayer(this.circle);
              this.map.setView(circlecoord[j].center, 12)

            } else if (circlecoord[j].Type == "Rectangle") {

              let bnds = L.latLngBounds(
                L.latLng(
                  circlecoord[j].Bounds.topLeft.lat,
                  circlecoord[j].Bounds.topLeft.lng
                ),
                L.latLng(
                  circlecoord[j].Bounds.bottomRight.lat,
                  circlecoord[j].Bounds.bottomRight.lng
                )
              );

              this.rectangle = L.rectangle(bnds, {
                color: "#6e83f0",
                fillOpacity: 0.5,
              });
              this.layerGroup.addLayer(this.rectangle);
            } else if (circlecoord[j].Type == "Polygon") {
              this.polygon = L.polygon(circlecoord[j].Bounds, {
                color: "#6e83f0",
                fillOpacity: 0.5,
              });

              this.layerGroup.addLayer(this.polygon);
            } else if (circlecoord[j].Type == "Polyline") {
              this.polyline = L.polyline(circlecoord[j].Bounds, {
                color: "#6e83f0",
                fillOpacity: 0.5,
              });
              this.layerGroup.addLayer(this.polyline);

            }
            //console.log("22222222222222222222222 >>>>");

            this.layerGroup.addTo(this.map);


          }
          //if you want to make on each display the displayed case to be earased  
          //localStorage.clear();

          // (window.parent.parent.parent[7] as any).changesimulationId(simulId);
        });
        //console.log("changesimulationId------------",(window.parent.parent.parent[7] as any));
        // (window.parent.parent.parent[7] as any).changesimulationId(simulId);

      }

    }
}
  }
  toggleControls() {
    this.showControls = !this.showControls;
    $('#myControl').css(
      'display',
      (this.showControls ? '' : 'none')
    )
  }

  openLayerControl() {

    if (this.dataService.getData()) {
      //console.log('layercontrol>>>>>>', this.dataService.getData());
      let layercontrol = this.dataService.getData();
      //console.log('layercontrol name>>>>>>', layercontrol.name);
      if (layercontrol.name == "activityDensity") {

        //this.heat.addTo(this.map);
        if (layercontrol.checked == true) {
          this.heat = L.heatLayer(this.datajson.heatCoords, {
            radius: 20
          });
          this.heat.addTo(this.map);

        } else {
          if (this.heat) {
            this.map.removeLayer(this.heat);

          }
        }

      } else if (layercontrol.name == "Tooltip") {

        var Tooltip = new L.LayerGroup();

        if (layercontrol.checked == true) {
          Tooltip.on('add', () => {
            this.map.eachLayer((l: any) => {
              if (l.getTooltip) {
                var toolTip = l.getTooltip();
                if (toolTip) {
                  this.map.addLayer(toolTip);
                }
              }
            });
          })
          Tooltip.on('remove', () => {
            this.map.eachLayer((l: any) => {
              if (l.getTooltip) {
                var toolTip = l.getTooltip();
                if (toolTip) {
                  this.map.closeTooltip(toolTip);
                }
              }
            });
          });
        } else {
          Tooltip.on('add', () => {
            this.map.eachLayer((l: any) => {
              if (l.getTooltip) {
                var toolTip = l.getTooltip();
                if (toolTip) {
                  this.map.addLayer(toolTip);
                }
              }
            });
          })
          Tooltip.on('remove', () => {
            this.map.eachLayer((l: any) => {
              if (l.getTooltip) {
                var toolTip = l.getTooltip();
                if (toolTip) {
                  this.map.closeTooltip(toolTip);
                }
              }
            });
          });
        }


      } else if (layercontrol.name == "DateTooltip") {

        var Tooltip = new L.LayerGroup();

        if (layercontrol.checked == false) {
          // this.tooltipInstance.openTooltip();
          if (this.tooltipInstanceArray) {
            for (const tooltipInstance of this.tooltipInstanceArray) {
              tooltipInstance.openTooltip();
            }

          }
        } else {
          this.hideTooltip();
        }


      } else if (layercontrol.name == "activityHotspots") {
        if (layercontrol.checked == false) {
          // let activityHotspots = L.layerGroup([this.marker]).addTo(this.map);
          this.marker.addTo(this.map);

        } else {
          if (this.marker) {
            this.map.removeLayer(this.marker);

          }
        }

      }
      else {
        //console.log('layercontrol singledeviceMarkersClusters>>>>>>', layercontrol.singledeviceMarkersClusters);
        //console.log('singledeviceMarkersClusters>>>>>>', this.singledeviceMarkersClusters);

        //  this.controlLayers.addOverlay(layercontrol.singledeviceMarkersClusters,layercontrol.name);
        //  this.controlLayers.addTo(this.map);
        if (layercontrol.checked == true) {
          layercontrol.singledeviceMarkersClusters.addTo(this.map);

        } else {

          this.map.removeLayer(layercontrol.singledeviceMarkersClusters);


        }
      }

    }


  }


  startDrawingPolygon(): void {
    // Disable any existing drawing mode (e.g., polyline or other)
    this.map.pm.disableDraw();

    // Listen for a single click event on the map
    this.map.once('click', this.mapClickHandler.bind(this));
  }

  mapClickHandler(e: L.LeafletMouseEvent): void {

    // if (this.drawnLayer) {
    //   this.map.removeLayer(this.drawnLayer);
    // }

    // Enable drawing of a polygon
    this.map.pm.enableDraw('Polygon', {
      templineStyle: {
        color: 'green' // Set the temporary line color for polygon drawing
      },
      hintlineStyle: {
        color: 'green' // Set the hint line color for polygon drawing
      }
    },

    );
    this.map.on('pm:create', (e: any) => {

      this.drawnLayer = e.layer;

      this.drawnLayers.push(this.drawnLayer);
      this.drawnItems.addLayer(this.drawnLayer);
      this.drawnLayer.setStyle({
        color: 'green'

      });

      if (this.drawnLayer instanceof L.Polygon) {
        const latlngs: L.LatLng[] = this.drawnLayer.getLatLngs()[0] as L.LatLng[];
        this.area = L.GeometryUtil.geodesicArea(latlngs);
        this.perimeter = this.calculatePerimeter(latlngs);


      } else {
        this.area = 0;
        this.perimeter = 0;
      }
      //console.log('area', this.area);


      //console.log('perimeter', this.perimeter);
      var popupContent =
        `<strong>Area:</strong> ${this.area.toFixed(2)} square meters<br>
                    <strong>Perimeter:</strong> ${this.perimeter.toFixed(2)} meters
                    `;
      e.layer.bindPopup(popupContent).openPopup();
    });


  }


  startDrawingPolyline(): void {
    // Disable any existing drawing mode (e.g., polyline or other)
    this.map.pm.disableDraw();

    // Listen for a single click event on the map
    this.map.once('click', this.mapClickHandler1.bind(this));
  }

  mapClickHandler1(e: L.LeafletMouseEvent): void {
    // Enable drawing of a polygon
    this.map.pm.enableDraw('Line', {
      templineStyle: {
        color: 'green' // Set the temporary line color for polygon drawing
      },
      hintlineStyle: {
        color: 'green' // Set the hint line color for polygon drawing
      }
    });
    this.map.on('pm:create', (e: any) => {
      this.drawnLayer = e.layer;
      this.drawnLayers.push(this.drawnLayer);
      this.drawnItems.addLayer(this.drawnLayer);

      this.drawnLayer.setStyle({
        color: 'green'

      });
      // this.calculateLineLength();
      if (this.drawnLayer instanceof L.Polyline) {
        const latlngs: L.LatLng[] = this.drawnLayer.getLatLngs() as L.LatLng[];
        this.lineLength = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
          this.lineLength += latlngs[i].distanceTo(latlngs[i + 1]);
        }
      } else {
        this.lineLength = 0;
      }
      //console.log('lineLength', this.lineLength);
      var popupContent =
        `<strong>Distance:</strong> ${this.lineLength.toFixed(2)} meters`;
      e.layer.bindPopup(popupContent).openPopup();
    });
  }




  hideTooltip() {
    if (this.tooltipInstanceArray) {
      for (const tooltipInstance of this.tooltipInstanceArray) {
        //console.log("tooltipInstance>>>", tooltipInstance)
        tooltipInstance.closeTooltip();
      }

    }
  }
  hideTooltipname() {
    if (this.tooltipInstanceNameArray) {
      for (const tooltipInstanceName of this.tooltipInstanceNameArray) {
        //console.log("tooltipInstance>>>", tooltipInstanceName)
        tooltipInstanceName.closeTooltip();
      }

    }

  }

  convertToLatLngArray(coordinates: number[][]): any[] {
    return coordinates.map(coord => {
      return L.latLng(coord[0], coord[1]);
    });
  }
  calculatePerimeter(latlngs: L.LatLng[]): number {
    let perimeter = 0;
    const n = latlngs.length;
    for (let i = 0; i < n - 1; i++) {
      perimeter += latlngs[i].distanceTo(latlngs[i + 1]);
    }
    // Add the last segment to close the polygon
    perimeter += latlngs[n - 1].distanceTo(latlngs[0]);
    return perimeter;
  }

  tcd() {
    this.displaysectors=true;

    $('.timeline').css('display', 'flex');

    if (this.fixedMarkersGroup) {
      this.map.removeLayer(this.fixedMarkersGroup);

    }
    if (this.fixedElementMarker) {
      this.map.removeLayer(this.fixedElementMarker);

    }
    if (this.fixedMarkersArray.length > 0) {
      this.map.removeLayer(this.fixedMarkersGroup);
      this.fixedMarkersArray = [];
    }

    this.isTcd = true;
    //console.log('datajson>>>', this.datajson);

    this.CdrData = this.datajson;

    //console.log('x', this.CdrData);
    //console.log('x000', this.CdrData.BTS[0]);


    this.fixedMarkersGroup = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      animate: true,
      singleMarkerMode: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50, // Adjust this value as needed
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var html = '<div  class="elementGroup" >' + markers.length + '</div>';

        return L.divIcon({
          html: html,
          className: 'mycluster',
          iconSize: L.point(32, 32)
        });
      },
    });
    this.fixedMarkersGroupLoop = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      animate: true,
      singleMarkerMode: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50, // Adjust this value as needed
      iconCreateFunction: function (cluster:any) {
        var markers = cluster.getAllChildMarkers();
        var html = '<div  class="elementGroup" >' + markers.length + '</div>';

        return L.divIcon({
          html: html,
          className: 'mycluster',
          iconSize: L.point(32, 32)
        });
      },
    });
    let count=0;
    for (let i = 0; i < this.CdrData.BTS[0].length; i++) {
      //this.displayFixedElements(this.CdrData[0][i]);



      this.displayBTS(this.CdrData.BTS[0][i].BTS);
      //console.log('this.CdrData[0][i]>>>', this.CdrData.BTS[0][i].BTS);


      for (let j = 0; j < this.CdrData.BTS[0][i].SECTORS.length; j++) {
        this.drawarc(Number(this.CdrData.BTS[0][i].BTS.LATITUDE), Number(this.CdrData.BTS[0][i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(this.CdrData.BTS[0][i].SECTORS[j]) - 22.5, 90 + Number(this.CdrData.BTS[0][i].SECTORS[j]) + 22.5, this.SectorColor, this.CdrData.BTS[0][i].SINFO, '');
        count++;
      }
    }

    if (this.CdrData.BTS[0].length > 1) {
      this.map.setView([Number(this.CdrData.BTS[0][0].BTS.LATITUDE), Number(this.CdrData.BTS[0][0].BTS.LONGITUDE)], 8)

    } else {
      this.map.setView([Number(this.CdrData.BTS[0][0].BTS.LATITUDE), Number(this.CdrData.BTS[0][0].BTS.LONGITUDE)], 20)

    }

    //console.log('countttttttttttt----------',count);

  }

  clearsectors(event: any) {
    if (event == false) {
      if (this.sector) {
        this.map.removeLayer(this.sector);

      }
      for (const layer of this.sectorarray) {
        this.map.removeLayer(layer);
      }
    } else {

      this.sectorarray.forEach((element: any, key: any) => {
        element.addTo(this.map);
      })
    }


  }

  changeview(eventData: any) {
    //console.log('eventData', eventData);
    this.map.setView([eventData.row.lat, eventData.row.Lng], 16);
  }

  clearTechnology(eventData: any) {
    let Technology = eventData.technology;
    let event = eventData.event;
    //console.log('Technology1111', Technology);
    //console.log('this.sectorarray', this.sectorarray);

    //console.log('eventData', eventData);
    //console.log('Technology', eventData.technology);
    
    let findedSectorTechnology: any = this.sectorarray.filter((sector: any) => {
      return sector.Technology === Technology
    });

    //console.log('findedSectorTechnology', findedSectorTechnology);
    if (event.target.checked == false) {
      for (const layer of findedSectorTechnology) {
        this.map.removeLayer(layer);
      }
    } else {
      for (const layer of findedSectorTechnology) {
        layer.addTo(this.map);
      }
    }

   }
  

  sectorCellIdchange(eventData: any){
    let eventcgi_id = eventData.cdrType;
    let event = eventData.event;
    if (eventcgi_id == 'mtc'){
      if (event.target.checked == false) {
        if (event.target.checked == false) {
          this.sectorarray.forEach((elt:any)=>{
            elt.Object.forEach((i:any) => {
              if (i[6].toString().startsWith("4503")){
                this.map.removeLayer(elt);
                this.removesectors.push(elt);
              }
            });
          });
          this.removesectors = [...new Set(this.removesectors)];  
        }else{
           this.removesectors.forEach( (layer)=> {
            layer.addTo(this.map);
      });
      this.removesectors=[];
        }
        
      }else{

      }
    }else if (eventcgi_id == 'alfa'){
      if (event.target.checked == false) {
        this.sectorarray.forEach((elt:any)=>{
          elt.Object.forEach((i:any) => {
            if (!i[6].toString().startsWith("4503")){
              this.map.removeLayer(elt);
              this.removesectors.push(elt);
            }
          });
        });
        this.removesectors = [...new Set(this.removesectors)];  
      }else{
         this.removesectors.forEach( (layer)=> {
          layer.addTo(this.map);
    });
    this.removesectors=[];
      }
    }
  }
  

  DisplayCdr() {
    this.isTcd = true;
    //alert('in angularrrr')
    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_isBtsall) {
      //console.log("A_isBtsall", (window.parent.parent.parent[7] as any).A_isBtsall)
      this.isBtsall = (window.parent.parent.parent[7] as any).A_isBtsall;
      //console.log("isBtsall>>", this.isBtsall)

    }

    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_sqlcond) {
      //console.log("A_sqlcond", (window.parent.parent.parent[7] as any).A_sqlcond)
      this.isSqlCond = (window.parent.parent.parent[7] as any).A_sqlcond;
      //console.log("A_sqlcond>>", this.isSqlCond)

    }

    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_isBTS) {
      //console.log("A_isBTS", (window.parent.parent.parent[7] as any).A_isBTS)
      this.isBTS = (window.parent.parent.parent[7] as any).A_isBTS;
      //console.log("isBTS>>", this.isBTS)

    }

    if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_simulationid) {
      this.simulationid = (window.parent.parent.parent[7] as any).A_simulationid;
    }
    if (this.isBTS == true) {
      if (this.fixedMarkersGroup) {
        this.map.removeLayer(this.fixedElementMarker);

      }
      if (this.fixedElementMarker) {
        this.map.removeLayer(this.fixedElementMarker);

      }
      if (this.fixedMarkersArray.length > 0) {
        this.map.removeLayer(this.fixedMarkersGroup);
        this.fixedMarkersArray = [];
      }
      //console.log("isFixedElements>>>>>>>>>>>>>>>>>>");

      (window.parent.parent.parent[7] as any).ResetBooleanVar();

      //console.log("ObjectID beforeeee>>>>>", this.ObjectID);
      let numArrbefore;
      if (typeof this.ObjectID != "undefined") {
        numArrbefore = this.ObjectID.join().split(",").map(Number)

      }

      this.ObjectID = (window.parent.parent.parent[7] as any).A_ObjectID;
      // this.ObjectID=this.ObjectID.push((window.parent.parent.parent[7] as any).A_ObjectID);
      //console.log("ObjectID>>>>>", this.ObjectID);
      //console.log("ObjectID join>>>>>", this.ObjectID.join());
      //console.log("ObjectID join>>>>>stringggg", this.ObjectID.join().toString());

      //console.log("ObjectID join2>>>>>", this.ObjectID.join().split(",").map(Number));
      let numArr = this.ObjectID.join().split(",").map(Number);
      if (typeof numArrbefore != "undefined") {
        for (let i = 0; i < numArr.length; i++) {
          numArrbefore.push(numArr[i]);

        }
        //console.log("numArrbefore>>>>>", numArrbefore);

        //console.log(" getUniqueNumbers>>>>>", this.getUniqueNumbers(numArrbefore));
        numArr = this.getUniqueNumbers(numArrbefore);
      }
      //console.log("numArr>>>>>", numArr);
      let numArrfinall = numArr.map((num: any) => num.toString());
      //console.log("numArrfinall>>>>>", numArr);
      this.ObjectID = numArrfinall;
        if ((window.parent.parent.parent[7] as any) && (window.parent.parent.parent[7] as any).A_sqlcond) {
          //console.log("A_sqlcond", (window.parent.parent.parent[7] as any).A_sqlcond)
          this.isSqlCond = (window.parent.parent.parent[7] as any).A_sqlcond;
          //console.log("A_sqlcond>>", this.isSqlCond)
    
        }


     
        if (typeof (window.parent.parent.parent[7] as any).A_sqlcond == "undefined") {
          this.isSqlCond = "";
        }
        
       
        
      this.BTSObject= {
        sqlcond:this.isSqlCond,
        ids:this.ObjectID
      }

      this.datacrowdService.getfixedelementsObject2BTS(JSON.stringify(this.BTSObject), this.usercode).then((res: any) => {
        //console.log('getfixedelementsObject2BTS>>>>', res);
        //localStorage.setItem('getfixedelementsObject2BTS',JSON.stringify(res));


        this.CdrData = res;

        //console.log('x', this.CdrData);
        //console.log('x000', this.CdrData[0]);


        this.CdrRowData = [];
        this.CdrRowData2 = [];

        //console.log('x', this.CdrData);
        //console.log('x000', this.CdrData[0]);


        this.fixedMarkersGroup = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          animate: true,
          singleMarkerMode: false,
          zoomToBoundsOnClick: false,
          maxClusterRadius: 50, // Adjust this value as needed
          iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers();
            var html = '<div  class="elementGroup" >' + markers.length + '</div>';

            return L.divIcon({
              html: html,
              className: 'mycluster',
              iconSize: L.point(32, 32)
            });
          },
        });
        
        this.fixedMarkersGroupLoop = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          animate: true,
          singleMarkerMode: false,
          zoomToBoundsOnClick: false,
          maxClusterRadius: 50, // Adjust this value as needed
          iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers();
            var html = '<div  class="elementGroup" >' + markers.length + '</div>';

            return L.divIcon({
              html: html,
              className: 'mycluster',
              iconSize: L.point(32, 32)
            });
          },
        });
        for (let i = 0; i < this.CdrData[0].length; i++) {
          //this.displayFixedElements(this.CdrData[0][i]);



          this.displayBTS(this.CdrData[0][i].BTS);
          //console.log('this.CdrData[0][i]>>>', this.CdrData[0][i].INFO);


          for (let j = 0; j < this.CdrData[0][i].SECTORS.length; j++) {
            // //console.log('this.CdrData[1]>>>',this.CdrData[1]);
            ////console.log('this.CdrData[1][i][j]>>>',this.CdrData[1][i][j]);
            this.drawarc(Number(this.CdrData[0][i].BTS.LATITUDE), Number(this.CdrData[0][i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(this.CdrData[0][i].SECTORS[j]) - 22.5, 90 + Number(this.CdrData[0][i].SECTORS[j]) + 22.5, this.SectorColor, '', this.CdrData[0][i].INFO);

          }
        }

        if (this.CdrData[0].length > 1) {
          this.map.setView([this.CdrData[0][0].BTS.LATITUDE, this.CdrData[0][0].BTS.LONGITUDE], 8)

        } else {
          this.map.setView([this.CdrData[0][0].BTS.LATITUDE, this.CdrData[0][0].BTS.LONGITUDE], 20)

        }


      });

      this.isAOi = false;
      this.isSimul = false;
      this.isFixedElements = false;
      this.isFixedElementsall = false;
      this.isBTS = false;
      this.isBtsall = false;
      this.isTcd = false;

    }
  }


  cdrdisplay() {

    this.IsCdr = true;

    //console.log('x', this.CdrData);
    //console.log('x000', this.CdrData[0]);

    // //console.log('x>>>',JSON.parse(this.CdrData[0]));

    this.fixedMarkersGroup = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      animate: true,
      singleMarkerMode: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50, // Adjust this value as needed
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var html = '<div  class="elementGroup" >' + markers.length + '</div>';

        return L.divIcon({
          html: html,
          className: 'mycluster',
          iconSize: L.point(32, 32)
        });
      },
    });
    this.fixedMarkersGroupLoop = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      animate: true,
      singleMarkerMode: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50, // Adjust this value as needed
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var html = '<div  class="elementGroup" >' + markers.length + '</div>';

        return L.divIcon({
          html: html,
          className: 'mycluster',
          iconSize: L.point(32, 32)
        });
      },
    });
    for (let i = 0; i < this.CdrData[0].length; i++) {
      //this.displayFixedElements(this.CdrData[0][i]);



      this.displayBTS(this.CdrData[0][i].BTS);
      //console.log('this.CdrData[0][i]>>>', this.CdrData[0][i].BTS);


      for (let j = 0; j < this.CdrData[0][i].SECTORS.length; j++) {
        // //console.log('this.CdrData[1]>>>',this.CdrData[1]);
        ////console.log('this.CdrData[1][i][j]>>>',this.CdrData[1][i][j]);
        this.drawarc(Number(this.CdrData[0][i].BTS.LATITUDE), Number(this.CdrData[0][i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(this.CdrData[0][i].SECTORS[j]) - 22.5, 90 + Number(this.CdrData[0][i].SECTORS[j]) + 22.5, this.SectorColor, '', '');

      }
    }


  }


  scandevices() {
    if (this.marker) {
      //console.log("marker>>>", this.marker);
      this.map.removeLayer(this.marker);
    }
    if (this.markers) {
      this.map.removeLayer(this.markers);

    }
 


    this.marker = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      animate: true,
      singleMarkerMode: true,
      iconCreateFunction: function (cluster) {
        //console.log('cluster>>>>>>', cluster);
        var markers: any = cluster.getAllChildMarkers();
        //console.log('markers>>>>>>', markers)
        // Initialize a variable to keep track of the device count
        let distinctTypes: any = {};

        // Loop through the array and count the devices
        for (const marker of markers) {
          // Assuming the device identifier is in the third element of each sub-array
          // const deviceId = marker.tel;

          // // Check if the deviceId is unique to count as a device
          // if (!markers.some((m:any) => m !== marker && m.tel === deviceId)) {
          //   deviceCount++;
          // }

          distinctTypes[marker.tel] = true;

        }

        const countDistinctTypes = Object.keys(distinctTypes).length;
        //console.log('countDistinctTypes>>>>>>', countDistinctTypes)

        //console.log(`Distinct types count: ${countDistinctTypes}`);
        ////console.log(`Total number of devices: ${deviceCount}`);

        var html = '<div  class="custom-cluster-icon" >' + countDistinctTypes + '</div>';
        if (markers.length < 50) {
          $('.custom-cluster-icon').css('background-color', 'rgba(240, 194, 12, 0.6)')
        } else if (markers.length > 50 && markers.length < 100) {
          $('.custom-cluster-icon').css('background-color', 'rgba(110, 204, 57, 0.6)')

        } else {
          $('.custom-cluster-icon').css('background-color', 'rgba(241, 128, 23, 0.6)')

        }

        return L.divIcon({
          html: html,
          className: 'mycluster',
          iconSize: L.point(32, 32)
        });

      },
    });
    //console.log('11111111111111>>>>>>',  );

    for (var j = 0; j < 1; j++) {
      for (var i = 0; i < this.datajson.markerPositions.length; i++) {
        this.myMarker = L.marker([
          Number(this.datajson.markerPositions[i][0]),
          Number(this.datajson.markerPositions[i][1]),
        ]);
        // this.marker.addLayer(this.markers);
        this.myMarker.off("click");
        this.myMarker.on("mousedown", (e: any) => {
          if (e.originalEvent.buttons == 2) {
            e.target.openPopup();
            // alert(2);
          }
          if (e.originalEvent.buttons == 1) {
            //  alert(1);
          }

        });

      }


      this.rowData = [];
      this.datajson.markerPositions.forEach((element: any, key: any) => {
        this.myMarker = this.binddata(
          element[0],
          element[1],
          element[2],
          element[3],
          element[4],
          element[5],
          ""
        );
        this.myMarker.lat = element[0];
        this.myMarker.lng = element[1];
        this.myMarker.timestamp = element[3];
        this.myMarker.tel = element[2];
        this.myMarker.name = element[4];
        this.myMarker.off("click");
        this.myMarker.on("mousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            //console.log("markerChildrensssssss", e.target)
            this.rowData = [];
            var jsonaggrid = {
              Device_id: e.target.tel,
              Tel: e.target.name,
              Date: e.target.timestamp,
              Hits: "1",
              Coord: e.target.lat + ',' + e.target.lng,

            };
            this.rowData.push(jsonaggrid);


            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            // componentref.instance.selectdevices = true;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            const html2 = componentref.location.nativeElement;
            componentref.instance.Grid2Type = 'btn-54';
            componentref.instance.GridID = 'GeoGridbyDevice';


            await html2;

            $('.ag-theme-balham').css('height', '130px');

            // /  e.target.openPopup(html2, e.target._latlng);
            this.map.openPopup(html2, e.target._latlng);


          } else if (e.originalEvent.buttons == 1) {

          }

        });
        this.marker.addLayer(this.myMarker);
        //  this.filterData2(this.datajson.markerPositions, this.marker, this.controlLayers);

        $('#controlbutton').css('display', '');

      })
      this.marker.addTo(this.map);

    };


    const componentfactory =
      this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
    const componentref =
      this.viewContainerRef.createComponent(componentfactory);
    const html1 = (componentref.location.nativeElement.style.display = "none");
    componentref.instance.columnDefs = this.columnDefs;
    componentref.changeDetectorRef.detectChanges();
    this.marker.off("click");
    this.marker.on("clustermousedown", async (e: any) => {
      if (e.originalEvent.buttons == 2) {
        var markerChildrens = e.layer.getAllChildMarkers();

        //console.log("markerChildrens>>><<<", markerChildrens)
        //console.log('rowdata before1>>>>>>', this.rowData)

        this.rowData = [];
        //console.log('rowdata before2>>>>>>', this.rowData)

        for (var j = 0; j < markerChildrens.length; j++) {
          var jsonaggrid = {
            Device_id: markerChildrens[j].tel,
            Tel: markerChildrens[j].name,
            Date: markerChildrens[j].timestamp,
            Hits: "1",
            Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,

          };
          //console.log('rowdata jsonaggrid>>>>', jsonaggrid)
          this.rowData.push(jsonaggrid);
        }
        //console.log('rowdata after>>>>>>', this.rowData)
        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            VAgGridComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        componentref.instance.rowData = this.rowData;
        componentref.instance.columnDefs = this.columnDefs;
        componentref.instance.headerHeight = 0;
        // componentref.instance.selectdevices = true;
        componentref.instance.Title = "Here On";
        componentref.instance.distinct = true;
        componentref.changeDetectorRef.detectChanges();
        componentref.instance.pagination = false;
        componentref.instance.rowGrouping = true;
        componentref.instance.contextmenu = false;
        componentref.instance.Grid2Type = 'btn-54';
        componentref.instance.GridID = 'GeoGridbyDevice';

        const html1 = componentref.location.nativeElement;
        await html1;




        this.map.openPopup(html1, e.layer.getLatLng());
        if (markerChildrens.length < 3) {
          // $('#agGrid').css('height','10px');
          $('.ag-theme-balham').css('height', '130px');

        } else {
          $('.ag-theme-balham').css('height', ' 250px ');

        }
      }
    });



  }

  getSectorCoordinates(center: any, radius: any, startAngle: any, stopAngle: any) {
    const angleStep = 5; // Adjust as needed for the level of detail
    const coordinates = [];

    for (let angle = startAngle; angle <= stopAngle; angle += angleStep) {
      const radians = (angle - 90) * (Math.PI / 180);
      const lat = center[0] + (radius * Math.cos(radians)) / 111.32;
      const lon = center[1] + (radius * Math.sin(radians)) / (111.32 * Math.cos(center[0] * (Math.PI / 180)));

      coordinates.push([lat, lon]);
    }

    coordinates.push(center); // Add the center point to complete the sector

    return coordinates;
  }


  getUniqueNumbers(numbersArray: number[]): number[] {
    // Use the 'Set' object to store unique numbers
    const uniqueNumbers = new Set<number>();

    // Iterate over the array and add each number to the set
    for (const number of numbersArray) {
      uniqueNumbers.add(number);
    }

    // Convert the set back to an array
    const uniqueNumbersArray = Array.from(uniqueNumbers);

    return uniqueNumbersArray;
  }
  
  getUniqueString(numbersArray: String[]): String[] {
    // Use the 'Set' object to store unique numbers
    const uniqueNumbers = new Set<String>();

    // Iterate over the array and add each number to the set
    for (const number of numbersArray) {
      uniqueNumbers.add(number);
    }

    // Convert the set back to an array
    const uniqueNumbersArray = Array.from(uniqueNumbers);

    return uniqueNumbersArray;
  }

  shortestpath() {
    //  this.startMarker = L.marker([33.8912, 35.55852],{icon:this.singlepersonicon}).addTo(this.map);
    this.animatedmarker = L.marker([35.96017755, 38.98391424], { icon: this.singlepersonicon }).addTo(this.map);

    let waypoints: any = this.convertToLatLngArray(this.routedatajson);
    //console.log('waypoints', waypoints)
// Alternatively, you can set colors directly in PathOptions if using styles
    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
   
    });
    this.pathCoordinates = [];

    // Add routing control to the map
    routingControl.addTo(this.map);



    routingControl.on('routesfound', (event: any) => {
      //console.log("event>>>", event);

      // Get the route information
      this.route1 = event.routes[0];
      this.pathCoordinates = this.route1.coordinates;
      // Start animating the marker along the route
      //console.log("this.route1", this.route1);
      //console.log("this.pathCoordinates", this.pathCoordinates);
      this.animateMarker();
      this.currentIndex = 0;

    });


  }
 

//   shortestpath() {
//     //  this.startMarker = L.marker([33.8912, 35.55852],{icon:this.singlepersonicon}).addTo(this.map);
//     this.animatedmarker = L.marker([35.96017755, 38.98391424], { icon: this.singlepersonicon }).addTo(this.map);

//     let waypoints: any = this.convertToLatLngArray(this.routedatajson);
//     //console.log('waypoints', waypoints)
// // Alternatively, you can set colors directly in PathOptions if using styles
//     const routingControl = L.Routing.control({
//       waypoints: waypoints,
//       routeWhileDragging: false,
   
//     });
//     this.pathCoordinates = [];

//     // Add routing control to the map
//     routingControl.addTo(this.map);



//     routingControl.on('routesfound', (event: any) => {
//       //console.log("event>>>", event);

//       // Get the route information
//       this.route1 = event.routes[0];
//       this.pathCoordinates = this.route1.coordinates;
//       // Start animating the marker along the route
//       //console.log("this.route1", this.route1);
//       //console.log("this.pathCoordinates", this.pathCoordinates);
//       this.animateMarker();
//       this.currentIndex = 0;

//     });


//   }

  // Animate Marker along the Path

// animateMarker() {
//     let count=0;
//     //console.log('pathCoordinatesDev11111111111111>>>>>>',  this.pathCoordinatesDev);

//     this.pathCoordinatesDev.forEach((onepathCoordinates:any)=>{
//       //console.log('onepathCoordinates>>>>>>',  onepathCoordinates);

//       this.pathCoordinates=onepathCoordinates;
//       this.animatedmarker=this.animatedmarkerArray[count];
//       //console.log('this.animatedmarker>>>>>>',  this.animatedmarker);
//       //console.log('count>>>>>>',  count);

//       this.movePersonMarker(this.animatedmarker,this.pathCoordinates);
//       count++;
//       });
//   }



  async RunDeviceHistory() {
    //let device:any =this.dataService.getDHselectedDevice();
    let device = localStorage.getItem('deviceselected');
    this.selectedType=2;
    

 

this.test33();
  }
  // movePersonMarker(animatedmarker:any,pathCoordinates:any[]) {
  //   if (this.currentIndex < pathCoordinates.length && !this.animationStopped) {
  //     const currentLatLng =pathCoordinates[this.currentIndex];
  //       animatedmarker.setLatLng(currentLatLng);
  //       let deviceId= animatedmarker.deviceId;
    
  //       // animatedmarker.bindPopup('This is a popup!').openPopup();
  //     // const currentLatLng = this.pathCoordinates[this.currentIndex];

  //     this.currentIndex++;

  //     setTimeout(() => this.movePersonMarker(animatedmarker,pathCoordinates), 100 ); // Adjust the animation speed as needed
  //   } else {
  //     //console.log('Animation Completed');

  //   }
  // }



  stopAnimationButton() {
    if (this.animationStopped == true) {
      this.animationStopped = false;
      // Reset skip flag when stopping the animation
      this.skipAnimation = true;
     
    } else {
      this.animationStopped = true;
      this.skipAnimation = false;

    }

  }

  controlTooltip(event: any) {

    var Tooltip = new L.LayerGroup();

    if (event == true) {
      Tooltip.on('add', () => {
        this.map.eachLayer((l: any) => {
          if (l.getTooltip) {
            var toolTip = l.getTooltip();
            if (toolTip) {
              this.map.addLayer(toolTip);
            }
          }
        });
      })
      Tooltip.on('remove', () => {
        this.map.eachLayer((l: any) => {
          if (l.getTooltip) {
            var toolTip = l.getTooltip();
            if (toolTip) {
              this.map.closeTooltip(toolTip);
            }
          }
        });
      });
    } else {
      Tooltip.on('add', () => {
        this.map.eachLayer((l: any) => {
          if (l.getTooltip) {
            var toolTip = l.getTooltip();
            if (toolTip) {
              this.map.addLayer(toolTip);
            }
          }
        });
      })
      Tooltip.on('remove', () => {
        this.map.eachLayer((l: any) => {
          if (l.getTooltip) {
            var toolTip = l.getTooltip();
            if (toolTip) {
              this.map.closeTooltip(toolTip);
            }
          }
        });
      });
    }
  }

  controlClusters(event: any) {
    if (event == false) {
      // let activityHotspots = L.layerGroup([this.marker]).addTo(this.map);
      this.marker.addTo(this.map);

    } else {
      if (this.marker) {
        this.map.removeLayer(this.marker);

      }
    }


  }

  controldateTooltip(event: any) {
    var Tooltip = new L.LayerGroup();

    if (event == false) {
      // this.tooltipInstance.openTooltip();
      if (this.tooltipInstanceArray) {
        for (const tooltipInstance of this.tooltipInstanceArray) {
          tooltipInstance.openTooltip();
        }

      }
    } else {
      this.hideTooltip();
    }


  }
  controlArea(event: any) {

  } 


  deviceClusters(eventData: { event: any; name: any; checkedCount: number; namearray: any[] }) {

    let { event, name, checkedCount, namearray } = eventData;

    //console.log("event:", event);
    //console.log("name:", name);
    //console.log("checkedCount:", checkedCount);
    //console.log("namearray:", namearray);
    let checkednames: any = namearray;

    //console.log("ifchecikeddddd:::::", event.target.checked);
    //console.log("nameeventttt:::::", event.target.id);

    //console.log("arrayyyyyyyyyyyyy:", checkednames);

    let eventName: any = event.target.id;
    //console.log("eventName:::::;;::::;", eventName);
    //console.log("event.target:::::;;::::;", event.target);

    if (event.target.checked === false) {
      this.markerControlArray.forEach((element: any, key: any) => {


        this.map.removeLayer(element);

      });
      this.markerControlArray = [];


      //console.log("this.markerControlArray>>>>>>>>>", this.markerControlArray);

      checkednames = checkednames.filter((item: any) => item.layer_control !== eventName);
      //console.log("checkednamesfalseeeeeeeeeeeeeee:::::;;::::;", checkednames);

      checkednames.forEach((name: any) => {
        //console.log("eventttttttttttttt:", event);
        //console.log("device clusters name:::::::::::", name.layer_control);
        name = name.layer_control;
        let x = this.findObjectsByElement4(this.datajson, name);
        //console.log("findObjectsByElement4:::::::::::", x);
        let data: any = {
          markerPositions: x
        };
        //console.log("final obejctssss:::::::::::", data);


        this.markerclusterControl = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          animate: true,
          singleMarkerMode: true,
        });

        this.rowData = [];
        data.markerPositions.forEach((element: any, key: any) => {
          this.myMarker2 = this.binddata(
            element[0],
            element[1],
            element[2],
            element[3],
            element[4],
            element[5],
            ""
          );
          this.myMarker2.lat = element[0];
          this.myMarker2.lng = element[1];
          this.myMarker2.timestamp = element[3];
          this.myMarker2.tel = element[2];
          this.myMarker2.name = element[4];
          this.myMarker2.off("click");




          this.markersArray2.push(this.myMarker2);
          this.markerclusterControl.addLayers(this.myMarker2);

        });
        // }
        //console.log('final id of markerclsuter control ', this.markerclusterControl._leaflet_id);
        //console.log('json ', json);

        var json: any = {
          id: this.markerclusterControl._leaflet_id,
          Name: eventName
        };
        //console.log('json >>>>', json);

        this.ControlArray.push(json);
        this.markerclusterControl.addTo(this.map);
        this.markerControlArray.push(this.markerclusterControl)

      });



    } else {

      //console.log("checkednamestrueeeeeeeeeeee:::::;;::::;", checkednames);


      //console.log("arrayyyyyyyyyyyyy:", checkednames);
      checkednames.forEach((name: any) => {
        //console.log("eventttttttttttttt:", event);
        //console.log("device clusters name:::::::::::", name.layer_control);
        name = name.layer_control;
        let x = this.findObjectsByElement4(this.datajson, name);
        //console.log("findObjectsByElement4:::::::::::", x);
        let data: any = {
          markerPositions: x
        };
        //console.log("final obejctssss:::::::::::", data);


        this.markerclusterControl = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          animate: true,
          singleMarkerMode: true,
        });

        this.rowData = [];
        data.markerPositions.forEach((element: any, key: any) => {
          this.myMarker2 = this.binddata(
            element[0],
            element[1],
            element[2],
            element[3],
            element[4],
            element[5],
            ""
          );
          this.myMarker2.lat = element[0];
          this.myMarker2.lng = element[1];
          this.myMarker2.timestamp = element[3];
          this.myMarker2.tel = element[2];
          this.myMarker2.name = element[4];
          this.myMarker2.off("click");
          this.myMarker2.on("mousedown", async (e: any) => {
            if (e.originalEvent.buttons == 2) {
              //console.log("markerChildrensssssss", e.target)
              this.rowData = [];
              var jsonaggrid = {
                Device_id: e.target.tel,
                Tel: e.target.name,
                Date: e.target.timestamp,
                Hits: "1",
                Coord: e.target.lat + ',' + e.target.lng,
                // Lat:e.target.lat
              };
              this.rowData.push(jsonaggrid);

              const componentfactory =
                this.componentFactoryResolver.resolveComponentFactory(
                  VAgGridComponent
                );
              const componentref =
                this.viewContainerRef.createComponent(componentfactory);
              componentref.instance.rowData = this.rowData;
              componentref.instance.columnDefs = this.columnDefs;
              componentref.instance.headerHeight = 0;
              // componentref.instance.selectdevices = true;
              componentref.instance.Title = "Here On";
              componentref.instance.distinct = true;
              componentref.changeDetectorRef.detectChanges();
              const html2 = componentref.location.nativeElement;
              componentref.instance.Grid2Type = 'btn-54';

              await html2;

              // /  e.target.openPopup(html2, e.target._latlng);
              this.map.openPopup(html2, e.target._latlng);
            } else {

            }


          });


          const componentfactory =
            this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
          const componentref =
            this.viewContainerRef.createComponent(componentfactory);
          const html1 = (componentref.location.nativeElement.style.display = "none");
          componentref.instance.columnDefs = this.columnDefs;
          componentref.changeDetectorRef.detectChanges();
          this.markerclusterControl.off("click");
          this.markerclusterControl.on("clustermousedown", async (e: any) => {
            if (e.originalEvent.buttons == 2) {
              var markerChildrens = e.layer.getAllChildMarkers();

              //console.log("markerChildrens>>><<<", markerChildrens)
              //console.log('rowdata before1>>>>>>', this.rowData)

              this.rowData = [];
              //console.log('rowdata before2>>>>>>', this.rowData)

              for (var j = 0; j < markerChildrens.length; j++) {
                var jsonaggrid = {
                  Device_id: markerChildrens[j].tel,
                  Tel: markerChildrens[j].name,
                  Date: markerChildrens[j].timestamp,
                  Hits: "1",
                  Coord: markerChildrens[j].lng + ',' + markerChildrens[j].lat
                  // Lng:markerChildrens[j].lng,
                  // Lat:markerChildrens[j].lat
                };
                //console.log('rowdata jsonaggrid>>>>', jsonaggrid)
                this.rowData.push(jsonaggrid);
              }
              //console.log('rowdata after>>>>>>', this.rowData)
              const componentfactory =
                this.componentFactoryResolver.resolveComponentFactory(
                  VAgGridComponent
                );
              const componentref =
                this.viewContainerRef.createComponent(componentfactory);
              componentref.instance.rowData = this.rowData;
              componentref.instance.columnDefs = this.columnDefs;
              componentref.instance.headerHeight = 0;
              // componentref.instance.selectdevices = true;
              componentref.instance.Title = "Here On";
              componentref.instance.distinct = true;
              componentref.changeDetectorRef.detectChanges();
              componentref.instance.pagination = false;
              componentref.instance.rowGrouping = true;
              componentref.instance.contextmenu = false;
              componentref.instance.Grid2Type = 'btn-54';

              const html1 = componentref.location.nativeElement;
              await html1;


              $('.ag-theme-balham').css('height', ' 250px');

              this.map.openPopup(html1, e.layer.getLatLng());


            }
          });

          this.markersArray2.push(this.myMarker2);
          this.markerclusterControl.addLayers(this.myMarker2);

        });
        // }
        //console.log('final id of markerclsuter control ', this.markerclusterControl._leaflet_id);
        //console.log('json ', json);

        var json: any = {
          id: this.markerclusterControl._leaflet_id,
          Name: eventName
        };
        //console.log('json >>>>', json);

        this.ControlArray.push(json);
        this.markerclusterControl.addTo(this.map);
        this.markerControlArray.push(this.markerclusterControl)

      });

    }
    //console.log("this.markerclusterControl>>>>>>>>>", this.markerclusterControl);
    //console.log("this.markerControlArray>>>>>>>>>", this.markerControlArray);
    //console.log("yhis.myMarker2>>>>", this.myMarker2)
    //console.log("yhis.markersArray2>>>>", this.markersArray2)

  }

  filterData22() {
    this.uniqueNames = [];
    this.display = !this.display;
    const markerPositions = this.datajson.markerPositions;
    //console.log("datajson in layerconstrol>>>>>>>", this.datajson);

    //console.log("markerPositions in layerconstrol>>>>>>>", markerPositions);
    this.uniqueNames = [...new Set(markerPositions.map((item: any) => item[4]))];
    //console.log("uniqueNames::::::", this.uniqueNames);
    if (this.display === false) {
      //  this.clusters2=[];
      //    this.clusterFeatures2=[];
      this.uniqueNames = [];
    }
  }



  controlHeats(event: any) {
    if (event == true) {
      this.heat = L.heatLayer(this.datajson.heatCoords, {
        radius: 20
      });
      this.heat.addTo(this.map);

    } else {
      if (this.heat) {
        this.map.removeLayer(this.heat);

      }
    }

  }
  findObjectsByElement4(datajson: any, elementValue: string): any[] {
    return datajson.markerPositions.filter((item: any) => item[4] === elementValue);
  }

  setbtsType(type: any) {
    this.BtsTypeSlected = type;
    this.dialog.closeAll();

  }



  async displayClusters2(AlocSimulId:any){
    this.displayclusters=true;

    await this.datacrowdService.getsimualtion(AlocSimulId, this.usercode).then((res: any) => {
      this.datajson = res;
      //console.log("getsimultion response >>>>", this.datajson);
    });
    //console.log("this.datajson.markerPositions>>>>", this.datajson.markerPositions);

    if (this.datajson.markerPositions !== null) {
      //console.log("this.datajson.markerPositions<<<>>>>>", this.datajson.markerPositions.length);
      this.marker = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        animate: true,
        singleMarkerMode: true,
      });
      this.markerLoop = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        animate: true,
        singleMarkerMode: true,
      });
      let lastMarkerLat = 0;
      let lastMarkerLng = 0;

      for (var j = 0; j < 1; j++) {
        for (var i = 0; i < this.datajson.markerPositions.length; i++) {
          this.markers = L.marker([
            Number(this.datajson.markerPositions[i][0]),
            Number(this.datajson.markerPositions[i][1]),
          ]);
          this.markers.off("click");
          this.markers.on("mousedown", (e: any) => {
            if (e.originalEvent.buttons == 2) {
              e.target.openPopup();

            }
            if (e.originalEvent.buttons == 1) {
              //  alert(1);
            }
          });
          this.markersArray.push(this.markers)
          
  lastMarkerLat = this.datajson.markerPositions[i][0];
  lastMarkerLng = this.datajson.markerPositions[i][1];
        }
      }

 

      //       markersBatch.push(marker);
      //     }

      //     // Apply event listeners to the batch of markers
      //     markersBatch.forEach(marker => {
      //       marker.off("click");
      //       marker.on("mousedown", (e: any) => {
      //         if (e.originalEvent.buttons == 2) {
      //           e.target.openPopup();
      //         }
      //         if (e.originalEvent.buttons == 1) {
      //           // alert(1);
      //         }
      //       });

      //       this.markersArray.push(marker);
      //     });

      //     // Clear markersBatch to free up memory
      //     markersBatch.length = 0;
      //   }
      // }
      // // End the timer and log the elapsed time
      // //console.timeEnd('loopTime');

      //     //  this.marker.openPopup(
      //     //  html11
      //     //  );


      this.map.setView([lastMarkerLat, lastMarkerLng],12);

      this.rowData = [];
      this.datajson.markerPositions.forEach((element: any, key: any) => {
        this.myMarker = this.binddata(
          element[0],
          element[1],
          element[2],
          element[3],
          element[4],
          element[5],
          ""
        );

        this.myMarker.lat = element[0];
        this.myMarker.lng = element[1];
        this.myMarker.timestamp = element[3];
        this.myMarker.tel = element[2];
        this.myMarker.name = element[4];
        this.marker.addLayer(this.myMarker);
        this.markerLoop.addLayer(this.myMarker);
        this.myMarker.off("click");
        this.myMarker.on("mousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            //console.log("markerChildrensssssss", e.target)
            this.rowData = [];
            var jsonaggrid = {
              Device_id: e.target.tel,
              Tel: e.target.name,
              Date: e.target.timestamp,
              Hits: "1",
              Coord: e.target.lat + ',' + e.target.lng,
              //Lat:e.target.lat
            };
            this.rowData.push(jsonaggrid);


            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            // componentref.instance.selectdevices = true;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.Grid2Type = 'btn-54';
            componentref.instance.GridID = 'GeoGrid1';

            const html2 = componentref.location.nativeElement;
            await html2;

            // $('#agGrid').css('height','10px');
            $('.ag-theme-balham').css('height', '130px');


            // /  e.target.openPopup(html2, e.target._latlng);
            this.map.openPopup(html2, e.target._latlng);


          } else if (e.originalEvent.buttons == 1) {

          }

        });
      });

      const componentfactory =
        this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
      const componentref =
        this.viewContainerRef.createComponent(componentfactory);
      const html1 = (componentref.location.nativeElement.style.display = "none");
      componentref.instance.columnDefs = this.columnDefs;
      componentref.changeDetectorRef.detectChanges();
      this.marker.off("click");
      this.marker.on("clustermousedown", async (e: any) => {
        if (e.originalEvent.buttons == 2) {
          var markerChildrens = e.layer.getAllChildMarkers();





          this.rowData = [];

          for (var j = 0; j < markerChildrens.length; j++) {
            var jsonaggrid = {
              Device_id: markerChildrens[j].tel,
              Tel: markerChildrens[j].name,
              Date: markerChildrens[j].timestamp,
              Hits: "1",
              Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,
              // Lat:markerChildrens[j].lat
            };
            this.rowData.push(jsonaggrid);
          }

          //console.log("markerChildrens>>>>>", markerChildrens);

          const componentfactory =
            this.componentFactoryResolver.resolveComponentFactory(
              VAgGridComponent
            );
          const componentref =
            this.viewContainerRef.createComponent(componentfactory);
          componentref.instance.rowData = this.rowData;
          componentref.instance.columnDefs = this.columnDefs;
          componentref.instance.headerHeight = 0;
          // componentref.instance.selectdevices = true;
          componentref.instance.Title = "Here On";
          componentref.instance.distinct = true;
          componentref.changeDetectorRef.detectChanges();
          componentref.instance.pagination = false;
          componentref.instance.rowGrouping = true;
          componentref.instance.contextmenu = false;
          componentref.instance.Grid2Type = 'btn-54';
          componentref.instance.GridID = 'GeoGrid1';
          const html1 = componentref.location.nativeElement;
          await html1;
          //console.log("markerChildrens.length>>>>>>", markerChildrens.length)
          if (markerChildrens.length < 3) {
            // $('#agGrid').css('height','10px');
            $('.ag-theme-balham').css('height', '130px');

          } else {
            $('.ag-theme-balham').css('height', ' 250px ');

          }


          this.map.openPopup(html1, e.layer.getLatLng());

          // $(".modal-content").css("width","650px");
          // $(".modal-content").css("right","200px");
          // $(".modal-content").css("padding","10px");
          // $(".modal-content").css("top","85px");
          // $(".modal-content").draggable({
          //   axis: "both",
          //   cursor: "move"
          // });
          //  this.modalRef =this.modalService.open(this.popupContent1);

        }
        if (e.originalEvent.buttons == 1) {
          // alert(4);

        }

        //open popup;
      });

      this.map.addLayer(this.marker);
      
      this.magnifiedMap.addLayer(this.markerLoop);
      this.layerGroup.addLayer(this.marker);
      this.layerGroup.addLayer(this.markers);
}

}

  async displayShapes(AlocSimulId :any){
  await this.datacrowdService.getExecutionParam(AlocSimulId).then((res: any) => {
    this.ExecutionParam = res;
    //console.log("getExecutionParam response >>>>", this.ExecutionParam.Coordinates);
    let circlecoord = this.ExecutionParam.Coordinates;
  
    localStorage.setItem("coordsimul", JSON.stringify(circlecoord));
  
  
  
    for (
      var j = 0;
      j < circlecoord.length;
      j++
    ) {
      if (circlecoord[j].Type == "Circle") {
        this.Coord.push({
          ID: circlecoord[0].ID,
          Name: "",
          Value: "",
          Type: circlecoord[0].Type,
          Bounds: "",
          radius: circlecoord[0].radius,
          center: circlecoord[0].center,
          leafletid: circlecoord[0].leafletid,
          PolyBoundsCoords: "",
          selectedStartDate: "",
          selectedEndDate: "",
          countrycodes:"",
  
        });
  
        this.circle = L.circle(circlecoord[j].center, {
          color: "#6e83f0",
          fillOpacity: 0.5,
          radius: circlecoord[j].radius,
        });
  
        this.layerGroup.addLayer(this.circle);
        this.drawnLayers.push(this.circle);
        this.drawnItems.addLayer(this.circle);
  
      } else if (circlecoord[j].Type == "Rectangle") {
  
        let bnds = L.latLngBounds(
          L.latLng(
            circlecoord[j].Bounds.topLeft.lat,
            circlecoord[j].Bounds.topLeft.lng
          ),
          L.latLng(
            circlecoord[j].Bounds.bottomRight.lat,
            circlecoord[j].Bounds.bottomRight.lng
          )
        );
  
        this.rectangle = L.rectangle(bnds, {
          color: "#6e83f0",
          fillOpacity: 0.5,
        });
        this.layerGroup.addLayer(this.rectangle);
        this.drawnLayers.push(this.rectangle);
        this.drawnItems.addLayer(this.rectangle);
  
      } else if (circlecoord[j].Type == "Polygon") {
        this.polygon = L.polygon(circlecoord[j].Bounds, {
          color: "#6e83f0",
          fillOpacity: 0.5,
        });
  
        this.layerGroup.addLayer(this.polygon);
        this.drawnLayers.push(this.polygon);
        this.drawnItems.addLayer(this.polygon);
  
      } else if (circlecoord[j].Type == "Polyline") {
        this.polyline = L.polyline(circlecoord[j].Bounds, {
          color: "#6e83f0",
          fillOpacity: 0.5,
        });
        this.layerGroup.addLayer(this.polyline);
        this.drawnLayers.push(this.polyline);
        this.drawnItems.addLayer(this.polyline);
      }
      this.layerGroup.addTo(this.map);
    this.map.setView(circlecoord[j].center, 18)

    }

  
  });
}


  opentimelineScreen() {
    // alert(111);
    //console.log("11111111111----",window.parent as any);
    //console.log("hideSimulation----",(window.parent as any).hideSimulation());
    (window.parent as any).hideSimulation();
   
    this.displayedColumns = ['Time', 'event', 'Lng', 'lat'];
    // this.openTable = true;
if($('#tabletest').css('display') === 'block'){

  $('#tabletest').css('display','none');

}else{
  $('#tabletest').css('display','block');

}
    // if ((this.openTable = true)) {
    //   this.openTable = true;
    // } else {
    //   this.openTable = false;
    // }
  }


  tesTcdDisplay(){
 
    // this.datacrowdService.getfixedelementsObject2BTS(x, 8158).then((res) => {
    //   //console.log('getfixedelementsObject2BTS>>>>', res);
      //localStorage.setItem('getfixedelementsObject2BTS',JSON.stringify(res));
let res:any;
      this.CdrData = res;
//zaher
      //console.log('x', this.CdrData);
      //console.log('x000', this.CdrData[0]);


      this.CdrRowData = [];
      this.CdrRowData2 = [];

      //console.log('x', this.CdrData);
      //console.log('x000', this.CdrData[0]);


      this.fixedMarkersGroup = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        animate: true,
        singleMarkerMode: false,
        zoomToBoundsOnClick: false,
        maxClusterRadius: 50, // Adjust this value as needed
        iconCreateFunction: function (cluster) {
          var markers = cluster.getAllChildMarkers();
          var html = '<div  class="elementGroup" >' + markers.length + '</div>';

          return L.divIcon({
            html: html,
            className: 'mycluster',
            iconSize: L.point(32, 32)
          });
        },
      });

      this.sectorCluster = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        animate: true,
        singleMarkerMode: false,
        zoomToBoundsOnClick: false,
        iconCreateFunction: function (cluster) {
          var markers = cluster.getAllChildMarkers();
          var html = '<div  class="sectorGroup"></div>';
          // return L.divIcon({
          //   html: html,
          //   className: 'mycluster',
          //   iconSize: L.point(32, 32)
          // });
          return L.icon({
            iconUrl: '/assets/img/icons/sectors.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });
        },
      });

      for (let i = 0; i < this.CdrData[0].length; i++) {
        //this.displayFixedElements(this.CdrData[0][i]);



        this.displayBTS(this.CdrData[0][i].BTS);
        //console.log('this.CdrData[0][i]>>>', this.CdrData[0][i].INFO);


        for (let j = 0; j < this.CdrData[0][i].SECTORS.length; j++) {
          // //console.log('this.CdrData[1]>>>',this.CdrData[1]);
          ////console.log('this.CdrData[1][i][j]>>>',this.CdrData[1][i][j]);
          this.testdrawarc(Number(this.CdrData[0][i].BTS.LATITUDE), Number(this.CdrData[0][i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(this.CdrData[0][i].SECTORS[j]) - 22.5, 90 + Number(this.CdrData[0][i].SECTORS[j]) + 22.5, this.SectorColor, '', this.CdrData[0][i].INFO);

        }
      }
    this.fixedMarkersGroup.addTo(this.map);

    // this.sectorCluster.addTo(this.map);

      if (this.CdrData[0].length > 1) {
        this.map.setView([this.CdrData[0][0].BTS.LATITUDE, this.CdrData[0][0].BTS.LONGITUDE], 8)

      } else {
        this.map.setView([this.CdrData[0][0].BTS.LATITUDE, this.CdrData[0][0].BTS.LONGITUDE], 20)

      }


    // });
 
    
  }

GroupIMSI(data:any){
  // Assuming your original object is named 'originalObject'

  
const transformedData: any[] = [];
let currentGroup: any[] | null = null;

data.forEach((item:any) => {
  const key = item.slice(1, 4).join(',');

  if (currentGroup && currentGroup[0].join(',') === key) {
    // If the current group matches the key, add the first element to the existing group
    currentGroup[1].push(item[0]);
  } else {
    // If there's no current group or the key doesn't match, create a new group
    currentGroup = [item.slice(1, 4), [item[0]]];
    transformedData.push(currentGroup);
  }
});
//console.log('data transformed>>>',transformedData)
return transformedData;


}

  testdrawarc(lat: any, lng: any, Radius: any, StartAngle: any, StopAngle: any, AngleColor: any, object: any, sinfo2: any) {


    const center = [lat, lng]; // Replace with your center coordinates
    const radius = Radius / 1000; // Radius in meters
    const startAngle = StartAngle; // Start angle in degrees
    const stopAngle = StopAngle; // Stop angle in degrees

    const sectorOptions = {
      center: center,
      radius: radius,
      startAngle: startAngle,
      stopAngle: stopAngle,
      color: AngleColor,
      fillColor: AngleColor,
      fillOpacity: 0.1

    };

    // this.sector = L.polygon(this.getSectorCoordinates(center, radius, startAngle, stopAngle), sectorOptions).addTo(this.map);
     this.sector = L.polygon(this.getSectorCoordinates(center, radius, startAngle, stopAngle), sectorOptions);


    this.sector.sectorId = this.sectorId;
    // // Define the content for the popup
    // const popupContent = Type;

    // // Bind the popup to the polygon
    //   this.sector.bindPopup(popupContent);  

    // You can also optionally open the popup when the polygon is clicked


    //   this.polygon.on('click',  ()=> {
    //     this.polygon.openPopup();
    // });
    //console.log('object>>>>>>', object);
    //console.log('sinfo2>>>>>>', sinfo2)



    // if(this.isTcd==true){
    // this.sector.setStyle({
    //   fillOpacity: 0.3,
    // });
    let x = startAngle - 90 + 22.5;

    if (object.length == 0) {
      if (sinfo2.length > 0) {

        this.sector.Azimuth = x.toString();
        this.sector.lng = lng.toString();
        this.sector.lat = lat.toString();
        this.sector.Technology = '';

        this.sector.on('mousedown', async (e: any) => {
          //console.log('e>>>>>', e)

          // this.datacrowdService.getData().then((data:any) => {
          //   this.datajson = data;
          // });

          this.TcdRowData = [];
          this.CdrRowData2 = [];

          // this.datajson.markerPositions.forEach((element: any, key: any) => {
          //console.log('sinfo2 inn>>>>>>', sinfo2)
          //console.log('e.target.lat>>>>>>', e.target.lat);
          //console.log('e.target.lat>>>>>>', typeof e.target.lat);
          //console.log('sinfo2  lat inn>>>>>>', typeof sinfo2[0][3])



          let findedSectors: any = sinfo2.filter((element: any) => {
            //console.log('element', element);

            return element[1] === e.target.Azimuth && element[3] === e.target.lat && element[2] === e.target.lng
          });
          //console.log('findedSectors when right click', findedSectors)

          findedSectors.forEach((info: any, key: any) => {
            var Cdrjsonaggrid =
            {
             // Type: object.TYPE,
              Location: info[5],
              BtsName: info[9],
             Sector: info[1],
             Technology: info[10],
              Frequency: info[6],
              Lng: info[2],
              Lat: info[3],
              Azimuth: info[1]
            };
            var Cdrjsonaggrid2 =
            {
              //Type: object.TYPE,
              Location: info[5],
              BtsName: info[9],
             // Sector: info[1],
             // Technology: info[10],
              //Frequency: info[6],
              //Lng: info[2],
              //Lat: info[3],
              //Azimuth: info[1]
              Coord:info[3]+','+info[2]
            };
            this.CdrRowData.push(Cdrjsonaggrid);
            this.CdrRowData2.push(Cdrjsonaggrid2);

          });


          const componentfactory =
            this.componentFactoryResolver.resolveComponentFactory(
              VAgGridComponent
            );
          const componentref =
            this.viewContainerRef.createComponent(componentfactory);
          componentref.instance.rowData = this.CdrRowData2;
          componentref.instance.columnDefs = this.columnDefsCdr2;
          componentref.instance.headerHeight = 20;
          // componentref.instance.selectdevices = true;
          componentref.instance.Title = "Here On";
          componentref.instance.distinct = true;
          componentref.changeDetectorRef.detectChanges();
          componentref.instance.pagination = false;
          componentref.instance.rowGrouping = true;
          componentref.instance.contextmenu = false;
          //here
          componentref.instance.Grid2Type = 'opentcd';

          const html1 = componentref.location.nativeElement;
          await html1;

          this.map.openPopup(html1, [e.latlng.lat, e.latlng.lng]);
          $('.ag-theme-balham').css('height', ' 250px ');

        });

      } else {
        this.sector.Azimuth = '';
        this.sector.lng = "";
        this.sector.lat = ""
        this.sector.Technology = ""
      }

    } else {


      // this.sector.Time=object[0][3];
      this.sector.Azimuth = x.toString();
      this.sector.lng = lng.toString();
      this.sector.lat = lat.toString();
      this.sector.Technology = object[0][10]
      this.sector.off("click");
      this.sector.on('mousedown', async (e: any) => {
        //console.log('e>>>>>', e)

        // this.datacrowdService.getData().then((data:any) => {
        //   this.datajson = data;
        // });
        //console.log('object>>>>>>', object)

        this.TcdRowData = [];

        // this.datajson.markerPositions.forEach((element: any, key: any) => {

        let findedSectors: any = object.filter((element: any) => {
          return element[7] === e.target.Azimuth && element[4] === e.target.lat && element[5] === e.target.lng
        });
        //console.log('findedSectors when right click', findedSectors)

        findedSectors.forEach((element: any, key: any) => {
          var jsonaggrid =
          {
            imsi_id: element[0],
            imei_id: element[1],
            service_provider_id: element[2],
            usage_timeframe: this.dateTtoDate(element[3]),
            location_latitude: element[4],
            location_longitude: element[5],
            cgi_id: element[6],
            location_azimuth: element[7],
            type_id: element[8],
            phone_number: element[9],
            Technology: element[10]
          }

          this.TcdRowData.push(jsonaggrid);

        });


        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            VAgGridComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        componentref.instance.rowData = this.TcdRowData;
        componentref.instance.columnDefs = this.columnDefsTcd;
        componentref.instance.headerHeight = 20;
        // componentref.instance.selectdevices = true;
        componentref.instance.Title = "Here On";
        componentref.instance.distinct = true;
        componentref.changeDetectorRef.detectChanges();
        componentref.instance.pagination = false;
        componentref.instance.rowGrouping = true;
        componentref.instance.contextmenu = false;
        //here
        componentref.instance.Grid2Type = 'opentcd';
        componentref.instance.GridID = 'tcdGrid1';

        const html1 = componentref.location.nativeElement;
        await html1;

        this.map.openPopup(html1, [e.latlng.lat, e.latlng.lng]);
        $('.ag-theme-balham').css('height', ' 250px ');

      });
    }

    // }


    this.sectorarray.push(this.sector);
    //console.log('sectorarray', this.sectorarray)
    this.layerGroup.addLayer(this.sector);
    this.drawnItems.addLayer(this.sector);
    this.sectorCluster.addLayer(this.sector);

    this.sectorId++;
  }



  // calculateCircleBoundaries(center: { lat: number, lng: number }, radius: number): any[] {
  //   const numPoints = 360; // Number of points on the circle
  //   const circleBoundaries = [];
  
  //   for (let i = 0; i < numPoints; i++) {
  //     const angle = (i / numPoints) * 2 * Math.PI;
  //     const x = center.lng + radius * Math.cos(angle);
  //     const y = center.lat + radius * Math.sin(angle);
  
  //     circleBoundaries.push({ lat: y, lng: x });
  //   }
  
  //   return circleBoundaries;
  // }

  calculateCircleBoundaries(center: any, radius: number, interval: number) {
    let points:any[] = [];
    for(let i = 0; i < 360; i += interval) {
        let radian = i * (Math.PI / 180); // Convert degrees to radians
        points.push({
          lat: center.lat + radius * Math.cos(radian),
          lng: center.lng + radius * Math.cos(center.lat * (Math.PI/180)) * Math.sin(radian)
        });
    }
    return points;
}

customStyleFunction(feature:any) {
  // Implement your custom styling logic here
  return {
    fillColor: 'transparent',
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
}



convertCountryCode(inputArray:any){
 
    
  const groupedArray: any[] = [];
  
  inputArray.forEach((item:any) => {
      const matchIndex = groupedArray.findIndex(group => group[0] === item[0] && group[1] === item[1]);
  
      if (matchIndex !== -1) {
          groupedArray[matchIndex][2].push(item[2]);
      } else {
          if (Array.isArray(item[2])) {
              groupedArray.push([item[0], item[1], [...item[2]]]);
          } else {
              groupedArray.push([item[0], item[1], [item[2]]]);
          }
      }
  });
  
  //console.log("groupedArray>>",groupedArray);
  return groupedArray;
  }

  convertCountryCode2(inputArray: any) {
    const groupedArray: any[] = [];
  
    inputArray.forEach((item: any) => {
      const matchIndex = groupedArray.findIndex(
        (group) => group[0] === item[0] && group[1] === item[1]
      );
  
      if (matchIndex !== -1) {
        // Check if the third element is an array
        if (Array.isArray(item[2])) {
          groupedArray[matchIndex][2].push(...item[2]); // Use spread to add elements
        } else {
          groupedArray[matchIndex][2].push(item[2]); // Add the single element
        }
      } else {
        if (Array.isArray(item[2])) {
          groupedArray.push([item[0], item[1], [...item[2]]]);
        } else {
          groupedArray.push([item[0], item[1], [item[2]]]);
        }
      }
    });
  
    //console.log("groupedArray>>", groupedArray);
    return groupedArray;
  }




  determineIntersectingRegions(shape: any, geoJsonData: any,Type:any) {
    //console.log("Type",Type);
   let Center:any;
   let Radius:any;
   let turfshape:any; 
   //console.log("determineIntersectingRegions circle",shape)


    if (Type === 'polygon') {
      //console.log("Type polygon");
      
      // Assuming shape is your polygon geometry
      const polygonCoordinates = shape.getLatLngs()[0].map((latLng:any) => [latLng.lng, latLng.lat]);
       // Ensure the first and last coordinates are the same to close the polygon
      polygonCoordinates.push(polygonCoordinates[0]);
      //console.log("polygonCoordinates",polygonCoordinates);

      // Create a Turf.js polygon from Leaflet polygon coordinates
      const turfPolygon = turf.polygon([polygonCoordinates]);
      //console.log("turfPolygon",turfPolygon);
    
      const containingRegions: string[] = [];
    
      geoJsonData.features.forEach((feature: any) => {
        // Check if any point of the polygon is inside the feature
        const isInside2 = turf.booleanPointInPolygon(
          turf.point(polygonCoordinates[0]), // Assuming the first point of the polygon
          feature
        );
         const isInside = turf.booleanOverlap(
          feature,turfPolygon
        );
        // //console.log('Feature:', feature.properties.name, 'isInside:', isInside);

        if (isInside) {
          containingRegions.push(feature.properties.iso_a2_eh);
        }else{
          if (isInside2) {
            containingRegions.push(feature.properties.iso_a2_eh);
          }
        }
      });
    
      return containingRegions;
    }
    else if(Type==='rectangle'){
      //console.log("Type rectangle");

      //console.log("shape.getLatLngs()[0]",shape.getLatLngs()[0]);
      
      // Assuming shape is your polygon geometry
      const rectangleCoordinates = shape.getLatLngs()[0].map((latLng:any) => [latLng.lng, latLng.lat]);
       // Ensure the first and last coordinates are the same to close the polygon
       rectangleCoordinates.push(rectangleCoordinates[0]);
      //console.log("rectangleCoordinates",rectangleCoordinates);

      // Create a Turf.js polygon from Leaflet polygon coordinates
      const turfPolygon = turf.polygon([rectangleCoordinates]);
      //console.log("turfPolygon",turfPolygon);
    
      const containingRegions: string[] = [];
    
      geoJsonData.features.forEach((feature: any) => {
        // Check if any point of the polygon is inside the feature
        const isInside2 = turf.booleanPointInPolygon(
          turf.point(rectangleCoordinates[0]), // Assuming the first point of the polygon
          feature
        );
         const isInside = turf.booleanOverlap(
          feature,turfPolygon
        );
        //console.log('Feature:', feature.properties.name, 'isInside:', isInside);

        if (isInside) {
          containingRegions.push(feature.properties.iso_a2_eh);
        }else{
          if (isInside2) {
            containingRegions.push(feature.properties.iso_a2_eh);
          }
        }
      });
    
      return containingRegions;



    }else 
    if(Type==='circle'){
      //console.log("Type circle");
      Center = shape.getLatLng();
      //console.log("Center" ,Center);
      
      Radius = shape.getRadius(); // Radius in meters
       // Convert circle to a Turf.js circle
       turfshape = turf.circle([Center.lng, Center.lat], Radius / 1000, { units: 'kilometers' });

       const intersectingRegions:any = [];
  
       //console.log("geoJsonData ",geoJsonData);
       // Iterate through each feature in the GeoJSON data
       
       geoJsonData.features.forEach((feature: any) => {

         // Check if the circle intersects with the feature
        const doesIntersect = turf.booleanOverlap(turf.simplify(feature),turf.simplify(turfshape));
         //console.log('doesIntersect' ,doesIntersect)
     
         // //console.log('doesIntersect2', doesIntersect2);
         
     
         if (doesIntersect) {
           intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
          }else{
          const doesIntersect2 = turf.booleanPointInPolygon(
            turf.point([Center.lng, Center.lat]), // Create a Turf.js Point from circle center
            feature // Assuming the GeoJSON feature is a Polygon
          );
           if (doesIntersect2) {
             intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
           }
         }



        
       });
     
       return intersectingRegions;
    }

    else if(Type==='polyline'){
      
      // Assuming shape is your polygon geometry
      const rectangleCoordinates = shape.getLatLngs().map((latLng:any) => [latLng.lng, latLng.lat]);
       // Ensure the first and last coordinates are the same to close the polygon
       rectangleCoordinates.push(rectangleCoordinates[0]);
      //console.log("rectangleCoordinates",rectangleCoordinates);

      // Create a Turf.js polygon from Leaflet polygon coordinates
      const turfPolygon:any = turf.multiPoint([rectangleCoordinates]);
      //console.log("turfPolygon",turfPolygon);
    
      const containingRegions: string[] = [];
    
      geoJsonData.features.forEach((feature: any) => {

// Assuming 'feature' is your GeoJSON polygon feature
const isInsideArray = turfPolygon.coordinates.map((pointCoords:any) => {
  const turfPoint = turf.point(pointCoords);
  return turf.booleanPointInPolygon(turfPoint, feature);
});

      
      });
    
      return containingRegions;

    

    }

   
  }
  addTextIcons(polyline:any, text:any, options:any) {
    const latLngs = polyline.getLatLngs();
  
    for (let i = 0; i < latLngs.length; i++) {
      const icon = L.divIcon({
        className: 'text-icon',
        html: text,
        iconAnchor: [10, 10], // Adjust the anchor based on your text size
        ...options,
      });
  
      L.marker(latLngs[i], { icon }).addTo(this.map);
    }
  }




   mergeArrays(arr1: any[], arr2: any[]) {
    const mergedArray: any[] = [];
  
    // Helper function to find an array in the mergedArray based on first and second elements
    const findArrayIndex = (arr: any[]): number => {
      return mergedArray.findIndex(item => item[0] === arr[0] && item[1] === arr[1]);
    };
  
    // Merge the arrays
    arr1.forEach(item => {
      const index = findArrayIndex(item);
      if (index !== -1) {
        // Array already exists, merge the third elements
        mergedArray[index][2] = mergedArray[index][2].concat(item[2]);
      } else {
        // Array doesn't exist, add it to the mergedArray
        mergedArray.push(item);
      }
    });
  
    arr2.forEach(item => {
      const index = findArrayIndex(item[0]);
      if (index !== -1) {
        // Array already exists, merge the third elements
        mergedArray[index][2] = mergedArray[index][2].concat(item[0][2]);
      } else {
        // Array doesn't exist, add it to the mergedArray
        mergedArray.push(item[0]);
      }
    });
  
    return mergedArray;
  //   const result = [...arr1, ...arr2].reduce((acc, curr) => {
  //     const key = curr[0] + '-' + curr[1];
  //     const found = acc.find((a:any) => a[0] + '-' + a[1] === key);
  //     if (found) {
  //         found[2].push(...curr[2]);
  //     } else {
  //         acc.push(curr);
  //     }
  //     return acc;
  // }, []);
  
  // //console.log(result);
  // return result;
  }
  devaddgroup(){
   
    this.devicesArray= this.dataService.getDHselectedDevice();
  //console.log('opengrp==================',this.devicesArray);

}

openaddgrpscreen(){
  //console.log("devicesArray1111111111111111111111",this.devicesArray);

      this.devicesArray= [...new Set(this.devicesArray)];

      this.devaddgrparray=[];
      this.hitsaddgrpnb=[];
  //console.log("devicesArray=============",this.devicesArray);
  this.devicesArray.forEach((elt:any)=>{
    //console.log("deviceid-----------",elt.key);
    //console.log("deviceid-----------",elt.allChildrenCount);
    this.devaddgrparray.push(elt.key);
    this.hitsaddgrpnb.push(elt.allChildrenCount);
  });

  // let selectedarray=localStorage.getItem('selectedarray');
  // //console.log("selectedarray-----------",  selectedarray); 
  //console.log("devaddgrparray2222222222-----------",  this.devaddgrparray);
  //console.log("hitsaddgrpnb2222222222-----------",  this.hitsaddgrpnb);
  (window.parent.parent.parent[7] as any).doAddGrouping(this.devaddgrparray,this.hitsaddgrpnb);
}

changebar(){
 if(this.isRunning==false){

 }else {
  this.stopTimeline();
  if(this.showbarreverse==true && this.showbarstart==false){
   
    this.ReverseTimeline();
  }else if(this.showbarstart==true && this.showbarreverse==false){
   
    this.startTimeline();
  }
 }

}
async displaysector(): Promise<void>{
 
           
     let x:any=[];
    
            

  this.markerClusterGroup = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom: true,
    animate: true,
    singleMarkerMode: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 50, 
  });
        this.fixedMarkersGroup = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          animate: true,
          singleMarkerMode: false,
          zoomToBoundsOnClick: false,
          maxClusterRadius: 50, // Adjust this value as needed
          iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers();
            var html = '<div  class="elementGroup" >' + markers.length + '</div>';

            return L.divIcon({
              html: html,
              className: 'mycluster',
              iconSize: L.point(32, 32)
            });
          },
        });
        for (let i = 0; i < x.length; i++) {
          //this.displayFixedElements(x[i])
          this.displayBTS(x[i].BTS);
        let count=0;
          for (let j = 0; j < x[i].SECTORS.length; j++) {
            count =j;

           this.drawarc(Number(x[i].BTS.LATITUDE), Number(x[i].BTS.LONGITUDE), this.SectorMeter, 90 + Number(x[i].SECTORS[j]) - 22.5, 90 + Number(x[i].SECTORS[j]) + 22.5, this.SectorColor, '', x[i].INFO);
                if ((i) % 100=== 0){
  
    const simplifiedFeatures = this.simplifyGeoJSON(this.Sectorfeatures);
          this.addFeaturesToCluster(simplifiedFeatures);
                    await this.delay1(500);
              }
          }
        }
         //console.log("Sectorfeatures",this.Sectorfeatures)
        try{
         
          
        }catch(error){
          //console.error("Error creating polygon:", error);
        }



  }

    delay1(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  drawarc(lat: any, lng: any, Radius: any, StartAngle: any, StopAngle: any, AngleColor: any, object: any, sinfo2: any) {
 
    const center = [lat, lng]; // Replace with your center coordinates
    const radius = Radius / 1000; // Radius in meters
    const startAngle = StartAngle; // Start angle in degrees
    const stopAngle = StopAngle; // Stop angle in degrees

    const sectorOptions = {
      center: center,
      radius: radius,
      startAngle: startAngle,
      stopAngle: stopAngle,
      color: AngleColor,
      fillColor: this.SectorFillColor,
      fillOpacity: 0.1,
    };
    //console.log("objecttttttt-----------",object);
    
    this.sector = L.polygon(this.getSectorCoordinates(center, radius, startAngle, stopAngle), sectorOptions);
    
    console.log("sector===",this.sector);

    this.sectorLoop = L.polygon(this.getSectorCoordinates(center, radius, startAngle, stopAngle), sectorOptions);
    console.log("sectorLoop===",this.sectorLoop);

    this.sector.sectorId = this.sectorId;


        const geoJSONFeature =  this.sector.toGeoJSON();
        const geoJSONFeatureLoop =  this.sectorLoop.toGeoJSON();
        console.log("geoJSONFeatureLoop===",geoJSONFeatureLoop);

      
     this.Sectorfeatures.push(geoJSONFeature);

     this.SectorfeaturesLoop.push(geoJSONFeatureLoop);
   
    let x = startAngle - 90 + 22.5;

    if (object.length == 0) {
      if (sinfo2.length > 0) {
    
        this.sector.Azimuth = x.toString();
        this.sector.lng = lng.toString();
        this.sector.lat = lat.toString();
        this.sector.Technology = '';
        this.sector.off("click");
        this.sector.on('mousedown', async (e: any) => {
          //console.log('e>>>>>', e)

          // this.datacrowdService.getData().then((data:any) => {
          //   this.datajson = data;
          // });

          this.TcdRowData = [];
          this.CdrRowData2 = [];
          this.CdrRowData = [];
          // this.datajson.markerPositions.forEach((element: any, key: any) => {
          //console.log('sinfo2 inn>>>>>>', sinfo2)
          //console.log('e.target.lat>>>>>>', e.target.lat);
          //console.log('e.target.lat>>>>>>', typeof e.target.lat);
          //console.log('sinfo2  lat inn>>>>>>', typeof sinfo2[0][3])



          let findedSectors: any = sinfo2.filter((element: any) => {
            //console.log('element', element);

            return element[1] === e.target.Azimuth && element[3] === e.target.lat && element[2] === e.target.lng
          });
          //console.log('findedSectors when right click', findedSectors)

          findedSectors.forEach((info: any, key: any) => {
            var Cdrjsonaggrid =
            {
              //Type: object.TYPE,
              Location: info[5],
              BtsName: info[9],
             Sector: info[1],
             Technology: info[10],
              Frequency: info[6],
              Lng: info[2],
              Lat: info[3],
              Azimuth: info[1]
            };
            var Cdrjsonaggrid2 =
            {
              //Type: object.TYPE,
              Location: info[5],
              BtsName: info[9],
             // Sector: info[1],
             // Technology: info[10],
              //Frequency: info[6],
              //Lng: info[2],
              //Lat: info[3],
              //Azimuth: info[1]
              Coord:info[3]+','+info[2]
            };
            this.CdrRowData.push(Cdrjsonaggrid);
            this.CdrRowData2.push(Cdrjsonaggrid2);



          });


          const componentfactory =
            this.componentFactoryResolver.resolveComponentFactory(
              VAgGridComponent
            );
            const componentref =
            this.viewContainerRef.createComponent(componentfactory);
          componentref.instance.rowData = this.CdrRowData;
          componentref.instance.columnDefs = this.columnDefsCdr;
          componentref.instance.headerHeight = 20;
          // componentref.instance.selectdevices = true;
       
          componentref.instance.distinct = true;
          componentref.changeDetectorRef.detectChanges();
          componentref.instance.pagination = false;
          componentref.instance.rowGrouping = true;
          componentref.instance.contextmenu = false;
          componentref.instance.Grid2Type = 'opencdr';
          componentref.instance.GridID = 'tcdGrid2';
          const html1 = componentref.location.nativeElement;
          await html1;

          this.map.openPopup(html1, [e.latlng.lat, e.latlng.lng]);
          $('.ag-theme-balham').css('height', ' 250px ');

 

        });

      } else {
        this.sector.Azimuth = '';
        this.sector.lng = "";
        this.sector.lat = ""
        this.sector.Technology = ""
      }

    } else {

      // this.sector.Time=object[0][3];
      this.sector.Azimuth = x.toString();
      this.sector.lng = lng.toString();
      this.sector.lat = lat.toString();
      this.sector.Technology = object[0][10]
      // this.sector.Technology =this.technologyarray;
      this.sector.Object=object;
      //console.log("sectoe11111------------",this.sector);
      this.sector.off("click");
      this.sector.on('mousedown', async (e: any) => {
        //console.log('e>>>>>', e)

        // this.datacrowdService.getData().then((data:any) => {
        //   this.datajson = data;
        // });
        //console.log('object>>>>>>', object)

        this.TcdRowData = [];

        // this.datajson.markerPositions.forEach((element: any, key: any) => {

        let findedSectors: any = object.filter((element: any) => {
          return element[7] === e.target.Azimuth && element[4] === e.target.lat && element[5] === e.target.lng
        });
        //console.log('findedSectors when right click', findedSectors)

        findedSectors.forEach((element: any, key: any) => {
          var jsonaggrid =
          {
            imsi_id: element[0],
            imei_id: element[1],
            service_provider_id: element[2],
            usage_timeframe: element[3],
            location_latitude: element[4],
            location_longitude: element[5],
            cgi_id: element[6],
            location_azimuth: element[7],
            type_id: element[8],
            phone_number: element[9],
            Technology: element[10]
          }

          this.TcdRowData.push(jsonaggrid);

        });


        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            VAgGridComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        componentref.instance.rowData = this.TcdRowData;
        componentref.instance.columnDefs = this.columnDefsTcd;
        componentref.instance.headerHeight = 20;
        // componentref.instance.selectdevices = true;
        componentref.instance.Title = "Here On";
        componentref.instance.distinct = true;
        componentref.changeDetectorRef.detectChanges();
        componentref.instance.pagination = false;
        componentref.instance.rowGrouping = true;
        componentref.instance.contextmenu = false;
        //here
        componentref.instance.Grid2Type = 'opentcd';
        componentref.instance.GridID = 'tcdGrid1';

        const html1 = componentref.location.nativeElement;
        await html1;

        this.map.openPopup(html1, [e.latlng.lat, e.latlng.lng]);
        $('.ag-theme-balham').css('height', ' 250px ');

      });
    }

    // }


    this.sectorarray.push(this.sector);
    this.sectorarrayLoop.push(this.sectorLoop);
    
    this.layerGroup.addLayer(this.sector);
    this.layerGroupLoop.addLayer(this.sectorLoop);
    console.log("layerGroup===",this.layerGroup);
    console.log("this.layerGroupLoop===",this.layerGroupLoop);

    this.drawnItems.addLayer(this.sector);
    this.drawnItemsLoop.addLayer(this.sectorLoop);
    this.magnifiedMap.addLayer(this.layerGroupLoop);

    this.sectorId++;
  }

  

  addRandomPolygons(): void {
 
     let count:any=20000;
    const randomFeatures = this.generateRandomFeatures(count);
    const simplifiedFeatures = this.simplifyGeoJSON(randomFeatures);
    this.addFeaturesToCluster(simplifiedFeatures);
  }

   generateRandomFeatures(count:any) {
    const features = [];
    for (let i = 0; i < count; i++) {
      //console.log('i',i)
      const randomLat = this.getRandomCoordinate(-90, 90);
      const randomLng = this.getRandomCoordinate(-180, 180);
      const center= this.getRandomCoordinate(-90, 90);
      const radius = this.getRandomCoordinate(-90, 90)
      const startAngle = this.getRandomCoordinate(-90, 90) // in radians
      const stopAngle = this.getRandomCoordinate(-90, 90) // Full circle
      const sectorOptions = {
        center: center,
        radius: radius,
        startAngle: startAngle,
        stopAngle: stopAngle,
        // color: 'red',
        // fillColor: "red",
        fillOpacity: 0.1
  
      };      // Create a random polygon using Leaflet's polygon method
      const polygon = L.polygon(this.generateRandomPolygon([randomLat, randomLng], 0.1));
      // const polygon = L.polygon(this.getSectorCoordinatesrandomly([randomLat,randomLng], radius, startAngle, stopAngle), sectorOptions);

      // Convert the Leaflet polygon to GeoJSON
      const geoJSONFeature = polygon.toGeoJSON();

      features.push(geoJSONFeature);
    }
    return features;
  }


   getSectorCoordinatesrandomly(center: any, radius: number, startAngle: number, stopAngle: number): L.LatLngExpression[] {
    const numPoints = 20; // Adjust the number of points as needed
    const angleIncrement = (stopAngle - startAngle) / numPoints;
  
    const sectorCoordinates: L.LatLngExpression[] = [];
    for (let i = 0; i <= numPoints; i++) {
      const angle = startAngle + i * angleIncrement;
      const x = center.lat + radius * Math.cos(angle);
      const y = center.lng + radius * Math.sin(angle);
  
      sectorCoordinates.push([x, y]);
    }
  
    return sectorCoordinates;
  }
  

   getRandomCoordinate(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private generateRandomPolygon(center: number[], radius: number): L.LatLngExpression[] {
    const numPoints = 6 + Math.floor(Math.random() * 10); // Random number of points
    const angleIncrement = (2 * Math.PI) / numPoints;
  
    const polygon: L.LatLngExpression[] = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleIncrement;
      const x = center[0] + radius * Math.cos(angle);
      const y = center[1] + radius * Math.sin(angle);
      polygon.push([x, y] as L.LatLngExpression);
    }
  
    // Close the polygon by adding the first point again
    polygon.push(polygon[0]);
    return polygon;
  }



   simplifyGeoJSON(features: any[]): any[] {
    // Simplify GeoJSON features
    //console.log("features<><>",features)
    const simplifiedFeatures = features.map(feature => {
      //console.log("feature--------",feature);
      const simplifiedGeometry = turf.simplify(feature.geometry, { tolerance: 0.01, highQuality: false });
     //console.log("simplifiedGeometry--------",simplifiedGeometry);
      
      return { ...feature, geometry: simplifiedGeometry };
    });
    //console.log("simplifiedFeatures--------",simplifiedFeatures);
    return simplifiedFeatures;
  }

   addFeaturesToCluster(features: any[]): void {
    // Add simplified features to the marker cluster
    const markers = L.markerClusterGroup();
    features.forEach(feature => {
      const marker = L.geoJSON(feature);
      markers.addLayer(marker);
    });
    //console.log("markers------------",markers);
    this.map.addLayer(markers);
  }



  displayAllCoTraveler(){
  this.dialog.closeAll();
   this.DisplayCoTravelerflag = 1;
   this.displayCoTravelers();
   this.loaderService.hide();

  }

  displayAllCoRelation(){
    this.dialog.closeAll();
    this.DisplayCoRelationflag=1;
    this.displayCoRelation();
   }

   findCoTraveler() {
    (window.parent.parent.parent[8] as any).closepopup();
    this.coTravelerId = (window.parent.parent.parent[7] as any).A_reportId;
    if (this.coTravelerId == "null") {
      this.coTravelerId = "";
    }
    this.beginOperation = (window.parent.parent.parent[7] as any).A_beginOperation;
    if (this.beginOperation == "null") {
      this.beginOperation = "";
    }

    this.endOperation = (window.parent.parent.parent[7] as any).A_endOperation;
    if (this.endOperation == "null") {
      this.endOperation = "";
    }

    this.deviceIdArr = (window.parent.parent.parent[7] as any).A_deviceIdArr;
    if (this.deviceIdArr == "null") {
      this.deviceIdArr = "";
    }
    const body = { "beginOperation": this.beginOperation, "endOperation": this.endOperation, "deviceIdArr": this.deviceIdArr, "reportId": this.coTravelerId };
    let response = this.executeCoTraveler(body);

  }
  executeCoTraveler(obj: any) {
    try {
      this.notification('info','Processing Co-Traveler ');
     this.datacrowdService.executeCoTraveler(obj);
      this.loaderService.hide();
      this.counter = 0;
      this.checkCoTravelerCounter = 0;
      this.coTravelerSubscription = interval(1000).pipe(
        switchMap(() => this.datacrowdService.checkTableCoTravelers(this.coTravelerId, this.checkCoTravelerCounter))
      )
        .subscribe(data => {
          this.checkCoTravelerCounter++;
          this.loaderService.hide();
          if (data != 0) {
            this.coTravelerSubscription.unsubscribe();
           this.notification('success', 'CO Travelers are ready');
            const dialogRef = this.dialog.open(this.CoTravelersReady);

          }
        });


    } catch (error: any) {
      this.notification('error', 'CO Travelers Failure');
      //console.log("failure exception", error);
      //console.log("Fail - Please contact valoores team");
    }
  }

  async displayCoTravelers() {
    this.deviceIdArr = (window.parent.parent.parent[7] as any).A_deviceIdArr;
    if (this.deviceIdArr == "null") {
      this.deviceIdArr = "";
    }
    this.coTravelerId = (window.parent.parent.parent[7] as any).A_reportId;
    if (this.coTravelerId == "null") {
      this.coTravelerId = "";
    }
    if(this.DisplayCoTravelerflag == 1){
      this.deviceCoordinatesArr = await this.datacrowdService.getAllCoTravelerCommonLocationHits(this.coTravelerId);
    }else if(this.DisplayCoTravelerflag == 2){
      this.coTravelerId = this.dataService.getTimelineSimulID(); 
     this.deviceIdArr = this.dataService.getDeviceCommonLocationHits();
     //static
    //  this.deviceIdArr ="1";
    //  this.coTravelerId="727";
      this.deviceCoordinatesArr = await this.datacrowdService.getCommonLocationHits(this.coTravelerId,this.deviceIdArr);
    }else{
    this.deviceCoordinatesArr =await this.datacrowdService.getCoTravelerCommonLocationHits(this.coTravelerId,this.deviceIdArr);
    }
    const body = { "deviceIdArr": this.deviceIdArr, "deviceCoordinatesArr": this.deviceCoordinatesArr };
    this.cotravelermarker = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      animate: true,
      singleMarkerMode: false,
      zoomToBoundsOnClick: false,
      iconCreateFunction: function (cluster) {
        var markers = cluster.getAllChildMarkers();
        var html = '<div  class="groupOfPerson"></div>';
        return L.icon({
          iconUrl: '/cybercrowd/angular/assets/img/group.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
      },
    });
    //console.log('length', this.deviceCoordinatesArr.length);

    try {
      //console.log("typeof this.deviceCoordinatesArr",typeof this.deviceCoordinatesArr)
      //console.log("this.deviceCoordinatesArr",this.deviceCoordinatesArr)

      if (typeof this.deviceCoordinatesArr === 'string') {
        this.deviceCoordinatesArr = JSON.parse(this.deviceCoordinatesArr);
        //console.log('deviceCoordinatesArr:', this.deviceCoordinatesArr);


        for (var j = 0; j < 1; j++) {
          for (var i = 0; i < this.deviceCoordinatesArr.length; i++) {
            this.comarkers = L.marker([
              Number(this.deviceCoordinatesArr[i][0]),
              Number(this.deviceCoordinatesArr[i][1]),
            ], {
              icon: this.singlepersonicon,
            });

            this.comarkers.off("click");
            this.comarkers.on("mousedown", (e: any) => {
              if (e.originalEvent.buttons == 2) {
                e.target.openPopup();
              }
              if (e.originalEvent.buttons == 1) {
              }
            });
          }
          this.rowData = [];
          this.deviceCoordinatesArr.forEach((element: any, key: any) => {
            //console.log('element>>>>', element)
            this.comarkers = this.binddataCotravelers(
              element[0],
              element[1],
              element[2],
              element[3],
              element[4],
              element[5],
              ""
            );
            this.comarkers.lat = element[0];
            this.comarkers.lng = element[1];
            this.comarkers.timestamp = element[3];
            this.comarkers.tel = element[2];
            this.comarkers.name = element[4];
            this.comarkers.off("click");
            this.comarkers.on("mousedown", async (e: any) => {
              if (e.originalEvent.buttons == 2) {
                //console.log("markerChildrensssssss", e.target)
                this.rowData = [];
                var jsonaggrid = {
                  Device_id: e.target.tel,
                  Tel: e.target.name,
                  Date: e.target.timestamp,
                  Hits: "1",
                  Coord: e.target.lat + ',' + e.target.lng,

                };
                this.rowData.push(jsonaggrid);

                const componentfactory =
                  this.componentFactoryResolver.resolveComponentFactory(
                    VAgGridComponent
                  );
                const componentref =
                  this.viewContainerRef.createComponent(componentfactory);
                componentref.instance.rowData = this.rowData;
                componentref.instance.columnDefs = this.columnDefs;
                componentref.instance.headerHeight = 0;
                componentref.instance.Title = "Here On";
                componentref.instance.distinct = true;
                componentref.changeDetectorRef.detectChanges();
                const html2 = componentref.location.nativeElement;
                componentref.instance.Grid2Type = 'btn-54';

                await html2;
                this.map.openPopup(html2, e.target._latlng);
                $('.ag-theme-balham').css('height', ' 250px');


              } else if (e.originalEvent.buttons == 1) {

              }

            });
            this.comarkersArray.push(this.comarkers);
            this.cotravelermarker.addLayer(this.comarkers);
            $('#controlbutton').css('display', '');

          })

        };

        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        const html1 = (componentref.location.nativeElement.style.display = "none");
        componentref.instance.columnDefs = this.columnDefs;
        componentref.changeDetectorRef.detectChanges();
        this.marker.off("click");
        this.marker.on("clustermousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            var markerChildrens = e.layer.getAllChildMarkers();

            //console.log("markerChildrens>>><<<", markerChildrens)
            //console.log('rowdata before1>>>>>>', this.rowData)

            this.rowData = [];
            //console.log('rowdata before2>>>>>>', this.rowData)

            for (var j = 0; j < markerChildrens.length; j++) {
              var jsonaggrid = {
                Device_id: markerChildrens[j].tel,
                Tel: markerChildrens[j].name,
                Date: markerChildrens[j].timestamp,
                Hits: "1",
                Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,

              };
              //console.log('rowdata jsonaggrid>>>>', jsonaggrid)
              this.rowData.push(jsonaggrid);
            }
            //console.log('rowdata after>>>>>>', this.rowData)
            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            // componentref.instance.selectdevices = true;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.pagination = false;
            componentref.instance.rowGrouping = true;
            componentref.instance.contextmenu = false;


            const html1 = componentref.location.nativeElement;
            await html1;
            $('.ag-theme-balham').css('height', ' 250px');

            this.map.openPopup(html1, e.layer.getLatLng());
          }
        });


      } else {
        this.deviceCoordinatesArr.forEach((element: any, key: any) => {
            //console.log('element2::::::',element);
            this.comarkers = L.marker([
              element[0],
              element[1],
            ], {
              icon: this.singlepersonicon,
            });

            this.comarkers.off("click");
            this.comarkers.on("mousedown", (e: any) => {
              if (e.originalEvent.buttons == 2) {
                e.target.openPopup();
              }
              if (e.originalEvent.buttons == 1) {
              }

            });

            this.comarkers = this.binddataCotravelers(
              element[0],
              element[1],
              element[2],
              element[3],
              element[4],
              element[5],
              ""
            );
            this.comarkers.lat = element[0];
            this.comarkers.lng = element[1];
            this.comarkers.timestamp = element[3];
            this.comarkers.tel = element[2];
            this.comarkers.name = element[4];
            this.comarkers.off("click");
            this.comarkers.on("mousedown", async (e: any) => {
              if (e.originalEvent.buttons == 2) {
                //console.log("markerChildrensssssss", e.target)
                this.rowData = [];
                var jsonaggrid = {
                  Device_id: e.target.tel,
                  Tel: e.target.name,
                  Date: e.target.timestamp,
                  Hits: "1",
                  Coord: e.target.lat + ',' + e.target.lng,

                };
                this.rowData.push(jsonaggrid);

                const componentfactory =
                  this.componentFactoryResolver.resolveComponentFactory(
                    VAgGridComponent
                  );
                const componentref =
                  this.viewContainerRef.createComponent(componentfactory);
                componentref.instance.rowData = this.rowData;
                componentref.instance.columnDefs = this.columnDefs;
                componentref.instance.headerHeight = 0;
                // componentref.instance.selectdevices = true;
                componentref.instance.Title = "Here On";
                componentref.instance.distinct = true;
                componentref.changeDetectorRef.detectChanges();
                const html2 = componentref.location.nativeElement;
                componentref.instance.Grid2Type = 'btn-54';

                await html2;

                $('.ag-theme-balham').css('height', ' 250px ');

                this.map.openPopup(html2, e.target._latlng);

              } else if (e.originalEvent.buttons == 1) {

              }

            });

            this.comarkersArray.push(this.comarkers);
            this.cotravelermarker.addLayer(this.comarkers);
        });

        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        const html1 = (componentref.location.nativeElement.style.display = "none");
        componentref.instance.columnDefs = this.columnDefs;
        componentref.changeDetectorRef.detectChanges();
        this.marker.off("click");
        this.marker.on("clustermousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            var markerChildrens = e.layer.getAllChildMarkers();

            //console.log("markerChildrens>>><<<", markerChildrens)
            //console.log('rowdata before1>>>>>>', this.rowData)

            this.rowData = [];
            //console.log('rowdata before2>>>>>>', this.rowData)

            for (var j = 0; j < markerChildrens.length; j++) {
              var jsonaggrid = {
                Device_id: markerChildrens[j].tel,
                Tel: markerChildrens[j].name,
                Date: markerChildrens[j].timestamp,
                Hits: "1",
                Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,

              };
              //console.log('rowdata jsonaggrid>>>>', jsonaggrid)
              this.rowData.push(jsonaggrid);
            }
            //console.log('rowdata after>>>>>>', this.rowData)
            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.pagination = false;
            componentref.instance.rowGrouping = true;
            componentref.instance.contextmenu = false;


            const html1 = componentref.location.nativeElement;
            await html1;

            $('.ag-theme-balham').css('height', ' 250px');
            this.map.openPopup(html1, e.layer.getLatLng());
          }
        });

      }

    } catch (error) {
      //console.error('Error parsing JSON:', error);
    }

    const componentfactory =
      this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
    const componentref =
      this.viewContainerRef.createComponent(componentfactory);
    const html1 = (componentref.location.nativeElement.style.display = "none");
    componentref.instance.columnDefs = this.columnDefs;
    componentref.changeDetectorRef.detectChanges();

    this.cotravelermarker.off("click");
    this.cotravelermarker.on("clustermousedown", async (e: any) => {


      if (e.originalEvent.buttons == 2) {
        var markerChildrens = e.layer.getAllChildMarkers();

        //console.log("markerChildrens>>><<<", markerChildrens)
        //console.log('rowdata before1>>>>>>', this.rowData)

        this.rowData = [];
        //console.log('rowdata before2>>>>>>', this.rowData)

        for (var j = 0; j < markerChildrens.length; j++) {
          var jsonaggrid = {
            Device_id: markerChildrens[j].tel,
            Tel: markerChildrens[j].name,
            Date: markerChildrens[j].timestamp,
            Hits: "1",
            Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,

          };
          //console.log('rowdata jsonaggrid>>>>', jsonaggrid)
          this.rowData.push(jsonaggrid);
        }
        //console.log('rowdata after>>>>>>', this.rowData)
        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            VAgGridComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        componentref.instance.rowData = this.rowData;
        componentref.instance.columnDefs = this.columnDefs;
        componentref.instance.headerHeight = 0;
        componentref.instance.Title = "Here On";
        componentref.instance.distinct = true;
        componentref.changeDetectorRef.detectChanges();
        componentref.instance.pagination = false;
        componentref.instance.rowGrouping = true;
        componentref.instance.contextmenu = false;
        componentref.instance.Grid2Type = 'btn-54';

        const html1 = componentref.location.nativeElement;
        await html1;

        this.map.openPopup(html1, e.layer.getLatLng());
      }


    });

    this.map.addLayer(this.cotravelermarker);
  }


  findCoRelation() {
    (window.parent.parent.parent[8] as any).closepopup();
    this.coRelationId = (window.parent.parent.parent[7] as any).A_reportId;
    if (this.reportId == "null") {
      this.reportId = "";
    }
    this.beginOperation = (window.parent.parent.parent[7] as any).A_beginOperation;
    if (this.beginOperation == "null") {
      this.beginOperation = "";
    }
    this.endOperation = (window.parent.parent.parent[7] as any).A_endOperation;
    if (this.endOperation == "null") {
      this.endOperation = "";
    }
    this.deviceIdArr = (window.parent.parent.parent[7] as any).A_deviceIdArr;
    if (this.deviceIdArr == "null") {
      this.deviceIdArr = "";
    }
    const body = { "beginOperation": this.beginOperation, "endOperation": this.endOperation, "deviceIdArr": this.deviceIdArr, "reportId": this.coRelationId };
    let response = this.executeCoRelation(body);

  }
  executeCoRelation(obj: any) {
    try {
      this.notification('info','Processing Co-Relation');
     this.datacrowdService.executeCoRelation(obj);
      this.loaderService.hide();
      this.counter = 0;
      this.checkCoRelationCounter = 0;
      this.coRelationSubscription = interval(1000).pipe(
        switchMap(() => this.datacrowdService.checkTableCoRelations(this.coRelationId, this.checkCoRelationCounter))
      )
        .subscribe(data => {
          this.checkCoTravelerCounter++;
          this.loaderService.hide();
          if (data != 0) {
            this.coRelationSubscription.unsubscribe();
            this.notification('success', 'CO Relation are ready');
            const dialogRef = this.dialog.open(this.CoRelationsReady);

          }
        });


    } catch (error: any) {
      this.notification('error', 'CO Relations Failure');
      //console.log("failure exception", error);
      //console.log("Fail - Please contact valoores team");
    }
  }



  async displayCoRelation() {

    this.deviceIdArr = (window.parent.parent.parent[7] as any).A_deviceIdArr;
    if (this.deviceIdArr == "null") {
      this.deviceIdArr = "";
    }
    this.coRelationId = (window.parent.parent.parent[7] as any).A_reportId;
    if (this.coRelationId == "null") {
      this.coRelationId = "";
    }
    if(this.DisplayCoRelationflag == 1){
      this.deviceCoordinatesArr = await this.datacrowdService.getAllCoRelationCommonLocationHits(this.coRelationId);
    }else{
    this.deviceCoordinatesArr =await this.datacrowdService.getCoRelationCommonLocationHits(this.coRelationId,this.deviceIdArr);
    }

  

    this.datajson.markerPositions=this.deviceCoordinatesArr;
    if (this.datajson.markerPositions !== null) {
      this.marker = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        animate: true,
        singleMarkerMode: true,
      });

      for (var j = 0; j < 1; j++) {
        for (var i = 0; i < this.datajson.markerPositions.length; i++) {
          this.myMarker = L.marker([
            Number(this.datajson.markerPositions[i][0]),
            Number(this.datajson.markerPositions[i][1]),
          ]);
          this.myMarker.off("click");
          this.myMarker.on("mousedown", (e: any) => {
            if (e.originalEvent.buttons == 2) {
              e.target.openPopup();
            }
            if (e.originalEvent.buttons == 1) {
            }

          });

        }

        this.rowData = [];
        //console.log('this.datajson>>>>>>>',this.datajson);
        
      //  this.datajson.markerPositions.forEach((element: any, key: any) => {
          this.datajson.markerPositions.forEach((element: any, key: any) => {

            this.myMarker = this.binddata(
              element[0],
              element[1],
              element[2],
              element[3],
              element[4],
              element[5],
              ""
            );
            this.myMarker.lat = element[0];
            this.myMarker.lng = element[1];
            this.myMarker.timestamp = element[3];
            this.myMarker.tel = element[2];
            this.myMarker.name = element[4];
            this.myMarker.off("click");
            this.myMarker.on("mousedown", async (e: any) => {
              if (e.originalEvent.buttons == 2) {
                this.rowData = [];
                var jsonaggrid = {
                  Device_id: e.target.tel,
                  Tel: e.target.name,
                  Date: e.target.timestamp,
                  Hits: "1",
                  Coord: e.target.lat + ',' + e.target.lng,
                };
                this.rowData.push(jsonaggrid);

                const componentfactory =
                  this.componentFactoryResolver.resolveComponentFactory(
                    VAgGridComponent
                  );
                const componentref =
                  this.viewContainerRef.createComponent(componentfactory);
                componentref.instance.rowData = this.rowData;
                componentref.instance.columnDefs = this.columnDefs;
                componentref.instance.headerHeight = 0;
                componentref.instance.Title = "Here On";
                componentref.instance.distinct = true;
                componentref.changeDetectorRef.detectChanges();
                const html2 = componentref.location.nativeElement;
                componentref.instance.Grid2Type = 'btn-54';

                await html2;
                $('.ag-theme-balham').css('height', '130px');
                this.map.openPopup(html2, e.target._latlng);
              } else if (e.originalEvent.buttons == 1) {
              }
            });
            this.marker.addLayer(this.myMarker);

          })


        const componentfactory = this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
        const componentref = this.viewContainerRef.createComponent(componentfactory);
        const html1 = (componentref.location.nativeElement.style.display = "none");
        componentref.instance.columnDefs = this.columnDefs;
        componentref.changeDetectorRef.detectChanges();
        this.marker.off("click");

        this.marker.on("clustermousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            var markerChildrens = e.layer.getAllChildMarkers();


            this.rowData = [];

            for (var j = 0; j < markerChildrens.length; j++) {
              var jsonaggrid = {
                Device_id: markerChildrens[j].tel,
                Tel: markerChildrens[j].name,
                Date: markerChildrens[j].timestamp,
                Hits: "1",
                Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,

              };
              this.rowData.push(jsonaggrid);
            }
            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.pagination = false;
            componentref.instance.rowGrouping = true;
            componentref.instance.contextmenu = false;
            componentref.instance.Grid2Type = 'btn-54';


            const html1 = componentref.location.nativeElement;
            await html1;


            if (markerChildrens.length < 3) {
              $('.ag-theme-balham').css('height', '130px');

            } else {
              $('.ag-theme-balham').css('height', ' 250px ');

            }

            this.map.openPopup(html1, e.layer.getLatLng());
          }
        });

        this.map.addLayer(this.marker);
        this.allMarkers.push(this.marker);
      }
    }

  }
  






  async displayAOIActivitytData() {
    this.beginOperation = (window.parent.parent.parent[7] as any).A_beginOperation;
    if (this.beginOperation == "null") {
      this.beginOperation = "";
    }
    this.endOperation = (window.parent.parent.parent[7] as any).A_endOperation;
    if (this.endOperation == "null") {
      this.endOperation = "";
    }

    this.deviceIdArr = (window.parent.parent.parent[7] as any).A_deviceIdArr;
    if (this.deviceIdArr == "null") {
      this.deviceIdArr = "";
    }


    if (
      (window.parent.parent.parent[7] as any) &&
      (window.parent.parent.parent[7] as any).A_COUNTRY_CODE
    ) {
      this.countrycode = (window.parent.parent.parent[7] as any).A_COUNTRY_CODE;
      //console.log('countrycode:::::', this.countrycode);

      if (typeof this.countrycode !== 'undefined') {
        //console.log('countrycode not empty>>>>');

          let numArr = this.countrycode.split(',').map(Number);
      numArr = this.getDistinctNumbers(numArr);
      //console.log('numArr>>>>>>>', numArr);
      this.countrycode=numArr;
       await this.datacrowdService.getcountry2(this.countrycode).then((res:any)=>{
          //console.log('getcountry2>>>>',res);
          this.countrycode=res;
          this.countrycode=this.convertCountryCode(this.countrycode);
        })
      }

    }else{
      if(this.reportType!=1 && this.reportType!=10 && this.reportType!=3 && this.reportType!=8 && this.reportType!=9 && this.reportType!=11){
        await this.datacrowdService.getALLcountryIDS().then(async (res:any)=>{
          //console.log('getALLcountryIDS>>>>',res);
  
          this.countrycode=res;
  
           await this.datacrowdService.getcountry2(this.countrycode).then((res:any)=>{
              //console.log('getcountry2>>>>',res);
              this.countrycode=res;
              this.countrycode=this.convertCountryCode(this.countrycode);
              //console.log("countrycode finall",this.countrycode)
            })
  
        })
      }
     
    }


 


   
    if (typeof this.countrycode == 'undefined') {
      this.countrycode = '';
    }
    let queryjson = {
      reportName: "No Name",
      reportType: "2",
      reportTypeId: "2",
      TimeZone: this.TimeZone,
      RecipientUser: this.RecipientUser,
      DateTimeFrom: this.changeformatdate(this.beginOperation),
      RecipientEmail: this.RecipientEmail,
      DateTimeTo: this.changeformatdate(this.endOperation),
      Coordinates: [] as any[],
      meter: this.meter,
      Devices: this.deviceIdArr,
      isCSVAttached: this.isCSVAttached,
      dataType: this.dataType,
      telephoneNumber: this.telephoneNumber,
      EDGEHEIGHT: this.EDGEHEIGHT,
      simulationId: this.simulationid,
      userCode: this.usercode,
      imsiId: this.ImsiID,
      countryCode:[
        [
            "145",
            "142",
            [
                "376",
                "275",
                "634",
                "887",
                "196",
                "268",
                "368",
                "400",
                "414",
                "422",
                "512",
                "682",
                "760",
                "792",
                "784"
            ]
        ],
        [
            "35",
            "142",
            [
                "704",
                "116",
                "418",
                "360",
                "458",
                "104",
                "608",
                "702",
                "764",
                "626"
            ]
        ],
        [
            "61",
            "9",
            [
                "876",
                "184",
                "612",
                "876",
                "258",
                "570",
                "882",
                "772",
                "776",
                "798"
            ]
        ],
        [
            "419",
            "19",
            [
                "858",
                "531",
                "218",
                "254",
                "320",
                "328",
                "340",
                "558",
                "862",
                "850",
                "660",
                "533",
                "136",
                "152",
                "170",
                "188",
                "192",
                "212",
                "214",
                "222",
                "238",
                "308",
                "312",
                "332",
                "388",
                "474",
                "484",
                "500",
                "591",
                "600",
                "604",
                "630",
                "659",
                "662",
                "670",
                "652",
                "663",
                "239",
                "740",
                "780",
                "796"
            ]
        ],
        [
            "202",
            "2",
            [
                "204",
                "140",
                "232",
                "270",
                "430",
                "454",
                "175",
                "508",
                "894",
                "716",
                "854",
                "108",
                "120",
                "132",
                "148",
                "174",
                "178",
                "384",
                "180",
                "262",
                "226",
                "231",
                "260",
                "266",
                "288",
                "324",
                "624",
                "404",
                "426",
                "450",
                "466",
                "478",
                "480",
                "516",
                "562",
                "566",
                "638",
                "646",
                "654",
                "678",
                "686",
                "690",
                "694",
                "706",
                "710",
                "748",
                "834",
                "768",
                "800",
                "180"
            ]
        ],
        [
            "53",
            "9",
            [
                "166",
                "162",
                "334",
                "554",
                "574"
            ]
        ],
        [
            "154",
            "150",
            [
                "208",
                "833",
                "832",
                "248",
                "248",
                "233",
                "234",
                "246",
                "831",
                "352",
                "372",
                "428",
                "440",
                "578",
                "744",
                "752",
                "826"
            ]
        ],
        [
            "54",
            "9",
            [
                "242",
                "548",
                "540",
                "598"
            ]
        ],
        [
            "34",
            "142",
            [
                "356",
                "364",
                "462",
                "524",
                "586",
                "144"
            ]
        ],
        [
            "57",
            "9",
            [
                "296",
                "584",
                "580",
                "581",
                "316",
                "583",
                "520",
                "585"
            ]
        ],
        [
            "155",
            "150",
            [
                "442",
                "528",
                "250",
                "276",
                "438",
                "492",
                "756"
            ]
        ],
        [
            "30",
            "142",
            [
                "496",
                "156",
                "344",
                "392",
                "408",
                "410",
                "446",
                "158"
            ]
        ],
        [
            "21",
            "19",
            [
                "840",
                "124",
                "304",
                "666"
            ]
        ],
        [
            "143",
            "142",
            [
                "860",
                "398",
                "417",
                "762",
                "795"
            ]
        ],
        [
            "151",
            "150",
            [
                "112",
                "100",
                "203",
                "348",
                "498",
                "616",
                "642",
                "643",
                "703",
                "804"
            ]
        ],
        [
            "39",
            "150",
            [
                "191",
                "292",
                "300",
                "336",
                "380",
                "807",
                "470",
                "499",
                "620",
                "674",
                "688",
                "705",
                "724"
            ]
        ],
        [
            "15",
            "2",
            [
                "818",
                "434",
                "504",
                "788",
                "732"
            ]
        ]
    ]
    };
    console.log('zz queryjson',queryjson)
    this.test(queryjson);
    this.displayAOIResultData();
  }

  async displayAOIResultData() {
    this.aoiId = (window.parent.parent.parent[7] as any).A_ReportId;
    if (this.aoiId == "null") {
      this.aoiId = "";
    }
    this.LNGArr = (window.parent.parent.parent[7] as any).A_LNGArr;
    if (this.LNGArr == "null") {
      this.LNGArr = "";
    }
    this.LATArr = (window.parent.parent.parent[7] as any).A_LATArr;
    if (this.LATArr == "null") {
      this.LATArr = "";
    }
    this.deviceIdArr = (window.parent.parent.parent[7] as any).A_deviceIdArr;
    if (this.deviceIdArr == "null") {
      this.deviceIdArr = "";
    }

    this.AoiResultCoordArr =await this.datacrowdService.getAoiCoord(this.aoiId,this.deviceIdArr);
//console.log("AoiResultCoordArr",this.AoiResultCoordArr)
    const body = { "LNGArr": this.LNGArr, "LATArr": this.LATArr, "AoiResultCoordArr": this.AoiResultCoordArr };


    this.marker = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      animate: true,
      singleMarkerMode: true,
    });

    this.AoiResultCoordArr.forEach((element2: any, key: any) => {
        this.myMarker = L.marker([

          Number(element2[1]),
          Number(element2[0]),

        ]);

        this.markersArray2.push(this.myMarker);
        this.marker.addLayer(this.myMarker);
    });
    let splitLNGArr: any[];
    let splitLATArr: any[];

    splitLNGArr =this.LNGArr.split(',');
    splitLATArr = this.LATArr.split(',')
    for (let i = 0; i < splitLNGArr.length; i++) {
      this.circle = L.circle([Number(splitLATArr[i]), Number(splitLNGArr[i])], this.AOICircleRadius, {
        color: "#6e83f0",
        fillOpacity: 0.5,
        radius: this.AOICircleRadius,
      });
      this.layerGroup.addLayer(this.circle);

    }
    this.layerGroup.addTo(this.map);
    this.map.addLayer(this.marker);

  }

  executeAOIActivity() {
    (window.parent.parent.parent[8] as any).closepopup();
    this.aoiId = (window.parent.parent.parent[7] as any).A_reportId;
    if (this.reportId == "null") {
      this.reportId = "";
    }
    this.beginOperation = (window.parent.parent.parent[7] as any).A_beginOperation;
    if (this.beginOperation == "null") {
      this.beginOperation = "";
    }
    this.endOperation = (window.parent.parent.parent[7] as any).A_endOperation;
    if (this.endOperation == "null") {
      this.endOperation = "";
    }
    this.deviceIdArr = (window.parent.parent.parent[7] as any).A_deviceIdArr;
    if (this.deviceIdArr == "null") {
      this.deviceIdArr = "";
    }

    const body = { "beginOperation": this.beginOperation, "endOperation": this.endOperation, "deviceIdArr": this.deviceIdArr, "reportId": this.aoiId };
    let response = this.executeAOI(body);

  }
  async executeAOI(obj: any) {
    try {
      this.notification('info','Processing AOI ');
      this.datacrowdService.executeAOIActivity(obj);
       this.loaderService.hide();
       this.checkAoiCounter = 0;
       //const dialogRef = this.dialog.open(this.CoTravelersReady);
       this.aoiSubscription = interval(1000).pipe(
         switchMap(() => this.datacrowdService.checkTableAoiActivity(this.aoiId, this.checkAoiCounter))
       )
         .subscribe(data => {
           this.checkAoiCounter++;
           this.loaderService.hide();
           if (data != 0) {
             this.aoiSubscription.unsubscribe();
             this.notification('success', 'AOI Is ready'); 
           }
         });
     } catch (error: any) {
       this.notification('error', 'AOI Failure');
       //console.log("failure exception", error);
       //console.log("Fail - Please contact valoores team");
     }
   }
  
  displayAOIPolygonData() {
    this.shapeIdArr = (window.parent.parent.parent[7] as any).A_shapeIdArr;
    //console.log("shapeIdArr",this.shapeIdArr)
    //console.log("shapeIdArr",this.shapeIdArr.split(','))
    this.shapeIdArr=this.shapeIdArr.split(',');

    if (this.shapeIdArr == "null") {
      this.shapeIdArr = "";
    }
    for (let i = 0; i < this.shapeIdArr.length; i++) {
      this.datacrowdService.getSelectedShape(this.shapeIdArr[i]).then((res: any) => {
        this.Aoiresp = res;
        this.Coord.push(this.Aoiresp);
        if (this.Aoiresp.Type == "Circle") {
          this.circle = L.circle(this.Aoiresp.center, {
            color: "#FF0000",
            fillOpacity: 0.6,
            radius: this.Aoiresp.radius,
          }).bindTooltip(`${this.Aoiresp.Name}`, {
            permanent: true,
            interactive: true,
            opacity: 0.6,
            direction: "center"
          }).openTooltip();

          this.layerGroup.addLayer(this.circle);
        } else if (this.Aoiresp.Type == "Rectangle") {
          let bnds = L.latLngBounds(
            L.latLng(
              this.Aoiresp.Bounds.topLeft.lat,
              this.Aoiresp.Bounds.topLeft.lng
            ),
            L.latLng(
              this.Aoiresp.Bounds.bottomRight.lat,
              this.Aoiresp.Bounds.bottomRight.lng
            )
          );

          this.rectangle = L.rectangle(bnds, {
            color: "#FF0000",
            fillOpacity: 0.6,
          }).bindTooltip(`${this.Aoiresp.Name}`, {
            permanent: true,
            interactive: true,
            opacity: 0.6,
            direction: "center"
          })
          this.layerGroup.addLayer(this.rectangle);
        } else if (this.Aoiresp.Type == "Polygon") {
          this.polygon = L.polygon(this.Aoiresp.Bounds, {
            color: "#FF0000	",
            fillOpacity: 0.6,
          }).bindTooltip(`${this.Aoiresp.Name}`, {
            permanent: true,
            interactive: true,
            opacity: 0.6,
            direction: "center"
          })

          this.layerGroup.addLayer(this.polygon);
        } else if (this.Aoiresp.Type == "Polyline") {
          this.polyline = L.polyline(this.Aoiresp.Bounds, {
            color: "#FF0000	",
            fillOpacity: 0.6,
          }).bindTooltip(`${this.Aoiresp.Name}`, {
            permanent: true,
            interactive: true,
            opacity: 0.6,
            direction: "center"
          })
          this.layerGroup.addLayer(this.polyline);
        }

        if (this.AoiIds.length > 1) {
          this.map.setView(this.Aoiresp.center, 5);
        }
        else {
          this.map.setView(this.Aoiresp.center, 12);

        };

        this.layerGroup.addTo(this.map);
      });


    }

  }
  changeformatdate(beginOperation:any){
    let dateee= beginOperation.split('-');
    let year=dateee[0];
    let month=dateee[1];
    let day=dateee[2];
    let res=month+'/'+day+'/'+year+' 00:00';
    return res;
  }
 

   notification(type :any,message:any){
    // this.notif.showtoast(type,message);
  }

  async prevSimulation(){
  //console.log("this.similutionIdArray>>>>>",this.similutionIdArray);

    if(this.count==0){
      alert("stop prev");
      this.dimmedPrev=true;
    }else{
      this.dimmedPrev=false;
      //console.log("this.prev>>>>>",this.count);
  
     let simulationid= this.similutionIdArray[this.count];
  
      //console.log("simulationid>>>>>",simulationid);
      this.count--;
  

    await this.datacrowdService.getsimualtion(simulationid, this.usercode).then((res: any) => {
      this.datajson = res;
      //console.log("getsimultion response >>>>", this.datajson);
    });
    this.displayClusters2(simulationid);

  }

  }


 async nextSimulation(){
  //console.log("this.similutionIdArray>>>>>",this.similutionIdArray);

  if(this.count===this.similutionIdArray.length){
      alert("stop next");
      this.dimmedNext=true;
  }
  else{
    this.dimmedNext=false;
    //console.log("this.next>>>>>",this.count);

    let simulationid= this.similutionIdArray[this.count];

    //console.log("simulationid>>>>>",simulationid);
    this.count++;

    await this.datacrowdService.getsimualtion(simulationid, this.usercode).then((res: any) => {
      this.datajson = res;
      //console.log("getsimultion response >>>>", this.datajson);
    });
    this.displayClusters2(simulationid);

  }
}

async savefixedelements(){
 
 
  //console.log("typeFormControl.value--------",this.typeFormControl.value);
  //console.log("nameFormControl.value--------",this.nameFormControl.value);
  //console.log("option123 .value--------",$("#option123").val());

 

   let data = {
    Type: this.typeFormControl.value,
    Name: this.nameFormControl.value,
    lat:this.locationbts.lat.toString(),
    lng:this.locationbts.lng.toString()
  }; 
  let object=JSON.stringify(data);
////console.log("btslocation--------",this.locationbts);
   //console.log("object  "+ object);
  // //console.log('Type:'+, data.type);
  // //console.log('Name:', data.name);
 
  if (this.typeFormControl.value == null && this.nameFormControl.value == null) {
    this.cancelsearch();   
     Swal.fire({
    text: this.tns_alert_m23,
    icon: 'warning',
    // showCancelButton: true,
  });

}else if (this.typeFormControl.value == null) {
  this.cancelsearch();   


  Swal.fire({
    text: this.tns_alert_m24,
    icon: 'warning',
    // showCancelButton: true,
  });
}
else if (this.nameFormControl.value == null) {
  this.cancelsearch();   
  Swal.fire({
    text: this.tns_alert_m25,
    icon: 'warning',
    // showCancelButton: true,
  });


}else{
  this.cancelsearch();   

  Swal.fire({
    text: this.tns_alert_m29,
   //  icon: 'warning',
    // showCancelButton: true,
  });
 await this.datacrowdService.addFixedelements(object);

}


    //console.log("typeFormControl.value222222--------",this.typeFormControl.value);
  //console.log("nameFormControl.value222222--------",this.nameFormControl.value);
}

  
async executeOffline(){
  this.loaderService.hide();
  await this.datacrowdService.inQueueId(this.usercode).then((res: any[]) => {
    res.forEach((element: any) => {
      let isDeviceInQueue: boolean = this.inQueueArray.includes(element);
      if (!isDeviceInQueue) {
        this.inQueueArray.push(element);
      }
    });
    });
    this.inQueueSubscription = interval(5000)
      .pipe(switchMap(() => this.datacrowdService.getSimulationStatus(this.inQueueArray.toString())))
      .subscribe((data: any) => {
        this.loaderService.hide();
        for (var i = 0; i < data.length; i++) {
          if (data[i][0][1] === 24) {
            this.executeOfflineId = data[i][0][0];
            const dialogRef = this.dialog.open(this.Queue);
            this.inQueueArray = this.inQueueArray.filter((item: any) => item !== data[i][0][0]);
          }
          if (this.inQueueArray.length == 0) {
            this.inQueueSubscription.unsubscribe();
          }
        }
       }
      
      );
}





    cancelExecution(): void {
      this.dialog.closeAll();
      this.loaderService.show();
      this.flagInQueue = 0;

    }
  
    confirmOfflineExecution(): void {
      this.dialog.closeAll();
      this.flagInQueue = 1;
      this.clearShapes();
      this.executeOffline();
      return null;
    }





DisplayInQueue(){
  this.dialog.closeAll();
  this.displayClusters2(this.executeOfflineId);
  this.displayShapes(this.executeOfflineId);
}


 cancelsearch(){
    $("#closedialog").click();
    this.dataService.setCancel(false);
  }


  createnewSenario(){
    let obj22:any={
      Action:"CloseSenario",
    }
      
    // this.senarioIdOutput.emit(obj22);
        this.navbarSimulId=obj22;
    this.isGreen = !this.isGreen;
    this.senarioFlag=!this.senarioFlag;
    // $(".ShowSenario").css("display","");
    // $(".graphtools").css("top","");
    // $(".actionBtnContainer").css("top","");
    // $(".leaflet-control").css("top","");
 
    if(this.senarioFlag==true){
      // $(".leaflet-draw-section").css("top","33px");
            // $(".leaflet-top").css("top","34px");

     
      // $("#moretools").css("top","310px");
      // $("#graphtools").css("top","312px");
    }else{
      // $(".leaflet-draw-section").css("top","0px");
      // $(".leaflet-top").css("top","0px");

      // $("#moretools").css("top","281px");
      // $("#graphtools").css("top","284px");

      this.addnewsenariocount=null;
      this.senarioParentName=null;
      this.firstsenario=null
      this.SenarioRowData=[];
      this.senariocount=0  ;
      this.addnewsenariocount=0;
      this.internalcode=null;
    

    }

  }

  async OpenSenarioAlert(){
      // if(this.simulationid!=undefined && this.senarioFlag==true){

        let parentsimulion:any;
        if(this.addnewsenariocount==0){
          parentsimulion=this.senarioParentName;
        }else if(this.addnewsenariocount>0){
          parentsimulion=this.firstsenario;
        }
        //console.log("senarioParentName>>>>>>",this.senarioParentName);
        //console.log("firstsenario>>>>>>",this.firstsenario);
        //console.log("addnewsenariocount>>>>>>",this.addnewsenariocount);

        this.SenarioRowData= await this.datacrowdService.displaysequence(parentsimulion);
        //console.log("SenarioRowData>>>>>>",this.SenarioRowData);
        this.SenarioRowData=JSON.parse(this.SenarioRowData);
      
        
        
        this.closemodalservice();
        this.modalRef = this.modalService.open(this.SenarioContent);

      $(".modal-content").css("width", "197px");
      // $(".modal-content").css("right", "379px");
      $(".modal-content").css("padding", "10px");
      $(".modal-content").css("left", "-279px");
      $(".modal-content").css("top", "17px");
          // $(".modal-content").css("width", "500px");
          // $(".modal-content").css("right", "200px");
          // $(".modal-content").css("padding", "10px");
          // $(".modal-content").css("top", "85px");
        $(".modal-content").draggable({
          axis: "both",
          cursor: "move"
        });
      

    // }else{

    // }

    //console.log("senarioFlag in OpenSenarioAlert >>>>>>>>>>>>>>>>>",this.senarioFlag);
   

  }



  async addnewSenario(){
    if(this.addnewsenariocount==0){
      this.firstsenario=this.senarioParentName;
//     await this.datacrowdService.checkSimulationifSaved(this.senarioParentName).then(async (res:any)=>{
//       //console.log("checkSimulationifSaved res",res)
// if(res=='0'){

//   const dialogRef = this.dialog.open(this.saveSimul);

// }else{

// }
//      });
    }
    let parentSenario=localStorage.getItem("parentSenario");
    //console.log("parentSenario",parentSenario);
    let internalcode:any ;
     await this.datacrowdService.getinternalcode(parentSenario).then((res:any)=>{
      console.log("res getinternalcode>>>>>>>>>>>",res);
      this.internalcode=res[0];
      this.senariocount=res[1];

    });
    this.senariocount++;
    console.log("senariocount>>>>>>>>>>>",this.senariocount);
  console.log("internalcode>>>>>>>>>>>",this.internalcode);

 this.senarioParentName=parentSenario;
 this.addnewsenariocount++;
 console.log("senarioFlag in addnewSenario>>>>>>>>>>>",this.senarioFlag);


  }
  async displaysenario(event:any){
    //console.log("event>>>>>>>>>>>",event);
    this.simulationid=event;
    this.clearShapes();
    await this.datacrowdService.getExecutionParam(event).then((res:any)=>{
        console.log("getExecutionParam111",res);
        this.Senario_reportType=res.reportType;
      if((window.parent.parent.parent[7] as any)){
        (window.parent.parent.parent[7] as any).ChangeHeaderParameter(res);
      
      }
          });
    if (this.Senario_reportType == 11) {
      await this.datacrowdService.getsimualtion(this.simulationid, this.usercode).then((res: any) => {
        this.datajson = res;
        console.log("getsimultion response >>>>", this.datajson);

      });
      
      $('#controlbutton').css('display', '');
      this.tcd();

    }else{
      this.displayClusters2(event);
      this.displayShapes(event);
  

    }
 
  }
  onClick() {
    this.isClicked = !this.isClicked;
    // $(".add-button").css("background-color","#0056b3")
  }

  onMouseEnter() {
    this.isClicked = true;
  }

  onMouseLeave() {
    this.isClicked = false;
  }
 


  async SaveSimulation(){
    let name=$("#simulname").val();
    //console.log('name',name);
  await this.datacrowdService.updateLocReportNameById(name,this.firstsenario);

  this.dialog.closeAll();

}

// routeDev(){

//   this.count=0;
//   this.templates=[];
//   this.dimmedTemplate=false;
//   $('#approuting').css('display', 'none');
//   $("#closedialog").click();
//   //console.log("this.datajson<<<<<<",this.datajson);

//  let datajson:any=[
//     [
//       "33.890082489364794",
//       "35.60540199279786",
//       "79b3913f-ec43-4399-a31e-22f151325214",
//       1697317457000,
//       "79b3913f-ec43-4399-a31e-22f151325214",
//       "GeoSpatial Provider 1"
//   ],
//   [
//     "33.89113785584963",
//     "35.58217272162438",
//     "vvvfgrfefrefre399-a31e-22f151325214",
//     1698317457000,
//     "vvvfgrfefrefre399-a31e-22f151325214",
//     "GeoSpatial Provider 1"
//   ],
//   [
//       "33.89585567419355",
//       "35.56858599185944",
//       "79b3913f-ec43-4399-a31e-22f151325214",
//       1699317457000,
//       "79b3913f-ec43-4399-a31e-22f151325214",
//       "GeoSpatial Provider 1"
//   ],
//   [
//     "33.89585567419355",
//     "35.56858599185944",
//     "vvvfgrfefrefre399-a31e-22f151325214",
//     1699317457000,
//     "vvvfgrfefrefre399-a31e-22f151325214",
//     "GeoSpatial Provider 1"
//   ],
 

//   ];
 

// // let datajson:any=[
// //   [
// //     "33.77060712403079",
// //     "35.64736783504487",
// //     "79b3913f-ec43-4399-a31e-22f151325214",
// //     1697317457000,
// //     "79b3913f-ec43-4399-a31e-22f151325214",
// //     "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.77060712403079",
// //   "35.64736783504487",
// //   "vvvfgrfefrefre399-a31e-22f151325214",
// //   1697317457000,
// //   "vvvfgrfefrefre399-a31e-22f151325214",
// //   "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.77060712403079",
// //   "35.64736783504487",
// //   "79b391322f-ec43-4399-a31e-22f151325214",
// //   1697317457000,
// //   "79b391322f-ec43-4399-a31e-22f151325214",
// //   "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.85022283154548",
// //   "35.57060301303864",
// //   "79b3913f-ec43-4399-a31e-22f151325214",
// //   1705148962000,
// //   "79b3913f-ec43-4399-a31e-22f151325214",
// //   "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.836700440321856",
// //   "35.55360317230225",
// //   "vvvfgrfefrefre399-a31e-22f151325214",
// //   1705148962000,
// // "vvvfgrfefrefre399-a31e-22f151325214",
// // "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.82954406870953",
// //   "35.571815371513374",
// // "79b391322f-ec43-4399-a31e-22f151325214",
// // 1705148962000,
// // "79b391322f-ec43-4399-a31e-22f151325214",
// // "GeoSpatial Provider 1"
// // ],

// // [
// //   "33.88616148811491",
// //   "35.54871618747712",
// //   "79b3913f-ec43-4399-a31e-22f151325214",
// //   1705168569000,
// //   "79b3913f-ec43-4399-a31e-22f151325214",
// //   "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.88616148811491",
// //   "35.54871618747712",
// //   "vvvfgrfefrefre399-a31e-22f151325214",
// //   1705168569000,
// // "vvvfgrfefrefre399-a31e-22f151325214",
// // "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.88616148811491",
// //   "35.54871618747712",
// // "79b391322f-ec43-4399-a31e-22f151325214",
// // 1705168569000,
// // "79b391322f-ec43-4399-a31e-22f151325214",
// // "GeoSpatial Provider 1"
// // ],


// // [
// //   "33.778176414709066",
// //   "35.64637407660485",
// //   "79b3913f-ec43-4399-a31e-22f151325214",
// //   1705270782000,
// //   "79b3913f-ec43-4399-a31e-22f151325214",
// //   "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.778176414709066",
// //   "35.64637407660485",
// //   "vvvfgrfefrefre399-a31e-22f151325214",
// //   1705270782000,
// // "vvvfgrfefrefre399-a31e-22f151325214",
// // "GeoSpatial Provider 1"
// // ],
// // [
// //   "33.778176414709066",
// //   "35.54871618747712",
// // "79b391322f-ec43-4399-a31e-22f151325214",
// // 1705270782000,
// // "79b391322f-ec43-4399-a31e-22f151325214",
// // "GeoSpatial Provider 1"
// // ],

// // ];
 
//   this.formValues.forEach((dev:any)=>{
//     //console.log("dev<<<<<<",dev);
//     let array:any[]=[];
//     // array=this.datajson.markerPositions.filter((marker:any)=>{
//       array=datajson.filter((marker:any)=>{
//       //console.log("marker[2]<<<<<<",marker[2]);
//       return  marker[2]==dev.device;
//     });
//     //console.log("array<<<<<<",array);

//   this.routedatajson=array;
//   this.allRoutedatajson.push(this.routedatajson);
//   //console.log("allRoutedatajson111111111111<<<<<<",this.allRoutedatajson);


//   const singlepersonicon = L.divIcon({
//     html: `<i class="fa-solid fa-person" style="width:32px;height:32px;color:${dev.color};" ></i>`,
//     className: 'someExtraClass'
//   });
  

//   // this.animatedmarker = L.marker([Number(this.routedatajson[0][0]), Number(this.routedatajson[0][1])], { icon: singlepersonicon }).on('click', e => e.target.remove()).bindPopup(`<strong>${new Date(this.routedatajson[0][3])}</strong>`).addTo(this.map);
 
//   this.animatedmarker = L.marker([Number(this.routedatajson[0][0]), Number(this.routedatajson[0][1])], { icon: singlepersonicon }).addTo(this.map);
//   // this.fixedElementMarker = this.binddataforfixedElements(element[4], element[3], element[1], iconVar).on('click', e => e.target.remove()).bindPopup(`<strong>${element[2]}</strong>`);;
//   this.animatedmarker.deviceId=this.routedatajson[0][2];

//   //console.log(" this.animatedmarker >>>>>>>", this.animatedmarker);
//   this.animatedmarkerArray.push(this.animatedmarker);
//      this.processNextBatch(dev.color);
//   });
 

   

// }

  submit(){
    for(let i=0;i< this.templateForms.length;i++){
      this.formsValues(i);
    }
    this.routeDev();
  }


formsValues(formIndex: any) {
  let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  this.templateForms[formIndex].value.color=color;
  let formValue = this.templateForms[formIndex].value;
  //console.log('formValue:', formValue);

  this.formValues[formIndex] = formValue;
  //console.log('Form Values:', this.formValues);
}

addTemplate() {
if(this.deviceIdArr.length< this.templateForms.length){
  this.dimmedTemplate=true;
}else{
  const newForm = this.formBuilder.group({
    device: '',
    color: ''
  });
  this.templateForms.push(newForm);
  if(this.deviceIdArr.length=== this.templateForms.length){
    this.dimmedTemplate=true;
  }
}
 
  
}

processNextBatchRoute(){

  this.endIndex = this.endIndex + this.batchSize;

  this.allRoutedatajson.forEach((elt:any)=>{
  let color:any;
  let device:any;
  let animatemarker:any;
  let routedatajson:any[];
    this.routedatajson=elt;
    //console.log("elt-----",elt);

    //console.log("animatedmarkerArray-----",this.animatedmarkerArray);
    this.animatedmarkerArray.forEach((dev:any)=>{
      if(elt[0][2]===dev.deviceId){
        color=dev.color;
        device=dev.deviceId;
        animatemarker=dev;
        routedatajson=elt;
        //console.log("routedatajson>>>>>>",routedatajson)
        if(routedatajson.length===this.endIndex){
          this.count++;
        }
      }

    });
    this.processNextBatch(color,device,animatemarker,routedatajson);
  });
  this.currentIndex = this.endIndex;
//console.log("count--------------------",this.count);
// if(this.count===this.animatedmarkerArray.length){
//   alert("trueee")
// }
}

clearRouteTemplate(){
  this.formValues=[];
    this.routedatajson=[];
    this.allRoutedatajson=[];
    this.dimmedTemplate=false;
    this.templateForms=[];
    this.deviceIdArr=[];
}


shortestpathtest() {
  // $('#controlbutton').css('display', '');
  // this.displayclusters=true;
  // this.displayRoute=true;

  this.routingTools=true
  this.clearRouteTemplate();
  // this.routeDevices=this.Devices;
  // this.routeDevices="79b3913f-ec43-4399-a31e-22f151325214,vvvfgrfefrefre399-a31e-22f151325214,79b391322f-ec43-4399-a31e-22f151325214";
  //  this.routeDevices="e15388a5-fdf0-4321-a923-1fb90092c95c,9cf973bc-3c78-4d7b-ad3e-7509e5d42f39";
  //console.log("routeDevices>>>>>>><<<<<",this.routeDevices);
  
  this.deviceIdArr=this.routeDevices.split(",");
  this.deviceIdArr = [...new Set(this.deviceIdArr)];

  //console.log("deviceIdArr>>>>>>><<<<<",this.deviceIdArr);
  this.addTemplate();
  // const dialogRef = this.dialog.open(this.approuting);
  this.displayRoute=true;
  this.routeDev();
}


  // processNextBatch(color:any) {
  //   if (this.currentIndex == 0) {
  //   } else {
  //     this.currentIndex = this.currentIndex;
  //   }
  // //console.log("routedatajson>>>>>>>",this.routedatajson);
  //   const waypoints: any = [];
  //   const startIndex = this.currentIndex;
  // //console.log("startIndex>>>>>>>", startIndex);
  
  //   this.endIndex = this.endIndex + this.batchSize;
  // //console.log("endIndex>>>>>>>",this.endIndex);
  
  
  //   if(this.routedatajson.length<this.batchSize){
  //     //console.log("ifffffffffffffffffffff>>>>>>>");
  
  //     for (let i = 0; i < this.routedatajson.length; i++) {
  //       const element = this.routedatajson[i];
  //       //console.log("element-------",element);
  //       if( typeof(element) != 'undefined'){
  //       const x = [element[0], element[1]];
  //       waypoints.push(x);
  //       }
  //     }
  //   }else{
  // //console.log("elseeeeeeeeeeeeeeeee>>>>>>>");
  
  //   for (let i = startIndex; i < this.endIndex; i++) {
  //     const element = this.routedatajson[i];
  //     //console.log("element-------",element);
  //     if( typeof(element) != 'undefined'){
  //     const x = [element[0], element[1]];
  //     waypoints.push(x);
  //     }
  //   }
  //   }
  
  // //console.log("waypoints>>>>>>>",waypoints);
  
  //   this.currentIndex = this.endIndex;
  //   // if (this.currentIndex < this.routedatajson.length) {
      
  //      const routingControl :any= L.Routing.control({
  //       waypoints: waypoints,
  //       routeWhileDragging: true,
         
  //       lineOptions: {
  //         styles: [
  //           {
  //             color: '#FFA500',
  //             weight: 5,
  //             opacity: 0.7 // Set the desired opacity
  //           }
  //         ],
  //         extendToWaypoints: false,
  //         missingRouteTolerance: 0,
  //       },
  //       plan: L.Routing.plan(waypoints, {
  //         createMarker: function() {
  //             return null;
  //         }
  //     }),
  //         routeLine:  (route: any, options: any)=> {
  //         //  const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  //           const polyline = L.polyline(route.coordinates, { color: color, weight: 5, opacity: 0.7 });
  //           // Convert the Polyline to a Line
  //           const line: any = polyline;
  //           line.on('click',(e:any)=> {
  //             //console.log("e>>",e)
  //             line.setText('  ►  ', {
  //               repeat: true,
  //               attributes: {
  //                 fill: 'red'
  //               }
  //             });
  //             line.setStyle({
  //             color: 'red',
  //           });
  //           });
  //           line.on('mouseout', (e:any)=> {
  //           });
  //           return line;
  //         },
  //      }); 
  //     routingControl.addTo(this.map);
  //     //console.log("routingControl>>>>>>>>>>>>>>>>>>",routingControl);
  
  //     var routingControlContainer = routingControl.getContainer();
  //     //console.log("controlContainerParent>>>>>>>>>>>>>>>>>>",routingControlContainer);
  
  //     var controlContainerParent = routingControlContainer.parentNode;
  //     //console.log("controlContainerParent>>>>>>>>>>>>>>>>>>",controlContainerParent);
  
  // // var datarouting = controlContainerParent.getContainer();
  // // //console.log("datarouting>>>>>>>>>>>>>>>>>>",datarouting);
  
  //     this.renderer.setAttribute(controlContainerParent, 'id', 'your-id');
  //     //const element = document.getElementById('this.animatedmarker');
  //     routingControl._container.id = 'myRoute'+ this.animatedmarker.deviceId;
  //     //console.log("this.animatedmarker.deviceid>>>>>>>>>>>>>>>>>>",this.animatedmarker.deviceId);
  //     //console.log("routingControl>>>>>>>>>>>>>>>>>>",routingControl);
     
  //     // leaflet-routing-container leaflet-bar leaflet-control
  //     //const controlContainerParent = routingControl.getContainer().parentNode;
  //     //console.log("1111111111111.>>>>>>>>>>>>>>>>>>",routingControl._container);
  //     const firstChild = routingControl._container;
  
  //     // Create a new div element
  //     const div = this.renderer.createElement('div');
  //     div.innerHTML = this.animatedmarker.deviceId;
  //     // Optionally, you can set attributes or styles for the div
  //     this.renderer.setAttribute(div, 'class', 'your-class');
  //     this.renderer.setStyle(div, 'color', `${color}`);
  //     firstChild.appendChild(div);
  //     // Append the div to the first child
  //     this.renderer.appendChild(firstChild, div);
      
   
      
  
  
  
  //    // //console.log("routingControl ID set to:", routingControl._container.id);
  //     let pathCoordinates = [];
  //     routingControl.on('routesfound', (event: any) => {
  //      //console.log("event>>>", event); 
  
  //       this.route1 = event.routes[0];
  //       this.pathCoordinates = this.route1.coordinates;
  //       // Start animating the marker along the route
  //       this.pathCoordinatesDev.push(this.pathCoordinates);
  //       //console.log("this.route1", this.route1);
  //       // //console.log("this.pathCoordinates", this.pathCoordinates);
  //       this.animateMarker();
  //     });
  
  
  //   // }
  // }


  // sendMessage(){
  //   //console.log("message");
    
    
  //   this.messages.push(this.messageInput);
  //   const fullMessageString = this.messages.join('\n');


  //   //console.log('User Message:',fullMessageString);
  //   this.messageInput = '';
  // }
  
  async sendMessage() {
    //console.log("1111111111111111y>>>>>>>>>>",this.messagesArray);


    
  // await this.chatService.getBotAnswer(this.value);
  
  
  await  this.datacrowdService.getchatbotrecords().then((records:any)=>{

      //console.log("records>>>>>",records);
    
      if (records !== null) {
        //console.log("records<<<>>>>>", records.length);
        this.marker = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          animate: true,
          singleMarkerMode: true,
        });
        this.map.flyTo([records[0][0], records[0][1]])
        // this.map.setView([records[0][0], records[0][1]],15)

        for (var j = 0; j < 1; j++) {
          for (var i = 0; i < records.length; i++) {
            this.markers = L.marker([
              Number(records[i][0]),
              Number(records[i][1]),
            ]);
            this.markers.off("click");
            this.markers.on("mousedown", (e: any) => {
              if (e.originalEvent.buttons == 2) {
                e.target.openPopup();
    
              }
              if (e.originalEvent.buttons == 1) {
                //  alert(1);
              }
            });
            this.markersArray.push(this.markers)
          }
        }
    
    
    
        //       markersBatch.push(marker);
        //     }
    
        //     // Apply event listeners to the batch of markers
        //     markersBatch.forEach(marker => {
        //       marker.off("click");
        //       marker.on("mousedown", (e: any) => {
        //         if (e.originalEvent.buttons == 2) {
        //           e.target.openPopup();
        //         }
        //         if (e.originalEvent.buttons == 1) {
        //           // alert(1);
        //         }
        //       });
    
        //       this.markersArray.push(marker);
        //     });
    
        //     // Clear markersBatch to free up memory
        //     markersBatch.length = 0;
        //   }
        // }
        // // End the timer and log the elapsed time
        // //console.timeEnd('loopTime');
    
        //     //  this.marker.openPopup(
        //     //  html11
        //     //  );
    
    
    
        this.rowData = [];
        records.forEach((element: any, key: any) => {
          this.myMarker = this.binddata(
            element[0],
            element[1],
            element[2],
            element[3],
            element[4],
            element[5],
            ""
          );
    
          this.myMarker.lat = element[0];
          this.myMarker.lng = element[1];
          this.myMarker.timestamp = element[3];
          this.myMarker.tel = element[2];
          this.myMarker.name = element[4];
          this.marker.addLayer(this.myMarker);
          this.myMarker.off("click");
          this.myMarker.on("mousedown", async (e: any) => {
            if (e.originalEvent.buttons == 2) {
              //console.log("markerChildrensssssss", e.target)
              this.rowData = [];
              var jsonaggrid = {
                Device_id: e.target.tel,
                Tel: e.target.name,
                Date: e.target.timestamp,
                Hits: "1",
                Coord: e.target.lat + ',' + e.target.lng,
                //Lat:e.target.lat
              };
              this.rowData.push(jsonaggrid);
    
    
              const componentfactory =
                this.componentFactoryResolver.resolveComponentFactory(
                  VAgGridComponent
                );
              const componentref =
                this.viewContainerRef.createComponent(componentfactory);
              componentref.instance.rowData = this.rowData;
              componentref.instance.columnDefs = this.columnDefs;
              componentref.instance.headerHeight = 0;
              // componentref.instance.selectdevices = true;
              componentref.instance.Title = "Here On";
              componentref.instance.distinct = true;
              componentref.changeDetectorRef.detectChanges();
              componentref.instance.Grid2Type = 'btn-54';
              componentref.instance.GridID = 'GeoGrid1';
    
              const html2 = componentref.location.nativeElement;
              await html2;
    
              // $('#agGrid').css('height','10px');
              $('.ag-theme-balham').css('height', '130px');
    
    
              // /  e.target.openPopup(html2, e.target._latlng);
              this.map.openPopup(html2, e.target._latlng);
    
    
            } else if (e.originalEvent.buttons == 1) {
    
            }
    
          });
        });
    
        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        const html1 = (componentref.location.nativeElement.style.display = "none");
        componentref.instance.columnDefs = this.columnDefs;
        componentref.changeDetectorRef.detectChanges();
        this.marker.off("click");
        this.marker.on("clustermousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            var markerChildrens = e.layer.getAllChildMarkers();
    
    
    
    
    
            this.rowData = [];
    
            for (var j = 0; j < markerChildrens.length; j++) {
              var jsonaggrid = {
                Device_id: markerChildrens[j].tel,
                Tel: markerChildrens[j].name,
                Date: markerChildrens[j].timestamp,
                Hits: "1",
                Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,
                // Lat:markerChildrens[j].lat
              };
              this.rowData.push(jsonaggrid);
            }
    
            //console.log("markerChildrens>>>>>", markerChildrens);
    
            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            // componentref.instance.selectdevices = true;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.pagination = false;
            componentref.instance.rowGrouping = true;
            componentref.instance.contextmenu = false;
            componentref.instance.Grid2Type = 'btn-54';
            componentref.instance.GridID = 'GeoGrid1';
            const html1 = componentref.location.nativeElement;
            await html1;
            //console.log("markerChildrens.length>>>>>>", markerChildrens.length)
            if (markerChildrens.length < 3) {
              // $('#agGrid').css('height','10px');
              $('.ag-theme-balham').css('height', '130px');
    
            } else {
              $('.ag-theme-balham').css('height', ' 250px ');
    
            }
    

            this.map.openPopup(html1, e.layer.getLatLng());
    
            // $(".modal-content").css("width","650px");
            // $(".modal-content").css("right","200px");
            // $(".modal-content").css("padding","10px");
            // $(".modal-content").css("top","85px");
            // $(".modal-content").draggable({
            //   axis: "both",
            //   cursor: "move"
            // });
            //  this.modalRef =this.modalService.open(this.popupContent1);
    
          }
          if (e.originalEvent.buttons == 1) {
            // alert(4);
    
          }
    
          //open popup;
        });
    
        this.map.addLayer(this.marker);
      //  this.layerGroup.addLayer(this.marker);
       // this.layerGroup.addLayer(this.markers);
    }
    
    
    });
  
  
  
  
  //console.log("3333333333333>>>>>>>>>",this.messagesArray);

  this.value = '';

}




chatbot(){



// this.chatService.conversation.subscribe((val:any) => {
//   //console.log("val>>>>>>>>>>",val);
//   this.messagesArray = this.messagesArray.concat(val);
// //console.log("222222222222222>>>>>>>>>",this.messagesArray);
// });

const dialogRef = this.dialog.open(this.prompt);
//console.log("fddddddddddddd");
}

async getdataChatbot(){
let obj :any=$("#textareaprompt").val();
//console.log("textareaprompt",obj);

//  await  this.datacrowdService.getdataChatbot(obj).then((res:any)=>{
//   //console.log("getdataChatbot>>>>",res);
let object ={
prompt:obj
}

this.datacrowdService.getchatbotMessage(object).then((records:any)=>{


this.datacrowdService.getchatbotrecords().then((records:any)=>{
  //console.log("records>>>>>",records);

  if (records !== null) {
    //console.log("records<<<>>>>>", records.length);
    this.map.setView([records[0][0], records[0][1]],15)
    this.marker = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      animate: true,
      singleMarkerMode: true,
    });

    for (var j = 0; j < 1; j++) {
      for (var i = 0; i < records.length; i++) {
        this.markers = L.marker([
          Number(records[i][0]),
          Number(records[i][1]),
        ]);
        this.markers.off("click");
        this.markers.on("mousedown", (e: any) => {
          if (e.originalEvent.buttons == 2) {
            e.target.openPopup();

          }
          if (e.originalEvent.buttons == 1) {
            //  alert(1);
          }
        });
        this.markersArray.push(this.markers)
      }
    }



    //       markersBatch.push(marker);
    //     }

    //     // Apply event listeners to the batch of markers
    //     markersBatch.forEach(marker => {
    //       marker.off("click");
    //       marker.on("mousedown", (e: any) => {
    //         if (e.originalEvent.buttons == 2) {
    //           e.target.openPopup();
    //         }
    //         if (e.originalEvent.buttons == 1) {
    //           // alert(1);
    //         }
    //       });

    //       this.markersArray.push(marker);
    //     });

    //     // Clear markersBatch to free up memory
    //     markersBatch.length = 0;
    //   }
    // }
    // // End the timer and log the elapsed time
    // //console.timeEnd('loopTime');

    //     //  this.marker.openPopup(
    //     //  html11
    //     //  );



    this.rowData = [];
    records.forEach((element: any, key: any) => {
      this.myMarker = this.binddata(
        element[0],
        element[1],
        element[2],
        element[3],
        element[4],
        element[5],
        ""
      );

      this.myMarker.lat = element[0];
      this.myMarker.lng = element[1];
      this.myMarker.timestamp = element[3];
      this.myMarker.tel = element[2];
      this.myMarker.name = element[4];
      this.marker.addLayer(this.myMarker);
      this.myMarker.off("click");
      this.myMarker.on("mousedown", async (e: any) => {
        if (e.originalEvent.buttons == 2) {
          //console.log("markerChildrensssssss", e.target)
          this.rowData = [];
          var jsonaggrid = {
            Device_id: e.target.tel,
            Tel: e.target.name,
            Date: e.target.timestamp,
            Hits: "1",
            Coord: e.target.lat + ',' + e.target.lng,
            //Lat:e.target.lat
          };
          this.rowData.push(jsonaggrid);


          const componentfactory =
            this.componentFactoryResolver.resolveComponentFactory(
              VAgGridComponent
            );
          const componentref =
            this.viewContainerRef.createComponent(componentfactory);
          componentref.instance.rowData = this.rowData;
          componentref.instance.columnDefs = this.columnDefs;
          componentref.instance.headerHeight = 0;
          // componentref.instance.selectdevices = true;
          componentref.instance.Title = "Here On";
          componentref.instance.distinct = true;
          componentref.changeDetectorRef.detectChanges();
          componentref.instance.Grid2Type = 'btn-54';
          componentref.instance.GridID = 'GeoGrid1';

          const html2 = componentref.location.nativeElement;
          await html2;

          // $('#agGrid').css('height','10px');
          $('.ag-theme-balham').css('height', '130px');


          // /  e.target.openPopup(html2, e.target._latlng);
          this.map.openPopup(html2, e.target._latlng);


        } else if (e.originalEvent.buttons == 1) {

        }

      });
    });

    const componentfactory =
      this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
    const componentref =
      this.viewContainerRef.createComponent(componentfactory);
    const html1 = (componentref.location.nativeElement.style.display = "none");
    componentref.instance.columnDefs = this.columnDefs;
    componentref.changeDetectorRef.detectChanges();
    this.marker.off("click");
    this.marker.on("clustermousedown", async (e: any) => {
      if (e.originalEvent.buttons == 2) {
        var markerChildrens = e.layer.getAllChildMarkers();





        this.rowData = [];

        for (var j = 0; j < markerChildrens.length; j++) {
          var jsonaggrid = {
            Device_id: markerChildrens[j].tel,
            Tel: markerChildrens[j].name,
            Date: markerChildrens[j].timestamp,
            Hits: "1",
            Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,
            // Lat:markerChildrens[j].lat
          };
          this.rowData.push(jsonaggrid);
        }

        //console.log("markerChildrens>>>>>", markerChildrens);

        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(
            VAgGridComponent
          );
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        componentref.instance.rowData = this.rowData;
        componentref.instance.columnDefs = this.columnDefs;
        componentref.instance.headerHeight = 0;
        // componentref.instance.selectdevices = true;
        componentref.instance.Title = "Here On";
        componentref.instance.distinct = true;
        componentref.changeDetectorRef.detectChanges();
        componentref.instance.pagination = false;
        componentref.instance.rowGrouping = true;
        componentref.instance.contextmenu = false;
        componentref.instance.Grid2Type = 'btn-54';
        componentref.instance.GridID = 'GeoGrid1';
        const html1 = componentref.location.nativeElement;
        await html1;
        //console.log("markerChildrens.length>>>>>>", markerChildrens.length)
        if (markerChildrens.length < 3) {
          // $('#agGrid').css('height','10px');
          $('.ag-theme-balham').css('height', '130px');

        } else {
          $('.ag-theme-balham').css('height', ' 250px ');

        }


        this.map.openPopup(html1, e.layer.getLatLng());

        // $(".modal-content").css("width","650px");
        // $(".modal-content").css("right","200px");
        // $(".modal-content").css("padding","10px");
        // $(".modal-content").css("top","85px");
        // $(".modal-content").draggable({
        //   axis: "both",
        //   cursor: "move"
        // });
        //  this.modalRef =this.modalService.open(this.popupContent1);

      }
      if (e.originalEvent.buttons == 1) {
        // alert(4);

      }

      //open popup;
    });

    this.map.addLayer(this.marker);
    this.layerGroup.addLayer(this.marker);
    this.layerGroup.addLayer(this.markers);


}


})

}
);



this.dialog.closeAll();
//  });
}


animateMarker() {
   
  this.animationStopped=false;
   let count=0;
   //console.log('pathCoordinatesDev11111111111111>>>>>>',  this.pathCoordinatesDev);
 
 
 
   this.animatedmarkerArray.forEach((elt:any)=>{
     //console.log('elt>>>>>>',  elt);
 
     this.pathCoordinates=elt.coord;
     this.animatedmarker=elt;
     let routedata=elt.routedatajson;
     //console.log('this.animatedmarker>>>>>>',  this.animatedmarker);
     //console.log('count>>>>>>',  count);
 
     this.movePersonMarker(elt,elt.coord,routedata);
     count++;
     //console.log("count-------",count);
     });
 }
 
   movePersonMarker(animatedmarker:any,pathCoordinates:any[],routedata:any[]) {
     //console.log(" pathCoordinates.length>>>>>>>", pathCoordinates.length);
     //console.log(" animatedmarker>>>>>>>", animatedmarker.deviceId);
 
     if (this.currentIndex < pathCoordinates.length && !this.animationStopped) {
         const currentLatLng =pathCoordinates[this.currentIndex];
         animatedmarker.setLatLng(currentLatLng);
         // routedata.forEach((elt:any)=>{
         //   //console.log("elt>>>>",elt);
              
         //         let lat1:any=elt[0];
         //         let lng1:string=elt[1];
         //         let lng2:number=parseFloat(lng1);
         //         let lat=parseFloat(lat1).toFixed(4); 
         //         let lng=parseFloat(lng2.toFixed(4));
         //         if(lat==currentLatLng.lat.toString()){
         //           if(lng=currentLatLng.lng-0.0001){
         //           animatedmarker.bindPopup(`<strong>${this.dateTtoDate(elt[3])}</strong>`).openPopup();
         //           setTimeout(() => {
         //             animatedmarker.closePopup();
         //         }, 2000);
         //          }
         //         }
         //     });
        
         this.currentIndex++;
         //console.log(" this.currentIndex++>>>>>>>", this.currentIndex);
 
       setTimeout(() =>  this.movePersonMarker(animatedmarker,pathCoordinates,routedata), 10 ); 
 
     } else {
       //console.log('Animation Completed');
     }
   }


  routeDev(){

    this.count=0;
    this.templates=[];
    this.dimmedTemplate=false;
    $('#approuting').css('display', 'none');
    $("#closedialog").click();
    //console.log("this.datajson<<<<<<",this.datajson);
    let devicesProp:any[]=[];

     this.deviceIdArr.forEach((dev:any)=>{
    //console.log("dev>>>>>>>>>",dev);

      let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      devicesProp.push({ device:dev, color: color });
    })

    //console.log("devicesProp>>>>>>>>>",devicesProp);
   

this.endIndex = this.endIndex + this.batchSize;
    
     devicesProp.forEach((dev:any)=>{
      //console.log("dev<<<<<<",dev);
      let array:any[]=[];
      array=this.datajson.markerPositions.filter((marker:any)=>{
        // array=datajson.filter((marker:any)=>{
        // //console.log("marker[2]<<<<<<",marker[2]);
        return  marker[2]==dev.device;
      });
      //console.log("array<<<<<<",array);
  
    this.routedatajson=array;
    this.allRoutedatajson.push(this.routedatajson);
    //console.log("allRoutedatajson111111111111<<<<<<",this.allRoutedatajson);


    const singlepersonicon = L.divIcon({
      html: `<i class="fa-solid fa-person" style="width:32px;height:32px;color:${dev.color};" ></i>`,
      className: 'someExtraClass'
    });
    

    // this.animatedmarker = L.marker([Number(this.routedatajson[0][0]), Number(this.routedatajson[0][1])], { icon: singlepersonicon }).on('click', e => e.target.remove()).bindPopup(`<strong>${new Date(this.routedatajson[0][3])}</strong>`).addTo(this.map);
   
    this.animatedmarker = L.marker([Number(this.routedatajson[0][0]), Number(this.routedatajson[0][1])], { icon: singlepersonicon }).addTo(this.map);
    // this.fixedElementMarker = this.binddataforfixedElements(element[4], element[3], element[1], iconVar).on('click', e => e.target.remove()).bindPopup(`<strong>${element[2]}</strong>`);;
    this.animatedmarker.deviceId=this.routedatajson[0][2];
    this.animatedmarker.color=dev.color;
    this.animatedmarker.routedatajson=array;

    //console.log(" this.animatedmarker >>>>>>>", this.animatedmarker);
    this.animatedmarkerArray.push(this.animatedmarker);
       this.processNextBatch(dev.color,dev.device,this.animatedmarker,array);
    });
    this.currentIndex = this.endIndex;

  }

  processNextBatch(color:any,deviceId:any,animatemarker:any,routedatajson:any) {
    if (this.currentIndex == 0) {
    } else {
      this.currentIndex = this.currentIndex;
    }
    const waypoints: any = [];
    const startIndex = this.currentIndex;
  
  
    //console.log("startIndex>>>>>>>",startIndex,"this.endIndex>>>>>>>",this.endIndex);
  
    if(routedatajson.length<this.batchSize){
  
      for (let i = 0; i < routedatajson.length; i++) {
        const element = routedatajson[i];
        if( typeof(element) != 'undefined'){
        const x = [element[0], element[1]];
        waypoints.push(x);
        }
      }
    }else{
    for (let i = startIndex-1; i < this.endIndex; i++) {
      const element = routedatajson[i];
      if( typeof(element) != 'undefined'){
      const x = [element[0], element[1]];
      waypoints.push(x);
      }
    }
    }
  
  //console.log("waypoints>>>>>>>",waypoints);
  
    // if (this.currentIndex < routedatajson.length) {
      
      const routingControl :any= L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
          styles: [
            {
              color: '#FFA500',
              weight: 5,
              opacity: 0.7 // Set the desired opacity
            }
          ],
          extendToWaypoints: false,
          missingRouteTolerance: 0
        },
        plan: L.Routing.plan(waypoints, {
          createMarker: function() {
              return null;
              
          }
      }),
        routeLine:  (route: any, options: any)=> {
          const polyline = L.polyline(route.coordinates, { color: color, weight: 5, opacity: 0.7 });
          const line: any = polyline;
          line.on('click',(e:any)=> {
            //console.log("e>>",e)
            line.setText('  ►  ', {
              repeat: true,
              attributes: {
                fill: 'red'
              }
            });
            line.setStyle({
            color: 'red',
          });
          });
          line.on('mouseout', (e:any)=> {
          });
          return line;
        },
      });
      this.routingControlArray.push(routingControl);
      routingControl.deviceId=deviceId;
      routingControl.color=color;
      routingControl.addTo(this.map);

            var routingControlContainer = routingControl.getContainer();
      //console.log("controlContainerParent>>>>>>>>>>>>>>>>>>",routingControlContainer);
  
      var controlContainerParent = routingControlContainer.parentNode;
      //console.log("controlContainerParent>>>>>>>>>>>>>>>>>>",controlContainerParent);
  
  // var datarouting = controlContainerParent.getContainer();
  // //console.log("datarouting>>>>>>>>>>>>>>>>>>",datarouting);
  
      this.renderer.setAttribute(controlContainerParent, 'id', 'your-id');
      //const element = document.getElementById('this.animatedmarker');
      routingControl._container.id = 'myRoute'+ animatemarker.deviceId;
      //console.log("animatemarker11111111>>>>>>>>>>>>>>>>>>",animatemarker);
      //console.log("routingControl>>>>>>>>>>>>>>>>>>",routingControl);
     
      // leaflet-routing-container leaflet-bar leaflet-control
      //const controlContainerParent = routingControl.getContainer().parentNode;
      //console.log("1111111111111.>>>>>>>>>>>>>>>>>>",routingControl._container);
      const firstChild = routingControl._container;
  
      // Create a new div element
      const div = this.renderer.createElement('div');
      div.innerHTML = animatemarker.deviceId;
      // Optionally, you can set attributes or styles for the div
      this.renderer.setAttribute(div, 'class', 'your-class');
      this.renderer.setStyle(div, 'color', `${color}`);
      firstChild.appendChild(div);
      // Append the div to the first child
      this.renderer.appendChild(firstChild, div);

      var routingControlContainer = routingControl.getContainer();
      //console.log("controlContainerParent>>>>>>>>>>>>>>>>>>",routingControlContainer);
  
      var controlContainerParent = routingControlContainer.parentNode;
      //console.log("controlContainerParent>>>>>>>>>>>>>>>>>>",controlContainerParent);
      this.renderer.setAttribute(controlContainerParent, 'id', 'your-id');
  

      
      let pathCoordinates = [];
      routingControl.on('routesfound', (event: any) => {
        //console.log("event>>>", event);
  
        this.route1 = event.routes[0];
        this.pathCoordinates = this.route1.coordinates;
        if(animatemarker.coord===undefined){
          animatemarker.coord=this.route1.coordinates;
        }else{
          animatemarker.coord=[...animatemarker.coord ,...this.route1.coordinates];
        }

        //console.log( "animatedmarkerArray >>>>>>>", this.animatedmarkerArray);

        this.pathCoordinatesDev.push( this.pathCoordinates);
        // this.infoAnimateMarker.push({device:animatemarker,coord:this.pathCoordinates,routedatajson:routedatajson});
        // //console.log("pathCoordinatesDev>>>>>>>>>>",this.pathCoordinatesDev);
        // this.animateMarker();
      });
    // }
  }

  // hideroute(event:any){
  //   //console.log("event",event);
  //   event= event.target.checked;
  //   let array:any[]=[];
  //   if(event==true){
  //     this.routingControlArray.forEach((element: any) => {
  //       const routingControl:any = L.Routing.control({
  //         waypoints: element.options.waypoints, 
  //         lineOptions: element.options.lineOptions, 
  //         plan: element.options.plan,
  //         routeLine: element.options.routeLine
  //       });

  //       routingControl.deviceId = element.deviceId;
  //       routingControl.color = element.color;
  //       routingControl.addTo(this.map);

  //       var routingControlContainer = routingControl.getContainer();
  //       var controlContainerParent = routingControlContainer.parentNode;
    
    
  //       this.renderer.setAttribute(controlContainerParent, 'id', 'your-id');
  //       routingControl._container.id = 'myRoute'+ element.deviceId;
  //       const firstChild = routingControl._container;
    
  //       const div = this.renderer.createElement('div');
  //       div.innerHTML = element.deviceId;
  //       this.renderer.setAttribute(div, 'class', 'your-class');
  //       this.renderer.setStyle(div, 'color', `${element.color}`);
  //       firstChild.appendChild(div);
  //       this.renderer.appendChild(firstChild, div);
  //       var routingControlContainer = routingControl.getContainer();
    
  //       var controlContainerParent = routingControlContainer.parentNode;
  //       this.renderer.setAttribute(controlContainerParent, 'id', 'your-id');
  //       array.push(routingControl);

  //     });
  //     this.routingControlArray=[];
  //     this.routingControlArray=array;
  //   }
  // else{
     
  //   this.routingControlArray.forEach((element:any)=>{
  //     element.remove();
  //   });
  // }
  // }
  
  // Routedevice(event :any){
  //   let deviceId=event.target.id;
  //   let checked=event.target.checked;
  //     if(checked===true){
  //     let array:any[]=[];
  //     let index;
  //       this.routingControlArray.forEach((element:any)=>{
  //         if(deviceId===element.deviceId){

  //                 const routingControl:any = L.Routing.control({
  //                   waypoints: element.options.waypoints, // Assuming waypoints are stored in options
  //                   lineOptions: element.options.lineOptions, // Assuming lineOptions are stored in options
  //                   plan: element.options.plan, // Assuming plan is stored in options
  //                   routeLine: element.options.routeLine // Assuming routeLine is stored in options
  //                 });
              
  //                 routingControl.deviceId = element.deviceId;
  //                 routingControl.color = element.color;
  //                 routingControl.addTo(this.map);
                                  
  //           var routingControlContainer = routingControl.getContainer();
        
  //           var controlContainerParent = routingControlContainer.parentNode;
  //           this.renderer.setAttribute(controlContainerParent, 'id', 'your-id');
  //           routingControl._container.id = 'myRoute'+ element.deviceId;
  //           const firstChild = routingControl._container;
        
  //           const div = this.renderer.createElement('div');
  //           div.innerHTML = element.deviceId;
  //           this.renderer.setAttribute(div, 'class', 'your-class');
  //           this.renderer.setStyle(div, 'color', `${element.color}`);
  //           firstChild.appendChild(div);
  //           this.renderer.appendChild(firstChild, div);
      
  //           var routingControlContainer = routingControl.getContainer();
        
  //           var controlContainerParent = routingControlContainer.parentNode;
  //           this.renderer.setAttribute(controlContainerParent, 'id', 'your-id');
  //           index = this.routingControlArray.indexOf(element);
  //           this.routingControlArray[index] = routingControl;
  //               }
  //       });

  //     }else{

  //       this.routingControlArray.forEach((element:any)=>{
  //         //console.log("element>>>>>>>>>>>",element.deviceId,"  deviceId >>>>>",deviceId);
  //           if(deviceId===element.deviceId){
  //             element.remove();
  //           }
              
  //       });
  //     }
  // }

  toggleBackgroundColor() {
    this.clickCount++;
    if (this.clickCount % 2 === 1) {
      this.backgroundColor = 'green';
    } else {
      this.backgroundColor = 'white';
    }
  }


  
toggleColor(){ this.isGreen = !this.isGreen;

}


  
//   async getSimulationData(obj: any) {
//     try {
//         await this.datacrowdService.getSimulationData(obj).then(async (res:any)=>{

//       let blobData: Blob = res.body;

//           const data = await this.readFile(blobData);
//       //console.log(' data:><><><><',  data);

// // let data:any;


// //         let fileReader = new FileReader();
// //         fileReader.onload = (event:any) => {
// //           // Once the FileReader has loaded the blob data, you can access it here
// //          data = fileReader.result;
// //           //console.log('Blob data:', data);

// //           // You can further process the blob data here
// //         };
// //       let x:any=  fileReader.readAsText(blobData); // You can choose the appropriate method based on your blob content type
// //       //console.log(' x:',  x);


// //         return data;
//       });
//       // //console.log(" response getSimulationData>>>>>> ", response);
//       clearInterval(this.intervalId);

//       // return response;
//     } catch (error) {
//       //console.log(" failure exception ", error);
//       //console.log("Fail - Please contact valoores team");
//       this.intervalSubscription.unsubscribe();
//     }
//   }

 


  
  displayTimelineSimul(){
    let x:any=this.dataService.getTimelineSimulID();  
    this.displayClusters(x);
  }

    analyticsroute(){
      let array:any;
      let routearray:any[]=[];
      array.forEach((route:any)=>{
        routearray.push([route[0],route[1]]);
       
      });
      $('#route').css('display', '');
    
      this.datajson=array;
       this.openTable=true;
    this.displayedColumns = ['Time','StreetName', 'Lng', 'lat'];
    this.arraystatic=routearray;
    this.isRunningRoute=true;
    this.drawroutebytime();
    }
    
    drawroutebytime(){
      $('#tabletest').css('display', '');
    
      // Assuming this.arraystatic2 contains your route points
      //console.log("count---------", this.count);
      //console.log("datajson1111111---------", this.datajson);
      //console.log("Datatable---------", this.Datatable);
      if (!this.isRunningRoute) {
        return;
      }
    
        if(this.count<=this.arraystatic.length){
          if(this.count+100>this.arraystatic.length){
          
    
            for (let i = this.count; i < this.arraystatic.length; i++) {
        
              this.arraystatic2.push(this.arraystatic[i]);
    
              let x:any = {
               
                Time: this.dateTtoDate(this.datajson[i][2]),
                StreetName: this.datajson[i][3],
                Lng: this.datajson[i][1],
                lat: this.datajson[i][0],
              }
              this.Datatable1.unshift(x);
              this.Datatable=this.Datatable1;
    
            }
    
          }else{
            for (let i = this.count; i < this.count + 100; i++) {
        
              this.arraystatic2.push(this.arraystatic[i]);
              let x:any = {
              
                 Time: this.dateTtoDate(this.datajson[i][2]),
                StreetName: this.datajson[i][3],
                Lng: this.datajson[i][1],
                lat: this.datajson[i][0],
              }
              this.Datatable1.unshift(x);
              this.Datatable=this.Datatable1;
            }
          }
          //console.log("arraystatic", this.arraystatic);
      
        //console.log("arraystatic222222", this.arraystatic2);
      
        // Create a polyline with all points except the last one
        let polyline = L.polyline(this.arraystatic2, { color: 'red' }).addTo(this.map);
        //  this.map.fitBounds(polyline.getBounds());
     
       
        let lastPoint = L.polyline([this.arraystatic2[this.arraystatic2.length - 2], this.arraystatic2[this.arraystatic2.length - 1]], { color: this.SectorColor }).addTo(this.map);
      
        // // Decorate the polyline
        // L.polylineDecorator(polyline, {
        //   patterns: [{
        //     offset: 25,
        //     repeat: 200,
        //     symbol: L.Symbol.arrowHead({
        //       pixelSize: 15,
        //       pathOptions: {
        //         fillOpacity: 1,
        //         weight: 0
        //       }
        //     })
        //   }]
        // }).addTo(this.map);
      
        // Remove previous arrow marker if exists
        if (this.arrowMarker) {
          this.map.removeLayer(this.arrowMarker);
        }
      
        // Add arrow marker at the last point
        const lastPointLatLng = this.arraystatic2[this.arraystatic2.length - 1];
        const arrowIcon = L.icon({
          iconUrl: "/cybercrowd/angular/assets/img/singleperson.png", // Path to your arrow icon
          iconSize: [32, 32], 
          iconAnchor: [10, 10],
        });
        this.arrowMarker = L.marker(lastPointLatLng, { icon: arrowIcon }).addTo(this.map);
    
        this.tablerow++;
    
        setTimeout(async () => {
    
          this.count = this.count + 100;
      
          
          await this.drawroutebytime();
       
       
        }, 1000);
      
       
      }
     
    
    
      }
    
      stopanimationRoute()
      {
        this.isRunningRoute=false;
      }

    displayallroute(){
      $('#tabletest').css('display', '');
      this.openTable=true
      let array:any=
     [{"StartTime":"2024-01-13 14:31:10","EndTime":"2024-01-13 14:31:10","Latitude":33.8807529466,"Longitude":35.6250214724,"OSM_ID":288840818,"NodeLatitude":33.880646,"NodeLongitude":35.6249198,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 14:29:22","EndTime":"2024-01-13 14:47:50","Latitude":33.8807386572,"Longitude":35.6249592998,"OSM_ID":288840818,"NodeLatitude":33.880646,"NodeLongitude":35.6249198,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 14:19:16","EndTime":"2024-01-13 15:01:34","Latitude":33.8807285918,"Longitude":35.6249400709,"OSM_ID":288840818,"NodeLatitude":33.880646,"NodeLongitude":35.6249198,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 15:06:50","EndTime":"2024-01-13 15:06:50","Latitude":33.8807208163,"Longitude":35.6249318454,"OSM_ID":288840818,"NodeLatitude":33.880646,"NodeLongitude":35.6249198,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:07:11","EndTime":"2024-01-13 15:07:11","Latitude":33.8805737491,"Longitude":35.6246455966,"OSM_ID":6642505099,"NodeLatitude":33.8805051,"NodeLongitude":35.6246428,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:07:21","EndTime":"2024-01-13 15:07:21","Latitude":null,"Longitude":null,"OSM_ID":3575436070,"NodeLatitude":33.8804283,"NodeLongitude":35.624445,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:07:31","EndTime":"2024-01-13 15:07:31","Latitude":33.8804068387,"Longitude":35.6243308831,"OSM_ID":2680339883,"NodeLatitude":33.8803938,"NodeLongitude":35.6243672,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:07:51","EndTime":"2024-01-13 15:07:51","Latitude":33.8802467062,"Longitude":35.6240600923,"OSM_ID":6642505100,"NodeLatitude":33.8802373,"NodeLongitude":35.6240621,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:08:28","EndTime":"2024-01-13 15:08:28","Latitude":33.8801935109,"Longitude":35.6238519739,"OSM_ID":7428393020,"NodeLatitude":33.8801393,"NodeLongitude":35.6238943,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:16:23","EndTime":"2024-01-13 15:16:23","Latitude":null,"Longitude":null,"OSM_ID":288840819,"NodeLatitude":33.880072,"NodeLongitude":35.6237791,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:24:19","EndTime":"2024-01-13 15:24:19","Latitude":null,"Longitude":null,"OSM_ID":3575436024,"NodeLatitude":33.8799751,"NodeLongitude":35.6235844,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:32:14","EndTime":"2024-01-13 15:32:14","Latitude":null,"Longitude":null,"OSM_ID":6642505101,"NodeLatitude":33.8799548,"NodeLongitude":35.6235267,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:10","EndTime":"2024-01-13 15:40:10","Latitude":33.8800370494,"Longitude":35.6234306472,"OSM_ID":288840982,"NodeLatitude":33.879937,"NodeLongitude":35.6233734,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:13","EndTime":"2024-01-13 15:40:13","Latitude":null,"Longitude":null,"OSM_ID":3575436012,"NodeLatitude":33.8799369,"NodeLongitude":35.6232706,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:16","EndTime":"2024-01-13 15:40:16","Latitude":null,"Longitude":null,"OSM_ID":6622448672,"NodeLatitude":33.8799147,"NodeLongitude":35.6231728,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:20","EndTime":"2024-01-13 15:40:20","Latitude":null,"Longitude":null,"OSM_ID":9317549100,"NodeLatitude":33.8798886,"NodeLongitude":35.6231029,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:23","EndTime":"2024-01-13 15:40:23","Latitude":null,"Longitude":null,"OSM_ID":3575436006,"NodeLatitude":33.8798508,"NodeLongitude":35.6230395,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:26","EndTime":"2024-01-13 15:40:26","Latitude":null,"Longitude":null,"OSM_ID":3575436002,"NodeLatitude":33.8795996,"NodeLongitude":35.6227271,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:30","EndTime":"2024-01-13 15:40:30","Latitude":33.8795020976,"Longitude":35.6225834317,"OSM_ID":6622448673,"NodeLatitude":33.879502,"NodeLongitude":35.6226174,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:36","EndTime":"2024-01-13 15:40:36","Latitude":null,"Longitude":null,"OSM_ID":290327985,"NodeLatitude":33.8792816,"NodeLongitude":35.6223838,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:43","EndTime":"2024-01-13 15:40:43","Latitude":null,"Longitude":null,"OSM_ID":288840821,"NodeLatitude":33.8788444,"NodeLongitude":35.6217676,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:40:50","EndTime":"2024-01-13 15:40:50","Latitude":33.8788334216,"Longitude":35.6216595044,"OSM_ID":3575435997,"NodeLatitude":33.8787448,"NodeLongitude":35.6216523,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 15:41:10","EndTime":"2024-01-13 15:41:10","Latitude":33.878777443,"Longitude":35.621618183,"OSM_ID":3575435997,"NodeLatitude":33.8787448,"NodeLongitude":35.6216523,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:14","EndTime":"2024-01-13 15:41:14","Latitude":null,"Longitude":null,"OSM_ID":3575435995,"NodeLatitude":33.8786685,"NodeLongitude":35.6216184,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:18","EndTime":"2024-01-13 15:41:18","Latitude":null,"Longitude":null,"OSM_ID":288840983,"NodeLatitude":33.8786113,"NodeLongitude":35.6216296,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:22","EndTime":"2024-01-13 15:41:22","Latitude":null,"Longitude":null,"OSM_ID":3575435993,"NodeLatitude":33.8785484,"NodeLongitude":35.6216791,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:26","EndTime":"2024-01-13 15:41:26","Latitude":null,"Longitude":null,"OSM_ID":5335223452,"NodeLatitude":33.8781587,"NodeLongitude":35.6219774,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:30","EndTime":"2024-01-13 15:41:30","Latitude":33.877824196,"Longitude":35.6222871761,"OSM_ID":5335223451,"NodeLatitude":33.8778424,"NodeLongitude":35.6222288,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:34","EndTime":"2024-01-13 15:41:34","Latitude":null,"Longitude":null,"OSM_ID":3245723327,"NodeLatitude":33.8776115,"NodeLongitude":35.6224202,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:38","EndTime":"2024-01-13 15:41:38","Latitude":null,"Longitude":null,"OSM_ID":288840825,"NodeLatitude":33.877399,"NodeLongitude":35.6225094,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:42","EndTime":"2024-01-13 15:41:42","Latitude":null,"Longitude":null,"OSM_ID":4507093039,"NodeLatitude":33.8770787,"NodeLongitude":35.622575,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:46","EndTime":"2024-01-13 15:41:46","Latitude":null,"Longitude":null,"OSM_ID":288840826,"NodeLatitude":33.8767702,"NodeLongitude":35.622615,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:50","EndTime":"2024-01-13 15:41:50","Latitude":33.876561644,"Longitude":35.6226335929,"OSM_ID":288840985,"NodeLatitude":33.8765319,"NodeLongitude":35.6226128,"NodeType":"Road Node","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:52","EndTime":"2024-01-13 15:41:52","Latitude":null,"Longitude":null,"OSM_ID":7428392928,"NodeLatitude":33.8762979,"NodeLongitude":35.6225891,"NodeType":"Intermediate","StreetName":"طريق برمانا"},{"StartTime":"2024-01-13 15:41:54","EndTime":"2024-01-13 15:41:54","Latitude":null,"Longitude":null,"OSM_ID":288840986,"NodeLatitude":33.8762411,"NodeLongitude":35.6225833,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:41:56","EndTime":"2024-01-13 15:41:56","Latitude":null,"Longitude":null,"OSM_ID":4507093038,"NodeLatitude":33.8760883,"NodeLongitude":35.622449,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:41:58","EndTime":"2024-01-13 15:41:58","Latitude":null,"Longitude":null,"OSM_ID":4507093032,"NodeLatitude":33.8760776,"NodeLongitude":35.6224232,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:42:00","EndTime":"2024-01-13 15:42:00","Latitude":null,"Longitude":null,"OSM_ID":5161236358,"NodeLatitude":33.876062,"NodeLongitude":35.6224012,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:42:02","EndTime":"2024-01-13 15:42:02","Latitude":null,"Longitude":null,"OSM_ID":4507093028,"NodeLatitude":33.8760426,"NodeLongitude":35.6223842,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:42:04","EndTime":"2024-01-13 15:42:04","Latitude":null,"Longitude":null,"OSM_ID":6068849628,"NodeLatitude":33.8759986,"NodeLongitude":35.6223307,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:42:06","EndTime":"2024-01-13 15:42:06","Latitude":null,"Longitude":null,"OSM_ID":4507093024,"NodeLatitude":33.8759531,"NodeLongitude":35.6221285,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:42:08","EndTime":"2024-01-13 15:42:08","Latitude":null,"Longitude":null,"OSM_ID":288840987,"NodeLatitude":33.8758796,"NodeLongitude":35.6219079,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:10","EndTime":"2024-01-13 15:42:10","Latitude":33.8759063713,"Longitude":35.6214844244,"OSM_ID":5335223446,"NodeLatitude":33.8758293,"NodeLongitude":35.6214779,"NodeType":"Road Node","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:12","EndTime":"2024-01-13 15:42:12","Latitude":null,"Longitude":null,"OSM_ID":288840988,"NodeLatitude":33.875808,"NodeLongitude":35.6210248,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:15","EndTime":"2024-01-13 15:42:15","Latitude":null,"Longitude":null,"OSM_ID":5335223445,"NodeLatitude":33.8757781,"NodeLongitude":35.6204867,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:18","EndTime":"2024-01-13 15:42:18","Latitude":null,"Longitude":null,"OSM_ID":6608165952,"NodeLatitude":33.8757594,"NodeLongitude":35.6201582,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:21","EndTime":"2024-01-13 15:42:21","Latitude":null,"Longitude":null,"OSM_ID":5335223444,"NodeLatitude":33.8757558,"NodeLongitude":35.6200951,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:24","EndTime":"2024-01-13 15:42:24","Latitude":null,"Longitude":null,"OSM_ID":288840989,"NodeLatitude":33.875738,"NodeLongitude":35.619949,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:27","EndTime":"2024-01-13 15:42:27","Latitude":null,"Longitude":null,"OSM_ID":6608181033,"NodeLatitude":33.8756968,"NodeLongitude":35.6197438,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:30","EndTime":"2024-01-13 15:42:30","Latitude":33.8757314813,"Longitude":35.6195112304,"OSM_ID":6608181035,"NodeLatitude":33.8756255,"NodeLongitude":35.6194662,"NodeType":"Road Node","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:36","EndTime":"2024-01-13 15:42:36","Latitude":null,"Longitude":null,"OSM_ID":3136623363,"NodeLatitude":33.8753617,"NodeLongitude":35.6184711,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:43","EndTime":"2024-01-13 15:42:43","Latitude":null,"Longitude":null,"OSM_ID":6608181034,"NodeLatitude":33.8752592,"NodeLongitude":35.6179976,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:50","EndTime":"2024-01-13 15:42:50","Latitude":33.8752320555,"Longitude":35.617537643,"OSM_ID":6608180961,"NodeLatitude":33.8751677,"NodeLongitude":35.6175558,"NodeType":"Road Node","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:54","EndTime":"2024-01-13 15:42:54","Latitude":null,"Longitude":null,"OSM_ID":3136623364,"NodeLatitude":33.8751111,"NodeLongitude":35.6172828,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:42:58","EndTime":"2024-01-13 15:42:58","Latitude":null,"Longitude":null,"OSM_ID":3136623362,"NodeLatitude":33.8749207,"NodeLongitude":35.6162596,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:03","EndTime":"2024-01-13 15:43:03","Latitude":null,"Longitude":null,"OSM_ID":6517851983,"NodeLatitude":33.8748116,"NodeLongitude":35.6155682,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:07","EndTime":"2024-01-13 15:43:07","Latitude":null,"Longitude":null,"OSM_ID":6715453113,"NodeLatitude":33.8747744,"NodeLongitude":35.6153873,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:12","EndTime":"2024-01-13 15:43:12","Latitude":null,"Longitude":null,"OSM_ID":4507128361,"NodeLatitude":33.8747105,"NodeLongitude":35.6151831,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:16","EndTime":"2024-01-13 15:43:16","Latitude":null,"Longitude":null,"OSM_ID":6517851982,"NodeLatitude":33.8746546,"NodeLongitude":35.6150257,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:21","EndTime":"2024-01-13 15:43:21","Latitude":null,"Longitude":null,"OSM_ID":3136623369,"NodeLatitude":33.8745807,"NodeLongitude":35.6148734,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:25","EndTime":"2024-01-13 15:43:25","Latitude":null,"Longitude":null,"OSM_ID":3136623365,"NodeLatitude":33.8744531,"NodeLongitude":35.6146375,"NodeType":"Intermediate","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:30","EndTime":"2024-01-13 15:43:30","Latitude":33.8740949945,"Longitude":35.6139648969,"OSM_ID":288840837,"NodeLatitude":33.8738732,"NodeLongitude":35.6137166,"NodeType":"Road Node","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:43:50","EndTime":"2024-01-13 15:43:50","Latitude":33.8734275955,"Longitude":35.6128639498,"OSM_ID":6608180890,"NodeLatitude":33.8735432,"NodeLongitude":35.6131738,"NodeType":"Road Node","StreetName":"برمانا"},{"StartTime":"2024-01-13 15:44:00","EndTime":"2024-01-13 15:44:00","Latitude":null,"Longitude":null,"OSM_ID":288791770,"NodeLatitude":33.8727343,"NodeLongitude":35.6118432,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:44:15","EndTime":"2024-01-13 15:44:15","Latitude":null,"Longitude":null,"OSM_ID":288791770,"NodeLatitude":33.8727343,"NodeLongitude":35.6118432,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:10","EndTime":"2024-01-13 15:44:10","Latitude":33.8727777767,"Longitude":35.6117172461,"OSM_ID":11757423829,"NodeLatitude":33.8727874,"NodeLongitude":35.6116864,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 15:44:20","EndTime":"2024-01-13 15:44:20","Latitude":null,"Longitude":null,"OSM_ID":3106369727,"NodeLatitude":33.8726264,"NodeLongitude":35.6116656,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:25","EndTime":"2024-01-13 15:44:25","Latitude":null,"Longitude":null,"OSM_ID":3106369728,"NodeLatitude":33.8725482,"NodeLongitude":35.6115762,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:30","EndTime":"2024-01-13 15:44:30","Latitude":33.8718239963,"Longitude":35.6107611448,"OSM_ID":3106369736,"NodeLatitude":33.8719863,"NodeLongitude":35.6109481,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:32","EndTime":"2024-01-13 15:44:32","Latitude":null,"Longitude":null,"OSM_ID":6517851984,"NodeLatitude":33.8714444,"NodeLongitude":35.6104338,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:35","EndTime":"2024-01-13 15:44:35","Latitude":null,"Longitude":null,"OSM_ID":6508979288,"NodeLatitude":33.8712315,"NodeLongitude":35.6102278,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:38","EndTime":"2024-01-13 15:44:38","Latitude":null,"Longitude":null,"OSM_ID":288791771,"NodeLatitude":33.8710748,"NodeLongitude":35.6100798,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:41","EndTime":"2024-01-13 15:44:41","Latitude":null,"Longitude":null,"OSM_ID":6181142047,"NodeLatitude":33.8709211,"NodeLongitude":35.609943,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:44","EndTime":"2024-01-13 15:44:44","Latitude":null,"Longitude":null,"OSM_ID":6181142046,"NodeLatitude":33.8708389,"NodeLongitude":35.609836,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:47","EndTime":"2024-01-13 15:44:47","Latitude":null,"Longitude":null,"OSM_ID":288791453,"NodeLatitude":33.870778,"NodeLongitude":35.6096971,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:50","EndTime":"2024-01-13 15:44:50","Latitude":33.8707796428,"Longitude":35.6094480251,"OSM_ID":288791773,"NodeLatitude":33.8706779,"NodeLongitude":35.6093902,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:52","EndTime":"2024-01-13 15:44:52","Latitude":null,"Longitude":null,"OSM_ID":6181142048,"NodeLatitude":33.8705344,"NodeLongitude":35.6089424,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:54","EndTime":"2024-01-13 15:44:54","Latitude":null,"Longitude":null,"OSM_ID":6508979290,"NodeLatitude":33.8704719,"NodeLongitude":35.6088459,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:56","EndTime":"2024-01-13 15:44:56","Latitude":null,"Longitude":null,"OSM_ID":288791455,"NodeLatitude":33.8703789,"NodeLongitude":35.6087629,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:44:58","EndTime":"2024-01-13 15:44:58","Latitude":null,"Longitude":null,"OSM_ID":6181142049,"NodeLatitude":33.870209,"NodeLongitude":35.6086374,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:01","EndTime":"2024-01-13 15:45:01","Latitude":null,"Longitude":null,"OSM_ID":2680231552,"NodeLatitude":33.8700191,"NodeLongitude":35.6085026,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:03","EndTime":"2024-01-13 15:45:03","Latitude":null,"Longitude":null,"OSM_ID":6715453114,"NodeLatitude":33.8699679,"NodeLongitude":35.6084521,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:05","EndTime":"2024-01-13 15:45:05","Latitude":null,"Longitude":null,"OSM_ID":3147867647,"NodeLatitude":33.8698711,"NodeLongitude":35.6082946,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:07","EndTime":"2024-01-13 15:45:07","Latitude":null,"Longitude":null,"OSM_ID":5161229817,"NodeLatitude":33.8698377,"NodeLongitude":35.608117,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:10","EndTime":"2024-01-13 15:45:10","Latitude":33.8698966074,"Longitude":35.6080299915,"OSM_ID":6426821467,"NodeLatitude":33.8698106,"NodeLongitude":35.6079952,"NodeType":"Road Node","StreetName":"Rond-Point Wakim"},{"StartTime":"2024-01-13 15:45:11","EndTime":"2024-01-13 15:45:11","Latitude":null,"Longitude":null,"OSM_ID":6663199087,"NodeLatitude":33.8698196,"NodeLongitude":35.607956,"NodeType":"Intermediate","StreetName":"Rond-Point Wakim"},{"StartTime":"2024-01-13 15:45:13","EndTime":"2024-01-13 15:45:13","Latitude":null,"Longitude":null,"OSM_ID":4507128302,"NodeLatitude":33.8698174,"NodeLongitude":35.6079132,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:15","EndTime":"2024-01-13 15:45:15","Latitude":null,"Longitude":null,"OSM_ID":5161229816,"NodeLatitude":33.8698667,"NodeLongitude":35.6077845,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:17","EndTime":"2024-01-13 15:45:17","Latitude":null,"Longitude":null,"OSM_ID":6663221676,"NodeLatitude":33.8698961,"NodeLongitude":35.607708,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:19","EndTime":"2024-01-13 15:45:19","Latitude":null,"Longitude":null,"OSM_ID":5161229815,"NodeLatitude":33.8699204,"NodeLongitude":35.6076168,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:20","EndTime":"2024-01-13 15:45:20","Latitude":null,"Longitude":null,"OSM_ID":4507128308,"NodeLatitude":33.8699283,"NodeLongitude":35.6074908,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:22","EndTime":"2024-01-13 15:45:22","Latitude":null,"Longitude":null,"OSM_ID":6663221677,"NodeLatitude":33.869925,"NodeLongitude":35.6074244,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:24","EndTime":"2024-01-13 15:45:24","Latitude":null,"Longitude":null,"OSM_ID":288791459,"NodeLatitude":33.8699145,"NodeLongitude":35.6073627,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:26","EndTime":"2024-01-13 15:45:26","Latitude":null,"Longitude":null,"OSM_ID":6715453115,"NodeLatitude":33.8698885,"NodeLongitude":35.6072603,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:28","EndTime":"2024-01-13 15:45:28","Latitude":null,"Longitude":null,"OSM_ID":3106369754,"NodeLatitude":33.8698616,"NodeLongitude":35.607179,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:30","EndTime":"2024-01-13 15:45:30","Latitude":33.8697675812,"Longitude":35.606725376,"OSM_ID":6662997952,"NodeLatitude":33.8697753,"NodeLongitude":35.6069335,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:32","EndTime":"2024-01-13 15:45:32","Latitude":null,"Longitude":null,"OSM_ID":6662997953,"NodeLatitude":33.8696439,"NodeLongitude":35.6065714,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:35","EndTime":"2024-01-13 15:45:35","Latitude":null,"Longitude":null,"OSM_ID":288791776,"NodeLatitude":33.8695743,"NodeLongitude":35.6063515,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:37","EndTime":"2024-01-13 15:45:37","Latitude":null,"Longitude":null,"OSM_ID":6662997954,"NodeLatitude":33.8695036,"NodeLongitude":35.6060605,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:40","EndTime":"2024-01-13 15:45:40","Latitude":null,"Longitude":null,"OSM_ID":288791461,"NodeLatitude":33.8694284,"NodeLongitude":35.6057956,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:42","EndTime":"2024-01-13 15:45:42","Latitude":null,"Longitude":null,"OSM_ID":6662997955,"NodeLatitude":33.8693577,"NodeLongitude":35.6056186,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:45","EndTime":"2024-01-13 15:45:45","Latitude":null,"Longitude":null,"OSM_ID":6662997957,"NodeLatitude":33.8692391,"NodeLongitude":35.6054067,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:47","EndTime":"2024-01-13 15:45:47","Latitude":null,"Longitude":null,"OSM_ID":9315519299,"NodeLatitude":33.8692141,"NodeLongitude":35.605364,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:50","EndTime":"2024-01-13 15:45:50","Latitude":33.869190484,"Longitude":35.6052279321,"OSM_ID":6662997956,"NodeLatitude":33.8691445,"NodeLongitude":35.6052451,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:45:55","EndTime":"2024-01-13 15:45:55","Latitude":null,"Longitude":null,"OSM_ID":6662997958,"NodeLatitude":33.8690314,"NodeLongitude":35.6050754,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:00","EndTime":"2024-01-13 15:46:00","Latitude":null,"Longitude":null,"OSM_ID":288791462,"NodeLatitude":33.8688677,"NodeLongitude":35.6048334,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:05","EndTime":"2024-01-13 15:46:05","Latitude":null,"Longitude":null,"OSM_ID":3147867666,"NodeLatitude":33.8687852,"NodeLongitude":35.604718,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:10","EndTime":"2024-01-13 15:46:10","Latitude":33.8685513701,"Longitude":35.604288575,"OSM_ID":6662955745,"NodeLatitude":33.8686406,"NodeLongitude":35.6045216,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:13","EndTime":"2024-01-13 15:46:13","Latitude":null,"Longitude":null,"OSM_ID":6662955746,"NodeLatitude":33.8682564,"NodeLongitude":35.6039844,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:16","EndTime":"2024-01-13 15:46:16","Latitude":null,"Longitude":null,"OSM_ID":6662955747,"NodeLatitude":33.8680448,"NodeLongitude":35.6036867,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:20","EndTime":"2024-01-13 15:46:20","Latitude":null,"Longitude":null,"OSM_ID":9318124721,"NodeLatitude":33.8678588,"NodeLongitude":35.6034272,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:23","EndTime":"2024-01-13 15:46:23","Latitude":null,"Longitude":null,"OSM_ID":4453577735,"NodeLatitude":33.8678149,"NodeLongitude":35.6033709,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:26","EndTime":"2024-01-13 15:46:26","Latitude":null,"Longitude":null,"OSM_ID":6662955748,"NodeLatitude":33.867728,"NodeLongitude":35.6032475,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:30","EndTime":"2024-01-13 15:46:30","Latitude":33.8676945917,"Longitude":35.6031140243,"OSM_ID":288791463,"NodeLatitude":33.8676612,"NodeLongitude":35.6031664,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:31","EndTime":"2024-01-13 15:46:31","Latitude":null,"Longitude":null,"OSM_ID":6662955749,"NodeLatitude":33.867605,"NodeLongitude":35.6031094,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:33","EndTime":"2024-01-13 15:46:33","Latitude":null,"Longitude":null,"OSM_ID":6662955750,"NodeLatitude":33.8674647,"NodeLongitude":35.60299,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:35","EndTime":"2024-01-13 15:46:35","Latitude":null,"Longitude":null,"OSM_ID":6662955751,"NodeLatitude":33.8673583,"NodeLongitude":35.6029116,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:37","EndTime":"2024-01-13 15:46:37","Latitude":null,"Longitude":null,"OSM_ID":288791464,"NodeLatitude":33.8672754,"NodeLongitude":35.602868,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:39","EndTime":"2024-01-13 15:46:39","Latitude":null,"Longitude":null,"OSM_ID":6662955752,"NodeLatitude":33.8671395,"NodeLongitude":35.6028163,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:40","EndTime":"2024-01-13 15:46:40","Latitude":null,"Longitude":null,"OSM_ID":288791465,"NodeLatitude":33.8669463,"NodeLongitude":35.6027694,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:42","EndTime":"2024-01-13 15:46:42","Latitude":null,"Longitude":null,"OSM_ID":6662955753,"NodeLatitude":33.8668021,"NodeLongitude":35.6027412,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:44","EndTime":"2024-01-13 15:46:44","Latitude":null,"Longitude":null,"OSM_ID":6660212495,"NodeLatitude":33.866654,"NodeLongitude":35.6027365,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:46","EndTime":"2024-01-13 15:46:46","Latitude":null,"Longitude":null,"OSM_ID":6662955754,"NodeLatitude":33.8665193,"NodeLongitude":35.6027433,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:48","EndTime":"2024-01-13 15:46:48","Latitude":null,"Longitude":null,"OSM_ID":288791777,"NodeLatitude":33.8664268,"NodeLongitude":35.602752,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:50","EndTime":"2024-01-13 15:46:50","Latitude":33.8661589791,"Longitude":35.602735827,"OSM_ID":6662955755,"NodeLatitude":33.8662542,"NodeLongitude":35.6027701,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:51","EndTime":"2024-01-13 15:46:51","Latitude":null,"Longitude":null,"OSM_ID":288791467,"NodeLatitude":33.8659597,"NodeLongitude":35.6027835,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:53","EndTime":"2024-01-13 15:46:53","Latitude":null,"Longitude":null,"OSM_ID":6660212494,"NodeLatitude":33.8656674,"NodeLongitude":35.6027493,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:55","EndTime":"2024-01-13 15:46:55","Latitude":null,"Longitude":null,"OSM_ID":288791778,"NodeLatitude":33.8654892,"NodeLongitude":35.6027412,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:57","EndTime":"2024-01-13 15:46:57","Latitude":null,"Longitude":null,"OSM_ID":6662955758,"NodeLatitude":33.8653511,"NodeLongitude":35.6027412,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:46:59","EndTime":"2024-01-13 15:46:59","Latitude":null,"Longitude":null,"OSM_ID":6662955757,"NodeLatitude":33.8652247,"NodeLongitude":35.6027493,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:00","EndTime":"2024-01-13 15:47:00","Latitude":null,"Longitude":null,"OSM_ID":6662955756,"NodeLatitude":33.8651184,"NodeLongitude":35.6027721,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:02","EndTime":"2024-01-13 15:47:02","Latitude":null,"Longitude":null,"OSM_ID":288791469,"NodeLatitude":33.8650109,"NodeLongitude":35.6028002,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:04","EndTime":"2024-01-13 15:47:04","Latitude":null,"Longitude":null,"OSM_ID":6662955759,"NodeLatitude":33.8649257,"NodeLongitude":35.6028331,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:06","EndTime":"2024-01-13 15:47:06","Latitude":null,"Longitude":null,"OSM_ID":6662955760,"NodeLatitude":33.8648272,"NodeLongitude":35.6028901,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:08","EndTime":"2024-01-13 15:47:08","Latitude":null,"Longitude":null,"OSM_ID":290329778,"NodeLatitude":33.8646896,"NodeLongitude":35.6029847,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:10","EndTime":"2024-01-13 15:47:10","Latitude":33.864504184,"Longitude":35.6031491431,"OSM_ID":5878940098,"NodeLatitude":33.8644836,"NodeLongitude":35.6031496,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:11","EndTime":"2024-01-13 15:47:11","Latitude":null,"Longitude":null,"OSM_ID":6662955763,"NodeLatitude":33.8644396,"NodeLongitude":35.6031838,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:13","EndTime":"2024-01-13 15:47:13","Latitude":null,"Longitude":null,"OSM_ID":5878940097,"NodeLatitude":33.8643767,"NodeLongitude":35.603218,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:14","EndTime":"2024-01-13 15:47:14","Latitude":null,"Longitude":null,"OSM_ID":6662955762,"NodeLatitude":33.8643233,"NodeLongitude":35.6032468,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:16","EndTime":"2024-01-13 15:47:16","Latitude":null,"Longitude":null,"OSM_ID":288791470,"NodeLatitude":33.8642453,"NodeLongitude":35.6032643,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:17","EndTime":"2024-01-13 15:47:17","Latitude":null,"Longitude":null,"OSM_ID":6662955761,"NodeLatitude":33.8641796,"NodeLongitude":35.6032643,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:19","EndTime":"2024-01-13 15:47:19","Latitude":null,"Longitude":null,"OSM_ID":6662955764,"NodeLatitude":33.8641122,"NodeLongitude":35.6032542,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:20","EndTime":"2024-01-13 15:47:20","Latitude":null,"Longitude":null,"OSM_ID":6503616912,"NodeLatitude":33.8638845,"NodeLongitude":35.6031536,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:22","EndTime":"2024-01-13 15:47:22","Latitude":null,"Longitude":null,"OSM_ID":6662955765,"NodeLatitude":33.8637576,"NodeLongitude":35.6031047,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:23","EndTime":"2024-01-13 15:47:23","Latitude":null,"Longitude":null,"OSM_ID":288791779,"NodeLatitude":33.863429,"NodeLongitude":35.6029605,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:25","EndTime":"2024-01-13 15:47:25","Latitude":null,"Longitude":null,"OSM_ID":6662955766,"NodeLatitude":33.8633567,"NodeLongitude":35.6029283,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:26","EndTime":"2024-01-13 15:47:26","Latitude":null,"Longitude":null,"OSM_ID":6662955767,"NodeLatitude":33.8633038,"NodeLongitude":35.6028961,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:28","EndTime":"2024-01-13 15:47:28","Latitude":null,"Longitude":null,"OSM_ID":6662955768,"NodeLatitude":33.8632431,"NodeLongitude":35.6028445,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:30","EndTime":"2024-01-13 15:47:30","Latitude":33.8630287688,"Longitude":35.6025677228,"OSM_ID":6662955769,"NodeLatitude":33.8630916,"NodeLongitude":35.6026943,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:31","EndTime":"2024-01-13 15:47:31","Latitude":null,"Longitude":null,"OSM_ID":6663199086,"NodeLatitude":33.862838,"NodeLongitude":35.6024536,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:32","EndTime":"2024-01-13 15:47:32","Latitude":null,"Longitude":null,"OSM_ID":6662955770,"NodeLatitude":33.8627921,"NodeLongitude":35.60241,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:34","EndTime":"2024-01-13 15:47:34","Latitude":null,"Longitude":null,"OSM_ID":6662955772,"NodeLatitude":33.8625081,"NodeLongitude":35.6021639,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:35","EndTime":"2024-01-13 15:47:35","Latitude":null,"Longitude":null,"OSM_ID":288791473,"NodeLatitude":33.8622133,"NodeLongitude":35.6018983,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:36","EndTime":"2024-01-13 15:47:36","Latitude":null,"Longitude":null,"OSM_ID":6662955775,"NodeLatitude":33.8621712,"NodeLongitude":35.6018501,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:38","EndTime":"2024-01-13 15:47:38","Latitude":null,"Longitude":null,"OSM_ID":6715453116,"NodeLatitude":33.8621429,"NodeLongitude":35.6018034,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:39","EndTime":"2024-01-13 15:47:39","Latitude":null,"Longitude":null,"OSM_ID":6662955776,"NodeLatitude":33.8621205,"NodeLongitude":35.6017468,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:40","EndTime":"2024-01-13 15:47:40","Latitude":null,"Longitude":null,"OSM_ID":6662955774,"NodeLatitude":33.8621024,"NodeLongitude":35.6016891,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:42","EndTime":"2024-01-13 15:47:42","Latitude":null,"Longitude":null,"OSM_ID":6662955777,"NodeLatitude":33.8620916,"NodeLongitude":35.6016295,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:43","EndTime":"2024-01-13 15:47:43","Latitude":null,"Longitude":null,"OSM_ID":6662955773,"NodeLatitude":33.8620896,"NodeLongitude":35.6015638,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:44","EndTime":"2024-01-13 15:47:44","Latitude":null,"Longitude":null,"OSM_ID":288791780,"NodeLatitude":33.8620921,"NodeLongitude":35.6015068,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:46","EndTime":"2024-01-13 15:47:46","Latitude":null,"Longitude":null,"OSM_ID":2680319964,"NodeLatitude":33.8620977,"NodeLongitude":35.6014417,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:47","EndTime":"2024-01-13 15:47:47","Latitude":null,"Longitude":null,"OSM_ID":6662955778,"NodeLatitude":33.8621072,"NodeLongitude":35.6013646,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:48","EndTime":"2024-01-13 15:47:48","Latitude":null,"Longitude":null,"OSM_ID":6664980632,"NodeLatitude":33.8621512,"NodeLongitude":35.6012908,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:50","EndTime":"2024-01-13 15:47:50","Latitude":33.8621998832,"Longitude":35.6012866368,"OSM_ID":6664980631,"NodeLatitude":33.8621935,"NodeLongitude":35.6012285,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:52","EndTime":"2024-01-13 15:47:52","Latitude":null,"Longitude":null,"OSM_ID":6664980630,"NodeLatitude":33.8622144,"NodeLongitude":35.6011882,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:54","EndTime":"2024-01-13 15:47:54","Latitude":null,"Longitude":null,"OSM_ID":6664980629,"NodeLatitude":33.8622311,"NodeLongitude":35.601138,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:56","EndTime":"2024-01-13 15:47:56","Latitude":null,"Longitude":null,"OSM_ID":2680235441,"NodeLatitude":33.8623566,"NodeLongitude":35.6012185,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:47:58","EndTime":"2024-01-13 15:47:58","Latitude":null,"Longitude":null,"OSM_ID":6662955784,"NodeLatitude":33.8624791,"NodeLongitude":35.601264,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:01","EndTime":"2024-01-13 15:48:01","Latitude":null,"Longitude":null,"OSM_ID":6662955783,"NodeLatitude":33.8626362,"NodeLongitude":35.601317,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:03","EndTime":"2024-01-13 15:48:03","Latitude":null,"Longitude":null,"OSM_ID":288791476,"NodeLatitude":33.8627943,"NodeLongitude":35.6013505,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:05","EndTime":"2024-01-13 15:48:05","Latitude":null,"Longitude":null,"OSM_ID":6662992185,"NodeLatitude":33.8632097,"NodeLongitude":35.6014001,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:07","EndTime":"2024-01-13 15:48:07","Latitude":null,"Longitude":null,"OSM_ID":6663135796,"NodeLatitude":33.8635072,"NodeLongitude":35.601421,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:10","EndTime":"2024-01-13 15:48:10","Latitude":33.8635959458,"Longitude":35.6014050592,"OSM_ID":4453577705,"NodeLatitude":33.8636696,"NodeLongitude":35.6014283,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:12","EndTime":"2024-01-13 15:48:12","Latitude":null,"Longitude":null,"OSM_ID":6662999433,"NodeLatitude":33.8637261,"NodeLongitude":35.6014388,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:14","EndTime":"2024-01-13 15:48:14","Latitude":null,"Longitude":null,"OSM_ID":288791781,"NodeLatitude":33.8638132,"NodeLongitude":35.6014551,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:16","EndTime":"2024-01-13 15:48:16","Latitude":null,"Longitude":null,"OSM_ID":6662992186,"NodeLatitude":33.8640493,"NodeLongitude":35.6015369,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:18","EndTime":"2024-01-13 15:48:18","Latitude":null,"Longitude":null,"OSM_ID":6503616907,"NodeLatitude":33.864232,"NodeLongitude":35.6016013,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:21","EndTime":"2024-01-13 15:48:21","Latitude":null,"Longitude":null,"OSM_ID":288791782,"NodeLatitude":33.8646206,"NodeLongitude":35.6017448,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:23","EndTime":"2024-01-13 15:48:23","Latitude":null,"Longitude":null,"OSM_ID":6662992188,"NodeLatitude":33.8648656,"NodeLongitude":35.6018092,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:25","EndTime":"2024-01-13 15:48:25","Latitude":null,"Longitude":null,"OSM_ID":288791479,"NodeLatitude":33.8650939,"NodeLongitude":35.6018427,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:27","EndTime":"2024-01-13 15:48:27","Latitude":null,"Longitude":null,"OSM_ID":6662992189,"NodeLatitude":33.8652709,"NodeLongitude":35.6018414,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:30","EndTime":"2024-01-13 15:48:30","Latitude":33.8654005032,"Longitude":35.6018460734,"OSM_ID":6662992190,"NodeLatitude":33.8654625,"NodeLongitude":35.6018333,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:32","EndTime":"2024-01-13 15:48:32","Latitude":null,"Longitude":null,"OSM_ID":288791480,"NodeLatitude":33.8656206,"NodeLongitude":35.6018025,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:35","EndTime":"2024-01-13 15:48:35","Latitude":null,"Longitude":null,"OSM_ID":6662992191,"NodeLatitude":33.8658767,"NodeLongitude":35.6017341,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:38","EndTime":"2024-01-13 15:48:38","Latitude":null,"Longitude":null,"OSM_ID":6662992192,"NodeLatitude":33.8660059,"NodeLongitude":35.6016885,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:41","EndTime":"2024-01-13 15:48:41","Latitude":null,"Longitude":null,"OSM_ID":288791481,"NodeLatitude":33.8661663,"NodeLongitude":35.601616,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:44","EndTime":"2024-01-13 15:48:44","Latitude":null,"Longitude":null,"OSM_ID":6662992193,"NodeLatitude":33.8665432,"NodeLongitude":35.6014109,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:47","EndTime":"2024-01-13 15:48:47","Latitude":null,"Longitude":null,"OSM_ID":6662992194,"NodeLatitude":33.8670616,"NodeLongitude":35.6011426,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:50","EndTime":"2024-01-13 15:48:50","Latitude":33.8672885929,"Longitude":35.6010368849,"OSM_ID":6715453117,"NodeLatitude":33.8672466,"NodeLongitude":35.6010453,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:51","EndTime":"2024-01-13 15:48:51","Latitude":null,"Longitude":null,"OSM_ID":288791482,"NodeLatitude":33.8676317,"NodeLongitude":35.6008335,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:52","EndTime":"2024-01-13 15:48:52","Latitude":null,"Longitude":null,"OSM_ID":6662992195,"NodeLatitude":33.8678088,"NodeLongitude":35.600743,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:53","EndTime":"2024-01-13 15:48:53","Latitude":null,"Longitude":null,"OSM_ID":288791483,"NodeLatitude":33.8679029,"NodeLongitude":35.6007148,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:54","EndTime":"2024-01-13 15:48:54","Latitude":null,"Longitude":null,"OSM_ID":6662992201,"NodeLatitude":33.8680125,"NodeLongitude":35.6007162,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:55","EndTime":"2024-01-13 15:48:55","Latitude":null,"Longitude":null,"OSM_ID":6662992200,"NodeLatitude":33.8680916,"NodeLongitude":35.6007336,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:56","EndTime":"2024-01-13 15:48:56","Latitude":null,"Longitude":null,"OSM_ID":6662992196,"NodeLatitude":33.8681222,"NodeLongitude":35.600747,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:57","EndTime":"2024-01-13 15:48:57","Latitude":null,"Longitude":null,"OSM_ID":6662992198,"NodeLatitude":33.8681562,"NodeLongitude":35.6007671,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:58","EndTime":"2024-01-13 15:48:58","Latitude":null,"Longitude":null,"OSM_ID":6662992199,"NodeLatitude":33.8682224,"NodeLongitude":35.6008295,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:48:59","EndTime":"2024-01-13 15:48:59","Latitude":null,"Longitude":null,"OSM_ID":6662992197,"NodeLatitude":33.8682881,"NodeLongitude":35.6008764,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:00","EndTime":"2024-01-13 15:49:00","Latitude":null,"Longitude":null,"OSM_ID":288791783,"NodeLatitude":33.8683476,"NodeLongitude":35.6009112,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:01","EndTime":"2024-01-13 15:49:01","Latitude":null,"Longitude":null,"OSM_ID":6659922632,"NodeLatitude":33.868409,"NodeLongitude":35.6009321,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:02","EndTime":"2024-01-13 15:49:02","Latitude":null,"Longitude":null,"OSM_ID":3136599024,"NodeLatitude":33.8684585,"NodeLongitude":35.6009421,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:03","EndTime":"2024-01-13 15:49:03","Latitude":null,"Longitude":null,"OSM_ID":6659922631,"NodeLatitude":33.8684891,"NodeLongitude":35.6009381,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:04","EndTime":"2024-01-13 15:49:04","Latitude":null,"Longitude":null,"OSM_ID":288794091,"NodeLatitude":33.8685181,"NodeLongitude":35.6009307,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:05","EndTime":"2024-01-13 15:49:05","Latitude":null,"Longitude":null,"OSM_ID":6659922633,"NodeLatitude":33.8685548,"NodeLongitude":35.6009207,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:06","EndTime":"2024-01-13 15:49:06","Latitude":null,"Longitude":null,"OSM_ID":6660212496,"NodeLatitude":33.868581,"NodeLongitude":35.6008999,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:07","EndTime":"2024-01-13 15:49:07","Latitude":null,"Longitude":null,"OSM_ID":6659922634,"NodeLatitude":33.8685955,"NodeLongitude":35.6008838,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:08","EndTime":"2024-01-13 15:49:08","Latitude":null,"Longitude":null,"OSM_ID":6659922635,"NodeLatitude":33.8686183,"NodeLongitude":35.6008429,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:09","EndTime":"2024-01-13 15:49:09","Latitude":null,"Longitude":null,"OSM_ID":290329851,"NodeLatitude":33.8686339,"NodeLongitude":35.6007919,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:10","EndTime":"2024-01-13 15:49:10","Latitude":33.8686899224,"Longitude":35.6007017949,"OSM_ID":6659922636,"NodeLatitude":33.8686439,"NodeLongitude":35.6007256,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:11","EndTime":"2024-01-13 15:49:11","Latitude":null,"Longitude":null,"OSM_ID":6659922637,"NodeLatitude":33.8686489,"NodeLongitude":35.6006666,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:12","EndTime":"2024-01-13 15:49:12","Latitude":null,"Longitude":null,"OSM_ID":288791485,"NodeLatitude":33.8686467,"NodeLongitude":35.6005874,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:13","EndTime":"2024-01-13 15:49:13","Latitude":null,"Longitude":null,"OSM_ID":6659922638,"NodeLatitude":33.8686256,"NodeLongitude":35.6005036,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:14","EndTime":"2024-01-13 15:49:14","Latitude":null,"Longitude":null,"OSM_ID":288791784,"NodeLatitude":33.8685738,"NodeLongitude":35.6003554,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:15","EndTime":"2024-01-13 15:49:15","Latitude":null,"Longitude":null,"OSM_ID":6659922639,"NodeLatitude":33.8685248,"NodeLongitude":35.6002602,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:16","EndTime":"2024-01-13 15:49:16","Latitude":null,"Longitude":null,"OSM_ID":288794092,"NodeLatitude":33.8684713,"NodeLongitude":35.6001703,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:17","EndTime":"2024-01-13 15:49:17","Latitude":null,"Longitude":null,"OSM_ID":6660212497,"NodeLatitude":33.8684346,"NodeLongitude":35.6001341,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:18","EndTime":"2024-01-13 15:49:18","Latitude":null,"Longitude":null,"OSM_ID":6659922640,"NodeLatitude":33.8683889,"NodeLongitude":35.6001019,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:19","EndTime":"2024-01-13 15:49:19","Latitude":null,"Longitude":null,"OSM_ID":6659518721,"NodeLatitude":33.8683299,"NodeLongitude":35.6000738,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:20","EndTime":"2024-01-13 15:49:20","Latitude":null,"Longitude":null,"OSM_ID":288791785,"NodeLatitude":33.868262,"NodeLongitude":35.6000456,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:21","EndTime":"2024-01-13 15:49:21","Latitude":null,"Longitude":null,"OSM_ID":6659518724,"NodeLatitude":33.8681818,"NodeLongitude":35.6000148,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:22","EndTime":"2024-01-13 15:49:22","Latitude":null,"Longitude":null,"OSM_ID":6659518723,"NodeLatitude":33.8680691,"NodeLongitude":35.5999831,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:23","EndTime":"2024-01-13 15:49:23","Latitude":null,"Longitude":null,"OSM_ID":6659518722,"NodeLatitude":33.8679623,"NodeLongitude":35.5999651,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:24","EndTime":"2024-01-13 15:49:24","Latitude":null,"Longitude":null,"OSM_ID":6715453118,"NodeLatitude":33.8678563,"NodeLongitude":35.5999497,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:25","EndTime":"2024-01-13 15:49:25","Latitude":null,"Longitude":null,"OSM_ID":288791488,"NodeLatitude":33.8677616,"NodeLongitude":35.5999424,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:26","EndTime":"2024-01-13 15:49:26","Latitude":null,"Longitude":null,"OSM_ID":6659518725,"NodeLatitude":33.8676845,"NodeLongitude":35.5999375,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:27","EndTime":"2024-01-13 15:49:27","Latitude":null,"Longitude":null,"OSM_ID":6659518726,"NodeLatitude":33.8675618,"NodeLongitude":35.599937,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:28","EndTime":"2024-01-13 15:49:28","Latitude":null,"Longitude":null,"OSM_ID":6659518727,"NodeLatitude":33.8674615,"NodeLongitude":35.5999539,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:29","EndTime":"2024-01-13 15:49:29","Latitude":null,"Longitude":null,"OSM_ID":3227075364,"NodeLatitude":33.8673455,"NodeLongitude":35.5999799,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:30","EndTime":"2024-01-13 15:49:30","Latitude":33.8671035364,"Longitude":35.6000603218,"OSM_ID":288791489,"NodeLatitude":33.867194,"NodeLongitude":35.6000255,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:31","EndTime":"2024-01-13 15:49:31","Latitude":null,"Longitude":null,"OSM_ID":6659518714,"NodeLatitude":33.8667008,"NodeLongitude":35.60022,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:32","EndTime":"2024-01-13 15:49:32","Latitude":null,"Longitude":null,"OSM_ID":288791786,"NodeLatitude":33.8663043,"NodeLongitude":35.6003688,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:34","EndTime":"2024-01-13 15:49:34","Latitude":null,"Longitude":null,"OSM_ID":6659518715,"NodeLatitude":33.8661735,"NodeLongitude":35.6004124,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:35","EndTime":"2024-01-13 15:49:35","Latitude":null,"Longitude":null,"OSM_ID":6663000367,"NodeLatitude":33.8660905,"NodeLongitude":35.6004345,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:37","EndTime":"2024-01-13 15:49:37","Latitude":null,"Longitude":null,"OSM_ID":4453577730,"NodeLatitude":33.8660031,"NodeLongitude":35.6004433,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:38","EndTime":"2024-01-13 15:49:38","Latitude":null,"Longitude":null,"OSM_ID":6659518716,"NodeLatitude":33.8658739,"NodeLongitude":35.6004533,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:40","EndTime":"2024-01-13 15:49:40","Latitude":null,"Longitude":null,"OSM_ID":288791491,"NodeLatitude":33.8657498,"NodeLongitude":35.6004547,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:41","EndTime":"2024-01-13 15:49:41","Latitude":null,"Longitude":null,"OSM_ID":6659518718,"NodeLatitude":33.8656646,"NodeLongitude":35.6004473,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:42","EndTime":"2024-01-13 15:49:42","Latitude":null,"Longitude":null,"OSM_ID":6659518717,"NodeLatitude":33.8655835,"NodeLongitude":35.6004443,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:44","EndTime":"2024-01-13 15:49:44","Latitude":null,"Longitude":null,"OSM_ID":6659518719,"NodeLatitude":33.8654243,"NodeLongitude":35.6004308,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:45","EndTime":"2024-01-13 15:49:45","Latitude":null,"Longitude":null,"OSM_ID":6663000366,"NodeLatitude":33.8653716,"NodeLongitude":35.6004238,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:47","EndTime":"2024-01-13 15:49:47","Latitude":null,"Longitude":null,"OSM_ID":288791787,"NodeLatitude":33.8653088,"NodeLongitude":35.6004093,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:48","EndTime":"2024-01-13 15:49:48","Latitude":null,"Longitude":null,"OSM_ID":6659518720,"NodeLatitude":33.8652283,"NodeLongitude":35.6003863,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:50","EndTime":"2024-01-13 15:49:50","Latitude":33.8652269256,"Longitude":35.600272685,"OSM_ID":4453577729,"NodeLatitude":33.8651668,"NodeLongitude":35.6003288,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:51","EndTime":"2024-01-13 15:49:51","Latitude":null,"Longitude":null,"OSM_ID":6659518729,"NodeLatitude":33.8650935,"NodeLongitude":35.6002354,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:52","EndTime":"2024-01-13 15:49:52","Latitude":null,"Longitude":null,"OSM_ID":288791493,"NodeLatitude":33.8650303,"NodeLongitude":35.600125,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:53","EndTime":"2024-01-13 15:49:53","Latitude":null,"Longitude":null,"OSM_ID":4453577724,"NodeLatitude":33.8649836,"NodeLongitude":35.6000056,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:54","EndTime":"2024-01-13 15:49:54","Latitude":null,"Longitude":null,"OSM_ID":6659518728,"NodeLatitude":33.8649452,"NodeLongitude":35.5998683,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:55","EndTime":"2024-01-13 15:49:55","Latitude":null,"Longitude":null,"OSM_ID":3136598998,"NodeLatitude":33.8649312,"NodeLongitude":35.5997408,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:57","EndTime":"2024-01-13 15:49:57","Latitude":null,"Longitude":null,"OSM_ID":288791788,"NodeLatitude":33.8649324,"NodeLongitude":35.5996138,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:58","EndTime":"2024-01-13 15:49:58","Latitude":null,"Longitude":null,"OSM_ID":4453577723,"NodeLatitude":33.8649357,"NodeLongitude":35.5993536,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:49:59","EndTime":"2024-01-13 15:49:59","Latitude":null,"Longitude":null,"OSM_ID":6659518731,"NodeLatitude":33.8649321,"NodeLongitude":35.5992634,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:00","EndTime":"2024-01-13 15:50:00","Latitude":null,"Longitude":null,"OSM_ID":4453577727,"NodeLatitude":33.8649221,"NodeLongitude":35.5991974,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:01","EndTime":"2024-01-13 15:50:01","Latitude":null,"Longitude":null,"OSM_ID":6659518730,"NodeLatitude":33.8649048,"NodeLongitude":35.5991571,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:02","EndTime":"2024-01-13 15:50:02","Latitude":null,"Longitude":null,"OSM_ID":288791789,"NodeLatitude":33.8648879,"NodeLongitude":35.5991149,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:04","EndTime":"2024-01-13 15:50:04","Latitude":null,"Longitude":null,"OSM_ID":4453577728,"NodeLatitude":33.8648595,"NodeLongitude":35.5990626,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:05","EndTime":"2024-01-13 15:50:05","Latitude":null,"Longitude":null,"OSM_ID":4453577725,"NodeLatitude":33.8648166,"NodeLongitude":35.5990076,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:06","EndTime":"2024-01-13 15:50:06","Latitude":null,"Longitude":null,"OSM_ID":6659518732,"NodeLatitude":33.8647415,"NodeLongitude":35.5989627,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:07","EndTime":"2024-01-13 15:50:07","Latitude":null,"Longitude":null,"OSM_ID":4453577726,"NodeLatitude":33.8646546,"NodeLongitude":35.5989244,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:08","EndTime":"2024-01-13 15:50:08","Latitude":null,"Longitude":null,"OSM_ID":288791496,"NodeLatitude":33.8645755,"NodeLongitude":35.598905,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:10","EndTime":"2024-01-13 15:50:10","Latitude":33.8642019556,"Longitude":35.5988572249,"OSM_ID":288791497,"NodeLatitude":33.8641629,"NodeLongitude":35.5988402,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:11","EndTime":"2024-01-13 15:50:11","Latitude":null,"Longitude":null,"OSM_ID":6659518734,"NodeLatitude":33.8640509,"NodeLongitude":35.5988214,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:12","EndTime":"2024-01-13 15:50:12","Latitude":null,"Longitude":null,"OSM_ID":6659518733,"NodeLatitude":33.863991,"NodeLongitude":35.5988083,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:13","EndTime":"2024-01-13 15:50:13","Latitude":null,"Longitude":null,"OSM_ID":3136599025,"NodeLatitude":33.863943,"NodeLongitude":35.5987671,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:15","EndTime":"2024-01-13 15:50:15","Latitude":null,"Longitude":null,"OSM_ID":6659518736,"NodeLatitude":33.8639145,"NodeLongitude":35.5987193,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:16","EndTime":"2024-01-13 15:50:16","Latitude":null,"Longitude":null,"OSM_ID":6659518737,"NodeLatitude":33.863894,"NodeLongitude":35.5986275,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:17","EndTime":"2024-01-13 15:50:17","Latitude":null,"Longitude":null,"OSM_ID":288791790,"NodeLatitude":33.8638923,"NodeLongitude":35.598512,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:18","EndTime":"2024-01-13 15:50:18","Latitude":null,"Longitude":null,"OSM_ID":6133596880,"NodeLatitude":33.8638974,"NodeLongitude":35.5984606,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:20","EndTime":"2024-01-13 15:50:20","Latitude":null,"Longitude":null,"OSM_ID":6659518739,"NodeLatitude":33.8639107,"NodeLongitude":35.5983258,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:21","EndTime":"2024-01-13 15:50:21","Latitude":null,"Longitude":null,"OSM_ID":6659518740,"NodeLatitude":33.8639307,"NodeLongitude":35.5982061,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:22","EndTime":"2024-01-13 15:50:22","Latitude":null,"Longitude":null,"OSM_ID":6659518738,"NodeLatitude":33.8639451,"NodeLongitude":35.5981193,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:23","EndTime":"2024-01-13 15:50:23","Latitude":null,"Longitude":null,"OSM_ID":288791791,"NodeLatitude":33.8639612,"NodeLongitude":35.5980353,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:25","EndTime":"2024-01-13 15:50:25","Latitude":null,"Longitude":null,"OSM_ID":6659518741,"NodeLatitude":33.8639563,"NodeLongitude":35.5979041,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:26","EndTime":"2024-01-13 15:50:26","Latitude":null,"Longitude":null,"OSM_ID":6659518742,"NodeLatitude":33.8639403,"NodeLongitude":35.5977805,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:27","EndTime":"2024-01-13 15:50:27","Latitude":null,"Longitude":null,"OSM_ID":288791792,"NodeLatitude":33.8639083,"NodeLongitude":35.5976068,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:28","EndTime":"2024-01-13 15:50:28","Latitude":null,"Longitude":null,"OSM_ID":6659518743,"NodeLatitude":33.8638594,"NodeLongitude":35.5973849,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:30","EndTime":"2024-01-13 15:50:30","Latitude":33.863855055,"Longitude":35.5970200225,"OSM_ID":6659518744,"NodeLatitude":33.8637809,"NodeLongitude":35.5970104,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:32","EndTime":"2024-01-13 15:50:32","Latitude":null,"Longitude":null,"OSM_ID":6659884403,"NodeLatitude":33.8637552,"NodeLongitude":35.5968753,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:34","EndTime":"2024-01-13 15:50:34","Latitude":null,"Longitude":null,"OSM_ID":6659518745,"NodeLatitude":33.8637108,"NodeLongitude":35.5965353,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:36","EndTime":"2024-01-13 15:50:36","Latitude":null,"Longitude":null,"OSM_ID":6659518746,"NodeLatitude":33.8636733,"NodeLongitude":35.5963703,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:38","EndTime":"2024-01-13 15:50:38","Latitude":null,"Longitude":null,"OSM_ID":6715415223,"NodeLatitude":33.8636006,"NodeLongitude":35.5961541,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:41","EndTime":"2024-01-13 15:50:41","Latitude":null,"Longitude":null,"OSM_ID":288791793,"NodeLatitude":33.8635228,"NodeLongitude":35.5960239,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:43","EndTime":"2024-01-13 15:50:43","Latitude":null,"Longitude":null,"OSM_ID":288791794,"NodeLatitude":33.8632745,"NodeLongitude":35.5956204,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:45","EndTime":"2024-01-13 15:50:45","Latitude":null,"Longitude":null,"OSM_ID":6659518747,"NodeLatitude":33.8632163,"NodeLongitude":35.595516,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:47","EndTime":"2024-01-13 15:50:47","Latitude":null,"Longitude":null,"OSM_ID":3136607848,"NodeLatitude":33.8631626,"NodeLongitude":35.5954289,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:50","EndTime":"2024-01-13 15:50:50","Latitude":33.8631627891,"Longitude":35.5953454495,"OSM_ID":6659518748,"NodeLatitude":33.8631211,"NodeLongitude":35.5953762,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:51","EndTime":"2024-01-13 15:50:51","Latitude":null,"Longitude":null,"OSM_ID":5334623446,"NodeLatitude":33.8630834,"NodeLongitude":35.5953401,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:52","EndTime":"2024-01-13 15:50:52","Latitude":null,"Longitude":null,"OSM_ID":6659518749,"NodeLatitude":33.8630401,"NodeLongitude":35.5953132,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:54","EndTime":"2024-01-13 15:50:54","Latitude":null,"Longitude":null,"OSM_ID":288791503,"NodeLatitude":33.8629869,"NodeLongitude":35.5952891,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:55","EndTime":"2024-01-13 15:50:55","Latitude":null,"Longitude":null,"OSM_ID":6659518750,"NodeLatitude":33.8629402,"NodeLongitude":35.5952767,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:57","EndTime":"2024-01-13 15:50:57","Latitude":null,"Longitude":null,"OSM_ID":5334623445,"NodeLatitude":33.8628879,"NodeLongitude":35.5952689,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:50:58","EndTime":"2024-01-13 15:50:58","Latitude":null,"Longitude":null,"OSM_ID":6659518751,"NodeLatitude":33.8628491,"NodeLongitude":35.5952689,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:00","EndTime":"2024-01-13 15:51:00","Latitude":null,"Longitude":null,"OSM_ID":5334623444,"NodeLatitude":33.8627952,"NodeLongitude":35.5952745,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:01","EndTime":"2024-01-13 15:51:01","Latitude":null,"Longitude":null,"OSM_ID":288791795,"NodeLatitude":33.8626033,"NodeLongitude":35.5953155,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:02","EndTime":"2024-01-13 15:51:02","Latitude":null,"Longitude":null,"OSM_ID":6659884391,"NodeLatitude":33.8625042,"NodeLongitude":35.5953363,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:04","EndTime":"2024-01-13 15:51:04","Latitude":null,"Longitude":null,"OSM_ID":6659518752,"NodeLatitude":33.8624435,"NodeLongitude":35.5953491,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:05","EndTime":"2024-01-13 15:51:05","Latitude":null,"Longitude":null,"OSM_ID":4453577696,"NodeLatitude":33.862211,"NodeLongitude":35.5954032,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:07","EndTime":"2024-01-13 15:51:07","Latitude":null,"Longitude":null,"OSM_ID":3128749518,"NodeLatitude":33.8618903,"NodeLongitude":35.595487,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:08","EndTime":"2024-01-13 15:51:08","Latitude":null,"Longitude":null,"OSM_ID":288791505,"NodeLatitude":33.8616795,"NodeLongitude":35.5955502,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:10","EndTime":"2024-01-13 15:51:10","Latitude":33.8614944515,"Longitude":35.5956115592,"OSM_ID":4507423363,"NodeLatitude":33.8614763,"NodeLongitude":35.5956193,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:11","EndTime":"2024-01-13 15:51:11","Latitude":null,"Longitude":null,"OSM_ID":6659518753,"NodeLatitude":33.861434,"NodeLongitude":35.5956267,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:13","EndTime":"2024-01-13 15:51:13","Latitude":null,"Longitude":null,"OSM_ID":4507423362,"NodeLatitude":33.8613868,"NodeLongitude":35.5956215,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:15","EndTime":"2024-01-13 15:51:15","Latitude":null,"Longitude":null,"OSM_ID":6659518754,"NodeLatitude":33.8613509,"NodeLongitude":35.5956051,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:16","EndTime":"2024-01-13 15:51:16","Latitude":null,"Longitude":null,"OSM_ID":288791506,"NodeLatitude":33.8613167,"NodeLongitude":35.5955767,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:18","EndTime":"2024-01-13 15:51:18","Latitude":null,"Longitude":null,"OSM_ID":6659518755,"NodeLatitude":33.8612969,"NodeLongitude":35.5955474,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:20","EndTime":"2024-01-13 15:51:20","Latitude":null,"Longitude":null,"OSM_ID":4507423360,"NodeLatitude":33.8612753,"NodeLongitude":35.5955033,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:21","EndTime":"2024-01-13 15:51:21","Latitude":null,"Longitude":null,"OSM_ID":3106369640,"NodeLatitude":33.8612491,"NodeLongitude":35.5954289,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:23","EndTime":"2024-01-13 15:51:23","Latitude":null,"Longitude":null,"OSM_ID":288791796,"NodeLatitude":33.8612063,"NodeLongitude":35.5952592,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:25","EndTime":"2024-01-13 15:51:25","Latitude":null,"Longitude":null,"OSM_ID":6659518756,"NodeLatitude":33.8611227,"NodeLongitude":35.5949092,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:26","EndTime":"2024-01-13 15:51:26","Latitude":null,"Longitude":null,"OSM_ID":6715415224,"NodeLatitude":33.8610258,"NodeLongitude":35.5944984,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:28","EndTime":"2024-01-13 15:51:28","Latitude":null,"Longitude":null,"OSM_ID":288791797,"NodeLatitude":33.8609401,"NodeLongitude":35.5941381,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:30","EndTime":"2024-01-13 15:51:30","Latitude":33.8608796989,"Longitude":35.5936039626,"OSM_ID":6659518757,"NodeLatitude":33.8607998,"NodeLongitude":35.5935895,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:32","EndTime":"2024-01-13 15:51:32","Latitude":null,"Longitude":null,"OSM_ID":6659518758,"NodeLatitude":33.8606723,"NodeLongitude":35.5931792,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:34","EndTime":"2024-01-13 15:51:34","Latitude":null,"Longitude":null,"OSM_ID":288791509,"NodeLatitude":33.8606171,"NodeLongitude":35.5930417,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:36","EndTime":"2024-01-13 15:51:36","Latitude":null,"Longitude":null,"OSM_ID":6659518759,"NodeLatitude":33.8605353,"NodeLongitude":35.5928928,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:38","EndTime":"2024-01-13 15:51:38","Latitude":null,"Longitude":null,"OSM_ID":6659518760,"NodeLatitude":33.8604512,"NodeLongitude":35.5927661,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:41","EndTime":"2024-01-13 15:51:41","Latitude":null,"Longitude":null,"OSM_ID":288791798,"NodeLatitude":33.8603131,"NodeLongitude":35.5925743,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:43","EndTime":"2024-01-13 15:51:43","Latitude":null,"Longitude":null,"OSM_ID":6643759835,"NodeLatitude":33.8600959,"NodeLongitude":35.592286,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:45","EndTime":"2024-01-13 15:51:45","Latitude":null,"Longitude":null,"OSM_ID":6643904945,"NodeLatitude":33.860066,"NodeLongitude":35.592241,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:47","EndTime":"2024-01-13 15:51:47","Latitude":null,"Longitude":null,"OSM_ID":4507423348,"NodeLatitude":33.85992,"NodeLongitude":35.5920218,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:50","EndTime":"2024-01-13 15:51:50","Latitude":33.8598334021,"Longitude":35.5917674702,"OSM_ID":6643759836,"NodeLatitude":33.8597741,"NodeLongitude":35.5918233,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:51","EndTime":"2024-01-13 15:51:51","Latitude":null,"Longitude":null,"OSM_ID":288791511,"NodeLatitude":33.8595998,"NodeLongitude":35.5915792,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:53","EndTime":"2024-01-13 15:51:53","Latitude":null,"Longitude":null,"OSM_ID":6643759833,"NodeLatitude":33.8595347,"NodeLongitude":35.5915001,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:54","EndTime":"2024-01-13 15:51:54","Latitude":null,"Longitude":null,"OSM_ID":3106361528,"NodeLatitude":33.8594255,"NodeLongitude":35.5913814,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:56","EndTime":"2024-01-13 15:51:56","Latitude":null,"Longitude":null,"OSM_ID":6643759832,"NodeLatitude":33.8593955,"NodeLongitude":35.5913533,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:57","EndTime":"2024-01-13 15:51:57","Latitude":null,"Longitude":null,"OSM_ID":6643759837,"NodeLatitude":33.8593643,"NodeLongitude":35.5913372,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:51:59","EndTime":"2024-01-13 15:51:59","Latitude":null,"Longitude":null,"OSM_ID":6643759834,"NodeLatitude":33.8593086,"NodeLongitude":35.591311,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:00","EndTime":"2024-01-13 15:52:00","Latitude":null,"Longitude":null,"OSM_ID":288791799,"NodeLatitude":33.8592323,"NodeLongitude":35.5912875,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:02","EndTime":"2024-01-13 15:52:02","Latitude":null,"Longitude":null,"OSM_ID":6643759831,"NodeLatitude":33.8591438,"NodeLongitude":35.5912681,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:03","EndTime":"2024-01-13 15:52:03","Latitude":null,"Longitude":null,"OSM_ID":6643759838,"NodeLatitude":33.8590369,"NodeLongitude":35.5912346,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:05","EndTime":"2024-01-13 15:52:05","Latitude":null,"Longitude":null,"OSM_ID":2407057492,"NodeLatitude":33.858851,"NodeLongitude":35.5911775,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:06","EndTime":"2024-01-13 15:52:06","Latitude":null,"Longitude":null,"OSM_ID":288791800,"NodeLatitude":33.8587196,"NodeLongitude":35.591129,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:08","EndTime":"2024-01-13 15:52:08","Latitude":null,"Longitude":null,"OSM_ID":6715415225,"NodeLatitude":33.8586499,"NodeLongitude":35.5910958,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:10","EndTime":"2024-01-13 15:52:10","Latitude":33.858583185,"Longitude":35.5910189553,"OSM_ID":4507423340,"NodeLatitude":33.8585524,"NodeLongitude":35.5910495,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:11","EndTime":"2024-01-13 15:52:11","Latitude":null,"Longitude":null,"OSM_ID":6643759840,"NodeLatitude":33.8584121,"NodeLongitude":35.5909824,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:13","EndTime":"2024-01-13 15:52:13","Latitude":null,"Longitude":null,"OSM_ID":288791514,"NodeLatitude":33.8582907,"NodeLongitude":35.5909073,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:15","EndTime":"2024-01-13 15:52:15","Latitude":null,"Longitude":null,"OSM_ID":6643759839,"NodeLatitude":33.8581671,"NodeLongitude":35.5908054,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:16","EndTime":"2024-01-13 15:52:16","Latitude":null,"Longitude":null,"OSM_ID":6663124810,"NodeLatitude":33.8580802,"NodeLongitude":35.5907102,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:18","EndTime":"2024-01-13 15:52:18","Latitude":null,"Longitude":null,"OSM_ID":6643759841,"NodeLatitude":33.8580023,"NodeLongitude":35.5905868,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:20","EndTime":"2024-01-13 15:52:20","Latitude":null,"Longitude":null,"OSM_ID":6643759842,"NodeLatitude":33.8579588,"NodeLongitude":35.5904929,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:21","EndTime":"2024-01-13 15:52:21","Latitude":null,"Longitude":null,"OSM_ID":288791801,"NodeLatitude":33.8578786,"NodeLongitude":35.5903186,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:23","EndTime":"2024-01-13 15:52:23","Latitude":null,"Longitude":null,"OSM_ID":6643759843,"NodeLatitude":33.8578152,"NodeLongitude":35.5901439,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:25","EndTime":"2024-01-13 15:52:25","Latitude":null,"Longitude":null,"OSM_ID":6663124811,"NodeLatitude":33.8577798,"NodeLongitude":35.5900349,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:26","EndTime":"2024-01-13 15:52:26","Latitude":null,"Longitude":null,"OSM_ID":6643759844,"NodeLatitude":33.8577517,"NodeLongitude":35.589923,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:28","EndTime":"2024-01-13 15:52:28","Latitude":null,"Longitude":null,"OSM_ID":288791802,"NodeLatitude":33.8576993,"NodeLongitude":35.5896226,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:30","EndTime":"2024-01-13 15:52:30","Latitude":33.8577629333,"Longitude":35.5894751352,"OSM_ID":6643759830,"NodeLatitude":33.8576648,"NodeLongitude":35.5894298,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:31","EndTime":"2024-01-13 15:52:31","Latitude":null,"Longitude":null,"OSM_ID":6663124812,"NodeLatitude":33.8576439,"NodeLongitude":35.5892953,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:33","EndTime":"2024-01-13 15:52:33","Latitude":null,"Longitude":null,"OSM_ID":6643759829,"NodeLatitude":33.8576127,"NodeLongitude":35.5891478,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:35","EndTime":"2024-01-13 15:52:35","Latitude":null,"Longitude":null,"OSM_ID":6663124813,"NodeLatitude":33.8575813,"NodeLongitude":35.5890392,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:36","EndTime":"2024-01-13 15:52:36","Latitude":null,"Longitude":null,"OSM_ID":288791803,"NodeLatitude":33.8574888,"NodeLongitude":35.5888085,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:38","EndTime":"2024-01-13 15:52:38","Latitude":null,"Longitude":null,"OSM_ID":4443311188,"NodeLatitude":33.8573674,"NodeLongitude":35.5886234,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:40","EndTime":"2024-01-13 15:52:40","Latitude":null,"Longitude":null,"OSM_ID":6663124814,"NodeLatitude":33.8573006,"NodeLongitude":35.5885604,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:41","EndTime":"2024-01-13 15:52:41","Latitude":null,"Longitude":null,"OSM_ID":288791804,"NodeLatitude":33.8571973,"NodeLongitude":35.5884638,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:43","EndTime":"2024-01-13 15:52:43","Latitude":null,"Longitude":null,"OSM_ID":6663124815,"NodeLatitude":33.8570668,"NodeLongitude":35.5883753,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:45","EndTime":"2024-01-13 15:52:45","Latitude":null,"Longitude":null,"OSM_ID":6133596884,"NodeLatitude":33.8569819,"NodeLongitude":35.5883124,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:46","EndTime":"2024-01-13 15:52:46","Latitude":null,"Longitude":null,"OSM_ID":288791805,"NodeLatitude":33.8569186,"NodeLongitude":35.5882654,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:48","EndTime":"2024-01-13 15:52:48","Latitude":null,"Longitude":null,"OSM_ID":6663124816,"NodeLatitude":33.8568073,"NodeLongitude":35.5881701,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:50","EndTime":"2024-01-13 15:52:50","Latitude":33.8566822344,"Longitude":35.5879122679,"OSM_ID":6663124817,"NodeLatitude":33.8566257,"NodeLongitude":35.5879797,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:51","EndTime":"2024-01-13 15:52:51","Latitude":null,"Longitude":null,"OSM_ID":6663124818,"NodeLatitude":33.8565745,"NodeLongitude":35.5879113,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:53","EndTime":"2024-01-13 15:52:53","Latitude":null,"Longitude":null,"OSM_ID":288791806,"NodeLatitude":33.8565144,"NodeLongitude":35.5878406,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:55","EndTime":"2024-01-13 15:52:55","Latitude":null,"Longitude":null,"OSM_ID":3070046403,"NodeLatitude":33.8564623,"NodeLongitude":35.5877976,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:56","EndTime":"2024-01-13 15:52:56","Latitude":null,"Longitude":null,"OSM_ID":6663124819,"NodeLatitude":33.8563498,"NodeLongitude":35.5877517,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:52:58","EndTime":"2024-01-13 15:52:58","Latitude":null,"Longitude":null,"OSM_ID":288791521,"NodeLatitude":33.856109,"NodeLongitude":35.5877095,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:00","EndTime":"2024-01-13 15:53:00","Latitude":null,"Longitude":null,"OSM_ID":4453577695,"NodeLatitude":33.8560137,"NodeLongitude":35.5876894,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:01","EndTime":"2024-01-13 15:53:01","Latitude":null,"Longitude":null,"OSM_ID":3106361548,"NodeLatitude":33.8559046,"NodeLongitude":35.5876565,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:03","EndTime":"2024-01-13 15:53:03","Latitude":null,"Longitude":null,"OSM_ID":4453577694,"NodeLatitude":33.8557882,"NodeLongitude":35.5875874,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:05","EndTime":"2024-01-13 15:53:05","Latitude":null,"Longitude":null,"OSM_ID":288791807,"NodeLatitude":33.8556958,"NodeLongitude":35.5874902,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:06","EndTime":"2024-01-13 15:53:06","Latitude":null,"Longitude":null,"OSM_ID":3136607880,"NodeLatitude":33.8556362,"NodeLongitude":35.5873755,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:08","EndTime":"2024-01-13 15:53:08","Latitude":null,"Longitude":null,"OSM_ID":6663124820,"NodeLatitude":33.8555889,"NodeLongitude":35.5872019,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:10","EndTime":"2024-01-13 15:53:10","Latitude":33.8555949427,"Longitude":35.5869395408,"OSM_ID":288791523,"NodeLatitude":33.855546,"NodeLongitude":35.5869987,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:12","EndTime":"2024-01-13 15:53:12","Latitude":null,"Longitude":null,"OSM_ID":6133596985,"NodeLatitude":33.8555053,"NodeLongitude":35.5867606,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:15","EndTime":"2024-01-13 15:53:15","Latitude":null,"Longitude":null,"OSM_ID":288791524,"NodeLatitude":33.8554212,"NodeLongitude":35.5862028,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:17","EndTime":"2024-01-13 15:53:17","Latitude":null,"Longitude":null,"OSM_ID":6663124822,"NodeLatitude":33.855419,"NodeLongitude":35.5860794,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:20","EndTime":"2024-01-13 15:53:20","Latitude":null,"Longitude":null,"OSM_ID":724318446,"NodeLatitude":33.8553528,"NodeLongitude":35.5857617,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:22","EndTime":"2024-01-13 15:53:22","Latitude":null,"Longitude":null,"OSM_ID":6663124823,"NodeLatitude":33.855324,"NodeLongitude":35.5856609,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:25","EndTime":"2024-01-13 15:53:25","Latitude":null,"Longitude":null,"OSM_ID":6772686530,"NodeLatitude":33.8552751,"NodeLongitude":35.5854447,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:27","EndTime":"2024-01-13 15:53:27","Latitude":null,"Longitude":null,"OSM_ID":6663124824,"NodeLatitude":33.8552431,"NodeLongitude":35.5853454,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:30","EndTime":"2024-01-13 15:53:30","Latitude":33.8552670112,"Longitude":35.585148419,"OSM_ID":288791525,"NodeLatitude":33.8552102,"NodeLongitude":35.5851345,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:31","EndTime":"2024-01-13 15:53:31","Latitude":null,"Longitude":null,"OSM_ID":6663124825,"NodeLatitude":33.8551913,"NodeLongitude":35.5848644,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:33","EndTime":"2024-01-13 15:53:33","Latitude":null,"Longitude":null,"OSM_ID":6663124826,"NodeLatitude":33.8551744,"NodeLongitude":35.584497,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:35","EndTime":"2024-01-13 15:53:35","Latitude":null,"Longitude":null,"OSM_ID":6663124827,"NodeLatitude":33.855161,"NodeLongitude":35.5841071,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:36","EndTime":"2024-01-13 15:53:36","Latitude":null,"Longitude":null,"OSM_ID":288791808,"NodeLatitude":33.855151,"NodeLongitude":35.5838659,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:38","EndTime":"2024-01-13 15:53:38","Latitude":null,"Longitude":null,"OSM_ID":6663124828,"NodeLatitude":33.8551595,"NodeLongitude":35.5837445,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:40","EndTime":"2024-01-13 15:53:40","Latitude":null,"Longitude":null,"OSM_ID":6663124829,"NodeLatitude":33.855184,"NodeLongitude":35.5836344,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:41","EndTime":"2024-01-13 15:53:41","Latitude":null,"Longitude":null,"OSM_ID":9041386606,"NodeLatitude":33.8552042,"NodeLongitude":35.5835819,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:43","EndTime":"2024-01-13 15:53:43","Latitude":null,"Longitude":null,"OSM_ID":2675311927,"NodeLatitude":33.8552287,"NodeLongitude":35.5835185,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:45","EndTime":"2024-01-13 15:53:45","Latitude":null,"Longitude":null,"OSM_ID":6663124830,"NodeLatitude":33.8552625,"NodeLongitude":35.5834524,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:46","EndTime":"2024-01-13 15:53:46","Latitude":null,"Longitude":null,"OSM_ID":3070045389,"NodeLatitude":33.8553137,"NodeLongitude":35.5833648,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:48","EndTime":"2024-01-13 15:53:48","Latitude":null,"Longitude":null,"OSM_ID":288791527,"NodeLatitude":33.8554029,"NodeLongitude":35.583257,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:50","EndTime":"2024-01-13 15:53:50","Latitude":33.8556231895,"Longitude":35.5831457968,"OSM_ID":6663124831,"NodeLatitude":33.8555939,"NodeLongitude":35.583088,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:51","EndTime":"2024-01-13 15:53:51","Latitude":null,"Longitude":null,"OSM_ID":6663124832,"NodeLatitude":33.8558695,"NodeLongitude":35.582858,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:53","EndTime":"2024-01-13 15:53:53","Latitude":null,"Longitude":null,"OSM_ID":7428241070,"NodeLatitude":33.8560783,"NodeLongitude":35.5826955,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:54","EndTime":"2024-01-13 15:53:54","Latitude":null,"Longitude":null,"OSM_ID":6663124833,"NodeLatitude":33.8562237,"NodeLongitude":35.5825824,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:56","EndTime":"2024-01-13 15:53:56","Latitude":null,"Longitude":null,"OSM_ID":288791809,"NodeLatitude":33.8564464,"NodeLongitude":35.5824081,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:57","EndTime":"2024-01-13 15:53:57","Latitude":null,"Longitude":null,"OSM_ID":2675311925,"NodeLatitude":33.8565467,"NodeLongitude":35.5822659,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:53:59","EndTime":"2024-01-13 15:53:59","Latitude":null,"Longitude":null,"OSM_ID":6663124834,"NodeLatitude":33.8565751,"NodeLongitude":35.5821848,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:00","EndTime":"2024-01-13 15:54:00","Latitude":null,"Longitude":null,"OSM_ID":3072876595,"NodeLatitude":33.8565923,"NodeLongitude":35.5820594,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:02","EndTime":"2024-01-13 15:54:02","Latitude":null,"Longitude":null,"OSM_ID":6663124835,"NodeLatitude":33.8565884,"NodeLongitude":35.5819474,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:03","EndTime":"2024-01-13 15:54:03","Latitude":null,"Longitude":null,"OSM_ID":288791529,"NodeLatitude":33.8565684,"NodeLongitude":35.5818663,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:05","EndTime":"2024-01-13 15:54:05","Latitude":null,"Longitude":null,"OSM_ID":6501811399,"NodeLatitude":33.8564915,"NodeLongitude":35.5816772,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:54:14","EndTime":"2024-01-13 15:54:14","Latitude":null,"Longitude":null,"OSM_ID":6501811399,"NodeLatitude":33.8564915,"NodeLongitude":35.5816772,"NodeType":"Intermediate","StreetName":"شارع 43"},{"StartTime":"2024-01-13 15:54:06","EndTime":"2024-01-13 15:54:06","Latitude":null,"Longitude":null,"OSM_ID":6663288779,"NodeLatitude":33.8565141,"NodeLongitude":35.5816889,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:54:12","EndTime":"2024-01-13 15:54:12","Latitude":null,"Longitude":null,"OSM_ID":6663288779,"NodeLatitude":33.8565141,"NodeLongitude":35.5816889,"NodeType":"Intermediate","StreetName":"شارع 43"},{"StartTime":"2024-01-13 15:54:08","EndTime":"2024-01-13 15:54:08","Latitude":null,"Longitude":null,"OSM_ID":6663288780,"NodeLatitude":33.8565411,"NodeLongitude":35.5817064,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:54:11","EndTime":"2024-01-13 15:54:11","Latitude":null,"Longitude":null,"OSM_ID":6663288780,"NodeLatitude":33.8565411,"NodeLongitude":35.5817064,"NodeType":"Intermediate","StreetName":"شارع 43"},{"StartTime":"2024-01-13 15:54:10","EndTime":"2024-01-13 15:54:10","Latitude":33.8565887813,"Longitude":35.5816841531,"OSM_ID":6663288781,"NodeLatitude":33.8565675,"NodeLongitude":35.5817251,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 15:54:15","EndTime":"2024-01-13 15:54:15","Latitude":null,"Longitude":null,"OSM_ID":288791810,"NodeLatitude":33.8564047,"NodeLongitude":35.5815209,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:16","EndTime":"2024-01-13 15:54:16","Latitude":null,"Longitude":null,"OSM_ID":3106361394,"NodeLatitude":33.8563523,"NodeLongitude":35.5814264,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:18","EndTime":"2024-01-13 15:54:18","Latitude":null,"Longitude":null,"OSM_ID":6663124836,"NodeLatitude":33.8562899,"NodeLongitude":35.5813131,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:19","EndTime":"2024-01-13 15:54:19","Latitude":null,"Longitude":null,"OSM_ID":3072876585,"NodeLatitude":33.8561942,"NodeLongitude":35.5811501,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:20","EndTime":"2024-01-13 15:54:20","Latitude":null,"Longitude":null,"OSM_ID":3070031569,"NodeLatitude":33.8561686,"NodeLongitude":35.5811099,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:22","EndTime":"2024-01-13 15:54:22","Latitude":null,"Longitude":null,"OSM_ID":288791531,"NodeLatitude":33.8560978,"NodeLongitude":35.5809952,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:23","EndTime":"2024-01-13 15:54:23","Latitude":null,"Longitude":null,"OSM_ID":6663124837,"NodeLatitude":33.856021,"NodeLongitude":35.5809014,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:24","EndTime":"2024-01-13 15:54:24","Latitude":null,"Longitude":null,"OSM_ID":2675268469,"NodeLatitude":33.8559252,"NodeLongitude":35.580835,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:26","EndTime":"2024-01-13 15:54:26","Latitude":null,"Longitude":null,"OSM_ID":6663124838,"NodeLatitude":33.8558183,"NodeLongitude":35.5807994,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:27","EndTime":"2024-01-13 15:54:27","Latitude":null,"Longitude":null,"OSM_ID":288791532,"NodeLatitude":33.8557103,"NodeLongitude":35.5807961,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:28","EndTime":"2024-01-13 15:54:28","Latitude":null,"Longitude":null,"OSM_ID":3070045379,"NodeLatitude":33.8555677,"NodeLongitude":35.5808169,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:30","EndTime":"2024-01-13 15:54:30","Latitude":33.8553929915,"Longitude":35.580876611,"OSM_ID":6663124839,"NodeLatitude":33.8553511,"NodeLongitude":35.5808806,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:33","EndTime":"2024-01-13 15:54:33","Latitude":null,"Longitude":null,"OSM_ID":6664065838,"NodeLatitude":33.8553231,"NodeLongitude":35.5808885,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:36","EndTime":"2024-01-13 15:54:36","Latitude":null,"Longitude":null,"OSM_ID":3070031488,"NodeLatitude":33.8550899,"NodeLongitude":35.5809543,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:40","EndTime":"2024-01-13 15:54:40","Latitude":null,"Longitude":null,"OSM_ID":3106355311,"NodeLatitude":33.854998,"NodeLongitude":35.5809778,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:43","EndTime":"2024-01-13 15:54:43","Latitude":null,"Longitude":null,"OSM_ID":6663124840,"NodeLatitude":33.8548065,"NodeLongitude":35.5810227,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:46","EndTime":"2024-01-13 15:54:46","Latitude":null,"Longitude":null,"OSM_ID":288791811,"NodeLatitude":33.8545253,"NodeLongitude":35.5810938,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:50","EndTime":"2024-01-13 15:54:50","Latitude":33.8541031551,"Longitude":35.5812115783,"OSM_ID":6663124842,"NodeLatitude":33.8542012,"NodeLongitude":35.5811749,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:51","EndTime":"2024-01-13 15:54:51","Latitude":null,"Longitude":null,"OSM_ID":6663124841,"NodeLatitude":33.8538593,"NodeLongitude":35.581246,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:53","EndTime":"2024-01-13 15:54:53","Latitude":null,"Longitude":null,"OSM_ID":4518138187,"NodeLatitude":33.8537373,"NodeLongitude":35.5812588,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:54","EndTime":"2024-01-13 15:54:54","Latitude":null,"Longitude":null,"OSM_ID":4015037728,"NodeLatitude":33.853683,"NodeLongitude":35.5812618,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:56","EndTime":"2024-01-13 15:54:56","Latitude":null,"Longitude":null,"OSM_ID":288791534,"NodeLatitude":33.8535984,"NodeLongitude":35.5812745,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:57","EndTime":"2024-01-13 15:54:57","Latitude":null,"Longitude":null,"OSM_ID":6663812982,"NodeLatitude":33.8535293,"NodeLongitude":35.5812557,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:54:59","EndTime":"2024-01-13 15:54:59","Latitude":null,"Longitude":null,"OSM_ID":4518138174,"NodeLatitude":33.853512,"NodeLongitude":35.581249,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:00","EndTime":"2024-01-13 15:55:00","Latitude":null,"Longitude":null,"OSM_ID":4518138175,"NodeLatitude":33.8534653,"NodeLongitude":35.5812417,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:02","EndTime":"2024-01-13 15:55:02","Latitude":null,"Longitude":null,"OSM_ID":6663812980,"NodeLatitude":33.8534346,"NodeLongitude":35.5812343,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:03","EndTime":"2024-01-13 15:55:03","Latitude":null,"Longitude":null,"OSM_ID":4518138176,"NodeLatitude":33.8534135,"NodeLongitude":35.5812215,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:05","EndTime":"2024-01-13 15:55:05","Latitude":null,"Longitude":null,"OSM_ID":4518138177,"NodeLatitude":33.8533957,"NodeLongitude":35.5812132,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:06","EndTime":"2024-01-13 15:55:06","Latitude":null,"Longitude":null,"OSM_ID":4518138178,"NodeLatitude":33.8533731,"NodeLongitude":35.5811887,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:08","EndTime":"2024-01-13 15:55:08","Latitude":null,"Longitude":null,"OSM_ID":4518138179,"NodeLatitude":33.8533622,"NodeLongitude":35.5811508,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:10","EndTime":"2024-01-13 15:55:10","Latitude":null,"Longitude":null,"OSM_ID":4518138180,"NodeLatitude":33.853357,"NodeLongitude":35.5811253,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:11","EndTime":"2024-01-13 15:55:11","Latitude":null,"Longitude":null,"OSM_ID":2668434068,"NodeLatitude":33.8533562,"NodeLongitude":35.5811122,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:13","EndTime":"2024-01-13 15:55:13","Latitude":null,"Longitude":null,"OSM_ID":6426496852,"NodeLatitude":33.853358,"NodeLongitude":35.5810933,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:14","EndTime":"2024-01-13 15:55:14","Latitude":null,"Longitude":null,"OSM_ID":288791535,"NodeLatitude":33.853376,"NodeLongitude":35.5810532,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:16","EndTime":"2024-01-13 15:55:16","Latitude":null,"Longitude":null,"OSM_ID":3070031487,"NodeLatitude":33.8535936,"NodeLongitude":35.5806102,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:17","EndTime":"2024-01-13 15:55:17","Latitude":null,"Longitude":null,"OSM_ID":288791536,"NodeLatitude":33.85384,"NodeLongitude":35.5801233,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:19","EndTime":"2024-01-13 15:55:19","Latitude":null,"Longitude":null,"OSM_ID":6661445942,"NodeLatitude":33.8538765,"NodeLongitude":35.5800182,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:20","EndTime":"2024-01-13 15:55:20","Latitude":null,"Longitude":null,"OSM_ID":6661445943,"NodeLatitude":33.8539138,"NodeLongitude":35.5798768,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:22","EndTime":"2024-01-13 15:55:22","Latitude":null,"Longitude":null,"OSM_ID":3070031485,"NodeLatitude":33.8539506,"NodeLongitude":35.5797178,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:23","EndTime":"2024-01-13 15:55:23","Latitude":null,"Longitude":null,"OSM_ID":6661445944,"NodeLatitude":33.8539762,"NodeLongitude":35.5795951,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:25","EndTime":"2024-01-13 15:55:25","Latitude":null,"Longitude":null,"OSM_ID":288791537,"NodeLatitude":33.8539883,"NodeLongitude":35.579475,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:26","EndTime":"2024-01-13 15:55:26","Latitude":null,"Longitude":null,"OSM_ID":3070031510,"NodeLatitude":33.8539291,"NodeLongitude":35.5781049,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:28","EndTime":"2024-01-13 15:55:28","Latitude":null,"Longitude":null,"OSM_ID":288791538,"NodeLatitude":33.8539184,"NodeLongitude":35.5778177,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:30","EndTime":"2024-01-13 15:55:30","Latitude":33.8539951136,"Longitude":35.5778090297,"OSM_ID":5299108494,"NodeLatitude":33.8539254,"NodeLongitude":35.5777765,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:30","EndTime":"2024-01-13 15:55:30","Latitude":null,"Longitude":null,"OSM_ID":5299108491,"NodeLatitude":33.8539345,"NodeLongitude":35.5777353,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:31","EndTime":"2024-01-13 15:55:31","Latitude":null,"Longitude":null,"OSM_ID":3128765058,"NodeLatitude":33.8539618,"NodeLongitude":35.5776528,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:32","EndTime":"2024-01-13 15:55:32","Latitude":null,"Longitude":null,"OSM_ID":5299108493,"NodeLatitude":33.8539893,"NodeLongitude":35.5775902,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:33","EndTime":"2024-01-13 15:55:33","Latitude":null,"Longitude":null,"OSM_ID":5299108492,"NodeLatitude":33.8540212,"NodeLongitude":35.5775344,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:34","EndTime":"2024-01-13 15:55:34","Latitude":null,"Longitude":null,"OSM_ID":5299108495,"NodeLatitude":33.8540564,"NodeLongitude":35.5774772,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:35","EndTime":"2024-01-13 15:55:35","Latitude":null,"Longitude":null,"OSM_ID":288791539,"NodeLatitude":33.8540917,"NodeLongitude":35.5774267,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:36","EndTime":"2024-01-13 15:55:36","Latitude":null,"Longitude":null,"OSM_ID":3128011153,"NodeLatitude":33.8542826,"NodeLongitude":35.5772033,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:37","EndTime":"2024-01-13 15:55:37","Latitude":null,"Longitude":null,"OSM_ID":4507423322,"NodeLatitude":33.8543322,"NodeLongitude":35.5771452,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:38","EndTime":"2024-01-13 15:55:38","Latitude":null,"Longitude":null,"OSM_ID":3128011152,"NodeLatitude":33.8544115,"NodeLongitude":35.5770524,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:39","EndTime":"2024-01-13 15:55:39","Latitude":null,"Longitude":null,"OSM_ID":3070031509,"NodeLatitude":33.8547107,"NodeLongitude":35.5767027,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:55:40","EndTime":"2024-01-13 15:55:40","Latitude":null,"Longitude":null,"OSM_ID":288791541,"NodeLatitude":33.8547261,"NodeLongitude":35.5766836,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:41","EndTime":"2024-01-13 15:55:41","Latitude":null,"Longitude":null,"OSM_ID":4518096566,"NodeLatitude":33.8547899,"NodeLongitude":35.5765945,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:42","EndTime":"2024-01-13 15:55:42","Latitude":null,"Longitude":null,"OSM_ID":4518096565,"NodeLatitude":33.8548155,"NodeLongitude":35.5765524,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:43","EndTime":"2024-01-13 15:55:43","Latitude":null,"Longitude":null,"OSM_ID":4518096564,"NodeLatitude":33.8548528,"NodeLongitude":35.5764998,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:44","EndTime":"2024-01-13 15:55:44","Latitude":null,"Longitude":null,"OSM_ID":3843369997,"NodeLatitude":33.8548822,"NodeLongitude":35.5764633,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:45","EndTime":"2024-01-13 15:55:45","Latitude":null,"Longitude":null,"OSM_ID":4518096563,"NodeLatitude":33.8549405,"NodeLongitude":35.5763987,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:46","EndTime":"2024-01-13 15:55:46","Latitude":null,"Longitude":null,"OSM_ID":4518096560,"NodeLatitude":33.8549924,"NodeLongitude":35.5763475,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:47","EndTime":"2024-01-13 15:55:47","Latitude":null,"Longitude":null,"OSM_ID":4518096561,"NodeLatitude":33.8551445,"NodeLongitude":35.5762121,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:48","EndTime":"2024-01-13 15:55:48","Latitude":null,"Longitude":null,"OSM_ID":4518096562,"NodeLatitude":33.8551917,"NodeLongitude":35.5761658,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:49","EndTime":"2024-01-13 15:55:49","Latitude":null,"Longitude":null,"OSM_ID":2666923701,"NodeLatitude":33.8552502,"NodeLongitude":35.5761054,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:50","EndTime":"2024-01-13 15:55:50","Latitude":33.8553540073,"Longitude":35.576019029,"OSM_ID":4518096577,"NodeLatitude":33.8553231,"NodeLongitude":35.5760198,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 15:55:52","EndTime":"2024-01-13 15:55:52","Latitude":null,"Longitude":null,"OSM_ID":4518096576,"NodeLatitude":33.8553965,"NodeLongitude":35.5759272,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:55:55","EndTime":"2024-01-13 15:55:55","Latitude":null,"Longitude":null,"OSM_ID":292879468,"NodeLatitude":33.8555682,"NodeLongitude":35.5757604,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:55:58","EndTime":"2024-01-13 15:55:58","Latitude":null,"Longitude":null,"OSM_ID":6661370576,"NodeLatitude":33.8561023,"NodeLongitude":35.5751668,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:01","EndTime":"2024-01-13 15:56:01","Latitude":null,"Longitude":null,"OSM_ID":292879400,"NodeLatitude":33.856165,"NodeLongitude":35.5750857,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:04","EndTime":"2024-01-13 15:56:04","Latitude":null,"Longitude":null,"OSM_ID":6661370577,"NodeLatitude":33.856222,"NodeLongitude":35.5749934,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:07","EndTime":"2024-01-13 15:56:07","Latitude":null,"Longitude":null,"OSM_ID":4507423323,"NodeLatitude":33.8562894,"NodeLongitude":35.5748584,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:10","EndTime":"2024-01-13 15:56:10","Latitude":33.8564113701,"Longitude":35.5745630374,"OSM_ID":292879685,"NodeLatitude":33.8563573,"NodeLongitude":35.5746532,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:11","EndTime":"2024-01-13 15:56:11","Latitude":null,"Longitude":null,"OSM_ID":10264363672,"NodeLatitude":33.8563853,"NodeLongitude":35.5744402,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:13","EndTime":"2024-01-13 15:56:13","Latitude":null,"Longitude":null,"OSM_ID":4507423324,"NodeLatitude":33.856395,"NodeLongitude":35.5743376,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:15","EndTime":"2024-01-13 15:56:15","Latitude":null,"Longitude":null,"OSM_ID":292879405,"NodeLatitude":33.8563963,"NodeLongitude":35.5742294,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:17","EndTime":"2024-01-13 15:56:17","Latitude":null,"Longitude":null,"OSM_ID":6661445945,"NodeLatitude":33.8563796,"NodeLongitude":35.5740591,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:19","EndTime":"2024-01-13 15:56:19","Latitude":null,"Longitude":null,"OSM_ID":3106361393,"NodeLatitude":33.856354,"NodeLongitude":35.5738928,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:20","EndTime":"2024-01-13 15:56:20","Latitude":null,"Longitude":null,"OSM_ID":292879471,"NodeLatitude":33.8563184,"NodeLongitude":35.573764,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:22","EndTime":"2024-01-13 15:56:22","Latitude":null,"Longitude":null,"OSM_ID":3096871172,"NodeLatitude":33.8562499,"NodeLongitude":35.5735726,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:24","EndTime":"2024-01-13 15:56:24","Latitude":null,"Longitude":null,"OSM_ID":6661445946,"NodeLatitude":33.8562137,"NodeLongitude":35.5734744,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:26","EndTime":"2024-01-13 15:56:26","Latitude":null,"Longitude":null,"OSM_ID":6715598423,"NodeLatitude":33.8561577,"NodeLongitude":35.5733503,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:28","EndTime":"2024-01-13 15:56:28","Latitude":null,"Longitude":null,"OSM_ID":9050189159,"NodeLatitude":33.8560123,"NodeLongitude":35.5730279,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:30","EndTime":"2024-01-13 15:56:30","Latitude":33.8559122795,"Longitude":35.5726877415,"OSM_ID":292879472,"NodeLatitude":33.8558428,"NodeLongitude":35.5726519,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:35","EndTime":"2024-01-13 15:56:35","Latitude":null,"Longitude":null,"OSM_ID":6715598434,"NodeLatitude":33.8557676,"NodeLongitude":35.5725605,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:40","EndTime":"2024-01-13 15:56:40","Latitude":null,"Longitude":null,"OSM_ID":3228696185,"NodeLatitude":33.8556346,"NodeLongitude":35.5722485,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:45","EndTime":"2024-01-13 15:56:45","Latitude":null,"Longitude":null,"OSM_ID":6661445949,"NodeLatitude":33.855482,"NodeLongitude":35.5719079,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:50","EndTime":"2024-01-13 15:56:50","Latitude":33.8552510233,"Longitude":35.5712564908,"OSM_ID":3106358821,"NodeLatitude":33.8552761,"NodeLongitude":35.5714728,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:56:55","EndTime":"2024-01-13 15:56:55","Latitude":null,"Longitude":null,"OSM_ID":6661445950,"NodeLatitude":33.8551078,"NodeLongitude":35.5710777,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:00","EndTime":"2024-01-13 15:57:00","Latitude":null,"Longitude":null,"OSM_ID":6661445951,"NodeLatitude":33.8548828,"NodeLongitude":35.5705467,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:05","EndTime":"2024-01-13 15:57:05","Latitude":null,"Longitude":null,"OSM_ID":6661445952,"NodeLatitude":33.8546801,"NodeLongitude":35.5699781,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:10","EndTime":"2024-01-13 15:57:10","Latitude":33.8546762608,"Longitude":35.5697783574,"OSM_ID":6661493040,"NodeLatitude":33.8546315,"NodeLongitude":35.5698152,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:14","EndTime":"2024-01-13 15:57:14","Latitude":null,"Longitude":null,"OSM_ID":292879686,"NodeLatitude":33.8544541,"NodeLongitude":35.5692702,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:18","EndTime":"2024-01-13 15:57:18","Latitude":null,"Longitude":null,"OSM_ID":6513280054,"NodeLatitude":33.8543764,"NodeLongitude":35.5690267,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:22","EndTime":"2024-01-13 15:57:22","Latitude":null,"Longitude":null,"OSM_ID":292879413,"NodeLatitude":33.8542665,"NodeLongitude":35.5686777,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:26","EndTime":"2024-01-13 15:57:26","Latitude":null,"Longitude":null,"OSM_ID":6511715722,"NodeLatitude":33.8535229,"NodeLongitude":35.5661747,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:30","EndTime":"2024-01-13 15:57:30","Latitude":null,"Longitude":null,"OSM_ID":292879416,"NodeLatitude":33.8534661,"NodeLongitude":35.5659655,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:34","EndTime":"2024-01-13 15:57:34","Latitude":null,"Longitude":null,"OSM_ID":6518578265,"NodeLatitude":33.8534427,"NodeLongitude":35.5658541,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:38","EndTime":"2024-01-13 15:57:38","Latitude":null,"Longitude":null,"OSM_ID":4508895333,"NodeLatitude":33.8534266,"NodeLongitude":35.5657514,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:42","EndTime":"2024-01-13 15:57:42","Latitude":null,"Longitude":null,"OSM_ID":6511715720,"NodeLatitude":33.8534138,"NodeLongitude":35.565578,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:46","EndTime":"2024-01-13 15:57:46","Latitude":null,"Longitude":null,"OSM_ID":292879417,"NodeLatitude":33.8534229,"NodeLongitude":35.5653953,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:50","EndTime":"2024-01-13 15:57:50","Latitude":33.8535192708,"Longitude":35.5653750599,"OSM_ID":6513576120,"NodeLatitude":33.8534694,"NodeLongitude":35.5652976,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:51","EndTime":"2024-01-13 15:57:51","Latitude":null,"Longitude":null,"OSM_ID":6513576125,"NodeLatitude":33.8534895,"NodeLongitude":35.5652238,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:52","EndTime":"2024-01-13 15:57:52","Latitude":null,"Longitude":null,"OSM_ID":4508895334,"NodeLatitude":33.8535185,"NodeLongitude":35.5651192,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:54","EndTime":"2024-01-13 15:57:54","Latitude":null,"Longitude":null,"OSM_ID":6513576121,"NodeLatitude":33.8535536,"NodeLongitude":35.5649804,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:55","EndTime":"2024-01-13 15:57:55","Latitude":null,"Longitude":null,"OSM_ID":292879687,"NodeLatitude":33.8535827,"NodeLongitude":35.5648949,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:57","EndTime":"2024-01-13 15:57:57","Latitude":null,"Longitude":null,"OSM_ID":6513576126,"NodeLatitude":33.8536001,"NodeLongitude":35.5648454,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:57:58","EndTime":"2024-01-13 15:57:58","Latitude":null,"Longitude":null,"OSM_ID":6513576122,"NodeLatitude":33.8536166,"NodeLongitude":35.564803,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:00","EndTime":"2024-01-13 15:58:00","Latitude":null,"Longitude":null,"OSM_ID":6513576127,"NodeLatitude":33.8536721,"NodeLongitude":35.56468,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:01","EndTime":"2024-01-13 15:58:01","Latitude":null,"Longitude":null,"OSM_ID":6518612186,"NodeLatitude":33.8537107,"NodeLongitude":35.5646053,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:02","EndTime":"2024-01-13 15:58:02","Latitude":null,"Longitude":null,"OSM_ID":6518612188,"NodeLatitude":33.8537417,"NodeLongitude":35.5645492,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:04","EndTime":"2024-01-13 15:58:04","Latitude":null,"Longitude":null,"OSM_ID":292879419,"NodeLatitude":33.8537667,"NodeLongitude":35.5644798,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:05","EndTime":"2024-01-13 15:58:05","Latitude":null,"Longitude":null,"OSM_ID":3096870561,"NodeLatitude":33.8538622,"NodeLongitude":35.5643726,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:07","EndTime":"2024-01-13 15:58:07","Latitude":null,"Longitude":null,"OSM_ID":6518605183,"NodeLatitude":33.8540146,"NodeLongitude":35.5642558,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:08","EndTime":"2024-01-13 15:58:08","Latitude":null,"Longitude":null,"OSM_ID":6518605184,"NodeLatitude":33.8541618,"NodeLongitude":35.5641641,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:10","EndTime":"2024-01-13 15:58:10","Latitude":33.8544317821,"Longitude":35.5641032933,"OSM_ID":292879421,"NodeLatitude":33.854354,"NodeLongitude":35.5640911,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:12","EndTime":"2024-01-13 15:58:12","Latitude":null,"Longitude":null,"OSM_ID":3147888391,"NodeLatitude":33.8545099,"NodeLongitude":35.5640557,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:15","EndTime":"2024-01-13 15:58:15","Latitude":null,"Longitude":null,"OSM_ID":3133673154,"NodeLatitude":33.8549133,"NodeLongitude":35.5639785,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:17","EndTime":"2024-01-13 15:58:17","Latitude":null,"Longitude":null,"OSM_ID":6715620819,"NodeLatitude":33.8551099,"NodeLongitude":35.5639472,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:20","EndTime":"2024-01-13 15:58:20","Latitude":null,"Longitude":null,"OSM_ID":292879423,"NodeLatitude":33.8552787,"NodeLongitude":35.5639118,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:22","EndTime":"2024-01-13 15:58:22","Latitude":null,"Longitude":null,"OSM_ID":4508895335,"NodeLatitude":33.8554432,"NodeLongitude":35.5638388,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:25","EndTime":"2024-01-13 15:58:25","Latitude":null,"Longitude":null,"OSM_ID":6511715721,"NodeLatitude":33.855554,"NodeLongitude":35.5637554,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:27","EndTime":"2024-01-13 15:58:27","Latitude":null,"Longitude":null,"OSM_ID":6511715723,"NodeLatitude":33.8556702,"NodeLongitude":35.5636507,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:30","EndTime":"2024-01-13 15:58:30","Latitude":33.8559897982,"Longitude":35.5633688971,"OSM_ID":292879424,"NodeLatitude":33.855874,"NodeLongitude":35.5634228,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:50","EndTime":"2024-01-13 15:58:50","Latitude":33.8572803202,"Longitude":35.5617419534,"OSM_ID":292879688,"NodeLatitude":33.8573531,"NodeLongitude":35.5615451,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:53","EndTime":"2024-01-13 15:58:53","Latitude":null,"Longitude":null,"OSM_ID":2709382688,"NodeLatitude":33.8576267,"NodeLongitude":35.561174,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:58:56","EndTime":"2024-01-13 15:58:56","Latitude":null,"Longitude":null,"OSM_ID":6715620820,"NodeLatitude":33.8577514,"NodeLongitude":35.5609801,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:00","EndTime":"2024-01-13 15:59:00","Latitude":null,"Longitude":null,"OSM_ID":292879743,"NodeLatitude":33.8581894,"NodeLongitude":35.5601733,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:03","EndTime":"2024-01-13 15:59:03","Latitude":null,"Longitude":null,"OSM_ID":6661437930,"NodeLatitude":33.8583842,"NodeLongitude":35.5598219,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:06","EndTime":"2024-01-13 15:59:06","Latitude":null,"Longitude":null,"OSM_ID":6661437929,"NodeLatitude":33.858509,"NodeLongitude":35.55961,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:10","EndTime":"2024-01-13 15:59:10","Latitude":33.858629406,"Longitude":35.5595319756,"OSM_ID":292879691,"NodeLatitude":33.858617,"NodeLongitude":35.5594155,"NodeType":"Road Node","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:11","EndTime":"2024-01-13 15:59:11","Latitude":null,"Longitude":null,"OSM_ID":6715620821,"NodeLatitude":33.8588492,"NodeLongitude":35.5590909,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:13","EndTime":"2024-01-13 15:59:13","Latitude":null,"Longitude":null,"OSM_ID":6661437928,"NodeLatitude":33.8589355,"NodeLongitude":35.558977,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:15","EndTime":"2024-01-13 15:59:15","Latitude":null,"Longitude":null,"OSM_ID":292879483,"NodeLatitude":33.8591009,"NodeLongitude":35.5587959,"NodeType":"Intermediate","StreetName":"شارع 4"},{"StartTime":"2024-01-13 15:59:16","EndTime":"2024-01-13 15:59:16","Latitude":null,"Longitude":null,"OSM_ID":292879679,"NodeLatitude":33.859408,"NodeLongitude":35.5584855,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:18","EndTime":"2024-01-13 15:59:18","Latitude":null,"Longitude":null,"OSM_ID":6738908541,"NodeLatitude":33.8594811,"NodeLongitude":35.5584545,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:20","EndTime":"2024-01-13 15:59:20","Latitude":null,"Longitude":null,"OSM_ID":4454605832,"NodeLatitude":33.8595763,"NodeLongitude":35.558389,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:21","EndTime":"2024-01-13 15:59:21","Latitude":null,"Longitude":null,"OSM_ID":4454605812,"NodeLatitude":33.8596079,"NodeLongitude":35.5583699,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:23","EndTime":"2024-01-13 15:59:23","Latitude":null,"Longitude":null,"OSM_ID":4454605833,"NodeLatitude":33.85967,"NodeLongitude":35.5583256,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:25","EndTime":"2024-01-13 15:59:25","Latitude":null,"Longitude":null,"OSM_ID":292879433,"NodeLatitude":33.8597206,"NodeLongitude":35.5582859,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:26","EndTime":"2024-01-13 15:59:26","Latitude":null,"Longitude":null,"OSM_ID":292879741,"NodeLatitude":33.8597748,"NodeLongitude":35.5582104,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:28","EndTime":"2024-01-13 15:59:28","Latitude":null,"Longitude":null,"OSM_ID":4454605869,"NodeLatitude":33.8598072,"NodeLongitude":35.5581367,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:30","EndTime":"2024-01-13 15:59:30","Latitude":33.8598932193,"Longitude":35.5580597351,"OSM_ID":4454605870,"NodeLatitude":33.8598342,"NodeLongitude":35.5580534,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 15:59:31","EndTime":"2024-01-13 15:59:31","Latitude":null,"Longitude":null,"OSM_ID":4454605871,"NodeLatitude":33.8598561,"NodeLongitude":35.5579761,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:33","EndTime":"2024-01-13 15:59:33","Latitude":null,"Longitude":null,"OSM_ID":4454605872,"NodeLatitude":33.8598713,"NodeLongitude":35.5578623,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:35","EndTime":"2024-01-13 15:59:35","Latitude":null,"Longitude":null,"OSM_ID":4454605873,"NodeLatitude":33.8598814,"NodeLongitude":35.557783,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:37","EndTime":"2024-01-13 15:59:37","Latitude":null,"Longitude":null,"OSM_ID":4454605861,"NodeLatitude":33.8598872,"NodeLongitude":35.5577114,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:59:39","EndTime":"2024-01-13 15:59:39","Latitude":null,"Longitude":null,"OSM_ID":4454605858,"NodeLatitude":33.8598932,"NodeLongitude":35.5575429,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:59:40","EndTime":"2024-01-13 15:59:40","Latitude":null,"Longitude":null,"OSM_ID":6416654156,"NodeLatitude":33.8599055,"NodeLongitude":35.5572349,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:59:42","EndTime":"2024-01-13 15:59:42","Latitude":null,"Longitude":null,"OSM_ID":4454605857,"NodeLatitude":33.8599149,"NodeLongitude":35.5568991,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:59:44","EndTime":"2024-01-13 15:59:44","Latitude":null,"Longitude":null,"OSM_ID":4454605856,"NodeLatitude":33.8599115,"NodeLongitude":35.5568173,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:59:46","EndTime":"2024-01-13 15:59:46","Latitude":null,"Longitude":null,"OSM_ID":4454605838,"NodeLatitude":33.8599046,"NodeLongitude":35.5565997,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:59:48","EndTime":"2024-01-13 15:59:48","Latitude":null,"Longitude":null,"OSM_ID":6666578971,"NodeLatitude":33.8599167,"NodeLongitude":35.5563935,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:52","EndTime":"2024-01-13 15:59:52","Latitude":null,"Longitude":null,"OSM_ID":6666578971,"NodeLatitude":33.8599167,"NodeLongitude":35.5563935,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 15:59:50","EndTime":"2024-01-13 15:59:50","Latitude":33.8600023638,"Longitude":35.5562761384,"OSM_ID":3249764714,"NodeLatitude":33.8600353,"NodeLongitude":35.5562906,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 15:59:55","EndTime":"2024-01-13 15:59:55","Latitude":null,"Longitude":null,"OSM_ID":6661620128,"NodeLatitude":33.8599267,"NodeLongitude":35.5562223,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 15:59:57","EndTime":"2024-01-13 15:59:57","Latitude":null,"Longitude":null,"OSM_ID":6661620129,"NodeLatitude":33.8599339,"NodeLongitude":35.5558629,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:00","EndTime":"2024-01-13 16:00:00","Latitude":null,"Longitude":null,"OSM_ID":288791575,"NodeLatitude":33.8599278,"NodeLongitude":35.5554137,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:02","EndTime":"2024-01-13 16:00:02","Latitude":null,"Longitude":null,"OSM_ID":6661293902,"NodeLatitude":33.8599111,"NodeLongitude":35.5551548,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:05","EndTime":"2024-01-13 16:00:05","Latitude":null,"Longitude":null,"OSM_ID":6661293903,"NodeLatitude":33.859881,"NodeLongitude":35.5548987,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:07","EndTime":"2024-01-13 16:00:07","Latitude":null,"Longitude":null,"OSM_ID":3047538492,"NodeLatitude":33.8598042,"NodeLongitude":35.5543971,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:10","EndTime":"2024-01-13 16:00:10","Latitude":33.8598694603,"Longitude":35.554132141,"OSM_ID":6661293904,"NodeLatitude":33.8597964,"NodeLongitude":35.554204,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:12","EndTime":"2024-01-13 16:00:12","Latitude":null,"Longitude":null,"OSM_ID":288791829,"NodeLatitude":33.8597886,"NodeLongitude":35.5539975,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:15","EndTime":"2024-01-13 16:00:15","Latitude":null,"Longitude":null,"OSM_ID":6661293905,"NodeLatitude":33.8598186,"NodeLongitude":35.5536669,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:17","EndTime":"2024-01-13 16:00:17","Latitude":null,"Longitude":null,"OSM_ID":10131809264,"NodeLatitude":33.8598231,"NodeLongitude":35.5536451,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:20","EndTime":"2024-01-13 16:00:20","Latitude":null,"Longitude":null,"OSM_ID":288791577,"NodeLatitude":33.8599017,"NodeLongitude":35.55326,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:22","EndTime":"2024-01-13 16:00:22","Latitude":null,"Longitude":null,"OSM_ID":6661293906,"NodeLatitude":33.8599932,"NodeLongitude":35.5529162,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:25","EndTime":"2024-01-13 16:00:25","Latitude":null,"Longitude":null,"OSM_ID":288791830,"NodeLatitude":33.860115,"NodeLongitude":35.55254,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:27","EndTime":"2024-01-13 16:00:27","Latitude":null,"Longitude":null,"OSM_ID":5244584484,"NodeLatitude":33.8602842,"NodeLongitude":35.5522084,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:30","EndTime":"2024-01-13 16:00:30","Latitude":33.8607379478,"Longitude":35.5516606215,"OSM_ID":288791579,"NodeLatitude":33.8604504,"NodeLongitude":35.5519597,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:32","EndTime":"2024-01-13 16:00:32","Latitude":null,"Longitude":null,"OSM_ID":288791831,"NodeLatitude":33.8612627,"NodeLongitude":35.5507909,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:00:35","EndTime":"2024-01-13 16:00:35","Latitude":null,"Longitude":null,"OSM_ID":2696639920,"NodeLatitude":33.8614253,"NodeLongitude":35.5505495,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:01:05","EndTime":"2024-01-13 16:01:05","Latitude":null,"Longitude":null,"OSM_ID":2696639920,"NodeLatitude":33.8614253,"NodeLongitude":35.5505495,"NodeType":"Intermediate","StreetName":"شارع 407"},{"StartTime":"2024-01-13 16:00:37","EndTime":"2024-01-13 16:00:37","Latitude":null,"Longitude":null,"OSM_ID":6661696520,"NodeLatitude":33.8614273,"NodeLongitude":35.5504509,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:01:02","EndTime":"2024-01-13 16:01:02","Latitude":null,"Longitude":null,"OSM_ID":6661696520,"NodeLatitude":33.8614273,"NodeLongitude":35.5504509,"NodeType":"Intermediate","StreetName":"شارع 407"},{"StartTime":"2024-01-13 16:00:40","EndTime":"2024-01-13 16:00:40","Latitude":null,"Longitude":null,"OSM_ID":6697269016,"NodeLatitude":33.8614368,"NodeLongitude":35.5503503,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:01:00","EndTime":"2024-01-13 16:01:00","Latitude":null,"Longitude":null,"OSM_ID":6697269016,"NodeLatitude":33.8614368,"NodeLongitude":35.5503503,"NodeType":"Intermediate","StreetName":"شارع 407"},{"StartTime":"2024-01-13 16:00:42","EndTime":"2024-01-13 16:00:42","Latitude":null,"Longitude":null,"OSM_ID":6661696521,"NodeLatitude":33.8614513,"NodeLongitude":35.5502652,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:00:57","EndTime":"2024-01-13 16:00:57","Latitude":null,"Longitude":null,"OSM_ID":6661696521,"NodeLatitude":33.8614513,"NodeLongitude":35.5502652,"NodeType":"Intermediate","StreetName":"شارع 407"},{"StartTime":"2024-01-13 16:00:45","EndTime":"2024-01-13 16:00:45","Latitude":null,"Longitude":null,"OSM_ID":6697269017,"NodeLatitude":33.8614763,"NodeLongitude":35.550174,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:00:55","EndTime":"2024-01-13 16:00:55","Latitude":null,"Longitude":null,"OSM_ID":6697269017,"NodeLatitude":33.8614763,"NodeLongitude":35.550174,"NodeType":"Intermediate","StreetName":"شارع 407"},{"StartTime":"2024-01-13 16:00:47","EndTime":"2024-01-13 16:00:47","Latitude":null,"Longitude":null,"OSM_ID":6661696522,"NodeLatitude":33.8614997,"NodeLongitude":35.5501036,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:00:52","EndTime":"2024-01-13 16:00:52","Latitude":null,"Longitude":null,"OSM_ID":6661696522,"NodeLatitude":33.8614997,"NodeLongitude":35.5501036,"NodeType":"Intermediate","StreetName":"شارع 407"},{"StartTime":"2024-01-13 16:00:50","EndTime":"2024-01-13 16:00:50","Latitude":33.861814115,"Longitude":35.550111291,"OSM_ID":2696639921,"NodeLatitude":33.8615871,"NodeLongitude":35.5499071,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:01:07","EndTime":"2024-01-13 16:01:07","Latitude":null,"Longitude":null,"OSM_ID":3047538512,"NodeLatitude":33.862262,"NodeLongitude":35.5493063,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:01:10","EndTime":"2024-01-13 16:01:10","Latitude":33.8629260384,"Longitude":35.5484770997,"OSM_ID":11638173692,"NodeLatitude":33.8626611,"NodeLongitude":35.5487344,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:01:15","EndTime":"2024-01-13 16:01:15","Latitude":null,"Longitude":null,"OSM_ID":288791581,"NodeLatitude":33.863655,"NodeLongitude":35.54731,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:01:20","EndTime":"2024-01-13 16:01:20","Latitude":null,"Longitude":null,"OSM_ID":3047538464,"NodeLatitude":33.8638961,"NodeLongitude":35.5470525,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:01:25","EndTime":"2024-01-13 16:01:25","Latitude":null,"Longitude":null,"OSM_ID":288791832,"NodeLatitude":33.8641011,"NodeLongitude":35.5468954,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:01:30","EndTime":"2024-01-13 16:01:30","Latitude":33.8644894337,"Longitude":35.5467136242,"OSM_ID":3096735759,"NodeLatitude":33.8641709,"NodeLongitude":35.5468407,"NodeType":"Road Node","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:01:34","EndTime":"2024-01-13 16:01:34","Latitude":null,"Longitude":null,"OSM_ID":2730939308,"NodeLatitude":33.8651158,"NodeLongitude":35.5461433,"NodeType":"Intermediate","StreetName":"طريق برمانا الرئيسية"},{"StartTime":"2024-01-13 16:01:38","EndTime":"2024-01-13 16:01:38","Latitude":null,"Longitude":null,"OSM_ID":2671704019,"NodeLatitude":33.8652138,"NodeLongitude":35.5460788,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:01:42","EndTime":"2024-01-13 16:01:42","Latitude":null,"Longitude":null,"OSM_ID":9377183478,"NodeLatitude":33.8654168,"NodeLongitude":35.5459669,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:01:46","EndTime":"2024-01-13 16:01:46","Latitude":null,"Longitude":null,"OSM_ID":3298998008,"NodeLatitude":33.8656781,"NodeLongitude":35.545808,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:01:50","EndTime":"2024-01-13 16:01:50","Latitude":33.8657784285,"Longitude":35.5457498692,"OSM_ID":4947302469,"NodeLatitude":33.8657094,"NodeLongitude":35.5457839,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:02:00","EndTime":"2024-01-13 16:02:00","Latitude":null,"Longitude":null,"OSM_ID":3298998007,"NodeLatitude":33.8658419,"NodeLongitude":35.5456819,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:02:10","EndTime":"2024-01-13 16:02:10","Latitude":33.8671285702,"Longitude":35.5447731108,"OSM_ID":3298998004,"NodeLatitude":33.8667172,"NodeLongitude":35.5450474,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:02:12","EndTime":"2024-01-13 16:02:12","Latitude":null,"Longitude":null,"OSM_ID":3298998002,"NodeLatitude":33.8675323,"NodeLongitude":35.5444385,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:02:15","EndTime":"2024-01-13 16:02:15","Latitude":null,"Longitude":null,"OSM_ID":3133684470,"NodeLatitude":33.8678006,"NodeLongitude":35.5442131,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:17","EndTime":"2024-01-13 16:02:17","Latitude":null,"Longitude":null,"OSM_ID":4403883408,"NodeLatitude":33.867962,"NodeLongitude":35.5441337,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:20","EndTime":"2024-01-13 16:02:20","Latitude":null,"Longitude":null,"OSM_ID":4403883407,"NodeLatitude":33.8681233,"NodeLongitude":35.5440219,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:22","EndTime":"2024-01-13 16:02:22","Latitude":null,"Longitude":null,"OSM_ID":4403883421,"NodeLatitude":33.8682539,"NodeLongitude":35.543919,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:25","EndTime":"2024-01-13 16:02:25","Latitude":null,"Longitude":null,"OSM_ID":2985957771,"NodeLatitude":33.8683852,"NodeLongitude":35.5437656,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:27","EndTime":"2024-01-13 16:02:27","Latitude":null,"Longitude":null,"OSM_ID":4403883409,"NodeLatitude":33.8685168,"NodeLongitude":35.5436267,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:30","EndTime":"2024-01-13 16:02:30","Latitude":33.8685876708,"Longitude":35.5435155048,"OSM_ID":4403883405,"NodeLatitude":33.8686483,"NodeLongitude":35.5434473,"NodeType":"Road Node","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:30","EndTime":"2024-01-13 16:02:30","Latitude":null,"Longitude":null,"OSM_ID":4403883406,"NodeLatitude":33.8687563,"NodeLongitude":35.5432678,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:31","EndTime":"2024-01-13 16:02:31","Latitude":null,"Longitude":null,"OSM_ID":2985957772,"NodeLatitude":33.8688753,"NodeLongitude":35.5431026,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:32","EndTime":"2024-01-13 16:02:32","Latitude":null,"Longitude":null,"OSM_ID":11637585833,"NodeLatitude":33.8688834,"NodeLongitude":35.5430913,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:33","EndTime":"2024-01-13 16:02:33","Latitude":null,"Longitude":null,"OSM_ID":11637585834,"NodeLatitude":33.8689067,"NodeLongitude":35.5430589,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:34","EndTime":"2024-01-13 16:02:34","Latitude":null,"Longitude":null,"OSM_ID":11640646372,"NodeLatitude":33.8689503,"NodeLongitude":35.5429983,"NodeType":"Intermediate","StreetName":"Street 900"},{"StartTime":"2024-01-13 16:02:35","EndTime":"2024-01-13 16:02:35","Latitude":null,"Longitude":null,"OSM_ID":4403936131,"NodeLatitude":33.8690239,"NodeLongitude":35.5429657,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:36","EndTime":"2024-01-13 16:02:36","Latitude":null,"Longitude":null,"OSM_ID":4403936144,"NodeLatitude":33.869053,"NodeLongitude":35.542967,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:36","EndTime":"2024-01-13 16:02:36","Latitude":null,"Longitude":null,"OSM_ID":4403936145,"NodeLatitude":33.8691582,"NodeLongitude":35.5429675,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:37","EndTime":"2024-01-13 16:02:37","Latitude":null,"Longitude":null,"OSM_ID":4403936117,"NodeLatitude":33.869258,"NodeLongitude":35.5429271,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:38","EndTime":"2024-01-13 16:02:38","Latitude":null,"Longitude":null,"OSM_ID":11637585838,"NodeLatitude":33.8692803,"NodeLongitude":35.5429092,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:39","EndTime":"2024-01-13 16:02:39","Latitude":null,"Longitude":null,"OSM_ID":4403936146,"NodeLatitude":33.869311,"NodeLongitude":35.5428845,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:40","EndTime":"2024-01-13 16:02:40","Latitude":null,"Longitude":null,"OSM_ID":4403936120,"NodeLatitude":33.8693561,"NodeLongitude":35.5428302,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:41","EndTime":"2024-01-13 16:02:41","Latitude":null,"Longitude":null,"OSM_ID":4403936126,"NodeLatitude":33.8693877,"NodeLongitude":35.5427742,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:42","EndTime":"2024-01-13 16:02:42","Latitude":null,"Longitude":null,"OSM_ID":4403936147,"NodeLatitude":33.8694224,"NodeLongitude":35.5426608,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:43","EndTime":"2024-01-13 16:02:43","Latitude":null,"Longitude":null,"OSM_ID":4403936123,"NodeLatitude":33.8694264,"NodeLongitude":35.5425401,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:43","EndTime":"2024-01-13 16:02:43","Latitude":null,"Longitude":null,"OSM_ID":4403936136,"NodeLatitude":33.8693935,"NodeLongitude":35.5424092,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:44","EndTime":"2024-01-13 16:02:44","Latitude":null,"Longitude":null,"OSM_ID":4403936137,"NodeLatitude":33.869325,"NodeLongitude":35.5423003,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:45","EndTime":"2024-01-13 16:02:45","Latitude":null,"Longitude":null,"OSM_ID":11637585825,"NodeLatitude":33.8692992,"NodeLongitude":35.5422805,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:46","EndTime":"2024-01-13 16:02:46","Latitude":null,"Longitude":null,"OSM_ID":4403936129,"NodeLatitude":33.8692292,"NodeLongitude":35.5422268,"NodeType":"Intermediate","StreetName":"دوار المكلس"},{"StartTime":"2024-01-13 16:02:47","EndTime":"2024-01-13 16:02:47","Latitude":null,"Longitude":null,"OSM_ID":4403936130,"NodeLatitude":33.8692018,"NodeLongitude":35.5422149,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:02:48","EndTime":"2024-01-13 16:02:48","Latitude":null,"Longitude":null,"OSM_ID":2985957780,"NodeLatitude":33.8692574,"NodeLongitude":35.5419729,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:02:49","EndTime":"2024-01-13 16:02:49","Latitude":null,"Longitude":null,"OSM_ID":2985957735,"NodeLatitude":33.86932,"NodeLongitude":35.5416371,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:02:50","EndTime":"2024-01-13 16:02:50","Latitude":33.8694312068,"Longitude":35.5411322791,"OSM_ID":4403883415,"NodeLatitude":33.8694232,"NodeLongitude":35.5412027,"NodeType":"Road Node","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:02:52","EndTime":"2024-01-13 16:02:52","Latitude":null,"Longitude":null,"OSM_ID":2985957781,"NodeLatitude":33.8694926,"NodeLongitude":35.5407845,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:02:55","EndTime":"2024-01-13 16:02:55","Latitude":null,"Longitude":null,"OSM_ID":4403883417,"NodeLatitude":33.8695702,"NodeLongitude":35.5402202,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:02:58","EndTime":"2024-01-13 16:02:58","Latitude":null,"Longitude":null,"OSM_ID":4403883418,"NodeLatitude":33.8695827,"NodeLongitude":35.5400591,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:03:01","EndTime":"2024-01-13 16:03:01","Latitude":null,"Longitude":null,"OSM_ID":2985957782,"NodeLatitude":33.8695816,"NodeLongitude":35.5398008,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:03:04","EndTime":"2024-01-13 16:03:04","Latitude":null,"Longitude":null,"OSM_ID":2671707927,"NodeLatitude":33.8696464,"NodeLongitude":35.5393397,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:03:07","EndTime":"2024-01-13 16:03:07","Latitude":null,"Longitude":null,"OSM_ID":6735461233,"NodeLatitude":33.8696925,"NodeLongitude":35.5390977,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:03:10","EndTime":"2024-01-13 16:03:10","Latitude":33.8698653613,"Longitude":35.538535216,"OSM_ID":4368147992,"NodeLatitude":33.8697936,"NodeLongitude":35.5385601,"NodeType":"Road Node","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:03:13","EndTime":"2024-01-13 16:03:13","Latitude":null,"Longitude":null,"OSM_ID":292660720,"NodeLatitude":33.8699719,"NodeLongitude":35.5376265,"NodeType":"Intermediate","StreetName":"Street 11"},{"StartTime":"2024-01-13 16:03:16","EndTime":"2024-01-13 16:03:16","Latitude":null,"Longitude":null,"OSM_ID":4515999427,"NodeLatitude":33.8701357,"NodeLongitude":35.5367333,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:03:20","EndTime":"2024-01-13 16:03:20","Latitude":null,"Longitude":null,"OSM_ID":292366548,"NodeLatitude":33.8701597,"NodeLongitude":35.5367367,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:03:23","EndTime":"2024-01-13 16:03:23","Latitude":null,"Longitude":null,"OSM_ID":292366496,"NodeLatitude":33.8701837,"NodeLongitude":35.5367359,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:03:26","EndTime":"2024-01-13 16:03:26","Latitude":null,"Longitude":null,"OSM_ID":292366549,"NodeLatitude":33.8702075,"NodeLongitude":35.5367309,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:03:30","EndTime":"2024-01-13 16:03:30","Latitude":33.8702605658,"Longitude":35.5367730319,"OSM_ID":292366345,"NodeLatitude":33.8702303,"NodeLongitude":35.5367219,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:03:34","EndTime":"2024-01-13 16:03:34","Latitude":null,"Longitude":null,"OSM_ID":292366550,"NodeLatitude":33.8702519,"NodeLongitude":35.536709,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:03:38","EndTime":"2024-01-13 16:03:38","Latitude":null,"Longitude":null,"OSM_ID":292366499,"NodeLatitude":33.8702717,"NodeLongitude":35.5366924,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:03:43","EndTime":"2024-01-13 16:03:43","Latitude":null,"Longitude":null,"OSM_ID":292366500,"NodeLatitude":33.8702893,"NodeLongitude":35.5366726,"NodeType":"Intermediate","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:03:47","EndTime":"2024-01-13 16:03:47","Latitude":null,"Longitude":null,"OSM_ID":4515999426,"NodeLatitude":33.8704451,"NodeLongitude":35.536627,"NodeType":"Intermediate","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:03:52","EndTime":"2024-01-13 16:03:52","Latitude":null,"Longitude":null,"OSM_ID":4515975989,"NodeLatitude":33.8711466,"NodeLongitude":35.5367159,"NodeType":"Intermediate","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:03:56","EndTime":"2024-01-13 16:03:56","Latitude":null,"Longitude":null,"OSM_ID":2677441047,"NodeLatitude":33.8719895,"NodeLongitude":35.5368453,"NodeType":"Intermediate","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:04:01","EndTime":"2024-01-13 16:04:01","Latitude":null,"Longitude":null,"OSM_ID":2677441050,"NodeLatitude":33.8724494,"NodeLongitude":35.5370062,"NodeType":"Intermediate","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:04:05","EndTime":"2024-01-13 16:04:05","Latitude":null,"Longitude":null,"OSM_ID":4086672898,"NodeLatitude":33.8727834,"NodeLongitude":35.5371712,"NodeType":"Intermediate","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:04:10","EndTime":"2024-01-13 16:04:10","Latitude":33.8741818656,"Longitude":35.5379831173,"OSM_ID":4515999424,"NodeLatitude":33.8739882,"NodeLongitude":35.5379537,"NodeType":"Road Node","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:04:15","EndTime":"2024-01-13 16:04:15","Latitude":null,"Longitude":null,"OSM_ID":2677441049,"NodeLatitude":33.8755971,"NodeLongitude":35.538978,"NodeType":"Intermediate","StreetName":"Street 8"},{"StartTime":"2024-01-13 16:04:20","EndTime":"2024-01-13 16:04:20","Latitude":null,"Longitude":null,"OSM_ID":2677441048,"NodeLatitude":33.8761505,"NodeLongitude":35.5393115,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:25","EndTime":"2024-01-13 16:04:25","Latitude":null,"Longitude":null,"OSM_ID":6727429663,"NodeLatitude":33.8763468,"NodeLongitude":35.5393777,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:30","EndTime":"2024-01-13 16:04:30","Latitude":33.8768019483,"Longitude":35.5396286008,"OSM_ID":4488515681,"NodeLatitude":33.8767217,"NodeLongitude":35.5396124,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:04:31","EndTime":"2024-01-13 16:04:31","Latitude":null,"Longitude":null,"OSM_ID":6727429662,"NodeLatitude":33.8770648,"NodeLongitude":35.5398261,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:32","EndTime":"2024-01-13 16:04:32","Latitude":null,"Longitude":null,"OSM_ID":2580634724,"NodeLatitude":33.8771998,"NodeLongitude":35.5399096,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:34","EndTime":"2024-01-13 16:04:34","Latitude":null,"Longitude":null,"OSM_ID":4488515678,"NodeLatitude":33.8773253,"NodeLongitude":35.5400001,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:35","EndTime":"2024-01-13 16:04:35","Latitude":null,"Longitude":null,"OSM_ID":4488515679,"NodeLatitude":33.877396,"NodeLongitude":35.5400672,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:37","EndTime":"2024-01-13 16:04:37","Latitude":null,"Longitude":null,"OSM_ID":4488515680,"NodeLatitude":33.8774316,"NodeLongitude":35.5400986,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:38","EndTime":"2024-01-13 16:04:38","Latitude":null,"Longitude":null,"OSM_ID":2580634738,"NodeLatitude":33.8774583,"NodeLongitude":35.5401265,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:40","EndTime":"2024-01-13 16:04:40","Latitude":null,"Longitude":null,"OSM_ID":4488515677,"NodeLatitude":33.8775153,"NodeLongitude":35.5401889,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:41","EndTime":"2024-01-13 16:04:41","Latitude":null,"Longitude":null,"OSM_ID":4488515676,"NodeLatitude":33.877562,"NodeLongitude":35.5402531,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:42","EndTime":"2024-01-13 16:04:42","Latitude":null,"Longitude":null,"OSM_ID":2580634734,"NodeLatitude":33.8776305,"NodeLongitude":35.5403533,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:44","EndTime":"2024-01-13 16:04:44","Latitude":null,"Longitude":null,"OSM_ID":4488515672,"NodeLatitude":33.8776754,"NodeLongitude":35.5404204,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:45","EndTime":"2024-01-13 16:04:45","Latitude":null,"Longitude":null,"OSM_ID":2580634748,"NodeLatitude":33.8777189,"NodeLongitude":35.5405016,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:47","EndTime":"2024-01-13 16:04:47","Latitude":null,"Longitude":null,"OSM_ID":4488515675,"NodeLatitude":33.8777481,"NodeLongitude":35.5405585,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:48","EndTime":"2024-01-13 16:04:48","Latitude":null,"Longitude":null,"OSM_ID":4488515674,"NodeLatitude":33.8777714,"NodeLongitude":35.5406153,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:50","EndTime":"2024-01-13 16:04:50","Latitude":null,"Longitude":null,"OSM_ID":4488515673,"NodeLatitude":33.8778121,"NodeLongitude":35.5407325,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:51","EndTime":"2024-01-13 16:04:51","Latitude":null,"Longitude":null,"OSM_ID":2107230289,"NodeLatitude":33.8778808,"NodeLongitude":35.5409855,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:52","EndTime":"2024-01-13 16:04:52","Latitude":null,"Longitude":null,"OSM_ID":4550691373,"NodeLatitude":33.8779322,"NodeLongitude":35.541199,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:54","EndTime":"2024-01-13 16:04:54","Latitude":null,"Longitude":null,"OSM_ID":5617698312,"NodeLatitude":33.8780433,"NodeLongitude":35.5415241,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:55","EndTime":"2024-01-13 16:04:55","Latitude":null,"Longitude":null,"OSM_ID":5617698313,"NodeLatitude":33.8781643,"NodeLongitude":35.5418164,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:57","EndTime":"2024-01-13 16:04:57","Latitude":null,"Longitude":null,"OSM_ID":4502638765,"NodeLatitude":33.8783153,"NodeLongitude":35.5421185,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:04:58","EndTime":"2024-01-13 16:04:58","Latitude":null,"Longitude":null,"OSM_ID":4515711396,"NodeLatitude":33.8784947,"NodeLongitude":35.5424178,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:00","EndTime":"2024-01-13 16:05:00","Latitude":null,"Longitude":null,"OSM_ID":2669684798,"NodeLatitude":33.8786254,"NodeLongitude":35.542576,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:01","EndTime":"2024-01-13 16:05:01","Latitude":null,"Longitude":null,"OSM_ID":292382779,"NodeLatitude":33.878838,"NodeLongitude":35.542775,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:02","EndTime":"2024-01-13 16:05:02","Latitude":null,"Longitude":null,"OSM_ID":292382780,"NodeLatitude":33.8792102,"NodeLongitude":35.5431046,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:04","EndTime":"2024-01-13 16:05:04","Latitude":null,"Longitude":null,"OSM_ID":11637585839,"NodeLatitude":33.8793577,"NodeLongitude":35.5432003,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:05","EndTime":"2024-01-13 16:05:05","Latitude":null,"Longitude":null,"OSM_ID":11637585844,"NodeLatitude":33.8794059,"NodeLongitude":35.5432315,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:07","EndTime":"2024-01-13 16:05:07","Latitude":null,"Longitude":null,"OSM_ID":4132959100,"NodeLatitude":33.8794678,"NodeLongitude":35.5432717,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:08","EndTime":"2024-01-13 16:05:08","Latitude":null,"Longitude":null,"OSM_ID":292653078,"NodeLatitude":33.8795412,"NodeLongitude":35.5433129,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:10","EndTime":"2024-01-13 16:05:10","Latitude":33.8797067291,"Longitude":35.5433749948,"OSM_ID":4488441564,"NodeLatitude":33.8797026,"NodeLongitude":35.5433831,"NodeType":"Road Node","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:12","EndTime":"2024-01-13 16:05:12","Latitude":null,"Longitude":null,"OSM_ID":4488437980,"NodeLatitude":33.8798107,"NodeLongitude":35.5434311,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:14","EndTime":"2024-01-13 16:05:14","Latitude":null,"Longitude":null,"OSM_ID":292653106,"NodeLatitude":33.8803478,"NodeLongitude":35.5436105,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:16","EndTime":"2024-01-13 16:05:16","Latitude":null,"Longitude":null,"OSM_ID":5478819510,"NodeLatitude":33.8804905,"NodeLongitude":35.5436341,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:18","EndTime":"2024-01-13 16:05:18","Latitude":null,"Longitude":null,"OSM_ID":3126296929,"NodeLatitude":33.8806496,"NodeLongitude":35.5436524,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:21","EndTime":"2024-01-13 16:05:21","Latitude":null,"Longitude":null,"OSM_ID":4488441563,"NodeLatitude":33.8807038,"NodeLongitude":35.5436559,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:23","EndTime":"2024-01-13 16:05:23","Latitude":null,"Longitude":null,"OSM_ID":292653107,"NodeLatitude":33.880888,"NodeLongitude":35.5436485,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:25","EndTime":"2024-01-13 16:05:25","Latitude":null,"Longitude":null,"OSM_ID":4515735249,"NodeLatitude":33.8811942,"NodeLongitude":35.5436123,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:27","EndTime":"2024-01-13 16:05:27","Latitude":null,"Longitude":null,"OSM_ID":4515763607,"NodeLatitude":33.8812923,"NodeLongitude":35.543587,"NodeType":"Intermediate","StreetName":"Boulevard Antoine Nicolas Chakhtoura"},{"StartTime":"2024-01-13 16:05:30","EndTime":"2024-01-13 16:05:30","Latitude":33.8814537782,"Longitude":35.5436380246,"OSM_ID":292653109,"NodeLatitude":33.8814271,"NodeLongitude":35.5435551,"NodeType":"Road Node","StreetName":"Avenue Antoine Chakhtoura"},{"StartTime":"2024-01-13 16:05:34","EndTime":"2024-01-13 16:05:34","Latitude":null,"Longitude":null,"OSM_ID":3610267598,"NodeLatitude":33.8817866,"NodeLongitude":35.5433965,"NodeType":"Intermediate","StreetName":"Avenue Antoine Chakhtoura"},{"StartTime":"2024-01-13 16:05:38","EndTime":"2024-01-13 16:05:38","Latitude":null,"Longitude":null,"OSM_ID":3610267611,"NodeLatitude":33.8819016,"NodeLongitude":35.5433315,"NodeType":"Intermediate","StreetName":"Avenue Antoine Chakhtoura"},{"StartTime":"2024-01-13 16:05:43","EndTime":"2024-01-13 16:05:43","Latitude":null,"Longitude":null,"OSM_ID":4515735245,"NodeLatitude":33.882017,"NodeLongitude":35.5432669,"NodeType":"Intermediate","StreetName":"Avenue Antoine Chakhtoura"},{"StartTime":"2024-01-13 16:05:47","EndTime":"2024-01-13 16:05:47","Latitude":null,"Longitude":null,"OSM_ID":4451391462,"NodeLatitude":33.8821602,"NodeLongitude":35.5431787,"NodeType":"Intermediate","StreetName":"Avenue Antoine Chakhtoura"},{"StartTime":"2024-01-13 16:05:51","EndTime":"2024-01-13 16:05:51","Latitude":null,"Longitude":null,"OSM_ID":3610267618,"NodeLatitude":33.8824585,"NodeLongitude":35.5430321,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:05:56","EndTime":"2024-01-13 16:05:56","Latitude":null,"Longitude":null,"OSM_ID":3610267594,"NodeLatitude":33.8825859,"NodeLongitude":35.5429507,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:00","EndTime":"2024-01-13 16:06:00","Latitude":null,"Longitude":null,"OSM_ID":4451391486,"NodeLatitude":33.8826211,"NodeLongitude":35.5429367,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:04","EndTime":"2024-01-13 16:06:04","Latitude":null,"Longitude":null,"OSM_ID":3610267595,"NodeLatitude":33.8826615,"NodeLongitude":35.542932,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:09","EndTime":"2024-01-13 16:06:09","Latitude":null,"Longitude":null,"OSM_ID":4451391487,"NodeLatitude":33.8826957,"NodeLongitude":35.5429332,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:13","EndTime":"2024-01-13 16:06:13","Latitude":null,"Longitude":null,"OSM_ID":292653092,"NodeLatitude":33.8827248,"NodeLongitude":35.5429483,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:17","EndTime":"2024-01-13 16:06:17","Latitude":null,"Longitude":null,"OSM_ID":5503509757,"NodeLatitude":33.8837061,"NodeLongitude":35.544581,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:22","EndTime":"2024-01-13 16:06:22","Latitude":null,"Longitude":null,"OSM_ID":7432104515,"NodeLatitude":33.8838802,"NodeLongitude":35.5448662,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:26","EndTime":"2024-01-13 16:06:26","Latitude":null,"Longitude":null,"OSM_ID":5503509756,"NodeLatitude":33.8841536,"NodeLongitude":35.5453323,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:30","EndTime":"2024-01-13 16:06:30","Latitude":null,"Longitude":null,"OSM_ID":3143704905,"NodeLatitude":33.8847071,"NodeLongitude":35.5462612,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:35","EndTime":"2024-01-13 16:06:35","Latitude":null,"Longitude":null,"OSM_ID":289195954,"NodeLatitude":33.885725,"NodeLongitude":35.5479437,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:39","EndTime":"2024-01-13 16:06:39","Latitude":null,"Longitude":null,"OSM_ID":2107230255,"NodeLatitude":33.8866243,"NodeLongitude":35.549457,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:43","EndTime":"2024-01-13 16:06:43","Latitude":null,"Longitude":null,"OSM_ID":290326714,"NodeLatitude":33.8875412,"NodeLongitude":35.5510465,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:48","EndTime":"2024-01-13 16:06:48","Latitude":null,"Longitude":null,"OSM_ID":11041713447,"NodeLatitude":33.8877383,"NodeLongitude":35.5513726,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:52","EndTime":"2024-01-13 16:06:52","Latitude":null,"Longitude":null,"OSM_ID":7428152981,"NodeLatitude":33.8888669,"NodeLongitude":35.5532401,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:06:56","EndTime":"2024-01-13 16:06:56","Latitude":null,"Longitude":null,"OSM_ID":4451591494,"NodeLatitude":33.8892946,"NodeLongitude":35.5539531,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:01","EndTime":"2024-01-13 16:07:01","Latitude":null,"Longitude":null,"OSM_ID":6499227932,"NodeLatitude":33.8894445,"NodeLongitude":35.5541894,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:07:14","EndTime":"2024-01-13 16:07:14","Latitude":null,"Longitude":null,"OSM_ID":6499227932,"NodeLatitude":33.8894445,"NodeLongitude":35.5541894,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:05","EndTime":"2024-01-13 16:07:05","Latitude":null,"Longitude":null,"OSM_ID":4516216029,"NodeLatitude":33.889485,"NodeLongitude":35.5542546,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:07:16","EndTime":"2024-01-13 16:07:16","Latitude":null,"Longitude":null,"OSM_ID":4516216029,"NodeLatitude":33.889485,"NodeLongitude":35.5542546,"NodeType":"Intermediate","StreetName":"Rue Ste. Mere Teresa"},{"StartTime":"2024-01-13 16:07:10","EndTime":"2024-01-13 16:07:10","Latitude":33.8895821817,"Longitude":35.554237217,"OSM_ID":6514118079,"NodeLatitude":33.8896203,"NodeLongitude":35.554181,"NodeType":"Road Node","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:12","EndTime":"2024-01-13 16:07:12","Latitude":null,"Longitude":null,"OSM_ID":2105757650,"NodeLatitude":33.8895813,"NodeLongitude":35.5541174,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:07:18","EndTime":"2024-01-13 16:07:18","Latitude":null,"Longitude":null,"OSM_ID":4451591487,"NodeLatitude":33.8895706,"NodeLongitude":35.5543924,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:38:01","EndTime":"2024-01-13 16:38:01","Latitude":null,"Longitude":null,"OSM_ID":4451591487,"NodeLatitude":33.8895706,"NodeLongitude":35.5543924,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:21","EndTime":"2024-01-13 16:07:21","Latitude":null,"Longitude":null,"OSM_ID":4451591480,"NodeLatitude":33.8896413,"NodeLongitude":35.5545087,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:38:05","EndTime":"2024-01-13 16:38:05","Latitude":null,"Longitude":null,"OSM_ID":4451591480,"NodeLatitude":33.8896413,"NodeLongitude":35.5545087,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:23","EndTime":"2024-01-13 16:07:23","Latitude":null,"Longitude":null,"OSM_ID":6736336512,"NodeLatitude":33.8897486,"NodeLongitude":35.5546904,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:07:23","EndTime":"2024-01-13 16:07:23","Latitude":null,"Longitude":null,"OSM_ID":6736336512,"NodeLatitude":33.8897486,"NodeLongitude":35.5546904,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:38:10","EndTime":"2024-01-13 16:38:10","Latitude":33.8899211314,"Longitude":35.5547243352,"OSM_ID":6736336512,"NodeLatitude":33.8897486,"NodeLongitude":35.5546904,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:38:10","EndTime":"2024-01-13 16:38:10","Latitude":33.8899211314,"Longitude":35.5547243352,"OSM_ID":6736336512,"NodeLatitude":33.8897486,"NodeLongitude":35.5546904,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:38:31","EndTime":"2024-01-13 16:38:31","Latitude":33.8898701818,"Longitude":35.5546511023,"OSM_ID":6736336512,"NodeLatitude":33.8897486,"NodeLongitude":35.5546904,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:38:31","EndTime":"2024-01-13 16:38:31","Latitude":33.8898701818,"Longitude":35.5546511023,"OSM_ID":6736336512,"NodeLatitude":33.8897486,"NodeLongitude":35.5546904,"NodeType":"Road Node","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:25","EndTime":"2024-01-13 16:07:25","Latitude":null,"Longitude":null,"OSM_ID":3052025669,"NodeLatitude":33.8908958,"NodeLongitude":35.5566333,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:27","EndTime":"2024-01-13 16:07:27","Latitude":null,"Longitude":null,"OSM_ID":6582793619,"NodeLatitude":33.8913517,"NodeLongitude":35.557379,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:30","EndTime":"2024-01-13 16:07:30","Latitude":null,"Longitude":null,"OSM_ID":11221840110,"NodeLatitude":33.8914239,"NodeLongitude":35.5574972,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:32","EndTime":"2024-01-13 16:07:32","Latitude":null,"Longitude":null,"OSM_ID":11221840112,"NodeLatitude":33.8917164,"NodeLongitude":35.5579762,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:34","EndTime":"2024-01-13 16:07:34","Latitude":null,"Longitude":null,"OSM_ID":4451613982,"NodeLatitude":33.8920094,"NodeLongitude":35.5584549,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:07:36","EndTime":"2024-01-13 16:07:36","Latitude":null,"Longitude":null,"OSM_ID":4451614394,"NodeLatitude":33.8921568,"NodeLongitude":35.5586999,"NodeType":"Intermediate","StreetName":"طريق ميرنا الشالوحي"},{"StartTime":"2024-01-13 16:07:38","EndTime":"2024-01-13 16:07:38","Latitude":null,"Longitude":null,"OSM_ID":4451614395,"NodeLatitude":33.8921617,"NodeLongitude":35.5586636,"NodeType":"Intermediate","StreetName":"طريق ميرنا الشالوحي"},{"StartTime":"2024-01-13 16:07:41","EndTime":"2024-01-13 16:07:41","Latitude":null,"Longitude":null,"OSM_ID":4451614396,"NodeLatitude":33.8921676,"NodeLongitude":35.5586141,"NodeType":"Intermediate","StreetName":"طريق ميرنا الشالوحي"},{"StartTime":"2024-01-13 16:07:43","EndTime":"2024-01-13 16:07:43","Latitude":null,"Longitude":null,"OSM_ID":4451614397,"NodeLatitude":33.892169,"NodeLongitude":35.5585734,"NodeType":"Intermediate","StreetName":"طريق ميرنا الشالوحي"},{"StartTime":"2024-01-13 16:07:45","EndTime":"2024-01-13 16:07:45","Latitude":null,"Longitude":null,"OSM_ID":4451614398,"NodeLatitude":33.8921646,"NodeLongitude":35.558538,"NodeType":"Intermediate","StreetName":"طريق ميرنا الشالوحي"},{"StartTime":"2024-01-13 16:07:47","EndTime":"2024-01-13 16:07:47","Latitude":null,"Longitude":null,"OSM_ID":4451614399,"NodeLatitude":33.8921543,"NodeLongitude":35.558499,"NodeType":"Intermediate","StreetName":"طريق ميرنا الشالوحي"},{"StartTime":"2024-01-13 16:07:50","EndTime":"2024-01-13 16:07:50","Latitude":33.8920739937,"Longitude":35.5583495827,"OSM_ID":4451613960,"NodeLatitude":33.892133,"NodeLongitude":35.5584373,"NodeType":"Road Node","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:08:00","EndTime":"2024-01-13 16:08:00","Latitude":null,"Longitude":null,"OSM_ID":11221840097,"NodeLatitude":33.8920073,"NodeLongitude":35.5582245,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:08:10","EndTime":"2024-01-13 16:08:10","Latitude":33.8916522756,"Longitude":35.5574814991,"OSM_ID":11221840099,"NodeLatitude":33.8916198,"NodeLongitude":35.5575687,"NodeType":"Road Node","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:08:17","EndTime":"2024-01-13 16:08:17","Latitude":null,"Longitude":null,"OSM_ID":11221840101,"NodeLatitude":33.8915412,"NodeLongitude":35.5574357,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:08:24","EndTime":"2024-01-13 16:08:24","Latitude":null,"Longitude":null,"OSM_ID":11221840103,"NodeLatitude":33.8914506,"NodeLongitude":35.5572823,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:08:32","EndTime":"2024-01-13 16:08:32","Latitude":33.8914587669,"Longitude":35.557069729,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:09:43","EndTime":"2024-01-13 16:09:43","Latitude":33.891546869,"Longitude":35.5571216503,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:12:18","EndTime":"2024-01-13 16:12:18","Latitude":33.8914875788,"Longitude":35.5571409105,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:12:27","EndTime":"2024-01-13 16:12:29","Latitude":33.8914541303,"Longitude":35.5571730354,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:12:30","EndTime":"2024-01-13 16:12:36","Latitude":33.8914002232,"Longitude":35.5571961779,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:08:58","EndTime":"2024-01-13 16:12:51","Latitude":33.8914858392,"Longitude":35.5570646272,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:13:13","EndTime":"2024-01-13 16:13:13","Latitude":33.8915188924,"Longitude":35.5569755808,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:13:01","EndTime":"2024-01-13 16:13:39","Latitude":33.8915253324,"Longitude":35.5570085651,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:09:14","EndTime":"2024-01-13 16:13:48","Latitude":33.891523558,"Longitude":35.557032492,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:13:54","EndTime":"2024-01-13 16:13:54","Latitude":33.891537492,"Longitude":35.5570388715,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:19:16","EndTime":"2024-01-13 16:19:16","Latitude":33.8915105667,"Longitude":35.5569682531,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:34:11","EndTime":"2024-01-13 16:34:11","Latitude":33.8915153199,"Longitude":35.5571256162,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:36:02","EndTime":"2024-01-13 16:36:02","Latitude":33.891494159,"Longitude":35.5570689391,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:36:04","EndTime":"2024-01-13 16:36:07","Latitude":33.8915116138,"Longitude":35.5570757835,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:36:19","EndTime":"2024-01-13 16:36:26","Latitude":33.8915343307,"Longitude":35.5571583695,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:36:37","EndTime":"2024-01-13 16:36:37","Latitude":33.8915069465,"Longitude":35.5571775116,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:37:15","EndTime":"2024-01-13 16:37:15","Latitude":33.8914748089,"Longitude":35.5570419488,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:37:38","EndTime":"2024-01-13 16:37:40","Latitude":33.8914290016,"Longitude":35.557092902,"OSM_ID":6582793620,"NodeLatitude":33.8914239,"NodeLongitude":35.5572371,"NodeType":"Stay Point","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:37:44","EndTime":"2024-01-13 16:37:44","Latitude":null,"Longitude":null,"OSM_ID":6601898956,"NodeLatitude":33.8910164,"NodeLongitude":35.5565463,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:37:48","EndTime":"2024-01-13 16:37:48","Latitude":null,"Longitude":null,"OSM_ID":11221840109,"NodeLatitude":33.8906856,"NodeLongitude":35.5559871,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:37:52","EndTime":"2024-01-13 16:37:52","Latitude":null,"Longitude":null,"OSM_ID":4220971866,"NodeLatitude":33.8905318,"NodeLongitude":35.5557272,"NodeType":"Intermediate","StreetName":"Avenue President Amine Gemayel"},{"StartTime":"2024-01-13 16:37:57","EndTime":"2024-01-13 16:37:57","Latitude":null,"Longitude":null,"OSM_ID":4516213592,"NodeLatitude":33.8896577,"NodeLongitude":35.5542466,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:39:00","EndTime":"2024-01-13 16:39:00","Latitude":null,"Longitude":null,"OSM_ID":6736336516,"NodeLatitude":33.889516,"NodeLongitude":35.554898,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:39:30","EndTime":"2024-01-13 16:39:30","Latitude":33.8899947614,"Longitude":35.5551917469,"OSM_ID":6736336511,"NodeLatitude":33.8895782,"NodeLongitude":35.5551202,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:39:38","EndTime":"2024-01-13 16:39:38","Latitude":null,"Longitude":null,"OSM_ID":6736336522,"NodeLatitude":33.8892271,"NodeLongitude":35.5553409,"NodeType":"Intermediate","StreetName":"شارع بربر أبو جودة"},{"StartTime":"2024-01-13 16:39:46","EndTime":"2024-01-13 16:39:46","Latitude":null,"Longitude":null,"OSM_ID":6697197342,"NodeLatitude":33.889748,"NodeLongitude":35.5562112,"NodeType":"Intermediate","StreetName":"شارع بربر أبو جودة"},{"StartTime":"2024-01-13 16:39:54","EndTime":"2024-01-13 16:39:54","Latitude":null,"Longitude":null,"OSM_ID":3052025667,"NodeLatitude":33.889882,"NodeLongitude":35.5564351,"NodeType":"Intermediate","StreetName":"شارع بربر أبو جودة"},{"StartTime":"2024-01-13 16:40:02","EndTime":"2024-01-13 16:40:02","Latitude":null,"Longitude":null,"OSM_ID":290325906,"NodeLatitude":33.889991,"NodeLongitude":35.5566306,"NodeType":"Intermediate","StreetName":"شارع بربر أبو جودة"},{"StartTime":"2024-01-13 16:40:10","EndTime":"2024-01-13 16:40:10","Latitude":33.890203638,"Longitude":35.5571126191,"OSM_ID":11356639101,"NodeLatitude":33.8903598,"NodeLongitude":35.5572447,"NodeType":"Road Node","StreetName":"شارع بربر أبو جودة"},{"StartTime":"2024-01-13 16:40:30","EndTime":"2024-01-13 16:40:30","Latitude":null,"Longitude":null,"OSM_ID":6601898954,"NodeLatitude":33.8907716,"NodeLongitude":35.5579305,"NodeType":"Intermediate","StreetName":null},{"StartTime":"2024-01-13 16:40:50","EndTime":"2024-01-13 16:40:50","Latitude":33.8901674571,"Longitude":35.5584061206,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:41:10","EndTime":"2024-01-13 16:41:10","Latitude":33.8903928095,"Longitude":35.5583563324,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:41:31","EndTime":"2024-01-13 16:41:31","Latitude":33.8904500146,"Longitude":35.5583727214,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:42:30","EndTime":"2024-01-13 16:42:30","Latitude":33.8902613072,"Longitude":35.5585384024,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:40:34","EndTime":"2024-01-13 16:42:36","Latitude":33.8902402999,"Longitude":35.5584394595,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:40:33","EndTime":"2024-01-13 16:42:53","Latitude":33.8902787508,"Longitude":35.558412612,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 16:43:15","EndTime":"2024-01-13 16:43:15","Latitude":33.8902935483,"Longitude":35.558390164,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 16:45:20","EndTime":"2024-01-13 16:45:20","Latitude":33.8903269505,"Longitude":35.558124824,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 17:04:53","EndTime":"2024-01-13 17:04:53","Latitude":33.89030069,"Longitude":35.5583799134,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 17:07:22","EndTime":"2024-01-13 17:07:22","Latitude":33.8902502896,"Longitude":35.5583796602,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 17:06:28","EndTime":"2024-01-13 17:08:06","Latitude":33.8902360819,"Longitude":35.5584080239,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 17:06:08","EndTime":"2024-01-13 17:08:39","Latitude":33.8902549801,"Longitude":35.5584208122,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Stay Point","StreetName":null},{"StartTime":"2024-01-13 17:10:35","EndTime":"2024-01-13 17:10:35","Latitude":33.8901297633,"Longitude":35.5585364843,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null},{"StartTime":"2024-01-13 17:30:37","EndTime":"2024-01-13 17:30:37","Latitude":33.8900718059,"Longitude":35.5583689847,"OSM_ID":6601898953,"NodeLatitude":33.8901091,"NodeLongitude":35.5585243,"NodeType":"Road Node","StreetName":null}]
      let routearray:any[]=[];
    
      this.tablerow++;

      array.forEach((route:any)=>{
        routearray.push([route.NodeLatitude,route.NodeLongitude]);
       
      });
      //console.log("routearray-----------",routearray)
      //console.log("array-----------",array)
      $('#route').css('display', '');

      let polyline = L.polyline(routearray, { color: 'red' }).addTo(this.map);

      // this.map.fitBounds(polyline.getBounds());
      var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      let x=L.marker([routearray[0][0],routearray[0][1]], {icon: greenIcon}).addTo(this.map);
      //console.log("11111111-----------",x)
      //  L.marker([routearray[0][0],routearray[0][1]]).addTo(this.map);
      var red = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      let y= L.marker([routearray[routearray.length-1][0],routearray[routearray.length-1][1]],{icon: red}).addTo(this.map);
       //console.log("yyyy-----------",y);
       this.displayedColumns = ['Time', 'StreetName', 'Lng', 'lat'];
       for (let i = this.count; i < array.length; i++) {
    
        // array2.push(array[i]);

        let x:any = {
         
          Time: array[i].StartTime,
          StreetName: array[i].StreetName,
          Lng: array[i].NodeLongitude,
          lat: array[i].NodeLatitude,
        }
        this.Datatable1.unshift(x);
        this.Datatable=this.Datatable1;
        this.tablerow++;
      }
      this.tablerow++;
      this.openTable=true;


    }



    async displayClusters(AlocSimulId:any){
      //console.log('AlocSimulId>>>>>>>',AlocSimulId);
  
  
  
      this.displayclusters=true;
      const responsesArray: any[] = [];
      if(AlocSimulId.toString().indexOf(',') != -1){
          const idsArray = AlocSimulId.split(',');
          this.marker = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            animate: true,
            singleMarkerMode: true,
          });
          this.markerLoop = L.markerClusterGroup({
            spiderfyOnMaxZoom: false,
            animate: true,
            singleMarkerMode: true,
          });
          for (const id of idsArray) {
            await this.datacrowdService.getsimualtion(id, '8758').then((res: any) => {
              // responsesArray.push(res);
              //console.log("jp>>>>>>>>>>>>>> response >>>>",res);
              this.datajson=res;
  
              //console.log("this.datajson.markerPositions1111>>>>", this.datajson.markerPositions);
              if (this.datajson.markerPositions !== null) {
                //console.log("this.datajson.markerPositions<<<>>>>>", this.datajson.markerPositions.length);
         
                let lastMarkerLat = 0;
                let lastMarkerLng = 0;
          
                for (var j = 0; j < 1; j++) {
                  for (var i = 0; i < this.datajson.markerPositions.length; i++) {
                    this.markers = L.marker([
                      Number(this.datajson.markerPositions[i][0]),
                      Number(this.datajson.markerPositions[i][1]),
                    ]);
                    this.markers.off("click");
                    this.markers.on("mousedown", (e: any) => {
                      if (e.originalEvent.buttons == 2) {
                        e.target.openPopup();
          
                      }
                      if (e.originalEvent.buttons == 1) {
                        //  alert(1);
                      }
                    });
                    this.markersArray.push(this.markers)
                    
            lastMarkerLat = this.datajson.markerPositions[i][0];
            lastMarkerLng = this.datajson.markerPositions[i][1];
                  }
                }
          
           
          
                //       markersBatch.push(marker);
                //     }
          
                //     // Apply event listeners to the batch of markers
                //     markersBatch.forEach(marker => {
                //       marker.off("click");
                //       marker.on("mousedown", (e: any) => {
                //         if (e.originalEvent.buttons == 2) {
                //           e.target.openPopup();
                //         }
                //         if (e.originalEvent.buttons == 1) {
                //           // alert(1);
                //         }
                //       });
          
                //       this.markersArray.push(marker);
                //     });
          
                //     // Clear markersBatch to free up memory
                //     markersBatch.length = 0;
                //   }
                // }
                // // End the timer and log the elapsed time
                // //console.timeEnd('loopTime');
          
                //     //  this.marker.openPopup(
                //     //  html11
                //     //  );
          
          
                this.map.setView([lastMarkerLat, lastMarkerLng],12);
          
                this.rowData = [];
                this.datajson.markerPositions.forEach((element: any, key: any) => {
                  this.myMarker = this.binddata(
                    element[0],
                    element[1],
                    element[2],
                    element[3],
                    element[4],
                    element[5],
                    ""
                  );
          
                  this.myMarker.lat = element[0];
                  this.myMarker.lng = element[1];
                  this.myMarker.timestamp = element[3];
                  this.myMarker.tel = element[2];
                  this.myMarker.name = element[4];
                  this.marker.addLayer(this.myMarker);
                  this.markerLoop.addLayer(this.myMarker);
                  this.myMarker.off("click");
                  this.myMarker.on("mousedown", async (e: any) => {
                    if (e.originalEvent.buttons == 2) {
                      //console.log("markerChildrensssssss", e.target)
                      this.rowData = [];
                      var jsonaggrid = {
                        Device_id: e.target.tel,
                        Tel: e.target.name,
                        Date: e.target.timestamp,
                        Hits: "1",
                        Coord: e.target.lat + ',' + e.target.lng,
                        //Lat:e.target.lat
                      };
                      this.rowData.push(jsonaggrid);
          
          
                      const componentfactory =
                        this.componentFactoryResolver.resolveComponentFactory(
                          VAgGridComponent
                        );
                      const componentref =
                        this.viewContainerRef.createComponent(componentfactory);
                      componentref.instance.rowData = this.rowData;
                      componentref.instance.columnDefs = this.columnDefs;
                      componentref.instance.headerHeight = 0;
                      // componentref.instance.selectdevices = true;
                      componentref.instance.Title = "Here On";
                      componentref.instance.distinct = true;
                      componentref.changeDetectorRef.detectChanges();
                      componentref.instance.Grid2Type = 'btn-54';
                      componentref.instance.GridID = 'GeoGrid1';
          
                      const html2 = componentref.location.nativeElement;
                      await html2;
          
                      // $('#agGrid').css('height','10px');
                      $('.ag-theme-balham').css('height', '130px');
          
          
                      // /  e.target.openPopup(html2, e.target._latlng);
                      this.map.openPopup(html2, e.target._latlng);
          
          
                    } else if (e.originalEvent.buttons == 1) {
          
                    }
          
                  });
                });
          
                const componentfactory =
                  this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
                const componentref =
                  this.viewContainerRef.createComponent(componentfactory);
                const html1 = (componentref.location.nativeElement.style.display = "none");
                componentref.instance.columnDefs = this.columnDefs;
                componentref.changeDetectorRef.detectChanges();
                this.marker.off("click");
                this.marker.on("clustermousedown", async (e: any) => {
                  if (e.originalEvent.buttons == 2) {
                    var markerChildrens = e.layer.getAllChildMarkers();
          
          
          
          
          
                    this.rowData = [];
          
                    for (var j = 0; j < markerChildrens.length; j++) {
                      var jsonaggrid = {
                        Device_id: markerChildrens[j].tel,
                        Tel: markerChildrens[j].name,
                        Date: markerChildrens[j].timestamp,
                        Hits: "1",
                        Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,
                        // Lat:markerChildrens[j].lat
                      };
                      this.rowData.push(jsonaggrid);
                    }
          
                    //console.log("markerChildrens>>>>>", markerChildrens);
          
                    const componentfactory =
                      this.componentFactoryResolver.resolveComponentFactory(
                        VAgGridComponent
                      );
                    const componentref =
                      this.viewContainerRef.createComponent(componentfactory);
                    componentref.instance.rowData = this.rowData;
                    componentref.instance.columnDefs = this.columnDefs;
                    componentref.instance.headerHeight = 0;
                    // componentref.instance.selectdevices = true;
                    componentref.instance.Title = "Here On";
                    componentref.instance.distinct = true;
                    componentref.changeDetectorRef.detectChanges();
                    componentref.instance.pagination = false;
                    componentref.instance.rowGrouping = true;
                    componentref.instance.contextmenu = false;
                    componentref.instance.Grid2Type = 'btn-54';
                    componentref.instance.GridID = 'GeoGrid1';
                    const html1 = componentref.location.nativeElement;
                    await html1;
                    //console.log("markerChildrens.length>>>>>>", markerChildrens.length)
                    if (markerChildrens.length < 3) {
                      // $('#agGrid').css('height','10px');
                      $('.ag-theme-balham').css('height', '130px');
          
                    } else {
                      $('.ag-theme-balham').css('height', ' 250px ');
          
                    }
          
          
                    this.map.openPopup(html1, e.layer.getLatLng());
          
                    // $(".modal-content").css("width","650px");
                    // $(".modal-content").css("right","200px");
                    // $(".modal-content").css("padding","10px");
                    // $(".modal-content").css("top","85px");
                    // $(".modal-content").draggable({
                    //   axis: "both",
                    //   cursor: "move"
                    // });
                    //  this.modalRef =this.modalService.open(this.popupContent1);
          
                  }
                  if (e.originalEvent.buttons == 1) {
                    // alert(4);
          
                  }
          
                  //open popup;
                });
          
                this.map.addLayer(this.marker);
                
                this.magnifiedMap.addLayer(this.markerLoop);
                this.layerGroup.addLayer(this.marker);
                this.layerGroup.addLayer(this.markers);
          }
  
            });
          }
  
     
      }else{
      await this.datacrowdService.getsimualtion(AlocSimulId, this.usercode).then((res: any) => {
        this.datajson = res;
        //console.log("getsimultion response >>>>", this.datajson);
      });
  
      //console.log("this.datajson.markerPositions>>>>", this.datajson.markerPositions);
  
      if (this.datajson.markerPositions !== null) {
        //console.log("this.datajson.markerPositions<<<>>>>>", this.datajson.markerPositions.length);
        this.marker = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          animate: true,
          singleMarkerMode: true,
        });
        let lastMarkerLat = 0;
        let lastMarkerLng = 0;
  
        for (var j = 0; j < 1; j++) {
          for (var i = 0; i < this.datajson.markerPositions.length; i++) {
            this.markers = L.marker([
              Number(this.datajson.markerPositions[i][0]),
              Number(this.datajson.markerPositions[i][1]),
            ]);
            this.markers.off("click");
            this.markers.on("mousedown", (e: any) => {
              if (e.originalEvent.buttons == 2) {
                e.target.openPopup();
  
              }
              if (e.originalEvent.buttons == 1) {
                //  alert(1);
              }
            });
            this.markersArray.push(this.markers)
            
    lastMarkerLat = this.datajson.markerPositions[i][0];
    lastMarkerLng = this.datajson.markerPositions[i][1];
          }
        }
  
   
  
        //       markersBatch.push(marker);
        //     }
  
        //     // Apply event listeners to the batch of markers
        //     markersBatch.forEach(marker => {
        //       marker.off("click");
        //       marker.on("mousedown", (e: any) => {
        //         if (e.originalEvent.buttons == 2) {
        //           e.target.openPopup();
        //         }
        //         if (e.originalEvent.buttons == 1) {
        //           // alert(1);
        //         }
        //       });
  
        //       this.markersArray.push(marker);
        //     });
  
        //     // Clear markersBatch to free up memory
        //     markersBatch.length = 0;
        //   }
        // }
        // // End the timer and log the elapsed time
        // //console.timeEnd('loopTime');
  
        //     //  this.marker.openPopup(
        //     //  html11
        //     //  );
  
  
        this.map.setView([lastMarkerLat, lastMarkerLng],12);
  
        this.rowData = [];
        this.datajson.markerPositions.forEach((element: any, key: any) => {
          this.myMarker = this.binddata(
            element[0],
            element[1],
            element[2],
            element[3],
            element[4],
            element[5],
            ""
          );
  
          this.myMarker.lat = element[0];
          this.myMarker.lng = element[1];
          this.myMarker.timestamp = element[3];
          this.myMarker.tel = element[2];
          this.myMarker.name = element[4];
          this.marker.addLayer(this.myMarker);
          this.myMarker.off("click");
          this.myMarker.on("mousedown", async (e: any) => {
            if (e.originalEvent.buttons == 2) {
              //console.log("markerChildrensssssss", e.target)
              this.rowData = [];
              var jsonaggrid = {
                Device_id: e.target.tel,
                Tel: e.target.name,
                Date: e.target.timestamp,
                Hits: "1",
                Coord: e.target.lat + ',' + e.target.lng,
                //Lat:e.target.lat
              };
              this.rowData.push(jsonaggrid);
  
  
              const componentfactory =
                this.componentFactoryResolver.resolveComponentFactory(
                  VAgGridComponent
                );
              const componentref =
                this.viewContainerRef.createComponent(componentfactory);
              componentref.instance.rowData = this.rowData;
              componentref.instance.columnDefs = this.columnDefs;
              componentref.instance.headerHeight = 0;
              // componentref.instance.selectdevices = true;
              componentref.instance.Title = "Here On";
              componentref.instance.distinct = true;
              componentref.changeDetectorRef.detectChanges();
              componentref.instance.Grid2Type = 'btn-54';
              componentref.instance.GridID = 'GeoGrid1';
  
              const html2 = componentref.location.nativeElement;
              await html2;
  
              // $('#agGrid').css('height','10px');
              $('.ag-theme-balham').css('height', '130px');
  
  
              // /  e.target.openPopup(html2, e.target._latlng);
              this.map.openPopup(html2, e.target._latlng);
  
  
            } else if (e.originalEvent.buttons == 1) {
  
            }
  
          });
        });
  
        const componentfactory =
          this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
        const componentref =
          this.viewContainerRef.createComponent(componentfactory);
        const html1 = (componentref.location.nativeElement.style.display = "none");
        componentref.instance.columnDefs = this.columnDefs;
        componentref.changeDetectorRef.detectChanges();
        this.marker.off("click");
        this.marker.on("clustermousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            var markerChildrens = e.layer.getAllChildMarkers();
  
  
  
  
  
            this.rowData = [];
  
            for (var j = 0; j < markerChildrens.length; j++) {
              var jsonaggrid = {
                Device_id: markerChildrens[j].tel,
                Tel: markerChildrens[j].name,
                Date: markerChildrens[j].timestamp,
                Hits: "1",
                Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,
                // Lat:markerChildrens[j].lat
              };
              this.rowData.push(jsonaggrid);
            }
  
            //console.log("markerChildrens>>>>>", markerChildrens);
  
            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            // componentref.instance.selectdevices = true;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.pagination = false;
            componentref.instance.rowGrouping = true;
            componentref.instance.contextmenu = false;
            componentref.instance.Grid2Type = 'btn-54';
            componentref.instance.GridID = 'GeoGrid1';
            const html1 = componentref.location.nativeElement;
            await html1;
            //console.log("markerChildrens.length>>>>>>", markerChildrens.length)
            if (markerChildrens.length < 3) {
              // $('#agGrid').css('height','10px');
              $('.ag-theme-balham').css('height', '130px');
  
            } else {
              $('.ag-theme-balham').css('height', ' 250px ');
  
            }
  
  
            this.map.openPopup(html1, e.layer.getLatLng());
  
            // $(".modal-content").css("width","650px");
            // $(".modal-content").css("right","200px");
            // $(".modal-content").css("padding","10px");
            // $(".modal-content").css("top","85px");
            // $(".modal-content").draggable({
            //   axis: "both",
            //   cursor: "move"
            // });
            //  this.modalRef =this.modalService.open(this.popupContent1);
  
          }
          if (e.originalEvent.buttons == 1) {
            // alert(4);
  
          }
  
          //open popup;
        });
  
        this.map.addLayer(this.marker);
        
        this.magnifiedMap.addLayer(this.markerLoop);
        this.layerGroup.addLayer(this.marker);
        this.layerGroup.addLayer(this.markers);
  }
    }
  
  
  
  
  
  }
  displayTimelineCoTraveler(){
    this.DisplayCoTravelerflag = 2;
    this.displayCoTravelers();
  }

  

  
  clickedDeviceId(eventData: any) {
    //console.log('eventData------', eventData);
    this.selectedDeviceId=eventData;
    let tableroutearray:any[]=[];

    this.routedatajson.forEach((elt:any)=>{
     if(elt.device_id=eventData.row){
       tableroutearray.push(elt);
     }
    });
    //console.log("tableroutearray-----------",tableroutearray);
    this.typeofdata='trace';
    this.opentableData(tableroutearray, this.typeofdata);
  }

  opentableData(array:any,typeofdata:any){
    this.openTable=true;

    if(typeofdata=='devicehistory'){
    
        // array2.push(array[i]); 
  
      array.forEach((elt:any)=>{
        let x:any = {
          deviceid: elt[2],
          Time:  this.dateTtoDate(elt[3]),
          Lng: elt[1],
          lat: elt[0],
        }
        this.Datatable1.unshift(x);
        this.Datatable=this.Datatable1;
        this.tablerow++;
      })
    
     

    }
   else if(typeofdata=='trace')
   { 
    for (let i = this.count; i < array.length; i++) {
  
      // array2.push(array[i]);

      let x:any = {
       
        Time: array[i].StartTime,
        StreetName: array[i].StreetName,
        Lng: array[i].NodeLongitude,
        lat: array[i].NodeLatitude,
      }
      this.Datatable1.unshift(x);
      this.Datatable=this.Datatable1;
      this.tablerow++;
    }
  }
    console.log("this.Datatable-----------",this.Datatable);
  }

  Routedevice(event:any){
    let deviceId=event.srcElement.id;
    if(event.target.checked==false){
      this.routingpolyline.forEach((element: any) => {
        if(element.deviceId===deviceId){
        this.map.removeLayer(element);
        }
      });

    }else{
      this.routingpolyline.forEach((element: any) => {
        let checkedLayer:boolean=this.map.hasLayer(element);
        if(element.deviceId===deviceId){
          if(checkedLayer===false){
            this.map.addLayer(element);         
            }
        }
        });
    }
  }

  hideroute(event:any){
    if(event.target.checked==false){
    this.routingicons.forEach((element: any) => {
      this.map.removeLayer(element);
    });
   

    this.routingpolyline.forEach((element: any) => {
      this.map.removeLayer(element);
    });
  }else{
    this.routingicons.forEach((element: any) => {
      this.map.addLayer(element);
    });
   

    this.routingpolyline.forEach((element: any) => {
      this.map.addLayer(element);
    });
  }
  }

  displayMarkerRoute(){
    //console.log('to millisecond----',this.routedatajson[0].StartTime.getMilliseconds());

    this.routedatajson.sort((a:any, b:any) => a.StartTime.getMilliseconds() - b.StartTime.getMilliseconds());
    //console.log('routedatajson----------',this.routedatajson);
  }


  displaysenarioSequence(){

    this.displaysenario(this.dataService.getsenarioID());
  }

 




 

  


    
   
      
  async butnmap(){

let obj22:any={
  senarioParentName:this.senarioParentName,
  simulationid:179703,
  Action:"addnewMenu",
  senariocount:this.senariocount,
  senarioFlag:this.senarioFlag,
  reportType:this.reportType


}
  
// this.senarioIdOutput.emit(obj22);
this.navbarSimulId=obj22;

  }

  changebarRoute1(){
    this.stopRoute();
    this.startRoute1();
    console.log("speedTimeRoute----------",this.speedTimeRoute)
  }

  startRoute(){
    this.isRunningRoute = true;
    this.getrouteLine();
  }

  startRoute1(){
    this.isRunningRoute = true;
    this.displaybyroute();
  }


  stopRoute(){
  this.isRunningRoute = false;
  }

    toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent1");
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  }



clearRoutes(){
  this.routeDeviceArray.forEach((elt:any)=>{
    this.map.removeLayer(elt);
    });
    this.routeDeviceArrayLoop.forEach((elt:any)=>{
      this.magnifiedMap.removeLayer(elt);
      });
  this.polylineRouteArray.forEach((elt:any)=>{
  this.map.removeLayer(elt);
  });
  this.isRunningRoute = false;
  this.openTable=false;
  $('#controlbutton').css('display', 'none');
  $('#routebar').css('display', 'none');
  $('#routebar1').css('display', 'none');
  
  this.routeDeviceArray=[];
  this.routeDeviceArrayLoop=[];
  this.typeofdata='';
  this.speedTimeRoute=0;
  this.routingpolyline=[];
  this.routingicons=[];
  this.currentIndex=0;
  this.displayedColumns =[];
  this.Datatable1=[];
  this.Datatable=[];
  this.polylineRouteArray=[];
  this.tablerow=0;
  this.indexRoute=0;
  this.count=0;


}





  async getrouteLine(){
    console.log("this.isRunningRoute----",this.isRunningRoute);
    console.log("this.routeDevices----",this.routeDevices);
    console.log("this.Devices----",this.Devices);
    
    if (this.isRunningRoute==false) {
      return;
  }
    this.openTable=true;
    // this.isRunningRoute = true;
  
    let array:any[]=[];
    let route:any[]=[];
    let routeDevices1:any[]=[];
    let routeDevices:any[]=[];
  
    // this.routeDevices='4e79560f-e59a-4d7b-8b91-6dddbd571c57,436cab63-5002-475d-8d11-c321e5850659';
    
    routeDevices = this.dataService.getroutedevices().split(',');
    this.routeDevicestable=routeDevices;
    console.log("this.routeDevices-----------", routeDevices)
    let colorarray:any[]=['green','red',this.SectorColor,'yellow','purpule'];
     routeDevices.forEach((deviceId:any,index:any)=>{
       
      routeDevices1.push({'deviceid':deviceId,'color':colorarray[index]})
    });

  // let routeDevices1= [{'deviceid':'4e79560f-e59a-4d7b-8b91-6dddbd571c57','color':'green'},{'deviceid':'436cab63-5002-475d-8d11-c321e5850659','color':"red"}]
  this.displayedColumns = ['deviceid','Time','Lng', 'lat'];

   
    let datajson:any;
    // await this.http.get<any[]>('/assets/angularjson.json').subscribe((data:any[]) => {
      $('#controlbutton').css('display', '');
      $('#routebar').css('display', '');
      // console.log("data-----------",data)
      // datajson=data;
      datajson=this.datajson;
      // datajson=this.datajson;
       this.routedatajson=datajson;

       let markerPositions = datajson['markerPositions'];
       console.log("markerPositions-----------",markerPositions)
       this.routedatajson=this.routedatajson;
       this.displayRoute=true;
       this.displayclusters=true;
      // this.displayRouteLine(markerPositions);

      // console.log('routedatajson----------',this.routedatajson);


    let color;
    let x1:any=[{'deviceid':'','color':''}];
    let data11:any=this.routedatajson.markerPositions;
    // console.log("data11----",data11);
    // console.log("animatedmarker1----",this.animatedmarker1);
    // console.log("route[route.length-1]----",route[route.length-1]);
    let arrayfortable:any[]=[];
    
      console.log("speedTimeRoute----",this.speedTimeRoute);
      // console.log("routeDevices1----", routeDevices1);
    // for( let i=this.indexRoute;i<data11.length;i++){
      // console.log("data11[i][2]----", data11[i][2]);
    
      setTimeout(async ()  => {
        let elt=data11[this.indexRoute];
        x1 =  routeDevices1.find((a:any)=>{
        // console.log("aaaaaa----",a);
        return  a.deviceid==elt[2]
      });

 color=x1.color;

    console.log("x1--------",x1)
    var greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-'+color+'.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
   

this.animatedmarker1=L.marker([elt[0],elt[1]], {icon: greenIcon}).addTo(this.map);
let animatedmarker1:any=L.marker([elt[0],elt[1]], {icon: greenIcon}).addTo(this.magnifiedMap);

this.animatedmarker1.deviceid=x1.deviceid;

if(this.routingMarkerArr[elt[2]]){
   this.map.removeLayer(this.routingMarkerArr[elt[2]]);
}

if(this.routingMarkerArrLoop[elt[2]]){
  this.magnifiedMap.removeLayer(this.routingMarkerArrLoop[elt[2]]);
}

this.routingMarkerArr[elt[2]]=this.animatedmarker1;
this.routingMarkerArrLoop[elt[2]]=animatedmarker1;
route.push(this.animatedmarker1);
if(this.animatedmarker1!='undefined'){
  this.routeDeviceArray.push(this.animatedmarker1);

}
if( animatedmarker1!='undefined'){
  this.routeDeviceArrayLoop.push( animatedmarker1);

}

arrayfortable.push(elt);

this.typeofdata='devicehistory'
this.opentableData(arrayfortable,this.typeofdata);
this.indexRoute++;

if (this.isRunningRoute==false) {
return;
}

await this.getrouteLine();


}

, 3000/this.speedTimeRoute);

// }
console.log("this.speedTimeRoute----",this.speedTimeRoute);
    // });
  }

  displayRouteLine(datajson:any[]){
    //  this.routeDevices= ['3CD0A7B8-B53A-4DF3-A10A-9EB9DF6D7F0C','912c1b4f-9077-4d0b-ad9d-19951ef08e30']
    // this.routeDevices=['26e170d1-9bbc-4b1f-b3e9-4a7fd265a033','4e79560f-e59a-4d7b-8b91-6dddbd571c57'];
    console.log('datajson----------',datajson);
    this.displayedColumns = ['Time', 'StreetName', 'Lng', 'lat'];
    let tableroutearray:any[]=[];
    let count=0;
    this.routeDevices.forEach((deviceId:any)=>{

      // let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
     let color:any[]=['red',this.SectorColor];
      tableroutearray=[];
      let array:any[]=[];
      let routearray:any[]=[];
   
      datajson.forEach((elt:any)=>{

      if(deviceId===this.routeDevices[0]){
     //by default fist deviceId

        if(elt[2]===deviceId){
        tableroutearray.push(elt);
        }
      }
        if(elt[2]===deviceId){
          array.push(elt);
          if(elt[0] !=null && elt[1]!= null){
            routearray.push([elt[0],elt[1]]);
          }
        }
       });
      
       console.log("array-----------",array);
       console.log("routearray-----------",routearray)
        
       let polyline:any = L.polyline(routearray, { color: color[count] }).addTo(this.map);
       polyline.deviceId = deviceId;

       console.log("polyline-----------",polyline);

      this.routingpolyline.push(polyline);
       count++;
 
       this.map.fitBounds(polyline.getBounds());
       var greenIcon = new L.Icon({
         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
         iconSize: [25, 41],
         iconAnchor: [12, 41],
         popupAnchor: [1, -34],
         shadowSize: [41, 41]
       });
       
       let x=L.marker([routearray[0][0],routearray[0][1]], {icon: greenIcon}).addTo(this.map);
       console.log("11111111-----------",x)
       //  L.marker([routearray[0][0],routearray[0][1]]).addTo(this.map);
       var red = new L.Icon({
         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
         iconSize: [25, 41],
         iconAnchor: [12, 41],
         popupAnchor: [1, -34],
         shadowSize: [41, 41]
       });
       let y= L.marker([routearray[routearray.length-1][0],routearray[routearray.length-1][1]],{icon: red}).addTo(this.map);
        
       this.routingicons.push({'startPoint':x,'endPoint':y});
       
       console.log("tableroutearray-----------",tableroutearray);
       console.log("routingicons-----------",this.routingicons);
       if(tableroutearray.length!=0){
        // this.opentableData(tableroutearray);
       }
      
    });
  }

async  getRoutebytime(){
  let datajson:any;
    await this.http.get<any[]>('/assets/angularjson.json').subscribe((data:any[]) => {
      $('#controlbutton').css('display', '');
      console.log("data-----------",data)
        datajson=data;
       this.routedatajson=datajson;

       this.routedatajson = datajson['markerPositions'];

       this.displayRoute=true;
       this.displayclusters=true;
      //  this.displayallroute1();

      // console.log('routedatajson----------',this.routedatajson);
      // console.log('to millisecond----',this.routedatajson[0].StartTime);

      // markerPositions.sort((a:any, b:any) => a[3] - b[3]);
      // console.log('markerPositions----------',markerPositions);
    });
  }
  async getallroute1() {
    console.log("this.routeDevices----", this.routeDevices);

    let DateTimeFrom = this.datePipe.transform(this.DateTimeFrom, 'yyyy-MM-dd');
    let DateTimeTo = this.datePipe.transform(this.DateTimeTo, 'yyyy-MM-dd');
    console.log("this.DateTimeTo----", DateTimeTo);
    console.log("this.DateTimeFrom----", DateTimeFrom);
    console.log("this.simulationid----", this.simulationid);

    let deviceArray = this.routeDevices.split(',');
    console.log("split----", deviceArray);
    
    let requestParams = {
        end_date: DateTimeTo,
        server: "10.1.2.205",
        device_id: deviceArray,
        start_date: DateTimeFrom,
        simulation_id: this.simulationid
    };
    console.log("obj----", requestParams);

    try {
        // Fetching routes from the datacrowd service
        let data = await this.datacrowdService.getRoutes(requestParams);
        this.handleRouteData(data, deviceArray);

        // Fetching additional data from the json file
        let jsonData = await this.http.get<any[]>('/cybercrowd/angular/assets/routejson.json').toPromise();
        this.handleRouteData(jsonData, deviceArray);
    } catch (error) {
        console.error('Error fetching route data:', error);
    }
}

private handleRouteData(data: any, deviceArray?: any[]) {
    $('#controlbutton').css('display', '');
    console.log("data-----------", data);

    this.routedatajson = data;
    this.displayRoute = true;
    this.displayclusters = true;

    if (Array.isArray(deviceArray)) {
        this.displayallroute1(deviceArray);
    } else {
        this.displayallroute1();
    }

    console.log('routedatajson----------', this.routedatajson);
    console.log('to millisecond----', new Date(this.routedatajson[0].StartTime).getTime());

    this.routedatajson.sort((a: any, b: any) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime());
    console.log('routedatajson1111----------', this.routedatajson);
}



// async getallroute1(){
//     console.log("this.routeDevices----",this.routeDevices);

//  let DateTimeFrom=this.datePipe.transform(this.DateTimeFrom, 'yyyy-MM-dd');
//  let DateTimeTo=this.datePipe.transform(this.DateTimeTo, 'yyyy-MM-dd');
//  console.log("this.DateTimeTo----", DateTimeTo);
//  console.log("this.DateTimeFrom----",DateTimeFrom);
//     console.log("this.simulationid----",this.simulationid);

//     console.log("split----",this.routeDevices.split(','));
//     let array:any=this.routeDevices.split(',');
//       // let array:any=this.Devices ;
//     let obj:any={"end_date":DateTimeTo,"server":"10.1.2.205","device_id":array,"start_date":DateTimeFrom, "simulation_id":this.simulationid};
//     console.log("obj----",obj);
//     this.datacrowdService.getRoutes(obj).then((data:any)=>{
//       $('#controlbutton').css('display', '');
//       console.log("data-----------",data)
//        this.routedatajson=data;
//        this.displayRoute=true;
//        this.displayclusters=true;
//        this.displayallroute1(array);

//       console.log('routedatajson----------',this.routedatajson);
//       console.log('to millisecond----',new Date(this.routedatajson[0].StartTime).getTime());

//       this.routedatajson.sort((a:any, b:any) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime());
//       console.log('routedatajson1111----------',this.routedatajson);
//     });

//     await this.http.get<any[]>(' /cybercrowd/angular/assets/routejson.json').subscribe(data => {
//       $('#controlbutton').css('display', '');
//       console.log("data-----------",data)
//        this.routedatajson=data;
//        this.displayRoute=true;
//        this.displayclusters=true;
//        this.displayallroute1();

//       console.log('routedatajson----------',this.routedatajson);
//       console.log('to millisecond----',new Date(this.routedatajson[0].StartTime).getTime());

//       this.routedatajson.sort((a:any, b:any) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime());
//       console.log('routedatajson1111----------',this.routedatajson);
//     });

 
//   }



//  displayallroute1(array:any){
  displayallroute1(deviceArray?: any[] ){
    this.routeDevices= ['26e170d1-9bbc-4b1f-b3e9-4a7fd265a033','4e320097-5103-40eb-978e-fc079e1abba3']
    // this.routeDevices=['26e170d1-9bbc-4b1f-b3e9-4a7fd265a033','4e79560f-e59a-4d7b-8b91-6dddbd571c57'];
    let array:any[]=this.routeDevices
    this.displayedColumns = ['Time', 'StreetName', 'Lng', 'lat'];
    let tableroutearray:any[]=[];
    let count=0;
    array.forEach((deviceId:any,deviceindex:any)=>{

      // let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
     let color:any[]=['red',this.SectorColor];
      tableroutearray=[];
      let array:any[]=[];
      let routearray:any[]=[];
   
     this.routedatajson.forEach((elt:any)=>{

      if(deviceId===array[0]){
     //by default fist deviceId

        if(elt.device_id===deviceId){
        tableroutearray.push(elt);
        }
      }
        if(elt.device_id===deviceId){
          array.push(elt);
          if(deviceindex>0){
            routearray.push([elt.NodeLatitude,(parseFloat(elt.NodeLongitude)+0.000001).toString()]);

          }else{

          routearray.push([elt.NodeLatitude,(parseFloat(elt.NodeLongitude)).toString()]);
        }
        }
       });
      
       console.log("array-----------",array);
       console.log("routearray-----------",routearray)
        
       let polyline:any = L.polyline(routearray, { color: color[count]}).addTo(this.map);
       let  polyline1 = L.polyline(routearray, { color: color[count] }).addTo(this.magnifiedMap);
       polyline.deviceId = deviceId;

    
       console.log("polyline-----------",polyline);

      this.routingpolyline.push(polyline);
       count++;
 
       this.map.fitBounds(polyline.getBounds());
       var greenIcon = new L.Icon({
         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
         iconSize: [25, 41],
         iconAnchor: [12, 41],
         popupAnchor: [1, -34],
         shadowSize: [41, 41]
       });
       
       let x=L.marker([routearray[0][0],routearray[0][1]], {icon: greenIcon}).addTo(this.map);
       let x1=L.marker([routearray[0][0],routearray[0][1]], {icon: greenIcon}).addTo(this.magnifiedMap);
       console.log("11111111-----------",x)
       //  L.marker([routearray[0][0],routearray[0][1]]).addTo(this.map);
       var red = new L.Icon({
         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
         iconSize: [25, 41],
         iconAnchor: [12, 41],
         popupAnchor: [1, -34],
         shadowSize: [41, 41]
       });
       let y= L.marker([routearray[routearray.length-1][0],routearray[routearray.length-1][1]],{icon: red}).addTo(this.map);
       let y1= L.marker([routearray[routearray.length-1][0],routearray[routearray.length-1][1]],{icon: red}).addTo(this.magnifiedMap);
  
       this.routingicons.push({'startPoint':x,'endPoint':y});
       
       console.log("tableroutearray-----------",tableroutearray);
       console.log("routingicons-----------",this.routingicons);
       if(tableroutearray.length!=0){
        this.typeofdata='trace';
        this.opentableData(tableroutearray,this.typeofdata);
       }
      
    });

    
  
  }

  async displaybyroute(){
    let routeDevices1:any[]=[];
    let routeDevices:any[]=[];
    let objcolor:any[]=[];
    this,this.openTable=true;
    this.isRunningRoute=true;
    $('#routebar1').css('display', '');
    $('#routebar').css('display', 'none');
  //   if (this.isRunningRoute==false) {
  //     return;
  // }
    // this.routeDevices='4e79560f-e59a-4d7b-8b91-6dddbd571c57,436cab63-5002-475d-8d11-c321e5850659';
    
    routeDevices = this.dataService.getroutedevices().split(',');
    this.routeDevicestable=routeDevices;
    console.log("this.routeDevices-----------", routeDevices)
    let colorarray:any[]=['green','red',this.SectorColor,'yellow','purpule'];
    //random color
    // let color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  
     routeDevices.forEach((deviceId:any,index:any)=>{
       
      routeDevices1.push({'deviceid':deviceId,'color':colorarray[index]});
      // routeDevices1.push({'deviceid':deviceId,'color':color});
    });
  
  // let routeDevices1= [{'deviceid':'4e79560f-e59a-4d7b-8b91-6dddbd571c57','color':'green'},{'deviceid':'436cab63-5002-475d-8d11-c321e5850659','color':"red"}]
  this.displayedColumns = ['deviceid','Time','Lng', 'lat'];
  
   
    let datajson:any;
    // await this.http.get<any[]>('/assets/angularjson.json').subscribe((data:any[]) => {
      // console.log("data-----------",data)
      // datajson=data;
      datajson=this.datajson;
      this.routedatajson=datajson;
  
      let markerPositions = datajson['markerPositions'];
      routeDevices1.forEach((a:any)=> { 
      let deviceArray=  markerPositions.filter((elt:any)=>{
          return  a.deviceid===elt[2]
            
          });
          objcolor.push({color:a.color,data:deviceArray,deviceId:a.deviceid,index:0});
        });
  
        this.displayPolylines(markerPositions,objcolor);
        // });
      }
  
  displayPolylines(markerPositions: any[],objcolor:any[]): void {
    
      if (this.isRunningRoute==false) {
      return;
  }
    const interval = setTimeout(async() => {
      if (this.currentIndex >= markerPositions.length) {
        clearInterval(interval); // Stop when all polylines are displayed
        return;
      }
  
      let currentDevice= markerPositions[this.currentIndex][2];
      console.log("currentDevice-----------",currentDevice);
  
    let x=  objcolor.find((elt:any)=>{
      return elt.deviceId==currentDevice});
      console.log("x-----------",x);
        // x.index=this.routecountobj;
      if(x.index+1>=x.data.length)
        {
      
          }
      else if(x.index<=x.data.length) {
        // this.polylines.push(polyline);
  
        // if(this.currentIndex>0){
     
        let polyline = L.polyline([[x.data[x.index][0],x.data[x.index][1]],[x.data[x.index+1][0],x.data[x.index+1][1]]],{color:x.color}).addTo(this.map);
        let polyline1 = L.polyline([[x.data[x.index][0],x.data[x.index][1]],[x.data[x.index+1][0],x.data[x.index+1][1]]],{color:x.color}).addTo(this.magnifiedMap);

        // Decorate the polyline
        // L.polylineDecorator(polyline, {
        //   patterns: [{
        //     offset: 25,
        //     repeat: 300,
        //     symbol: L.Symbol.arrowHead({
        //       pixelSize: 15,
        //       pathOptions: {
        //         fillOpacity: 1,
        //         weight: 0
        //       }
        //     })
        //   }]
        // }).addTo(this.map);
       
        this.polylineRouteArray.push(polyline);
        this.polylineRouteArrayLoop.push(polyline1);
        this.xroutearray.push(markerPositions[this.currentIndex]);
        this.typeofdata='devicehistory'
        this.opentableData(this.xroutearray,this.typeofdata);
  }
               
    // }
    
  
      this.currentIndex++;
      x.index++;
      await this.displayPolylines(markerPositions,objcolor);
    },  3000/this.speedTimeRoute); // Adjust the interval duration as needed
  } 

  changebarRoute(){
    this.stopRoute();
    this.startRoute();
    console.log("speedTimeRoute----------",this.speedTimeRoute)
  }


  
  getsenarioId(obj:any){
    console.log("obj><><><<>",obj);
    // this.Senario_reportType=obj.reportType;

    if(obj.action=="displaysenario"){
    this.dataService.setsenarioID(obj.simulID);
    // console.log('displaysenario>>>>>>>>>>>>',$("#displaysenario"));
    // $("#displaysenario").click();
    this.displaysenarioSequence();
    }else if(obj.action=="addnewSenario"){
      let parentSenario=localStorage.setItem("parentSenario",obj.simulID);
    this.senarioParentName=obj.simulID;
    this.addnewSenario()
      // this.mapChanges=obj;
        
      // let obj22:any={
      //   senarioParentName:this.senarioParentName,
      //   simulationid:this.simulationid,
      //   Action:"addnewMenu",
      //   senariocount:this.senariocount,
      //   senarioFlag:this.senarioFlag
      
      // }
        
      // // this.senarioIdOutput.emit(obj22);
      // this.navbarSimulId=obj22;
    }else if(obj.action=="addProperties"){
this.modalService.open(this.SimulInfo);

$(".modal-content").css("width", "650px");
$(".modal-content").css("right", "200px");
$(".modal-content").css("padding", "10px");
$(".modal-content").css("top", "85px");
$(".modal-content").draggable({
  axis: "both",
  cursor: "move"
});

    }else  if(obj.action=="reset"){
      this.clearShapes();

    }
    
    
      }
   
 
    
      updateMagnifyingGlass(event: any) {
        const magnifyingGlass: any = document.getElementById('magnifying-glass1');
        const mapContainer: any = document.querySelector('.map');
      
        const mapWidth = mapContainer.offsetWidth;
        const mapHeight = mapContainer.offsetHeight;
      
        const originalEvent = event.originalEvent;
        const mouseX = originalEvent.clientX - mapContainer.getBoundingClientRect().left;
        const mouseY = originalEvent.clientY - mapContainer.getBoundingClientRect().top;
         const mainMapMousePoint = this.map.containerPointToLatLng(L.point(mouseX, mouseY));
      
        magnifyingGlass.style.left = mouseX - magnifyingGlass.offsetWidth / 2 + 'px';
        magnifyingGlass.style.top = mouseY - magnifyingGlass.offsetHeight / 2 + 'px';
      
        this.magnifiedMap.setView(mainMapMousePoint);
      
        const bgPosX = (-mouseX * 2) + magnifyingGlass.offsetWidth / 2 + 'px';
        const bgPosY = (-mouseY * 2) + magnifyingGlass.offsetHeight / 2 + 'px';
        magnifyingGlass.style.backgroundPosition = bgPosX + ' ' + bgPosY;
      }
      
          looplens(event:any){



        event.stopPropagation(); // Stop the event from propagating to the map
        event.preventDefault(); // Prevent the default button click behavior
        let mapContainer = document.getElementById('map');
         // let mapContainer = document.getElementById('map');
        this.isDimmed = true;
        const magnifyingGlass = document.getElementById('magnifying-glass1');

        // const elements = this.el.nativeElement.querySelectorAll('.leaflet-bar');
        $('.leaflet-bar').css('opacity','0.5');
        $('.leaflet-bar').css('pointer-events','none');
        $('#graphtools').css('opacity','0.5');
        $('#graphtools').css('pointer-events','none');
        $('.moretools').css('opacity','0.5');
        $('.moretools').css('pointer-events','none');
  

        this.openMagnifier=!this.openMagnifier;

        if(this.openMagnifier==true){
         $('.magnifying-glass1').css('display','none');
        // $('.magnifying-glass1').css('display','');
        mapContainer.classList.toggle('custom-cursor');
        // // Disable map interactions
        this.map.dragging.disable();
        this.map.scrollWheelZoom.disable();
        this.updateMagnifyingGlassSize()
          
        }else{
          mapContainer.classList.toggle('custom-cursor');
        //   $('.magnifying-glass1').css('display','none')
        //   // Enable map interactions
          this.map.dragging.enable();
          this.map.scrollWheelZoom.enable();
        }
      }
          
          
              logScreenSize() {
              const viewportWidth = window.innerWidth;
              const viewportHeight = window.innerHeight;
              const screenWidth = window.screen.width;
              const screenHeight = window.screen.height;
        
              console.log('Viewport Size:', viewportWidth + 'x' + viewportHeight);
              console.log('Screen Size:', screenWidth + 'x' + screenHeight);
            }
      
            onMouseOver( ) {
          
      
              if(this.openMagnifier==true){
          
                // const mapContainer = document.getElementById('map');
                this.isDimmed = false;
                // $('.leaflet-bar').css('opacity', '1');
                // $('.leaflet-bar').css('pointer-events', '');
    
                $('.magnifying-glass1').css('display', 'none');
                // this.openMagnifier = false;
                // this.map.dragging.enable();
                // this.map.scrollWheelZoom.enable();
                // mapContainer.classList.remove('custom-cursor');
            
              }
            }
      
      
      
      
      
      
              @HostListener('document:keydown', ['$event'])
              handlekeybordEvent(event: KeyboardEvent) {
                  const magnifyingGlass = document.getElementById('magnifying-glass1');
              
                  if (event.ctrlKey && event.key === 'ArrowUp') {
                      if(this.openMagnifier) {
                          const currentWidth = parseFloat(window.getComputedStyle(magnifyingGlass).width);
                          const currentHeight = parseFloat(window.getComputedStyle(magnifyingGlass).height);
                        console.log("currentWidth----",currentWidth,"---currentHeight---",currentHeight)
                          magnifyingGlass.style.width = `${currentWidth + 50}px`;
                          magnifyingGlass.style.height = `${currentHeight + 50}px`;
                          this.updateMagnifyingGlassSize();
                      }
                  } else if (event.ctrlKey && event.key === 'ArrowDown') {
                      if(this.openMagnifier) {
                          const currentWidth = parseFloat(window.getComputedStyle(magnifyingGlass).width);
                          const currentHeight = parseFloat(window.getComputedStyle(magnifyingGlass).height);
              
                          magnifyingGlass.style.width = `${currentWidth - 50}px`;
                          magnifyingGlass.style.height = `${currentHeight - 50}px`;
                          this.updateMagnifyingGlassSize();
                      }
                  } else if (event.ctrlKey && event.key === 'Delete') {
                      if(this.openMagnifier) {
      
                          const mapContainer = document.getElementById('map');
                          this.isDimmed = false;
                          $('.leaflet-bar').css('opacity', '1');
                          $('.leaflet-bar').css('pointer-events', '');
                          $('#graphtools').css('opacity','1');
                          $('#graphtools').css('pointer-events','');
                          $('.moretools').css('opacity','1');
                          $('.moretools').css('pointer-events','');

                          $('.magnifying-glass1').css('display', 'none');
                          this.openMagnifier = false;
                          this.map.dragging.enable();
                          this.map.scrollWheelZoom.enable();
                          mapContainer.classList.remove('custom-cursor');
                      }
                  }
              }
              
              updateMagnifyingGlassSize() {
                  const magnifyingGlass = document.getElementById('magnifying-glass1');
                  const currentWidth = parseFloat(window.getComputedStyle(magnifyingGlass).width);
                  const currentHeight = parseFloat(window.getComputedStyle(magnifyingGlass).height);
              
                  this.magnifiedMap.invalidateSize();
                  const center = this.magnifiedMap.getCenter();
                  this.magnifiedMap.setView(center);
                  magnifyingGlass.style.backgroundSize = `${currentWidth * 4}px ${currentHeight * 4}px`;
              }
      
              
              @HostListener('document:wheel', ['$event'])
              handleMouseWheelEvent(event: WheelEvent) {
                // if (event.ctrlKey) {
                   
                  if (event.deltaY > 0) {
                    // Scrolling down
                    if(this.openMagnifier==true){
                    this.zoommagnifymap=this.zoommagnifymap-1;
           
                     this.magnifiedMap.setView( this.cursorlnglat,this.zoommagnifymap);
                    }
                  } else if (event.deltaY < 0) {
                    // Scrolling up
                    if(this.openMagnifier==true){
                      this.zoommagnifymap=this.zoommagnifymap+1;
                   
       
                      this.magnifiedMap.setView( this.cursorlnglat,this.zoommagnifymap);
                      }
                  // }
                }
          
          
              }
       
    
    
    async hi(){
      this.usercode="8158";
      this.displayClusters2("184545");
    }

    showTimeline(){
      this.timelineFlag=1;
     (window.parent as any).hideSimulation();
        this.displayTarget = true;
      $('#Map').css('display','none');
      $('#Graph').css('display','none');
      $('#Timeline').css('display','');
    }
   
   
   
    showMap(type:boolean){
      this.displayTarget = false;
      if(type=== false){
     
        $('#Map').css('display','none');
        $('#Graph').css('display','');
        $('#Timeline').css('display','none');
  
  //this.router.navigate(['/graph']);
  (window.parent.parent.parent[7] as any).showmapGraph('graph');
  
  
      }else if(type===true) {
        $('#Map').css('display','');
        $('#Graph').css('display','none');
        $('#Timeline').css('display','none');
     
  
  //this.router.navigate(['/map2']);
  console.log("window>>",window as any);
  console.log("window,parent>>",window.parent as any);
  console.log("window.parent.parent>>",window.parent.parent as any);
  console.log("window.parent.parent.parent>>",window.parent.parent.parent as any);
  
  // console.log('222222222222222222222---------',window.parent.parent.parent.parent.$(".popupExists").parent().hide());
  (window.parent.parent.parent[7] as any).showmapGraph('map');
  
  
      }
  
    }

   






  async test33(){
console.log("thiscoord",this.Coord);
console.log("deviceValue",this.deviceValue) 
console.log("selectedType",this.selectedType) 


  if(this.reportType!=1 && this.reportType!=10 && this.reportType!=3 && this.reportType!=8 && this.reportType!=9 && this.reportType!=11){
    await this.datacrowdService.getALLcountryIDS().then(async (res:any)=>{
      //console.log('getALLcountryIDS>>>>',res);

      this.countrycode=res;

       await this.datacrowdService.getcountry2(this.countrycode).then((res:any)=>{
          //console.log('getcountry2>>>>',res);
          this.countrycode=res;
          this.countrycode=this.convertCountryCode(this.countrycode);
          //console.log("countrycode finall",this.countrycode)
        })

    })
  }
 

  let queryjson:any;
  this.reportType=this.selectedType;
  await console.log('reportType >>', this.reportType);

if(this.reportType=="1"){

  queryjson={
    "reportName": "No Name",
    "reportType": this.selectedType.toString(),
    "reportTypeId": this.selectedType.toString(),
    "TimeZone": "",
    "RecipientUser": "",
    "DateTimeFrom": "06/06/2023 00:00",
    "RecipientEmail": "",
    "DateTimeTo": "06/06/2024 01:00",
    "Coordinates":this.Coord,
    "meter": "",
    "Devices": this.deviceValue,
    "isCSVAttached": "",
    "dataType": "",
    "telephoneNumber": "",
    "EDGEHEIGHT": "10",
    "simulationId": "186494",
    "userCode": "8158 ",
    "imsiId": this.IMSI_IDValue,
    "countryCode": "",
    "senario": "-1",
    "BtsTypeSlected": ""
  };
}else if(this.reportType=="2"){
  let device = localStorage.getItem('deviceselected');

   queryjson={
    "reportName": "No Name",
    "reportType": "2",
    "reportTypeId": "2",
    "TimeZone": "",
    "RecipientUser": "",
    "DateTimeFrom": "06/06/2023 00:00",
    "RecipientEmail": "",
    "DateTimeTo": "06/06/2024 01:00",
    "Coordinates":[],
    "meter": "",
    "Devices": device,
    "isCSVAttached": "",
    "dataType": "",
    "telephoneNumber": "",
    "EDGEHEIGHT": "10",
    "simulationId": "186494",
    "userCode": "8158 ",
    "imsiId": this.IMSI_IDValue,
    "countryCode": this.countrycode,
    "senario": "-1",
    "BtsTypeSlected": ""
  };

}else if(this.reportType=="10"){
  alert("111");
  //let device = localStorage.getItem('deviceselected');
  queryjson={
    "reportName": "No Name",
    "reportType": this.selectedType.toString(),
    "reportTypeId": this.selectedType.toString(),
    "TimeZone": "",
    "RecipientUser": "",
    "DateTimeFrom": "06/06/2023 00:00",
    "RecipientEmail": "",
    "DateTimeTo": "06/06/2024 01:00",
    "Coordinates":this.Coord,
    "meter": "",
    "Devices":"",
    "isCSVAttached": "",
    "dataType": "",
    "telephoneNumber": "",
    "EDGEHEIGHT": "10",
    "simulationId": "186494",
    "userCode": "8158 ",
    "imsiId": "",
    "countryCode": "",
    "senario": "-1",
    "BtsTypeSlected": ""
  };
}

    console.log('queryjson >>', queryjson);
    for (const elt of queryjson.Coordinates) {
      if(elt.Type==='Circle'){
        let turfshape:any = turf.circle([elt.center.lng, elt.center.lat], elt.radius / 1000, { units: 'kilometers' });

        const intersectingRegions:any = [];
   
        //console.log("geoJsonData ",this.geojsonData);
        // Iterate through each feature in the GeoJSON data
        
        this.geojsonData.features.forEach((feature: any) => {
 
          // Check if the circle intersects with the feature
         const doesIntersect = turf.booleanOverlap(turf.simplify(feature),turf.simplify(turfshape));
          //console.log('doesIntersect' ,doesIntersect)
      
          // //console.log('doesIntersect2', doesIntersect2);
          
      
          if (doesIntersect) {
            intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
           }else{
           const doesIntersect2 = turf.booleanPointInPolygon(
             turf.point([elt.center.lng, elt.center.lat]), // Create a Turf.js Point from circle center
             feature // Assuming the GeoJSON feature is a Polygon
           );
            if (doesIntersect2) {
              intersectingRegions.push(feature.properties.iso_a2_eh); // Adjust this based on your GeoJSON structure
            }
          }
 
 
 
         
        });
    
        console.log('zz circle>>>>',intersectingRegions);


        ///
        let  C_countryCodes:any
      
 
 
    await this.datacrowdService.getcountry(intersectingRegions).then((ress:any)=>{
     console.log('getcountry>>>>',ress);
     // C_subregion=ress[0];
     // C_region=ress[1];
     // C_Country=ress[2];
     C_countryCodes=ress;
   
   }) 
 

   elt.countrycodes=this.convertCountryCode(C_countryCodes);
      }
    };
    


    console.log("queryjson IIII  ",queryjson)

    this.datajson = await this.getSimulationData(queryjson);
    console.log('datajson>', this.datajson);
//return this.datajson;
    if (this.datajson !== null) {
      //console.log("this.datajson.markerPositions<<<>>>>>", this.datajson.markerPositions.length);
      this.marker = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        animate: true,
        singleMarkerMode: true,
      });
      this.markerLoop = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        animate: true,
        singleMarkerMode: true,
      });
      let lastMarkerLat:any;
      let lastMarkerLng:any;

      for (var j = 0; j < 1; j++) {
        for (var i = 0; i < this.datajson; i++) {
          this.markers = L.marker([
            Number(this.datajson[i].location_latitude),
            Number(this.datajson[i].location_longitude)
         
          ]);
          this.markers.off("click");
          this.markers.on("mousedown", (e: any) => {
            if (e.originalEvent.buttons == 2) {
              e.target.openPopup();

            }
            if (e.originalEvent.buttons == 1) {
              //  alert(1);
            }
          });
          this.markersArray.push(this.markers)
          
  lastMarkerLat = this.datajson[i][4];
  lastMarkerLng = this.datajson[i][3];
        }
      }
 

      //       markersBatch.push(marker);
      //     }

      //     // Apply event listeners to the batch of markers
      //     markersBatch.forEach(marker => {
      //       marker.off("click");
      //       marker.on("mousedown", (e: any) => {
      //         if (e.originalEvent.buttons == 2) {
      //           e.target.openPopup();
      //         }
      //         if (e.originalEvent.buttons == 1) {
      //           // alert(1);
      //         }
      //       });

      //       this.markersArray.push(marker);
      //     });

      //     // Clear markersBatch to free up memory
      //     markersBatch.length = 0;
      //   }
      // }
      // // End the timer and log the elapsed time
      // //console.timeEnd('loopTime');

      //     //  this.marker.openPopup(
      //     //  html11
      //     //  );



      this.rowData = [];
      this.datajson.forEach((element: any, key: any) => {
        this.myMarker = this.binddata(
          element[4],
          element[3],
          element[1],
          element[0],
          element[2],
          element[5],
          ""
        );

        this.myMarker.lat = element[4];
        this.myMarker.lng = element[3]
        this.myMarker.timestamp = element[1]
        this.myMarker.tel = element[0];
        this.myMarker.name = element[2];
        this.marker.addLayer(this.myMarker);
        this.markerLoop.addLayer(this.myMarker);
        this.myMarker.off("click");
        this.myMarker.on("mousedown", async (e: any) => {
          if (e.originalEvent.buttons == 2) {
            //console.log("markerChildrensssssss", e.target)
            this.rowData = [];
            var jsonaggrid = {
              Device_id: e.target.tel,
              Tel: e.target.name,
              Date: e.target.timestamp,
              Hits: "1",
              Coord: e.target.lat + ',' + e.target.lng,
              //Lat:e.target.lat
            };
            this.rowData.push(jsonaggrid);


            const componentfactory =
              this.componentFactoryResolver.resolveComponentFactory(
                VAgGridComponent
              );
            const componentref =
              this.viewContainerRef.createComponent(componentfactory);
            componentref.instance.rowData = this.rowData;
            componentref.instance.columnDefs = this.columnDefs;
            componentref.instance.headerHeight = 0;
            // componentref.instance.selectdevices = true;
            componentref.instance.Title = "Here On";
            componentref.instance.distinct = true;
            componentref.changeDetectorRef.detectChanges();
            componentref.instance.Grid2Type = 'btn-54';
            componentref.instance.GridID = 'GeoGrid1';

            const html2 = componentref.location.nativeElement;
            await html2;

            // $('#agGrid').css('height','10px');
            $('.ag-theme-balham').css('height', '130px');


            // /  e.target.openPopup(html2, e.target._latlng);
            this.map.openPopup(html2, e.target._latlng);


          } else if (e.originalEvent.buttons == 1) {

          }

        });
      });

      const componentfactory =
        this.componentFactoryResolver.resolveComponentFactory(VAgGridComponent);
      const componentref =
        this.viewContainerRef.createComponent(componentfactory);
      const html1 = (componentref.location.nativeElement.style.display = "none");
      componentref.instance.columnDefs = this.columnDefs;
      componentref.changeDetectorRef.detectChanges();
      this.marker.off("click");
      this.marker.on("clustermousedown", async (e: any) => {
        if (e.originalEvent.buttons == 2) {
          var markerChildrens = e.layer.getAllChildMarkers();





          this.rowData = [];

          for (var j = 0; j < markerChildrens.length; j++) {
            var jsonaggrid = {
              Device_id: markerChildrens[j].tel,
              Tel: markerChildrens[j].name,
              Date: markerChildrens[j].timestamp,
              Hits: "1",
              Coord: markerChildrens[j].lat + ',' + markerChildrens[j].lng,
              // Lat:markerChildrens[j].lat
            };
            this.rowData.push(jsonaggrid);
          }

          //console.log("markerChildrens>>>>>", markerChildrens);

          const componentfactory =
            this.componentFactoryResolver.resolveComponentFactory(
              VAgGridComponent
            );
          const componentref =
            this.viewContainerRef.createComponent(componentfactory);
          componentref.instance.rowData = this.rowData;
          componentref.instance.columnDefs = this.columnDefs;
          componentref.instance.headerHeight = 0;
          // componentref.instance.selectdevices = true;
          componentref.instance.Title = "Here On";
          componentref.instance.distinct = true;
          componentref.changeDetectorRef.detectChanges();
          componentref.instance.pagination = false;
          componentref.instance.rowGrouping = true;
          componentref.instance.contextmenu = false;
          componentref.instance.Grid2Type = 'btn-54';
          componentref.instance.GridID = 'GeoGrid1';
          const html1 = componentref.location.nativeElement;
          await html1;
          //console.log("markerChildrens.length>>>>>>", markerChildrens.length)
          if (markerChildrens.length < 3) {
            // $('#agGrid').css('height','10px');
            $('.ag-theme-balham').css('height', '130px');

          } else {
            $('.ag-theme-balham').css('height', ' 250px ');

          }


          this.map.openPopup(html1, e.layer.getLatLng());

          // $(".modal-content").css("width","650px");
          // $(".modal-content").css("right","200px");
          // $(".modal-content").css("padding","10px");
          // $(".modal-content").css("top","85px");
          // $(".modal-content").draggable({
          //   axis: "both",
          //   cursor: "move"
          // });
          //  this.modalRef =this.modalService.open(this.popupContent1);

        }
        if (e.originalEvent.buttons == 1) {
          // alert(4);

        }

        //open popup;
      });

      this.map.addLayer(this.marker);
      // this.map.setView([lastMarkerLat, lastMarkerLng],12);
      
      this.magnifiedMap.addLayer(this.markerLoop);
      this.layerGroup.addLayer(this.marker);
   
}


//this.isFormVisible = false;

 } 
bars(){
}
  
    changeType(type: number) {
      this.selectedType = type;
      console.log('Selected Type:', this.selectedType); // Debugging log
    }
    
}




