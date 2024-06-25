import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastwfmComponent } from './lastwfm.component';

describe('LastwfmComponent', () => {
  let component: LastwfmComponent;
  let fixture: ComponentFixture<LastwfmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastwfmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastwfmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
