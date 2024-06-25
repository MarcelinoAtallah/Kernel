import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { cdsHtml } from './cds';
import { CdsInstancesHtml } from './cds-logs/cds-instances/cds-instances.component';
import { InterfaceInstancesHTML } from './cds-logs/interface-instances/interface-instances.component';
import { Mapping } from './cds-project/mapping/mapping.component'
import { MappingForm } from './cds-project/mapping/mapping-form/mapping-form.component';
import { ProjectComponent } from './cds-project/mapping-form/project/project.component';
import { FileDefinitionComponent } from './cds-project/mapping-form/file-definition/file-definition.component';
import { StagingTablesComponent } from './cds-project/mapping-form/staging-tables/staging-tables.component';
import { AllSimulationComponent } from './cds-project/mapping-form/all-simulation/all-simulation.component';
import { InterfacesInventoryComponent } from './cds-project/mapping-form/interfaces-inventory/interfaces-inventory.component';
import { WebServiceComponent } from './cds-project/mapping-form/web-service/web-service.component';
import { CrossReferencingComponent } from './cds-project/mapping-form/cross-referencing/cross-referencing.component';
import { ProjectFormComponent } from './cds-project/mapping-form/project/project-form/project-form.component';
import { FileDefinitionFormComponent } from './cds-project/mapping-form/file-definition/file-definition-form/file-definition-form.component';
import { CrossRefFormComponent } from './cds-project/mapping-form/cross-referencing/cross-ref-form/cross-ref-form.component';
import { DynamicScreenComponent } from '../in-display/screen-builder/dynamic-screen/dynamic-screen.component';

const routes: Routes = [
   {
      path: '',
      component: cdsHtml,
      children: [
         {
            path: 'mappingProject',
            data: { breadcrumb: 'Mapping' },
            children: [
               {
                  path: '',
                  component: Mapping
               },
               {
                  path: 'form/:actionType/:id',
                  component: MappingForm,
                  data: { breadcrumb: 'Mapping Form' }

               }
            ]
         },
         {
            path: 'mainProject',
            data: { breadcrumb: 'Project' },
            children: [
               {
                  path: '',
                  component: ProjectComponent,
               },
               {
                  path: 'form/:actionType/:id',
                  component: ProjectFormComponent,
                  data: { breadcrumb: 'Project Form' }
               }
            ]
         },
         {
            path: 'cdsDocs',
            data: { breadcrumb: 'file Definition' },
            children: [
               {
                  path: '',
                  component: FileDefinitionComponent,
               },
               {
                  path: 'form/:actionType/:id',
                  component: FileDefinitionFormComponent,
                  data: { breadcrumb: 'Project Form' }
               }
            ]
         },
         {
            path: 'stagingTable',
            component: StagingTablesComponent,
            data: { breadcrumb: 'Staging Tables' }
         },
         {
            path: 'allSimul',
            component: AllSimulationComponent,
            data: { breadcrumb: 'All Simulation' }
         },
         {
            path: 'cdsImportInterface',
            component: InterfacesInventoryComponent,
            data: { breadcrumb: 'Interfaces Inventory' }
         },
         {
            path: 'cdsWebService',
            component: WebServiceComponent,
            data: { breadcrumb: 'Web Service' }
         },
         {
            path: 'crossRef',
            data: { breadcrumb: 'Cross Referencing' },
            children: [
               {
                  path: '',
                  component: CrossReferencingComponent
               },
               {
                  path: 'form/:actionType/:id',
                  component: CrossRefFormComponent,
                  data: { breadcrumb: 'Cross Referencing Form' }

               }
            ]
         },{
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
export class CdsRoutingModule { }
