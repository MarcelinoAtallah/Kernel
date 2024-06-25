import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGeneratedQueryComponent } from './show-generated-query.component';

describe('ShowGeneratedQueryComponent', () => {
  let component: ShowGeneratedQueryComponent;
  let fixture: ComponentFixture<ShowGeneratedQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowGeneratedQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGeneratedQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
