import { NgModule } from '@angular/core';
import { ComponentsModule } from '../Kernel/components/components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from "../common/GlobalConstants";


@NgModule({
  declarations: [],
  imports: [
    NgbModule,
    ComponentsModule
  ],
  providers: [GlobalConstants],
  exports:[]
})
export class LoginModule { }
