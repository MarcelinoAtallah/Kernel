import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnusedtriggerComponent } from './unusedtrigger.component';

describe('UnusedtriggerComponent', () => {
  let component: UnusedtriggerComponent;
  let fixture: ComponentFixture<UnusedtriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnusedtriggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusedtriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
