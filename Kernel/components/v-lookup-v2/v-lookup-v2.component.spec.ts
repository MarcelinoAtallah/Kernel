import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VLookupV2Component } from './v-lookup-v2.component';

describe('VLookupV2Component', () => {
  let component: VLookupV2Component;
  let fixture: ComponentFixture<VLookupV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VLookupV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VLookupV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
