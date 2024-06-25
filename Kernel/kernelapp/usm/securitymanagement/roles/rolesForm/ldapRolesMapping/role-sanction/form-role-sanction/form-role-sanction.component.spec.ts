import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRoleSanctionComponent } from './form-role-sanction.component';

describe('FormRoleSanctionComponent', () => {
  let component: FormRoleSanctionComponent;
  let fixture: ComponentFixture<FormRoleSanctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRoleSanctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRoleSanctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
