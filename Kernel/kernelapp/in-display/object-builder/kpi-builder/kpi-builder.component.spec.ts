import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBuilderComponent } from './kpi-builder.component';

describe('KpiBuilderComponent', () => {
  let component: KpiBuilderComponent;
  let fixture: ComponentFixture<KpiBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
