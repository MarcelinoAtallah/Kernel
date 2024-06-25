import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossRefFormComponent } from './cross-ref-form.component';

describe('CrossRefFormComponent', () => {
  let component: CrossRefFormComponent;
  let fixture: ComponentFixture<CrossRefFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossRefFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossRefFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
