import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { MaterialModule } from '../../custom-modules/material.module'
import { GlobalConstants } from "../../common/GlobalConstants";
import { WorkflowComponent } from './workflow.component';
import { StatusconfigurationComponent } from './settings/statusconfiguration/statusconfiguration.component';
import { ExternalhyperlinksComponent } from './settings/externalhyperlinks/externalhyperlinks.component';
import { VacationcoverageComponent } from './settings/vacationcoverage/vacationcoverage.component';
import { ServerparamComponent } from './settings/serverparam/serverparam.component';
import { InternalsettingsComponent } from './settings/internalsettings/internalsettings.component';
import { JmssettingsComponent } from './settings/jmssettings/jmssettings.component';
import { WfbuilderComponent } from './wfbuilder/wfbuilder.component';
import { BatchedactivitiesComponent } from './monitor/bam/batchedactivities/batchedactivities.component';
import { ScheduledactivitiesComponent } from './monitor/bam/scheduledactivities/scheduledactivities.component';
import { AlertsComponent } from './monitor/bam/alerts/alerts.component';
import { TodolistComponent } from './monitor/bam/todolist/todolist.component';
import { HistoricalqueriesComponent } from './monitor/bam/historicalqueries/historicalqueries.component';
import { CurrentqueriesComponent } from './monitor/bam/currentqueries/currentqueries.component';
import { LastwfmComponent } from './monitor/bam/lastwfm/lastwfm.component';
import { InvalidprocessComponent } from './monitor/diagnosis/invalidprocess/invalidprocess.component';
import { MissingdocumentComponent } from './monitor/diagnosis/missingdocument/missingdocument.component';
import { RunningprocessComponent } from './monitor/diagnosis/runningprocess/runningprocess.component';
import { UnusedtriggerComponent } from './monitor/diagnosis/unusedtrigger/unusedtrigger.component';
import { LogbyprocessComponent } from './historylogging/logbyprocess/logbyprocess.component';
import { AddressbookComponent } from './settings/addressbook/addressbook.component';
import { LogbyactivityComponent } from './historylogging/logbyactivity/logbyactivity.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    WorkflowComponent,
    StatusconfigurationComponent,
    ExternalhyperlinksComponent,
    VacationcoverageComponent,
    ServerparamComponent,
    InternalsettingsComponent,
    JmssettingsComponent,
    WfbuilderComponent,
    BatchedactivitiesComponent,
    ScheduledactivitiesComponent,
    AlertsComponent,
    TodolistComponent,
    HistoricalqueriesComponent,
    CurrentqueriesComponent,
    LastwfmComponent,
    InvalidprocessComponent,
    MissingdocumentComponent,
    RunningprocessComponent,
    UnusedtriggerComponent,
    LogbyprocessComponent,
    AddressbookComponent,
    LogbyactivityComponent
    
  ],
  imports: [
    ComponentsModule,
    MaterialModule,
    MatDialogModule,
  ],
  exports:[],
  providers:[GlobalConstants],
  bootstrap:[],
})
export class WorkflowModule { }