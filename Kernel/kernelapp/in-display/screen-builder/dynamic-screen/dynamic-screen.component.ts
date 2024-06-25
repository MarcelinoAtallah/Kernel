import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-dynamic-screen',
  templateUrl: './dynamic-screen.component.html',
  styleUrls: ['./dynamic-screen.component.css']
})
export class DynamicScreenComponent implements OnInit {

  public menuVariable: any;

  public objectId:any;

  constructor(private _Activatedroute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {
      this.menuVariable = params.get('menuVariable');
    });
    
    this.http.get<any>(GlobalConstants.getScreenPreviewData+this.menuVariable, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => { 
    });    
  }

}
