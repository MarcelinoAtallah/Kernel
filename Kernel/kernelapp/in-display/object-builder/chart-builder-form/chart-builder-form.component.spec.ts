import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBuilderFormComponent } from './chart-builder-form.component';

describe('ChartBuilderFormComponent', () => {
  let component: ChartBuilderFormComponent;
  let fixture: ComponentFixture<ChartBuilderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartBuilderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBuilderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
