import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VFileComponent } from './v-file.component';

describe('VFileComponent', () => {
  let component: VFileComponent;
  let fixture: ComponentFixture<VFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
