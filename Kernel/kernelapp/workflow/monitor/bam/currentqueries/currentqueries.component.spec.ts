import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentqueriesComponent } from './currentqueries.component';

describe('CurrentqueriesComponent', () => {
  let component: CurrentqueriesComponent;
  let fixture: ComponentFixture<CurrentqueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentqueriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentqueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
