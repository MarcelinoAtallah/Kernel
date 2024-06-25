import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'sql-formatter';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-show-generated-query',
  templateUrl: './show-generated-query.component.html',
  styleUrls: ['./show-generated-query.component.css']
})
export class ShowGeneratedQueryComponent implements OnInit {

  constructor(private http: HttpClient,public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router) { }

  ngOnInit(): void {
  
  this.data=this.data.replaceAll("[","'[");
  this.data=this.data.replaceAll("]","]'");
  
  this.data=format(this.data, { language: 'mysql' });
  
  this.data=this.data.replaceAll("'[","[");
  this.data=this.data.replaceAll("]'","]");
  

  }

}
