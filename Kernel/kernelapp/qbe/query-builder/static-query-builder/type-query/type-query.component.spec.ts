import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeQueryComponent } from './type-query.component';

describe('TypeQueryComponent', () => {
  let component: TypeQueryComponent;
  let fixture: ComponentFixture<TypeQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
