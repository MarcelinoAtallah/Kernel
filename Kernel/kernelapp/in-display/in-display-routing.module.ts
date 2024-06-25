import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { ScreenBuilderComponent } from './screen-builder/screen-builder.component';
import { FormComponent } from './form/form.component';
import { InputComponent } from './form-builder/input/input.component';
import { ColumnModifierComponent } from './form-builder/column-modifier/column-modifier.component';
import { PreviewFormComponent } from './form-builder/preview-form/main-preview-form.component';
import { NewTabComponent } from './form-builder/new-tab/new-tab.component';
import { ScreenBuilderToolComponent } from './screen-builder/screen-builder-tool/screen-builder-tool.component';
import { DynamicScreenComponent } from './screen-builder/dynamic-screen/dynamic-screen.component';
import { NewbuttonComponent } from './form-builder/newbutton/newbutton.component';
import { ObjectBuilderComponent } from './object-builder/object-builder.component';
import { KpiBuilderComponent } from './object-builder/kpi-builder/kpi-builder.component';
import { RatioBuilderComponent } from './object-builder/ratio-builder/ratio-builder.component';
import { ChartBuilderComponent } from './object-builder/chart-builder/chart-builder.component';
import { KpiBuilderFormComponent } from './object-builder/kpi-builder-form/kpi-builder-form.component';
import { ChartBuilderFormComponent } from './object-builder/chart-builder-form/chart-builder-form.component';
import { RatioBuilderFormComponent } from './object-builder/ratio-builder-form/ratio-builder-form.component';
import { ChartBuilderTypeComponent } from './object-builder/chart-builder-type/chart-builder-type.component';
import { GridBuilderComponent } from './object-builder/grid-builder/grid-builder.component';
import { GridBuilderFormComponent } from './object-builder/grid-builder-form/grid-builder-form.component';

const routes: Routes = [
   {
      path: 'augmentedConfig',
      data: { breadcrumb: 'Form Builder' },
      children: [
         {
            path: '',
            component: FormBuilderComponent
         },
         {
            path: 'form/:actionType/:parentId',
            data: { breadcrumb: 'Form Configuration' },
            children: [
               {
                  path: '',
                  component: InputComponent,
               },
               {
                  path: ':childId/tabConfiguration',
                  data: { breadcrumb: 'Tab Modification' },
                  component: NewTabComponent,
               },
               {
                  path: 'buttonConfiguration',
                  data: { breadcrumb: 'Button Configuration' },
                  component: NewbuttonComponent,
               },
               {
                  path: ':childId/previewForm',
                  data: { breadcrumb: 'Preview Form' },
                  component: PreviewFormComponent,
               },
               // {
               //    path: ':childId/columnModifier/:columnDescription/:columnTypeCode/:columnId',
               //    data: { breadcrumb: 'Column Modifier' },
               //    component: ColumnModifierComponent,
               // },
               {
                  path: ':childId/formBuilder',
                  data: { breadcrumb: 'Form Builder' },
                  component: FormComponent,
               },
               {
                  path: ':childId/:columnId/:isLink/columnConfig',
                  data: { breadcrumb: 'Column Modifier'},
                  component: ColumnModifierComponent

               }
            ]
         },
      ]
   },
   {
      path: 'augmentedConfigScratch',
      data: { breadcrumb: 'Screen Builder ' },
      children: [
         {
            path: '',
            component: ScreenBuilderComponent
         },
         {
            path: 'form/:actionType/:id',
            data: { breadcrumb: 'Screen Builder Tool' },
            children: [
               {
                  path: '',
                  component: ScreenBuilderToolComponent
               },
            ],
         }
      ]
   } ,
    {
      path: 'kpiBuilder',
      data: { breadcrumb: 'KPI Builder' },
      children: [
         {
            path: '',
            component: KpiBuilderComponent,
         },
         {
            data: { breadcrumb: 'User Form'},
            path: 'form/:actionType/:id',
            children:[
               {
                  path:'',
                  component:KpiBuilderFormComponent
               },
            ]
         }
      ]
   }, {
      path: 'chartBuilder',
      data: { breadcrumb: 'Chart Builder' },
      children: [
         {
            path: '',
            component: ChartBuilderComponent,
         },
         {
            data: { breadcrumb: 'User Form'},
            path: 'form/:actionType/:id',
            children:[
               {
                  path:'',
                  component:ChartBuilderTypeComponent,
               },
               {
                  path:'form/:actionType/:id/ChartBuilderForm',
                  component:ChartBuilderFormComponent,
               },
            ]
         }
      ]
   },
   {
      path: 'ratioBuilder',
      data: { breadcrumb: 'Ratio Builder' },
      children: [
         {
            path: '',
            component: RatioBuilderComponent,
         },
         {
            data: { breadcrumb: 'User Form'},
            path: 'form/:actionType/:id',
            children:[
               {
                  path:'',
                  component:RatioBuilderFormComponent
               },
            ]
         }
      ]
   },
   {
      path: 'gridBuilder',
      data: { breadcrumb: 'Grid Builder' },
      children: [
         {
            path: '',
            component: GridBuilderComponent,
         },
         {
            data: { breadcrumb: 'User Form'},
            path: 'form/:actionType/:id',
            children:[
               {
                  path:'',
                  component:GridBuilderFormComponent
               },
            ]
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


@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class InDisplayRoutingModule { }
