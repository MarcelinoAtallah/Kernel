import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
    template: `<span *ngIf="params.accessRightParam == '0'">{{params.value}}</span>
        <a *ngIf="params.accessRightParam == '1'" class="ag-row-hyperlink" [routerLink]="url">{{params.value}}</a>`
})
export class LinkCellRenderer implements AgRendererComponent {    
    params: any;

    url: string = '';
    urlParams: string = '';

    agInit(params: any): void {
        if(params.linkParameters.indexOf(",") != -1) {
            // For multiple parameters
            let arrayOfParams = params.linkParameters.split(",");
            for(let i = 0; i < arrayOfParams.length; i ++) {
                this.urlParams = this.urlParams + "/" + params.data[arrayOfParams[i]];
            }
            this.url = params.link + this.urlParams;
            this.url = this.url.replace("//","/");
        } else {
            // For single parameters
            this.url = params.link + "/" + params.data[params.linkParameters];
            this.url = this.url.replace("//","/");
        }
        this.params = params;
    }

    refresh(params: any): boolean {
        return false;
    }    
}