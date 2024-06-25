import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalEventComponent } from './external-event.component';

describe('ExternalEventComponent', () => {
  let component: ExternalEventComponent;
  let fixture: ComponentFixture<ExternalEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
