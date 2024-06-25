import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VQueryDetailsComponent } from './v-query-details.component';

describe('VQueryDetailsComponent', () => {
  let component: VQueryDetailsComponent;
  let fixture: ComponentFixture<VQueryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VQueryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VQueryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
