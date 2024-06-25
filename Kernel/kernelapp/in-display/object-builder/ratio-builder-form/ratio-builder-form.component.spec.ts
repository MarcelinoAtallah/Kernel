import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioBuilderFormComponent } from './ratio-builder-form.component';

describe('RatioBuilderFormComponent', () => {
  let component: RatioBuilderFormComponent;
  let fixture: ComponentFixture<RatioBuilderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatioBuilderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatioBuilderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
