import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VDropdownstaticComponent } from './v-dropdownstatic.component';

describe('VDropdownstaticComponent', () => {
  let component: VDropdownstaticComponent;
  let fixture: ComponentFixture<VDropdownstaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VDropdownstaticComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VDropdownstaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
