import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/Kernel/services/data.service';

@Component({
  selector: 'app-contentmodal',
  templateUrl: './contentmodal.component.html',
  styleUrls: ['./contentmodal.component.css']
})
export class ContentmodalComponent implements OnInit {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dataservice: DataService) { }
  ngOnInit(): void {
  }

  closepopup(param: any) {
    if (param == 'YES') {
      $("#deletebtn").click();
      this.dialog.closeAll();
      this.dataservice.setDelete(true);

    } else {
      this.dataservice.setDelete(false);
      this.dialog.closeAll();
    }
  }

  save() {

  }
}
