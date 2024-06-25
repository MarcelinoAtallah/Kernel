import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VDynamicSearchComponent } from './v-dynamic-search.component';

describe('VDynamicSearchComponent', () => {
  let component: VDynamicSearchComponent;
  let fixture: ComponentFixture<VDynamicSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VDynamicSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VDynamicSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
