import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQueryComponent } from './security-query.component';

describe('SecurityQueryComponent', () => {
  let component: SecurityQueryComponent;
  let fixture: ComponentFixture<SecurityQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
