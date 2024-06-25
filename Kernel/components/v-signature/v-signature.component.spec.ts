import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VSignatureComponent } from './v-signature.component';

describe('VSignatureComponent', () => {
  let component: VSignatureComponent;
  let fixture: ComponentFixture<VSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
