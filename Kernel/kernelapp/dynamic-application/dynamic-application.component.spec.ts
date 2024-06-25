import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicApplicationComponent } from './dynamic-application.component';

describe('DynamicApplicationComponent', () => {
  let component: DynamicApplicationComponent;
  let fixture: ComponentFixture<DynamicApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
