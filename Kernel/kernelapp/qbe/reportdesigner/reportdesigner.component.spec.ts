import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdesignerComponent } from './reportdesigner.component';

describe('ReportdesignerComponent', () => {
  let component: ReportdesignerComponent;
  let fixture: ComponentFixture<ReportdesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportdesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
