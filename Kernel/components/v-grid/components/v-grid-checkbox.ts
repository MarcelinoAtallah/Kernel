import { Component, ViewChild ,EventEmitter, Output } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-enterprise';
import { AGGridComponent } from '../v-grid.components';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  template: `
    <input type="checkbox"
           [id]="fieldId"
           [checked]="isChecked"
           [disabled]="isDisabled"
           (change)="onCheckboxChange($event)">
  `
})


export class CheckboxCellRenderer implements AgRendererComponent {
  params: any;
  isChecked: boolean = false;
  isDisabled: boolean = false;
  fieldId: any;

  @ViewChild(AGGridComponent) agGrid: any;
  @Output() paramsChange = new EventEmitter<any>(); //added to send data to the container of the checkbox
  frameworkComponents:any;
  

  constructor(private eventEmitterService: EventEmitterService,
    public informationservice: InformationService) {
      
      this.frameworkComponents = {
        checkboxRenderer: CheckboxCellRenderer    };
     }
  

  agInit(params: any): void {
    this.fieldId = "chk_" + params.data.id;
    this.isChecked = params.value === "1";
    this.isDisabled = params.isCheckBoxDisabled || false;
    this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  onCheckboxChange(event: any): void {
    
    const newValue = event.target.checked ? '1' : '0';

    if (newValue !== this.params.data[this.params.col_name]) {
      this.params.setValue(newValue);
      this.paramsChange.emit(this.params); // Emit the updated params back to the sender

    }
setTimeout(() => {
  console.log("CHECKBOX INFORMATION SYSTEM>>>>>>>>>>",this.informationservice.getAgGidSelectedNode());

}, 1000);

  }

  refresh(params: any): boolean {
    return false; // No need to refresh the cell, since it's handled by onCheckboxChange
  }
}
