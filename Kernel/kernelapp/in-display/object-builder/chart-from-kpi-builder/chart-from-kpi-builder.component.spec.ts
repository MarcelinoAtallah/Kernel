import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFromKpiBuilderComponent } from './chart-from-kpi-builder.component';

describe('ChartFromKpiBuilderComponent', () => {
  let component: ChartFromKpiBuilderComponent;
  let fixture: ComponentFixture<ChartFromKpiBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartFromKpiBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFromKpiBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
