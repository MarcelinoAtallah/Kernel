import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBuilderPreviewComponent } from './kpi-builder-preview.component';

describe('KpiBuilderPreviewComponent', () => {
  let component: KpiBuilderPreviewComponent;
  let fixture: ComponentFixture<KpiBuilderPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiBuilderPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiBuilderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
