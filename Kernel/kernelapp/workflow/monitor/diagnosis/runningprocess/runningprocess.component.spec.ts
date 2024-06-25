import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningprocessComponent } from './runningprocess.component';

describe('RunningprocessComponent', () => {
  let component: RunningprocessComponent;
  let fixture: ComponentFixture<RunningprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunningprocessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
