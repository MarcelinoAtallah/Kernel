import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicBuilderFormComponent } from './form.component';

describe('DynamicBuilderFormComponent', () => {
  let component: DynamicBuilderFormComponent;
  let fixture: ComponentFixture<DynamicBuilderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicBuilderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicBuilderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
