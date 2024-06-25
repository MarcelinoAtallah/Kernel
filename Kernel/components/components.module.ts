import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialModule } from '../custom-modules/material.module';
import { CommonModules } from '../custom-modules/common.module';

import { AGGridComponent } from './v-grid/v-grid.components';
import { LinkCellRenderer } from './v-grid/components/v-grid-link';
import { CheckboxCellRenderer } from './v-grid/components/v-grid-checkbox';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonComponent } from './v-button/v-button.component';
import { DropDownComponent } from './v-dropdown/v-dropdown.component';
import { AutocompleteComponent } from './v-autocomplete/v-autocomplete.component';
import { SideNavComponent } from './v-side-nav/v-side-nav.component';
import { DialogComponent } from './dialog/dialog.component';
import { InputComponent } from './v-input/v-input.component';
import { LabelComponent } from './v-label/v-label.component';
import { FieldErrorComponent } from './v-field-error/v-field-error.component';
import { TabComponent } from './v-tabs/v-tab.components'
import { TabsComponent } from './v-tabs/v-tabs.component';
import { ModalSideNavComponent} from './modal-side-nav/modal-side-nav.component'
import { SliderComponent } from './v-slider/v-slider.component';
import { VToggleComponent } from './v-toggle/v-toggle.component';
import { VFileComponent } from './v-file/v-file.component';
import { BreadcrumbModule } from 'angular-crumbs';
import { VSideNavOption2Component } from './v-side-nav-option2/v-side-nav-option2.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { VDropdownstaticComponent } from './v-dropdownstatic/v-dropdownstatic.component';
import { MatRadioModule } from '@angular/material/radio';
import { VChartHeatmapComponent } from './v-chart-heatmap/v-chart-heatmap.component';
import { ChartModule } from 'angular-highcharts';
//import { VChartsComponent } from './v-charts/v-charts.component';
import { VLookupComponent } from './v-input/v-lookup/v-lookup.component';
import { ContentmodalComponent } from './contentmodal/contentmodal.component';
import { VFieldsetComponent } from './v-fieldset/v-fieldset.component';
import { VDynamicRuleBuilderComponent } from './v-dynamic-rule-builder/v-dynamic-rule-builder.component';
//import { NgChartsModule } from 'ng2-charts';
import { VGaugeComponent } from './v-gauge/v-gauge.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { DynamicBuilderFormComponent } from './v-dynamic-rule-builder/form/form.component';
import { VDynamicSearchComponent } from './v-dynamic-search/v-dynamic-search.component';
import { AdvancedFormComponent } from './v-dynamic-rule-builder/form/advanced-form/advanced-form.component';
import { VCaptchaComponent } from './v-captcha/v-captcha.component';
import { VSignatureComponent } from './v-signature/v-signature.component';
import { VQueryFormComponent } from './v-query-form/v-query-form.component';
import { VLookupV2Component } from './v-lookup-v2/v-lookup-v2.component';
import { VQueryDetailsComponent } from './v-lookup-v2/v-query-details/v-query-details.component';
import { VRejectedComponent } from './v-rejected/v-rejected.component';
import { VPhoneComponent } from './v-phone/v-phone.component';
// import { mapModule } from './map/map.module';

import { DatePickerComponent } from './map/component/datepicker/datepicker.component';

import { LayerControlComponent } from './map/component/layer-control/layer-control.component';
// import { NotificationComponent } from './map/component/notification/notification.component';
import { PopupComponent } from './map/component/popup/popup.component';
import { SaveshapeModalComponent } from './map/component/saveshape-modal/saveshape-modal.component';
import { VAgGridComponent } from './map/component/v-ag-grid/v-ag-grid.component';
import { VAlertComponent } from './map/component/v-alert/v-alert.component';
import { VTableComponent } from './map/component/v-table/v-table.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { MapComponent } from './map/map/map.component';
import { DataService } from './map/Services/data.service';
import { Http_Interceptor } from './map/Services/http-interceptor.service';
import { DatacrowdService } from './map/Services/datacrowd.service';
import { LoaderService } from './map/Services/loader.service';
import { SearchFilterPipe } from './map/Services/search-filter.pipe';
import { PaginatePipe } from './map/Services/paginate.pipe';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EventEmitterService } from './map/Services/event-emitter.service';
import { EventBusService } from './map/Services/event-bus-service.service';
import { VDynamicReportComponent } from './v-dynamic-report/v-dynamic-report.component';
import {VHighChartsComponent} from './v-highcharts/v-highcharts.component';
import { NavbarComponent } from './map/component/menu/menu.component';
// import { VHighchartsStocksComponent } from './v-highcharts-stocks/v-highcharts-stocks.component';

@NgModule({
    declarations: [
        ModalSideNavComponent,
        TabsComponent,
        TabComponent,
        DialogComponent,
        InputComponent,
        ButtonComponent,
        AGGridComponent,
        DropDownComponent,
        AutocompleteComponent,
        SideNavComponent,
        ButtonComponent,
        LabelComponent,
        FieldErrorComponent,
        SliderComponent,
        VToggleComponent,
        VFileComponent,
        LinkCellRenderer,
        CheckboxCellRenderer,
        VSideNavOption2Component,
        VDropdownstaticComponent,
        VChartHeatmapComponent,
       // VChartsComponent,
        VLookupComponent,
        ContentmodalComponent,
        VFieldsetComponent,
        VDynamicRuleBuilderComponent,
        VGaugeComponent,
        DynamicBuilderFormComponent,
        VDynamicSearchComponent,
        AdvancedFormComponent,
        VCaptchaComponent,
        VSignatureComponent,
        VQueryFormComponent,
        VLookupV2Component,
        VQueryDetailsComponent,
        VRejectedComponent,
        VPhoneComponent,
        ContentmodalComponent,
        ButtonComponent,
///////////////////map component//////////////////
        DatePickerComponent,
        LayerControlComponent,
        // NotificationComponent,
        PopupComponent,
        SaveshapeModalComponent,
        VAgGridComponent,
        VAlertComponent,
        VTableComponent,
        MapComponent,   
        SearchFilterPipe,
        PaginatePipe,
        VDynamicReportComponent,
        VHighChartsComponent,
        // VHighchartsStocksComponent,
        NavbarComponent

    ],
    imports: [
        FormsModule,
        AgGridModule,
        MaterialModule,
        BreadcrumbModule,
        MatButtonToggleModule,
        MatRadioModule,
        ChartModule,
        CommonModules,
        //NgChartsModule,
        NgxGaugeModule,
        [AgGridModule.withComponents([CheckboxCellRenderer, LinkCellRenderer])],
        //////////////map module ///////
        
        LeafletModule,
        MatStepperModule,
        LeafletDrawModule,
        CommonModule,
        MatPaginatorModule,
        ToastrModule
    ],
    exports: [
        VDynamicReportComponent,
        ModalSideNavComponent,
        TabsComponent,
        TabComponent,
        DialogComponent,
        ButtonComponent,
        AGGridComponent,
        DropDownComponent,
        AutocompleteComponent,
        SideNavComponent,
        InputComponent,
        LabelComponent,
        FieldErrorComponent,
        SliderComponent,
        VToggleComponent,
        VFileComponent,
        VSideNavOption2Component,
        VDropdownstaticComponent,
        VChartHeatmapComponent,
        VFieldsetComponent,
        //VChartsComponent,
        VGaugeComponent,
        VDynamicRuleBuilderComponent,
        VDynamicSearchComponent,
        VCaptchaComponent,
        VSignatureComponent,
        VQueryFormComponent,
        VLookupV2Component,
        VQueryDetailsComponent,
        VPhoneComponent,
        ContentmodalComponent,
        ButtonComponent,
        MapComponent,
        // NotificationComponent,
        LeafletModule,
        MatStepperModule,
        LeafletDrawModule,
        CommonModule,
        MatPaginatorModule,
        ToastrModule,
        VHighChartsComponent,
        // VHighchartsStocksComponent,
        NavbarComponent

    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    providers: [
        PopupComponent,
        MapComponent,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: Http_Interceptor,
          multi: true
    
        },
        // NotificationComponent,
        EventEmitterService,
        DatePipe,
        EventBusService,
    ],
    bootstrap: [ComponentsModule]
})
export class ComponentsModule { }
