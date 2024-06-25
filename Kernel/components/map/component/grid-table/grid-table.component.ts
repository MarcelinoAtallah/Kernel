import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import CircularJSON from 'circular-json';
import { DataService } from 'src/app/Kernel/data.service';


@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.css']
})
export class GridTableComponent implements OnInit {
   //displayedColumns = ['position', 'name', 'weight', 'symbol'];
   displayedColumns = ['checkbox','name'];
   @Input() dataSource: any;
   @ViewChild(MatPaginator) paginator: MatPaginator;
 
  // dataSource = ELEMENT_DATA;
   constructor(private dataService: DataService) { }
 
   ngOnInit(): void {
     this.dataSource = new MatTableDataSource<any>(this.dataSource);
 
   }
   ngAfterViewInit(): void {
     this.dataSource.paginator = this.paginator;
   }
   applyFilter(filterValue: string) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
 
   }
 //   openLayerControl(e: any) {
 //    // this.dataSource.filter = filterValue.trim().toLowerCase();
 // console.log('e>>>>>>>>>>',e)
 // console.log('e222>>>>>>>>>>',e.target.innerText)
 // localStorage.setItem("ControlLayers",e.target.innerText);
 // $("#openLayerControl").click();
 
 //   }
 
   handleCheckboxClick(event: MatCheckboxChange, element: any) {
     //event.stopPropagation(); // Prevents the row click event from firing
      console.log('Checkbox clicked:', element);
        console.log('Checkbox clicked:', element.name);
        console.log('event:', event);
 
 
     const serialized = CircularJSON.stringify(element);
    // localStorage.setItem("ControlLayers",serialized);
     //this.dataService.setData(serialized);
     this.dataService.setData(element);
 
     $("#openLayerControl").click();
   }

}
export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

