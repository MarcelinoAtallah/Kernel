import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParamsComponent } from './add-params.component';

describe('AddParamsComponent', () => {
  let component: AddParamsComponent;
  let fixture: ComponentFixture<AddParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddParamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
