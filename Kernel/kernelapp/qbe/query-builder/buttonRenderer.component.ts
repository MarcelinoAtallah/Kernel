import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface ICellRendererParamsWithClick extends ICellRendererParams {
  onClick: (params: any) => void;
}

@Component({
  selector: 'app-button-renderer',
  template: `
    <button class="run-button" (click)="onClick($event)">
      <i class="fas fa-play"></i>
    </button>
  `,
  styles: [`
    .run-button {
      background: transparent; /* No background */
      border: none; /* No border */
      cursor: pointer; /* Mouse pointer on hover */
    }

    .run-button i {
      color: #008000 ; /* Icon color */
      font-size: 16px; /* Icon size */
    }
  `]
})

export class ButtonRendererComponent implements ICellRendererAngularComp {
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
