import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VAgGridComponent } from './v-ag-grid.component';

describe('VAgGridComponent', () => {
  let component: VAgGridComponent;
  let fixture: ComponentFixture<VAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VAgGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
