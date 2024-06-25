import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VChartHeatmapComponent } from './v-chart-heatmap.component';

describe('VChartHeatmapComponent', () => {
  let component: VChartHeatmapComponent;
  let fixture: ComponentFixture<VChartHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VChartHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VChartHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
