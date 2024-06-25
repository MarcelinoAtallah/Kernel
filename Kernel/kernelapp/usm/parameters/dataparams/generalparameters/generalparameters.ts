import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-generalparameters',
  templateUrl: './generalparameters.html',
  styleUrls: ['./generalparameters.css']
})
export class GeneralparametersComponent implements OnInit {

  public getPaysInstitutionnel: any;
  public getDefaultCurrency: any;
  public getDefaultLanguage: any;
  public getElementStructureAppearance: any;

  generalParametersForm = new FormGroup({
    paysInstitutionnel: new FormControl(''),
    mO: new FormControl(''),
    defaultCurrency: new FormControl(''),
    defaultLanguagev: new FormControl(''),
    elementStructureAppearance: new FormControl(''),
    FUMISL: new FormControl(''),
    FUMIECU: new FormControl(''),
    PSU: new FormControl(''),
    FUMIRU: new FormControl(''),
    FUMIBDL: new FormControl(''),
    FUMINDT: new FormControl('')
  });


  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
  }

}
