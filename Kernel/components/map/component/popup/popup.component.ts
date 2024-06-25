import { Component, Input, ViewChild } from '@angular/core';
import { VAgGridComponent } from '../v-ag-grid/v-ag-grid.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
   @Input() content:String;
   contentGrid:String;
  isOpen = false;

  open(popupcontent:any) {
    this.isOpen = true;
    //console.log('popupcontent',popupcontent)

  }

  close() {
    this.isOpen = false;
  }

  appendData(data: any) {
    //console.log('data',data)
    this.contentGrid = data.outerHTML
  }
}
