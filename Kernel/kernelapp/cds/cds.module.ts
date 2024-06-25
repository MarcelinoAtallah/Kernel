import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { MaterialModule } from '../../custom-modules/material.module';
import { cdsHtml } from './cds';
import { GlobalConstants } from '../../common/GlobalConstants';
import { CdsInstancesHtml } from './cds-logs/cds-instances/cds-instances.component';
import { InterfaceInstancesHTML } from './cds-logs/interface-instances/interface-instances.component';
import { Mapping } from './cds-project/mapping/mapping.component';
import { MappingForm } from './cds-project/mapping/mapping-form/mapping-form.component';
import { ProjectComponent } from './cds-project/mapping-form/project/project.component';
import { FileDefinitionComponent } from './cds-project/mapping-form/file-definition/file-definition.component';
import { StagingTablesComponent } from './cds-project/mapping-form/staging-tables/staging-tables.component';
import { AllSimulationComponent } from './cds-project/mapping-form/all-simulation/all-simulation.component';
import { InterfacesInventoryComponent } from './cds-project/mapping-form/interfaces-inventory/interfaces-inventory.component';
import { WebServiceComponent } from './cds-project/mapping-form/web-service/web-service.component';
import { IntegrationInstancesComponent } from './cds-project/mapping-form/integration-instances/integration-instances.component';
import { InterfaceInstancesComponent } from './cds-project/mapping-form/interface-instances/interface-instances.component';
import { CrossReferencingComponent } from './cds-project/mapping-form/cross-referencing/cross-referencing.component';
import { ProjectFormComponent } from './cds-project/mapping-form/project/project-form/project-form.component';
import { FileDefinitionFormComponent } from './cds-project/mapping-form/file-definition/file-definition-form/file-definition-form.component';
import { MappingSourceComponent } from './cds-project/mapping-form/mapping-source/mapping-source.component';
import { MappingDestinationComponent } from './cds-project/mapping-form/mapping-destination/mapping-destination.component';
import { MappingDefaultingComponent } from './cds-project/mapping-form/mapping-defaulting/mapping-defaulting.component';
import { MappingFileNameComponent } from './cds-project/mapping-form/mapping-file-name/mapping-file-name.component';
import { CrossRefFormComponent } from './cds-project/mapping-form/cross-referencing/cross-ref-form/cross-ref-form.component';

@NgModule({
  declarations: [
    cdsHtml,
    CdsInstancesHtml,
    InterfaceInstancesHTML,
    Mapping,
    MappingForm,
    ProjectComponent,
    FileDefinitionComponent,
    StagingTablesComponent,
    AllSimulationComponent,
    InterfacesInventoryComponent,
    WebServiceComponent,
    IntegrationInstancesComponent,
    InterfaceInstancesComponent,
    CrossReferencingComponent,
    ProjectFormComponent,
    FileDefinitionFormComponent,
    MappingSourceComponent,
    MappingDestinationComponent,
    MappingDefaultingComponent,
    MappingFileNameComponent,
    CrossRefFormComponent
  ],
  imports: [ComponentsModule, MaterialModule],
  exports: [],
  providers: [GlobalConstants],
  bootstrap: [],
})
export class CdsModule {}
