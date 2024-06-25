import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-v-report-generation',
  templateUrl: './v-report-generation.component.html',
  styleUrls: ['./v-report-generation.component.css']
})
export class VReportGenerationComponent implements OnInit {

  public agGridSelectedNodes:any;

  constructor(private eventEmitterService: EventEmitterService,
      public commonFunctions: CommonFunctions,private http: HttpClient,
      public informationservice: InformationService) { }

  ngOnInit(): void {
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    
  }

}
