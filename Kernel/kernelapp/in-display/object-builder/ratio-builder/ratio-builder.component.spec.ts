import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioBuilderComponent } from './ratio-builder.component';

describe('RatioBuilderComponent', () => {
  let component: RatioBuilderComponent;
  let fixture: ComponentFixture<RatioBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatioBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatioBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
