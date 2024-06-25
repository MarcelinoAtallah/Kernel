import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

const commonArray = [
  BrowserModule,
  BrowserAnimationsModule,
  CommonModule,
  MaterialModule
];

@NgModule({
  declarations: [],
  imports: [
    commonArray
  ],
  exports: [commonArray]
})
export class CommonModules { }
