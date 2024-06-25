import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersQueryComponent } from './headers-query.component';

describe('HeadersQueryComponent', () => {
  let component: HeadersQueryComponent;
  let fixture: ComponentFixture<HeadersQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadersQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadersQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
