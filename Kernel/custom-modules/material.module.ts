import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from "@ng-select/ng-select";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
const materialsArray = [
  MatDialogModule,
  FormsModule,
  CdkStepperModule,
  MatCardModule,
  MatGridListModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatSidenavModule,
  MatRadioModule,
  ReactiveFormsModule,
  MatTableModule,
  MatToolbarModule,
  MatListModule,
  MatSortModule,
  LayoutModule,
  MatAutocompleteModule,
  NgSelectModule,
  HttpClientModule,
  RouterModule,
  DragDropModule,
  MatSelectModule,
  MatTabsModule,
  NgbModule,
  MatSliderModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  NgMultiSelectDropDownModule.forRoot(),
  MatDatepickerModule,
  MatNativeDateModule,
  CdkAccordionModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatRippleModule,
  MatSnackBarModule,
  BrowserModule,
  BrowserAnimationsModule
];

@NgModule({
  declarations: [],
  imports: [
    materialsArray
  ],
  exports: [materialsArray]
})
export class MaterialModule { }
