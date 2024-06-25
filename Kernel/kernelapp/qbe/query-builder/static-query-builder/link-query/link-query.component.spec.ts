import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkQueryComponent } from './link-query.component';

describe('LinkQueryComponent', () => {
  let component: LinkQueryComponent;
  let fixture: ComponentFixture<LinkQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
