import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbeToolComponent } from './qbe-tool.component';

describe('QbeToolComponent', () => {
  let component: QbeToolComponent;
  let fixture: ComponentFixture<QbeToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbeToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
