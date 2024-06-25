import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgRendererComponent } from 'ag-grid-angular';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { AmPreviewFormComponent } from 'src/app/Kernel/kernelapp/in-display/form-builder/preview-form/am-preview-form/am-preview-form.component';
import { DataService } from 'src/app/Kernel/services/data.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';

@Component({
    template: `<span *ngIf="params.accessRightParam == '0'">{{params.value}}</span>
        <a *ngIf="params.accessRightParam == '1' && params.linkType == 'field'" class="ag-row-hyperlink" [routerLink]="url">{{params.value}}</a>
        <a *ngIf="params.accessRightParam == '1' && params.linkType == 'linkPopUp'" class="ag-row-hyperlink" (click)="openLinkPop(params.data.ROW_ID, params.linkValue)">{{params.value}}</a>`
})
export class LinkCellRenderer implements AgRendererComponent {

    constructor(private dialog: MatDialog,    public commonFunctions: CommonFunctions,
public informationservice :InformationService, public dataservice: DataService, private refreshService: RefreshDialogService) { }
    params: any;
    url: string = '';
    urlParams: string = '';
    public dialogArray: any[] = [];

    agInit(params: any): void {
        if (params.linkType == "field") {
            if (params.linkParameters.indexOf(",") != -1) {
                // For multiple parameters
                let arrayOfParams = params.linkParameters.split(",");
                for (let i = 0; i < arrayOfParams.length; i++) {
                    this.urlParams = this.urlParams + "/" + params.data[arrayOfParams[i]];
                }
                this.url = params.link + this.urlParams;
                // console.log("url is : ",this.url);
                this.url = this.url.replace("//", "/");
                // console.log("last url is : ",this.url);
            } else {
                // For single parameters
                this.url = params.link + "/" + params.data[params.linkParameters];
                this.url = this.url.replace("//", "/");
            }
        }
        this.params = params;
    }

    openLinkPop(params: any, objectId: any) {

        console.log("PARAMS>>>>>>>>>>>>>",params);
        // used for indisplay multi rows 
        let paramstest = JSON.parse(params);
        console.log("paramstest >>> ",paramstest);
        let data_1: any[] = [];
        for (let i = 0; i < paramstest.length; i++) {
            let test = paramstest.filter((el: any) => {
                return el.TYPE === 'GRIDLINK';
            });
            data_1.push(test);
        }
        console.log("data_1 >>> ",data_1);
        let colName = data_1[0][0].COLNAME;
        let colValue = data_1[0][0].COLVALUE;

        let mainTab = this.informationservice.getMainTab();
        console.log("mainTab = ",mainTab);
        //test5
        let data: any;
        console.log("this.informationservice.getDynamicService(~ + mainTab + ~)=",this.informationservice.getDynamicService("~" + mainTab + "~"));
        if(this.informationservice.getDynamicService("~" + mainTab + "~") == undefined){
          data = undefined;
        }else{
            data = JSON.parse("[" + this.informationservice.getDynamicService("~" + mainTab + "~") + "]");
        }
console.log("data = ",data);
        if(data==undefined || data.length == 0 ||  data==null || data==''){
            data=[{
            objectId:objectId,
            
            selectedRowId:this.informationservice.getAgGidSelectedNode(),
            isFromGridClick:1,
            actionType:"update",
            primaryColumn:"ROW_ID",
            previousTab:"-1"}]
            
            this.informationservice.setIsFromMain("yes");
        }
        data[0].objectId = objectId;
        data[0].isFromGridClick = 0;
        data[0].isFromLink = 1;
        //let newData = JSON.parse(data[0].selectedRowId);
        let newData = JSON.parse(params);
        for (let item = 0; item < newData.length; item++) {
            if (newData[item].COLNAME.toLowerCase() == colName.toLowerCase()) {
                newData[item].COLVALUE = colValue;
            }
        }
        data[0].selectedRowId = JSON.stringify(newData);


        let dialogRef = this.dialog.open(AmPreviewFormComponent, {
            width: "80%",
            height: "80%",
            data: data
        });
        dialogRef.disableClose = true;
        this.dataservice.PushdialogArray(dialogRef);
        this.dataservice.PushOpenLikeForm(this.informationservice.getFormToOpen());
        this.dialogArray.push(dialogRef);

        dialogRef.afterClosed().subscribe(result => {
            console.log("after close 11111111111111111111111");
           this.commonFunctions.reloadPage('/dsp/augmentedConfig/form/update/' + data[0].objectId + '/-1/previewForm/');

                $(".nav-tabs").show();
                $(".nav-tabs").css({ "flex-direction": "row" });

            setTimeout(() => {
                this.refreshService.notifyOther({ refresh: true });
                let x = this.dataservice.getdialogArray();
                dialogRef = x[x.length - 1];
                x.pop();
                this.dataservice.SetdialogArray(x);

                let tabs = $(".tab-title");
                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].className.indexOf("active") != -1) {
                        $("#" + tabs[i].offsetParent.id + " .tab .tab-title")[0].click();
                    }
                }
            }, 1000);

        });
    }

    refresh(params: any): boolean {
        return false;
    }
}