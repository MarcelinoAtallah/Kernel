import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBuilderFormComponent } from './kpi-builder-form.component';

describe('KpiBuilderFormComponent', () => {
  let component: KpiBuilderFormComponent;
  let fixture: ComponentFixture<KpiBuilderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiBuilderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiBuilderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
