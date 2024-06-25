import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VCaptchaComponent } from './v-captcha.component';

describe('VCaptchaComponent', () => {
  let component: VCaptchaComponent;
  let fixture: ComponentFixture<VCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VCaptchaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
