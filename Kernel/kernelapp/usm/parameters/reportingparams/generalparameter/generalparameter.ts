import { HttpClient } from '@angular/common/http';
import { Component  } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-generalparameter',
  templateUrl: './generalparameter.html',
  styleUrls: ['./generalparameter.css']
})
export class Generalparameter   {


  generalParameterForm = new FormGroup({
    displayLookupVariable: new FormControl(''),
    displayIcon: new FormControl(''),
  });


  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
  }

}
