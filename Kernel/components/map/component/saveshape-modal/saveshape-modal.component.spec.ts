import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveshapeModalComponent } from './saveshape-modal.component';

describe('SaveshapeModalComponent', () => {
  let component: SaveshapeModalComponent;
  let fixture: ComponentFixture<SaveshapeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveshapeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveshapeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
