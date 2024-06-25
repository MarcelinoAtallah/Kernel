import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { AddressbookComponent } from './settings/addressbook/addressbook.component';
import { ComponentsModule } from '../..//components/components.module';
import { MaterialModule } from '../../custom-modules/material.module'
import { GlobalConstants } from "../../common/GlobalConstants";
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
import { LogbyactivityComponent } from './historylogging/logbyactivity/logbyactivity.component';
import { DynamicScreenComponent } from '../in-display/screen-builder/dynamic-screen/dynamic-screen.component';

const routes: Routes = [
   {
       path: '',
       component: WorkflowComponent,
      children:[

         //WF BUILDER
         {
            path: 'wfmBuilder',
            data: { breadcrumb: 'WF Builder '},
            children: [
               {
                  path: '',
                  component: WfbuilderComponent
               },
               
            ]
         },

         //MONITOR--BAM
         {
            path: 'wfmBatchedAct',
            data: { breadcrumb: 'Batched Activities '},
            children: [
               {
                  path: '',
                  component: BatchedactivitiesComponent
               },
               
            ]
         },
         {
            path: 'wfmScheduledAct',
            data: { breadcrumb: 'Scheduled Activities '},
            children: [
               {
                  path: '',
                  component: ScheduledactivitiesComponent
               },
               
            ]
         },
         {
            path: 'wfmAlerts',
            data: { breadcrumb: 'Alerts '},
            children: [
               {
                  path: '',
                  component:AlertsComponent
               },
               
            ]
         },
         {
            path: 'wfmToDoList',
            data: { breadcrumb: 'To Do List '},
            children: [
               {
                  path: '',
                  component:TodolistComponent
               },
               
            ]
         },
         {
            path: 'wfmHistoricalQueries',
            data: { breadcrumb: 'Historical Queries '},
            children: [
               {
                  path: '',
                  component:HistoricalqueriesComponent
               },
               
            ]
         },
         {
            path: 'wfmCurrentQueries',
            data: { breadcrumb: 'Current Queries '},
            children: [
               {
                  path: '',
                  component:CurrentqueriesComponent
               },
               
            ]
         },
         {
            path: 'wfmLastExecutions',
            data: { breadcrumb: 'Last WFM Executions '},
            children: [
               {
                  path: '',
                  component:LastwfmComponent
               },
               
            ]
         },

         //MONITOR--DIAGNOSIS
         {
            path: 'wfmInvalidProcess',
            data: { breadcrumb: 'Invalid Process '},
            children: [
               {
                  path: '',
                  component:InvalidprocessComponent
               },
               
            ]
         },
         {
            path: 'wfmMissingDoc',
            data: { breadcrumb: 'Missing Document '},
            children: [
               {
                  path: '',
                  component:MissingdocumentComponent
               },
               
            ]
         },
         {
            path: 'wfmRunningProc',
            data: { breadcrumb: 'Running Process '},
            children: [
               {
                  path: '',
                  component:RunningprocessComponent
               },
               
            ]
         },
         {
            path: 'wfmUnusedTrigger',
            data: { breadcrumb: 'Unused Trigger '},
            children: [
               {
                  path: '',
                  component:UnusedtriggerComponent
               },
               
            ]
         },

         //HISTORY LOGGING
         {
            path: 'wfmLogByProc1',
            data: { breadcrumb: 'Log By Process '},
            children: [
               {
                  path: '',
                  component:LogbyprocessComponent
               },
                
            ]
         },
         {
            path: 'wfmLogByAct',
            data: { breadcrumb: 'Log By Activity '},
            children: [
               {
                  path: '',
                  component:LogbyactivityComponent
               },
               
            ]
         },

         // SETTINGS
         {
            path: 'configSettingsAddrBook',
            data: { breadcrumb: 'Address Book '},
            children: [
               {
                  path: '',
                  component: AddressbookComponent
               },
               
            ]
         },
         {
            path: 'configSettingsStatus',
            data: { breadcrumb: 'Status Configuration '},
            children: [
               {
                  path: '',
                  component: StatusconfigurationComponent,
               },
               
            ]
         },
         {
            path: 'configSettingsExtHyperlink ',
            data: { breadcrumb: 'External Hyperlinks '},
            children: [
               {
                  path: '',
                  component: ExternalhyperlinksComponent,
               },
               
            ]
         },
         {
            path: 'configSettingsVacCov',
            data: { breadcrumb: 'Vacation Coverage '},
            children: [
               {
                  path: '',
                  component: VacationcoverageComponent,
               },
               
            ]
         },
         {
            path: 'configSettingsSrvParam',
            data: { breadcrumb: 'Server Param '},
            children: [
               {
                  path: '',
                  component: ServerparamComponent,
               },
               
            ]
         },
         {
            path: 'configSettingsIntSetting',
            data: { breadcrumb: 'Internal Settings '},
            children: [
               {
                  path: '',
                  component: InternalsettingsComponent,
               },
               
            ]
         },
         {
            path: 'configSettingsJMSSetting',
            data: { breadcrumb: 'JMS settings '},
            children: [
               {
                  path: '',
                  component: JmssettingsComponent,
               },
               
            ]
         },
         {
            path: 'dynamicScreen/:menuVariable',
            data: { breadcrumb: 'Screen' },
            children: [
               {
                  path: '',
                  component: DynamicScreenComponent
               }
            ]
         }
      ],
      
   }];


   @NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule],
      declarations: []
   })
   export class WorkflowRoutingModule { }
