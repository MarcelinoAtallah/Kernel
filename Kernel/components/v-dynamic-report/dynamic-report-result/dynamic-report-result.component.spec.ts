import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicReportResultComponent } from './dynamic-report-result.component';

describe('DynamicReportResultComponent', () => {
  let component: DynamicReportResultComponent;
  let fixture: ComponentFixture<DynamicReportResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicReportResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicReportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
