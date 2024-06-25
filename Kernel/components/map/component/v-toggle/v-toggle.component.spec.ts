import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VToggleComponent } from './v-toggle.component';

describe('VToggleComponent', () => {
  let component: VToggleComponent;
  let fixture: ComponentFixture<VToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
