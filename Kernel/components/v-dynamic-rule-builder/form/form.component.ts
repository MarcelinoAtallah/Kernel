import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';
import { AdvancedFormComponent } from './advanced-form/advanced-form.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'dynamic-builder-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class DynamicBuilderFormComponent implements OnInit {

  public jsonEmpty: any[] = [];

  //Variables for API Calls
  public getAllColumns: string = '';
  public getAllColumns1: string = '';
  public getAllFieldSets: string = '';
  public getAllRules: string = '';
  public getAllQbeQueries: string = '';
  public getAllColumnsByTable: string = '';
  public getAllProcAndPack: string = '';
  public tabTables: string = '';
  public between = '';
  public TypeOfFormFields: any;
  public advancedConditionsAr: any[];
  public advancedRuleData: any = '';
  public advancedResult: any;
  public advancedConditionsYesOrNo = 0;
  public ChooseAFieldButtonFirst = false;
  public ChooseAFieldButtonSecond = false;
  public step4_1_1: any;
  public step4_0: any;
  public step2_9: any;
  public step4_1: any;
  public columnTypeCode: any;

  //Variables needed for certain controls
  public actionType: string = '';
  public readOnly: boolean = false;
  public userId: string = localStorage.getItem("LogeduserId");
  //public userId: string = this.informationservice.getLogeduserId();

  //Variables that loads dropdowns
  public actionDecisions: any[];
  public actionConditions: any[];
  public testingListOfButtons: any = [];

  public ActionType = [
    { id: 1, name: 'SaveNew' },
    { id: 2, name: 'Update' }
  ]

  public ruleAction = [
    { id: 1, name: 'On Change' },
    { id: 2, name: 'On Load' },
    { id: 3, name: 'On Before Save' },
    { id: 4, name: 'On After Save' },
    { id: 5, name: 'Where Condition' }
  ];

  public conditions = [
    { id: 1, name: '=' },
    { id: 2, name: '!=' },
    { id: 8, name: 'Fill Into' },
    { id: 3, name: '>' },
    { id: 4, name: '<' },
    { id: 6, name: '<=' },
    { id: 7, name: '>=' },
    { id: 5, name: 'between' },
    { id: 9, name: '> Sysdate' },
    { id: 10, name: '< Sysdate' },
    { id: 11, name: '>= Sysdate' },
    { id: 12, name: '>= Sysdate' },
    { id: 13, name: 'Get Sysdate' },
    { id: 14, name: 'Field Value' },
    { id: 15, name: 'Include' },
    { id: 16, name: '!Include' }
  ];

  public operations = [
    { id: 1, name: '=' },
    { id: 6, name: '!=' },
    { id: 2, name: '>' },
    { id: 3, name: '<' },
    { id: 4, name: '<=' },
    { id: 5, name: '>=' },
  ];

  public dateTypes = [
    { id: 1, name: 'Date' },
    { id: 2, name: 'Field' },
    { id: 3, name: 'Value' },
    { id: 4, name: 'Field Value' }
  ];

  public TypeOfDifference = [
    { id: 1, name: 'Year' },
    { id: 2, name: 'Month' },
    { id: 3, name: 'Day' }
  ];

  public TypeOfFillInto = [
    { id: 1, name: 'Manually' },
    { id: 2, name: 'From another Field' },
    { id: 3, name: 'Get Sysdate' }
  ];

  public executionAction = [
    { id: 1, name: 'Show Field' },
    { id: 2, name: 'Hide Field' },
    { id: 6, name: 'Show FieldSet' },
    { id: 7, name: 'Hide FieldSet' },
    { id: 3, name: 'Execute Query' },
    { id: 4, name: 'Required' },
    { id: 5, name: 'Optional' },
    { id: 8, name: 'Execute Rule Business' },
    { id: 9, name: 'Alert' },
    { id: 10, name: 'Read Only' },
    { id: 11, name: 'Remove Read Only' },
    { id: 12, name: 'Rename Field' },
    { id: 13, name: 'Hide Button' },
    { id: 14, name: 'Show Button' },
    { id: 15, name: 'Splash' }
  ];

  public operators = [
    { id: 1, name: 'And' },
    { id: 2, name: 'Or' },
    { id: 3, name: 'No Operator' }
  ];

  public minusSysdate = [
    { id: 1, name: 'True' },
    { id: 2, name: 'False' },
  ];

  public plusMinusOperator = [
    { id: 1, name: '+' },
    { id: 2, name: '-' },
  ];
  public plusMinusoptions = [
    { id: 1, name: 'Value' },
    { id: 2, name: 'Sysdate' },
    { id: 3, name: 'Execute Query' }
  ];
  public valueSource = [
    { id: 1, name: 'Value' },
    { id: 2, name: 'Execute Query' },
    { id: 3, name: 'Alert' },
    { id: 4, name: 'Call Procedure' },
    { id: 5, name: 'Call Rest API' },
    { id: 6, name: 'field Value' }

  ];

  public onloadOptions = [
    { id: 1, name: 'Execute Query With Condition' },
    { id: 2, name: 'Execute Query Without Condition' },
    { id: 3, name: 'Normal Field Condition' }
  ];

  public selectedRuleAction: string = '';
  public AllFieldsID: any = [];
  public conditionsBckp = this.conditions;
  public valueSourcebckp = this.valueSource;

  form = new FormGroup({
    ruleDescription: new FormControl(''),
    orderNo: new FormControl(''),
    step_0: new FormControl(''),
    isExcluded: new FormControl(''),
    hasAdvancedConditions: new FormControl(''),
    actionType: new FormControl(''),
  });

  form_onChangeGroup = new FormGroup({
    step_1: new FormControl(''),
    step_2: new FormControl(''),
    step_2_0: new FormControl(''),
    step_2_0_0: new FormControl(''),
    step_2_0_1: new FormControl(''),
    step_2_0_2: new FormControl(''),
    step_2_0_3: new FormControl(''),
    step_2_1: new FormControl(''),
    step_2_2: new FormControl(''),
    step_2_3: new FormControl(''),
    step_2_4: new FormControl(''),
    step_2_5: new FormControl(''),
    step_2_6: new FormControl(''),
    step_2_8: new FormControl(''),
    step_2_1_1: new FormControl(''),
    step_2_1_0: new FormControl(''),
    step_2_1_2: new FormControl(''),
    step_3: new FormControl(''),
    step_3_1: new FormControl(''),
    step_3_2: new FormControl(''),
    step_3_2_hidden: new FormControl(''),
    step_4: new FormControl(''),
    step_4_1: new FormControl(''),
    step_6: new FormControl(''),
    step_4_2: new FormControl(''),
    step_4_2_0: new FormControl(''),
    step_4_0: new FormControl(''),
    step_4_0_1: new FormControl(''),
    step_4_0_0: new FormControl(''),
    step_4_3: new FormControl(''),
    step_4_3_0: new FormControl(''),
    step_2_7: new FormControl(''),
    step_2_9: new FormControl(''),
    step_3_0: new FormControl(''),
    step_3_0_1: new FormControl('')


  });



  form_onBeforeSave = new FormGroup({
    step_1: new FormControl(''),
    step_2: new FormControl(''),
    step_3: new FormControl(''),
    step_4: new FormControl(''),
    step_5: new FormControl(''),
    step_6: new FormControl(''),
    step_7: new FormControl(''),
    step_8: new FormControl(''),
  });

  form_onAfterSave = new FormGroup({
    step_1: new FormControl(''),
    step_2: new FormControl(''),
    step_2_1: new FormControl(''),
    step_3: new FormControl(''),
    step_3_1: new FormControl(''),
    step_4: new FormControl(''),
    step_4_1: new FormControl(''),
    step_4_2: new FormControl(''),
    step_4_3: new FormControl(''),
    step_4_4: new FormControl(''),
    step_4_5: new FormControl(''),
    step_4_6: new FormControl(''),
    step_4_7: new FormControl(''),
    // step_4_8
    // step_4_9
  });

  form_onLoadGroup = new FormGroup({
    step_00: new FormControl(''),

  });

  form_onLoadGroup_3 = new FormGroup({
    step_1_0: new FormControl(''),
    step_1_0_1: new FormControl(''),
    step_1_0_2: new FormControl(''),

    step_1: new FormControl(''),
    step_2: new FormControl(''),
    step_3: new FormControl(''),
    step_3_1: new FormControl(''),
    step_3_2: new FormControl(''),
    step_3_2_hidden: new FormControl(''),
    step_4: new FormControl(''),
    step_4_1: new FormControl(''),
    step_4_2: new FormControl(''),
    step_4_2_0: new FormControl(''),
    step_4_0: new FormControl(''),
    step_4_0_1: new FormControl(''),
    step_6: new FormControl(''),
    step_5: new FormControl(''),
    step_5_1: new FormControl(''),
    step_5_2: new FormControl(''),
  })

  form_whereCondition = new FormGroup({
    step_0: new FormControl(''),
    step_1: new FormControl(''),
    step_2: new FormControl(''),
    step_3: new FormControl(''),
    step_3_1: new FormControl(''),
    step_3_2: new FormControl(''),
    step_3_2_hidden: new FormControl(''),
  });
  getWhereCond: any;

  constructor(@Inject(MAT_DIALOG_DATA) public lookupData: any,
    private dialogRef: MatDialogRef<DynamicBuilderFormComponent>,
    private http: HttpClient,
    public commonFunctions: CommonFunctions,
    public datepipe: DatePipe,
    private refreshService: RefreshDialogService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public informationservice: InformationService) { }

  onSearchSubmit(getWhereCond: any) {
    this.getWhereCond = getWhereCond.data;
  }


  async ngOnInit() {
    this.ChooseAFieldButtonFirst = false;
    this.ChooseAFieldButtonSecond = false;
    this.AllFieldsID = [];
    let includedIDs1 = [1, 2, 3, 4, 6, 7, 8];
    if (this.lookupData[0].drbPlace == "field") {
      let data = this.ruleAction.filter((el: any) => {
        return el.id === 1;
      });
      this.ruleAction = data;
    } else if (this.lookupData[0].drbPlace == "tab") {
      let data = this.ruleAction.filter((el: any) => {
        return el.id !== 1;
      });
      this.ruleAction = data;

      let dataCondition = this.conditions.filter((el: any) => {
        return includedIDs1.includes(el.id);
      });
      this.conditions = dataCondition;
    }

    this.getAllColumns = GlobalConstants.getColumnsApi + this.lookupData[0].objectId;
    this.getAllColumns1 = GlobalConstants.getColumnsApi + this.lookupData[0].objectId;
    this.getAllFieldSets = GlobalConstants.getAllFieldSetsApi + this.lookupData[0].objectId;
    this.getAllRules = GlobalConstants.getAllRulesApi + this.lookupData[0].objectId + "/" + this.lookupData[0].columnId;
    this.getAllQbeQueries = GlobalConstants.getSourceQueryApi;
    this.tabTables = GlobalConstants.getTabTables2 + this.lookupData[0].objectId;
    this.getAllProcAndPack = GlobalConstants.getAllProcAndPack;


    this.actionType = this.lookupData[0].actionType;
    if (this.actionType == "saveNew") {
      setTimeout(() => {
        this.hideAllRules_saveNew();
      }, 200);
    }

    if (this.actionType == "update") {
      await this.loadData();
      //jp
      // After everything has sucessfully been loaded then control the hide/show on needed fields
      setTimeout(() => {
        this.showAllRules();
        this.actionSelection("step_1", this.selectedRuleAction);
        this.actionSelection("step_2", this.selectedRuleAction);
        // this.actionSelection("step_2_0", this.selectedRuleAction);
        this.actionSelection("step_3", this.selectedRuleAction);
        this.actionSelection("step_4", this.selectedRuleAction);
        this.actionSelection("step_8", this.selectedRuleAction);
      }, 200);
    }
  }

  async loadData_onChangeGroup(data: any) {
    let ruleData = JSON.parse(data.ruleData);

    for (let i = 0; i < ruleData.length; i++) {
      if (ruleData[i].step == 44) {
        let step4Val = this.form_onChangeGroup.controls["step_4"]?.value;
        if (step4Val == 1 || step4Val == 2 || step4Val == 4 || step4Val == 5 || step4Val == 10 || step4Val == 11 || step4Val == 12 || step4Val == 13 || step4Val == 14) {
          this.step4_1_1 = ruleData[i].data;
          this.form_onChangeGroup.controls["step_4_1"].setValue(ruleData[i].data);


        } else if (step4Val == 7 || step4Val == 6) {
          this.step4_0 = ruleData[i].data;
        } else if (step4Val == 3) {
          this.step4_1 = ruleData[i].data;
          // this.form_onChangeGroup.controls["step_4_1"].setValue(ruleData[i].data);
        } else if (step4Val == 8) {
          this.form_onChangeGroup.controls["step_4_0_1"].setValue(ruleData[i].data);
        } else if (step4Val == 9) {
          this.form_onChangeGroup.controls["step_4_0_0"].setValue(ruleData[i].data);
        }
      } else if (ruleData[i].step == 6) {
        this.form_onChangeGroup.controls["step_6"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 42) {
        this.form_onChangeGroup.controls["step_4_2_0"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 2) {
        this.form_onChangeGroup.controls["step_2"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 1) {
        this.form_onChangeGroup.controls["step_1"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 33) {
        let step3Val = this.form_onChangeGroup.controls["step_3"]?.value;
        if (step3Val == 1) {
          this.form_onChangeGroup.controls["step_3_1"].setValue(ruleData[i].data);
        } else if (step3Val == 2) {
          this.form_onChangeGroup.controls["step_3_2"].setValue(ruleData[i].data);
        } else if (step3Val == 3) {
          this.form_onChangeGroup.controls["step_3_1"].setValue(ruleData[i].data);
        } else {
          this.form_onChangeGroup.controls["step_3_1"].setValue(ruleData[i].data);
        }
      } else if (ruleData[i].step == 333) {

        this.form_onChangeGroup.controls["step_3_2_hidden"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 21) {
        let step2Val = this.form_onChangeGroup.controls["step_2"]?.value;
        let sysdate = new Date();
        let mySysdate = this.datepipe.transform(sysdate, 'yyyy-MM-dd');
        // sysdate
        if (step2Val == 9 || step2Val == 10 || step2Val == 11 || step2Val == 12 || step2Val == 13) {
          this.form_onChangeGroup.controls["step_2_1"].setValue(mySysdate);
        }
        else {
          // else of sysdate
          this.form_onChangeGroup.controls["step_2_1"].setValue(ruleData[i].data);
        }
      } else if (ruleData[i].step == 210) {
        this.form_onChangeGroup.controls["step_2_1_0"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 211) {
        this.form_onChangeGroup.controls["step_2_1_1"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 212) {
        this.form_onChangeGroup.controls["step_2_1_2"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 20) {
        this.form_onChangeGroup.controls["step_2_0"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 200) {
        this.form_onChangeGroup.controls["step_2_0_0"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 201) {
        this.form_onChangeGroup.controls["step_2_0_1"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 202) {
        this.form_onChangeGroup.controls["step_2_0_2"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 203) {
        this.form_onChangeGroup.controls["step_2_0_3"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 22) {
        this.form_onChangeGroup.controls["step_2_2"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 23) {
        this.form_onChangeGroup.controls["step_2_3"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 24) {
        this.form_onChangeGroup.controls["step_2_4"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 25) {
        this.form_onChangeGroup.controls["step_2_5"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 26) {
        this.form_onChangeGroup.controls["step_2_6"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 28) {
        this.form_onChangeGroup.controls["step_2_8"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 43) {
        this.form_onChangeGroup.controls["step_4_3"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 430) {
        this.form_onChangeGroup.controls["step_4_3_0"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 29) {
        this.step2_9 = ruleData[i].data;
        this.form_onChangeGroup.controls["step_2_9"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 30) {
        this.form_onChangeGroup.controls["step_3_0"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 301) {
        this.form_onChangeGroup.controls["step_3_0_1"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 31) {
        this.form_onChangeGroup.controls["step_3_1"].setValue(ruleData[i].data);
      } else {
        if (ruleData[i].data != "" && ruleData[i].step != "") {
          this.form_onChangeGroup.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
        }
      }

      // if (i == ruleData.length - 1) {
      //   setTimeout(() => {
      //     let stepValue: string = this.form_onChangeGroup.controls['step_1']?.value;
      //     this.filterConditionBasedOnField(stepValue);
      //   }, 400)
      // }
    }
  }

  showOrHideFields(Form: String, AllSteps: any, TypeOfFunction: String) {
    if (TypeOfFunction == "hide") {
      for (let i = 0; i < AllSteps.length; i++) {
        $("." + Form + " ." + AllSteps[i]).hide();
      }
    }
    else if (TypeOfFunction == "show") {
      for (let i = 0; i < AllSteps.length; i++) {
        $("." + Form + " ." + AllSteps[i]).show();
      }
    }

  }

  async loadData_onLoadGroup(data: any) {
    let ruleData = JSON.parse(data.ruleData);
    this.form_onLoadGroup.controls["step_00"].setValue(ruleData[0].data);
    let action = this.form_onLoadGroup.controls["step_00"]?.value;
    if (action == 3) {
      for (let i = 1; i < ruleData.length; i++) {
        if (ruleData[i].step == 44) {
          let step4Val = this.form_onLoadGroup_3.controls["step_4"]?.value;
          if (step4Val == 1 || step4Val == 2 || step4Val == 4 || step4Val == 5 || step4Val == 10 || step4Val == 11 || step4Val == 12 || step4Val == 13 || step4Val == 14) {
            this.form_onLoadGroup_3.controls["step_4_1"].setValue(ruleData[i].data);
          } else if (step4Val == 7 || step4Val == 6) {
            this.form_onLoadGroup_3.controls["step_4_0"].setValue(ruleData[i].data);
          } else if (step4Val == 3) {
            this.form_onLoadGroup_3.controls["step_4_2"].setValue(ruleData[i].data);
          } else if (step4Val == 8) {
            this.form_onLoadGroup_3.controls["step_4_0_1"].setValue(ruleData[i].data);
          } else if (ruleData[i].step == 6) {
            this.form_onLoadGroup_3.controls["step_6"].setValue(ruleData[i].data);
          }
        } else if (ruleData[i].step == 42) {
          this.form_onLoadGroup_3.controls["step_4_2_0"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 33) {
          let step3Val = this.form_onLoadGroup_3.controls["step_3"]?.value;
          if (step3Val == 1) {
            this.form_onLoadGroup_3.controls["step_3_1"].setValue(ruleData[i].data);
          }
          if (step3Val == 2) {
            this.form_onLoadGroup_3.controls["step_3_2"].setValue(ruleData[i].data);
          }
        } else if (ruleData[i].step == 333) {
          this.form_onLoadGroup_3.controls["step_3_2_hidden"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 5) {
          this.form_onLoadGroup_3.controls["step_5"].setValue(ruleData[i].data);
        }
        else if (ruleData[i].step == 51) {
          this.form_onLoadGroup_3.controls["step_5_1"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 52) {
          this.form_onLoadGroup_3.controls["step_5_2"].setValue(ruleData[i].data);
        }
        // else if (ruleData[i].step == 29) {
        //   this.form_onLoadGroup_3.controls["step_2_9"].setValue(ruleData[i].data);
        // } else if (ruleData[i].step == 30) {
        //   this.form_onLoadGroup_3.controls["step_3_0"].setValue(ruleData[i].data);
        // } else if (ruleData[i].step == 301) {
        //   this.form_onLoadGroup_3.controls["step_3_0_1"].setValue(ruleData[i].data);
        // } 
        else {
          this.form_onLoadGroup_3.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
        }
      }
    } else if (action == 1) {
      for (let i = 1; i < ruleData.length; i++) {
        if (ruleData[i].step == 10) {
          this.form_onLoadGroup_3.controls["step_1_0"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 101) {
          this.form_onLoadGroup_3.controls["step_1_0_1"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 41) {
          this.form_onLoadGroup_3.controls["step_4_1"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 102) {
          this.form_onLoadGroup_3.controls["step_1_0_2"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 31) {
          this.form_onLoadGroup_3.controls["step_3_1"].setValue(ruleData[i].data);
        }
        else if (ruleData[i].step == 2) {
          this.form_onLoadGroup_3.controls["step_2"].setValue(ruleData[i].data);
        } else {
          this.form_onLoadGroup_3.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
        }
      }
    } else {
      for (let i = 1; i < ruleData.length; i++) {
        if (ruleData[i].step == 4) {
          this.form_onLoadGroup_3.controls["step_4"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 44) {
          let step4Val = this.form_onLoadGroup_3.controls["step_4"]?.value;
          if (step4Val == 1 || step4Val == 2 || step4Val == 4 || step4Val == 5 || step4Val == 10 || step4Val == 11 || step4Val == 12 || step4Val == 13 || step4Val == 14) {
            this.form_onLoadGroup_3.controls["step_4_1"].setValue(ruleData[i].data);
          } else if (step4Val == 7 || step4Val == 6) {
            this.form_onLoadGroup_3.controls["step_4_0"].setValue(ruleData[i].data);
          } else if (step4Val == 3) {
            this.form_onLoadGroup_3.controls["step_4_2"].setValue(ruleData[i].data);
          } else if (step4Val == 8) {
            this.form_onLoadGroup_3.controls["step_4_0_1"].setValue(ruleData[i].data);
          } else if (ruleData[i].step == 6) {
            this.form_onLoadGroup_3.controls["step_6"].setValue(ruleData[i].data);
          }
        } else if (ruleData[i].step == 42) {
          this.form_onLoadGroup_3.controls["step_4_2_0"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 33) {
          let step3Val = this.form_onLoadGroup_3.controls["step_3"]?.value;
          if (step3Val == 1) {
            this.form_onLoadGroup_3.controls["step_3_1"].setValue(ruleData[i].data);
          }
          if (step3Val == 2) {
            this.form_onLoadGroup_3.controls["step_3_2"].setValue(ruleData[i].data);
          }
        } else if (ruleData[i].step == 333) {
          this.form_onLoadGroup_3.controls["step_3_2_hidden"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 5) {
          this.form_onLoadGroup_3.controls["step_5"].setValue(ruleData[i].data);
        }
        else if (ruleData[i].step == 51) {
          this.form_onLoadGroup_3.controls["step_5_1"].setValue(ruleData[i].data);
        } else if (ruleData[i].step == 52) {
          this.form_onLoadGroup_3.controls["step_5_2"].setValue(ruleData[i].data);
        }
        else {
          //  this.form_onLoadGroup_3.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
        }

      }
      // for (let i = 1; i < ruleData.length; i++) {
      // this.form_onLoadGroup_3.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
      // }
    }
  }

  async loadData_onBeforeSave(data: any) {
    let ruleData = JSON.parse(data.ruleData);
    for (let i = 0; i < ruleData.length; i++) {

      if (ruleData[i].step == 1) {
        this.form_onBeforeSave.controls["step_1"].setValue(ruleData[i].data);
        this.commonFunctions.handleLookupElem("step_1" + ruleData[i].step, this.form_onBeforeSave);
      } else if (ruleData[i].step == 0) {
      } else {
        this.form_onBeforeSave.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
      }
    }
  }

  async loadData_whereCondition(data: any) {
    let ruleData = JSON.parse(data.ruleData);
    this.form_whereCondition.controls["step_0"].setValue(ruleData[0].data);
    this.getAllColumnsByTable = GlobalConstants.GetColVal + this.form_whereCondition.controls['step_0']?.value;
    for (let i = 1; i < ruleData.length; i++) {
      if (ruleData[i].step == 33) {
        let step3Val = this.form_whereCondition.controls["step_3"]?.value;
        if (step3Val == 1) {
          this.form_whereCondition.controls["step_3_1"].setValue(ruleData[i].data);
        }
        if (step3Val == 2) {
          this.form_whereCondition.controls["step_3_2"].setValue(ruleData[i].data);
        }
      } else if (ruleData[i].step == 333) {
        this.form_whereCondition.controls["step_3_2_hidden"].setValue(ruleData[i].data);
      } else {
        this.form_whereCondition.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
      }
    }
  }

  async loadData_onAfterSave(data: any) {
    let ruleData = JSON.parse(data.ruleData);
    for (let i = 0; i < ruleData.length; i++) {
      if (ruleData[i].step == 21) {
        this.form_onAfterSave.controls["step_4_6"].setValue(ruleData[i].data);
        this.commonFunctions.handleLookupElem("step_2_1", this.form_onAfterSave);
      } else if (ruleData[i].step == 2) {
        this.form_onAfterSave.controls["step_4_5"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 47) {
        this.form_onAfterSave.controls["step_4_7"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 41) {
        this.form_onAfterSave.controls["step_4_1"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 42) {
        this.form_onAfterSave.controls["step_4_2"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 43) {
        this.form_onAfterSave.controls["step_4_3"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 44) {
        this.form_onAfterSave.controls["step_4_4"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 45) {
        this.form_onAfterSave.controls["step_4_5"].setValue(ruleData[i].data);
      } else if (ruleData[i].step == 46) {
        this.form_onAfterSave.controls["step_4_6"].setValue(ruleData[i].data);
      }
      else {
        if (ruleData[i].step == 31) {
          this.form_onAfterSave.controls["step_3_1"].setValue(ruleData[i].data);
        } else {
          this.form_onAfterSave.controls["step_" + ruleData[i].step].setValue(ruleData[i].data);
        }
      }
    }
  }

  async loadData() {

    const getDBRInfoUrl = from(axios.get(GlobalConstants.getDBRInfo + this.lookupData[0].ruleId));
    const getDBRInfo = await lastValueFrom(getDBRInfoUrl);
    let res = getDBRInfo.data;
    this.selectedRuleAction = res[0].ruleAction;
    this.form.controls["orderNo"].setValue(res[0].orderNo);
    this.form.controls["ruleDescription"].setValue(res[0].ruleDescription);
    this.form.controls["actionType"].setValue(res[0].actionType);
    this.form.controls["isExcluded"].setValue(res[0].isExcluded);
    this.form.controls["step_0"].setValue(res[0].ruleAction);
    this.form.controls["hasAdvancedConditions"].setValue(res[0].hasAdvancedConditions);

    if (res[0].hasAdvancedConditions == 1) {
      $(".hasAdvancedConditions").show();
    } else {
      $(".hasAdvancedConditions").hide();
    }

    this.advancedRuleData = JSON.parse(res[0].ruleData);
    await this.filterValueSourceBasedRule(this.selectedRuleAction);

    if (res[0].ruleAction == 1) {
      // On Change Rule
      this.loadData_onChangeGroup(res[0]);
    } else if (res[0].ruleAction == 2) {
      // On Load Rule
      this.loadData_onLoadGroup(res[0]);
    } else if (res[0].ruleAction == 3) {
      // On Before Save
      this.loadData_onBeforeSave(res[0]);
    } else if (res[0].ruleAction == 4) {
      // On After Save
      this.loadData_onAfterSave(res[0]);
    } else if (res[0].ruleAction == 5) {
      // Where Condition Rule
      this.loadData_whereCondition(res[0]);
    }

  }

  hideAllRules_saveNew() {
    let onChangeGroup = ['step_1', 'step_2', 'step_2_1', 'step_2_0', 'step_2_0_0', 'step_2_0_1', 'step_2_0_2', 'step_2_0_3',
      'step_2_1_0', 'step_2_1_1', 'step_2_1_2', 'step_2_2', 'step_2_3', 'step_2_4', 'step_2_5',
      'step_2_6', 'step_2_8', 'step_3', 'step_3_1', 'step_3_2', 'step_4', 'step_4_1', 'step_4_0', 'step_4_0_1', 'step_4_0_0',
      'step_4_2', 'step_4_2_0', 'step_6', 'step_4_3', 'step_4_3_0', 'step_2_7', 'step_2_9', 'step_3_0', 'step_3_0_1'];
    this.showOrHideFields("onChangeGroup", onChangeGroup, "hide");

    let onLoadGroup = ['step_1_0', 'step_1_0_1', 'step_1_0_2', 'step_1', 'step_2', 'step_3', 'step_3_1', 'step_3_2', 'step_4', 'step_4_1', 'step_4_2',
      'step_4_2_0', 'step_4_0_1', 'step_6', 'step_5', 'step_5_1', 'step_5_2'];
    this.showOrHideFields("onLoadGroup .onLoadGroup_3", onLoadGroup, "hide");
    $(".onLoadGroup .onLoadGroup_3").hide();
    $(".onLoadGroup").hide();

    let onWhereCondition = ['step_0', 'step_1', 'step_2', 'step_3', 'step_3_1', 'step_3_2'];
    this.showOrHideFields("onWhereCondition", onWhereCondition, "hide");
    $(".onWhereCondition").hide();

    let onBeforeSave = ['step_1', 'step_2', 'step_3', 'step_4', 'step_5', 'step_6', 'step_7'];
    this.showOrHideFields("onBeforeSave", onBeforeSave, "hide");

    let onAfterSave = ['step_1', 'step_2', 'step_2_1', 'step_3', 'step_3_1', 'step_2_0', 'step_2_0_0',
      'step_2_0_1', 'step_2_0_2', 'step_2_1_0', 'step_2_1_1', 'step_2_1_2', 'step_4', 'step_4_1', 'step_4_2', 'step_4_3'
      , 'step_4_4', 'step_4_5', 'step_4_6', 'step_4_7'];
    this.showOrHideFields("onAfterSave", onAfterSave, "hide");

    $(".onBeforeSave").hide();
    $(".onAfterSave").hide();

  }

  hideAllRules_update() {
    let onChangeGroup = ['step_1', 'step_2', 'step_3', 'step_4'];
    this.showOrHideFields("onChangeGroup", onChangeGroup, "hide");
    $(".onChangeGroup").hide();


    let onLoadGroup = ['step_1', 'step_2', 'step_3'];
    this.showOrHideFields("onLoadGroup .onLoadGroup_3", onLoadGroup, "hide");

    $(".onLoadGroup .onLoadGroup_3").hide();
    $(".onLoadGroup").hide();

    let onWhereCondition = ['step_1', 'step_2', 'step_3', 'step_0'];
    this.showOrHideFields("onWhereCondition", onWhereCondition, "hide");
    $(".onWhereCondition").hide();

    let onBeforeSave = ['step_1', 'step_2', 'step_3', 'step_4', 'step_5', 'step_6', 'step_7'];
    this.showOrHideFields("onBeforeSave", onBeforeSave, "hide");
    $(".onBeforeSave").hide();

    let onAfterSave = ['step_1', 'step_2'];
    this.showOrHideFields("onAfterSave", onAfterSave, "hide");
    $(".onAfterSave").hide();
  }

  showAllRules() {
    this.hideAllRules_update();
    let rule = this.form.controls['step_0']?.value;
    if (rule == 1) {
      let step2Val = this.form_onChangeGroup.controls['step_2']?.value;
      $(".onLoadGroup").hide();
      $(".onBeforeSave").hide();
      $(".onLoadGroup .onLoadGroup_3").hide();

      let onChangeGroup = ['step_1', 'step_2', 'step_3', 'step_4'];
      this.showOrHideFields("onChangeGroup", onChangeGroup, "show");
      $(".onChangeGroup").show();


      // In case of Value Or Execute Query show step 4
      if (step2Val == 1 || step2Val == 2) {
      } else if (step2Val == 3 || step2Val == 4 || step2Val == 6 || step2Val == 7 || step2Val == 9 || step2Val == 10 || step2Val == 11 || step2Val == 12 || step2Val == 13) {
        $(".onChangeGroup .step_4").hide();
      } else if (step2Val == 8) {
        $(".onChangeGroup .step_3").hide();
        $(".onChangeGroup .step_4").hide();
      } else if (step2Val == 5) {
        $(".onChangeGroup .step_4").hide();
      }
    } else if (rule == 2) {
      $(".onChangeGroup").hide();
      $(".onBeforeSave").hide();
      $(".onLoadGroup").show();
      let val = this.form_onLoadGroup.controls["step_00"]?.value;
      if (val == 1) {
        $(".onLoadGroup .onLoadGroup_3").show();
        $(".onLoadGroup .onLoadGroup_3 .step_1").show();
        $(".onLoadGroup .onLoadGroup_3 .step_2").show();
        $(".onLoadGroup .onLoadGroup_3 .step_3").show();
        $(".onLoadGroup .onLoadGroup_3 .step_4").show();
      }
      if (val == 3) {
        $(".onLoadGroup .onLoadGroup_3").show();
        $(".onLoadGroup .onLoadGroup_3 .step_1").show();
        $(".onLoadGroup .onLoadGroup_3 .step_2").show();
        $(".onLoadGroup .onLoadGroup_3 .step_3").show();
        $(".onLoadGroup .onLoadGroup_3 .step_4").show();
      }
    } else if (rule == 3) {
      $(".onChangeGroup").hide();
      $(".onLoadGroup").hide();
      $(".onLoadGroup .onLoadGroup_3").hide();
      $(".onBeforeSave").show();
      $(".onBeforeSave .step_1").show();
      $(".onBeforeSave .step_2").show();
      $(".onBeforeSave .step_3").show();
      $(".onBeforeSave .step_4").show();
      $(".onBeforeSave .step_5").show();
      $(".onBeforeSave .step_6").show();
      $(".onBeforeSave .step_7").show();
    } else if (rule == 4) {
      $(".onAfterSave").show();
      $(".onAfterSave .step_1").show();
      $(".onAfterSave .step_2").show();
    } else if (rule == 5) {
      $(".onWhereCondition").show();
      $(".onWhereCondition .step_0").show();
      $(".onWhereCondition .step_1").show();
      $(".onWhereCondition .step_2").show();
      $(".onWhereCondition .step_3").show();
    }
  }

  handleAllRules() {
    let rule = this.form.controls['step_0']?.value;
    this.selectedRuleAction = rule;
    this.filterValueSourceBasedRule(this.selectedRuleAction);
    setTimeout(() => {
      this.hideAllRules_saveNew();
      if (rule == 1) {
        $(".onChangeGroup").show();
        if (this.advancedConditionsYesOrNo == 1) {
          // $(".onChangeGroup .step_1").show();
          this.onChangedSteps('step_1', '1');
        } else {
          $(".onChangeGroup .step_1").show();
        }
      } else if (rule == 2) {
        $(".onLoadGroup").show();
        $(".onLoadGroup .onLoadGroup_3").show();
        // $(".onLoadGroup .onLoadGroup_3 .step_00").show();
        $(".onWhereCondition").hide();
        if (this.advancedConditionsYesOrNo == 1) {
          this.onChangedSteps('step_00', '2');
        } else {
          $(".onLoadGroup .onLoadGroup_3 .step_00").show();
        }
      } else if (rule == 3) {
        $(".onBeforeSave").show();
        if (this.advancedConditionsYesOrNo == 1) {
          // $(".onChangeGroup .step_1").show();
          this.onChangedSteps('step_00', '3');
        } else {
          $(".onBeforeSave .step_1").show();
          $(".onBeforeSave .step_6").show();

        }
      } else if (rule == 4) {
        $(".onAfterSave").show();
        $(".onAfterSave .step_1").show();
      } else if (rule == 5) {
        $(".onWhereCondition").show();
        $(".onWhereCondition .step_0").show();
      }
    }, 200);
  }

  //GET ALL FIELDS
  GetFieldsToClear(ArrayToNotChanged: any, formGroup: any) {
    this.AllFieldsID = [];
    for (const field in formGroup.controls) {
      this.AllFieldsID.push(field);
    }
    let FieldsToClear: any = [];
    for (let i = 0; i < ArrayToNotChanged.length; i++) {
      if (i == 0) {
        for (let j = 0; j < this.AllFieldsID.length; j++) {
          if (ArrayToNotChanged[i] != this.AllFieldsID[j]) {
            FieldsToClear.push(this.AllFieldsID[j]);
          }
        }
      }
      else {
        for (let k = 0; k < FieldsToClear.length; k++) {
          if (ArrayToNotChanged[i] == FieldsToClear[k]) {
            FieldsToClear.splice(k, 1);
          }
        }
      }
    }
    return FieldsToClear;
  }


  //  Clear data from field when changing value of a related field  
  async emptyForm(form: any, notIncludedStep: any, formGroup: any) {
    // dont change those fields --> notIncludedStep
    // all fields to be changed form
    for (let i = 0; i < form.length; i++) {
      if (notIncludedStep.includes(form[i])) {
      }
      //Make fiedls empty under FormGroup onChange
      else if (formGroup == this.form_onChangeGroup) {
        formGroup.controls[form[i]].setValue('');
        if (form[i] == 'step_2_0') {
          this.dateTypes = [];
          this.cdr.detectChanges();

          this.dateTypes = [
            { id: 1, name: 'Date' },
            { id: 2, name: 'Field' },
            { id: 3, name: 'Value' },
            { id: 4, name: 'Field Value' },
            { id: 5, name: 'Execute Query' },
          ];
        }
        else if (form[i] == 'step_2') {
          this.conditions = [];
          this.cdr.detectChanges();
          this.filterConditionBasedOnField(form[i]);
        }

        else if (form[i] == 'step_2_1_0') {

          this.operations = [];
          this.cdr.detectChanges();

          this.operations = [
            { id: 1, name: '=' },
            { id: 6, name: '!=' },
            { id: 2, name: '>' },
            { id: 3, name: '<' },
            { id: 4, name: '<=' },
            { id: 5, name: '>=' },
          ];
        } else if (form[i] == 'step_2_1_1') {
          this.TypeOfDifference = [];
          this.cdr.detectChanges();
          this.TypeOfDifference = [
            { id: 1, name: 'Year' },
            { id: 2, name: 'Month' },
            { id: 3, name: 'Day' }
          ];

        } else if (form[i] == 'step_4') {

          this.executionAction = [];
          this.cdr.detectChanges();
          this.executionAction = [
            { id: 1, name: 'Show Field' },
            { id: 2, name: 'Hide Field' },
            { id: 6, name: 'Show FieldSet' },
            { id: 7, name: 'Hide FieldSet' },
            { id: 3, name: 'Execute Query' },
            { id: 4, name: 'Required' },
            { id: 5, name: 'Optional' },
            { id: 8, name: 'Execute Rule Business' },
            { id: 9, name: 'Alert' },
            { id: 10, name: 'Read Only' },
            { id: 11, name: 'Remove Read Only' },
            { id: 12, name: 'Rename Field' },
            { id: 13, name: 'Hide Button' },
            { id: 14, name: 'Show Button' },
            { id: 15, name: 'Splash' }
          ];
        } else if (form[i] == 'step_3') {
          this.filterConditionBasedOnField('step_2')
        } else if (form[i] == 'step_00') {

          this.onloadOptions = [];
          this.cdr.detectChanges();
          this.onloadOptions = [
            { id: 1, name: 'Execute Query With Condition' },
            { id: 2, name: 'Execute Query Without Condition' },
            { id: 3, name: 'Normal Field Condition' }
          ];
        }
        else if (form[i] == 'step_4_1') {
          //Hide And Show Buttons :
          if (this.form_onChangeGroup.controls['step_4']?.value == 13 || this.form_onChangeGroup.controls['step_4']?.value == 14) {
            let elem = { id: "1234", name: "Save" };
            this.testingListOfButtons.push(elem);
            await this.http.get(GlobalConstants.getAllButtons + this.lookupData[0].objectId).subscribe((data: any) => {
              for (let i = 0; i < data.length; i++) {
                let elem = { id: data[i].id, name: data[i].name };
                this.testingListOfButtons.push(elem);
              }
            });
            this.form_onChangeGroup.controls["step_4_1"].setValue(this.step4_1_1);
          } else {
            this.getAllColumns = '';
            this.cdr.detectChanges();
            this.getAllColumns = GlobalConstants.getColumnsApi + this.lookupData[0].objectId;
            this.form_onChangeGroup.controls["step_4_1"].setValue(this.step4_1_1);

          }
        } else if (form[i] == 'step_4_0') {
          let newGetAllFieldSets = this.getAllFieldSets;
          this.getAllFieldSets = '';
          this.cdr.detectChanges();
          this.getAllFieldSets = newGetAllFieldSets;
          this.form_onChangeGroup.controls['step_4_0'].setValue(this.step4_0);
          this.form_onChangeGroup.controls['step_2_9'].setValue(this.step2_9);
        } else if (form[i] == 'step_4_0_1') {
          let newGetAllRules = this.getAllRules;
          this.getAllRules = '';
          this.cdr.detectChanges();
          this.getAllRules = newGetAllRules;
        } else if (form[i] == 'step_4_2') {
          let newGetAllFieldSets = this.getAllFieldSets;
          this.getAllFieldSets = '';
          this.cdr.detectChanges();
          this.getAllFieldSets = newGetAllFieldSets;
          this.form_onChangeGroup.controls['step_4_0'].setValue(this.step4_1);

        }
      }
      //Make fiedls empty under FormGroup OnAfteSave
      else if (formGroup == this.form_onAfterSave) {
        formGroup.controls[form[i]].setValue('');
        if (form[i] == 'step_2_1') {
          this.getAllColumns = '';
          this.cdr.detectChanges();
          this.getAllColumns = GlobalConstants.getColumnsApi + this.lookupData[0].objectId;
        }
        else if (form[i] == 'step_2') {
          this.getAllProcAndPack = '';
          this.cdr.detectChanges();
          this.getAllProcAndPack = GlobalConstants.getAllProcAndPack;
        }
      }
    }
    return;
  }

  //filter arrayList for changing data into dropdown 
  async filterValueSourceBasedRule(selectedRuleAction: string) {
    if (selectedRuleAction == "3") {
      //  let newValueSource1 = this.executionAction.filter((el: any) => {
      //      return el.id === 9;
      //    });
      let newValueSource = [
        { id: 3, name: 'Execute Query' },
        { id: 9, name: 'Alert' }
      ];

      this.actionDecisions = newValueSource;
    } else if (selectedRuleAction == "4") {
      let newValueSource = [
        { id: 4, name: 'Call Procedure' },
        { id: 5, name: 'Call Rest API' },
        { id: 6, name: 'Form Fields' },
        { id: 7, name: 'Execute Query' }
      ];
      this.actionDecisions = newValueSource;
    } else {
      this.actionDecisions = this.valueSource;
    }
  }

  //filter arrayList for changing data into dropdown 
  filterConditionBasedRule(selectedRuleAction: string) {
    if (selectedRuleAction == "3") {
      let arr = [1, 2, 4, 6, 3, 7];
      let newCondition = this.conditionsBckp.filter((el: any) => {
        return arr.includes(el.id);
      });
      this.conditions = newCondition;
    } else {
      this.conditions = this.conditions;
    }
  }

  //filter arrayList for changing data into dropdown 
  async filterConditionBasedOnField(stepValue: string) {
    let includedIDs1 = [1, 2, 3, 4, 6, 7, 8, 14, 15, 16];
    let includedIDs2 = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    let dateIncludesAction1 = [1, 3];
    let dateIncludesAction2 = [1];
    const getColumnsApiUrl = from(axios.get(GlobalConstants.getColumnsApi + this.lookupData[0].objectId));
    const getColumnsApi = await lastValueFrom(getColumnsApiUrl);

    let getColumnsApi2 = getColumnsApi.data.filter((el: any) => {
      return el.id === stepValue;
    });
    this.columnTypeCode = getColumnsApi2[0].columnTypeCode;
    this.TypeOfFormFields = this.columnTypeCode;
    if (this.columnTypeCode == "6") { // if date 
      let dataCondition = this.conditionsBckp.filter((el: any) => {
        return includedIDs2.includes(el.id);
      });
      this.conditions = dataCondition;

      let dateAlert = this.valueSource.filter((test: any) => {
        return dateIncludesAction1.includes(test.id);
      });
      this.actionDecisions = dateAlert;
    } else {
      let dataCondition = this.conditionsBckp.filter((el: any) => {
        return includedIDs1.includes(el.id);
      });
      this.conditions = dataCondition;

      let dateValue = this.valueSource.filter((test: any) => {
        //return dateIncludesAction2.includes(test.id);
        return dateIncludesAction1.includes(test.id);
      });
      this.actionDecisions = dateValue;
    }

  }

  //function when i changed value of fields
  async onChangedSteps(value: string, selectedRule: string) {
    let stepValue: string = '';
    if (selectedRule == "1") {
      // On Change
      stepValue = this.form_onChangeGroup.controls[value]?.value;
      if (this.advancedConditionsYesOrNo == 1) {
        if (stepValue == '') {
          stepValue = '22203';
        }
      }

      if (stepValue != "") {
        if (value == 'step_1') {

          if (this.advancedConditionsYesOrNo == 1) {
            let ArrayToNotChanged = ['step_1'];
            let FieldsToClear = this.GetFieldsToClear(ArrayToNotChanged, this.form_onChangeGroup);;
            this.emptyForm(FieldsToClear, ArrayToNotChanged, this.form_onChangeGroup);
            this.filterConditionBasedOnField(stepValue);
            $(".onChangeGroup .step_1").hide();
            $(".onChangeGroup .step_2").hide();
            $(".onChangeGroup .step_2_0").hide();
            $(".onChangeGroup .step_2_0_0").hide();
            $(".onChangeGroup .step_2_0_1").hide();
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_0_3").hide();
            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_2").hide();
            $(".onChangeGroup .step_2_3").hide();
            $(".onChangeGroup .step_2_4").hide();
            $(".onChangeGroup .step_2_6").hide();
            $(".onChangeGroup .step_2_8").hide();
            $(".onChangeGroup .step_2_5").hide();
            $(".onChangeGroup .step_3").hide();
            $(".onChangeGroup .step_3_1").hide();
            $(".onChangeGroup .step_3_2").hide();
            $(".onChangeGroup .step_4").show();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_6").hide();
            $(".onChangeGroup .step_4_3").hide();
            $(".onChangeGroup .step_4_3_0").hide();
            $(".onChangeGroup .step_2_7").hide();
            $(".onChangeGroup .step_2_9").hide();
            $(".onChangeGroup .step_3_0").hide();
            $(".onChangeGroup .step_3_0_1").hide();


          } else {
            let ArrayToNotChanged = ['step_1'];
            let FieldsToClear = this.GetFieldsToClear(ArrayToNotChanged, this.form_onChangeGroup);;
            this.emptyForm(FieldsToClear, ArrayToNotChanged, this.form_onChangeGroup);
            this.filterConditionBasedOnField(stepValue);

            //Hide All Fields
            let ListOfHide = ['step_2_0', 'step_2_0_0', 'step_2_0_1', 'step_2_0_2', 'step_2_0_3', 'step_2_1', 'step_2_1_1', 'step_2_1_0',
              'step_2_1_2', 'step_2_2', 'step_2_3', 'step_2_4', 'step_2_6', 'step_2_8', 'step_2_5', 'step_3', 'step_3_1',
              'step_3_2', 'step_4', 'step_4_0', 'step_4_0_1', 'step_4_0_0', 'step_4_1', 'step_4_2', 'step_4_2_0', 'step_6', 'step_2_7', 'step_2_9', 'step_3_0', 'step_3_0_1'];
            this.showOrHideFields('onChangeGroup', ['step_2'], "show");
            this.showOrHideFields('onChangeGroup', ListOfHide, "hide");
          }
        } else if (value == 'step_2') {
          let ArrayToNotChanged = ['step_2', 'step_1'];
          let FieldsToClear = this.GetFieldsToClear(ArrayToNotChanged, this.form_onChangeGroup);;
          this.emptyForm(FieldsToClear, ArrayToNotChanged, this.form_onChangeGroup);
          if (stepValue == "3" || stepValue == "4" || stepValue == "6" || stepValue == "7") {
            let onChangeGroup = ['step_2_1_0', 'step_2_1_1', 'step_2_1_2', 'step_2_0', 'step_2_0_0', 'step_2_2',
              'step_2_3', 'step_4', 'step_2_1', 'step_3_1', 'step_4_1', 'step_3'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");


            if (this.TypeOfFormFields != 6) { // In case For Field is date
              //$(".onChangeGroup .step_3").show();
              $(".onChangeGroup .step_2_0").show();
            } else { // In case For Field is not date
              $(".onChangeGroup .step_2_0").show();
              $(".onChangeGroup .step_3").hide();
            }


            this.readOnly = false;
          } else if (stepValue == "9" || stepValue == "10" || stepValue == "11" || stepValue == "12") {
            let onChangeGroup2 = ['step_2_1', 'step_2_1_0', 'step_2_1_1', 'step_2_1_2', 'step_2_2', 'step_2_3',
              'step_2_0', 'step_2_0_1', 'step_2_0_2', 'step_2_0_3', 'step_3_1', 'step_4_1', 'step_6', 'step_3', 'step_2_7', 'step_2_9', 'step_3_0', 'step_3_0_1'];
            this.showOrHideFields('onChangeGroup', onChangeGroup2, "hide");
            $(".onChangeGroup .step_4").show();

            this.readOnly = true;
            let sysdate = new Date();
            let mySysdate = this.datepipe.transform(sysdate, "yyyy-MM-dd");
            this.form_onChangeGroup.controls['step_2_1'].setValue(mySysdate);
          } else if (stepValue == "13") {

            let onChangeGroup = ['step_2_1', 'step_2_1_0', 'step_2_2', 'step_2_3', 'step_2_0', 'step_2_0_1',
              'step_2_0_2', 'step_2_0_3', 'step_3', 'step_4', 'step_3_1', 'step_4_1', 'step_3', 'step_2_7', 'step_2_9', 'step_3_0', 'step_3_0_1'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");
            $(".onChangeGroup .step_2_1_1").show();
            $(".onChangeGroup .step_2_1_2").show();
            $(".onChangeGroup .step_2_1_0").show();
          } else if (stepValue == "5") {
            // In case of between comparission in date
            this.between = 'Between';

            let onChangeGroup1 = ['step_3', 'step_4', 'step_3_1', 'step_2_1', 'step_2_1_0', 'step_2_1_1',
              'step_2_1_2', 'step_2_2', 'step_2_3', 'step_4_1', 'step_3', 'step_2_7', 'step_2_9', 'step_3_0', 'step_3_0_1'];
            this.showOrHideFields('onChangeGroup', onChangeGroup1, "hide");

            $(".onChangeGroup .step_2_0").show();

          } else if (stepValue == "1" || stepValue == "2" || stepValue == "15" || stepValue == "16") {

            let onChangeGroup = ['step_4', 'step_3_1', 'step_2_1', 'step_2_1_0', 'step_2_1_1', 'step_2_1_2',
              'step_2_2', 'step_2_3', 'step_4_1', 'step_2_4', 'step_2_5', 'step_2_6', 'step_2_8', 'step_3'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");

            $(".onChangeGroup .step_2_0").show();

          } else if (stepValue == "8") {
            // In case of Fill Into
            if (this.TypeOfFormFields == '6') {
              let onChangeGroup1 = ['step_3', 'step_4', 'step_3_1', 'step_2_1', 'step_2_0', 'step_2_1_0',
                'step_2_1_1', 'step_2_1_2', 'step_2_2', 'step_2_3', 'step_4_1'];
              this.showOrHideFields('onChangeGroup', onChangeGroup1, "hide");

              let onChangeGroup2 = ['step_2_4', 'step_2_5', 'step_2_6', 'step_2_7', 'step_2_8', 'step_2_9', 'step_3_0', 'step_3_0_1'];
              this.showOrHideFields("onChangeGroup", onChangeGroup2, "show");
            } else {
              let onChangeGroup1 = ['step_3', 'step_4', 'step_3_1', 'step_2_1', 'step_2_0', 'step_2_1_0',
                'step_2_1_1', 'step_2_1_2', 'step_2_2', 'step_2_3', 'step_4_1', 'step_2_7', 'step_2_9', 'step_3_0', 'step_3_0_1'];
              this.showOrHideFields('onChangeGroup', onChangeGroup1, "hide");

              let onChangeGroup2 = ['step_2_4', 'step_2_5', 'step_2_6', 'step_2_8', 'step_2_9', 'step_3_0', 'step_3_0_1'];
              this.showOrHideFields("onChangeGroup", onChangeGroup2, "show");
            }


          } else if (stepValue == "14") {
            let onChangeGroup1 = ['step_2_4', 'step_2_5', 'step_2_6', 'step_2_8', 'step_3', 'step_4', 'step_3_1',
              'step_2_1', 'step_2_0', 'step_2_1_1', 'step_2_1_2', 'step_2_2', 'step_2_3', 'step_4_1', 'step_2_7', 'step_2_9', 'step_3_0', 'step_3_0_1'];
            this.showOrHideFields('onChangeGroup', onChangeGroup1, "hide");

            $(".onChangeGroup .step_2_1_0").show();
            $(".onChangeGroup .step_2_0_0").show();
          }
        }
        else if (value == 'step_2_0_0') {
          $(".onChangeGroup .step_2_1_0").show();
        } else if (value == 'step_2_1_0') {
          $(".onChangeGroup .step_3").show();
          // $(".onChangeGroup .step_4").show();
        } else if (value == 'step_3') {
          $(".onChangeGroup .step_3_1").show();
        }
        else if (value == 'step_3_1') {
          $(".onChangeGroup .step_4").show();
        }
        else if (value == 'step_2_0') {
          if (stepValue == '1' && this.between == '') {
            $(".onChangeGroup .step_2_1").show();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_0_1").hide();
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_0_3").hide();
          }
          else if (stepValue == '2' && this.between == '') {
            $(".onChangeGroup .step_2_0_1").show();
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_0_3").hide();

            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
          }
          else if (stepValue == '2' && this.between == 'Between') {
            $(".onChangeGroup .step_2_0_1").show();
            $(".onChangeGroup .step_2_0_2").show();
            $(".onChangeGroup .step_2_0_3").hide();
            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_2").hide();
            $(".onChangeGroup .step_2_3").hide();
          }
          else if (stepValue == '1' && this.between == 'Between') {
            $(".onChangeGroup .step_2_0_1").hide();
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_0_3").hide();
            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_2").show();
            $(".onChangeGroup .step_2_3").show();
          }
          else if (stepValue == '3' && this.between == '') {
            $(".onChangeGroup .step_2_0_1").hide();
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_0_3").hide();
            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_2").hide();
            $(".onChangeGroup .step_2_3").hide();
            $(".onChangeGroup .step_3_1").show();
            $(".onChangeGroup .step_4").show();

          }
          else if (stepValue == '4' && this.between == '') {
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_0_3").hide();
            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_2").hide();
            $(".onChangeGroup .step_2_3").hide();
            $(".onChangeGroup .step_3").hide();
            $(".onChangeGroup .step_3_1").hide();
            $(".onChangeGroup .step_2_0_1").show();
          } else if (stepValue == '5' && this.between == '') {
            $(".onChangeGroup .step_2_0_1").hide();
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_2").hide();
            $(".onChangeGroup .step_2_3").hide();
            $(".onChangeGroup .step_2_0_3").show();
            $(".onChangeGroup .step_3_1").show();
            $(".onChangeGroup .step_4").show();


          }
        }
        // on change on field Difference nadine test
        // else if (value == 'step_2_1_2') {
        //   $(".onChangeGroup .step_3").show();
        // } 
        else if (value == 'step_2_0_1') {
          $(".onChangeGroup .step_4").show();
        } else if (value == 'step_2_1' || value == 'step_2_2' || value == 'step_2_3') {
          $(".onChangeGroup .step_3").show();
        } else if (value == 'step_3_1') {
          let step3Val = this.form_onChangeGroup.controls["step_2"]?.value;
          if (step3Val == 1 || step3Val == 2) {
            // In case choosen 1 or 2 then show step_4
            $(".onChangeGroup .step_4").show();
          } else if (step3Val == 3) {
            // In case choosen is alert then hide step_4
            $(".onChangeGroup .step_4").hide();
          }
        } else if (value == 'step_3_2') {
          $(".onChangeGroup .step_4").show();
        } else if (value == "step_4_2") {
          $(".onChangeGroup .step_4_2_0").show();
        } else if (value == "step_3_0") {
          if (stepValue == '3') {
            $(".onChangeGroup .step_3_1").hide();
            $(".onChangeGroup .step_3_0_1").show();
          } else if (stepValue == '1') {
            $(".onChangeGroup .step_3_1").show();
          }
        }
      }
    } else if (selectedRule == "2") {
      if (this.advancedConditionsYesOrNo == 1) {
        $(".onLoadGroup .onLoadGroup_3 .step_1").hide();
        $(".onLoadGroup .onLoadGroup_3 .step_2").hide();
        $(".onLoadGroup .onLoadGroup_3 .step_3").hide();
        $(".onLoadGroup .onLoadGroup_3 .step_4").show();
        $(".onLoadGroup .onLoadGroup_3 .step_5").hide();
        $(".onLoadGroup .onLoadGroup_3 .step_3_2").hide();
        $(".onLoadGroup  .step_00").hide();
      } else {
        // On Load - On Load Group => Normal Field
        let val = this.form_onLoadGroup.controls["step_00"]?.value;
        // if (val == 3) {
        stepValue = this.form_onLoadGroup_3.controls[value]?.value;
        // }

        if (stepValue != "") {
          let choosenRuleOnload = this.form_onLoadGroup.controls["step_00"]?.value;
          if (choosenRuleOnload == 3) {
            if (value == 'step_00') {
              $(".onLoadGroup .onLoadGroup_3 .step_1").show();
              $(".onChangeGroup .step_2_0").hide();



            } else if (value == 'step_1') {
              await this.filterConditionBasedOnField(stepValue);

              $(".onLoadGroup .onLoadGroup_3 .step_2").show();
            } else if (value == 'step_2') {
              $(".onLoadGroup .onLoadGroup_3 .step_3").show();

              if (stepValue == "8") {//if is fill into
                $(".onLoadGroup .onLoadGroup_3 .step_5_1").show();
                if (this.TypeOfFormFields == '6') {
                  // $(".onLoadGroup .onLoadGroup_3 .step_5").show();
                  $(".onLoadGroup .onLoadGroup_3 .step_3").hide();
                }
              }
            } else if (value == 'step_3_1') {
              $(".onLoadGroup .onLoadGroup_3 .step_4").show();
            } else if (value == 'step_3_2') {
              $(".onLoadGroup .onLoadGroup_3 .step_4").show();
            } else if (value == 'step_3') {
              if (stepValue == "6") {//if is field value
                $(".onLoadGroup .onLoadGroup_3 .step_5_2").show();

              }
            } else if (value == 'step_5_1') {// fill into dropdown
              $(".onLoadGroup .onLoadGroup_3 .step_5_2").show();// choosen field
            } else if (value == 'step_5_2') {
              $(".onLoadGroup .onLoadGroup_3 .step_2_9").show();//operator
              $(".onLoadGroup .onLoadGroup_3 .step_3_0").show();//operator options
            } else if (value == "step_3_0") {
              if (stepValue == '3') {
                $(".onChangeGroup .step_3_1").hide();
                $(".onChangeGroup .step_3_0_1").show();
              } else if (stepValue == '1') {
                $(".onChangeGroup .step_3_1").show();
              }
            }

          } else if (choosenRuleOnload == 1) {
            $(".onLoadGroup .onLoadGroup_3 .step_1_0").show();
            if (value == 'step_1_0') {
              //check if the choosen field is sysdate and fill into
              $(".onLoadGroup .onLoadGroup_3 .step_2").show();

            } else if (value == 'step_2') {
              //check if the choosen field is sysdate and fill into
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_1").show();

            } else if (value == 'step_1_0_1') {
              let stepValue1 = this.form_onLoadGroup_3.controls[value]?.value;
              if (stepValue1 == 2) {
                $(".onLoadGroup .onLoadGroup_3 .step_4_1").show();

              } else if (stepValue1 == 3) {
                $(".onLoadGroup .onLoadGroup_3 .step_3_1").show();

              }
              //check if the choosen field is sysdate and fill into

            } else if (value == 'step_3_1') {
              //check if the choosen field is sysdate and fill into
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_2").show();

            } else if (value == 'step_1_0_2') {
              //check if the choosen field is sysdate and fill into
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").show();

            }
          } else if (choosenRuleOnload == 2) {
            $(".onLoadGroup .onLoadGroup_3 .step_1_0").show();
            $(".onLoadGroup .onLoadGroup_3 .step_1").show();
          }
        }
      }

    } else if (selectedRule == "5") {
      // On Load - Where Condition
      stepValue = this.form_whereCondition.controls[value]?.value;
      if (stepValue != "") {
        if (value == 'step_8') {
          this.getAllColumnsByTable = GlobalConstants.GetColVal + this.form_whereCondition.controls['step_0']?.value;
          $(".onWhereCondition .step_1").show();
        } else if (value == 'step_1') {
          $(".onWhereCondition .step_2").show();
        } else if (value == 'step_2') {
          $(".onWhereCondition .step_3").show();
        }
      }
    } else if (selectedRule == "3") {
      // On Load - On Before Save
      if (this.advancedConditionsYesOrNo == 1) {
        $(".onBeforeSave .step_8").show();
        $(".onBeforeSave .step_1").hide();
        $(".onBeforeSave .step_2").hide();
        $(".onBeforeSave .step_3").hide();
        $(".onBeforeSave .step_4").hide();
        stepValue = this.form_onBeforeSave.controls[value]?.value;
        if (stepValue != "") {
          if (value == 'step_8') {
            if (stepValue == '9') {
              $(".onBeforeSave .step_5").show();
            } if (stepValue == '3') {
              $(".onBeforeSave .step_1").show();
              // this.filterConditionBasedRule(this.selectedRuleAction);
              // $(".onBeforeSave .step_2").show();
            }
          } else if (value == 'step_1') {
            this.filterConditionBasedRule(this.selectedRuleAction);
            $(".onBeforeSave .step_1").show();
            $(".onBeforeSave .step_2").show();
          } else if (value == 'step_2') {
            $(".onBeforeSave .step_1").show();
            $(".onBeforeSave .step_2").show();
            $(".onBeforeSave .step_3").show();
          } else if (value == 'step_3') {
            this.filterValueSourceBasedRule(this.selectedRuleAction);
            $(".onBeforeSave .step_1").show();
            $(".onBeforeSave .step_2").show();
            $(".onBeforeSave .step_3").show();
            $(".onBeforeSave .step_4").show();
          } else if (value == 'step_4') {
            $(".onBeforeSave .step_1").show();
            $(".onBeforeSave .step_2").show();
            $(".onBeforeSave .step_3").show();
            $(".onBeforeSave .step_4").show();
            $(".onBeforeSave .step_5").show();
          } else if (value == 'step_6') {
            $(".onBeforeSave .step_1").show();
            $(".onBeforeSave .step_2").show();
            $(".onBeforeSave .step_3").show();
            $(".onBeforeSave .step_4").show();
            $(".onBeforeSave .step_5").show();
            $(".onBeforeSave .step_7").show();
          }


        }
      } else {
        stepValue = this.form_onBeforeSave.controls[value]?.value;
        if (stepValue != "") {
          if (value == 'step_1') {
            this.filterConditionBasedRule(this.selectedRuleAction);
            $(".onBeforeSave .step_2").show();
          } else if (value == 'step_2') {
            $(".onBeforeSave .step_3").show();
          } else if (value == 'step_3') {
            this.filterValueSourceBasedRule(this.selectedRuleAction);
            $(".onBeforeSave .step_4").show();
          } else if (value == 'step_4') {
            $(".onBeforeSave .step_5").show();
          } else if (value == 'step_6') {
            $(".onBeforeSave .step_7").show();
          }
        }
      }

    } else if (selectedRule == "4") {
      //onAfterSave changed Fields and make all fields empty when change action
      stepValue = this.form_onAfterSave.controls[value]?.value;
      if (stepValue != "") {
        if (value == "step_1") {
          let ArrayToNotChanged = ['step_1'];
          let FieldsToClear = this.GetFieldsToClear(ArrayToNotChanged, this.form_onAfterSave);;
          this.emptyForm(FieldsToClear, ArrayToNotChanged, this.form_onAfterSave);
          if (stepValue == "4") {
            $(".onAfterSave .step_2").show();
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
            $(".onAfterSave .step_4").hide();
          }
          if (stepValue == "5") {
            $(".onAfterSave .step_2").hide();
            $(".onAfterSave .step_2_1").hide();
            $(".onAfterSave .step_3").show();
            $(".onAfterSave .step_3_1").hide();
            $(".onAfterSave .step_4").hide();
          }
          if (stepValue == "6") {
            $(".onAfterSave .step_2").hide();
            $(".onAfterSave .step_2_1").hide();
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
            $(".onAfterSave .step_4").show();
            $(".onAfterSave .step_4_1").hide();
            $(".onAfterSave .step_4_2").hide();
            $(".onAfterSave .step_4_3").hide();
            $(".onAfterSave .step_4_4").hide();
          }
          if (stepValue == "7") {
            $(".onAfterSave .step_4_7").show();

          }
        }
        if (value == "step_3") {
          $(".onAfterSave .step_2").hide();
          $(".onAfterSave .step_2_1").hide();
          $(".onAfterSave .step_3_1").show();
        }
        if (value == "step_4") {
          $(".onAfterSave .step_4_1").show();
          $(".onAfterSave .step_4_2").hide();
          $(".onAfterSave .step_4_3").hide();
          $(".onAfterSave .step_4_4").show();
          $(".onAfterSave .step_4_5").hide();
          $(".onAfterSave .step_4_6").hide();
        }
        if (value == "step_4_1") {
          $(".onAfterSave .step_4_2").show();
          $(".onAfterSave .step_4_3").hide();
          $(".onAfterSave .step_4_4").hide();
          $(".onAfterSave .step_4_5").hide();
          $(".onAfterSave .step_4_6").hide();
        }
        if (value == "step_4_2") {
          $(".onAfterSave .step_4_3").show();
          $(".onAfterSave .step_4_4").hide();
          $(".onAfterSave .step_4_5").hide();
          $(".onAfterSave .step_4_6").hide();
        }
        if (value == "step_4_3") {
          $(".onAfterSave .step_4_4").show();
          $(".onAfterSave .step_4_5").hide();
          $(".onAfterSave .step_4_6").hide();
        }
        if (value == "step_4_4") {
          $(".onAfterSave .step_4_5").show();
          $(".onAfterSave .step_4_6").hide();
        }
        if (value == "step_4_5") {
          $(".onAfterSave .step_4_6").show();
        }
      }
    }
  }

  //function when i changed value of fields
  actionSelection(value: string, selectedRule: string) {
    //change if on update rule under field (some fields appear and not should be appeared)
    // show on update rules
    if (selectedRule == "1") {

      // On Change
      if (this.form.controls['hasAdvancedConditions']?.value == true) {
        $(".onChangeGroup .step_1").hide();
        $(".onChangeGroup .step_2").hide();
        $(".onChangeGroup .step_2_0").hide();
        $(".onChangeGroup .step_2_0_0").hide();
        $(".onChangeGroup .step_2_0_1").hide();
        $(".onChangeGroup .step_2_0_2").hide();
        $(".onChangeGroup .step_2_0_3").hide();
        $(".onChangeGroup .step_2_1").hide();
        $(".onChangeGroup .step_2_1_1").hide();
        $(".onChangeGroup .step_2_1_0").hide();
        $(".onChangeGroup .step_2_1_2").hide();
        $(".onChangeGroup .step_2_2").hide();
        $(".onChangeGroup .step_2_3").hide();
        $(".onChangeGroup .step_2_4").hide();
        $(".onChangeGroup .step_2_6").hide();
        $(".onChangeGroup .step_2_8").hide();
        $(".onChangeGroup .step_2_5").hide();
        $(".onChangeGroup .step_3").hide();
        $(".onChangeGroup .step_3_1").hide();
        $(".onChangeGroup .step_3_2").hide();
        $(".onChangeGroup .step_4").show();
        $(".onChangeGroup .step_4_0").hide();
        $(".onChangeGroup .step_4_0_1").hide();
        $(".onChangeGroup .step_4_0_0").hide();
        $(".onChangeGroup .step_4_1").hide();
        $(".onChangeGroup .step_4_2").hide();
        $(".onChangeGroup .step_4_2_0").hide();
        $(".onChangeGroup .step_6").hide();
        $(".onChangeGroup .step_4_3").hide();
        $(".onChangeGroup .step_4_3_0").hide();
        let action = this.form_onChangeGroup.get(value).value;
        if (value == "step_4") {
          if (action === 1 || action === 2 || action === 4 || action === 5) {
            this.ChooseAFieldButtonFirst = true;
            $(".onChangeGroup .step_4_1").show();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();



          } else if (action === 3) {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").show();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();

          } else if (action == 6 || action == 7) {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_0").show();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();

          } else if (action === 8) {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").show();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();
          } else if (action === 9) {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").show();
            $(".onChangeGroup .step_6").hide();

          }
          else if (action === 10 || action === 11) {
            this.ChooseAFieldButtonFirst = true;
            $(".onChangeGroup .step_4_1").show();
            $(".onChangeGroup .step_6").hide();
          } else if (action === 12) {
            $(".onChangeGroup .step_6").show();
            $(".onChangeGroup .step_4_1").show();
          } else {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();
          }
        }
      }
      else {
        let action = this.form_onChangeGroup.get(value).value;
        if (value == "step_2") {
          $(".onChangeGroup .step_2_0_0").hide();
          if (action == 3 || action == 4 || action == 6 || action == 7) {//'step_2_9'
            let onChangeGroup = ['step_2_1_0', 'step_2_1_1', 'step_2_1_2', 'step_2_9', 'step_3_0', 'step_4_3', 'step_4_3_0', 'step_3_0_1', 'step_2_2', 'step_2_3',
              'step_2_4', 'step_2_6', 'step_2_8', 'step_2_5', 'step_2_1', 'step_2_0_2', 'step_2_0_3', 'step_3'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");
            $(".onChangeGroup .step_4").show();

          } else if (action == 9 || action == 10 || action == 11 || action == 12) {
            let onChangeGroup = ['step_2_1', 'step_2_1_0', 'step_2_1_1', 'step_2_1_2', 'step_2_2', 'step_2_3',
              'step_2_0', 'step_2_0_1', 'step_2_0_2', 'step_2_0_3', 'step_2_4', 'step_2_6', 'step_2_8', 'step_2_5', 'step_3'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");
            $(".onChangeGroup .step_4").show();
          } else if (action == 13) {
            $(".onChangeGroup .step_2_1_0").show();
            $(".onChangeGroup .step_2_1_1").show();
            $(".onChangeGroup .step_2_1_2").show();
            $(".onChangeGroup .step_3").show();
            let onChangeGroup = ['step_2_1', 'step_2_2', 'step_2_3', 'step_2_0', 'step_2_0_1', 'step_2_0_2', 'step_2_0_3',
              'step_2_4', 'step_2_6', 'step_2_8', 'step_2_5'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");
          } else if (action == 14) {
            $(".onChangeGroup .step_3").show();
            $(".onChangeGroup .step_2_1_0").show();
            $(".onChangeGroup .step_2_0").show();

            let onChangeGroup = ['step_2_1', 'step_2_1_1', 'step_2_1_2', 'step_2_2', 'step_2_3', 'step_2_0_1',
              'step_2_0_2', 'step_2_0_3', 'step_2_4', 'step_2_6', 'step_2_8', 'step_2_5'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");

          } else if (action == 5) {
            // In case of between comparission in date
            this.between = 'Between';
            $(".onChangeGroup .step_2_1").hide();
            $(".onChangeGroup .step_2_0").show();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_4").hide();
            $(".onChangeGroup .step_2_6").hide();
            $(".onChangeGroup .step_2_8").hide();
            $(".onChangeGroup .step_2_5").hide();
          }
          else if (action == 1) {//'step_2_0',
            let onChangeGroup = ['step_2_0_1', 'step_2_9', 'step_3_0', 'step_3_0_1', 'step_4_3', 'step_4_3_0', 'step_2_0_2', 'step_2_0_3', 'step_2_1', 'step_2_1_1', 'step_2_1_0',
              'step_2_1_2', 'step_2_2', 'step_2_3', 'step_2_4', 'step_2_6', 'step_2_8', 'step_2_5', 'step_3', 'step_4_0_0',
              'step_4_0_1', 'step_4_0', 'step_4_2', 'step_4_2_0'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");
          }
          else if (action == 8) {
            $(".onChangeGroup .step_2_4").show();
            $(".onChangeGroup .step_2_5").show();
            $(".onChangeGroup .step_2_6").show();
            $(".onChangeGroup .step_2_8").show();

            let onChangeGroup = ['step_2_1', 'step_2_1_0', 'step_2_1_1', 'step_2_1_2', 'step_2_0', 'step_2_2',
              'step_2_3', 'step_2_0_1', 'step_2_0_2', 'step_2_0_3', 'step_3_1'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");

          } else {
            let onChangeGroup = ['step_2_1', 'step_2_1_0', 'step_2_9', 'step_3_0', 'step_3_0_1', 'step_2_1_1', 'step_2_1_2', 'step_2_2',
              'step_2_3', 'step_2_4', 'step_2_6', 'step_2_8', 'step_2_5'];
            this.showOrHideFields('onChangeGroup', onChangeGroup, "hide");
            $(".onChangeGroup .step_3_1").show();
          }
        }
        // Added by Nadine Nicolas 
        else if (value == "step_2_0") {
          if (action == 3) {
            $(".onChangeGroup .step_2_0_1").hide();
            $(".onChangeGroup .step_2_0_2").hide();
            $(".onChangeGroup .step_2_0_3").hide();
            $(".onChangeGroup .step_2_1_1").hide();
            $(".onChangeGroup .step_2_1_0").hide();
            $(".onChangeGroup .step_2_1_2").hide();
            $(".onChangeGroup .step_2_2").hide();
            $(".onChangeGroup .step_3").hide();
          }
        }
        else if (value == "step_3") {
          if (action == 1) {
            $(".onChangeGroup .step_3_1").show();
            $(".onChangeGroup .step_3_2").hide();
          } else if (action == 2) {
            $(".onChangeGroup .step_3_1").hide();
            $(".onChangeGroup .step_3_2").show();
          } else if (action == 3) {
            $(".onChangeGroup .step_3_1").show();
            $(".onChangeGroup .step_3_2").hide();
            $(".onChangeGroup .step_4_0_0").hide();
          } else {
            //$(".onChangeGroup .step_3_1").hide();
            $(".onChangeGroup .step_3_2").hide();
          }
        } else if (value == "step_4") {
          let ArrayToNotChanged = ['step_1', 'step_2', 'step_2_0_0', 'step_2_0', 'step_2_0_1', 'step_2_0_2', 'step_2_0_3', 'step_2_1',
            'step_2_1_1', 'step_2_1_0', 'step_2_1_2', 'step_2_2', 'step_2_3', 'step_2_4',
            'step_2_6', 'step_2_8', 'step_2_5', 'step_3', 'step_3_1', 'step_3_2', 'step_4', 'step_4_3', 'step_4_3_0'];
          let FieldsToClear = this.GetFieldsToClear(ArrayToNotChanged, this.form_onChangeGroup);;
          this.emptyForm(FieldsToClear, ArrayToNotChanged, this.form_onChangeGroup);
          //show the first 
          this.ChooseAFieldButtonFirst = true;
          this.ChooseAFieldButtonSecond = false;
          if (action === 1 || action === 2 || action === 4 || action === 5) {

            $(".onChangeGroup .step_4_1").show();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_2_0").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_6").hide();
            $(".onChangeGroup .step_4_0_0").hide();
          } else if (action === 3) { // execute query
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").show();
            $(".onChangeGroup .step_4_2_0").show();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();
          } else if (action == 6 || action == 7) {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_2_0").hide();
            $(".onChangeGroup .step_4_0").show();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();
          } else if (action === 8) {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_2_0").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").show();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();
          } else if (action === 9) {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_2_0").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").show();
            $(".onChangeGroup .step_6").hide();
            $(".onChangeGroup .step_3_1").hide();
          }
          else if (action === 10 || action === 11) {
            $(".onChangeGroup .step_6").hide();
            $(".onChangeGroup .step_4_1").show();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_2_0").hide();
          } else if (action === 12) {

            $(".onChangeGroup .step_6").show();
            $(".onChangeGroup .step_4_1").show();
            $(".onChangeGroup .step_4_2_0").hide();

          }
          else if (action === 13 || action === 14) {
            //hide first and show second 
            this.ChooseAFieldButtonFirst = false;
            this.ChooseAFieldButtonSecond = true;
            $(".onChangeGroup .step_4_1").show();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_2_0").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_6").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_4_2_0").hide();

          }
          else if (action === 15) { // splash 
            setTimeout(() => {
              $(".onChangeGroup .step_4_1").hide();
              $(".onChangeGroup .step_4_0").hide();
              $(".onChangeGroup .step_4_2").hide();
              $(".onChangeGroup .step_4_2_0").hide();
              $(".onChangeGroup .step_4_0_1").hide();
              $(".onChangeGroup .step_4_0_0").hide();
              $(".onChangeGroup .step_6").hide();
              $(".onChangeGroup .step_4_3").show();
              $(".onChangeGroup .step_4_3_0").show();
            }, 10);


          }
          else {
            $(".onChangeGroup .step_4_1").hide();
            $(".onChangeGroup .step_4_0").hide();
            $(".onChangeGroup .step_4_2").hide();
            $(".onChangeGroup .step_4_2_0").hide();
            $(".onChangeGroup .step_4_0_1").hide();
            $(".onChangeGroup .step_4_0_0").hide();
            $(".onChangeGroup .step_6").hide();
            $(".onChangeGroup .step_4_3").hide();
            $(".onChangeGroup .step_4_3_0").hide();
          }
        }

      }

    } else if (selectedRule == "2") {
      // On Load     
      if (this.form.controls['hasAdvancedConditions']?.value == 1) {
        $(".onLoadGroup  .step_00").hide();
        $(".onLoadGroup .onLoadGroup_3").show();
        
        $(".onLoadGroup_3 .step_4").show();



        let action = this.form_onLoadGroup_3.get(value).value;
        if (action === 1 || action === 2 || action === 4 || action === 5) {
          $(".onLoadGroup_3 .step_4_1").show();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
        } else if (action === 3) { // execute query
          $(".onLoadGroup_3 .step_4_2").show();
          $(".onLoadGroup_3 .step_4_2_0").hide();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_1").hide();


        } else if (action == 6 || action == 7) {
          $(".onLoadGroup_3 .step_4_0").show();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_1").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();


        } else if (action === 8) {
          $(".onLoadGroup_3 .step_4_0_1").show();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_1").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();

        } else if (action === 9) {

          $(".onLoadGroup_3 .step_4_0_0").show();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_1").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();


        }
        else if (action === 10 || action === 11) {
          $(".onLoadGroup_3 .step_4_1").show();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();


        } else if (action === 12) {

          $(".onLoadGroup_3 .step_6").show();
          $(".onLoadGroup_3 .step_4_1").show();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();

        }
        else if (action === 13 || action === 14) {
          //hide first and show second 
          this.ChooseAFieldButtonFirst = false;
          this.ChooseAFieldButtonSecond = true;
          $(".onLoadGroup_3 .step_4_1").show();
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();

        }
        else if (action === 15) { // splash 
          setTimeout(() => {
            $(".onLoadGroup_3 .step_1_0").hide();
            $(".onLoadGroup_3 .step_1_0_1").hide();
            $(".onLoadGroup_3 .step_3_2").hide();
            $(".onLoadGroup_3 .step_6").hide();
            $(".onLoadGroup_3 .step_1_0_2").hide();
            $(".onLoadGroup_3 .step_3_1").hide();
            $(".onLoadGroup_3 .step_3").hide();
            $(".onLoadGroup_3 .step_5_1").hide();
            $(".onLoadGroup_3 .step_4_0_1").hide();
            $(".onLoadGroup_3 .step_4_0").hide();
            $(".onLoadGroup_3 .step_5_2").hide();
            $(".onLoadGroup_3 .step_5").hide();
            $(".onLoadGroup_3 .step_4_1").hide();
            $(".onChangeGroup .step_4_3").show();
            $(".onChangeGroup .step_4_3_0").show();
            $(".onLoadGroup_3 .step_4_2_0").hide();

          }, 10);


        }
        else {
          $(".onLoadGroup_3 .step_1_0").hide();
          $(".onLoadGroup_3 .step_1_0_1").hide();
          $(".onLoadGroup_3 .step_3_2").hide();
          $(".onLoadGroup_3 .step_6").hide();
          $(".onLoadGroup_3 .step_1_0_2").hide();
          $(".onLoadGroup_3 .step_3_1").hide();
          $(".onLoadGroup_3 .step_4_2").hide();
          $(".onLoadGroup_3 .step_4_2_0").hide();


          $(".onLoadGroup_3 .step_3").hide();
          $(".onLoadGroup_3 .step_5_1").hide();
          $(".onLoadGroup_3 .step_4_0_1").hide();
          $(".onLoadGroup_3 .step_4_0").hide();
          $(".onLoadGroup_3 .step_5_2").hide();
          $(".onLoadGroup_3 .step_5").hide();
          $(".onLoadGroup_3 .step_4_1").hide();
        }
        // else if (action === 3) {
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_2").show();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

        // } else if (action == 6 || action == 7) {
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0").show();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

        // } else if (action === 8) {
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").show();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_6").hide();
        // } else if (action === 9) {
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_0").show();
        //   $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

        // }
        // else if (action === 10 || action === 11) {
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_1").show();
        //   $(".onLoadGroup .onLoadGroup_3 .step_6").hide();
        // } else if (action === 12) {
        //   $(".onLoadGroup .onLoadGroup_3 .step_6").show();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_1").show();
        // } else {
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
        //   $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
        //   $(".onLoadGroup .onLoadGroup_3.step_4_0_0").hide();
        //   $(".onLoadGroup .onLoadGroup_3p .step_6").hide();
        // }

      } else {
        let choosenRuleOnload = this.form_onLoadGroup.controls["step_00"]?.value;
        console.log("choosenRuleOnload>>>>>>>>>>>>>>", choosenRuleOnload);

        if (choosenRuleOnload == 1) {
          let action = this.form_onLoadGroup_3.get(value).value;
          if (value == "step_2") {
          }
        } else if (choosenRuleOnload == 3) {
          let action = this.form_onLoadGroup_3.get(value).value;
          if (value == "step_3") {

            if (action == 1) {
              $(".onLoadGroup .onLoadGroup_3 .step_3_1").show();
              $(".onLoadGroup .onLoadGroup_3 .step_3_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

            } else if (action == 2) {
              $(".onLoadGroup .onLoadGroup_3 .step_3_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_3_2").show();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

            } else {
              $(".onLoadGroup .onLoadGroup_3 .step_3_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_3_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

            }
          }
          else if (value == "step_4") {
            if (action == 1 || action == 2 || action == 4 || action == 5 || action == 13 || action == 14) {
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").show();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

            } else if (action == 3) {
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2").show();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2_0").show();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

            } else if (action == 6 || action == 7) {
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0").show();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

            } else if (action === 9) {
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0_0").show();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();

            }
            else if (action === 10 || action === 11) {
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").show();
              $(".onLoadGroup .onLoadGroup_3 .step_6").hide();
            }
            else if (action === 12) {
              $(".onLoadGroup .onLoadGroup_3 .step_6").show();
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").show();
            }
            else if (action === 8) {
              // $(".onChangeGroup .step_4_1").hide();
              // $(".onChangeGroup .step_4_2").hide();
              // $(".onChangeGroup .step_4_0").hide();
              // $(".onChangeGroup .step_4_0_1").show();
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").show();
            } else {
              $(".onLoadGroup .onLoadGroup_3 .step_4_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_4_0_1").hide();
            }
          }
          if (value == 'step_2') {
            if (action == 1) {
              $(".onLoadGroup .onLoadGroup_3 .step_1_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5_2").hide();
            }

            if (action == 8) {
              $(".onLoadGroup .onLoadGroup_3 .step_1_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_2").hide();
            }
            if (action == 14 || action == 6 || action == 7) {
              $(".onLoadGroup .onLoadGroup_3 .step_1_0").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5_1").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5_2").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_5").hide();
              $(".onLoadGroup .onLoadGroup_3 .step_1_0_2").hide();

            }



          }
        }
      }

    } else if (selectedRule == "4") {
      // On After Save
      //jppppppppppppppppp

      if (this.form.controls['hasAdvancedConditions']?.value == true) {

        if (value == "step_1") {
          let action = this.form_onAfterSave.controls['step_1']?.value;

          if (action == 4) {
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
            $(".onAfterSave .step_4").hide();
            $(".onAfterSave .step_4_1").hide();
            $(".onAfterSave .step_4_2").hide();
            $(".onAfterSave .step_4_3").hide();
            $(".onAfterSave .step_4_4").hide();
            $(".onAfterSave .step_4_7").hide();
          }
          if (action == 5) {
            $(".onAfterSave .step_4").hide();
            $(".onAfterSave .step_4_1").hide();
            $(".onAfterSave .step_4_2").hide();
            $(".onAfterSave .step_4_3").hide();
            $(".onAfterSave .step_4_4").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_6").hide();
            $(".onAfterSave .step_4_7").hide();
            $(".onAfterSave .step_3").show();
            $(".onAfterSave .step_3_1").show();
          } if (action == 6) {
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
          } if (action == 7) {
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
            $(".onAfterSave .step_4").hide();
            $(".onAfterSave .step_4_1").hide();
            $(".onAfterSave .step_4_2").hide();
            $(".onAfterSave .step_4_3").hide();
            $(".onAfterSave .step_4_4").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_6").hide();
          }
        }
        if (value == "step_4_4") {

          let action = this.form_onAfterSave.get(value).value;
        }
        if (value == "step_2") {
          $(".onAfterSave .step_2_1").show();
        } else if (value == "step_3") {
          $(".onAfterSave .step_2_1").hide();
          $(".onAfterSave .step_2").hide();
        }
      } else {
        if (value == "step_1") {
          let action = this.form_onAfterSave.get(value).value;
          if (action == 4) {
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
            $(".onAfterSave .step_4").hide();
            $(".onAfterSave .step_4_1").hide();
            $(".onAfterSave .step_4_2").hide();
            $(".onAfterSave .step_4_3").hide();
            $(".onAfterSave .step_4_4").hide();
            $(".onAfterSave .step_4_7").hide();
          }
          if (action == 5) {
            $(".onAfterSave .step_4").hide();
            $(".onAfterSave .step_4_1").hide();
            $(".onAfterSave .step_4_2").hide();
            $(".onAfterSave .step_4_3").hide();
            $(".onAfterSave .step_4_4").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_6").hide();
            $(".onAfterSave .step_4_7").hide();
            $(".onAfterSave .step_3").show();
            $(".onAfterSave .step_3_1").show();
          } if (action == 6) {
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
          } if (action == 7) {
            $(".onAfterSave .step_3").hide();
            $(".onAfterSave .step_3_1").hide();
            $(".onAfterSave .step_4").hide();
            $(".onAfterSave .step_4_1").hide();
            $(".onAfterSave .step_4_2").hide();
            $(".onAfterSave .step_4_3").hide();
            $(".onAfterSave .step_4_4").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_5").hide();
            $(".onAfterSave .step_4_6").hide();
            //  $(".onAfterSave .step_4_7").hide();
          }

        }
        if (value == "step_4_4") {
          let action = this.form_onAfterSave.get(value).value;


        }

        if (value == "step_2") {
          $(".onAfterSave .step_2_1").show();
          // $(".onAfterSave .step_3").hide();
          // $(".onAfterSave .step_3_1").hide();
          //  $(".onAfterSave .step_4").hide();
          //  $(".onAfterSave .step_4_1").hide();
          //  $(".onAfterSave .step_4_2").hide();
          //  $(".onAfterSave .step_4_3").hide();
          //  $(".onAfterSave .step_4_4").hide();
          //   $(".onAfterSave .step_4_7").hide();
          //  $(".onAfterSave .step_2_1_0").hide();
          //  $(".onAfterSave .step_2_1_1").hide();
          //  $(".onAfterSave .step_2_1_2").hide();
        } else if (value == "step_3") {
          $(".onAfterSave .step_2_1").hide();
          $(".onAfterSave .step_2").hide();
          // $(".onAfterSave .step_2_1_0").hide();
          // $(".onAfterSave .step_2_1_1").hide();
          // $(".onAfterSave .step_2_1_2").hide();
          //  $(".onAfterSave .step_3").show();
          //  $(".onAfterSave .step_3_1").show();
        }
      }
    } else if (selectedRule == "5") {
      // On Where Condition
      let action = this.form_whereCondition.get(value).value;
      if (value == "step_3") {
        if (action == 1) {
          $(".onWhereCondition .step_3_1").show();
          $(".onWhereCondition .step_3_2").hide();
        } else if (action == 2) {
          $(".onWhereCondition .step_3_1").hide();
          $(".onWhereCondition .step_3_2").show();
        } else {
          $(".onWhereCondition .step_3_1").hide();
          $(".onWhereCondition .step_3_2").hide();
        }
      }
    }
  }

  onFormSubmit_OnChange(actionType: string, orderNo: string, hasAdvancedConditions: number) {
    if (this.form_onChangeGroup.status != 'INVALID') {
      let ruleData: any[];
      let jsonData: any[];
      let step_1 = this.form_onChangeGroup.controls['step_1']?.value;
      let step_2 = this.form_onChangeGroup.controls['step_2']?.value;
      let step_2_0 = this.form_onChangeGroup.controls['step_2_0']?.value;
      let step_2_0_0 = this.form_onChangeGroup.controls['step_2_0_0']?.value;
      let step_2_0_1 = this.form_onChangeGroup.controls['step_2_0_1']?.value;
      let step_2_0_2 = this.form_onChangeGroup.controls['step_2_0_2']?.value;
      let step_2_0_3 = this.form_onChangeGroup.controls['step_2_0_3']?.value;
      let step_2_1 = this.form_onChangeGroup.controls['step_2_1']?.value;
      let step_2_2 = this.form_onChangeGroup.controls['step_2_2']?.value;
      let step_2_3 = this.form_onChangeGroup.controls['step_2_3']?.value;
      let step_2_4 = this.form_onChangeGroup.controls['step_2_4']?.value;
      let step_2_5 = this.form_onChangeGroup.controls['step_2_5']?.value;
      let step_2_6 = this.form_onChangeGroup.controls['step_2_6']?.value;
      let step_2_8 = this.form_onChangeGroup.controls['step_2_8']?.value;
      let step_3 = this.form_onChangeGroup.controls['step_3']?.value;
      let step_4 = this.form_onChangeGroup.controls['step_4']?.value;
      let step_42 = this.form_onChangeGroup.controls['step_4_2_0']?.value;
      let step_44 = '';
      let step_33 = '';
      let whereCond = '';

      let step_2_1_0 = this.form_onChangeGroup.controls['step_2_1_0']?.value;
      let step_2_1_1 = this.form_onChangeGroup.controls['step_2_1_1']?.value;
      let step_2_1_2 = this.form_onChangeGroup.controls['step_2_1_2']?.value;
      let step_6 = this.form_onChangeGroup.controls['step_6']?.value;
      let step_43 = this.form_onChangeGroup.controls['step_4_3']?.value;
      let step_430 = this.form_onChangeGroup.controls['step_4_3_0']?.value;
      let step_2_7 = this.form_onChangeGroup.controls['step_2_7']?.value;
      let step_2_9 = this.form_onChangeGroup.controls['step_2_9']?.value;
      let step_3_0 = this.form_onChangeGroup.controls['step_3_0']?.value;
      let step_3_0_1 = this.form_onChangeGroup.controls['step_3_0_1']?.value;
      let step_3_1 = this.form_onChangeGroup.controls['step_3_1']?.value;

      if (step_3 == 1) {
        step_33 = this.form_onChangeGroup.controls['step_3_1']?.value;
      } else if (step_3 == 2) {
        step_33 = this.form_onChangeGroup.controls['step_3_2']?.value;
        this.jsonEmpty = [{ queryId: step_33, parameters: [{ paramName: '', paramValue: '' }], link: [] }];
        this.http.post<any>(GlobalConstants.getQbeIdApi + step_33 + "/0", this.jsonEmpty, { headers: GlobalConstants.headers }).subscribe((data: any) => {
          this.form_onChangeGroup.controls['step_3_2_hidden'].setValue(data[0]);
        });
      } else if (step_3 == 3) {
        step_33 = this.form_onChangeGroup.controls['step_3_1']?.value;
      } else if (step_2_0 == 3) {
        step_33 = this.form_onChangeGroup.controls['step_3_1']?.value;
      }

      if (step_4 == 1 || step_4 == 2 || step_4 == 4 || step_4 == 5 || step_4 == 10 || step_4 == 11 || step_4 == 12 || step_4 == 13 || step_4 == 14) {
        step_44 = this.form_onChangeGroup.controls['step_4_1']?.value;
      } else if (step_4 == 7 || step_4 == 6) {
        step_44 = this.form_onChangeGroup.controls['step_4_0']?.value;
      } else if (step_4 == 3) {
        step_44 = this.form_onChangeGroup.controls['step_4_2']?.value;
      } else if (step_4 == 8) {
        step_44 = this.form_onChangeGroup.controls['step_4_0_1']?.value;
      } else if (step_4 == 9) {

        step_44 = this.form_onChangeGroup.controls['step_4_0_0']?.value;
      }

      if (step_3 == 3) { // if action is equal to alert
        ruleData = [
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 210, data: step_2_1_0 },
          { step: 20, data: step_2_0 },
          { step: 201, data: step_2_0_1 },
          { step: 202, data: step_2_0_2 },
          { step: 203, data: step_2_0_3 },
          { step: 21, data: step_2_1 },
          { step: 211, data: step_2_1_1 },
          { step: 212, data: step_2_1_2 },
          { step: 22, data: step_2_2 },
          { step: 23, data: step_2_3 },
          { step: 3, data: step_3 },
          { step: 33, data: step_33 },
          { step: 0, data: this.advancedResult }
        ];
      } else { // if action is not equal to alert
        ruleData = [
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 20, data: step_2_0 },
          { step: 200, data: step_2_0_0 },
          { step: 201, data: step_2_0_1 },
          { step: 203, data: step_2_0_3 },
          { step: 210, data: step_2_1_0 },
          { step: 24, data: step_2_4 },
          { step: 25, data: step_2_5 },
          { step: 26, data: step_2_6 },
          { step: 28, data: step_2_8 },
          { step: 3, data: step_3 },
          { step: 33, data: step_33 },
          { step: 333, data: this.form_onChangeGroup.controls['step_3_2_hidden']?.value },
          { step: 4, data: step_4 },
          { step: 42, data: step_42 },
          { step: 44, data: step_44 },
          { step: 6, data: step_6 },
          { step: 43, data: step_43 },
          { step: 430, data: step_430 },
          { step: 0, data: this.advancedResult },
          { step: 27, data: step_2_7 },
          { step: 29, data: step_2_9 },
          { step: 30, data: step_3_0 },
          { step: 301, data: step_3_0_1 },
          { step: 31, data: step_3_1 }
        ];
      }
      let excludedToggle = this.form.controls['isExcluded']?.value;
      let excludedValue: number;
      if (excludedToggle == true) {
        excludedValue = 1;
      } else {
        excludedValue = 0;
      }

      jsonData = [{
        ruleId: this.lookupData[0].ruleId,
        ruleAction: this.selectedRuleAction,
        ruleData: JSON.stringify(ruleData),
        ruleDescription: this.form.controls['ruleDescription']?.value,
        actionType: this.form.controls['actionType']?.value,
        isExcluded: excludedValue,
        objectId: this.lookupData[0].objectId,
        updatedBy: this.userId,
        createdBy:this.userId,
        columnId: this.lookupData[0].columnId,
        orderNo: orderNo,
        hasAdvancedConditions: hasAdvancedConditions,
      }]
      console.log("JSON RULE DATA>>>>>>", jsonData);
      if (actionType == "saveNew") {
        this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
            }
          });
      }

      if (actionType == "update") {
        this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            if (res.status == 'Fail') {
              this.commonFunctions.alert("alert", res.description);
            } else {
              this.commonFunctions.alert("alert", res.description);
            }
          });
      }
    }
  }

  onFormSubmit_OnLoad(actionType: string, orderNo: string, hasAdvancedConditions: number) {
    if (hasAdvancedConditions == 1) {
      if (this.form_onLoadGroup_3.status != 'INVALID') {
        let ruleData: any[];
        let jsonData: any[];
        let step_0 = this.advancedResult;


        let step_1 = this.form_onLoadGroup_3.controls['step_1']?.value;
        let step_2 = this.form_onLoadGroup_3.controls['step_2']?.value;
        let step_3 = this.form_onLoadGroup_3.controls['step_3']?.value;
        let step_4 = this.form_onLoadGroup_3.controls['step_4']?.value;
        let step_6 = this.form_onLoadGroup_3.controls['step_6']?.value;
        let step_5 = this.form_onLoadGroup_3.controls['step_5']?.value;
        let step_5_1 = this.form_onLoadGroup_3.controls['step_5_1']?.value;
        let step_1_0 = this.form_onLoadGroup_3.controls['step_1_0']?.value;
        let step_1_0_1 = this.form_onLoadGroup_3.controls['step_1_0_1']?.value;
        let step_1_0_2 = this.form_onLoadGroup_3.controls['step_1_0_2']?.value;


        let step_44 = '';
        let step_33 = '';
        let whereCond = '';
        let step_2_7 = this.form_onChangeGroup.controls['step_2_7']?.value;

        let step_42 = this.form_onLoadGroup_3.controls['step_4_2_0']?.value;

        if (step_3 == 1) {
          step_33 = this.form_onLoadGroup_3.controls['step_3_1']?.value;
        } else if (step_3 == 2) {
          step_33 = this.form_onLoadGroup_3.controls['step_3_2']?.value;
          this.jsonEmpty = [{ queryId: step_33, parameters: [{ paramName: '', paramValue: '' }], link: [] }];
          this.http.post<any>(GlobalConstants.getQbeIdApi + step_33 + "/0", this.jsonEmpty, { headers: GlobalConstants.headers }).subscribe((data: any) => {
            this.form_onLoadGroup_3.controls['step_3_2_hidden'].setValue(data[0]);
          });
        }

        if (step_4 == 1 || step_4 == 2 || step_4 == 4 || step_4 == 5 || step_4 == 10 || step_4 == 11 || step_4 == 12 || step_4 == 13 || step_4 == 14) {
          step_44 = this.form_onLoadGroup_3.controls['step_4_1']?.value;
        } else if (step_4 == 7 || step_4 == 6) {
          step_44 = this.form_onLoadGroup_3.controls['step_4_0']?.value;
        } else if (step_4 == 3) {
          step_44 = this.form_onLoadGroup_3.controls['step_4_2']?.value;
        } else if (step_4 == 8) {
          step_44 = this.form_onLoadGroup_3.controls['step_4_0_1']?.value;
        }

        ruleData = [
          { step: 0, data: step_0 },
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 3, data: step_3 },
          { step: 33, data: step_33 },
          { step: 333, data: this.form_onLoadGroup_3.controls['step_3_2_hidden']?.value },
          { step: 4, data: step_4 },
          { step: 42, data: step_42 },
          { step: 44, data: step_44 },
          { step: 6, data: step_6 },
          { step: 27, data: step_2_7 },
          { step: 5, data: step_5 },
          { step: 51, data: step_5_1 },
          { step: 100, data: step_1_0 },
          { step: 101, data: step_1_0_1 },
          { step: 102, data: step_1_0_2 },
        ];

        let excludedToggle = this.form.controls['isExcluded']?.value;
        let excludedValue: number;
        if (excludedToggle == true) {
          excludedValue = 1;
        } else {
          excludedValue = 0;
        }

        jsonData = [{
          ruleId: this.lookupData[0].ruleId,
          ruleAction: this.selectedRuleAction,
          ruleData: JSON.stringify(ruleData),
          ruleDescription: this.form.controls['ruleDescription']?.value,
          actionType: this.form.controls['actionType']?.value,
          isExcluded: excludedValue,
          objectId: this.lookupData[0].objectId,
          updatedBy: this.userId,
          createdBy:this.userId,
          columnId: 0,
          orderNo: orderNo,
          hasAdvancedConditions: hasAdvancedConditions,
        }]
        if (actionType == "saveNew") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }

        if (actionType == "update") {
          this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }
      }
    } else {
      let action = this.form_onLoadGroup.controls['step_00']?.value;

      // Normal field conditon
      if (action == 3 || action == 1 || action == 2) {
        if (this.form_onLoadGroup_3.status != 'INVALID') {
          let ruleData: any[];
          let jsonData: any[];
          let step_0 = action;
          let step_1 = this.form_onLoadGroup_3.controls['step_1']?.value;
          let step_2 = this.form_onLoadGroup_3.controls['step_2']?.value;
          let step_3 = this.form_onLoadGroup_3.controls['step_3']?.value;
          let step_4 = this.form_onLoadGroup_3.controls['step_4']?.value;
          let step_6 = this.form_onLoadGroup_3.controls['step_6']?.value;
          let step_44 = '';
          let step_33 = '';
          let whereCond = '';
          let step_5 = this.form_onLoadGroup_3.controls['step_5']?.value;
          let step_5_1 = this.form_onLoadGroup_3.controls['step_5_1']?.value;
          let step_5_2 = this.form_onLoadGroup_3.controls['step_5_2']?.value;
          let step_1_0 = this.form_onLoadGroup_3.controls['step_1_0']?.value;
          let step_1_0_1 = this.form_onLoadGroup_3.controls['step_1_0_1']?.value;
          let step_1_0_2 = this.form_onLoadGroup_3.controls['step_1_0_2']?.value;
          let step_4_1 = this.form_onLoadGroup_3.controls['step_4_1']?.value;
          let step_3_1 = this.form_onLoadGroup_3.controls['step_3_1']?.value;
          // let step_2_9 = this.form_onLoadGroup_3.controls['step_2_9']?.value;
          // let step_3_0 = this.form_onLoadGroup_3.controls['step_3_0']?.value;
          // let step_3_0_1 = this.form_onLoadGroup_3.controls['step_3_0_1']?.value;


          let step_42 = this.form_onLoadGroup_3.controls['step_4_2_0']?.value;

          if (step_3 == 1) {
            step_33 = this.form_onLoadGroup_3.controls['step_3_1']?.value;
          } else if (step_3 == 2) {
            step_33 = this.form_onLoadGroup_3.controls['step_3_2']?.value;
            this.jsonEmpty = [{ queryId: step_33, parameters: [{ paramName: '', paramValue: '' }], link: [] }];
            this.http.post<any>(GlobalConstants.getQbeIdApi + step_33 + "/0", this.jsonEmpty, { headers: GlobalConstants.headers }).subscribe((data: any) => {
              this.form_onLoadGroup_3.controls['step_3_2_hidden'].setValue(data[0]);
            });
          }

          if (step_4 == 1 || step_4 == 2 || step_4 == 4 || step_4 == 5 || step_4 == 10 || step_4 == 11 || step_4 == 12 || step_4 == 13 || step_4 == 14) {
            step_44 = this.form_onLoadGroup_3.controls['step_4_1']?.value;
          } else if (step_4 == 7 || step_4 == 6) {
            step_44 = this.form_onLoadGroup_3.controls['step_4_0']?.value;
          } else if (step_4 == 3) {
            step_44 = this.form_onLoadGroup_3.controls['step_4_2']?.value;
          } else if (step_4 == 8) {
            step_44 = this.form_onLoadGroup_3.controls['step_4_0_1']?.value;
          }

          ruleData = [
            { step: 0, data: step_0 },
            { step: 1, data: step_1 },
            { step: 2, data: step_2 },
            { step: 3, data: step_3 },
            { step: 33, data: step_33 },
            { step: 333, data: this.form_onLoadGroup_3.controls['step_3_2_hidden']?.value },
            { step: 4, data: step_4 },
            { step: 44, data: step_44 },
            { step: 42, data: step_42 },
            { step: 6, data: step_6 },
            { step: 5, data: step_5 },
            { step: 51, data: step_5_1 },
            { step: 52, data: step_5_2 },
            { step: 10, data: step_1_0 },
            { step: 101, data: step_1_0_1 },
            { step: 102, data: step_1_0_2 },
            { step: 41, data: step_4_1 },
            { step: 31, data: step_3_1 },
            // { step: 29, data: step_2_9 },
            // { step: 30, data: step_3_0 },
            // { step: 301, data: step_3_0_1 }
          ];


          let excludedToggle = this.form.controls['isExcluded']?.value;
          let excludedValue: number;
          if (excludedToggle == true) {
            excludedValue = 1;
          } else {
            excludedValue = 0;
          }

          jsonData = [{
            ruleId: this.lookupData[0].ruleId,
            ruleAction: this.selectedRuleAction,
            ruleData: JSON.stringify(ruleData),
            ruleDescription: this.form.controls['ruleDescription']?.value,
            actionType: this.form.controls['actionType']?.value,
            isExcluded: excludedValue,
            objectId: this.lookupData[0].objectId,
            updatedBy: this.userId,
            createdBy:this.userId,
            columnId: 0,
            orderNo: orderNo,
            hasAdvancedConditions: hasAdvancedConditions,
          }]
          if (actionType == "saveNew") {
            console.log("JSON RULE DATA>>>>>>", jsonData);

            this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
              (res: any) => {
                if (res.status == 'Fail') {
                  this.commonFunctions.alert("alert", res.description);
                } else {
                  this.commonFunctions.alert("alert", res.description);
                }
              });
          }

          if (actionType == "update") {
            this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
              (res: any) => {
                if (res.status == 'Fail') {
                  this.commonFunctions.alert("alert", res.description);
                } else {
                  this.commonFunctions.alert("alert", res.description);
                }
              });
          }
        }
      }
    }

  }

  onFormSubmit_OnWhereCondition(actionType: string, orderNo: string, hasAdvancedConditions: number) {
    if (hasAdvancedConditions == 1) {
      if (this.form_whereCondition.status != 'INVALID') {
        let ruleData: any[];
        let jsonData: any[];
        let step_0 = this.form_whereCondition.controls['step_0']?.value;
        let step_1 = this.form_whereCondition.controls['step_1']?.value;
        let step_2 = this.form_whereCondition.controls['step_2']?.value;
        let step_3 = this.form_whereCondition.controls['step_3']?.value;
        let step_33 = '';
        let whereCond = '';


        if (step_3 == 1) {
          step_33 = this.form_whereCondition.controls['step_3_1']?.value;
        } else if (step_3 == 2) {
          step_33 = this.form_whereCondition.controls['step_3_2']?.value;
          this.jsonEmpty = [{ queryId: step_33, parameters: [{ paramName: '', paramValue: '' }], link: [] }];
          this.http.post<any>(GlobalConstants.getQbeIdApi + step_33 + "/0", this.jsonEmpty, { headers: GlobalConstants.headers }).subscribe((data: any) => {
            this.form_whereCondition.controls['step_3_2_hidden'].setValue(data[0]);
          });
        }

        ruleData = [
          { step: 0, data: step_0 },
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 3, data: step_3 },
          { step: 33, data: step_33 },
          { step: 333, data: this.form_whereCondition.controls['step_3_2_hidden']?.value }
        ];

        let excludedToggle = this.form.controls['isExcluded']?.value;
        let excludedValue: number;
        if (excludedToggle == true) {
          excludedValue = 1;
        } else {
          excludedValue = 0;
        }

        jsonData = [{
          ruleId: this.lookupData[0].ruleId,
          ruleAction: this.selectedRuleAction,
          ruleData: JSON.stringify(ruleData),
          ruleDescription: this.form.controls['ruleDescription']?.value,
          actionType: this.form.controls['actionType']?.value,
          isExcluded: excludedValue,
          objectId: this.lookupData[0].objectId,
          updatedBy: this.userId,
          createdBy:this.userId,
          columnId: this.lookupData[0].columnId,
          orderNo: orderNo,
          hasAdvancedConditions: hasAdvancedConditions,
        }]

        if (actionType == "saveNew") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }

        if (actionType == "update") {
          this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }
      }
    } else {
      if (this.form_whereCondition.status != 'INVALID') {
        let ruleData: any[];
        let jsonData: any[];
        let step_0 = this.form_whereCondition.controls['step_0']?.value;
        let step_1 = this.form_whereCondition.controls['step_1']?.value;
        let step_2 = this.form_whereCondition.controls['step_2']?.value;
        let step_3 = this.form_whereCondition.controls['step_3']?.value;
        let step_33 = '';
        let whereCond = '';


        if (step_3 == 1) {
          step_33 = this.form_whereCondition.controls['step_3_1']?.value;
        } else if (step_3 == 2) {
          step_33 = this.form_whereCondition.controls['step_3_2']?.value;
          this.jsonEmpty = [{ queryId: step_33, parameters: [{ paramName: '', paramValue: '' }], link: [] }];
          this.http.post<any>(GlobalConstants.getQbeIdApi + step_33 + "/0", this.jsonEmpty, { headers: GlobalConstants.headers }).subscribe((data: any) => {
            this.form_whereCondition.controls['step_3_2_hidden'].setValue(data[0]);
          });
        }

        ruleData = [
          { step: 0, data: step_0 },
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 3, data: step_3 },
          { step: 33, data: step_33 },
          { step: 333, data: this.form_whereCondition.controls['step_3_2_hidden']?.value }
        ];

        let excludedToggle = this.form.controls['isExcluded']?.value;
        let excludedValue: number;
        if (excludedToggle == true) {
          excludedValue = 1;
        } else {
          excludedValue = 0;
        }

        jsonData = [{
          ruleId: this.lookupData[0].ruleId,
          ruleAction: this.selectedRuleAction,
          ruleData: JSON.stringify(ruleData),
          ruleDescription: this.form.controls['ruleDescription']?.value,
          actionType: this.form.controls['actionType']?.value,
          isExcluded: excludedValue,
          objectId: this.lookupData[0].objectId,
          updatedBy: this.userId,
          createdBy:this.userId,
          columnId: this.lookupData[0].columnId,
          orderNo: orderNo,
          hasAdvancedConditions: hasAdvancedConditions,
        }]

        if (actionType == "saveNew") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }

        if (actionType == "update") {
          this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }
      }
    }
  }

  onFormSubmit_OnBeforeSave(actionType: string, orderNo: string, hasAdvancedConditions: number) {
    if (hasAdvancedConditions == 1) {
      if (this.form_onBeforeSave.status != 'INVALID') {
        let ruleData: any[];
        let jsonData: any[];
        let step_0 = this.advancedResult;
        let step_1 = this.form_onBeforeSave.controls['step_1']?.value;
        let step_2 = this.form_onBeforeSave.controls['step_2']?.value;
        let step_3 = this.form_onBeforeSave.controls['step_3']?.value;
        let step_4 = this.form_onBeforeSave.controls['step_4']?.value;
        let step_5 = this.form_onBeforeSave.controls['step_5']?.value;
        let step_6 = this.form_onBeforeSave.controls['step_6']?.value;
        let step_7 = this.form_onBeforeSave.controls['step_7']?.value;
        let step_8 = this.form_onBeforeSave.controls['step_8']?.value;


        ruleData = [
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 3, data: step_3 },
          { step: 4, data: step_4 },
          { step: 5, data: step_5 },
          { step: 6, data: step_6 },
          { step: 7, data: step_7 },
          { step: 8, data: step_8 },
          { step: 0, data: step_0 }
        ];

        let excludedToggle = this.form.controls['isExcluded']?.value;
        let excludedValue: number;
        if (excludedToggle == true) {
          excludedValue = 1;
        } else {
          excludedValue = 0;
        }

        jsonData = [{
          ruleAction: this.selectedRuleAction,
          ruleData: JSON.stringify(ruleData),
          ruleDescription: this.form.controls['ruleDescription']?.value,
          actionType: this.form.controls['actionType']?.value,
          isExcluded: excludedValue,
          objectId: this.lookupData[0].objectId,
          createdBy: this.userId,
          columnId: this.lookupData[0].columnId,
          orderNo: orderNo,
          hasAdvancedConditions: hasAdvancedConditions
        }];

        if (actionType == "saveNew") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }

        if (actionType == "update") {
          this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }
      }
    }
    else {
      if (this.form_onBeforeSave.status != 'INVALID') {
        let ruleData: any[];
        let jsonData: any[];
        let step_1 = this.form_onBeforeSave.controls['step_1']?.value;
        let step_2 = this.form_onBeforeSave.controls['step_2']?.value;
        let step_3 = this.form_onBeforeSave.controls['step_3']?.value;
        let step_4 = this.form_onBeforeSave.controls['step_4']?.value;
        let step_5 = this.form_onBeforeSave.controls['step_5']?.value;
        let step_6 = this.form_onBeforeSave.controls['step_6']?.value;
        let step_7 = this.form_onBeforeSave.controls['step_7']?.value;
        let step_8 = this.form_onBeforeSave.controls['step_8']?.value;

        ruleData = [
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 3, data: step_3 },
          { step: 4, data: step_4 },
          { step: 5, data: step_5 },
          { step: 6, data: step_6 },
          { step: 7, data: step_7 },
          { step: 8, data: step_8 }
        ];

        let excludedToggle = this.form.controls['isExcluded']?.value;
        let excludedValue: number;
        if (excludedToggle == true) {
          excludedValue = 1;
        } else {
          excludedValue = 0;
        }

        jsonData = [{
          ruleAction: this.selectedRuleAction,
          ruleData: JSON.stringify(ruleData),
          ruleDescription: this.form.controls['ruleDescription']?.value,
          actionType: this.form.controls['actionType']?.value,
          isExcluded: excludedValue,
          objectId: this.lookupData[0].objectId,
          createdBy: this.userId,
          columnId: this.lookupData[0].columnId,
          orderNo: orderNo,
          hasAdvancedConditions: hasAdvancedConditions
        }];

        if (actionType == "saveNew") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }

        if (actionType == "update") {
          this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }
      }
    }


  }

  onFormSubmit_onAfterSave(actionType: string, orderNo: string, hasAdvancedConditions: number) {
    if (hasAdvancedConditions == 1) {
      if (this.form_onAfterSave.status != 'INVALID') {
        let ruleData: any[];
        // let DataForCallingApi: any[];
        //rony 

        let jsonData: any[];
        let step_0 = this.advancedResult;
        let step_1 = this.form_onAfterSave.controls['step_1']?.value;
        let step_2 = this.form_onAfterSave.controls['step_2']?.value;
        let step_21 = this.form_onAfterSave.controls['step_2_1']?.value;
        let step_3 = this.form_onAfterSave.controls['step_3']?.value;
        let step_31 = this.form_onAfterSave.controls['step_3_1']?.value;
        let step_4 = this.form_onAfterSave.controls['step_4']?.value;
        let step_4_1 = this.form_onAfterSave.controls['step_4_1']?.value;
        let step_4_2 = this.form_onAfterSave.controls['step_4_2']?.value;
        let step_4_3 = this.form_onAfterSave.controls['step_4_3']?.value;
        let step_4_4 = this.form_onAfterSave.controls['step_4_4']?.value;
        let step_4_5 = this.form_onAfterSave.controls['step_4_5']?.value;
        let step_4_6 = this.form_onAfterSave.controls['step_4_6']?.value;
        let step_4_7 = this.form_onAfterSave.controls['step_4_7']?.value;

        ruleData = [
          // 
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 21, data: step_21 },
          { step: 3, data: step_3 },
          { step: 31, data: step_31 },
          { step: 4, data: step_4 },
          { step: 41, data: step_4_1 },
          { step: 42, data: step_4_2 },
          { step: 43, data: step_4_3 },
          { step: 44, data: step_4_4 },
          { step: 45, data: step_4_5 },
          { step: 46, data: step_4_6 },
          { step: 47, data: step_4_7 },
          { step: 0, data: step_0 }

        ];

        let excludedToggle = this.form.controls['isExcluded']?.value;
        let excludedValue: number;
        if (excludedToggle == true) {
          excludedValue = 1;
        } else {
          excludedValue = 0;
        }

        jsonData = [{
          ruleAction: this.selectedRuleAction,
          ruleData: JSON.stringify(ruleData),
          ruleDescription: this.form.controls['ruleDescription']?.value,
          actionType: this.form.controls['actionType']?.value,
          isExcluded: excludedValue,
          objectId: this.lookupData[0].objectId,
          createdBy: this.userId,
          columnId: this.lookupData[0].columnId,
          orderNo: orderNo,
          hasAdvancedConditions: hasAdvancedConditions,
        }];

        if (actionType == "saveNew") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }

        if (actionType == "update") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }
      }
    } else {
      if (this.form_onAfterSave.status != 'INVALID') {
        let ruleData: any[];
        // let DataForCallingApi: any[];
        //rony 
        let jsonData: any[];
        let step_1 = this.form_onAfterSave.controls['step_1']?.value;
        let step_2 = this.form_onAfterSave.controls['step_2']?.value;
        let step_21 = this.form_onAfterSave.controls['step_2_1']?.value;
        let step_3 = this.form_onAfterSave.controls['step_3']?.value;
        let step_31 = this.form_onAfterSave.controls['step_3_1']?.value;
        let step_4 = this.form_onAfterSave.controls['step_4']?.value;
        let step_4_1 = this.form_onAfterSave.controls['step_4_1']?.value;
        let step_4_2 = this.form_onAfterSave.controls['step_4_2']?.value;
        let step_4_3 = this.form_onAfterSave.controls['step_4_3']?.value;
        let step_4_4 = this.form_onAfterSave.controls['step_4_4']?.value;
        let step_4_5 = this.form_onAfterSave.controls['step_4_5']?.value;
        let step_4_6 = this.form_onAfterSave.controls['step_4_6']?.value;
        let step_4_7 = this.form_onAfterSave.controls['step_4_7']?.value;

        ruleData = [
          { step: 1, data: step_1 },
          { step: 2, data: step_2 },
          { step: 21, data: step_21 },
          { step: 3, data: step_3 },
          { step: 31, data: step_31 },
          { step: 4, data: step_4 },
          { step: 41, data: step_4_1 },
          { step: 42, data: step_4_2 },
          { step: 43, data: step_4_3 },
          { step: 44, data: step_4_4 },
          { step: 45, data: step_4_5 },
          { step: 46, data: step_4_6 },
          { step: 47, data: step_4_7 }

        ];

        let excludedToggle = this.form.controls['isExcluded']?.value;
        let excludedValue: number;
        if (excludedToggle == true) {
          excludedValue = 1;
        } else {
          excludedValue = 0;
        }

        jsonData = [{
          ruleAction: this.selectedRuleAction,
          ruleData: JSON.stringify(ruleData),
          ruleDescription: this.form.controls['ruleDescription']?.value,
          actionType: this.form.controls['actionType']?.value,
          isExcluded: excludedValue,
          objectId: this.lookupData[0].objectId,
          createdBy: this.userId,
          columnId: this.lookupData[0].columnId,
          orderNo: orderNo,
          hasAdvancedConditions: hasAdvancedConditions,
        }];

        if (actionType == "saveNew") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.saveDRBRule, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }

        if (actionType == "update") {
          console.log("JSON RULE DATA>>>>>>", jsonData);

          this.http.post<any>(GlobalConstants.updateDRBRule + this.lookupData[0].ruleId, jsonData, { headers: GlobalConstants.headers }).subscribe(
            (res: any) => {
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                this.commonFunctions.alert("alert", res.description);
              }
            });
        }
      }
    }
  }

  //function submit call all function for every type
  onFormSubmit() {
    let actionType = this.lookupData[0].actionType;
    let orderNo = this.form.controls['orderNo']?.value;
    let valueOfToggle = this.form.controls['hasAdvancedConditions']?.value;
    let hasAdvancedConditions: number;

    if (valueOfToggle == true) {
      hasAdvancedConditions = 1
    } else {
      hasAdvancedConditions = 0
    }
    // On Change
    if (this.selectedRuleAction == "1") {
      this.onFormSubmit_OnChange(actionType, orderNo, hasAdvancedConditions);
    }

    // On Load
    if (this.selectedRuleAction == "2") {
      this.onFormSubmit_OnLoad(actionType, orderNo, hasAdvancedConditions);
    }

    // On Before Save
    if (this.selectedRuleAction == "3") {
      this.onFormSubmit_OnBeforeSave(actionType, orderNo, hasAdvancedConditions);
    }

    // On After Save
    if (this.selectedRuleAction == "4") {
      this.onFormSubmit_onAfterSave(actionType, orderNo, hasAdvancedConditions);
    }

    // OnWhereCondition
    if (this.selectedRuleAction == "5") {
      this.onFormSubmit_OnWhereCondition(actionType, orderNo, hasAdvancedConditions);
    }
  }

  //Close Form
  closeDialog(): void {
    this.informationservice.setFirstOpenGrid('1');

    this.dialogRef.close();
    this.refreshService.notifyOther({ refresh: true });
  }

  //show and hide advanced Button
  showAdvancedConditions() {
    // $(".hasAdvancedConditions").toggleClass("hidden");
    if (this.form.controls['hasAdvancedConditions']?.value == true) {
      $(".hasAdvancedConditions").show();
    } else {
      $(".hasAdvancedConditions").hide();
    }
  }

  //open advanced Grid 
  openAdvancedConditions() {
    let data = [{ objectId: this.lookupData[0].objectId, advancedRuleData: this.advancedRuleData }];
    const dialogRef = this.dialog.open(AdvancedFormComponent, {
      width: "1000px",
      height: "500px",
      data: data
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        $(".hasAdvancedConditions").show();
      }
      else if (result == 0) {
        this.form.controls['hasAdvancedConditions'].setValue(false);
        $(".hasAdvancedConditions").hide();
      }
      else {

        this.advancedConditionsAr = result;
        this.advancedResult = JSON.stringify(this.advancedConditionsAr);

        if (this.advancedResult == undefined) {
          this.advancedConditionsYesOrNo = 0;
          this.form.controls['hasAdvancedConditions'].setValue(false);
          $(".hasAdvancedConditions").hide();
        } else {
          this.advancedConditionsYesOrNo = 1;
        }

        if (this.advancedRuleData != '') {
          //return from update grid
        } else {
          let value = this.form.controls['step_0']?.value;
          if (value == '1') {
            this.onChangedSteps('step_1', value);
          }
          else if (value == '2') {
            this.onChangedSteps('step_00', value);
          }
          else if (value == '3') {
            this.onChangedSteps('step_1', value);
          }
        }
      }
    });
  }
}
