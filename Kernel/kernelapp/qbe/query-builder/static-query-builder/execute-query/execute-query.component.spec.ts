import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteQueryComponent } from './execute-query.component';

describe('ExecuteQueryComponent', () => {
  let component: ExecuteQueryComponent;
  let fixture: ComponentFixture<ExecuteQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuteQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecuteQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
