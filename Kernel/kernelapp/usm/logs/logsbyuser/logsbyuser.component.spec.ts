import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsbyuserComponent } from './logsbyuser.component';

describe('LogsbyuserComponent', () => {
  let component: LogsbyuserComponent;
  let fixture: ComponentFixture<LogsbyuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogsbyuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsbyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
