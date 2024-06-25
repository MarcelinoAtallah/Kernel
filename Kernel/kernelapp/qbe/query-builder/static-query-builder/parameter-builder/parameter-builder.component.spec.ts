import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterBuilderComponent } from './parameter-builder.component';

describe('ParameterBuilderComponent', () => {
  let component: ParameterBuilderComponent;
  let fixture: ComponentFixture<ParameterBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
