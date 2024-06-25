import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-file-definition-form',
  templateUrl: './file-definition-form.component.html',
  styleUrls: ['./file-definition-form.component.css']
})
export class FileDefinitionFormComponent implements OnInit {


  public agDef: AgColumns[] = [];
  public agColumnsJson: any;
  public radioData: any;

  public getProjectApi: any = GlobalConstants.fetchMappingApi;

  public agGridSelectedNodes: any = '';


  @ViewChild('addContent') addContent: any;
  @ViewChild('updateContent') updateContent: any;

  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {

    this.radioData = [
      { value: '1', name: 'Flat' },
      { value: '2', name: 'Excel' },
    ];
  }

DefinitionForm = new FormGroup({
                             Name: new FormControl(''),
                             Type: new FormControl('')
   });



    // Submit Form Action
    submitForm()
    {}

}
