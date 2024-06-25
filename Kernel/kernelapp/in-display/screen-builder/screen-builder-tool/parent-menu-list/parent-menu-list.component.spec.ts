import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMenuListComponent } from './parent-menu-list.component';

describe('ParentMenuListComponent', () => {
  let component: ParentMenuListComponent;
  let fixture: ComponentFixture<ParentMenuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentMenuListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
