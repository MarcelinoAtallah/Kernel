import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VGaugeComponent } from './v-gauge.component';

describe('VGaugeComponent', () => {
  let component: VGaugeComponent;
  let fixture: ComponentFixture<VGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VGaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
