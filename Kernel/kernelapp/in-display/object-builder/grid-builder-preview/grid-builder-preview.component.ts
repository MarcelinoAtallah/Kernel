import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-grid-builder-preview',
  templateUrl: './grid-builder-preview.component.html',
  styleUrls: ['./grid-builder-preview.component.css']
})
export class GridBuilderPreviewComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  // public agColumnsJson:any = [];
  public getGridQueryData: any;
  public parameters: any;
  public showPopup: boolean = false;
  public agGridSelectedNodes: any = '';
  public staticData: any;

  public formExists: boolean = false;
  public showInput: boolean = false;
  public showExecGrid: boolean = false;
  public formValues: any = [];
  public currentQuery: any;


  constructor(private http: HttpClient, public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router) { }
  public agColumnsJson: any = [];
  gridObject: any[] = [];
  ngOnInit(): void {
if( this.data.flag == 1){
    for (let i = 0; i < this.data.data.length; i++) {
      this.getGridQueryData = GlobalConstants.getGridQueryData + this.data.data[i].id;
      this.agColumnsJson.push(this.data.data[i].records);
      this.gridObject.push([
        [this.data.data[i].id],
        [this.data.data[i].records],
        [this.getGridQueryData]
      ]);
    }
    this.agColumns.push(this.agColumnsJson);
  }else{
    this.getGridQueryData = GlobalConstants.getGridQueryData + this.data.id;
    this.agColumnsJson.push(this.data.data);
    this.gridObject.push([
      [this.data.id],
      [this.data.data],
      [this.getGridQueryData]
    ]);
  }
}

}
