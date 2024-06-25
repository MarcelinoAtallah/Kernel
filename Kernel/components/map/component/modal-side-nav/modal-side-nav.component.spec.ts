import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSideNavComponent } from './modal-side-nav.component';

describe('ModalSideNavComponent', () => {
  let component: ModalSideNavComponent;
  let fixture: ComponentFixture<ModalSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSideNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
