import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchedactivitiesComponent } from './batchedactivities.component';

describe('BatchedactivitiesComponent', () => {
  let component: BatchedactivitiesComponent;
  let fixture: ComponentFixture<BatchedactivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchedactivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchedactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
