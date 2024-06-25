import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationcoverageComponent } from './vacationcoverage.component';

describe('VacationcoverageComponent', () => {
  let component: VacationcoverageComponent;
  let fixture: ComponentFixture<VacationcoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationcoverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationcoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
