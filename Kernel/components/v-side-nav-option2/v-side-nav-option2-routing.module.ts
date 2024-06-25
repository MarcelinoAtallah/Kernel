import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Usermanagement } from 'src/app/Kernel/usm/securitymanagement/usermanagement/usermanagement.component';
import { USMRole } from 'src/app/Kernel/usm/securitymanagement/roles/roles';
import { Usermanagementform } from 'src/app/Kernel/usm/securitymanagement/usermanagement/usermanagementform/usermanagementform.component';
import { RolesForm } from 'src/app/Kernel/usm/securitymanagement/roles/rolesForm/rolesForm';
import { LdapRolesMappingForm } from 'src/app/Kernel/usm/securitymanagement/roles/rolesForm/ldapRolesMapping/ldapRolesMappingForm/ldapRolesMappingForm';
import { InvalidloginComponent } from 'src/app/Kernel/usm/logs/invalidlogin/invalidlogin';
import { LogsByHeatmapComponent } from 'src/app/Kernel/usm/logs/logs-by-heatmap/logs-by-heatmap.component';
import { FieldhistorylogComponent } from 'src/app/Kernel/usm/logs/fieldhistorylog/fieldhistorylog';
import { FiltersComponent } from 'src/app/Kernel/usm/logs/filters/filters';
import { ServerParametersComponent } from 'src/app/Kernel/usm/parameters/wfmparams/serverparameters/serverparameters';
import { GeneralparametersComponent } from 'src/app/Kernel/usm/parameters/dataparams/generalparameters/generalparameters';
import { LdapconfigurationComponent } from 'src/app/Kernel/usm/parameters/sysparams/ldapconfiguration/ldapconfiguration';
import { LdapconfigurationformComponent } from 'src/app/Kernel/usm/parameters/sysparams/ldapconfiguration/ldapconfigurationform/ldapconfigurationform';
import { PasswordsettingsComponent } from 'src/app/Kernel/usm/parameters/sysparams/passwordsettings/passwordsettings';
import { Generalparameters } from 'src/app/Kernel/usm/parameters/sysparams/generalparameters/generalparameters';
import { RoletypeservicelinkComponent } from 'src/app/Kernel/usm/parameters/sysparams/roletypeservicelink/roletypeservicelink';
import { RoletypeservicelinkformComponent } from 'src/app/Kernel/usm/parameters/sysparams/roletypeservicelink/roletypeservicelinkform/roletypeservicelinkform';
import { QueriesmonitoringComponent } from 'src/app/Kernel/usm/parameters/reportingparams/queriesmonitoring/queriesmonitoring';
import { QueriesmonitoringformComponent } from 'src/app/Kernel/usm/parameters/reportingparams/queriesmonitoring/queriesmonitoringform/queriesmonitoringform';
import { Generalparameter } from 'src/app/Kernel/usm/parameters/reportingparams/generalparameter/generalparameter';
import { IntegrationstatusComponent } from 'src/app/Kernel/usm/parameters/integrationparams/integrationstatus/integrationstatus';
import { IntegrationstatusformComponent } from 'src/app/Kernel/usm/parameters/integrationparams/integrationstatus/integrationstatusform/integrationstatusform';
import { InterfacestatusComponent } from 'src/app/Kernel/usm/parameters/integrationparams/interfacestatus/interfacestatus';
import { InterfacestatusformComponent } from 'src/app/Kernel/usm/parameters/integrationparams/interfacestatus/interfacestatusform/interfacestatusform';
import { LogsbyuserComponent } from 'src/app/Kernel/usm/logs/logsbyuser/logsbyuser.component';
import { USMComponent } from 'src/app/Kernel/usm/usm.component';
import { VSideNavOption2Component } from 'src/app/Kernel/Kernel/components/v-side-nav-option2/v-side-nav-option2.component';
import { DynamicScreenComponent } from 'src/app/Kernel/in-display/screen-builder/dynamic-screen/dynamic-screen.component';

   const routes: Routes = [
   {
      path: '',
      component: USMComponent,
      children:[
         {
            path: 'role',
            data: { breadcrumb: 'Role'},
            children: [
               {
                  path: '',
                  component: USMRole
               },
               {
                  path: 'form/:actionType/:id',
                  data: { breadcrumb: 'Role Form'},
                  children: [
                     {
                        path: '',
                        component: RolesForm
                     },
                     {
                        path: 'ldapRolesMappingForm/:actionType/:id',
                        component: LdapRolesMappingForm,
                        data: { breadcrumb: 'LDAP Roles Mapping Form'},
                     }
                  ],
               }
            ]
         },
         {
            path: 'userMgmt',
            data: { breadcrumb: 'User Management'},
            children: [
               {
                  path: '',
                  component: Usermanagement
               },
               {
                  path: 'form/:actionType/:id',
                  component: Usermanagementform,
                  data: { breadcrumb: 'User Form'}
               }
            ]
         },
         {
            path: 'invalidLoginLogs',
            data: { breadcrumb: 'Invalid Login'},
            children: [
               {
                  path: '',
                  component: InvalidloginComponent
               },
            ]
         },
         {
            path: 'userLogs',
            data: { breadcrumb: 'logsByUser'},
            children: [
               {
                  path: '',
                  component: LogsbyuserComponent
               },
            ]
         },
         {
            path: 'logByFieldHistory',
            data: { breadcrumb: 'Log By Field History '},
            children: [
               {
                  path: '',
                  component: FieldhistorylogComponent
               },
            ]
         },


         {
            path: 'logByHour',
            data: { breadcrumb: 'Logs By Heatmap '},
            children: [
               {
                  path: '',
                  component: LogsByHeatmapComponent
               },
            ]
         },

         {
            path: 'logsAsBld',//MENU VARIABLE FROM SQL
            data: { breadcrumb: 'ANTOUN SCRATCH '},
            children: [
               {
                  path: '',
                  component: VSideNavOption2Component //WHERE I WANT TO NAVIGATE
               },
            ]
         },



         {
            path: 'appEvents',
            data: { breadcrumb: 'Filters'},
            children: [
               {
                  path: '',
                  component: FiltersComponent
               },
            ]
         },
         {
            path: 'wfmServerParams',
            data: { breadcrumb: 'Server Parameters'},
            children: [
               {
                  path: '',
                  component: ServerParametersComponent
               },
            ]
         },
         {
            path: 'refGenParam',
            data: { breadcrumb: 'General Parameters'},
            children: [
               {
                  path: '',
                  component: GeneralparametersComponent
               },
            ]
         },
         {
            path: 'ldapConfig',
            data: { breadcrumb: 'LDAP Configuration'},
            children: [
               {
                  path: '',
                  component: LdapconfigurationComponent
               },
               {
                  path: 'form/:actionType/:id',
                  component: LdapconfigurationformComponent,
                  data: { breadcrumb: 'LDAP Configuration Form'}
               }
            ]
         },
         {
            path: 'pwdSettings',
            data: { breadcrumb: 'Password Settings'},
            children: [
               {
                  path: '',
                  component: PasswordsettingsComponent
               },
            ]
         },
         {
            path: 'usmGenParams',
            data: { breadcrumb: 'General Parameterssss'},
            children: [
               {
                  path: '',
                  component: Generalparameters
               },
            ]
         },
         {
            path: 'usmRoleTypeServiceLink',
            data: { breadcrumb: 'Role Type Service Link'},
            children: [
               {
                  path: '',
                  component: RoletypeservicelinkComponent
               },
               {
                  path: 'form/:actionType/:id',
                  component: RoletypeservicelinkformComponent,
                  data: { breadcrumb: 'Role Type Service Link Form'}
               }
            ]
         },
         {
            path: 'qbeQueriesMon',
            data: { breadcrumb: 'Queries Monitoring'},
            children: [
               {
                  path: '',
                  component: QueriesmonitoringComponent
               },
               {
                  path: 'form/:actionType/:id',
                  component: QueriesmonitoringformComponent,
                  data: { breadcrumb: 'Queries Monitoring Form'}
               }
            ]
         },
         {
            path: 'qbeGenParams',
            data: { breadcrumb: 'General Parameter'},
            children: [
               {
                  path: '',
                  component: Generalparameter
               },
            ]
         },
         {
            path: 'integrationStatus',
            data: { breadcrumb: 'Integration Status'},
            children: [
               {
                  path: '',
                  component: IntegrationstatusComponent
               },
               {
                  path: 'form/:actionType/:id',
                  component: IntegrationstatusformComponent,
                  data: { breadcrumb: 'Integration Status Form'}
               }
            ]
         },
         {
            path: 'interfaceStatus',
            data: { breadcrumb: 'Interface Status'},
            children: [
               {
                  path: '',
                  component: InterfacestatusComponent
               },
               {
                  path: 'form/:actionType/:id',
                  component: InterfacestatusformComponent,
                  data: { breadcrumb: 'Interface Status  Form Component' }
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
   export class sidenavoption2routingModule { }
