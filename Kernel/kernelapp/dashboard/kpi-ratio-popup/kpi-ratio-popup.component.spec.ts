import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiRatioPopupComponent } from './kpi-ratio-popup.component';

describe('KpiRatioPopupComponent', () => {
  let component: KpiRatioPopupComponent;
  let fixture: ComponentFixture<KpiRatioPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiRatioPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiRatioPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
