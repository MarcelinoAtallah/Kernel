import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationEventComponent } from './application-event.component';

describe('ApplicationEventComponent', () => {
  let component: ApplicationEventComponent;
  let fixture: ComponentFixture<ApplicationEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
