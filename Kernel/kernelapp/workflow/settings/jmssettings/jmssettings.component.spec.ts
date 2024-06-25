import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JmssettingsComponent } from './jmssettings.component';

describe('JmssettingsComponent', () => {
  let component: JmssettingsComponent;
  let fixture: ComponentFixture<JmssettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JmssettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JmssettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
