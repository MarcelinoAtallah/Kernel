import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VTableComponent } from './v-table.component';

describe('VTableComponent', () => {
  let component: VTableComponent;
  let fixture: ComponentFixture<VTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
