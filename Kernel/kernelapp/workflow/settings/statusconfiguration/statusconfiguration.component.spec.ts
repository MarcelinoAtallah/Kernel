import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusconfigurationComponent } from './statusconfiguration.component';

describe('StatusconfigurationComponent', () => {
  let component: StatusconfigurationComponent;
  let fixture: ComponentFixture<StatusconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusconfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
