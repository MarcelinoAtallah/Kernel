import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmPreviewFormComponent } from './am-preview-form.component';

describe('AmPreviewFormComponent', () => {
  let component: AmPreviewFormComponent;
  let fixture: ComponentFixture<AmPreviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmPreviewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmPreviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
