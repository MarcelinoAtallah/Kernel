import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QbeComponent } from './qbe.component';
import { ReportdesignerComponent } from './reportdesigner/reportdesigner.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { StaticQueryBuilderComponent } from './query-builder/static-query-builder/static-query-builder.component';
import { QbeToolComponent } from './query-builder/qbe-tool/qbe-tool.component';
import { DynamicScreenComponent } from '../in-display/screen-builder/dynamic-screen/dynamic-screen.component';
import { CqlshComponent } from './query-builder/cqlsh/cqlsh.component';


const routes: Routes = [
   {
     path: '',
     component: QbeComponent,
     children: [
       {
         path: 'reportDesigner',
         data: { breadcrumb: 'Report Designer' },
         children: [
           {
             path: '',
             component: ReportdesignerComponent
           }
         ]
       },
       {
         path: 'queryBuilder',
         data: { breadcrumb: 'Query Builder' },
         children: [
           {
             path: '',
             component: QueryBuilderComponent
           },
           {
            path: 'form/:actionType/:id',
            data: { breadcrumb: 'Static Query Builder Form'},
            children: [
               {
                  path: '',
                  component: StaticQueryBuilderComponent
               },
              ],
              },
              {
                path: 'formQBE/:actionType/:id',
                data: { breadcrumb: 'QBE Tool'},
                children: [
                   {
                      path: '',
                      component: QbeToolComponent
                   },
                  ],
                  }, {
                    path: 'formCQL/:actionType/:id',
                    data: { breadcrumb: 'CQL'},
                    children: [
                       {
                          path: '',
                          component: CqlshComponent
                       },
                      ],
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
     ]
   }
 ];

   @NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule],
      declarations: []
   })
   export class QBERoutingModule { }