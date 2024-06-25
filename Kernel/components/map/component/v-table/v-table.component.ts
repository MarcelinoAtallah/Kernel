import { Component, EventEmitter, Input, OnInit, Output,DoCheck,OnChanges, SimpleChange  } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-v-table',
  templateUrl: './v-table.component.html',
  styleUrls: ['./v-table.component.css']
})
export class VTableComponent implements OnInit {
  @Input() tableColumns: string[]=[] ;
  @Input() tablerow: Number ;
  @Input()tableData: any[] =[];

  @Output() clickedRow = new EventEmitter<{row:any}>();


  config: any;
  filteredData: any[] = this.tableData;
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: string = 'desc';

  pageSize!: number; // Number of items per page
  currentPage: number = 1; // Current page number
  totalPages: number = 0; // Total number of pages

  dataSource: any;
  searchText = '';
  constructor(private route: ActivatedRoute, private router: Router,private cdr: ChangeDetectorRef,
    private ngZone: NgZone) {
  

  }


  // ngOnInit(): void {
   
  //   this.config = {
  //     currentPage: 1,
  //     itemsPerPage: 10
  //   };

  //   for(let i=0;i<this.tableData.length;i++){
  //     this.tablerow=this.tableData[i];
  //  this.tableData.unshift(this.tablerow);
  //   }
  //   this.filteredData=this.tableData;
  //   //console.log("tableData---------",this.tableData);
  //   //console.log("filteredData---------",this.filteredData);
  //   // Update pagination when the tableData changes
  //   this.pageSize = this.tableData.length;
  //   this.updatePagination();
  // }

  //   ngOnChanges(changes: any) {
      
  //     //console.log("changes-------------",changes);
  //     for(let i=0;i<this.tableData.length;i++){
  //       this.tablerow=this.tableData[i];
  //    this.tableData.unshift(this.tablerow);
  //     }
  //   this.filteredData=this.tableData;
  //   //console.log("tableData---------",this.tableData);
  //   //console.log("filteredData---------",this.filteredData);
  //   $('#firstpage').click();
  //   this.firstpage();

  //   if (changes.tableData && changes.tableData.currentValue) {
  //     // Update pagination when the tableData changes
  //  this.pageSize= this.config.totalItems = this.tableData.length;
  //   //console.log("this.pageSize--------",this.pageSize)
  //   }
  //   this.cdr.detectChanges();
 
  //   }


  ngOnInit(): void {
 
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
    
  //  this.tableData.unshift(this.tablerow);
  
  //console.log("filteredData1111---------",this.filteredData);

   for(let i=0;i<this.tableData.length;i++){
    this.firstpage();
    this.filteredData.unshift(this.tableData[i]);
    //console.log("this.tableData[i]---------",this.tableData[i]);
   }
    // this.filteredData=this.tableData;
    // //console.log("tablerow111---------",this.tablerow);
    //console.log("tableData111111---------",this.tableData);
    // Update pagination when the tableData changes
    this.pageSize = this.tableData.length;
    this.updatePagination();
  }

    ngOnChanges(changes: any) {
      
      //console.log("changes222-------------",changes);
    //   // //console.log("tablerow22222---------",this.tablerow);
    //   this.tableData=[...this.filteredData,this.tableData]
    //   // this.tableData.unshift(this.tablerow);
    // // this.filteredData=this.tableData;
    // for(let i=0;i<this.tableData.length;i++){
    //   this.firstpage();

    //   this.filteredData.unshift(this.tableData[i]);
    //  }
    //console.log("tableData22222---------",this.tableData);
    //console.log("filteredData---------",this.filteredData);
   
    this.firstpage();

    if (changes.tableData && changes.tableData.currentValue) {
      // Update pagination when the tableData changes
   this.pageSize= this.config.totalItems = this.tableData.length;
    //console.log("this.pageSize--------",this.pageSize)
    }
  }

 

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.config.itemsPerPage;
    let endIndex = startIndex + this.config.itemsPerPage;
    //console.log("startIndex-------",startIndex);
    //console.log("endIndex--------",endIndex);

    
    if (endIndex > this.tableData.length) {
      endIndex = this.tableData.length;
    }
  
    this.filteredData = this.tableData.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.tableData.length / this.config.itemsPerPage);
    //console.log("endIndex--------",endIndex);
    //console.log("endIndex--------",endIndex);

  }
  

  applySearch() {
//  this.tableData.pop();
//  //console.log("tableData----------",this.tableData);
    this.filteredData = this.tableData.filter((item) => {
      for (const column of this.tableColumns) {
        //console.log("search--------",this.searchTerm.toLowerCase());
        //console.log("item[column].toString()--------",item[column].toString());
        if (item[column].toString().toLowerCase().includes(this.searchTerm.toLowerCase())) {
         

          return true;
        }
      }
      return false;
    });
    if(this.searchTerm !=''){
      this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    }
  }




  applySort(columnName: string) {
    if (columnName === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'desc';
    }

    this.filteredData = this.filteredData.slice().sort((a, b) => {
      const direction = this.sortDirection === 'desc' ? 1 : -1;
      return (a[this.sortColumn] < b[this.sortColumn] ? -1 : 1) * direction;
    });
  }

  rowClicked(row:any){
    //console.log('row',row);
    this.clickedRow.emit({row});

  }
  pageChange(newPage: any) {
    //console.log("newpageeee----------",newPage);
     this.currentPage=newPage;
        this.router.navigate([""], { queryParams: { page: newPage } });
    
        this.updatePagination();
      }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    return this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  firstpage(){
 
    //console.log("newpageeee----------",this.currentPage);
     this.currentPage=1;
        this.router.navigate([""], { queryParams: { page: this.currentPage } });
    
        this.updatePagination();
  }

  lastpage(){
     this.currentPage=(this.tableData.length)/10;
     this.currentPage= Math.ceil(this.currentPage);
    //console.log("newpageeee----------",this.currentPage);

        this.router.navigate([""], { queryParams: { page: this.currentPage } });
    
        this.updatePagination();
  }

  previouspage(){
     this.currentPage=this.currentPage-1;
    //console.log("newpageeee----------",this.currentPage);

        this.router.navigate([""], { queryParams: { page: this.currentPage } });
    
        this.updatePagination();
  }


  nextpage() {
     this.currentPage=this.currentPage+1;
    //console.log("newpageeee----------",this.currentPage);

        this.router.navigate([""], { queryParams: { page: this.currentPage } });
    
        this.updatePagination();
      }
}

