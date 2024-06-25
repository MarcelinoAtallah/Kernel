import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, from, lastValueFrom, map } from 'rxjs';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { AmPreviewFormComponent } from './am-preview-form/am-preview-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/Kernel/services/data.service';
import axios from 'axios';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';

@Component({
  selector: 'main-preview-form',
  templateUrl: './main-preview-form.component.html',
  styleUrls: ['./main-preview-form.component.css']
})



export class PreviewFormComponent implements OnInit {

  @Input() fromScreenBuilder: String = "0";
  @Input() screenBuilderObjId: any;

  public subsVar: Subscription;
  public AllTabs: any = [];
  public tableOptions1: any[] = [];
  public objectId: any;
  public isAdvancedSearch: any;
  public test: any = [];
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public isGrid: any | undefined;
  public isQueryForm: any | undefined;
  public isDynamicReport: any | undefined;
  public previewGridApi: string = '';
  public previewGridApiParam: any;
  public columnId: any;
  public test_1: string = '0';
  public actionType: any;
  public agGridSelectedNodes: any;
  public objectD: any;
  public hasSourceQuery: number = 0;
  public jsonQbe: any[] = [];
  public jsonQbeArr: any[] = [];
  public jsonEmpty: any[] = [];
  public gridStaticData: any;
  public canAdd: string = "";
  public canUpdate: string = "";
  public canDelete: string = "";
  public sourceQuery: string = "-1";
  public toolBar: string = "";
  public objectMain: any;
  public testLinks: any[] = [];
  public isLink: any;
  public hiddenColumns: any[] = [];
  public datatobesent:any[]=[];

  hiddenForm = new FormGroup({});
  menuForm = new FormGroup({});
  public userId: number = Number(this.informationservice.getLogeduserId());

  // Variables added by Nadine
  public buttonObjectId: any;
  public amInfo: any;
  public dialogArray: any[] = [];
  public getWhereCond: any = '-1';
  // public getWhereCond: any[] = [];


  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private _Activatedroute: ActivatedRoute,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
    private dataservice: DataService,
    public informationservice: InformationService,
    private refreshService: RefreshDialogService
  ) { }

  onSearchSubmit(getWhereCond: any) {
   // this.getWhereCond = getWhereCond.data;

    this.getWhereCond = getWhereCond;
    this.getAllColums();
  }

  ngOnDestroy() {
    if (this.subsVar) {
      this.subsVar.unsubscribe()
    }
  }
  formatWhereCond(whereCond:any) {
    // Check if whereCond contains underscores
    if (whereCond.indexOf('_') !== -1) {
        // Replace underscores with spaces
        whereCond = whereCond.replace("_", " ");
    }
    // Add double quotes around the string
    whereCond = '"' + whereCond + '"';
    // Return the formatted whereCond
    return whereCond;
}

  getAllColums() {

    // Filter array on needed data
    let getMainTab = this.AllTabs.filter(function (el: any) {
      return el.isMain == 1;
    });
// this.AllTabs = getMenuNameApi.data;
//     // if (this.AllTabs.length == 1) {
//     //   $(".nav-tabs").hide();
//     // }

//     // localStorage.setItem("allTabs",this.AllTabs[0]);
//     // for(let i=1;i<this.AllTabs.length;i++){
//     // localStorage.setItem("allTabs",localStorage.getItem("allTabs")+~+this.AllTabs[i]);
//     // }
    // this.selectedTabName = this.informationservice.getSelectedTabName();


//     this.AllTabs = this.AllTabs.filter((el: any) => {
//       return el.menuName == this.selectedTabName;
//     });

    // if (this.AllTabs[0] == undefined)
    //   return;









    // for (let i = 0; i < this.AllTabs.length; i++) {


    this.objectId = getMainTab[0].objectId;
    let x = this.tableOptions1[0].canAdd == null ? -1 : this.tableOptions1[0].canAdd;
    let y = this.tableOptions1[0].canDelete == null ? -1 : this.tableOptions1[0].canDelete;
    let z = this.tableOptions1[0].canModify == null ? -1 : this.tableOptions1[0].canModify;
    let w = this.tableOptions1[0].sourceQuery == null ? -1 : this.tableOptions1[0].sourceQuery;
    this.jsonQbe = [];

    if (this.getWhereCond == undefined) {
      this.getWhereCond = ' ';

    } else {
    //  this.getWhereCond = this.formatWhereCond(this.getWhereCond);
    this.getWhereCond =this.getWhereCond ;
    }

    let jsonQbe_canAdd: any[] = [];
    jsonQbe_canAdd.push(
      {
        queryId: x,
        parameters: [
          {
            paramName: 'actionType',
            paramValue: '' + this.actionType + ''
          },
          {
            paramName: 'userId',
            paramValue: this.userId
          }
        ],
        link: [],
        isHidden: [],
        whereCond: this.getWhereCond
      }
    )

    this.http.post<any>(GlobalConstants.getQbeIdApi + x + "/0", jsonQbe_canAdd, { headers: GlobalConstants.headers }).subscribe((data: any) => {
      this.canAdd = data[0];

      let jsonQbe_canDelete: any[] = [];
      jsonQbe_canDelete.push(
        {
          queryId: y,
          parameters: [
            {
              paramName: 'actionType',
              paramValue: '' + this.actionType + ''
            },
            {
              paramName: 'userId',
              paramValue: this.userId
            }
          ],
          link: [],
          isHidden: [],
          whereCond: this.getWhereCond

        }
      )

      this.http.post<any>(GlobalConstants.getQbeIdApi + y + "/0", jsonQbe_canDelete, { headers: GlobalConstants.headers }).subscribe((data: any) => {
        this.canDelete = data[0];

        let jsonQbe_canUpdate: any[] = [];
        jsonQbe_canUpdate.push(
          {
            queryId: y,
            parameters: [
              {
                paramName: 'actionType',
                paramValue: '' + this.actionType + ''
              },
              {
                paramName: 'userId',
                paramValue: this.userId
              }
            ],
            link: [],
            isHidden: [],
            whereCond: this.getWhereCond
          }
        )

        this.http.post<any>(GlobalConstants.getQbeIdApi + z + "/0", jsonQbe_canUpdate, { headers: GlobalConstants.headers }).subscribe(async (data: any) => {
          this.canUpdate = data[0];

          if (this.canAdd == "1") {
            this.toolBar += "a";
          }

          if (this.canUpdate == "1") {
            this.toolBar += "m";
          }

          if (this.canDelete == "1") {
            this.toolBar += "d";
          }

          // this.http.get<any>(GlobalConstants.getParamsNameApi + w, { headers: GlobalConstants.headers }).subscribe((data0: any) => {
          //   if (data0 != null && data0.length != 0) {
          //     let colName = data0[0].paramName;
          //     let colVal = this.informationservice.getAgGidSelectedNode();
          //     colName = data0[0].paramName;
          //     if (colName == "userId") {
          //       this.jsonQbe = [
          //         {
          //           queryId: w,
          //           parameters: [
          //             {
          //               paramName: colName,
          //               paramValue: this.informationservice.getLogeduserId()
          //             }
          //           ],
          //           link: []
          //         }
          //       ]
          //     } else {
          //       this.jsonQbe = [
          //         {
          //           queryId: w,
          //           parameters: [
          //             {
          //               paramName: colName,
          //               paramValue: colVal
          //             }
          //           ],
          //           link: []
          //         }
          //       ]
          //     }
          //   } else {
          //     this.jsonQbe = [
          //       {
          //         queryId: w,
          //         parameters: [
          //           {
          //             paramName: '',
          //             paramValue: ''
          //           }
          //         ],
          //         link: []
          //       }
          //     ]
          //   }

          const getColumnsApiUrl0 = from(axios.get(GlobalConstants.getColumnsApi + this.objectId));
          const getColumns0Api = await lastValueFrom(getColumnsApiUrl0);
          let linkColumn: any = getColumns0Api.data.filter((el: any) => {
            return el.isLink === "1";
          });
          let hiddenColumn: any = getColumns0Api.data.filter((el: any) => {
            return el.isGridHidden === "1";
          });


          //elie///////////////////////////////////////////
          if(w!='' || w!=null){
          const getColumnsQueryApi = from(axios.get(GlobalConstants.getColumnsQuery + w));
          const getColumnsQuery = await lastValueFrom(getColumnsQueryApi);

          if(getColumnsQuery.data!=null || getColumnsQuery.data.length!=0){
          let linkQueryColumn: any = getColumnsQuery.data.filter((el: any) => {
            return el.isLink === "1";
          });
          for (let f = 0; f < linkQueryColumn.length; f++) {
            let item = {
              colName: linkQueryColumn[f].name,
              isLink: linkQueryColumn[f].isLink,
              menuName: linkQueryColumn[f].menus,
              colDesc:linkQueryColumn[f].columnDescription
            }
            this.testLinks.push(item);
          }
        }
      }
          /////////////////////////////////////////////////

          for (let f = 0; f < linkColumn.length; f++) {
            let item = {
              colName: linkColumn[f].name,
              isLink: linkColumn[f].isLink,
              menuName: linkColumn[f].menus,
              colDesc:linkColumn[f].columnDescription
            }
            this.testLinks.push(item);

          }
          for (let f = 0; f < hiddenColumn.length; f++) {
            let item = {
              colName: hiddenColumn[f].name,
              isGridHidden: hiddenColumn[f].isGridHidden,
              menuName: hiddenColumn[f].menus,
              colDesc:hiddenColumn[f].columnDescription
            }
            this.hiddenColumns.push(item);

          }

          let jsonQbe_sourceQuery: any[] = [];
          jsonQbe_sourceQuery.push(
            {
              queryId: w,
              parameters: [
                {
                  paramName: 'actionType',
                  paramValue: '' + this.actionType + ''
                },
                {
                  paramName: 'userId',
                  paramValue: this.userId
                }
              ],
              link: [],
              isHidden: [],

              whereCond: this.getWhereCond
            }
          )

          jsonQbe_sourceQuery.push(
            {
              queryId: w,
              parameters: [
                {
                  paramName: '',
                  paramValue: ''
                }
              ],
              link: this.testLinks,
              isHidden:[],
              whereCond: this.getWhereCond

            }
          );

          jsonQbe_sourceQuery.push(
            {
              queryId: w,
              parameters: [
                {
                  paramName: '',
                  paramValue: ''
                }
              ],
              link:[],
              isHidden: this.hiddenColumns,
              whereCond: this.getWhereCond

            }
          );
          this.http.post<any>(GlobalConstants.getQbeIdApi + w + "/1", jsonQbe_sourceQuery, { headers: GlobalConstants.headers }).subscribe((data: any) => {
            this.sourceQuery = data;
            if (this.sourceQuery != "-1") {
              this.http.get<any>(GlobalConstants.getColumnsApi + this.objectId).subscribe((dataa: any) => {
                // let tableName = dataa[0].tableName;
                let gridHeaders = data[0].headers[0];
                let gridResults = data[0].result[0];
                this.agColumns = [];
                this.columnId = "ROW_ID";
                this.agColumnsJson = gridHeaders;
                this.agColumns.push(this.agColumnsJson);
                this.gridStaticData = gridResults;

                this.test_1 = '1';
                this.hasSourceQuery = 1;
              });
            } else {

              let jsonArr: string = "[";

              this.http.get<any>(GlobalConstants.getColumnsApi + this.objectId).subscribe((data: any) => {

                let dataa = data.filter((el: any) => {
                  return el.columnTypeCode != 14;
                });
                let uniqueArray = dataa.filter(
                  (item: any, index: any, self: any) =>
                    index === self.findIndex((t: any) => t.tableName === item.tableName)
                );

                setTimeout(() => {

                  let tblName: any;
                  let tableName = '';
                  let count = 0;
                  for (let k = 0; k < uniqueArray.length; k++) {
                    jsonArr += "{\"" + "columns" + "\" : [";
                    tableName = uniqueArray[k].tableName
                    for (let i = 0; i < dataa.length; i++) {
                      count++;
                      if (tableName == dataa[i].tableName) {
                        // tblName = tableName;
                        let colName = dataa[i].name;
                        jsonArr += "{";
                        if (i == dataa.length - 1) {
                          jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"";
                          jsonArr += "}";
                        } else {
                          jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"";
                          jsonArr += "},";
                        }
                      }
                    }

                    if (k == uniqueArray.length - 1) {
                      jsonArr += "],";
                      jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"";
                      jsonArr += "}]";
                    }
                    else {
                      jsonArr += "],";
                      jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"";
                      jsonArr += "},";
                    }
                    jsonArr = jsonArr.replace("},]", "}]");
                  }

                  let jsonData = JSON.parse(jsonArr);
                  let tableNames: string = '';
                  for (let u = 0; u < jsonData.length; u++) {
                    tableNames = tableNames + "," + jsonData[u].tableName;
                  }
                  tableNames = tableNames.substring(1);
                  this.http.post<any>(GlobalConstants.getColumnIdApi, tableNames).subscribe((data: any) => {
                    this.columnId = data.description;
                    this.informationservice.setROW_ID(data.description);

                    let jsonVal = [{
                      objectId: this.objectId,
                      selectedRowId: -1,
                      primaryColumn: this.columnId,
                      dynamicTable: JSON.parse(jsonArr)
                    }];

                    this.http.post<any>(GlobalConstants.getDynamicGridHeaders, jsonVal, { headers: GlobalConstants.headers }).subscribe((data: any) => {
                      this.agColumnsJson = data;
                      this.agColumns.push(this.agColumnsJson);
                      this.previewGridApi = GlobalConstants.getDynamicGridData;
                      this.previewGridApiParam = jsonVal;
                      this.test_1 = '1';
                      // this.getAllColums();
                    });
                  });
                }, 1000);
              });
            }
          });
          // });
          // }
        });
      });
    });
    //   }
    // }
    this.http.get<any>(GlobalConstants.getColumnsApi + this.objectId).subscribe(async (data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.menuForm.addControl(data[i].name, new FormControl(''));
        // nadine
        if (data[i].columnTypeCode == 14) {

          const getButtonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + data[i].id));
          const getButtonData = await lastValueFrom(getButtonDataUrl);

          let data1 = getButtonData.data;
          if (data1.blobFile != null && data1.blobFile != undefined) {
            const base64EncodedString = data1.blobFile;
            const decodedString = atob(base64EncodedString);

            let n = decodedString.split("~A~");
            // let lastPart = n.pop();
            let lastPart = decodedString.split("~A~")[4];
            if (lastPart == "false") {
              data[i].mainAndPreview = false;
            } else {
              data[i].mainAndPreview = true;
            }
          }
        }
      }
      this.test = data;
    });
  }

  ngOnInit(): void {

    ///////////elie//////////////////
    this.informationservice.setDynamicReportId('');


     for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('~') && key!="~previousMainTab~") {
        localStorage.removeItem(key);
      }
    }
    ///////////////////      
    this.informationservice.removePopupBreadcrumb();
    this.informationservice.removeTabpath();

    this.tableOptions1 = [];

    this._Activatedroute.paramMap.subscribe((params) => {
      this.objectId = this.fromScreenBuilder == "1" ? this.screenBuilderObjId : params.get('parentId');

      this.http.get<any>(GlobalConstants.getAllTabs + this.objectId, { headers: GlobalConstants.headers }).subscribe((res: any) => {
        for (let i = 0; i < res.length; i++) {
          this.tableOptions1.push({
            "tableName": res[i].menuName, "canAdd": res[i].canAdd, "canDelete": res[i].canDelete,
            "canModify": res[i].canModify,
            "sourceQuery": res[i].sourceQuery,
            "isAdvancedSearch": res[i].isAdvancedSearch,
            "isGrid": res[i].isGrid,
            "isQueryForm": res[i].isQueryForm,
            "isDynamicReport": res[i].isDynamicReport,
            "isReadOnly": res[i].isReadOnly,
            "objectId": res[i].objectId,
            "isMain": res[i].isMain
          })

          if (res[i].isMain == 1) {
            this.objectMain = res[i].objectId;
          }

          if (res[i].isMain == "1") {

            let previousTab = this.informationservice.getPreviousMainTab();

            if (this.informationservice.getMainTab() != null && this.informationservice.getMainTab() != "") {

              this.informationservice.setPreviousMainTab(this.informationservice.getMainTab())
            }
            if (previousTab) {

              this.informationservice.setMainTab(previousTab);
            }
            if (!previousTab) {
              this.informationservice.setMainTab(res[i].menuName);
            }
          }
        }
        
        console.log("TABLE OPTIONS>>>>>>>>>>>>",this.tableOptions1[0]);
        
        if(this.tableOptions1[0].isDynamicReport=='1'){
            this.informationservice.setIsDynamicReport(true);
        }else{
          this.informationservice.setIsDynamicReport(false);
        }
        
        this.tableOptions1 = this.tableOptions1.filter(value => value.isMain == '1');
        this.http.get<any>(GlobalConstants.getMenuNameApi + this.objectId).subscribe((data: any) => {
          this.AllTabs = data;
          this.getAllColums();
        });
      });
    });

    setTimeout(() => {

    }, 1000);



  }

  onAddClick() {

    this.informationservice.removePreviousTab();
    this.informationservice.removePreviousMainTab();
    this.informationservice.removeMainTab();
    this.informationservice.removeSelectedTabName();

    this.actionType = "saveNew";
    let data = [{
      objectId: this.objectMain,
      actionType: this.actionType,
      isFromGridClick: 1,
      primaryColumn: this.columnId,
      previousTab: "-1"
    }];

    const dialogRef = this.dialog.open(AmPreviewFormComponent, {
      width: "80%",
      height: "80%",
      data: data
    });
    this.dataservice.PushdialogArray(dialogRef);
    this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.commonFunctions.reloadPage('/dsp/augmentedConfig/form/update/' + this.objectMain + '/-1/previewForm/');
    });
  }

  onUpdateClick() {
    this.informationservice.removePreviousTab();
    this.informationservice.removePreviousMainTab();
    this.informationservice.removeMainTab();
    this.informationservice.removeSelectedTabName();

    this.actionType = "update";
    let data = [{
      objectId: this.objectMain,
      selectedRowId: this.informationservice.getAgGidSelectedNode(),
      isFromGridClick: 1,
      actionType: this.actionType,
      primaryColumn: this.columnId,
      previousTab: "-1"
    }];

    const dialogRef = this.dialog.open(AmPreviewFormComponent, {
      width: "80%",
      height: "80%",
      data: data
    });

    this.dataservice.PushdialogArray(dialogRef);
    this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    this.commonFunctions.reloadPage('/dsp/augmentedConfig/form/update/' + this.objectMain + '/-1/previewForm/');
    });
  }



  dynamicFormQuering(data: any, actionType: string): string {
    if (actionType == 'select') {

      let jsonArr: string = "[";
      let uniqueArray = data.filter(
        (item: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.tableName === item.tableName)
      );

      let tableName = '';
      let count = 0;
      // for (let k = 0; k < uniqueArray.length; k++) {
      //   jsonArr += "{\"" + "columns" + "\" : [";
      //   tableName = uniqueArray[k].tableName
      //   for (let i = 0; i < data.length; i++) {
      //     count++;
      //     if (tableName == data[i].tableName) {
      //       let colName = data[i].name;
      //       let colType = data[i].columnType;
      //       orderNo = data[i].orderNo;
      //       jsonArr += "{";
      //       if (i == data.length - 1) {
      //         jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
      //         jsonArr += "}";
      //       } else {
      //         jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
      //         jsonArr += "},";
      //       }
      //     }
      //   }
      //   if (k == uniqueArray.length - 1) {
      //     jsonArr += "],";
      //     jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "\"" + orderNo + "\"";
      //     jsonArr += "}]";

      //     jsonArr = jsonArr.replace("},]", "}]");
      //   } else {
      //     jsonArr += "],";
      //     jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "\"" + orderNo + "\"";
      //     jsonArr += "},";
      //   }
      //   jsonArr = jsonArr.replace("},],", "}],");

      // }
      for (let k = 0; k < uniqueArray.length; k++) {
        jsonArr += "{\"" + "columns" + "\" : [";
        tableName = uniqueArray[k].tableName;
        let orderNo;
        for (let i = 0; i < data.length; i++) {
          count++;
          if (tableName == data[i].tableName) {
            let colId = data[i].colId;
            let colName = data[i].name;
            let colType = data[i].columnType;
            let isLink = data[i].isLink;
            orderNo = data[i].orderNo;
            let linkedObjectId = isLink != null ? data[i].menus : -1;
            jsonArr += "{";

            if (isLink == "1") {
              jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"" + "," + "\"" + "isLink" + "\"" + ":" + "\"" + isLink + "\"" + "," + "\"" + "linkedObjectId" + "\"" + ":" + "\"" + linkedObjectId + "\"";
            } else {
              jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + colName + "\"" + "," + "\"" + "colType" + "\"" + ":" + "\"" + colType + "\"";
            }
            if (i == data.length - 1) {
              jsonArr += "}";
            } else {
              jsonArr += "},";
            }
          }
        }
        if (k == uniqueArray.length - 1) {
          jsonArr += "],";
          jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\""+ "," + "\"" + "orderNo" + "\"" + ":" + "\"" + orderNo + "\"";
          jsonArr += "}]";
          jsonArr = jsonArr.replace("},]", "}]");
        } else {
          jsonArr += "],";
          jsonArr += "\"" + "tableName" + "\"" + ":" + "\"" + tableName + "\"" + "," + "\"" + "orderNo" + "\"" + ":" + "\"" + orderNo + "\"";
          jsonArr += "},";
          jsonArr = jsonArr.replace("},]", "}]");
        }
      }
      return jsonArr;
    }
  }


  onDeleteClick() {

    let jsonArr = "[{";
    jsonArr += " \"" + "columns" + "\" : [";
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    this.http.get<any>(GlobalConstants.getColumnsApi + this.objectId).subscribe((data: any) => {
      let jsonData = JSON.parse(this.dynamicFormQuering(data, 'select'));
      let dataa = jsonData.sort((b:any, a:any) => {
        return parseInt(a.orderNo) - parseInt(b.orderNo);
    });


      let jsonVal = [{
        objectId: this.objectId,
        selectedRowId: selectedNodes,
        primaryColumn: this.columnId,
        dynamicTable: dataa
      }];
      this.http.post<any>(GlobalConstants.dynamicDeleteFormBuilderApi, jsonVal,
        { headers: GlobalConstants.headers }).subscribe({
          next: (res) => {
            this.commonFunctions.alert("alert", 'Deleted Successfully');
            this.commonFunctions.reloadPage('/dsp/augmentedConfig/form/update/' + this.objectMain + '/-1/previewForm/');
          },
          error: (error) => {
            console.log(error);
          }
        });
    });
  }

  async onShowButtonForm(buttonId: number) {
    let mainTab = this.informationservice.getMainTab();
    const getButtonDataUrl = from(axios.get(GlobalConstants.getButtonDataApi + buttonId));
    const getButtonData = await lastValueFrom(getButtonDataUrl);
    let data1 = getButtonData.data;

    if (data1.blobFile != null && data1.blobFile != undefined) {
      const base64EncodedString = data1.blobFile;
      const decodedString = atob(base64EncodedString);
      let GridToOpenID = decodedString.split("~A~")[0];
      let buttonAction: any = decodedString.split("~A~")[1];
      let url = decodedString.split("~A~")[3];

      if (buttonAction == "5") {
        let customerId = -1;
        let userId = this.informationservice.getLogeduserId();
        let params = this.informationservice.getAgGidSelectedNode();
        customerId = JSON.parse(params)[0].COLVALUE;
        let customerType=JSON.parse(params)[2].COLVALUE;
        console.log("CUSTOMER TYPE>>>>>>>>>>",customerType);
        let jsonArr: string = "{";
        jsonArr += "\"" + "columns" + "\" : [";
        jsonArr += "{";
        jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + "kycId" + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + customerId + "\"";
        jsonArr += "}"
        jsonArr += "]," + "\"" + "customerId" + "\"" + ":" + "\"" + customerId + "\"" + "," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + 0 + "\"" + "}";
        //  const callingApi = from(axios.post(url,JSON.parse(jsonArr)));
        //  const ResultOfCallingApi = await lastValueFrom(callingApi);
        let headerOptions = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
          //   'Accept': 'application/octet-stream', // for excel file
        });
        let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };

        console.log("URLLLLLL>>>>>>>>>",url);
        if(customerType==='7'){
          console.log("HOLAAAA");
          url=url.replace("31860","31849");
        }
        // url is : executeReportwithOneParam/31849
        let ApiUrl = "http://" + GlobalConstants.endPointAddress + ":7001/api/" + url;

        this.http.post(ApiUrl, JSON.parse(jsonArr), requestOptions).pipe(map((data: any) => {
          let blob = new Blob([data], {
            type: 'application/pdf' // must match the Accept type
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
      else if(buttonAction == "3") {
        let customerId = -1;
        let userId = this.informationservice.getLogeduserId();
        let params = this.informationservice.getAgGidSelectedNode();
        customerId = JSON.parse(params)[0].COLVALUE;
        let customerType=JSON.parse(params)[2].COLVALUE;
        console.log("CUSTOMER TYPE>>>>>>>>>>",customerType);
        let jsonArr: string = "{";
        jsonArr += "\"" + "columns" + "\" : [";
        jsonArr += "{";
        jsonArr += "\"" + "colName" + "\"" + ":" + "\"" + "kycId" + "\"" + "," + "\"" + "colVal" + "\"" + ":" + "\"" + customerId + "\"";
        jsonArr += "}"
        jsonArr += "]," + "\"" + "customerId" + "\"" + ":" + "\"" + customerId + "\"" + "," + "\"" + "userId" + "\"" + ":" + "\"" + userId + "\"" + "," + "\"" + "nearBy" + "\"" + ":" + "\"" + 0 + "\"" + "}";
        //  const callingApi = from(axios.post(url,JSON.parse(jsonArr)));
        //  const ResultOfCallingApi = await lastValueFrom(callingApi);
        let headerOptions = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
          //   'Accept': 'application/octet-stream', // for excel file
        });
        let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };
        
        // url is : executeReportwithOneParam/31849
        console.log("PARAMSSSS>>>>>>>>>",params);
        console.log("JSON ARRRRRRR>>>>>>>>>",jsonArr);
        let ApiUrl = "http://" + GlobalConstants.endPointAddress + ":7004/api/" + url;
        this.http.post(ApiUrl, JSON.parse(params), requestOptions).pipe(map((data: any) => {
        })).subscribe((result: any) => {
        });
      }
      else if (buttonAction == "1") {
        let selectedRowIdd = this.informationservice.getAgGidSelectedNode();
        let nodeData = JSON.parse(selectedRowIdd);
        let newSelectedRowIdd = nodeData.filter((el: any) => {
          return el.TYPE === "BUTTON";
        });
        let params = '';
        
        let data = [{
          actionType:'update',
          objectId: GridToOpenID,
          isFromGridClick: 0,
          primaryColumn: this.columnId,
          buttonClick: 14,
          selectedRowId: this.handleSelectedRowIds(newSelectedRowIdd, "button")
        }];
        let dialogRef = this.dialog.open(AmPreviewFormComponent, {
          width: "80%",
          height: "80%",
          data: data
        });
        this.dataservice.PushdialogArray(dialogRef);
        this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());
        this.dialogArray.push(dialogRef);

        dialogRef.afterClosed().subscribe(result =>
        {
          this.commonFunctions.reloadPage('/dsp/augmentedConfig/form/update/' + data[0].objectId + '/-1/previewForm/');

          $(".nav-tabs").show();
          $(".nav-tabs").css({ "flex-direction": "row" });

          setTimeout(() =>
          {
            this.refreshService.notifyOther({ refresh: true });
            let x = this.dataservice.getdialogArray();
            dialogRef = x[x.length - 1];
            x.pop();
            this.dataservice.SetdialogArray(x);

            let tabs = $(".tab-title");

            for (let i = 0; i < tabs.length; i++)
            {
              if (tabs[i].className.indexOf("active") != -1)
              {
                $("#" + tabs[i].offsetParent.id + " .tab .tab-title")[0].click();
              }
            }
          }, 1000);

          this.informationservice.setSelectedTabName(mainTab);

          for (let i = 0; i < JSON.parse(this.informationservice.getTabpath()).length; i++)
          {
            if (mainTab == JSON.parse(this.informationservice.getTabpath())[i].tabTitle)
            {
              this.amInfo = JSON.parse(this.informationservice.getTabpath())[i].tabData;
              //this.loadAM(true);
            }
          }
        });
      }
    }
  }


  handleSelectedRowIds(data: any, compare: string) {
    let newDD: any;
    try {
      let dd: any;
      if (typeof (data) == "string") {
        let d = data.toLowerCase();
        dd = JSON.parse(d);
      } else {
        let d = JSON.stringify(data);
        dd = JSON.parse(d.toLowerCase());
      }


      if (compare.indexOf(",") != -1) {
        newDD = dd.filter((el: any) => {
          return el.type.toLowerCase() === compare.split(",")[0] || el.type.toLowerCase() === compare.split(",")[1];
        });
      } else {
        newDD = dd.filter((el: any) => {
          return el.type.toLowerCase() === compare.toLowerCase();
        });
      }
    } catch (error) {
      console.log("error on handleSelectedRowIds >>>> ", error)
      newDD = -1;
    }
    return newDD;
  }




}




