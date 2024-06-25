import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VDynamicReportComponent } from './v-dynamic-report.component';

describe('VDynamicReportComponent', () => {
  let component: VDynamicReportComponent;
  let fixture: ComponentFixture<VDynamicReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VDynamicReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VDynamicReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
