import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldhistorylogComponent } from './logs/fieldhistorylog/fieldhistorylog';
import { FiltersComponent } from './logs/filters/filters';
import { InvalidloginComponent } from './logs/invalidlogin/invalidlogin';
import { LogsByHeatmapComponent } from './logs/logs-by-heatmap/logs-by-heatmap.component';
import { LogsByObjectComponent } from './logs/logs-by-object/logs-by-object.component';
import { LogsbyuserComponent } from './logs/logsbyuser/logsbyuser.component';
import { GeneralparametersComponent } from './parameters/dataparams/generalparameters/generalparameters';
import { IntegrationstatusComponent } from './parameters/integrationparams/integrationstatus/integrationstatus';
import { IntegrationstatusformComponent } from './parameters/integrationparams/integrationstatus/integrationstatusform/integrationstatusform';
import { InterfacestatusComponent } from './parameters/integrationparams/interfacestatus/interfacestatus';
import { InterfacestatusformComponent } from './parameters/integrationparams/interfacestatus/interfacestatusform/interfacestatusform';
import { Generalparameter } from './parameters/reportingparams/generalparameter/generalparameter';
import { QueriesmonitoringComponent } from './parameters/reportingparams/queriesmonitoring/queriesmonitoring';
import { QueriesmonitoringformComponent } from './parameters/reportingparams/queriesmonitoring/queriesmonitoringform/queriesmonitoringform';
import { Generalparameters } from './parameters/sysparams/generalparameters/generalparameters';
import { LdapconfigurationComponent } from './parameters/sysparams/ldapconfiguration/ldapconfiguration';
import { LdapconfigurationformComponent } from './parameters/sysparams/ldapconfiguration/ldapconfigurationform/ldapconfigurationform';
import { PasswordsettingsComponent } from './parameters/sysparams/passwordsettings/passwordsettings';
import { RoletypeservicelinkComponent } from './parameters/sysparams/roletypeservicelink/roletypeservicelink';
import { RoletypeservicelinkformComponent } from './parameters/sysparams/roletypeservicelink/roletypeservicelinkform/roletypeservicelinkform';
import { ServerParametersComponent } from './parameters/wfmparams/serverparameters/serverparameters';
import { USMRole } from './securitymanagement/roles/roles';
import { LdapRolesMappingForm } from './securitymanagement/roles/rolesForm/ldapRolesMapping/ldapRolesMappingForm/ldapRolesMappingForm';
import { RolesForm } from './securitymanagement/roles/rolesForm/rolesForm';
import { AccessrightsComponent } from './securitymanagement/usermanagement/accessrights/accessrights.component';
import { UserFormComponent } from './securitymanagement/usermanagement/user-form/user-form.component';
import { Usermanagement } from './securitymanagement/usermanagement/usermanagement.component';
import { Usermanagementform } from './securitymanagement/usermanagement/usermanagementform/usermanagementform.component';
import { USMComponent } from './usm.component';
import { VSideNavOption2Component } from '../../components/v-side-nav-option2/v-side-nav-option2.component';
import { DynamicScreenComponent } from '../in-display/screen-builder/dynamic-screen/dynamic-screen.component';
import { FormRoleSanctionComponent } from './securitymanagement/roles/rolesForm/ldapRolesMapping/role-sanction/form-role-sanction/form-role-sanction.component';


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
                path: 'formSanction/:actionType/:id',
                component: FormRoleSanctionComponent,
                data: { breadcrumb: 'Form Sanction'},
             },
               {
                  path: 'form/:actionType/:id',
                  data: { breadcrumb: 'Role Form'},
                  children: [
                     {
                        path: '',
                        component: RolesForm
                     },
                    //  {
                    //     path: 'accessRights/:actionType/:id',
                    //     component: LdapRolesMappingForm,
                    //     data: { breadcrumb: 'LDAP Roles Mapping Form'},
                    //  },
                    {
                      path: 'accessRights/:actionType/:id',
                      component: AccessrightsComponent,
                      data: { breadcrumb: 'Access Right'},
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
                  data: { breadcrumb: 'User Form'},
                  path: 'form/:actionType/:id',
                  children:[
                     {
                        path:'',
                        component:Usermanagementform,
                     },
                     {
                        path:'accessRights/:actionType/:id',
                        data: { breadcrumb: 'Access Right'},
                        component:AccessrightsComponent
                     }
                  ]
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
            path: 'logByObject',
            data: { breadcrumb: 'Logs By Objects'},
            children: [
               {
                  path: '',
                  component:LogsByObjectComponent
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
   export class UsmRoutingModule { }
