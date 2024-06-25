import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalhyperlinksComponent } from './externalhyperlinks.component';

describe('ExternalhyperlinksComponent', () => {
  let component: ExternalhyperlinksComponent;
  let fixture: ComponentFixture<ExternalhyperlinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalhyperlinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalhyperlinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
