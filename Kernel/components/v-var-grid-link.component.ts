import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface ICellRendererParamsWithClick extends ICellRendererParams {
  onClick: (params: any) => void;
}

@Component({
  selector: 'v-var-grid-link',
  template: `
    <p class="ag-row-hyperlink" (click)="onClick($event)">
    {{params.value}}
    </p>
  `,
  styles: [`
  
  `]
})

export class VVarGridLinkComponent implements ICellRendererAngularComp {
  params: ICellRendererParamsWithClick;

  agInit(params: ICellRendererParamsWithClick): void {
    this.params = params;
  }

  refresh(params?: ICellRendererParamsWithClick): boolean {
    return true;
  }

  onClick($event: MouseEvent) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onClick(params);
    }
  }
}
