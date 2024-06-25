import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbeComponent } from './qbe.component';

describe('QbeComponent', () => {
  let component: QbeComponent;
  let fixture: ComponentFixture<QbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
