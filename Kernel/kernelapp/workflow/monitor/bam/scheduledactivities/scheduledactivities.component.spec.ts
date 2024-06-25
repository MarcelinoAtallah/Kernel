import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledactivitiesComponent } from './scheduledactivities.component';

describe('ScheduledactivitiesComponent', () => {
  let component: ScheduledactivitiesComponent;
  let fixture: ComponentFixture<ScheduledactivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledactivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
