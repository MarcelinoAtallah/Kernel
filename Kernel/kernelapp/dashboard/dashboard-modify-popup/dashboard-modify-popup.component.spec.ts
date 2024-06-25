import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardModifyPopupComponent } from './dashboard-modify-popup.component';

describe('DashboardModifyPopupComponent', () => {
  let component: DashboardModifyPopupComponent;
  let fixture: ComponentFixture<DashboardModifyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardModifyPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardModifyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
