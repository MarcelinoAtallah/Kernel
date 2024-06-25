import { Component, ViewChild } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { AGGridComponent } from '../v-grid.components';

@Component({
    template: `<input type="checkbox" [checked]="isChecked" [disabled]="isDisabled">`
})
export class CheckboxCellRenderer implements AgRendererComponent {    
    params: any;
    isChecked: boolean = false;
    isDisabled: boolean = false;

    @ViewChild(AGGridComponent) agGrid: any;

    agInit(params: any): void {

        // Handle if checkbox is checked or no
        if(params.value == "0") {
            this.isChecked = false;
        } else {
            this.isChecked = true;
        }
        
        // Handle if checkbox is disabled or no
        this.isDisabled = params.isCheckBoxDisabled;
        if(typeof(this.isDisabled) == "undefined") {
            this.isDisabled = false;
        }

        this.params = params;
    }

    refresh(params: any): boolean {
        return false;
    }
    
    // handleAgChanges() {
    //     console.log("this.params ====>        ", this.params.data);
    //     console.log("this.agGrid.gridModifiedRows 2 ====>        ", this.agGrid.gridModifiedRows);

    //     let jsonRow:any = JSON.stringify(this.params.data);

    //     for(let i = 0; i < this.agGrid.gridModifiedRows.length; i ++) {
    //         // if(rowPrimaryKey === this.agGrid.gridModifiedRows[i][primaryKey]) {
    //         //     this.gridModifiedRows[i]["modeType"] = "~toBeRemoved~";
    //         // }

    //         console.log("Test =====>     ", this.agGrid.gridModifiedRows[i]);

    //     }

    //     jsonRow = jsonRow + ',' + '"modeType"'+":"+'"~updateRow~"'+"}";
    //     jsonRow = JSON.parse(jsonRow);
    //     this.agGrid.gridModifiedRows.push(jsonRow);
    // }
}