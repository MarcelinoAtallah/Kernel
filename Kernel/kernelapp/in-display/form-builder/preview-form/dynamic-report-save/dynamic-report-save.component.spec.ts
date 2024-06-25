import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicReportSaveComponent } from './dynamic-report-save.component';

describe('DynamicReportSaveComponent', () => {
  let component: DynamicReportSaveComponent;
  let fixture: ComponentFixture<DynamicReportSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicReportSaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicReportSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
