// import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

// // import { BreadcrumbModule } from 'angular-crumbs';

// import { DatePickerComponent } from './component/datepicker/datepicker.component';
// import { LayerControlComponent } from './component/layer-control/layer-control.component';
// import { NotificationComponent } from './component/notification/notification.component';
// import { PopupComponent } from './component/popup/popup.component';
// import { SaveshapeModalComponent } from './component/saveshape-modal/saveshape-modal.component';
// import { VAgGridComponent } from './component/v-ag-grid/v-ag-grid.component';
// import { VAlertComponent } from './component/v-alert/v-alert.component';
// import { VTableComponent } from './component/v-table/v-table.component';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
// import { MapComponent } from './map/map.component';
// import { DataService } from './Services/data.service';
// import { Http_Interceptor } from './Services/http-interceptor.service';
// import { DatacrowdService } from './Services/datacrowd.service';
// import { LoaderService } from './Services/loader.service';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { DatePipe } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AgGridModule } from 'ag-grid-angular';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { BrowserModule } from '@angular/platform-browser';
// import { CdkStepperModule } from '@angular/cdk/stepper';
// import { MatStepperModule } from '@angular/material/stepper';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatCardModule } from '@angular/material/card';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';
// import { LayoutModule } from '@angular/cdk/layout';
// import { MatInputModule } from '@angular/material/input';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';
// import { MatTableModule } from '@angular/material/table';
// import { MatSortModule } from '@angular/material/sort';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { MatTabsModule } from '@angular/material/tabs';
// import { RouterModule } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { NgSelectModule } from "@ng-select/ng-select";
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { CommonModule } from '@angular/common';
// import'ag-grid-enterprise';
// import { ToastrModule } from 'ngx-toastr';

// import { MatPaginatorModule } from '@angular/material/paginator';
// import { EventEmitterService } from './Services/event-emitter.service';
// import { EventBusService } from './Services/event-bus-service.service';
// import { SearchFilterPipe } from './Services/search-filter.pipe';
// import { PaginatePipe } from './Services/paginate.pipe';

// @NgModule({
//     declarations: [
//         DatePickerComponent,
//         LayerControlComponent,
//         NotificationComponent,
//         PopupComponent,
//         SaveshapeModalComponent,
//         VAgGridComponent,
//         VAlertComponent,
//         VTableComponent,
//         MapComponent,   
//         SearchFilterPipe,
//         PaginatePipe,

//     ],
//     imports: [
//         // BreadcrumbModule,
//         // LeafletModule,
//         // LeafletDrawModule,
//         // MatButtonModule,
//         // MatExpansionModule,
//         // MatFormFieldModule,
//         // MatSelectModule,
//         ReactiveFormsModule,
//         FormsModule,
//         // MatDialogModule,
//         // CdkStepperModule,
//         // MatStepperModule,
//         // BrowserAnimationsModule,
//         // MatCardModule,
//         // MatGridListModule,
//         // MatMenuModule,
//         // MatIconModule,
//         // MatButtonModule,
//         // MatInputModule,
//         // MatSidenavModule,
//         // MatRadioModule,
//         // ReactiveFormsModule,
//         // MatTableModule,
//         // MatToolbarModule,
//         // MatListModule,
//         // MatSortModule,
//         // LayoutModule,
//         // MatAutocompleteModule,
//         // NgSelectModule,
//         // HttpClientModule,
//         // RouterModule,
//         // DragDropModule,
//         // MatSelectModule,
//         // MatTabsModule,
//         // NgbModule,
//         // MatSliderModule,
//         // MatCheckboxModule,
//         // MatSlideToggleModule,
//         // MatProgressBarModule,
//         // NgMultiSelectDropDownModule.forRoot(),
//         // MatDatepickerModule,
//         // MatNativeDateModule,
//         // LeafletModule,
//         // LeafletDrawModule,
//         // CommonModule,
//         // MatPaginatorModule,
//         // ToastrModule

//         LeafletModule,
//         MatStepperModule,
//         LeafletDrawModule,
//         CommonModule,
//         MatPaginatorModule,
//         ToastrModule
//     ],
//     exports: [
//         DatePickerComponent,
//         LayerControlComponent,
//         NotificationComponent,
//         PopupComponent,
//         SaveshapeModalComponent,
//         VAgGridComponent,
//         VAlertComponent,
//         VTableComponent,
//         MapComponent,
//         SearchFilterPipe,
//         PaginatePipe,

//         LeafletModule,
//         MatStepperModule,
//         LeafletDrawModule,
//         CommonModule,
//         MatPaginatorModule,
//         ToastrModule

//     ],
//     schemas: [
//       CUSTOM_ELEMENTS_SCHEMA,
//     ],
//     providers: [
//         PopupComponent,
//         MapComponent,
//         {
//           provide: HTTP_INTERCEPTORS,
//           useClass: Http_Interceptor,
//           multi: true
    
//         },
//         NotificationComponent,
//         EventEmitterService,
//         DatePipe,
//         EventBusService,
//     ],
//     bootstrap: [mapModule]
// })
// export class mapModule { }
