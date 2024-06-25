import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidprocessComponent } from './invalidprocess.component';

describe('InvalidprocessComponent', () => {
  let component: InvalidprocessComponent;
  let fixture: ComponentFixture<InvalidprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidprocessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
