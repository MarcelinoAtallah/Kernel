import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VQueryFormComponent } from './v-query-form.component';

describe('VQueryFormComponent', () => {
  let component: VQueryFormComponent;
  let fixture: ComponentFixture<VQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VQueryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
