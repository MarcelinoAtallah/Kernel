import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossReferencingComponent } from './cross-referencing.component';

describe('CrossReferencingComponent', () => {
  let component: CrossReferencingComponent;
  let fixture: ComponentFixture<CrossReferencingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossReferencingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossReferencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
