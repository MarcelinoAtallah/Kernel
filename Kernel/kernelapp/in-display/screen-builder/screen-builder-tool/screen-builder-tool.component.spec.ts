import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenBuilderToolComponent } from './screen-builder-tool.component';

describe('ScreenBuilderToolComponent', () => {
  let component: ScreenBuilderToolComponent;
  let fixture: ComponentFixture<ScreenBuilderToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenBuilderToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenBuilderToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
