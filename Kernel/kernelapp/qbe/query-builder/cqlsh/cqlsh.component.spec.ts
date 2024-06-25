import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CqlshComponent } from './cqlsh.component';

describe('CqlshComponent', () => {
  let component: CqlshComponent;
  let fixture: ComponentFixture<CqlshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CqlshComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CqlshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
