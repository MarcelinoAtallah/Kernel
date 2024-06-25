import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../../Services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  loading$ = this.loaderService.loading$;
  constructor(public loaderService: LoaderService) { }
 
  ngOnInit(): void {}
  

}
