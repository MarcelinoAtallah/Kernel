import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUserQueryComponent } from './security-user-query.component';

describe('SecurityUserQueryComponent', () => {
  let component: SecurityUserQueryComponent;
  let fixture: ComponentFixture<SecurityUserQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityUserQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityUserQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
