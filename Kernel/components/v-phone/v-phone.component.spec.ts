import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VPhoneComponent } from './v-phone.component';

describe('VPhoneComponent', () => {
  let component: VPhoneComponent;
  let fixture: ComponentFixture<VPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VPhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
