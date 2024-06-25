import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { LinkCellRenderer } from './components/v-grid-link';
import { CheckboxCellRenderer } from './components/v-grid-checkbox';
import 'ag-grid-enterprise';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
@Component({
  selector: 'v-grid',
  templateUrl: './v-grid.components.html',
  styleUrls: ['./v-grid.components.css'],
})

export class AGGridComponent implements OnInit, OnChanges {
  public gridApi: GridApi = new GridApi();
  public gridColumnApi: any;
  public ColDef: any;
  public statusBar: any;
  public rowModelType: any;
  public rowData: [] = [];
  public paginationFlag: boolean = false;
  public paginationSize: any;
  public selectedNodes: string = '';
  public gridModifiedRows: any[] = [];
  public gridAddedRows: any[] = [];
  public gridDeletedRows: any[] = [];
  public agGridUpdates: any[] = [];
  public userId : any;
  public isManaged : any;
  public accessRights : any;


  // Ag-grid Parameters
  @Input() public dataApi: any;
  @Input() public agColumns: any;
  @Input() public allowSideBar: any;
  @Input() public sizeColumnsToFit: any;
  @Input() public pagination: boolean = false;
  @Input() public paginationPageSize: any;
  @Input() public agStyle: any;
  @Input() public agToolBar: any = '';
  @Input() public agPrimaryKey: any = '';
  @Input() public agType: any = 'clientSide'; // Used to specify how the data is fetched if from Client Side or Server Side
  @Input() public agOnGridEvents: boolean = false; // Used to add capability to do crud operations on grid level
  @Input() public isAdd:boolean = false;//used to disable the add button
  @Input() public isUpdate:boolean = false;//used to disable the modify button
  @Input() public isDelete:boolean = false;//used to disable the delete button
  @Input() public menuVariable : any;

  constructor(private http: HttpClient, private eventEmitterService: EventEmitterService,private commonFunction : CommonFunctions) {}

  ngOnInit(): void {

    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));
    // Clear AG-Grid row selection local storage before selecting any row
    localStorage.setItem("agGidSelectedNode","");

    // Handling Grid Row Rendering
    let agGridRenderedColumns = [];
    for(let kk = 0; kk < this.agColumns[0].length; kk ++) {
      let definition: ColDef = {
        headerName: this.agColumns[0][kk].headerName,
        field: this.agColumns[0][kk].field,
        editable: this.agColumns[0][kk].editable,
        cellRenderer: this.agColumns[0][kk].cellRenderer,
        hide: this.agColumns[0][kk].hide,
        colId: this.agColumns[0][kk].colId,
        type: this.agColumns[0][kk].type,
        valueGetter: this.agColumns[0][kk].valueGetter,
        valueFormatter: this.agColumns[0][kk].valueFormatter,
        refData: this.agColumns[0][kk].refData,
        keyCreator: this.agColumns[0][kk].keyCreator,
        equals: this.agColumns[0][kk].equals,
        checkboxSelection: this.agColumns[0][kk].checkboxSelection,
        toolPanelClass: this.agColumns[0][kk].hidtoolPanelClasse,
        suppressColumnsToolPanel: this.agColumns[0][kk].suppressColumnsToolPanel,
        columnGroupShow: this.agColumns[0][kk].columnGroupShow,
        icons: this.agColumns[0][kk].icons,
        suppressNavigable: this.agColumns[0][kk].suppressNavigable,
        suppressKeyboardEvent: this.agColumns[0][kk].suppressKeyboardEvent,
        suppressPaste: this.agColumns[0][kk].suppressPaste,
        suppressFillHandle: this.agColumns[0][kk].suppressFillHandle,
        initialHide: this.agColumns[0][kk].initialHide,
        lockVisible: this.agColumns[0][kk].lockVisible,
        lockPosition: this.agColumns[0][kk].lockPosition,
        suppressMovable: this.agColumns[0][kk].suppressMovable,
        valueSetter: this.agColumns[0][kk].valueSetter,
        valueParser: this.agColumns[0][kk].valueParser,
        cellEditor: this.agColumns[0][kk].cellEditor,
        cellEditorParams: this.agColumns[0][kk].cellEditorParams,
        cellEditorSelector: this.agColumns[0][kk].cellEditorSelector,
        cellEditorPopup: this.agColumns[0][kk].cellEditorPopup,
        cellEditorPopupPosition: this.agColumns[0][kk].cellEditorPopupPosition,
        singleClickEdit: this.agColumns[0][kk].singleClickEdit,
        onCellValueChanged: this.agColumns[0][kk].onCellValueChanged,
        onCellClicked: this.agColumns[0][kk].onCellClicked,
        onCellDoubleClicked: this.agColumns[0][kk].onCellDoubleClicked,
        onCellContextMenu: this.agColumns[0][kk].onCellContextMenu,
        filter: this.agColumns[0][kk].filter,
        filterParams: this.agColumns[0][kk].filterParams,
        filterValueGetter: this.agColumns[0][kk].filterValueGetter,
        getQuickFilterText: this.agColumns[0][kk].getQuickFilterText,
        floatingFilter: this.agColumns[0][kk].floatingFilter,
        floatingFilterComponent: this.agColumns[0][kk].floatingFilterComponent,
        floatingFilterComponentParams: this.agColumns[0][kk].floatingFilterComponentParams,
        suppressFiltersToolPanel: this.agColumns[0][kk].suppressFiltersToolPanel,
        headerValueGetter: this.agColumns[0][kk].headerValueGetter,
        headerTooltip: this.agColumns[0][kk].headerTooltip,
        headerClass: this.agColumns[0][kk].headerClass,
        headerComponent: this.agColumns[0][kk].headerComponent,
        headerComponentParams: this.agColumns[0][kk].headerComponentParams,
        menuTabs: this.agColumns[0][kk].menuTabs,
        columnsMenuParams: this.agColumns[0][kk].columnsMenuParams,
        suppressMenu: this.agColumns[0][kk].suppressMenu,
        suppressHeaderKeyboardEvent: this.agColumns[0][kk].suppressHeaderKeyboardEvent,
        headerCheckboxSelection: this.agColumns[0][kk].headerCheckboxSelection,
        headerCheckboxSelectionFilteredOnly: this.agColumns[0][kk].headerCheckboxSelectionFilteredOnly,
        chartDataType: this.agColumns[0][kk].chartDataType,
        pinned: this.agColumns[0][kk].pinned,
        initialPinned: this.agColumns[0][kk].initialPinned,
        lockPinned: this.agColumns[0][kk].lockPinned,
        pivot: this.agColumns[0][kk].pivot,
        initialPivot: this.agColumns[0][kk].initialPivot,
        pivotIndex: this.agColumns[0][kk].pivotIndex,
        initialPivotIndex: this.agColumns[0][kk].initialPivotIndex,
        pivotComparator: this.agColumns[0][kk].pivotComparator,
        enablePivot: this.agColumns[0][kk].enablePivot,
        cellStyle: this.agColumns[0][kk].cellStyle,
        cellClass: this.agColumns[0][kk].cellClass,
        cellClassRules: this.agColumns[0][kk].cellClassRules,
        cellRendererParams: this.agColumns[0][kk].cellRendererParams,
        cellRendererSelector: this.agColumns[0][kk].cellRendererSelector,
        autoHeight: this.agColumns[0][kk].autoHeight,
        wrapText: this.agColumns[0][kk].wrapText,
        enableCellChangeFlash: this.agColumns[0][kk].enableCellChangeFlash,
        suppressCellFlash: this.agColumns[0][kk].suppressCellFlash,
        rowDrag: this.agColumns[0][kk].rowDrag,
        rowDragText: this.agColumns[0][kk].rowDragText,
        dndSource: this.agColumns[0][kk].dndSource,
        dndSourceOnRowDrag: this.agColumns[0][kk].dndSourceOnRowDrag,
        rowGroup: this.agColumns[0][kk].rowGroup,
        initialRowGroup: this.agColumns[0][kk].initialRowGroup,
        rowGroupIndex: this.agColumns[0][kk].rowGroupIndex,
        initialRowGroupIndex: this.agColumns[0][kk].initialRowGroupIndex,
        enableRowGroup: this.agColumns[0][kk].enableRowGroup,
        showRowGroup: this.agColumns[0][kk].showRowGroup,
        enableValue: this.agColumns[0][kk].enableValue,
        aggFunc: this.agColumns[0][kk].aggFunc,
        initialAggFunc: this.agColumns[0][kk].initialAggFunc,
        allowedAggFuncs: this.agColumns[0][kk].allowedAggFuncs,
        sortable: this.agColumns[0][kk].sortable,
        sort: this.agColumns[0][kk].sort,
        initialSort: this.agColumns[0][kk].initialSort,
        sortIndex: this.agColumns[0][kk].sortIndex,
        initialSortIndex: this.agColumns[0][kk].initialSortIndex,
        sortingOrder: this.agColumns[0][kk].sortingOrder,
        comparator: this.agColumns[0][kk].comparator,
        unSortIcon: this.agColumns[0][kk].unSortIcon,
        colSpan: this.agColumns[0][kk].colSpan,
        rowSpan: this.agColumns[0][kk].rowSpan,
        tooltipField: this.agColumns[0][kk].tooltipField,
        tooltipValueGetter: this.agColumns[0][kk].tooltipValueGetter,
        tooltipComponent: this.agColumns[0][kk].hitooltipComponentde,
        tooltipComponentParams: this.agColumns[0][kk].tooltipComponentParams,
        width: this.agColumns[0][kk].width,
        initialWidth: this.agColumns[0][kk].initialWidth,
        minWidth: this.agColumns[0][kk].minWidth,
        maxWidth: this.agColumns[0][kk].maxWidth,
        flex: this.agColumns[0][kk].flex,
        initialFlex: this.agColumns[0][kk].initialFlex,
        resizable: this.agColumns[0][kk].resizable,
        suppressSizeToFit: this.agColumns[0][kk].suppressSizeToFit,
        suppressAutoSize: this.agColumns[0][kk].suppressAutoSize
      };

      if(this.agColumns[0][kk].isLink) {
        definition.cellRendererFramework = LinkCellRenderer;
        definition.cellRendererParams = {
          link: this.agColumns[0][kk].link,
          linkParameters: this.agColumns[0][kk].linkParameters,
          accessRightParam: this.accessRights.display
        }
      }

      if(this.agColumns[0][kk].isCheckBox) {
        definition.cellRendererFramework = CheckboxCellRenderer;
        definition.cellRendererParams = {
          isCheckBoxDisabled: this.agColumns[0][kk].isCheckBoxDisabled
        }
      }

      // this.ColDef.push(definition);
      agGridRenderedColumns.push(definition);
    }

    this.ColDef = agGridRenderedColumns;

    this.rowModelType = this.agType; // Specify how the data is fetched if from Client Side or Server Side
    this.paginationFlag = this.pagination; // enables pagination in the grid
    this.paginationSize = this.paginationPageSize; // sets 10 rows per page (default is 100)
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.accessRights = JSON.parse(localStorage.getItem("accessRights"));

    // Clear AG-Grid row selection local storage before selecting any row
    localStorage.setItem("agGidSelectedNode","");

    // Handling Grid Row Rendering
    let agGridRenderedColumns = [];
    for(let kk = 0; kk < this.agColumns[0].length; kk ++) {
      let definition: ColDef = {
        headerName: this.agColumns[0][kk].headerName,
        field: this.agColumns[0][kk].field,
        editable: this.agColumns[0][kk].field,
        cellRenderer: this.agColumns[0][kk].cellRenderer,
        hide: this.agColumns[0][kk].hide,
        colId: this.agColumns[0][kk].colId,
        type: this.agColumns[0][kk].type,
        valueGetter: this.agColumns[0][kk].valueGetter,
        valueFormatter: this.agColumns[0][kk].valueFormatter,
        refData: this.agColumns[0][kk].refData,
        keyCreator: this.agColumns[0][kk].keyCreator,
        equals: this.agColumns[0][kk].equals,
        checkboxSelection: this.agColumns[0][kk].checkboxSelection,
        toolPanelClass: this.agColumns[0][kk].hidtoolPanelClasse,
        suppressColumnsToolPanel: this.agColumns[0][kk].suppressColumnsToolPanel,
        columnGroupShow: this.agColumns[0][kk].columnGroupShow,
        icons: this.agColumns[0][kk].icons,
        suppressNavigable: this.agColumns[0][kk].suppressNavigable,
        suppressKeyboardEvent: this.agColumns[0][kk].suppressKeyboardEvent,
        suppressPaste: this.agColumns[0][kk].suppressPaste,
        suppressFillHandle: this.agColumns[0][kk].suppressFillHandle,
        initialHide: this.agColumns[0][kk].initialHide,
        lockVisible: this.agColumns[0][kk].lockVisible,
        lockPosition: this.agColumns[0][kk].lockPosition,
        suppressMovable: this.agColumns[0][kk].suppressMovable,
        valueSetter: this.agColumns[0][kk].valueSetter,
        valueParser: this.agColumns[0][kk].valueParser,
        cellEditor: this.agColumns[0][kk].cellEditor,
        cellEditorParams: this.agColumns[0][kk].cellEditorParams,
        cellEditorSelector: this.agColumns[0][kk].cellEditorSelector,
        cellEditorPopup: this.agColumns[0][kk].cellEditorPopup,
        cellEditorPopupPosition: this.agColumns[0][kk].cellEditorPopupPosition,
        singleClickEdit: this.agColumns[0][kk].singleClickEdit,
        onCellValueChanged: this.agColumns[0][kk].onCellValueChanged,
        onCellClicked: this.agColumns[0][kk].onCellClicked,
        onCellDoubleClicked: this.agColumns[0][kk].onCellDoubleClicked,
        onCellContextMenu: this.agColumns[0][kk].onCellContextMenu,
        filter: this.agColumns[0][kk].filter,
        filterParams: this.agColumns[0][kk].filterParams,
        filterValueGetter: this.agColumns[0][kk].filterValueGetter,
        getQuickFilterText: this.agColumns[0][kk].getQuickFilterText,
        floatingFilter: this.agColumns[0][kk].floatingFilter,
        floatingFilterComponent: this.agColumns[0][kk].floatingFilterComponent,
        floatingFilterComponentParams: this.agColumns[0][kk].floatingFilterComponentParams,
        suppressFiltersToolPanel: this.agColumns[0][kk].suppressFiltersToolPanel,
        headerValueGetter: this.agColumns[0][kk].headerValueGetter,
        headerTooltip: this.agColumns[0][kk].headerTooltip,
        headerClass: this.agColumns[0][kk].headerClass,
        headerComponent: this.agColumns[0][kk].headerComponent,
        headerComponentParams: this.agColumns[0][kk].headerComponentParams,
        menuTabs: this.agColumns[0][kk].menuTabs,
        columnsMenuParams: this.agColumns[0][kk].columnsMenuParams,
        suppressMenu: this.agColumns[0][kk].suppressMenu,
        suppressHeaderKeyboardEvent: this.agColumns[0][kk].suppressHeaderKeyboardEvent,
        headerCheckboxSelection: this.agColumns[0][kk].headerCheckboxSelection,
        headerCheckboxSelectionFilteredOnly: this.agColumns[0][kk].headerCheckboxSelectionFilteredOnly,
        chartDataType: this.agColumns[0][kk].chartDataType,
        pinned: this.agColumns[0][kk].pinned,
        initialPinned: this.agColumns[0][kk].initialPinned,
        lockPinned: this.agColumns[0][kk].lockPinned,
        pivot: this.agColumns[0][kk].pivot,
        initialPivot: this.agColumns[0][kk].initialPivot,
        pivotIndex: this.agColumns[0][kk].pivotIndex,
        initialPivotIndex: this.agColumns[0][kk].initialPivotIndex,
        pivotComparator: this.agColumns[0][kk].pivotComparator,
        enablePivot: this.agColumns[0][kk].enablePivot,
        cellStyle: this.agColumns[0][kk].cellStyle,
        cellClass: this.agColumns[0][kk].cellClass,
        cellClassRules: this.agColumns[0][kk].cellClassRules,
        cellRendererParams: this.agColumns[0][kk].cellRendererParams,
        cellRendererSelector: this.agColumns[0][kk].cellRendererSelector,
        autoHeight: this.agColumns[0][kk].autoHeight,
        wrapText: this.agColumns[0][kk].wrapText,
        enableCellChangeFlash: this.agColumns[0][kk].enableCellChangeFlash,
        suppressCellFlash: this.agColumns[0][kk].suppressCellFlash,
        rowDrag: this.agColumns[0][kk].rowDrag,
        rowDragText: this.agColumns[0][kk].rowDragText,
        dndSource: this.agColumns[0][kk].dndSource,
        dndSourceOnRowDrag: this.agColumns[0][kk].dndSourceOnRowDrag,
        rowGroup: this.agColumns[0][kk].rowGroup,
        initialRowGroup: this.agColumns[0][kk].initialRowGroup,
        rowGroupIndex: this.agColumns[0][kk].rowGroupIndex,
        initialRowGroupIndex: this.agColumns[0][kk].initialRowGroupIndex,
        enableRowGroup: this.agColumns[0][kk].enableRowGroup,
        showRowGroup: this.agColumns[0][kk].showRowGroup,
        enableValue: this.agColumns[0][kk].enableValue,
        aggFunc: this.agColumns[0][kk].aggFunc,
        initialAggFunc: this.agColumns[0][kk].initialAggFunc,
        allowedAggFuncs: this.agColumns[0][kk].allowedAggFuncs,
        sortable: this.agColumns[0][kk].sortable,
        sort: this.agColumns[0][kk].sort,
        initialSort: this.agColumns[0][kk].initialSort,
        sortIndex: this.agColumns[0][kk].sortIndex,
        initialSortIndex: this.agColumns[0][kk].initialSortIndex,
        sortingOrder: this.agColumns[0][kk].sortingOrder,
        comparator: this.agColumns[0][kk].comparator,
        unSortIcon: this.agColumns[0][kk].unSortIcon,
        colSpan: this.agColumns[0][kk].colSpan,
        rowSpan: this.agColumns[0][kk].rowSpan,
        tooltipField: this.agColumns[0][kk].tooltipField,
        tooltipValueGetter: this.agColumns[0][kk].tooltipValueGetter,
        tooltipComponent: this.agColumns[0][kk].hitooltipComponentde,
        tooltipComponentParams: this.agColumns[0][kk].tooltipComponentParams,
        width: this.agColumns[0][kk].width,
        initialWidth: this.agColumns[0][kk].initialWidth,
        minWidth: this.agColumns[0][kk].minWidth,
        maxWidth: this.agColumns[0][kk].maxWidth,
        flex: this.agColumns[0][kk].flex,
        initialFlex: this.agColumns[0][kk].initialFlex,
        resizable: this.agColumns[0][kk].resizable,
        suppressSizeToFit: this.agColumns[0][kk].suppressSizeToFit,
        suppressAutoSize: this.agColumns[0][kk].suppressAutoSize
      };

      if(this.agColumns[0][kk].isLink) {
        definition.cellRendererFramework = LinkCellRenderer;
        definition.cellRendererParams = {
          link: this.agColumns[0][kk].link,
          linkParameters: this.agColumns[0][kk].linkParameters,
          accessRightParam: this.accessRights.display
        }
      }

      if(this.agColumns[0][kk].isCheckBox) {
        definition.cellRendererFramework = CheckboxCellRenderer;
        definition.cellRendererParams = {
          isCheckBoxDisabled: this.agColumns[0][kk].isCheckBoxDisabled
        }
      }

      // this.ColDef.push(definition);
      agGridRenderedColumns.push(definition);
    }

    this.rowModelType = this.agType; // Specify how the data is fetched if from Client Side or Server Side
    this.paginationFlag = this.pagination; // enables pagination in the grid
    this.paginationSize = this.paginationPageSize; // sets 10 rows per page (default is 100)
  }

  onAddClick() {
    if(this.agOnGridEvents == true) {
      this.addNewAgRow();
    }
    if(this.agOnGridEvents == false) {
      this.eventEmitterService.onAddClickFn();
    }
  }

  onUpdateClick() {
    this.eventEmitterService.onUpdateClickFn();
  }

  onDeleteClick() {
    if(this.agOnGridEvents == true) {
      this.deleteAgRow();
    }
    if(this.agOnGridEvents == false) {
      this.eventEmitterService.onDeleteClickFn();
    }
  }

  // Server Side AG-Grid Datasource initialization
  createServerSideDatasource(server: any) {
    return {
      getRows: function (params: any) {
        var response = server.getData(params.request);
        setTimeout(function () {
          if (response.success) {
            params.success(
              {
                rowData: response.rows
              }
            );
          } else {
            params.fail();
          }
        }, 500);
      },
    };
  }

  createFakeServer(allData: any) {
    return {
      getData: function (request: any) {
        var requestedRows = allData.slice();
        return {
          success: true,
          rows: requestedRows,
        };
      },
    };
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http.get(this.dataApi).subscribe((data: any) => {

      // Handle ag-grid rowModelType if clientSide or serverSide
      if(this.rowModelType == 'serverSide') {
        var fakeServer = this.createFakeServer(data);
        var datasource = this.createServerSideDatasource(fakeServer);
        params.api.setServerSideDatasource(datasource);
      }

      if(this.rowModelType == 'clientSide') {
        params.api.setRowData(data);
      }

      if(this.rowModelType != 'serverSide' && this.rowModelType != 'clientSide') {
        throw new Error("Invalid rowModelType, it must be 'serverSide' or 'clientSide'");
      }

      // Handle Sidebar visibility provided by variable allowSideBar
      if (this.allowSideBar == 'true') {
        params.api.setSideBar('columns');
        params.api.setSideBarVisible('true');

        this.statusBar = {
          statusPanels: [
            { statusPanel: 'agTotalRowCountComponent', align: 'left' },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
            { statusPanel: 'agAggregationComponent' },
          ],
        };
        params.api.closeToolPanel();
      }

      // AutoSize Columns to fit provided by variable sizeColumnsToFit
      if (this.sizeColumnsToFit == 'true') {
        params.api.sizeColumnsToFit();
      }
    });
    this.gridApi.setDomLayout('autoHeight');
  }

  // Handling row selections
  onRowSelected(event:any) {
    // If primary key is not available, throw exception Primary key is required
    if(this.agPrimaryKey == '') {
      throw new Error('Primary Key is required');
    } else {
      let primaryKey = this.agPrimaryKey;
      if(event.node.selected) {
        this.selectedNodes = this.selectedNodes + "," + event.data[primaryKey];
      } else {

        console.log("event.node.selected 0 ==========  "  , event.data);
        console.log("event.node.selected 00 ==========  "  , typeof(primaryKey));
        console.log("event.node.selected 1 ==========  "  , event.data[primaryKey]);

        this.selectedNodes = this.selectedNodes.replace(","+event.data[primaryKey],"");
        this.selectedNodes = this.selectedNodes.replace(event.data[primaryKey]+",","");
        this.selectedNodes = this.selectedNodes.replace(event.data[primaryKey],"");
      }

      if(this.selectedNodes.charAt(0) === ',') {
        this.selectedNodes = this.selectedNodes.substring(1);
      }
      localStorage.setItem('agGidSelectedNode',this.selectedNodes);
    }
  }

  defaultColDef: ColDef = {
    editable: false,
    sortable: false,
    flex: 1,
    filter: true,
    resizable: true
  };

  onCellEditingStopped(event: any) {
    let primaryKey = this.agPrimaryKey.toLowerCase();
    let rowPrimaryKey = event.data[primaryKey];
    let jsonRow:any = JSON.stringify(event.data).slice(0, -1);

    if(typeof(rowPrimaryKey) === "undefined") {
      rowPrimaryKey = "";
    }

    for(let i = 0; i < this.gridModifiedRows.length; i ++) {
      if(rowPrimaryKey === this.gridModifiedRows[i][primaryKey]) {
        this.gridModifiedRows[i]["modeType"] = "~toBeRemoved~";
      }
    }

    jsonRow = jsonRow + ',' + '"modeType"'+":"+'"~updateRow~"'+"}";
    jsonRow = JSON.parse(jsonRow);

    if(rowPrimaryKey != "") {
      // Condition used to only take into consideration the Updated rows and not the added ones as well
      this.gridModifiedRows.push(jsonRow);
    }
  }

  addNewAgRow() {
    // Used to add a new line to the grid
    this.gridApi.paginationGoToLastPage();
    const res = this.gridApi.applyTransaction({add: [{}]})!;
    this.gridAddedRows.push(res.add[0].data);
  }

  deleteAgRow() {
    // Used to delete selected row from the grid
    const selectedData = this.gridApi.getSelectedRows();
    if(selectedData.length > 1) {
      for(let i = 0; i < selectedData.length; i++) {
        this.gridDeletedRows.push(selectedData[i]);
      }
    } else {
      this.gridDeletedRows.push(selectedData);
    }
    this.gridApi.applyTransaction({remove: selectedData})!;
  }

  submit() {
    this.agGridUpdates.push({"addList":this.gridAddedRows, "updateList":this.gridModifiedRows, "deleteList":this.gridDeletedRows});

console.log("this.agGridUpdates ====>     ", this.agGridUpdates);

    this.eventEmitterService.onSaveClickFn(this.agGridUpdates);
  }

  agQuickFilter(event: any) {
    const value = ( <HTMLInputElement>event.target ).value
    if(this.agType == 'clientSide') {
      this.gridApi.setQuickFilter(value);
    }

    if(this.agType == 'serverSide') {

    }
  }
}
