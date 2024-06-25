import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBuilderPreviewComponent } from './grid-builder-preview.component';

describe('GridBuilderPreviewComponent', () => {
  let component: GridBuilderPreviewComponent;
  let fixture: ComponentFixture<GridBuilderPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridBuilderPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridBuilderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
