import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VFieldsetComponent } from './v-fieldset.component';

describe('VFieldsetComponent', () => {
  let component: VFieldsetComponent;
  let fixture: ComponentFixture<VFieldsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VFieldsetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VFieldsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
