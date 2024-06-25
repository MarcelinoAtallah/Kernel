import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunReportParametersComponent } from './run-report-parameters.component';

describe('RunReportParametersComponent', () => {
  let component: RunReportParametersComponent;
  let fixture: ComponentFixture<RunReportParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunReportParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunReportParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
