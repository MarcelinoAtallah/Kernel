import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalsettingsComponent } from './internalsettings.component';

describe('InternalsettingsComponent', () => {
  let component: InternalsettingsComponent;
  let fixture: ComponentFixture<InternalsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalsettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
