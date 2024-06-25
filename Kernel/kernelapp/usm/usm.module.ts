import { NgModule } from '@angular/core';
import { MaterialModule } from '../../custom-modules/material.module'
import { CommonModules } from '../../custom-modules/common.module'
import { ComponentsModule } from '../../components/components.module';

import { USMComponent } from './usm.component';
import { Usermanagement } from './securitymanagement/usermanagement/usermanagement.component';
import { GlobalConstants } from "../../common/GlobalConstants";
import { Usermanagementform } from './securitymanagement/usermanagement/usermanagementform/usermanagementform.component';
import { AccessrightsComponent } from './securitymanagement/usermanagement/accessrights/accessrights.component';
import { USMRole } from './securitymanagement/roles/roles';
import { RolesForm } from './securitymanagement/roles/rolesForm/rolesForm';
import { LdapRolesMapping } from './securitymanagement/roles/rolesForm/ldapRolesMapping/ldapRolesMapping';
import { LdapRolesMappingForm } from './securitymanagement/roles/rolesForm/ldapRolesMapping/ldapRolesMappingForm/ldapRolesMappingForm';
import { DatePipe, CommonModule } from '@angular/common';
import { InvalidloginComponent } from './logs/invalidlogin/invalidlogin';
import { FieldhistorylogComponent } from './logs/fieldhistorylog/fieldhistorylog';
import { FiltersComponent } from './logs/filters/filters';
import { ServerParametersComponent } from './parameters/wfmparams/serverparameters/serverparameters';
import { GeneralparametersComponent } from './parameters/dataparams/generalparameters/generalparameters';
import { LdapconfigurationComponent } from './parameters/sysparams/ldapconfiguration/ldapconfiguration';
import { LdapconfigurationformComponent } from './parameters/sysparams/ldapconfiguration/ldapconfigurationform/ldapconfigurationform';
import { PasswordsettingsComponent } from './parameters/sysparams/passwordsettings/passwordsettings';
import { Generalparameters } from './parameters/sysparams/generalparameters/generalparameters';
import { RoletypeservicelinkComponent } from './parameters/sysparams/roletypeservicelink/roletypeservicelink';
import { RoletypeservicelinkformComponent } from './parameters/sysparams/roletypeservicelink/roletypeservicelinkform/roletypeservicelinkform';
import { QueriesmonitoringComponent } from './parameters/reportingparams/queriesmonitoring/queriesmonitoring';
import { QueriesmonitoringformComponent } from './parameters/reportingparams/queriesmonitoring/queriesmonitoringform/queriesmonitoringform';
import { Generalparameter } from './parameters/reportingparams/generalparameter/generalparameter';
import { IntegrationstatusComponent } from './parameters/integrationparams/integrationstatus/integrationstatus';
import { IntegrationstatusformComponent } from './parameters/integrationparams/integrationstatus/integrationstatusform/integrationstatusform';
import { InterfacestatusComponent } from './parameters/integrationparams/interfacestatus/interfacestatus';
import { InterfacestatusformComponent } from './parameters/integrationparams/interfacestatus/interfacestatusform/interfacestatusform';
import { LogsByHeatmapComponent } from './logs/logs-by-heatmap/logs-by-heatmap.component';
import { GroupMappingTabComponent } from './securitymanagement/usermanagement/group-mapping-tab/group-mapping-tab.component';
import { LogsByObjectComponent } from './logs/logs-by-object/logs-by-object.component';
import { LogsbyuserComponent } from './logs/logsbyuser/logsbyuser.component';
import { UserFormComponent } from './securitymanagement/usermanagement/user-form/user-form.component';
import { RoleSanctionComponent } from './securitymanagement/roles/rolesForm/ldapRolesMapping/role-sanction/role-sanction.component';
import { FormRoleSanctionComponent } from './securitymanagement/roles/rolesForm/ldapRolesMapping/role-sanction/form-role-sanction/form-role-sanction.component';
import { RoleUsersComponent } from './securitymanagement/roles/role-users/role-users.component';

@NgModule({
  declarations: [
    USMComponent,
    Usermanagement,
    Usermanagementform,
    AccessrightsComponent,
    USMRole,
    RolesForm,
    LdapRolesMapping,
    LdapRolesMappingForm,
    InvalidloginComponent,
    LogsByHeatmapComponent,
    FieldhistorylogComponent,
    FiltersComponent,
    ServerParametersComponent,
    GeneralparametersComponent,
    LdapconfigurationComponent,
    LdapconfigurationformComponent,
    PasswordsettingsComponent,
    Generalparameters,
    RoletypeservicelinkComponent,
    RoletypeservicelinkformComponent,
    QueriesmonitoringComponent,
    QueriesmonitoringformComponent,
    Generalparameter,
    IntegrationstatusComponent,
    IntegrationstatusformComponent,
    InterfacestatusComponent,
    InterfacestatusformComponent,
    LogsByObjectComponent,
    GroupMappingTabComponent,
    LogsbyuserComponent,
    UserFormComponent,
    RoleSanctionComponent,
    FormRoleSanctionComponent,
    RoleUsersComponent,
  ],
  imports: [
    ComponentsModule,
    MaterialModule,
    CommonModules
  ],
  exports:[],
  providers:[GlobalConstants,DatePipe],
  bootstrap:[],
})
export class UsmModule { }
