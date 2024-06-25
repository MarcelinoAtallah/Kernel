import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbyactivityComponent } from './logbyactivity.component';

describe('LogbyactivityComponent', () => {
  let component: LogbyactivityComponent;
  let fixture: ComponentFixture<LogbyactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogbyactivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbyactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
