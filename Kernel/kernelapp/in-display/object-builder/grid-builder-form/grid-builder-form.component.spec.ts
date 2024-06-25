import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBuilderFormComponent } from './grid-builder-form.component';

describe('GridBuilderFormComponent', () => {
  let component: GridBuilderFormComponent;
  let fixture: ComponentFixture<GridBuilderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridBuilderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridBuilderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
