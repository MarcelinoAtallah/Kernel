import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-file-definition',
  templateUrl: './file-definition.component.html',
  styleUrls: ['./file-definition.component.css']
})
export class FileDefinitionComponent implements OnInit {
  public agDefinition: AgColumns[] = [];
  public agColumnsJson: any;

  public getDefinitionApi: any = GlobalConstants.fetchCDSdefinitionApi;
  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.agColumnsJson = [
    { headerName: 'id', field: 'id',width: '25px'},
    { headerName: 'Name', field: 'name',width: '25px',isLink: true,link: '/cds/cdsDocs/form/update/',linkParameters: 'id',},
    { headerName: 'Type', field: 'docType',width: '25px'},

    // { headerName: 'Created By', field: 'CreatedBy',width: '25px'}
  ];
  this.agDefinition.push(this.agColumnsJson);

  this.eventEmitterService.onAddClick.subscribe(() => {
    this.commonFunctions.navigateToPage("/cds/cdsDocs/form/create/-1");
  });
  }


}
