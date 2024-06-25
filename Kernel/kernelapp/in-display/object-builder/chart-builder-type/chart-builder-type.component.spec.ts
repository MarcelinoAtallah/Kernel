import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBuilderTypeComponent } from './chart-builder-type.component';

describe('ChartBuilderTypeComponent', () => {
  let component: ChartBuilderTypeComponent;
  let fixture: ComponentFixture<ChartBuilderTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartBuilderTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBuilderTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
