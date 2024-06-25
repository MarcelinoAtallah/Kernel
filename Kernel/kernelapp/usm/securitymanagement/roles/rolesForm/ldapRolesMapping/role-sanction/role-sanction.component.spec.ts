import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSanctionComponent } from './role-sanction.component';

describe('RoleSanctionComponent', () => {
  let component: RoleSanctionComponent;
  let fixture: ComponentFixture<RoleSanctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleSanctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSanctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
