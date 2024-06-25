import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHighChartsComponent } from './v-highcharts.component';

describe('VHighChartsComponent', () => {
  let component: VHighChartsComponent;
  let fixture: ComponentFixture<VHighChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHighChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHighChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
