import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfbuilderComponent } from './wfbuilder.component';

describe('WfbuilderComponent', () => {
  let component: WfbuilderComponent;
  let fixture: ComponentFixture<WfbuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WfbuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WfbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
