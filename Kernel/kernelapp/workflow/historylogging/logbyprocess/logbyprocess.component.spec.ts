import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbyprocessComponent } from './logbyprocess.component';

describe('LogbyprocessComponent', () => {
  let component: LogbyprocessComponent;
  let fixture: ComponentFixture<LogbyprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogbyprocessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbyprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
