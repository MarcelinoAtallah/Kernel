import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VReportGenerationComponent } from './v-report-generation.component';

describe('VReportGenerationComponent', () => {
  let component: VReportGenerationComponent;
  let fixture: ComponentFixture<VReportGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VReportGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VReportGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
